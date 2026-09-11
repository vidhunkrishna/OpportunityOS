/**
 * Recommendation & Ranking Engine
 * Integrates Eligibility, Matching, Readiness, Priority, and Explanation logic.
 */

import { evaluateEligibility } from './eligibilityService.js';
import { calculateMatchScore } from './matchingService.js';
import { classifyActionPriority } from './priorityService.js';
import { calculateOpportunityReadiness } from './readinessService.js';
import { analyzeSkillGaps } from './skillGapService.js';

export function processOpportunityForStudent(student, opportunity) {
  const eligibility = evaluateEligibility(student, opportunity);
  const matchResult = calculateMatchScore(student, opportunity);
  const priority = classifyActionPriority(eligibility, matchResult.matchScore, matchResult.daysRemaining);
  const readiness = calculateOpportunityReadiness(matchResult, eligibility.eligible);
  const skillGap = analyzeSkillGaps(matchResult);

  // Generate explainable match reasons
  const whyMatches = [];
  if (skillGap.matchedRequired.length > 0) {
    whyMatches.push(`Your ${skillGap.matchedRequired.slice(0, 3).join(', ')} skills align with the key role requirements.`);
  }

  const studentGoals = JSON.parse(student.careerGoalsJson || '[]');
  if (studentGoals.length > 0) {
    whyMatches.push(`Directly matches your primary career goal of '${studentGoals[0]}'.`);
  }

  const studentProjects = JSON.parse(student.projectsJson || '[]');
  if (studentProjects.length > 0) {
    whyMatches.push(`Your project '${studentProjects[0].title}' provides relevant practical experience.`);
  }

  const studentInterests = JSON.parse(student.interestsJson || '[]');
  if (studentInterests.length > 0) {
    whyMatches.push(`Matches your interest in ${studentInterests[0]}.`);
  }

  return {
    opportunity,
    eligibility,
    matchScore: matchResult.matchScore,
    breakdown: matchResult.breakdown,
    priority,
    readiness,
    skillGap,
    whyMatches,
    daysRemaining: matchResult.daysRemaining
  };
}

export function rankOpportunitiesForStudent(student, opportunities) {
  const processed = opportunities.map(opp => processOpportunityForStudent(student, opp));

  // Top recommendations: ONLY eligible items, sorted by match score descending
  const eligibleRecommended = processed
    .filter(item => item.eligibility.eligible)
    .sort((a, b) => b.matchScore - a.matchScore);

  // Ineligible items: marked clearly as CURRENTLY INELIGIBLE
  const ineligibleItems = processed
    .filter(item => !item.eligibility.eligible)
    .sort((a, b) => b.matchScore - a.matchScore);

  return {
    recommended: eligibleRecommended,
    ineligible: ineligibleItems,
    all: [...eligibleRecommended, ...ineligibleItems]
  };
}
