import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
const router = Router();
import { authMiddleware } from '../middlewares/auth.middleware.js';


router.post('/login', authController.loginController);
router.post('/signup', authController.signupController);
router.post('/logout', authController.logoutController);
router.get('/me', authMiddleware, authController.meController);
// router.post('/refresh');




export default router;