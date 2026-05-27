/**
 * WorkReady AI — Demo Data
 * Synthetic demo data only. No real factory or personal data.
 */

// ── Demo Students ──────────────────────────────────────────────────────────
export const DEMO_STUDENTS = [
  {
    id: 'student-001',
    role: 'student',
    fullname: 'Anan J.',
    major: 'Industrial Technology',
    facultyId: 'faculty-1',
    majorCode: 'industrial_technology',
    target_track: 'quality_assurance',
    target_industry: 'Manufacturing',
    career_goal: 'Junior QA Technician',
    readinessScore: 58,
    skillGap: {
      processMap: 'medium',
      safetyRisk: 'medium',
      rca: 'low',
      traceability: 'medium',
      memo: 'medium',
      responsibleAi: 'high',
    },
    weakestSkill: 'rca',
    weakestSkillCode: 'evidence_based_rca',
    assignedMentorId: null,
    assignedScenarioId: null,
  },
  {
    id: 'student-002',
    role: 'student',
    fullname: 'Mali K.',
    major: 'Mechanical Engineering',
    facultyId: 'faculty-2',
    majorCode: 'mechanical_engineering',
    target_track: 'maintenance_machine',
    target_industry: 'Manufacturing',
    career_goal: 'Machine Maintenance Technician',
    readinessScore: 64,
    skillGap: {
      processMap: 'low',
      safetyRisk: 'medium',
      rca: 'medium',
      traceability: 'medium',
      memo: 'medium',
      responsibleAi: 'high',
    },
    weakestSkill: 'processMap',
    weakestSkillCode: 'industrial_flow_process_map',
    assignedMentorId: null,
    assignedScenarioId: null,
  },
  {
    id: 'student-003',
    role: 'student',
    fullname: 'Kanya P.',
    major: 'Industrial Technology',
    facultyId: 'faculty-1',
    majorCode: 'industrial_technology',
    target_track: 'production_process',
    target_industry: 'Manufacturing',
    career_goal: 'Production Process Analyst',
    readinessScore: 76,
    skillGap: {
      processMap: 'medium',
      safetyRisk: 'low',
      rca: 'medium',
      traceability: 'high',
      memo: 'high',
      responsibleAi: 'medium',
    },
    weakestSkill: 'safetyRisk',
    weakestSkillCode: 'safety_quality_risk',
    assignedMentorId: null,
    assignedScenarioId: null,
  },
];

// ── Demo Mentors ───────────────────────────────────────────────────────────
export const DEMO_MENTORS = [
  {
    id: 'mentor-001',
    role: 'mentor',
    fullname: 'Somchai P.',
    jobTitle: 'Senior QA Engineer',
    industryBackground: 'Manufacturing',
    expertiseTracks: ['quality_assurance', 'safety_compliance'],
    expertiseSkills: [
      'evidence_based_rca',
      'documentation_traceability',
      'technical_communication',
      'safety_quality_risk',
    ],
    keywords: ['quality', 'inspection', 'defect', 'rca', 'compliance'],
    expertise: 'defect analysis quality control rca traceability documentation',
    canReviewProcessMap: true,
    canReviewRiskChecklist: true,
    canReviewRca: true,
    canReviewTechnicalMemo: true,
    canReviewAiUsageLog: false,
    preferredScenarios: ['scenario-001'],
    currentStudents: 2,
    maxStudents: 5,
    availableStatus: 'available',
  },
  {
    id: 'mentor-002',
    role: 'mentor',
    fullname: 'Narin T.',
    jobTitle: 'Maintenance Supervisor',
    industryBackground: 'Manufacturing',
    expertiseTracks: ['maintenance_machine', 'production_process'],
    expertiseSkills: [
      'industrial_flow_process_map',
      'evidence_based_rca',
      'documentation_traceability',
      'technical_communication',
    ],
    keywords: ['maintenance', 'machine', 'repair', 'process map', 'downtime'],
    expertise: 'machine maintenance troubleshooting process mapping downtime analysis',
    canReviewProcessMap: true,
    canReviewRiskChecklist: false,
    canReviewRca: true,
    canReviewTechnicalMemo: true,
    canReviewAiUsageLog: false,
    preferredScenarios: ['scenario-002'],
    currentStudents: 1,
    maxStudents: 4,
    availableStatus: 'available',
  },
  {
    id: 'mentor-003',
    role: 'mentor',
    fullname: 'Ploy S.',
    jobTitle: 'Production Process Engineer',
    industryBackground: 'Manufacturing',
    expertiseTracks: ['production_process', 'safety_compliance'],
    expertiseSkills: [
      'industrial_flow_process_map',
      'safety_quality_risk',
      'technical_communication',
      'responsible_ai_usage',
    ],
    keywords: ['production', 'process', 'bottleneck', 'lean', 'workflow'],
    expertise: 'production process improvement bottleneck analysis lean manufacturing safety',
    canReviewProcessMap: true,
    canReviewRiskChecklist: true,
    canReviewRca: false,
    canReviewTechnicalMemo: true,
    canReviewAiUsageLog: true,
    preferredScenarios: ['scenario-003'],
    currentStudents: 0,
    maxStudents: 4,
    availableStatus: 'available',
  },
];

