/**
 * OpportunityOS API Router
 */

import express from 'express';
import { getStudentProfile, updateStudentProfile } from '../controllers/studentController.js';
import { getRecommendedOpportunities, getAllOpportunities, getOpportunityById } from '../controllers/opportunityController.js';
import { getApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { generatePlan, toggleTask, getStudentPlans } from '../controllers/preparationController.js';
import { askAI } from '../controllers/aiController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Optional/Soft authentication helper to extract req.user if token is passed
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.headers['x-auth-token'];
  if (!token) return next();
  return authenticateToken(req, res, next);
}

// Student Profile
router.get('/student/profile', optionalAuth, getStudentProfile);
router.put('/student/profile', optionalAuth, updateStudentProfile);

// Opportunities
router.get('/opportunities/recommended', optionalAuth, getRecommendedOpportunities);
router.get('/opportunities/discover', optionalAuth, getAllOpportunities);
router.get('/opportunities/:id', optionalAuth, getOpportunityById);

// Applications
router.get('/applications', optionalAuth, getApplications);
router.post('/applications/status', optionalAuth, updateApplicationStatus);

// Preparation Plans
router.get('/preparation/plans', optionalAuth, getStudentPlans);
router.post('/preparation/generate', optionalAuth, generatePlan);
router.post('/preparation/task/:taskId/toggle', optionalAuth, toggleTask);

// AI Assistant
router.post('/ai/ask', optionalAuth, askAI);

export default router;
