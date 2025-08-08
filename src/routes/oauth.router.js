import { Router } from "express";
import { handleKakaoLogin, handleRefreshAccessToken } from "../controllers/oauth.controllers.js"

const router = Router();

router.post("/callback/kakao", handleKakaoLogin);
router.patch("/refresh/token", handleRefreshAccessToken);

export default router;