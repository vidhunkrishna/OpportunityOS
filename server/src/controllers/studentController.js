/**
 * Student Controller
 * Manages student profile viewing, editing, and profile completion stats.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function computeProfileCompletion(student) {
  const skills = typeof student.skillsJson === 'string' ? JSON.parse(student.skillsJson || '[]') : (student.skills || []);
  const projects = typeof student.projectsJson === 'string' ? JSON.parse(student.projectsJson || '[]') : (student.projects || []);
  const experience = typeof student.experienceJson === 'string' ? JSON.parse(student.experienceJson || '[]') : (student.experience || []);
  const interests = typeof student.interestsJson === 'string' ? JSON.parse(student.interestsJson || '[]') : (student.interests || []);
  const goals = typeof student.careerGoalsJson === 'string' ? JSON.parse(student.careerGoalsJson || '[]') : (student.careerGoals || []);

  let score = 0;
  
  // 1. Basic Info (Name, Education, Branch, Academic Year) -> 30%
  if (student.name && student.education && student.branch && student.academicYear) {
    score += 30;
  } else {
    if (student.name) score += 10;
    if (student.education) score += 10;
    if (student.branch && student.academicYear) score += 10;
  }

  // 2. Technical Skills -> 35%
  if (skills.length >= 3) {
    score += 35;
  } else if (skills.length > 0) {
    score += Math.round((skills.length / 3) * 35);
  }

  // 3. Career Goals -> 25%
  if (goals.length > 0) {
    score += 25;
  }

  // 4. Completeness Bonus (Basic profile complete or extra entries) -> 10%
  if (
    (student.name && student.education && student.branch && student.academicYear && skills.length > 0 && goals.length > 0) ||
    interests.length > 0 || projects.length > 0 || experience.length > 0
  ) {
    score += 10;
  }

  const completionPercentage = Math.min(100, Math.max(0, score));

  const missingInfo = [];
  if (skills.length < 3) missingInfo.push('Add at least 3 technical skills');
  if (goals.length === 0) missingInfo.push('Specify your target career goal');

  return { completionPercentage, missingInfo };
}

export async function getStudentProfile(req, res) {
  try {
    const studentId = req.user ? req.user.id : (req.params.id || null);
    let student = null;
    
    if (studentId) {
      student = await prisma.student.findUnique({ where: { id: studentId } });
    }
    if (!student) {
      student = await prisma.student.findFirst();
    }
    if (!student) {
      return res.status(404).json({ error: 'Student profile not found.' });
    }

    const skills = JSON.parse(student.skillsJson || '[]');
    const projects = JSON.parse(student.projectsJson || '[]');
    const experience = JSON.parse(student.experienceJson || '[]');
    const interests = JSON.parse(student.interestsJson || '[]');
    const goals = JSON.parse(student.careerGoalsJson || '[]');

    const { completionPercentage, missingInfo } = computeProfileCompletion(student);
    const { password: _, ...studentWithoutPassword } = student;

    return res.json({
      ...studentWithoutPassword,
      skills,
      projects,
      experience,
      interests,
      careerGoals: goals,
      completionPercentage,
      missingInfo
    });
  } catch (error) {
    console.error('getStudentProfile Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateStudentProfile(req, res) {
  try {
    const studentId = req.user ? req.user.id : (await prisma.student.findFirst())?.id;
    if (!studentId) return res.status(404).json({ error: 'Student profile not found.' });

    const {
      name, education, academicYear, branch,
      skills, projects, experience, interests, careerGoals,
      preferredOppTypes, preferredLocations
    } = req.body;

    const updated = await prisma.student.update({
      where: { id: studentId },
      data: {
        name: name !== undefined ? name : undefined,
        education: education !== undefined ? education : undefined,
        academicYear: academicYear !== undefined ? parseInt(academicYear) : undefined,
        branch: branch !== undefined ? branch : undefined,
        skillsJson: skills ? JSON.stringify(skills) : undefined,
        projectsJson: projects ? JSON.stringify(projects) : undefined,
        experienceJson: experience ? JSON.stringify(experience) : undefined,
        interestsJson: interests ? JSON.stringify(interests) : undefined,
        careerGoalsJson: careerGoals ? JSON.stringify(careerGoals) : undefined,
        preferredOppTypesJson: preferredOppTypes ? JSON.stringify(preferredOppTypes) : undefined,
        preferredLocationsJson: preferredLocations ? JSON.stringify(preferredLocations) : undefined,
      }
    });

    const { completionPercentage, missingInfo } = computeProfileCompletion(updated);
    const parsedSkills = JSON.parse(updated.skillsJson || '[]');
    const parsedGoals = JSON.parse(updated.careerGoalsJson || '[]');
    const parsedProjects = JSON.parse(updated.projectsJson || '[]');
    const parsedExp = JSON.parse(updated.experienceJson || '[]');
    const parsedInterests = JSON.parse(updated.interestsJson || '[]');

    const { password: _, ...updatedWithoutPassword } = updated;
    
    return res.json({
      success: true,
      student: {
        ...updatedWithoutPassword,
        skills: parsedSkills,
        careerGoals: parsedGoals,
        projects: parsedProjects,
        experience: parsedExp,
        interests: parsedInterests,
        completionPercentage,
        missingInfo
      }
    });
  } catch (error) {
    console.error('updateStudentProfile Error:', error);
    return res.status(500).json({ error: 'Failed to update profile' });
  }
}

