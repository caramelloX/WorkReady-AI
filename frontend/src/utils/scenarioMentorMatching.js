/**
 * WorkReady AI — Scenario-Based Mentor Matching Utility
 *
 * Matching flow: Student → Scenario → Mentor (not Student → Mentor directly).
 *
 * Scoring (100 points total):
 *  30 — Mentor's primary track matches scenario's primary track
 *   5 — Mentor's secondary track matches scenario's secondary track
 *  25 — Mentor's expertise skills include scenario's main skill
 *  20 — Mentor review capabilities cover scenario requirements (proportional)
 *   5 — Student's track is in mentor's expertise tracks
 *   5 — Mentor has available capacity
 *   5 — Mentor has declared this scenario as preferred
 *   5 — bonus if mentor's secondary track matches student's track (extra alignment)
 *
 * AI matching can only suggest. Final mentor assignment must be confirmed by Admin or Mentor.
 * This system does not make employment or safety decisions.
 */

/**
 * Score a single mentor for a given student + scenario combination.
 *
 * @param {Object} student   — { target_track, weakestSkillCode, ... }
 * @param {Object} scenario  — from SCENARIOS (must have primaryTrack, mainSkillCode, etc.)
 * @param {Object} mentor    — from DEMO_MENTORS
 * @returns {{
 *   mentor: Object,
 *   matchScore: number,
 *   matchReason: string[],
 *   isRecommended: boolean,
 *   capacityStatus: 'available'|'full'|'inactive',
 * }}
 */
export function scoreMentorForScenario(student, scenario, mentor) {
  let score = 0;
  const reasons = [];
  const mentorTracks = mentor.expertiseTracks || [];

  // 1. Primary track (30 pts): mentor's first track = scenario's primary track
  if (mentorTracks[0] === scenario.primaryTrack) {
    score += 30;
    reasons.push(`Expert in ${scenario.primaryTrack.replace(/_/g, ' ')} — scenario's primary track`);
  } else if (mentorTracks.includes(scenario.primaryTrack)) {
    score += 15;
    reasons.push(`Has experience in ${scenario.primaryTrack.replace(/_/g, ' ')}`);
  }

  // 2. Secondary track (5 pts): mentor has scenario's secondary track
  if (scenario.secondaryTrack && mentorTracks.slice(1).includes(scenario.secondaryTrack)) {
    score += 5;
    reasons.push(`Also covers ${scenario.secondaryTrack.replace(/_/g, ' ')}`);
  }

  // 3. Skills coverage (25 pts): mentor's expertise includes scenario's main skill
  const mentorSkills = mentor.expertiseSkills || [];
  if (scenario.mainSkillCode && mentorSkills.includes(scenario.mainSkillCode)) {
    score += 25;
    reasons.push(`Expert in ${scenario.mainSkillCode.replace(/_/g, ' ')} — scenario's focus skill`);
  } else {
    // Partial: mentor has related skills from the scenario
    const relatedCovered = (scenario.relatedSkills || []).filter(s => mentorSkills.includes(s));
    if (relatedCovered.length > 0) {
      score += 10;
      reasons.push(`Covers related skills: ${relatedCovered.map(s => s.replace(/_/g, ' ')).join(', ')}`);
    }
  }

  // 4. Review capabilities (20 pts, proportional)
  const required = scenario.reviewCapabilitiesRequired || [];
  if (required.length > 0) {
    const matched = required.filter(cap => mentor[cap] === true).length;
    const capScore = Math.round((matched / required.length) * 20);
    if (capScore > 0) {
      score += capScore;
      reasons.push(`Can review ${matched}/${required.length} required portfolio outputs`);
    }
  }

  // 5. Student's track in mentor's tracks (5 pts)
  if (student.target_track && mentorTracks.includes(student.target_track)) {
    score += 5;
    reasons.push(`Experience with student's track: ${student.target_track.replace(/_/g, ' ')}`);
  }

  // 6. Capacity (5 pts)
  let capacityStatus = 'available';
  if (mentor.availableStatus === 'inactive') {
    capacityStatus = 'inactive';
    reasons.push(`⚠ Mentor is inactive`);
  } else if (mentor.availableStatus === 'full' || mentor.currentStudents >= mentor.maxStudents) {
    capacityStatus = 'full';
    reasons.push(`⚠ Mentor is at full capacity (${mentor.currentStudents}/${mentor.maxStudents})`);
  } else {
    score += 5;
    reasons.push(`Available capacity (${mentor.currentStudents}/${mentor.maxStudents} students)`);
  }

  // 7. Preferred scenario (5 pts)
  if (mentor.preferredScenarios?.includes(scenario.id)) {
    score += 5;
    reasons.push(`Prefers this scenario type`);
  }

  const matchScore = Math.min(score, 100);
  const isRecommended = capacityStatus === 'available' && matchScore >= 75;

  return { mentor, matchScore, matchReason: reasons, isRecommended, capacityStatus };
}

/**
 * Rank all mentors for a student-scenario pair.
 *
 * @param {Object} student
 * @param {Object} scenario
 * @param {Object[]} mentors
 * @returns {{ mentor, matchScore, matchReason, isRecommended, capacityStatus }[]}  sorted best-first
 */
export function matchMentorForScenario(student, scenario, mentors) {
  return mentors
    .map(m => scoreMentorForScenario(student, scenario, m))
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Return the single best mentor for a student-scenario pair.
 *
 * @param {Object} student
 * @param {Object} scenario
 * @param {Object[]} mentors
 * @returns {{ mentor, matchScore, matchReason, isRecommended, capacityStatus } | null}
 */
export function getTopMentorMatch(student, scenario, mentors) {
  const ranked = matchMentorForScenario(student, scenario, mentors);
  return ranked.length ? ranked[0] : null;
}
