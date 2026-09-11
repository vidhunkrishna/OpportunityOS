import express from 'express';
import { 
  getAllOpportunitiesAdmin, 
  createOpportunityAdmin, 
  updateOpportunityAdmin, 
  deleteOpportunityAdmin 
} from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication + ADMIN role check to all admin routes
router.use(authenticateToken);
router.use(requireRole('ADMIN'));

router.get('/opportunities', getAllOpportunitiesAdmin);
router.post('/opportunities', createOpportunityAdmin);
router.put('/opportunities/:id', updateOpportunityAdmin);
router.delete('/opportunities/:id', deleteOpportunityAdmin);

export default router;
