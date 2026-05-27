/**
 * WorkReady AI — Scenario Recommendation Utility
 *
 * Scoring (100 points total):
 *  30 — Career track match (scenario.primaryTrack === student.target_track)
 *  20 — Faculty / major match
 *  25 — Student's weakest skill matches scenario's main skill
 *  10 — Student's weakest skill appears in scenario's related skills
 *  10 — Difficulty level matches student's readiness score
 *   5 — Career goal keyword overlap with scenario keywords
 *
 * This utility only suggests. Final scenario assignment must be confirmed by Admin.
 */

import { SKILL_CODE_MAP } from '../data/scenarioData.js';

/**
 * Convert old gap key (e.g. 'rca') to new skill code (e.g. 'evidence_based_rca').
 * @param {string} gapKey
 * @returns {string}
 */
export function getWeakestSkillCode(gapKey) {
  return SKILL_CODE_MAP[gapKey] || gapKey;
}

/**
 * Map a readiness score to a difficulty tier.
 * @param {number} score  0–100
 * @returns {'beginner'|'intermediate'|'advanced'}
 */
export function getDifficultyForScore(score) {
  if (score >= 80) return 'advanced';
  if (score >= 65) return 'intermediate';
  return 'beginner';
}

/**
 * Score a single scenario for a given student profile.
 *
 * @param {{
 *   target_track: string,
 *   facultyId?: string,
 *   majorCode?: string,
 *   weakestSkillCode?: string,
 *   career_goal?: string,
 * }} student
 * @param {Object} skillGap  — { processMap, safetyRisk, rca, traceability, memo, responsibleAi }
 * @param {number} readinessScore  — 0–100
 * @param {Object} scenario  — from SCENARIOS array
 * @returns {{ scenario: Object, score: number, reasons: string[] }}
 */
function scoreScenarioForStudent(student, skillGap, readinessScore, scenario) {
  let score = 0;
  const reasons = [];

  // 1. Track match (30 pts)
  if (scenario.primaryTrack === student.target_track) {
    score += 30;
    reasons.push(`Track match: ${scenario.primaryTrack.replace(/_/g, ' ')}`);
  }

  // 2. Faculty / major match (20 pts)
  const facultyId = student.facultyId;
  const majorCode = student.majorCode;
  const facultyMatch = facultyId && scenario.targetFaculties?.includes(facultyId);
  const majorMatch = majorCode && scenario.targetMajors?.includes(majorCode);
  if (facultyMatch || majorMatch) {
    score += 20;
    reasons.push('Faculty/major alignment');
  }

  // 3. Weakest skill matches scenario main skill (25 pts)
  const weakestCode = student.weakestSkillCode || resolveWeakestCode(skillGap);
  if (weakestCode && scenario.mainSkillCode === weakestCode) {
    score += 25;
    reasons.push(`Trains your weakest skill: ${weakestCode.replace(/_/g, ' ')}`);
  }

  // 4. Weakest skill in scenario's related skills (10 pts — only if not already matched by #3)
  if (weakestCode && scenario.mainSkillCode !== weakestCode && scenario.relatedSkills?.includes(weakestCode)) {
    score += 10;
    reasons.push(`Related to your gap area: ${weakestCode.replace(/_/g, ' ')}`);
  }

  // 5. Difficulty match (10 pts)
  const targetDifficulty = getDifficultyForScore(readinessScore);
  if (scenario.difficulty === targetDifficulty) {
    score += 10;
    reasons.push(`Difficulty matched to your level (${targetDifficulty})`);
  }

  // 6. Career goal keyword overlap (5 pts)
  const goalWords = (student.career_goal || '').toLowerCase().split(/\s+/);
  const keywords = scenario.careerGoalKeywords || [];
  const overlap = goalWords.some(w => w.length > 2 && keywords.some(k => k.includes(w) || w.includes(k)));
  if (overlap) {
    score += 5;
    reasons.push('Career goal alignment');
  }

  return { scenario, score: Math.min(score, 100), reasons };
}

/**
 * Resolve weakest skill code from raw skillGap object (old key format).
 * @param {Object} skillGap
 * @returns {string}
 */
function resolveWeakestCode(skillGap) {
  if (!skillGap || !Object.keys(skillGap).length) return '';
  const SCORE = { low: 10, medium: 50, high: 100 };
  let weakestKey = null;
  let lowestScore = Infinity;
  for (const [key, val] of Object.entries(skillGap)) {
    const s = SCORE[val] ?? 50;
    if (s < lowestScore) { lowestScore = s; weakestKey = key; }
  }
  return weakestKey ? getWeakestSkillCode(weakestKey) : '';
}

/**
 * Recommend and rank all scenarios for a student.
 *
 * @param {{
 *   target_track: string,
 *   facultyId?: string,
 *   majorCode?: string,
 *   weakestSkillCode?: string,
 *   career_goal?: string,
 * }} student
 * @param {Object} skillGap  — { processMap, safetyRisk, rca, ... }
 * @param {number} readinessScore  — 0–100
 * @param {Object[]} scenarios  — SCENARIOS array
 * @returns {{ scenario: Object, score: number, reasons: string[] }[]}  — sorted best-first
 */
export function recommendScenarioForStudent(student, skillGap, readinessScore, scenarios) {
  return scenarios
    .filter(sc => (sc.status || 'active') === 'active')
    .map(sc => scoreScenarioForStudent(student, skillGap, readinessScore, sc))
    .sort((a, b) => b.score - a.score);
}

/**
 * Return the single best-matching scenario for a student.
 *
 * @param {Object} student
 * @param {Object} skillGap
 * @param {number} readinessScore
 * @param {Object[]} scenarios
 * @returns {{ scenario: Object, score: number, reasons: string[] } | null}
 */
export function getTopRecommendation(student, skillGap, readinessScore, scenarios) {
  const ranked = recommendScenarioForStudent(student, skillGap, readinessScore, scenarios);
  return ranked.length ? ranked[0] : null;
}
