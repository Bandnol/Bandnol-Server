import { AlreadyInactiveError, AuthTokenError, NoUserError, TokenError } from "../errors.js";
import { generateToken } from "../utils/token.js";
import {
    findUserByToken,
    modifyUserStatus,
    getUserById,
} from "../repositories/users.repository.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import redisClient from "../utils/redis.js";
import { withdrawResponseDTO } from "../dtos/users.dto.js";
import { userSignup, userLogin } from "../services/users.service.js";

export const handleSignup = async (req, res, next) => {
     /*
    #swagger.tags = ["OAuth"]
    #swagger.summary = 'JWT 회원가입 API';
    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    };

    #swagger.responses[400] = {
        description: "잘못된 요청(빈 항목 / 날짜 형식 오류 등)",
        content: {
            "application/json": {
                schema: {
                    oneOf: [
                        { $ref: "#/components/responses/RequestBodyError" },
                        { $ref: "#/components/responses/InvalidDateTypeError" }
                    ]
                }
            }
        }
    }

    #swagger.responses[200] = {
        $ref: "#/components/responses/DupliacteUserError"
    };


    */
    try {
        const user = req.body;
        const newUser = await userSignup(user);
        res.status(StatusCodes.OK).success(newUser.id);
    }catch (err) {
        console.error("회원가입 실패", err);
        next(err);
    }
}

export const handleLogin = async (req, res, next) => {
    /*
    #swagger.tags = ["OAuth"]
    #swagger.summary = '카카오톡 소셜 로그인 API';
    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    };

    #swagger.responses[401] = {
      $ref: "#/components/responses/NoUserError"
    };

    #swagger.responses[403] = {
      $ref: "#/components/responses/AuthError"
    };
    */
    try {
        const { ownId, password } = req.body;
        const data = await userLogin(ownId, password);

        const user = data.user;
        const token = data.token;
        const refreshToken = data.refreshToken;

        res.status(StatusCodes.OK).success({ user, token, refreshToken });
    } catch (err) {
        console.error("Kakao 로그인 실패", err);
        next(err);
    }
};

export const handleRefreshAccessToken = async (req, res, next) => {
    /*
    #swagger.tags = ["OAuth"]
    #swagger.summary = 'AccessToken 재발급 API';
    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    };

    #swagger.responses[401] = {
      $ref: "#/components/responses/TokenError"
    };

    #swagger.responses[403] = {
      $ref: "#/components/responses/AuthError"
    };
    */

    const { refreshToken } = req.body;
    if (!refreshToken) throw new TokenError("리프레시 토큰이 전달되지 않았습니다");

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        console.log(decoded);
        const user = await findUserByToken(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            throw new AuthTokenError("유효하지 않은 토큰입니다");
        }

        const newAccessToken = generateToken({ id: user.id });

        await redisClient.set(`accessToken:user:${user.id}`, newAccessToken, { EX: 7 * 24 * 60 * 60 });

        res.status(StatusCodes.OK).success({ token: newAccessToken });
    } catch (err) {
        throw new TokenError(`알 수 없는 오류가 발생했습니다: ${err}`)
    }
};

export const handleKakaoLogout = async (req, res, next) => {
    /*
    #swagger.tags = ["OAuth"]
    #swagger.summary = '카카오톡 소셜 로그아웃 API';
    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    };

    #swagger.responses[401] = {
        $ref: "#/components/responses/TokenError"
    };
   */

    try {
        const { accessToken } = req.body;
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        const user = await findUserByToken(decoded.id);
        if (!user) {
            throw new TokenError("유효하지 않은 토큰입니다!");
        }

        await redisClient.del(`accessToken:user:${user.id}`);
        await redisClient.del(`refreshToken:user:${user.id}`);

        res.status(StatusCodes.OK).success({ message: "로그아웃 성공!" });
    } catch (err) {
       throw new TokenError (`유효하지 않은 토큰입니다: ${err}`);
    }
};

export const handleWithdraw = async (req, res, next) => {
    /*
    #swagger.tags = ["OAuth"]
    #swagger.summary = '카카오톡 회원탈퇴 API';
    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    };

    #swagger.responses[401] = {
        $ref: "#/components/responses/TokenError"
    };

    #swagger.responses[404] = {
        $ref: "#/components/responses/NoUserError"
    };

    #swagger.responses[409] = {
        $ref: "#/components/responses/AlreadyInactiveError"
    };
   */

    try {
        const { accessToken } = req.body;
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        const user = await findUserByToken(decoded.id);
        if (!user) {
            throw new TokenError("유효하지 않은 토큰입니다.");
        }

        await redisClient.del(`accessToken:user:${user.id}`);
        await redisClient.del(`refreshToken:user:${user.id}`);

        const existUser = await getUserById(user.id);
        if (!existUser) {
            throw new NoUserError("존재하지 않는 사용자 ID입니다.");
        }

        if (existUser.inactiveStatus == true) {
            throw new AlreadyInactiveError("이미 비활성화 상태인 사용자입니다.");
        }
        const data = await modifyUserStatus(user.id, true);

        res.status(StatusCodes.OK).success(withdrawResponseDTO(data));
    } catch (err) {
        next(err);
    }
};
