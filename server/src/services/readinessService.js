/**
 * Opportunity Readiness Engine
 * Measures how prepared a student is to compete for a SPECIFIC opportunity.
 * Calculates Current Readiness % and Potential Improvement %.
 */

export function calculateOpportunityReadiness(matchResult, isEligible, projectsCount = 2) {
  const { breakdown, skillDetails } = matchResult;

  if (!isEligible) {
    return {
      currentReadiness: 35,
      potentialReadiness: 65,
      readinessLabel: 'Needs Eligibility Resolution'
    };
  }

  const reqCount = skillDetails.matchedRequired.length + skillDetails.missingRequired.length;
  const prefCount = skillDetails.matchedPreferred.length + skillDetails.missingPreferred.length;

  const reqCoverage = reqCount > 0 ? (skillDetails.matchedRequired.length / reqCount) : 1;
  const prefCoverage = prefCount > 0 ? (skillDetails.matchedPreferred.length / prefCount) : 1;

  // Base readiness from required skills (65%) + preferred skills (15%) + projects (20%)
  const projBonus = Math.min(20, projectsCount * 10);
  const currentRaw = (reqCoverage * 65) + (prefCoverage * 15) + projBonus + (reqCoverage >= 0.8 ? 6 : 0);

  // Potential readiness if missing required skills are containerized/learned (+13-15%)
  const missingReqPenalty = (skillDetails.missingRequired.length / (reqCount || 1)) * 18;
  const potentialRaw = currentRaw + missingReqPenalty;

  const currentReadiness = Math.min(100, Math.round(currentRaw));
  const potentialReadiness = Math.min(98, Math.round(potentialRaw));

  let readinessLabel = 'Moderate Readiness';
  if (currentReadiness >= 85) readinessLabel = 'High Readiness';
  else if (currentReadiness >= 70) readinessLabel = 'Ready to Apply with Prep';
  else if (currentReadiness < 50) readinessLabel = 'Developing Readiness';

  return {
    currentReadiness,
    potentialReadiness,
    readinessLabel
  };
}
