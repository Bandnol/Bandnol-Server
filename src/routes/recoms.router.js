import { Router } from "express";

import { handleAllTracks } from "../controllers/recoms.controller.js";
import { handleRecomsSong } from "../controllers/recoms.controller.js";
import { authenticateAccessToken } from "../middlewares/authenticate.jwt.js";

const router = Router();

router.get("/search-song", handleAllTracks);
router.get("/recoms/:recomsId", authenticateAccessToken, handleRecomsSong);

export default router;
