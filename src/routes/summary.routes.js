import { Router } from 'express';
import * as summaryController from '../controllers/summary.controller.js';

const router = Router();


router.post('/generateleadsummary', summaryController.generateSummary);
router.get('/downloadsummarypdf/:id', summaryController.downloadSummaryPDF);
router.get('/downloadlatestsummarypdf', summaryController.downlaodLatestSummaryPDF);

export default router;