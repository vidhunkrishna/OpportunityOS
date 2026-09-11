/**
 * Opportunity Controller
 * Serves recommended opportunities, full discover listings, and detailed match analytics.
 */

import { PrismaClient } from '@prisma/client';
import { rankOpportunitiesForStudent, processOpportunityForStudent } from '../services/recommendationService.js';

const prisma = new PrismaClient();

export async function getRecommendedOpportunities(req, res) {
  try {
    let student = req.user;
    if (!student) {
      student = await prisma.student.findFirst();
    }
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const opportunities = await prisma.opportunity.findMany();
    const ranked = rankOpportunitiesForStudent(student, opportunities);

    // Identify Priority items (🔥 PRIORITY)
    const priorityItems = ranked.recommended.filter(item => item.priority.bucket === 'PRIORITY');
    const thisWeekItems = ranked.recommended.filter(item => item.priority.bucket === 'THIS_WEEK');

    // Primary top recommendation
    const topMatch = ranked.recommended[0] || null;

    return res.json({
      studentSummary: {
        name: student.name,
        branch: student.branch,
        academicYear: student.academicYear,
        goal: JSON.parse(student.careerGoalsJson || '[]')[0] || 'Software Engineer'
      },
      topMatch,
      priorityItems,
      thisWeekItems,
      recommended: ranked.recommended,
      ineligible: ranked.ineligible,
      totalCount: opportunities.length
    });
  } catch (error) {
    console.error('getRecommendedOpportunities Error:', error);
    return res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
}

export async function getAllOpportunities(req, res) {
  try {
    let student = req.user;
    if (!student) {
      student = await prisma.student.findFirst();
    }
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const { category, mode, search } = req.query;

    let opportunities = await prisma.opportunity.findMany();

    if (category && category !== 'All') {
      opportunities = opportunities.filter(o => o.category.toLowerCase() === category.toLowerCase());
    }
    if (mode && mode !== 'All') {
      opportunities = opportunities.filter(o => o.mode.toLowerCase() === mode.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      opportunities = opportunities.filter(o => 
        o.title.toLowerCase().includes(q) || 
        o.organization.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q)
      );
    }

    const ranked = rankOpportunitiesForStudent(student, opportunities);

    return res.json({
      eligible: ranked.recommended,
      ineligible: ranked.ineligible,
      all: ranked.all
    });
  } catch (error) {
    console.error('getAllOpportunities Error:', error);
    return res.status(500).json({ error: 'Failed to fetch opportunities' });
  }
}

export async function getOpportunityById(req, res) {
  try {
    const { id } = req.params;
    let student = req.user;
    if (!student) {
      student = await prisma.student.findFirst();
    }
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const opportunity = await prisma.opportunity.findUnique({
      where: { id }
    });

    if (!opportunity) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }

    const processed = processOpportunityForStudent(student, opportunity);

    // Fetch student's application status if any
    const application = await prisma.application.findFirst({
      where: { studentId: student.id, opportunityId: opportunity.id }
    });

    // Fetch preparation plan if any
    const prepPlan = await prisma.preparationPlan.findFirst({
      where: { studentId: student.id, opportunityId: opportunity.id },
      include: { tasks: { orderBy: { day: 'asc' } } }
    });

    return res.json({
      ...processed,
      applicationStatus: application ? application.status : null,
      preparationPlan: prepPlan || null
    });
  } catch (error) {
    console.error('getOpportunityById Error:', error);
    return res.status(500).json({ error: 'Failed to fetch opportunity detail' });
  }
}
