/**
 * Application Tracker Controller
 * Handles application status updates (SAVED, PREPARING, APPLIED, INTERVIEW, COMPLETED)
 * and Kanban board persistence.
 */

import { PrismaClient } from '@prisma/client';
import { processOpportunityForStudent } from '../services/recommendationService.js';

const prisma = new PrismaClient();

export async function getApplications(req, res) {
  try {
    let student = req.user;
    if (!student) {
      student = await prisma.student.findFirst();
    }
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const applications = await prisma.application.findMany({
      where: { studentId: student.id },
      include: { opportunity: true },
      orderBy: { updatedAt: 'desc' }
    });

    const enriched = applications.map(app => {
      const processed = processOpportunityForStudent(student, app.opportunity);
      return {
        id: app.id,
        opportunityId: app.opportunityId,
        status: app.status,
        notes: app.notes,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        opportunity: app.opportunity,
        eligibility: processed.eligibility,
        matchScore: processed.matchScore,
        readiness: processed.readiness,
        priority: processed.priority,
        skillGap: processed.skillGap,
        daysRemaining: processed.daysRemaining
      };
    });

    return res.json(enriched);
  } catch (error) {
    console.error('getApplications Error:', error);
    return res.status(500).json({ error: 'Failed to fetch applications' });
  }
}

export async function updateApplicationStatus(req, res) {
  try {
    let student = req.user;
    if (!student) {
      student = await prisma.student.findFirst();
    }
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const { opportunityId, status, notes } = req.body;
    if (!opportunityId || !status) {
      return res.status(400).json({ error: 'opportunityId and status are required' });
    }

    let application = await prisma.application.findFirst({
      where: { studentId: student.id, opportunityId }
    });

    if (application) {
      application = await prisma.application.update({
        where: { id: application.id },
        data: {
          status,
          notes: notes !== undefined ? notes : application.notes
        },
        include: { opportunity: true }
      });
    } else {
      application = await prisma.application.create({
        data: {
          studentId: student.id,
          opportunityId,
          status,
          notes: notes || ''
        },
        include: { opportunity: true }
      });
    }

    return res.json({ success: true, application });
  } catch (error) {
    console.error('updateApplicationStatus Error:', error);
    return res.status(500).json({ error: 'Failed to update application status' });
  }
}
