import { Router } from "express";

const router = Router();

import * as aiController from "../controllers/ai.controller.js";


router.get("/analyze-lead/:leadId", aiController.analyzeLeadController);
router.post("/followup-lead/:id", aiController.followupLead);
router.post("/create-task/:leadId", aiController.createTaskForLeadController);
router.get("/summary", aiController.summaryController);

export default router;