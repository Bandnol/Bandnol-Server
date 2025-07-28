import { AuthorizationCodeError } from "../errors.js";
import { generateToken } from "../utils/token.js";
import { getKakaoToken, getKakaoUser } from "../configs/auth.config.js"
import { findOrCreateUser } from "../repositories/users.repository.js"
import pkg from '@prisma/client';
const { SocialType, Gender } = pkg;

export const handleKakaoLogin = async (req, res, next) => {
    /*
    #swagger.summary = '카카오톡 소셜 로그인 API';
    #swagger.responses[200] = {
        $ref: "#/components/responses/Success"
    };
    */
   try{
    const { code } = req.query;

    const accessToken = await getKakaoToken(code);
    const kakaoUser = await getKakaoUser(accessToken);
    const email = kakaoUser.kakao_account?.email;
    const name = kakaoUser.kakao_account?.name;

    const user = await findOrCreateUser(name, email, SocialType.KAKAO);

    const token = generateToken({id: user.id});
    res.json({ token, user });
   } catch (err) {
    console.error("Kakao 로그인 실패", err);
    res.status(500).json({ message: "Kakao 로그인 실패" });
  }
}

