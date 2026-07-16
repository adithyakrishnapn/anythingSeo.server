import { Router } from 'express';
import validateLead from '../validations/lead.validations.js';
import * as leadController from '../controllers/lead.controller.js';
import { leadToCustomerValidation } from '../validations/lead.status.validation.js';

const router = Router();


router.get('/getleads', leadController.getLeads);
router.post('/create', validateLead, leadController.createLead);
router.put('/update/:id', leadToCustomerValidation, validateLead, leadController.updateLead);
router.get('/getlead/:id', leadController.getLeadbyId);
router.delete('/delete/:id', leadController.deleteLeadbyId);
router.put('/convert-to-customer/:id', leadToCustomerValidation, leadController.convertLeadToCustomer);
router.put('/add-activity/:id', leadController.addActivity);
router.put('/delete-activity/:id', leadController.deleteActivity);



export default router;
