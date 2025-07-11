import { Router } from "express";

import { handleRecomsSong } from "../controllers/recoms.controller.js";

const router = Router();

router.get("/:recomsId", handleRecomsSong);

export default router;
