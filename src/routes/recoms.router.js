import { Router } from "express";

import { handleAllTracks } from "../controllers/recoms.controller.js";
import { handleRecomsSong } from "../controllers/recoms.controller.js";

const router = Router();

router.get("/search-song", handleAllTracks);
router.get("/:recomsId", handleRecomsSong);

export default router;