import { Router } from "express";
import { handleSignup, handleLogin, handleLogout, handleWithdraw, handleRefreshAccessToken } from "../controllers/oauth.controllers.js"

const router = Router();

router.post("/signup", handleSignup);
router.post("/login", handleLogin);
router.post("/refreshToken",handleRefreshAccessToken);
router.post("/logout", handleLogout);
router.post("/withdraw", handleWithdraw);

export default router;