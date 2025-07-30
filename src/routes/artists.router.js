import { Router } from "express";
import { handleViewRecomArtists, handlePostLikedArtists } from "../controllers/artists.controller.js";
import { authenticateAccessToken } from "../middlewares/authenticate.jwt.js";

const router = Router();

router.get("/recommended", handleViewRecomArtists);
router.post("/liked", authenticateAccessToken, handlePostLikedArtists);

export default router;
