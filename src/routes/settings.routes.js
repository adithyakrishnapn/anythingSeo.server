import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller.js';

const router = Router();

router.get('/', settingsController.getSettings);
router.put('/email', settingsController.updateEmailConfig);
router.put('/ai', settingsController.updateAiConfig);
router.delete('/email', settingsController.deleteEmailConfig);
router.delete('/ai', settingsController.deleteAiConfig);

export default router;
