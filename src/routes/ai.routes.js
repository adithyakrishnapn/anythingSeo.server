import { Router } from "express";
import * as aiController from "../controllers/ai.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Existing Lead Agent routes
router.get("/analyze-lead/:leadId", aiController.analyzeLeadController);
router.post("/followup-lead/:id", aiController.followupLead);
router.post("/create-task/:leadId", aiController.createTaskForLeadController);
router.get("/summary", aiController.summaryController);

// Client AI Agent routes (protected)
router.post("/clients/:clientId/analyze", authMiddleware, aiController.analyzeClientController);
router.post("/clients/:clientId/meeting-summary", authMiddleware, aiController.meetingSummaryController);

// Task AI Agent routes (protected)
router.post("/tasks/prioritize", authMiddleware, aiController.prioritizeTasksController);
router.post("/tasks/daily-summary", authMiddleware, aiController.dailyTaskSummaryController);
router.post("/tasks/:taskId/analyze", authMiddleware, aiController.analyzeTaskController);

export default router;