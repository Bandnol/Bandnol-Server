import { Router } from "express";
import { handleSignup, handleWithdraw } from "../controllers/oauth.controllers.js"

const router = Router();

router.post("/signup", handleSignup);
//router.post("/login", handleLogin);
//router.post("/logout", handleLogout);
router.post("/withdraw", handleWithdraw);

export default router;