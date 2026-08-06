import { Router } from 'express';


import authRoutes from './auth.routes.js';
import clientRoutes from './client.routes.js';
import projectRoutes from './project.routes.js';
import taskRoutes from './task.routes.js';
import leadRoutes from './lead.routes.js';
import otpRoutes from './otp.routes.js';
import aiRoutes from './ai.routes.js';
import summaryRoutes from './summary.routes.js';

const router = Router();


router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/leads', leadRoutes);
router.use('/otp', otpRoutes);
router.use('/ai', aiRoutes);
router.use('/summary', summaryRoutes);

export default router;