// ── Helper: get mentor for a student (by student id or fallback) ───────────
export function getMentorForStudent(studentId) {
  const student = DEMO_STUDENTS.find(s => s.id === studentId);
  if (!student?.assignedMentorId) return DEMO_MENTORS[0];
  return DEMO_MENTORS.find(m => m.id === student.assignedMentorId) || DEMO_MENTORS[0];
}

// ── Demo Portfolio: Anan J. (scenario-001 Defect Rate Spike) ──────────────
export const DEMO_PORTFOLIO_ANAN = {
  processMap: {
    status: 'submitted',
    steps: [
      { step: 'Raw material intake — visual inspection by Operator OP-117', responsible: 'OP-117', risk: false, notes: '' },
      { step: 'Sub-assembly at M-301 — alignment fixture calibrated Oct 10', responsible: 'OP-117', risk: false, notes: 'Normal operation' },
      { step: 'Assembly at M-302 — fixture alignment NOT verified before shift', responsible: 'OP-117', risk: true, notes: 'Vibration anomaly started ~23:00' },
      { step: 'Surface finish inspection — visual only, no go/no-go gauge used', responsible: 'QA-Lead', risk: true, notes: 'SOP QA-007 requires go/no-go' },
      { step: 'Batch packaging and logging in traceability system', responsible: 'OP-117', risk: false, notes: '' },
    ],
    facts: [
      'Defect rate on Line-3 rose from 2.1% baseline to 12.0% over 3 shifts',
      '45 rejected units found in Batch B-2301',
      'M-302 showed vibration anomaly starting Oct 15 ~23:00',
      'Operator OP-117 reported the noise but production continued due to deadline',
    ],
    assumptions: [
      { claim: 'Fixture alignment caused the surface scratches', evidenceNeeded: 'M-302 alignment measurement log' },
      { claim: 'Production deadline pressure was the decision factor', evidenceNeeded: 'Shift lead communication record' },
    ],
  },
  riskChecklist: {
    status: 'submitted',
    risks: [
      { type: 'Quality Risk', description: 'M-302 vibration anomaly leads to surface scratches on housing', evidence: 'Batch B-2300 defect rate 6.8%, B-2301 12.0%', severity: 'High', confidence: 'Likely', suggestedAction: 'Take M-302 offline for alignment inspection before next shift' },
      { type: 'SOP Deviation', description: 'Production continued after machine anomaly reported, violating SOP QA-007 Step 3', evidence: 'Operator note Oct 15', severity: 'High', confidence: 'Confirmed', suggestedAction: 'Review shift lead authority and escalation procedure' },
      { type: 'Traceability Issue', description: 'Incomplete maintenance logs mean anomaly onset cannot be precisely dated', evidence: 'Maintenance log gaps in Oct record', severity: 'Medium', confidence: 'Likely', suggestedAction: 'Mandate real-time maintenance log update via system (not paper)' },
    ],
  },
  rcaLog: {
    status: 'submitted',
    problem: 'Defect rate on Assembly Line 3 increased from 2.1% to 12.0% over 3 shifts (Oct 14–16), resulting in 45+ rejected MX-7 units across Batches B-2300 through B-2302.',
    fiveWhy: [
      { why: 1, question: 'Why 1:', answer: 'Motor housings have visible surface scratches after passing through M-302' },
      { why: 2, question: 'Why 2:', answer: 'Machine M-302 fixture alignment shifted, causing housing to contact cutting tool at wrong angle' },
      { why: 3, question: 'Why 3:', answer: 'M-302 fixture alignment was not verified before the Night 1 shift (Oct 15)' },
      { why: 4, question: 'Why 4:', answer: 'Pre-shift alignment check is not a mandatory step in current SOP for M-302' },
      { why: 5, question: 'Why 5:', answer: 'SOP QA-007 has not been updated since M-302 fixture sensitivity was identified in the last audit (6 months ago)' },
    ],
    availableEvidence: [
      'Batch defect log B-2298 through B-2302',
      'Operator note from OP-117 (Oct 15, Night Shift)',
      'Machine calibration record: M-302 last calibrated before Oct 10',
      'Quality check report: surface scratch pattern consistent across Batch B-2301',
    ],
    missingEvidence: [
      'M-302 alignment measurement log for Oct 14–16',
      'Shift lead approval record for continuing production on Oct 15',
      'Previous near-miss reports related to M-302',
    ],
    initialCorrectiveAction: 'Take M-302 offline immediately for full fixture alignment inspection and recalibration. Quarantine and re-inspect all units from Batches B-2300 to B-2302.',
    verificationPlan: 'After M-302 recalibration, run 50 test units through full inspection cycle before resuming full production. Monitor defect rate for 2 full shifts to confirm return to baseline ≤ 2.1%.',
  },
  technicalMemo: {
    status: 'submitted',
    subject: 'Defect Rate Spike — Line 3 Assembly: Root Cause and Corrective Action',
    date: '2024-10-17',
    preparedBy: 'Anan J. (QA Student Trainee)',
    problemSummary: 'Assembly Line 3 experienced a defect rate spike from 2.1% to 12.0% across 3 shifts (Oct 14–16). 45+ MX-7 motor housings in Batches B-2300 to B-2302 were rejected due to visible surface scratches.',
    evidence: 'Machine M-302 vibration anomaly was reported by Operator OP-117 at ~23:00 on Oct 15 but production continued. Batch defect log shows defect rate escalation from 6.8% (Night 1) to 12.0% (Day 3). M-302 was last calibrated before Oct 10 — fixture alignment unverified for current batch run.',
    analysis: 'Root cause identified as unverified fixture alignment on M-302 prior to Night 1 shift. The absence of a mandatory pre-shift alignment check in SOP QA-007 for M-302 allowed the defect-producing condition to persist across 3 shifts. Deadline pressure may have influenced the decision to continue production after the anomaly was reported.',
    recommendedAction: `1. Take M-302 offline immediately for alignment inspection and recalibration.
2. Quarantine Batches B-2300 to B-2302 for full re-inspection (100%).
3. Update SOP QA-007 to include mandatory M-302 pre-shift alignment verification.
4. Review and reinforce escalation protocol for machine anomaly reports.`,
    nextStep: 'QA Lead to schedule M-302 inspection within 4 hours. Shift Lead to brief all operators on updated escalation procedure by end of day.',
  },
  aiUsageLog: {
    status: 'submitted',
    entries: [
      { id: 1, task: 'RCA 5-Why Draft', promptUsed: 'Suggest possible root causes for defect rate spike on assembly line', aiSuggestion: 'Possible causes include: machine misalignment, material batch defect, operator error, and SOP non-compliance. Recommend starting with physical inspection of tooling alignment.', humanAction: 'accept', reason: 'Suggestion matched my own observation about M-302 fixture. I verified this against the operator note and batch logs before accepting.', verifiedStatus: true, confidence: 'High' },
      { id: 2, task: 'Corrective Action', promptUsed: 'What corrective action should I recommend for a fixture alignment issue causing surface defects?', aiSuggestion: 'Recommend taking the machine offline, performing full alignment inspection, calibrating fixture, and running test units before resuming production.', humanAction: 'modify', reason: 'AI suggestion was correct but generic. I added specific SOP update and escalation protocol review steps based on the actual incident context.', verifiedStatus: true, confidence: 'Medium' },
    ],
  },
  mentorFeedback: {
    overallScore: 78,
    comment: 'Good identification of the primary root cause. The 5-Why chain is logical and well-supported by evidence. Memo structure is clear. Strengthen the evidence section by explicitly referencing the batch log data. The AI log shows good critical thinking — you modified the AI suggestion appropriately.',
    reviewedBy: 'Somchai P.',
    reviewedAt: '2024-10-18',
  },
};

