import { Router } from 'express';
import * as ProjectController from "../controllers/project.controller.js";
import { projectCompleted } from '../middlewares/validateProjectStatus.middleware.js';

const router = Router();


router.post('/create-project', ProjectController.createProjectController);
router.get('/get-projects', ProjectController.getProjectsController);
router.get('/get-project/:id', ProjectController.getProjectByIdController);
router.put('/update-project/:id', projectCompleted, ProjectController.updateProjectByIdController);
router.delete('/delete-project/:id', ProjectController.deleteProjectByIdController);
router.put('/change-status/:id', projectCompleted, ProjectController.changeProjectStatusController);
router.get('/get-projects-by-client/:clientId', ProjectController.getProjectsByClientIdController);


export default router;