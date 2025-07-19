import { Router } from "express";
import { handleCheckOwnId } from "../controllers/users.controller.js";
import { authenticateAccessToken } from "../middlewares/authenticate.jwt.js";

const router = Router();

router.get("/check-ownId", authenticateAccessToken, handleCheckOwnId);

export default router;

