import { Router } from "express";

import { handleTest } from "../controllers/test.controller.js";

const router = Router();

router.post("/test", handleTest);

export default router;
