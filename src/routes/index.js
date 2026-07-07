import { Router } from 'express';


import authRoutes from './auth.routes.js';
import clientRoutes from './client.routes.js';
import projectRoutes from './project.routes.js';
import taskRoutes from './task.routes.js';
import leadRoutes from './lead.routes.js';


const router = Router();


router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/leads', leadRoutes);

export default router;