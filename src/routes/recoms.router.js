import { Router } from "express";

import { handleAllTracks } from "../controllers/recoms.controller.js";

const router = Router();


router.get("/search-song", handleAllTracks);

export default router;