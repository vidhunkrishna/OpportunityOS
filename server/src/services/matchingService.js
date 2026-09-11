/**
 * OpportunityOS Matching Engine
 * Implements the 5-factor weighted deterministic scoring model.
 * 
 * Formula:
 * Match Score = 0.35 * Skill Fit + 0.25 * Goal Relevance + 0.15 * Experience Fit + 0.15 * Interest Fit + 0.10 * Deadline Priority
 */

import { MATCH_WEIGHTS } from '../config/matchingWeights.js';
import { areSkillsMatching, calculateDomainRelevance, normalizeText } from './semanticLayer.js';

export function calculateMatchScore(student, opportunity) {
  const studentSkills = JSON.parse(student.skillsJson || '[]');
  const studentGoals = JSON.parse(student.careerGoalsJson || '[]');
  const studentProjects = JSON.parse(student.projectsJson || '[]');
  const studentExperience = JSON.parse(student.experienceJson || '[]');
  const studentInterests = JSON.parse(student.interestsJson || '[]');

  const requiredSkills = JSON.parse(opportunity.requiredSkillsJson || '[]');
  const preferredSkills = JSON.parse(opportunity.preferredSkillsJson || '[]');
  const oppTags = JSON.parse(opportunity.tagsJson || '[]');

  // 1. SKILL FIT (Weight: 0.35)
  const matchedRequired = requiredSkills.filter(req => 
    studentSkills.some(st => areSkillsMatching(st, req))
  );
  const missingRequired = requiredSkills.filter(req => 
    !studentSkills.some(st => areSkillsMatching(st, req))
  );

  const matchedPreferred = preferredSkills.filter(pref => 
    studentSkills.some(st => areSkillsMatching(st, pref))
  );
  const missingPreferred = preferredSkills.filter(pref => 
    !studentSkills.some(st => areSkillsMatching(st, pref))
  );

  const reqScore = requiredSkills.length > 0 
    ? (matchedRequired.length / requiredSkills.length) * 100 
    : 100;
  const prefScore = preferredSkills.length > 0 
    ? (matchedPreferred.length / preferredSkills.length) * 100 
    : 50;

  const skillFit = Math.min(100, Math.round(reqScore * 0.85 + prefScore * 0.15 + (matchedRequired.length >= 4 ? 16 : 0)));

  // 2. GOAL RELEVANCE (Weight: 0.25)
  const primaryGoal = studentGoals[0] || 'Software Engineer';
  const oppFields = [opportunity.title, opportunity.organization, opportunity.category, ...oppTags, opportunity.description];
  const goalRelevance = calculateDomainRelevance(primaryGoal, oppFields);

  // 3. EXPERIENCE FIT (Weight: 0.15)
  let experienceFit = 50; // baseline
  const projectTechs = studentProjects.flatMap(p => p.technologies || []);
  const projMatchedSkills = requiredSkills.filter(req => 
    projectTechs.some(tech => areSkillsMatching(tech, req))
  );

  if (studentProjects.length > 0) {
    const projMatchRatio = requiredSkills.length > 0 ? (projMatchedSkills.length / requiredSkills.length) : 0.5;
    experienceFit = Math.round(65 + projMatchRatio * 30 + Math.min(10, studentExperience.length * 5));
  }
  experienceFit = Math.min(100, experienceFit);

  // 4. INTEREST FIT (Weight: 0.15)
  let matchedInterestsCount = 0;
  studentInterests.forEach(interest => {
    const normInterest = normalizeText(interest);
    const textToSearch = normalizeText(`${opportunity.category} ${opportunity.title} ${oppTags.join(' ')}`);
    if (textToSearch.includes(normInterest)) {
      matchedInterestsCount++;
    }
  });

  const interestFit = studentInterests.length > 0 
    ? Math.min(100, Math.round(75 + (matchedInterestsCount / studentInterests.length) * 25))
    : 70;

  // 5. DEADLINE PRIORITY (Weight: 0.10)
  const now = new Date();
  const deadlineDate = new Date(opportunity.deadline);
  const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

  let deadlinePriority = 50;
  if (diffDays <= 0) deadlinePriority = 0;
  else if (diffDays <= 3) deadlinePriority = 100;
  else if (diffDays <= 7) deadlinePriority = 85;
  else if (diffDays <= 14) deadlinePriority = 70;
  else if (diffDays <= 30) deadlinePriority = 50;
  else deadlinePriority = 30;

  // COMPUTE FINAL DETERMINISTIC SCORE (0 - 100)
  const rawScore = 
    MATCH_WEIGHTS.SKILL_FIT * skillFit +
    MATCH_WEIGHTS.GOAL_RELEVANCE * goalRelevance +
    MATCH_WEIGHTS.EXPERIENCE_FIT * experienceFit +
    MATCH_WEIGHTS.INTEREST_FIT * interestFit +
    MATCH_WEIGHTS.DEADLINE_PRIORITY * deadlinePriority;

  const matchScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  return {
    matchScore,
    breakdown: {
      skillFit,
      goalRelevance,
      experienceFit,
      interestFit,
      deadlinePriority
    },
    skillDetails: {
      matchedRequired,
      missingRequired,
      matchedPreferred,
      missingPreferred
    },
    daysRemaining: diffDays
  };
}
