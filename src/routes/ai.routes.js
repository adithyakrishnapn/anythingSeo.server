import { Router } from "express";

const router = Router();

import * as aiController from "../controllers/ai.controller.js";


router.get("/analyze-lead/:leadId", aiController.analyzeLeadController);
router.post("/followup-lead/:id", aiController.followupLead);

export default router;