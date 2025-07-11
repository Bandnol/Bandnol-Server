import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as NaverStrategy } from 'passport-naver-v2';
import { NotFoundUserEmail } from "./errors.js";
import { prisma } from "./db.config.js"
import { generateToken } from "./utils/token.js";
import { SocialType, Gender } from '@prisma/client';

dotenv.config();

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/v1/oauth2/callback/google",
    scope: ["email", "profile"], 
    state: true,
  },
  (accessToken, refreshToken, profile, cb) => {
    return socialVerify(profile, SocialType.GOOGLE)
      .then((user) => cb(null, user))
      .catch((err) => cb(err));
  }
);

export const naverStrategy = new NaverStrategy(
    {
        clientID: process.env.NAVER_CLIENT_ID,
        clientSecret: process.env.NAVER_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/api/v1/oauth2/callback/naver",
        scope: ["name", "email", "gender", "birthyear", "birthday"],
        state: true,
    },
    (accessToken, refreshToken, profile, cb)=>{
        return socialVerify(profile, SocialType.NAVER)
            .then((user) => cb(null, user))
            .catch((err) => cb(err));        
    }
);

const socialVerify = async (profile, type) => {
  try {
    let email, name, rawGender = null, birthyear = null, birthday = null, fullBirth = null, gender = null;

    if (type === SocialType.GOOGLE) {
      email = profile.emails?.[0]?.value;
      name = `${profile.name?.familyName ?? ''}${profile.name?.givenName ?? ''}`;
    }

    else if (type === SocialType.NAVER) {
      const response = profile._json.response;
      email = response?.email;
      name = response?.name;
      rawGender = response?.gender;
      birthyear = response?.birthyear;
      birthday = response?.birthday;

      gender = rawGender === "M" ? Gender.MAN
                   : rawGender === "F" ? Gender.WOMAN : null;
      console.log("🧬 rawGender:", rawGender);
console.log("🎯 변환된 gender(enum):", gender);
      if (birthyear && birthday) {
        fullBirth = `${birthyear}-${birthday}`;  
      }
    }

    else if (type === SocialType.KAKAO) {
      email = profile._json?.kakao_account?.email;
      name = profile.username;
    }

    else {
      throw new Error(`${type}은 지원하지 않는 소셜 로그인입니다.`);
    }

    if (!email) {
      throw new NotFoundUserEmail("해당 이메일을 찾을 수 없습니다.");
    }

    let user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: name,
          email: email,
          socialType: type,
          gender: gender,
          birth: fullBirth ? new Date(fullBirth) : null
        },
      });
    }

    const token = generateToken({ id: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        socialType: user.socialType,
        ...(type === SocialType.NAVER && {
          gender: user.gender,
          birth: user.birth ? user.birth.toISOString().slice(0, 10) : null,
        }),
      },
    };

  } catch (err) {
    console.error("Social verify failed:", err);
    throw err;
  }
};