/**
 * Preparation Roadmap Controller
 * Handles 7-day personalized plan generation and task completion persistence.
 */

import { PrismaClient } from '@prisma/client';
import { generatePersonalizedRoadmap } from '../services/preparationService.js';
import { processOpportunityForStudent } from '../services/recommendationService.js';

const prisma = new PrismaClient();

export async function generatePlan(req, res) {
  try {
    let student = req.user;
    if (!student) {
      student = await prisma.student.findFirst();
    }
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const { opportunityId } = req.body;
    if (!opportunityId) return res.status(400).json({ error: 'opportunityId is required' });

    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId }
    });
    if (!opportunity) return res.status(404).json({ error: 'Opportunity not found' });

    // Check if plan already exists
    let plan = await prisma.preparationPlan.findFirst({
      where: { studentId: student.id, opportunityId: opportunity.id },
      include: { tasks: { orderBy: { day: 'asc' } } }
    });

    if (!plan) {
      const processed = processOpportunityForStudent(student, opportunity);
      const generated = generatePersonalizedRoadmap(opportunity, processed.skillGap);

      plan = await prisma.preparationPlan.create({
        data: {
          studentId: student.id,
          opportunityId: opportunity.id,
          title: generated.title,
          targetSkills: JSON.stringify(generated.targetSkills),
          tasks: {
            create: generated.tasks.map(t => ({
              day: t.day,
              title: t.title,
              description: t.description,
              duration: t.duration,
              priority: t.priority,
              isCompleted: false
            }))
          }
        },
        include: { tasks: { orderBy: { day: 'asc' } } }
      });

      // Automatically move Application status to 'PREPARING'
      let application = await prisma.application.findFirst({
        where: { studentId: student.id, opportunityId: opportunity.id }
      });
      if (application) {
        await prisma.application.update({
          where: { id: application.id },
          data: { status: 'PREPARING' }
        });
      } else {
        await prisma.application.create({
          data: {
            studentId: student.id,
            opportunityId: opportunity.id,
            status: 'PREPARING',
            notes: 'Generated 7-day preparation roadmap'
          }
        });
      }
    }

    const completedCount = plan.tasks.filter(t => t.isCompleted).length;
    const totalCount = plan.tasks.length;
    const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return res.json({
      plan,
      completedCount,
      totalCount,
      progressPercentage
    });
  } catch (error) {
    console.error('generatePlan Error:', error);
    return res.status(500).json({ error: 'Failed to generate preparation plan' });
  }
}

export async function toggleTask(req, res) {
  try {
    const { taskId } = req.params;
    const { isCompleted } = req.body;

    const task = await prisma.preparationTask.findUnique({
      where: { id: taskId },
      include: { plan: { include: { tasks: true } } }
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    const updatedTask = await prisma.preparationTask.update({
      where: { id: taskId },
      data: { isCompleted: isCompleted !== undefined ? isCompleted : !task.isCompleted }
    });

    // Re-fetch updated plan tasks
    const allTasks = await prisma.preparationTask.findMany({
      where: { planId: task.planId },
      orderBy: { day: 'asc' }
    });

    const completedCount = allTasks.filter(t => t.isCompleted).length;
    const totalCount = allTasks.length;
    const progressPercentage = Math.round((completedCount / totalCount) * 100);

    return res.json({
      success: true,
      task: updatedTask,
      completedCount,
      totalCount,
      progressPercentage
    });
  } catch (error) {
    console.error('toggleTask Error:', error);
    return res.status(500).json({ error: 'Failed to update task' });
  }
}

export async function getStudentPlans(req, res) {
  try {
    let student = req.user;
    if (!student) {
      student = await prisma.student.findFirst();
    }
    if (!student) return res.status(404).json({ error: 'Student profile not found' });

    const plans = await prisma.preparationPlan.findMany({
      where: { studentId: student.id },
      include: {
        opportunity: true,
        tasks: { orderBy: { day: 'asc' } }
      },
      orderBy: { updatedAt: 'desc' }
    });

    const enriched = plans.map(p => {
      const completedCount = p.tasks.filter(t => t.isCompleted).length;
      const totalCount = p.tasks.length;
      const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
      return {
        ...p,
        completedCount,
        totalCount,
        progressPercentage
      };
    });

    return res.json(enriched);
  } catch (error) {
    console.error('getStudentPlans Error:', error);
    return res.status(500).json({ error: 'Failed to fetch preparation plans' });
  }
}
