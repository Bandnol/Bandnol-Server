import { Router } from "express";
import {
    handleAllTracks,
    handleSentRecomsSong,
    handleReceivedRecomsSong,
    handleSearchRecomSong,
    handleAddRecoms,
    handleViewComments,
    handleModifyLikeStatus,
    handleViewReplies,
    handleAIComment,
    handleCalendarRecomSong,
    handleSendReplies,
    handleListRecomSong,
} from "../controllers/recoms.controller.js";
import { authenticateAccessToken } from "../middlewares/authenticate.jwt.js";

const router = Router();

router.get("/search/song", handleAllTracks);
router.get("/sent", authenticateAccessToken, handleSentRecomsSong);
router.get("/received", authenticateAccessToken, handleReceivedRecomsSong);
router.get("/search/record", authenticateAccessToken, handleSearchRecomSong);
router.post("/", authenticateAccessToken, handleAddRecoms);
router.get("/:recomsId/comments", authenticateAccessToken, handleViewComments);
router.patch("/:recomsId/likes", authenticateAccessToken, handleModifyLikeStatus);
router.get("/:recomsId/replies", authenticateAccessToken, handleViewReplies);
router.post("/ai-comment", authenticateAccessToken, handleAIComment);
router.get("/calendars", authenticateAccessToken, handleCalendarRecomSong);
router.post("/:recomsId/replies", authenticateAccessToken, handleSendReplies);
router.get("/lists", authenticateAccessToken, handleListRecomSong);

export default router;
