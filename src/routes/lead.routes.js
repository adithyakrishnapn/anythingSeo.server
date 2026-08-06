import { Router } from 'express';
import validateLead from '../middlewares/validateLead.middleware.js';
import * as leadController from '../controllers/lead.controller.js';
import { leadToCustomerValidation } from '../validations/lead.status.validation.js';
import * as LeadAnalysisController from '../controllers/leadAiAnalysis.controller.js';

const router = Router();


router.get('/getleads', leadController.getLeads);
router.post('/create', validateLead, leadController.createLead);
router.put('/update/:id', leadToCustomerValidation, validateLead, leadController.updateLead);
router.get('/getlead/:id', leadController.getLeadbyId);
router.delete('/delete/:id', leadController.deleteLeadbyId);
router.put('/convert-to-customer/:id', leadToCustomerValidation, leadController.convertLeadToCustomer);
router.put('/add-activity/:id', leadController.addActivity);
router.put('/delete-activity/:id', leadController.deleteActivity);



router.get('/priorities', LeadAnalysisController.getPrioritiesController);
router.get('/analysis/:leadId', LeadAnalysisController.getleadAnalysisController);
router.post('/generate-analysis/:leadId', LeadAnalysisController.createLeadAnalysisController);

export default router;