// ── Demo Scenario (for ScenarioWorkspace — backward compat) ────────────────
export const DEMO_SCENARIO = {
  id: 'scenario-001',
  title: 'Defect Rate Spike — Line 3',
  difficulty: 'Beginner',
  estimatedTime: '30 min',
  description:
    'Investigate a sudden defect rate increase on Assembly Line 3 and determine root cause using evidence-based RCA.',
  context:
    'Assembly Line 3 at Plant A has reported a 12% defect rate over the past 3 shifts, compared to a baseline of 2.1%. ' +
    'The shift supervisor flagged 45 rejected units in Batch B-2301. Quality team has been asked to identify root cause ' +
    'and propose corrective action before resuming full production.',
  processData: {
    lineId: 'Line-3',
    product: 'Motor Assembly Unit MX-7',
    baseline_defect_rate: '2.1%',
    current_defect_rate: '12.0%',
    production_volume: '375 units / shift',
    observation_period: 'Last 3 shifts (Oct 14–16)',
    machines: [
      { id: 'M-301', status: 'Normal', notes: 'Calibrated Oct 10' },
      { id: 'M-302', status: 'Under Review', notes: 'Vibration anomaly detected Oct 15' },
      { id: 'M-303', status: 'Normal', notes: 'Last PM: Oct 5' },
    ],
  },
  sopExcerpt: `SOP QA-007 Rev 3: Defect Escalation Protocol
1. Identify affected batch range
2. Quarantine non-conforming units
3. Notify QA Lead within 1 hour of threshold breach
4. Initiate RCA within 4 hours
5. Corrective action plan required within 24 hours
6. Do not restart production until root cause confirmed`,
  defectLog: [
    { batchId: 'B-2298', shift: 'Day 1', defectRate: '2.3%' },
    { batchId: 'B-2299', shift: 'Day 2', defectRate: '2.1%' },
    { batchId: 'B-2300', shift: 'Night 1', defectRate: '6.8%' },
    { batchId: 'B-2301', shift: 'Day 3', defectRate: '12.0%' },
    { batchId: 'B-2302', shift: 'Night 2', defectRate: '11.4%' },
  ],
  operatorNote: `Operator Note — Oct 15, Night Shift:
"Machine M-302 started making clicking noise around 11 PM.
I reported it to the shift lead but we kept running because
we had a delivery deadline. By end of shift, about 1 in 8
units had visible surface scratches on the housing.
I think the fixture alignment might be off."
— Operator ID: OP-117`,
};
