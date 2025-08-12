import { Router } from "express";
import { handleKakaoLogin, handleKakaoLogout, handleRefreshAccessToken, handleWithdraw } from "../controllers/oauth.controllers.js"

const router = Router();

router.post("/callback/kakao", handleKakaoLogin);
router.patch("/refresh/token", handleRefreshAccessToken);
router.post("/logout", handleKakaoLogout);
router.post("/withdraw", handleWithdraw);

export default router;