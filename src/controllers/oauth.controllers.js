import { AuthTokenError, TokenError } from "../errors.js";
import { generateRefreshToken, generateToken } from "../utils/token.js";
import { getKakaoUser } from "../configs/auth.config.js"
import { findOrCreateUser, findUserByToken } from "../repositories/users.repository.js"
import { updateUserRefreshToken } from "../repositories/users.repository.js";
import pkg from '@prisma/client';
import { StatusCodes } from "http-status-codes";
const { SocialType } = pkg;
import jwt from 'jsonwebtoken';


export const handleKakaoLogin = async (req, res, next) => {
    /*
    #swagger.summary = '카카오톡 소셜 로그인 API';
    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    };

    #swagger.responses[401] = {
      $ref: "#/components/responses/TokenError"
    };
    */
   try{
    const { id_token } = req.body;

    if (!id_token) {
      throw new TokenError("토큰이 전달되지 않았습니다");
    }

    const kakaoUser = await getKakaoUser(id_token);

    const email = kakaoUser.email;
    const name = kakaoUser.nickname;

    const user = await findOrCreateUser(name, email, SocialType.KAKAO);

    const token = generateToken({id: user.id});
    const refreshToken = generateRefreshToken({id : user.id})

    await updateUserRefreshToken(user.id, refreshToken);

    res.status(StatusCodes.OK).success({token,refreshToken, user});
   } catch (err) {
    console.error("Kakao 로그인 실패", err);
    res.status(500).json({ code: 500, message: `카카오 로그인 실패 ${err}` });
  }
}

export const handleRefreshAccessToken = async (req, res) => {
   /*
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
    res.status(200).json({ token: newAccessToken });
  } catch (err) {
    res.status(500).json({ code: 500, message: `AccessToken 재발급 실패 ${err}` });
  }
};