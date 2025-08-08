import { Router } from "express";
import { handleViewRecomArtists, handlePostLikedArtists, handleViewArtists } from "../controllers/artists.controller.js";
import { authenticateAccessToken } from "../middlewares/authenticate.jwt.js";

const router = Router();

router.get("/recommended", handleViewRecomArtists);
router.post("/liked", authenticateAccessToken, handlePostLikedArtists);
router.get("/:artistId", authenticateAccessToken, handleViewArtists);

export default router;
