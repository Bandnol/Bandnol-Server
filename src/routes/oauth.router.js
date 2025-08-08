import { Router } from "express";
import { handleKakaoLogin, handleKakaoLogout, handleRefreshAccessToken } from "../controllers/oauth.controllers.js"

const router = Router();

router.post("/callback/kakao", handleKakaoLogin);
router.patch("/refresh/token", handleRefreshAccessToken);
router.post("/logout", handleKakaoLogout);

export default router;