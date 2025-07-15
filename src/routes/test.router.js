import { Router } from "express";

import { handleTest } from "../controllers/test.controller.js";
import { authenticateAccessToken } from "../middlewares/authenticate.jwt.js";
import { generateToken } from "../utils/token.js";

const router = Router();

router.post("/test", handleTest);

// 토큰 테스트용
// 토큰 발급
router.get("/short-access-token", (req, res) => {
    res.status(200).json({
        token: generateToken({ userId: req.body.userId }),
    });
});

// 토큰 사용
router.get("/get-user-info", authenticateAccessToken, (req, res) => {
    return res.status(200).success({
        user: req.user,
    });
});

export default router;
