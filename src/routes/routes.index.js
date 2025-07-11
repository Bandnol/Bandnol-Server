import { Router } from "express";

// Importing the test router
import testRouter from "./test.router.js";
import recomsRouter from "./recoms.router.js";

// Importing the auth router
const routers = Router();

routers.use("/api/v1/test", testRouter);
routers.use("/api/v1/recoms", recomsRouter);

export default routers;
