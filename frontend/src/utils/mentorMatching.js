/**
 * WorkReady AI — Mentor-Student Matching Utility
 *
 * Scoring (100 points total):
 *  40 — Student targetTrack matches Mentor expertiseTracks
 *  25 — Mentor can coach the student's weakest competency
 *  15 — Student targetIndustry matches mentor industryBackground
 *  10 — Career-goal keyword overlap with mentor jobTitle/expertise keywords
 *  10 — Mentor has available capacity
 */

import { findWeakestSkill } from './readiness.js';

const SKILL_TO_REVIEW_MAP = {
  processMap:    'canReviewProcessMap',
  safetyRisk:    'canReviewRiskChecklist',
  rca:           'canReviewRca',
  traceability:  'canReviewRca',
  memo:          'canReviewTechnicalMemo',
  responsibleAi: 'canReviewAiUsageLog',
};

/**
 * Calculate match score between a student and a mentor.
 *
 * @param {{ target_track: string, target_industry: string, career_goal: string, skillGap: Object }} student
 * @param {Object} mentor  — MentorProfile shape from demoData
 * @returns {{ matchScore: number, matchReason: string[], isRecommended: boolean }}
 */
export function calculateMentorMatchScore(student, mentor) {
  let score = 0;
  const reasons = [];

  // 1. Track match (40 pts)
  const studentTrack = student.target_track || '';
  const mentorTracks = mentor.expertiseTracks || [];
  if (mentorTracks.includes(studentTrack)) {
    score += 40;
    reasons.push(`Target track (${studentTrack.replace(/_/g, ' ')}) matches mentor expertise`);
  } else {
    // Partial match: mentor has a related track
    const related = mentorTracks.some(t => t.includes(studentTrack.split('_')[0]));
    if (related) {
      score += 20;
      reasons.push(`Partial track match with mentor's expertise`);
    }
  }

  // 2. Weakest skill coaching (25 pts)
  const weakest = findWeakestSkill(student.skillGap);
  const reviewKey = SKILL_TO_REVIEW_MAP[weakest];
  if (reviewKey && mentor[reviewKey]) {
    score += 25;
    reasons.push(`Mentor can coach ${weakest.replace(/([A-Z])/g, ' $1').toLowerCase()} — student's weakest skill`);
  }

  // 3. Industry match (15 pts)
  const studentIndustry = (student.target_industry || '').toLowerCase();
  const mentorIndustry  = (mentor.industryBackground || '').toLowerCase();
  if (studentIndustry && mentorIndustry && mentorIndustry.includes(studentIndustry)) {
    score += 15;
    reasons.push(`Same industry background (${mentor.industryBackground})`);
  }

  // 4. Career goal keyword overlap (10 pts)
  const goalWords = (student.career_goal || '').toLowerCase().split(/\s+/);
  const mentorKeywords = (mentor.keywords || []).map(k => k.toLowerCase());
  const mentorExpertise = (mentor.expertise || '').toLowerCase();
  const overlap = goalWords.some(w => w.length > 3 && (mentorKeywords.some(k => k.includes(w)) || mentorExpertise.includes(w)));
  if (overlap) {
    score += 10;
    reasons.push(`Career goal aligns with mentor expertise keywords`);
  }

  let capacityStatus = 'available';
  if (mentor.availableStatus === 'full' || mentor.currentStudents >= mentor.maxStudents) {
    capacityStatus = 'full';
    reasons.push(`⚠ Mentor is at full capacity (${mentor.currentStudents}/${mentor.maxStudents})`);
  } else if (mentor.availableStatus === 'inactive') {
    capacityStatus = 'inactive';
    reasons.push(`⚠ Mentor is inactive`);
  } else {
    score += 10;
    reasons.push(`Mentor has available capacity (${mentor.currentStudents}/${mentor.maxStudents})`);
  }

  const matchScore = Math.min(score, 100);
  const isRecommended = capacityStatus === 'available' && matchScore >= 75;

  return {
    matchScore,
    matchReason: reasons,
    isRecommended,
    capacityStatus
  };
}

/**
 * Rank all mentors for a given student.
 * @param {Object} student
 * @param {Object[]} mentors
 * @returns {{ mentor: Object, matchScore: number, matchReason: string[], isRecommended: boolean }[]}
 */
export function rankMentorsForStudent(student, mentors) {
  return mentors
    .map(mentor => ({
      mentor,
      ...calculateMentorMatchScore(student, mentor),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);
}
