import { Router } from 'express';


import authRoutes from './auth.routes.js';
import clientRoutes from './client.routes.js';
import projectRoutes from './project.routes.js';
import taskRoutes from './task.routes.js';
import leadRoutes from './lead.routes.js';
import otpRoutes from './otp.routes.js';
import aiRoutes from './ai.routes.js';
import summaryRoutes from './summary.routes.js';
import settingsRoutes from './settings.routes.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();


router.use('/auth', authRoutes);
router.use('/otp', otpRoutes);

// Protected routes
router.use('/clients', authMiddleware, clientRoutes);
router.use('/projects', authMiddleware, projectRoutes);
router.use('/tasks', authMiddleware, taskRoutes);
router.use('/leads', authMiddleware, leadRoutes);
router.use('/ai', authMiddleware, aiRoutes);
router.use('/summary', authMiddleware, summaryRoutes);
router.use('/settings', authMiddleware, settingsRoutes);

export default router;