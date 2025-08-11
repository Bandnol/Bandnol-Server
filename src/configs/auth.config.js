import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa"; 
import { TokenError } from "../errors.js";

export const getKakaoUser = async (idToken) => {
  const client = jwksClient({
    jwksUri: "https://kauth.kakao.com/.well-known/jwks.json"
  });

  const decodedHeader = jwt.decode(idToken, { complete: true });
  if (!decodedHeader || !decodedHeader.header) {
    throw new TokenError("잘못된 토큰 형식입니다.");
  }
  const kid = decodedHeader.header.kid;

  const key = await client.getSigningKey(kid);
  const publicKey = key.getPublicKey();

  const payload = jwt.verify(idToken, publicKey, {
    audience: process.env.KAKAO_NATIVE_APP_KEY,
    issuer: "https://kauth.kakao.com",
  });

  return payload; 
};