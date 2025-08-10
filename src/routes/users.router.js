import { Router } from "express";
import {
    handleCheckOwnId,
    handleModifyUserInfo,
    handleInquiry,
    handleViewNotification,
    handleViewMyPage,
    handleSaveExpoToken,
} from "../controllers/users.controller.js";
import { authenticateAccessToken } from "../middlewares/authenticate.jwt.js";

const router = Router();

router.get("/check-ownId", authenticateAccessToken, handleCheckOwnId);
router.patch("/me/profiles", authenticateAccessToken, handleModifyUserInfo);
router.get("/me/notification", authenticateAccessToken, handleViewNotification);
router.post("/inquiry", handleInquiry);
router.get("/:ownId", authenticateAccessToken, handleViewMyPage);
router.post("/expo-token", authenticateAccessToken, handleSaveExpoToken);

export default router;
