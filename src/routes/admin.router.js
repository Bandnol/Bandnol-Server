import { Router } from "express";
import { handleAdminSendNotifications } from "../controllers/admin.controller.js";

const router = Router();

router.post("/notification", handleAdminSendNotifications);

export default router;
