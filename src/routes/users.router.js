import { Router } from "express";
import {
    handleCheckOwnId,
    handleModifyUserInfo,
    handleInquiry,
    handleViewNotification,
    handleViewMyPage,
    handleModifyMypage
} from "../controllers/users.controller.js";
import { authenticateAccessToken } from "../middlewares/authenticate.jwt.js";
import { uploadMyPageImages } from "../middlewares/image.uploader.js";

const router = Router();

router.get("/check-ownId", authenticateAccessToken, handleCheckOwnId);
router.patch("/me/profiles", authenticateAccessToken, handleModifyUserInfo);
router.get("/me/notification", authenticateAccessToken, handleViewNotification);
router.post("/inquiry", handleInquiry);
router.get("/:ownId", authenticateAccessToken, handleViewMyPage);
router.patch("/me", authenticateAccessToken, uploadMyPageImages, handleModifyMypage);

export default router;
