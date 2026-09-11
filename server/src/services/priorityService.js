/**
 * Action Priority Engine
 * Categorizes opportunities into action buckets based on:
 * - Eligibility
 * - Match Score
 * - Deadline Urgency
 * - Application Status
 * 
 * Note: Does NOT modify the Match Score! Match Score = Fit, Priority = Action Urgency.
 */

export function classifyActionPriority(eligibilityResult, matchScore, daysRemaining) {
  if (daysRemaining <= 0) {
    return {
      bucket: 'EXPIRED',
      badgeLabel: 'Expired',
      badgeColor: 'gray',
      priorityLevel: 0
    };
  }

  if (!eligibilityResult.eligible) {
    return {
      bucket: 'INELIGIBLE',
      badgeLabel: 'Currently Ineligible',
      badgeColor: 'red',
      priorityLevel: 1
    };
  }

  if (matchScore >= 80 && daysRemaining <= 7) {
    return {
      bucket: 'PRIORITY',
      badgeLabel: '🔥 PRIORITY',
      badgeColor: 'amber',
      priorityLevel: 4
    };
  }

  if (daysRemaining <= 7 || matchScore >= 75) {
    return {
      bucket: 'THIS_WEEK',
      badgeLabel: 'THIS WEEK',
      badgeColor: 'blue',
      priorityLevel: 3
    };
  }

  return {
    bucket: 'LATER',
    badgeLabel: 'LATER',
    badgeColor: 'slate',
    priorityLevel: 2
  };
}
