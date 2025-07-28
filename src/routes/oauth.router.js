import { Router } from "express";
import { handleKakaoLogin } from "../controllers/oauth.controllers.js"

const router = Router();

router.get("/callback/kakao", handleKakaoLogin);

export default router;
