import express from "express";
import { searchRecomSong } from "../controllers/recoms.controller.js";

const router = express.Router();

// GET /api/v1/recoms/search/song
router.get("/search/song", searchRecomSong);

export default router;
