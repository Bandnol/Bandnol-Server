import { Router } from "express";
import { requireSignedApiKey } from "../middlewares/require.signed.api.key.js";
import { adminLimiter } from "../middlewares/rate.limit.js";

// Importing the test router
import authRouter from "./oauth.router.js";
import recomsRouter from "./recoms.router.js";
import usersRouter from "./users.router.js";
import artistsRouter from "./artists.router.js";
import adminRouter from "./admin.router.js";

// Importing the auth router
const routers = Router();

routers.use("/api/v2/oauth2", authRouter);
routers.use("/api/v1/recoms", recomsRouter);
routers.use("/api/v1/users", usersRouter);
routers.use("/api/v1/artists", artistsRouter);
routers.use("/api/v1/admin", adminLimiter, requireSignedApiKey, adminRouter);

export default routers;
