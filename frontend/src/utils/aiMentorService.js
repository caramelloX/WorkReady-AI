/**
 * WorkReady AI Mentor Assistant — Frontend Service
 *
 * Calls POST /api/ai/mentor-assistant with taskType + payload.
 * Returns parsed result or throws on error.
 */

const AI_ENDPOINT = '/api/ai/mentor-assistant';

async function callMentorAI(taskType, payload) {
  const res = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskType, ...payload }),
  });

  const data = await res.json().catch(() => ({ error: 'Invalid JSON from server' }));

  if (!res.ok) {
    throw new Error(data?.error || `AI service error (HTTP ${res.status})`);
  }
  if (data?.status === 'missing_data') {
    throw new Error(`Missing fields: ${data.missingFields?.join(', ')}`);
  }
  return data?.result ?? data;
}


/* ── Named helpers ─────────────────────────────────────────────────── */

/**
 * Check whether a scenario is complete and safe to publish.
 * Used in ScenarioForm Step 7 (Preview).
 * @param {object} scenarioForm  - The current form state from ScenarioForm
 */
export async function checkScenarioQuality(scenarioForm) {
  return callMentorAI('scenario_quality_check', { scenario: scenarioForm });
}

/**
 * Generate a personalized scenario for a student.
 * @param {object} studentProfile
 * @param {object} skillGap  - { readinessScore, weakestSkillCode, weakestSkillName, scores }
 */
export async function generateScenario(studentProfile, skillGap) {
  return callMentorAI('scenario_generation', { studentProfile, skillGap });
}

/**
 * Pre-review a student's submission before sending to mentor.
 * @param {object} studentProfile
 * @param {object} scenario
 * @param {object} studentSubmission  - { processMap, riskChecklist, rcaLog, technicalMemo, aiUsageLog }
 */
export async function preReviewSubmission(studentProfile, scenario, studentSubmission) {
  return callMentorAI('ai_pre_review', { studentProfile, scenario, studentSubmission });
}

/**
 * Summarize a submission for the human mentor.
 */
export async function mentorReviewSummary(studentProfile, scenario, studentSubmission) {
  return callMentorAI('mentor_review_summary', { studentProfile, scenario, studentSubmission });
}

/**
 * Coach a student while they are working on a scenario.
 * @param {object} studentProfile
 * @param {object} scenario
 * @param {object} studentSubmission  - Work in progress
 */
export async function coachStudent(studentProfile, scenario, studentSubmission) {
  return callMentorAI('student_coaching', { studentProfile, scenario, studentSubmission });
}

/**
 * Polish a technical memo (wording only, no meaning change).
 * @param {object} studentSubmission  - { technicalMemo: string }
 */
export async function polishMemo(studentSubmission) {
  return callMentorAI('memo_polish', { studentSubmission });
}

/**
 * Explain why a mentor matches the student's scenario.
 */
export async function explainMentorMatch(studentProfile, scenario, mentorProfile) {
  return callMentorAI('mentor_matching_explanation', { studentProfile, scenario, mentorProfile });
}

/**
 * Explain a student's skill gap results in plain language.
 */
export async function explainSkillGap(studentProfile, skillGap) {
  return callMentorAI('skill_gap_explanation', { studentProfile, skillGap });
}

/**
 * Generate an AI Usage Log entry.
 */
export async function generateAiUsageLog(studentSubmission) {
  return callMentorAI('ai_usage_log_generation', { studentSubmission });
}

/**
 * Run a guardrail check on content before submission.
 */
export async function guardrailCheck(studentSubmission) {
  return callMentorAI('guardrail_check', { studentSubmission });
}

/**
 * Generate tasks/questions for a scenario given skill + difficulty.
 */
export async function generateTasks(scenario) {
  return callMentorAI('question_task_generation', { scenario });
}

/**
 * Generate 30 career-tailored self-assessment questions for the skill gap quiz.
 * @param {object} studentProfile - { career_goal, target_track, target_industry, occupation_goal, major }
 * @returns {{ careerContext, questions: Array, generationNote }}
 */
export async function generateSkillAssessment(studentProfile) {
  return callMentorAI('skill_assessment_generation', { studentProfile });
}


export default callMentorAI;
