import { Router } from "express";
import {
    handleAllTracks,
    handleSentRecomsSong,
    handleReceivedRecomsSong,
    searchRecomSong,
    handleViewComments,
} from "../controllers/recoms.controller.js";
import { authenticateAccessToken } from "../middlewares/authenticate.jwt.js";

const router = Router();

router.get("/recoms/search/song", handleAllTracks);
router.get("/:recomsId/sent", authenticateAccessToken, handleSentRecomsSong);
router.get("/:recomsId/received", authenticateAccessToken, handleReceivedRecomsSong);
router.get("/recoms/search/record", authenticateAccessToken, searchRecomSong);
router.get("/recoms/:recomsId/comments", authenticateAccessToken, handleViewComments);

export default router;
