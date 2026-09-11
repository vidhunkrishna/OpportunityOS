/**
 * Local Semantic & Normalization Layer
 * 
 * Provides deterministic semantic normalization for skill aliases, synonyms,
 * career domain alignments, and keyword relevance.
 * Designed so a future vector-embedding or embedding search service can replace it seamlessly.
 */

import { SKILL_ALIASES, DOMAIN_MAPPINGS } from '../config/matchingWeights.js';

export function normalizeText(text) {
  if (!text) return '';
  return text.toString().toLowerCase().trim().replace(/[-_/]/g, ' ');
}

export function areSkillsMatching(skill1, skill2) {
  const norm1 = normalizeText(skill1);
  const norm2 = normalizeText(skill2);

  if (norm1 === norm2) return true;

  // Check alias lookup table
  for (const [canonical, aliases] of Object.entries(SKILL_ALIASES)) {
    const normCanonical = normalizeText(canonical);
    const normAliases = aliases.map(normalizeText);

    const is1InGroup = norm1 === normCanonical || normAliases.includes(norm1);
    const is2InGroup = norm2 === normCanonical || normAliases.includes(norm2);

    if (is1InGroup && is2InGroup) return true;
  }

  // Check substring contains for composite terms
  if (norm1.length > 3 && norm2.length > 3) {
    if (norm1.includes(norm2) || norm2.includes(norm1)) return true;
  }

  return false;
}

export function calculateDomainRelevance(goal, opportunityFields) {
  const normGoal = normalizeText(goal);
  const combinedText = opportunityFields.map(normalizeText).join(' ');

  let score = 50; // default baseline

  // Exact match
  if (combinedText.includes(normGoal)) {
    return 100;
  }

  // Check domain mappings
  for (const [domain, keywords] of Object.entries(DOMAIN_MAPPINGS)) {
    if (normGoal.includes(domain) || domain.includes(normGoal)) {
      const matchCount = keywords.filter(kw => combinedText.includes(kw)).length;
      if (matchCount > 0) {
        score = Math.min(100, 60 + matchCount * 15);
        return score;
      }
    }
  }

  // Partial keyword match
  const goalWords = normGoal.split(' ').filter(w => w.length > 2);
  const matchingWords = goalWords.filter(word => combinedText.includes(word));
  if (matchingWords.length > 0) {
    score = Math.min(95, 40 + (matchingWords.length / goalWords.length) * 55);
  }

  return Math.round(score);
}
