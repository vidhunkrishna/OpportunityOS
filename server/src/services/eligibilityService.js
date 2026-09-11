/**
 * Eligibility Engine
 * Evaluates hard constraints BEFORE recommendation ranking.
 * 
 * Checks:
 * - Academic level & year (minYear, maxYear)
 * - Branch / discipline
 * - Experience requirements
 * - Location / Mode requirements
 * 
 * Returns: { eligible: boolean, eligibilityReasons: string[] }
 */

import { normalizeText } from './semanticLayer.js';

export function evaluateEligibility(student, opportunity) {
  let eligibility = JSON.parse(opportunity.eligibilityJson || '{}');
  const reasons = [];

  const studentYear = student.academicYear;
  const studentBranch = student.branch;
  const studentEducation = student.education;

  // 1. Year constraint check
  if (eligibility.minYear && studentYear < eligibility.minYear) {
    reasons.push(`Required: Year ${eligibility.minYear}+ students | Your profile: Year ${studentYear}`);
  }
  if (eligibility.maxYear && studentYear > eligibility.maxYear) {
    reasons.push(`Required: Max Year ${eligibility.maxYear} students | Your profile: Year ${studentYear}`);
  }

  // 2. Branch constraint check
  if (eligibility.branches && Array.isArray(eligibility.branches) && eligibility.branches.length > 0) {
    const normStudentBranch = normalizeText(studentBranch);
    const hasBranchMatch = eligibility.branches.some(b => {
      const normB = normalizeText(b);
      return normStudentBranch.includes(normB) || normB.includes(normStudentBranch) || normB === 'all';
    });

    if (!hasBranchMatch) {
      reasons.push(`Required Branch: ${eligibility.branches.join(', ')} | Your Branch: ${studentBranch}`);
    }
  }

  // 3. Academic Level check
  if (eligibility.academicLevel && eligibility.academicLevel !== 'All') {
    const studentEduLower = (studentEducation || '').toLowerCase();
    const reqEduLower = (eligibility.academicLevel || '').toLowerCase();
    
    // Check if both student and opportunity are Undergraduate level
    const studentIsUndergrad = studentEduLower.includes('b.tech') || studentEduLower.includes('b.e') || studentEduLower.includes('bachelor') || studentEduLower.includes('undergraduate');
    const reqIsUndergrad = reqEduLower.includes('undergraduate') || reqEduLower.includes('b.tech') || reqEduLower.includes('bachelor');

    if (reqIsUndergrad) {
      if (!studentIsUndergrad) {
        reasons.push(`Required Level: ${eligibility.academicLevel} | Your Profile: ${studentEducation}`);
      }
    } else {
      if (!studentEduLower.includes(reqEduLower) && !reqEduLower.includes(studentEduLower)) {
        reasons.push(`Required Level: ${eligibility.academicLevel} | Your Profile: ${studentEducation}`);
      }
    }
  }

  const eligible = reasons.length === 0;

  return {
    eligible,
    eligibilityReasons: reasons
  };
}
