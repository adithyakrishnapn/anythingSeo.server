import { Router } from 'express';
import * as clientController from '../controllers/client.controller.js';

const router = Router();


router.post('/create-client', clientController.createClient);
router.put('/update-client/:id', clientController.updateClient);
router.get('/get-clients', clientController.getClients);
router.get('/get-client/:id', clientController.getClientById);
router.delete('/delete-client/:id', clientController.deleteClient);
router.post('/add-activity-to-client/:id', clientController.addActivityToClient);
router.delete('/delete-activity-from-client/:id', clientController.deleteActivityFromClient);
router.get('/get-client-name-and-id', clientController.getClientNameandId);

export default router;