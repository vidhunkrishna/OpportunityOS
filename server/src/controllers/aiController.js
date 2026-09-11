/**
 * AI Assistant Controller
 * Contextual Q&A assistant endpoint.
 */

import { PrismaClient } from '@prisma/client';
import { generateAIResponse } from '../services/aiService.js';
import { processOpportunityForStudent } from '../services/recommendationService.js';

const prisma = new PrismaClient();

export async function askAI(req, res) {
  try {
    let student = req.user;
    if (!student) {
      student = await prisma.student.findFirst();
    }
    if (!student) return res.status(404).json({ error: 'Student profile not found.' });

    const { opportunityId, prompt } = req.body;

    let opportunity = null;
    let matchData = null;

    if (opportunityId) {
      opportunity = await prisma.opportunity.findUnique({
        where: { id: opportunityId }
      });
      if (opportunity) {
        matchData = processOpportunityForStudent(student, opportunity);
      }
    }

    const aiMessage = await generateAIResponse(student, opportunity, prompt, matchData);

    return res.json({
      success: true,
      reply: aiMessage,
      context: {
        studentName: student.name,
        opportunityTitle: opportunity ? opportunity.title : 'General',
        matchScore: matchData ? matchData.matchScore : null,
        currentReadiness: matchData ? matchData.readiness.currentReadiness : null
      }
    });
  } catch (error) {
    console.error('askAI Error:', error);
    return res.status(500).json({ error: 'Failed to process AI question' });
  }
}
