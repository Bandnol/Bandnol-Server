import { Router } from "express";
import {
    handleAllTracks,
    handleSentRecomsSong,
    handleReceivedRecomsSong,
    searchRecomSong,
    handleAddRecoms,
    handleViewComments,
    handleModifyLikeStatus,
    handleViewReplies,
} from "../controllers/recoms.controller.js";
import { authenticateAccessToken } from "../middlewares/authenticate.jwt.js";

const router = Router();

router.get("/search/song", handleAllTracks);
router.get("/:recomsId/sent", authenticateAccessToken, handleSentRecomsSong);
router.get("/:recomsId/received", authenticateAccessToken, handleReceivedRecomsSong);
router.get("/search/record", authenticateAccessToken, searchRecomSong);
router.post("/",authenticateAccessToken, handleAddRecoms);
router.get("/:recomsId/comments", authenticateAccessToken, handleViewComments);
router.patch("/:recomsId/likes", authenticateAccessToken, handleModifyLikeStatus);
router.get("/:recomsId/replies", authenticateAccessToken, handleViewReplies);

export default router;
