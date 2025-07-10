import { Router } from "express";

// Importing the test router
import testRouter from "./test.router.js";

// Importing the auth router
const routers = Router();

routers.use("/api/v1/test", testRouter);

export default routers;
