import { Router } from "express";

// Importing the test router
import testRouter from "./test.router.js";
import authRouter from "./oauth.router.js";
import recomsRouter from "./recoms.router.js"

// Importing the auth router
const routers = Router();

routers.use("/api/v1/test", testRouter);

routers.use("/api/v1/oauth2", authRouter);
routers.use("/api/v1", recomsRouter);
routers.use("/api/v1/recoms", recomsRouter);

export default routers;