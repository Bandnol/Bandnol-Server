import { Router } from "express";
import { handleCheckOwnId, handleModifyUserInfo, handleInquiry, handleViewNotification } from "../controllers/users.controller.js";
import { authenticateAccessToken } from "../middlewares/authenticate.jwt.js";

const router = Router();

router.get("/check-ownId", authenticateAccessToken, handleCheckOwnId);
router.patch("/me/profiles", authenticateAccessToken, handleModifyUserInfo);
router.post("/inquiry", handleInquiry);
router.get("/me/notification", authenticateAccessToken, handleViewNotification);

export default router;
