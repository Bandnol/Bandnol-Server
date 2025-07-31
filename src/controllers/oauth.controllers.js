import { AuthorizationCodeError, TokenError } from "../errors.js";
import { generateToken } from "../utils/token.js";
import { getKakaoUser } from "../configs/auth.config.js"
import { findOrCreateUser } from "../repositories/users.repository.js"
import pkg from '@prisma/client';
import { StatusCodes } from "http-status-codes";
const { SocialType } = pkg;

export const handleKakaoLogin = async (req, res, next) => {
    /*
    #swagger.summary = '카카오톡 소셜 로그인 API';
    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
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

    res.status(StatusCodes.OK).success({token, user});
   } catch (err) {
    console.error("Kakao 로그인 실패", err);
    res.status(500).json({ message: "Kakao 로그인 실패" });
  }
}