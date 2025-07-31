import { Router } from "express";
import { handleKakaoLogin } from "../controllers/oauth.controllers.js"

const router = Router();

router.post("/callback/kakao", handleKakaoLogin);

export default router;
