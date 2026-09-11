/**
 * Configurable weights and normalization rules for OpportunityOS Matching Engine.
 * 
 * Formula:
 * Match Score = 0.35 * Skill Fit + 0.25 * Goal Relevance + 0.15 * Experience Fit + 0.15 * Interest Fit + 0.10 * Deadline Priority
 */

export const MATCH_WEIGHTS = {
  SKILL_FIT: 0.35,
  GOAL_RELEVANCE: 0.25,
  EXPERIENCE_FIT: 0.15,
  INTEREST_FIT: 0.15,
  DEADLINE_PRIORITY: 0.10,
};

export const DOMAIN_MAPPINGS = {
  'full stack developer': ['web development', 'frontend', 'backend', 'full stack', 'software engineering'],
  'backend developer': ['backend', 'server', 'api', 'database', 'cloud'],
  'frontend developer': ['frontend', 'ui/ux', 'web development', 'react'],
  'ai engineer': ['ai', 'machine learning', 'data science', 'python', 'deep learning'],
  'cloud engineer': ['cloud', 'aws', 'docker', 'devops'],
  'cybersecurity analyst': ['cybersecurity', 'security', 'networking']
};

export const SKILL_ALIASES = {
  'react': ['react.js', 'reactjs', 'react native'],
  'node.js': ['nodejs', 'node', 'express.js', 'express'],
  'javascript': ['js', 'ecmascript'],
  'typescript': ['ts'],
  'rest apis': ['rest api', 'restful api', 'api development'],
  'docker': ['containerization', 'docker compose'],
  'aws': ['amazon web services', 'cloud computing'],
  'python': ['python3', 'py'],
  'html': ['html5'],
  'css': ['css3', 'tailwind', 'bootstrap']
};
