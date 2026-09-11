/**
 * Skill Gap Analysis Service
 * Categorizes matched vs missing skills and generates targeted next actions.
 */

export function analyzeSkillGaps(matchResult) {
  const { skillDetails } = matchResult;

  const matchedRequired = skillDetails.matchedRequired || [];
  const missingRequired = skillDetails.missingRequired || [];
  const matchedPreferred = skillDetails.matchedPreferred || [];
  const missingPreferred = skillDetails.missingPreferred || [];

  let nextBestAction = 'Your skills closely align with this opportunity!';

  if (missingRequired.length > 0) {
    nextBestAction = `Prioritize learning ${missingRequired[0]} because it is a core required skill for this role.`;
  } else if (missingPreferred.length > 0) {
    nextBestAction = `Enhance your application by building a small project with ${missingPreferred[0]}.`;
  }

  return {
    matchedRequired,
    missingRequired,
    matchedPreferred,
    missingPreferred,
    nextBestAction
  };
}
