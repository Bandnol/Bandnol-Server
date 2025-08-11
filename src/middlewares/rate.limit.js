import { rateLimit } from "express-rate-limit";

// 1분에 10번 요청 제한
export const adminLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
});
