/**
 * WorkReady AI — Readiness Score Utilities
 */

export const READINESS_LEVELS = [
  { min: 0,  max: 39,  level: 'Awareness',           color: '#EF4444', bg: '#FEF2F2', badge: 'red'    },
  { min: 40, max: 59,  level: 'Guided Practice',      color: '#F59E0B', bg: '#FFFBEB', badge: 'yellow' },
  { min: 60, max: 79,  level: 'Work-Ready Basic',     color: '#3B82F6', bg: '#EFF6FF', badge: 'blue'   },
  { min: 80, max: 100, level: 'Strong Junior Talent',  color: '#10B981', bg: '#ECFDF5', badge: 'green'  },
];

/**
 * Get readiness level object for a given score.
 * @param {number} score 0–100
 * @returns {{ min: number, max: number, level: string, color: string, bg: string, badge: string }}
 */
export function getReadinessLevel(score) {
  return READINESS_LEVELS.find(r => score >= r.min && score <= r.max) || READINESS_LEVELS[0];
}

/**
 * Convert a skill rating string to a numeric score.
 * @param {'high'|'medium'|'low'|'none'|undefined} rating
 * @returns {number} 0–100
 */
export function ratingToScore(rating) {
  switch (rating) {
    case 'high':   return 100;
    case 'medium': return 50;
    case 'low':    return 10;
    default:       return 0;
  }
}

/**
 * Calculate overall readiness score from a skill gap object.
 * Weights: processMap 25%, safetyRisk 20%, rca 20%, traceability 15%, memo 15%, responsibleAi 5%
 * @param {{ processMap, safetyRisk, rca, traceability, memo, responsibleAi }} skillGap
 * @returns {number} weighted score 0–100
 */
export function calculateReadinessScore(skillGap) {
  if (!skillGap) return 0;
  const weights = {
    processMap:   0.25,
    safetyRisk:   0.20,
    rca:          0.20,
    traceability: 0.15,
    memo:         0.15,
    responsibleAi: 0.05,
  };
  return Math.round(
    Object.entries(weights).reduce(
      (sum, [key, weight]) => sum + ratingToScore(skillGap[key]) * weight,
      0
    )
  );
}

/**
 * Find the weakest skill from a skill gap object.
 * @param {Object} skillGap
 * @returns {string} key of the weakest skill
 */
export function findWeakestSkill(skillGap) {
  if (!skillGap) return 'rca';
  return Object.entries(skillGap)
    .sort(([, a], [, b]) => ratingToScore(a) - ratingToScore(b))[0]?.[0] || 'rca';
}

/**
 * Human-readable skill labels.
 */
export const SKILL_LABELS = {
  processMap:    'Process Map',
  safetyRisk:    'Safety & Risk',
  rca:           'RCA',
  traceability:  'Traceability',
  memo:          'Technical Memo',
  responsibleAi: 'Responsible AI',
};
