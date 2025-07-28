import { Router } from "express";
import { handleViewRecomArtists } from "../controllers/artists.controller.js";
import { authenticateAccessToken } from "../middlewares/authenticate.jwt.js";

const router = Router();

router.get("/recommended", handleViewRecomArtists);

export default router;
