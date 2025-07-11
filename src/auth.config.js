import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { NotFoundUserEmail } from "./errors.js";
import { prisma } from "./db.config.js"
import { generateToken } from "./utils/token.js";
import { SocialType } from '@prisma/client';

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

const socialVerify = async (profile, type) => {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return NotFoundUserEmail("해당 이메일을 찾을 수 없습니다.");
    }

    let user = await prisma.user.findFirst({ where: { email } });
    let fullName = `${profile.name.familyName}${profile.name.givenName}`;

    // 신규
    if (!user) {
      user = await prisma.user.create({
        data: { name: fullName, email, socialType: type },
      });
    }

    const token = generateToken({ id: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        name: fullName,
        email: user.email,
        socialType: user.socialType,
      },
    };

  } catch (err) {
    console.error("Social verify failed:", err);
    throw err;
  }
};