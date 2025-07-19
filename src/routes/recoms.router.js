import { Router } from "express";
import {
    handleAllTracks,
    handleSentRecomsSong,
    handleReceivedRecomsSong,
    handleSearchRecomSong,
} from "../controllers/recoms.controller.js";
import { authenticateAccessToken } from "../middlewares/authenticate.jwt.js";

const router = Router();

router.get("/search-song", handleAllTracks);
router.get("/:recomsId/sent", authenticateAccessToken, handleSentRecomsSong);
router.get("/:recomsId/received", authenticateAccessToken, handleReceivedRecomsSong);
router.get("/recoms/search/record", authenticateAccessToken, handleSearchRecomSong);

export default router;
