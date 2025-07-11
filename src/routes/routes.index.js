import { Router } from "express";

// Importing the test router
import testRouter from "./test.router.js";
import authRouter from "./oauth.router.js";

// Importing the auth router
const routers = Router();

routers.use("/api/v1/test", testRouter);
routers.use("/api/v1/oauth2", authRouter);

export default routers;
