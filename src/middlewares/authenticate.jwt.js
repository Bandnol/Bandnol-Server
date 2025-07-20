import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import { TokenError, UnauthorizedError } from "../errors.js";

dotenv.config();

const { JWT_SECRET } = process.env;

/**
 
Bearer 토큰을 추출하고 검증하는 미들웨어
로그인한 사용자만 접근 가능한 API에 사용*/
export const authenticateAccessToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Authorization 헤더가 없는 경우
    // 401 반환
    if (!authHeader) {
        next(new UnauthorizedError("Authorization 헤더가 제공되지 않았습니다."));
    }

    // Bearer Token인지 확인하기
    if (authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                console.log("JWT 토큰 검증 실패", {
                    action: "token:authenticate",
                    message: err.message,
                });

                if (err.name === "TokenExpiredError") {
                    next(new TokenError("만료된 토큰입니다."));
                } else if (err.name === "JsonWebTokenError") {
                    next(new TokenError("토큰이 올바르지 않습니다."));
                } else if (err.name === "NotBeforeError") {
                    next(new TokenError("아직 유효하지 않은 토큰입니다."));
                } else {
                    next(new TokenError("알 수 없는 JWT 에러가 발생했습니다."));
                }
                return;
            }

            // payload 안의 user_id를 암호화하여 전달했을 경우 복호화
            // user_id = parseInt(decrypt62(user_id));
            console.log("JWT 토큰 검증 성공", {
                action: "token:authenticate",
                actionType: "success",
                userId: user.id,
            });

            req.user = {
                id: user.id,
            }; // 검증된 사용자 정보를 요청 객체에 추가
            next();
        });
    } else {
        next(new UnauthorizedError("Authorization이 제공되지 않았습니다."));
    }
};
/**
 
로그인된 경우에만 사용자 권한을 검증하는 미들웨어
로그인한 사용자는 유저 정보를, 비로그인은 null 처리하는 API에 사용*/
export const autheticateAccessTokenIfExists = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        console.log("Authorization 헤더가 제공되지 않았습니다.");
        return next();
    }

    if (authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                console.log("JWT 토큰 검증 실패", {
                    action: "token:authenticate",
                    message: err.message,
                });

                // if (err.name === "TokenExpiredError") {
                //   return next();
                // } else if (err.name === "JsonWebTokenError") {
                //   return next();
                // } else if (err.name === "NotBeforeError") {
                //   return next();
                // } else {
                //   return next();
                // }

                req.user = {
                    id: null,
                };
                return next();
            }

            console.log("JWT 토큰 검증 성공", {
                action: "token:authenticate",
                actionType: "success",
                userId: user.id,
            });

            req.user = {
                id: user.id,
            }; // 검증된 사용자 정보를 요청 객체에 추가

            // 확인용
            console.log("Middleware -> req.user:", req.user);

            next();
        });
    } else {
        req.user = {
            id: null,
        };

        // 확인용
        console.log("Middleware -> req.user:", req.user);

        return next();
    }
};