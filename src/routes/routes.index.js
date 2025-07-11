import { Router } from "express";

// Importing the test router
import testRouter from "./test.router.js";

// Importing the auth router
const routers = Router();

import recomsRouter from "./recoms.router.js";

routers.use("/api/v1/test", testRouter);
// 추천곡 관련 라우터
routers.use("/api/v1/recoms", recomsRouter);

export default routers;
