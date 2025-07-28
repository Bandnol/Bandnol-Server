import dotenv from "dotenv";
import pkg from '@prisma/client';
const { SocialType, Gender } = pkg;
import axios from "axios";

dotenv.config();

export const getKakaoToken = async (code) => {
  const response = await axios.post(
    "https://kauth.kakao.com/oauth/token",
    new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.KAKAO_TEST_API_KEY,
      redirect_uri: `${process.env.API_URL}/api/v1/oauth2/callback/kakao`,
      code,
    }),
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }
  );

  return response.data.access_token;
};

export const getKakaoUser = async (accessToken) => {
  const response = await axios.get("https://kapi.kakao.com/v2/user/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
    },
  });
  console.log(response.data);

  return response.data;
};