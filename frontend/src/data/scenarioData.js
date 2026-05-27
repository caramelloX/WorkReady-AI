/**
 * WorkReady AI — Scenario & Reference Data
 * Synthetic demo data only. No real factory or personal data.
 */

// ── Faculties ──────────────────────────────────────────────────────────────
export const FACULTIES = [
  { id: 'faculty-1', name: 'Industrial Technology' },
  { id: 'faculty-2', name: 'Engineering' },
  { id: 'faculty-3', name: 'Information Technology' },
];

// ── Majors ─────────────────────────────────────────────────────────────────
export const MAJORS = [
  { code: 'industrial_technology',   name: 'Industrial Technology',          facultyId: 'faculty-1' },
  { code: 'safety_engineering',      name: 'Safety Engineering',             facultyId: 'faculty-1' },
  { code: 'quality_management',      name: 'Quality Management',             facultyId: 'faculty-1' },
  { code: 'mechanical_engineering',  name: 'Mechanical Engineering',         facultyId: 'faculty-2' },
  { code: 'electrical_engineering',  name: 'Electrical Engineering',         facultyId: 'faculty-2' },
  { code: 'industrial_engineering',  name: 'Industrial Engineering',         facultyId: 'faculty-2' },
  { code: 'computer_science',        name: 'Computer Science',               facultyId: 'faculty-3' },
  { code: 'information_systems',     name: 'Information Systems',            facultyId: 'faculty-3' },
  { code: 'data_science',            name: 'Data Science',                   facultyId: 'faculty-3' },
  { code: 'robotics_automation',     name: 'Robotics & Automation',          facultyId: 'faculty-2' },
];

// ── Skills (6 core) ────────────────────────────────────────────────────────
export const SKILLS = [
  {
    code: 'industrial_flow_process_map',
    gapKey: 'processMap',
    name: 'Industrial Flow & Process Mapping',
    weight: 0.25,
    subskills: [
      'swim-lane diagram',
      'value stream mapping',
      'process step identification',
      'bottleneck analysis',
      'flow documentation',
    ],
  },
  {
    code: 'safety_quality_risk',
    gapKey: 'safetyRisk',
    name: 'Safety & Quality Risk Assessment',
    weight: 0.20,
    subskills: [
      'risk matrix',
      'SOP compliance check',
      'hazard identification',
      'corrective action planning',
      'quality checkpoint review',
    ],
  },
  {
    code: 'evidence_based_rca',
    gapKey: 'rca',
    name: 'Evidence-Based Root Cause Analysis',
    weight: 0.15,
    subskills: [
      '5-Why method',
      'fishbone diagram',
      'evidence vs assumption tagging',
      'causal chain documentation',
      'verification planning',
    ],
  },
  {
    code: 'documentation_traceability',
    gapKey: 'traceability',
    name: 'Documentation & Traceability',
    weight: 0.20,
    subskills: [
      'batch record keeping',
      'change log maintenance',
      'evidence file linking',
      'audit trail creation',
      'version control',
    ],
  },
  {
    code: 'technical_communication',
    gapKey: 'memo',
    name: 'Technical Communication',
    weight: 0.15,
    subskills: [
      'technical memo writing',
      'incident report structure',
      'stakeholder summary',
      'recommendation clarity',
      'executive briefing',
    ],
  },
  {
    code: 'responsible_ai_usage',
    gapKey: 'responsibleAi',
    name: 'Responsible AI Usage',
    weight: 0.05,
    subskills: [
      'AI suggestion verification',
      'human decision logging',
      'AI limitation awareness',
      'bias check',
      'AI action traceability',
    ],
  },
];

// ── Key mapping: old gap key → new skill code ──────────────────────────────
export const SKILL_CODE_MAP = {
  processMap:    'industrial_flow_process_map',
  safetyRisk:    'safety_quality_risk',
  rca:           'evidence_based_rca',
  traceability:  'documentation_traceability',
  memo:          'technical_communication',
  responsibleAi: 'responsible_ai_usage',
};

// ── Scenarios ──────────────────────────────────────────────────────────────
export const SCENARIOS = [
  {
    id: 'scenario-001',
    title: 'Defect Rate Spike — Line 3',
    description:
      'Investigate a sudden defect rate increase on Assembly Line 3 and determine root cause using evidence-based RCA.',
    primaryTrack: 'quality_assurance',
    secondaryTrack: null,
    mainSkillCode: 'evidence_based_rca',
    relatedSkills: ['documentation_traceability', 'technical_communication'],
    focusSubskills: [
      '5-Why method',
      'evidence vs assumption tagging',
      'causal chain documentation',
      'technical memo writing',
    ],
    difficulty: 'beginner',
    estimatedTime: '30 min',
    targetFaculties: ['faculty-1'],
    targetMajors: ['industrial_technology', 'quality_management'],
    reviewCapabilitiesRequired: ['canReviewRca', 'canReviewProcessMap', 'canReviewTechnicalMemo'],
    careerGoalKeywords: ['quality', 'qa', 'technician', 'inspector', 'defect', 'assurance'],
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
  },
  {
    id: 'scenario-002',
    title: 'Machine Downtime Investigation',
    description:
      'Map the process flow for a recurring machine downtime event and identify where the breakdown originates in the workflow.',
    primaryTrack: 'maintenance_machine',
    secondaryTrack: null,
    mainSkillCode: 'industrial_flow_process_map',
    relatedSkills: ['evidence_based_rca', 'documentation_traceability'],
    focusSubskills: [
      'swim-lane diagram',
      'value stream mapping',
      'process step identification',
      'bottleneck analysis',
      '5-Why method',
    ],
    difficulty: 'beginner',
    estimatedTime: '30 min',
    targetFaculties: ['faculty-2'],
    targetMajors: ['mechanical_engineering', 'industrial_engineering'],
    reviewCapabilitiesRequired: ['canReviewProcessMap', 'canReviewRca', 'canReviewTechnicalMemo'],
    careerGoalKeywords: ['machine', 'maintenance', 'technician', 'repair', 'mechanic', 'equipment'],
    context:
      'CNC Machine MC-07 on Production Floor B has experienced 4 unplanned stoppages in the past two weeks, ' +
      'each lasting between 45 minutes and 2 hours. The total downtime is 7.5 hours, costing approximately ' +
      '₿18,750 in lost output. Maintenance logs are incomplete and the root cause remains unknown.',
    processData: {
      lineId: 'Floor-B',
      product: 'CNC Machine MC-07',
      baseline_defect_rate: '< 2 hrs downtime/month',
      current_defect_rate: '7.5 hrs downtime (2 weeks)',
      production_volume: '120 parts / shift',
      observation_period: 'Oct 1–14',
      machines: [
        { id: 'MC-07', status: 'Under Review', notes: '4 stoppages recorded' },
        { id: 'MC-08', status: 'Normal', notes: 'Adjacent machine, no issues' },
        { id: 'MC-09', status: 'Normal', notes: 'Maintenance scheduled Nov 1' },
      ],
    },
    sopExcerpt: `SOP MT-012 Rev 2: Machine Stoppage Protocol
1. Record stoppage time and observed symptoms immediately
2. Do not attempt restart without supervisor approval
3. Notify maintenance lead within 15 minutes
4. Complete failure report form MT-F01
5. Root cause must be documented before return-to-service
6. Recurrence prevention plan required after 3rd stoppage`,
    defectLog: [
      { batchId: 'Oct-01', shift: 'Morning', defectRate: '45 min stoppage' },
      { batchId: 'Oct-05', shift: 'Afternoon', defectRate: '2 hr stoppage' },
      { batchId: 'Oct-10', shift: 'Morning', defectRate: '1.5 hr stoppage' },
      { batchId: 'Oct-14', shift: 'Night', defectRate: '3.5 hr stoppage' },
    ],
    operatorNote: `Maintenance Log — Oct 14:
"MC-07 stopped again at 23:15. Motor made grinding sound
before shutdown. Coolant level was low — I topped it up
and tried to restart but it wouldn't come on.
We've reported the noise twice before but no fix was done.
The last PM was 6 weeks ago, which is overdue."
— Technician ID: MT-223`,
  },
  {
    id: 'scenario-003',
    title: 'Production Line Bottleneck',
    description:
      'Identify a safety and quality risk caused by a bottleneck in the production line and propose a corrective workflow.',
    primaryTrack: 'production_process',
    secondaryTrack: 'safety_compliance',
    mainSkillCode: 'safety_quality_risk',
    relatedSkills: ['industrial_flow_process_map', 'technical_communication'],
    focusSubskills: [
      'risk matrix',
      'SOP compliance check',
      'hazard identification',
      'corrective action planning',
      'bottleneck analysis',
    ],
    difficulty: 'intermediate',
    estimatedTime: '35 min',
    targetFaculties: ['faculty-1', 'faculty-2'],
    targetMajors: ['industrial_technology', 'industrial_engineering', 'safety_engineering'],
    reviewCapabilitiesRequired: ['canReviewProcessMap', 'canReviewRiskChecklist', 'canReviewTechnicalMemo'],
    careerGoalKeywords: ['production', 'process', 'analyst', 'engineer', 'lean', 'improvement', 'operations'],
    context:
      'Station 4 on Line 2 is processing parts 40% slower than adjacent stations, causing a backlog that forces ' +
      'operators to skip safety checks to keep pace. In the past week, 3 near-miss incidents were reported near ' +
      'Station 4. The Production Manager wants a risk assessment and corrective plan within 48 hours.',
    processData: {
      lineId: 'Line-2, Station 4',
      product: 'Hydraulic Valve Assembly HV-3',
      baseline_defect_rate: 'Target: 95 units/hr',
      current_defect_rate: '57 units/hr (Station 4)',
      production_volume: '760 units / shift',
      observation_period: 'Oct 7–14',
      machines: [
        { id: 'ST-401', status: 'Under Review', notes: 'Throughput 40% below target' },
        { id: 'ST-402', status: 'Normal', notes: 'Upstream backlog accumulating' },
        { id: 'ST-403', status: 'Normal', notes: 'Operators skipping visual check step' },
      ],
    },
    sopExcerpt: `SOP PP-005 Rev 4: Production Line Safety Check
1. Operators must complete visual inspection at each station
2. No station skip permitted during safety check window
3. Backlog > 20 units requires immediate supervisor notification
4. Near-miss incident requires same-shift reporting
5. Risk assessment required when throughput falls > 20% below target
6. Corrective action must be approved before line speed change`,
    defectLog: [
      { batchId: 'Oct-07', shift: 'Morning', defectRate: '3 safety checks skipped' },
      { batchId: 'Oct-09', shift: 'Afternoon', defectRate: '1 near-miss reported' },
      { batchId: 'Oct-11', shift: 'Morning', defectRate: '2 near-misses reported' },
      { batchId: 'Oct-14', shift: 'Night', defectRate: 'Backlog: 34 units (station 4)' },
    ],
    operatorNote: `Supervisor Note — Oct 14:
"The team at Station 4 is working flat out but they can't
keep up. The assembly jig is misaligned so each unit takes
an extra 22 seconds. We've been skipping the visual check
to hit the line speed target. I've flagged it twice but
nothing has been fixed. Someone is going to get hurt."
— Supervisor ID: SP-045`,
  },
  {
    id: 'scenario-004',
    title: 'Safety Compliance Audit',
    description:
      'Conduct a safety compliance audit on a work area and produce a risk assessment report with corrective recommendations.',
    primaryTrack: 'safety_compliance',
    secondaryTrack: 'quality_assurance',
    mainSkillCode: 'safety_quality_risk',
    relatedSkills: ['documentation_traceability', 'technical_communication'],
    focusSubskills: [
      'risk matrix',
      'hazard identification',
      'SOP compliance check',
      'audit trail creation',
      'technical memo writing',
    ],
    difficulty: 'intermediate',
    estimatedTime: '35 min',
    targetFaculties: ['faculty-1', 'faculty-2'],
    targetMajors: ['safety_engineering', 'industrial_technology', 'mechanical_engineering'],
    reviewCapabilitiesRequired: ['canReviewRiskChecklist', 'canReviewProcessMap', 'canReviewTechnicalMemo'],
    careerGoalKeywords: ['safety', 'compliance', 'audit', 'officer', 'inspector', 'hse', 'environment'],
    context:
      'Warehouse Zone C has had two recordable injuries in the past 6 months and is due for an annual compliance audit. ' +
      'The HSE team has 3 days to complete a full audit, identify non-compliant areas, assess risk levels, ' +
      'and submit a corrective action plan to management.',
    processData: {
      lineId: 'Warehouse Zone C',
      product: 'Storage & Logistics Area',
      baseline_defect_rate: '0 recordable injuries / year',
      current_defect_rate: '2 recordable injuries (6 months)',
      production_volume: '45 staff, 3 shifts',
      observation_period: 'Apr–Oct (6 months)',
      machines: [
        { id: 'Fork-01', status: 'Under Review', notes: 'Safety cage damaged, Oct 10' },
        { id: 'Shelf-Row-C', status: 'Under Review', notes: 'Overloaded, max weight exceeded' },
        { id: 'Exit-C2', status: 'Under Review', notes: 'Emergency exit partially blocked' },
      ],
    },
    sopExcerpt: `SOP HSE-001 Rev 5: Annual Safety Audit Protocol
1. Pre-audit checklist must be completed by HSE lead
2. All near-miss and incident reports reviewed
3. Physical inspection of all equipment and access routes
4. Risk matrix must be completed for all identified hazards
5. Critical risks (severity High + likelihood Likely) require 24hr action
6. Final report submitted to management within 5 working days`,
    defectLog: [
      { batchId: 'Apr-15', shift: 'Morning', defectRate: 'Recordable: Slip injury' },
      { batchId: 'Jul-22', shift: 'Afternoon', defectRate: 'Recordable: Forklift near-miss' },
      { batchId: 'Sep-08', shift: 'Night', defectRate: '3 near-misses (same week)' },
      { batchId: 'Oct-10', shift: 'Morning', defectRate: 'Safety cage damage found' },
    ],
    operatorNote: `HSE Note — Oct 10:
"I found Fork-01's safety cage cracked during morning check.
The cage has been damaged for at least 2 weeks based on the
photos I found. Shelf Row C was visibly overloaded — I counted
at least 400 kg over the rated limit. Exit C2 has a pallet
blocking part of the door. I've reported all three to the
warehouse manager but no action has been taken yet."
— HSE Officer ID: HSE-012`,
  },
];

// ── Scenario enrichment: status, structured fields, tasks, mentor requirements
// Merged by ScenarioManager at runtime. Keeps base SCENARIOS backward-compatible.
export const SCENARIO_ENRICHMENT = {
  'scenario-001': {
    status: 'active',
    requiredMentorTracks: ['quality_assurance', 'safety_compliance'],
    requiredMentorSkills: ['evidence_based_rca', 'technical_communication', 'documentation_traceability'],
    preferredMentorKeywords: ['QA', 'RCA', 'defect', 'quality', 'inspection'],
    targetRoles: ['Junior QA Technician', 'QC Inspector', 'Quality Analyst'],
    subskillsStructured: [
      { id: 1, text: '5-Why method',                    difficulty: 'medium', weight: 25, questionCount: 2 },
      { id: 2, text: 'Evidence vs assumption tagging',   difficulty: 'easy',   weight: 20, questionCount: 1 },
      { id: 3, text: 'Causal chain documentation',      difficulty: 'hard',   weight: 25, questionCount: 1 },
      { id: 4, text: 'Technical memo writing',           difficulty: 'medium', weight: 20, questionCount: 1 },
      { id: 5, text: 'AI suggestion verification',       difficulty: 'easy',   weight: 10, questionCount: 1 },
    ],
    requiredPortfolioOutputs: {
      canReviewProcessMap: true, canReviewRiskChecklist: true,
      canReviewRca: true, canReviewTechnicalMemo: true, canReviewAiUsageLog: true,
    },
    tasks: [
      { id: 1, subskillText: 'Evidence vs assumption tagging', difficulty: 'easy', questionType: 'table_input', questionText: 'Review the defect log and operator note. Classify each piece of information as a confirmed fact or an assumption. For assumptions, state what evidence would be needed to confirm them.', expectedAnswer: 'Confirmed facts: batch defect rates, M-302 vibration report. Assumptions: fixture misalignment caused scratches (needs alignment measurement log).', evidenceRequired: 'Defect log (B-2298–B-2302), operator note Oct 15', score: 10, feedbackHint: 'At least 2 confirmed facts and 1 assumption with evidence required.' },
      { id: 2, subskillText: '5-Why method', difficulty: 'medium', questionType: 'rca', questionText: 'Using the 5-Why method, trace the root cause of the defect rate spike on Line 3. Begin from the observed symptom: surface scratches on motor housings from Batch B-2301.', expectedAnswer: 'Why 1: M-302 fixture misaligned. Why 2: Alignment not checked before shift. Why 3: SOP QA-007 does not require pre-shift M-302 alignment check. Why 4: SOP not updated after last audit flagged M-302 sensitivity. Why 5: No system for tracking SOP update status after audit findings.', evidenceRequired: 'Machine logs, SOP QA-007, operator note', score: 25, feedbackHint: 'All 5 whys must be answered. Chain must be logical and evidence-supported.' },
      { id: 3, subskillText: 'Causal chain documentation', difficulty: 'hard', questionType: 'short_answer', questionText: 'Document the full causal chain from initial trigger to observed outcome. Identify the primary cause, contributing factors, and the point at which the defect became detectable.', expectedAnswer: 'Primary cause: M-302 fixture misalignment. Contributing: no pre-shift check SOP, production deadline pressure. Detectable: end of Night 1 shift after 1-in-8 rejection rate was noticed.', evidenceRequired: 'Process data, operator note, batch log', score: 20, feedbackHint: 'Must include primary cause + at least 2 contributing factors.' },
      { id: 4, subskillText: 'Technical memo writing', difficulty: 'medium', questionType: 'memo', questionText: 'Write a technical memo to the QA Lead and Production Manager summarising the incident, root cause, and recommended corrective actions. Follow the memo structure: Subject, Problem Summary, Evidence, Analysis, Recommended Action, Next Step.', expectedAnswer: 'Clear subject line, factual problem summary citing batch numbers, evidence citing operator note and defect log, RCA analysis referencing 5-Why findings, corrective actions with timelines, specific next step with responsible party.', evidenceRequired: 'RCA findings from Task 2 and Task 3', score: 25, feedbackHint: 'Memo must follow all 6 sections. Recommended actions must be specific and time-bound.' },
      { id: 5, subskillText: 'AI suggestion verification', difficulty: 'easy', questionType: 'reflection', questionText: 'After receiving an AI coach suggestion about the probable root cause, describe: (1) what the AI suggested, (2) whether you accepted, modified, or rejected it, and (3) the specific reason for your decision based on evidence.', expectedAnswer: 'Example: AI suggested fixture misalignment. I accepted this with modification — AI did not mention the SOP gap, which I added based on the operator note and last audit record.', evidenceRequired: 'AI coach interaction log', score: 10, feedbackHint: 'Must state specific evidence used to evaluate the AI suggestion. "I agreed" alone is insufficient.' },
    ],
    version: 1, createdAt: '2024-09-15', updatedAt: '2024-10-17',
  },

  'scenario-002': {
    status: 'active',
    requiredMentorTracks: ['maintenance_machine', 'production_process'],
    requiredMentorSkills: ['industrial_flow_process_map', 'evidence_based_rca', 'documentation_traceability'],
    preferredMentorKeywords: ['maintenance', 'machine', 'process map', 'downtime', 'troubleshoot'],
    targetRoles: ['Machine Maintenance Technician', 'Maintenance Engineer', 'Equipment Specialist'],
    subskillsStructured: [
      { id: 1, text: 'Swim-lane diagram',             difficulty: 'medium', weight: 25, questionCount: 1 },
      { id: 2, text: 'Process step identification',    difficulty: 'easy',   weight: 20, questionCount: 2 },
      { id: 3, text: 'Bottleneck analysis',            difficulty: 'hard',   weight: 25, questionCount: 1 },
      { id: 4, text: '5-Why method',                   difficulty: 'medium', weight: 20, questionCount: 1 },
      { id: 5, text: 'Flow documentation',             difficulty: 'easy',   weight: 10, questionCount: 1 },
    ],
    requiredPortfolioOutputs: {
      canReviewProcessMap: true, canReviewRiskChecklist: false,
      canReviewRca: true, canReviewTechnicalMemo: true, canReviewAiUsageLog: true,
    },
    tasks: [
      { id: 1, subskillText: 'Process step identification', difficulty: 'easy', questionType: 'table_input', questionText: 'List all the process steps that occur from shift start to the point where MC-07 normally begins operation. Include responsible party and any known risk for each step.', expectedAnswer: 'Steps include: pre-shift machine check, coolant level check, tooling inspection, operator sign-off, machine startup. Risks: coolant level and tooling condition may be skipped under time pressure.', evidenceRequired: 'SOP MT-012, maintenance log', score: 10, feedbackHint: 'Minimum 4 steps. Each step needs responsible party and risk flag.' },
      { id: 2, subskillText: 'Swim-lane diagram', difficulty: 'medium', questionType: 'table_input', questionText: 'Map the machine stoppage process in a swim-lane format. Lanes: Operator, Maintenance Lead, Machine (MC-07). Show what each party does from stoppage detection to return-to-service.', expectedAnswer: 'Operator: detects stoppage, records time and symptoms, notifies maintenance lead. Maintenance lead: responds, diagnoses, approves restart. MC-07: stops, undergoes diagnosis, restarts after clearance.', evidenceRequired: 'SOP MT-012, stoppage log', score: 20, feedbackHint: 'All 3 lanes must be populated. Key handoff points between lanes must be identified.' },
      { id: 3, subskillText: '5-Why method', difficulty: 'medium', questionType: 'rca', questionText: 'Apply the 5-Why method to the most recent and longest stoppage (Oct 14, 3.5 hr). Begin from: MC-07 would not restart after coolant top-up.', expectedAnswer: 'Why 1: Motor would not start after coolant refill. Why 2: Motor damage from sustained dry running / overheating. Why 3: Coolant was not checked as part of pre-shift procedure. Why 4: Pre-shift coolant check is not mandated in SOP MT-012. Why 5: Last PM overdue (6 weeks ago vs scheduled) — PM gap allowed condition to develop undetected.', evidenceRequired: 'Maintenance log Oct 14, SOP MT-012', score: 25, feedbackHint: 'Root cause must link back to SOP/PM gap, not just the coolant issue.' },
      { id: 4, subskillText: 'Bottleneck analysis', difficulty: 'hard', questionType: 'short_answer', questionText: 'Given 4 stoppages totalling 7.5 hours over 2 weeks, identify where in the maintenance workflow the bottleneck exists and why it is persisting. Consider: response time, diagnosis, repair, and return-to-service.', expectedAnswer: 'Bottleneck is in the diagnosis phase: stoppages are recurring because root cause is never fully resolved — only symptoms are treated. PM backlog and incomplete maintenance logs prevent proper diagnosis. Return-to-service is rushed due to production pressure.', evidenceRequired: 'All 4 stoppage records, maintenance log', score: 20, feedbackHint: 'Must identify phase (diagnosis, repair, return-to-service) and structural cause, not just describe what happened.' },
      { id: 5, subskillText: 'Flow documentation', difficulty: 'easy', questionType: 'short_answer', questionText: 'Write a revised maintenance response flow for MC-07 that would prevent recurrence. Include: who is responsible for each action, time limits for each step, and what documentation is required.', expectedAnswer: 'Revised flow: 1. Operator records symptoms + time (immediate). 2. Notify maintenance lead within 15 min. 3. Maintenance lead diagnoses with checklist (30 min max). 4. Root cause documented in MT-F01 before any restart attempt. 5. PM check scheduled within 48 hrs of any stoppage.', evidenceRequired: 'SOP MT-012, revised based on RCA', score: 15, feedbackHint: 'Must include responsible party, time limit, and documentation requirement for each step.' },
    ],
    version: 1, createdAt: '2024-09-15', updatedAt: '2024-10-17',
  },

  'scenario-003': {
    status: 'active',
    requiredMentorTracks: ['production_process', 'safety_compliance'],
    requiredMentorSkills: ['safety_quality_risk', 'industrial_flow_process_map', 'technical_communication'],
    preferredMentorKeywords: ['production', 'bottleneck', 'safety', 'process improvement', 'lean', 'risk'],
    targetRoles: ['Production Process Analyst', 'Production Engineer', 'IE Analyst'],
    subskillsStructured: [
      { id: 1, text: 'Risk matrix',                  difficulty: 'medium', weight: 25, questionCount: 1 },
      { id: 2, text: 'SOP compliance check',          difficulty: 'easy',   weight: 20, questionCount: 2 },
      { id: 3, text: 'Hazard identification',         difficulty: 'medium', weight: 20, questionCount: 1 },
      { id: 4, text: 'Corrective action planning',    difficulty: 'hard',   weight: 25, questionCount: 1 },
      { id: 5, text: 'Bottleneck analysis',           difficulty: 'medium', weight: 10, questionCount: 1 },
    ],
    requiredPortfolioOutputs: {
      canReviewProcessMap: true, canReviewRiskChecklist: true,
      canReviewRca: false, canReviewTechnicalMemo: true, canReviewAiUsageLog: true,
    },
    tasks: [
      { id: 1, subskillText: 'SOP compliance check', difficulty: 'easy', questionType: 'checklist', questionText: 'Review SOP PP-005 Rev 4 and check which steps are currently NOT being followed at Station 4. For each non-compliant step, state the evidence and the risk.', expectedAnswer: 'Non-compliant: Step 1 (visual inspection being skipped), Step 3 (backlog at 34 units > 20 unit limit, not reported), Step 4 (near-misses not reported same shift on Oct 7/9). Evidence: supervisor note, incident log.', evidenceRequired: 'SOP PP-005, incident log Oct 7–14, supervisor note', score: 10, feedbackHint: 'Must reference specific SOP steps by number. All 3 non-compliant items must be identified.' },
      { id: 2, subskillText: 'Hazard identification', difficulty: 'medium', questionType: 'table_input', questionText: 'Identify all active hazards at Station 4 as of Oct 14. For each hazard, state: type, source, current control (or lack of), and who is affected.', expectedAnswer: 'Hazard 1: Misaligned jig — physical injury risk. Source: ST-401. No current control. Affects operators. Hazard 2: Skipped safety checks — quality and safety degradation. Source: throughput pressure. Control: supervisor awareness only. Hazard 3: Backlog accumulation near station — congestion/collision risk.', evidenceRequired: 'SOP PP-005, supervisor note, incident log', score: 20, feedbackHint: 'At least 3 hazards. Each must have type, source, control status, and affected party.' },
      { id: 3, subskillText: 'Risk matrix', difficulty: 'medium', questionType: 'table_input', questionText: 'Complete a risk matrix for the top 3 hazards you identified. Rate each on Severity (Low/Medium/High) and Likelihood (Unlikely/Possible/Likely). Assign a combined Risk Level and recommend priority action.', expectedAnswer: 'Jig misalignment: Severity High × Likelihood Likely = CRITICAL — immediate fix. Skipped inspections: Severity High × Likelihood Confirmed = CRITICAL — halt until addressed. Backlog: Severity Medium × Likelihood Likely = HIGH — supervisor escalation needed.', evidenceRequired: 'Hazards from Task 2', score: 25, feedbackHint: 'Risk level must follow standard matrix logic (Severity × Likelihood). At least one CRITICAL or HIGH risk must be identified.' },
      { id: 4, subskillText: 'Corrective action planning', difficulty: 'hard', questionType: 'memo', questionText: 'Write a corrective action plan for the Production Manager. Include: the 2 most critical risks, immediate containment action, medium-term fix, responsible party, and timeline for each.', expectedAnswer: 'Risk 1 (jig misalignment): Immediate — stop Station 4, recalibrate jig today. Medium-term — add jig alignment to pre-shift checklist. Responsible: Maintenance Lead + Production Supervisor. Timeline: 4 hrs (immediate), 2 days (SOP update). Risk 2 (skipped inspections): Immediate — reinstate inspection with supervisor present. Medium-term — adjust line speed to sustainable rate.', evidenceRequired: 'Risk matrix from Task 3, SOP PP-005', score: 25, feedbackHint: 'Each risk must have both immediate AND medium-term action. Responsible party and timeline required.' },
      { id: 5, subskillText: 'Bottleneck analysis', difficulty: 'medium', questionType: 'short_answer', questionText: 'Calculate the throughput gap at Station 4 and identify what percentage of total line capacity is being lost due to this bottleneck. Then state the primary structural cause and one lean-based recommendation.', expectedAnswer: 'Gap: Target 95 units/hr — Actual 57 units/hr = 38 units/hr shortfall = 40% capacity loss. Primary cause: 22-second assembly jig delay per unit (structural equipment issue). Lean recommendation: Kaizen event to recalibrate jig and standardise setup time.', evidenceRequired: 'Process data (throughput figures)', score: 10, feedbackHint: 'Must include numeric calculation. Lean recommendation must be specific (not just "improve the process").' },
    ],
    version: 1, createdAt: '2024-09-20', updatedAt: '2024-10-20',
  },

  'scenario-004': {
    status: 'draft',
    requiredMentorTracks: ['safety_compliance', 'quality_assurance'],
    requiredMentorSkills: ['safety_quality_risk', 'documentation_traceability', 'technical_communication'],
    preferredMentorKeywords: ['safety', 'compliance', 'audit', 'HSE', 'risk assessment'],
    targetRoles: ['HSE Officer', 'Safety Compliance Analyst', 'Safety Inspector'],
    subskillsStructured: [
      { id: 1, text: 'Hazard identification',         difficulty: 'medium', weight: 25, questionCount: 1 },
      { id: 2, text: 'Risk matrix',                   difficulty: 'medium', weight: 25, questionCount: 1 },
      { id: 3, text: 'Audit trail creation',           difficulty: 'hard',   weight: 20, questionCount: 1 },
      { id: 4, text: 'Technical memo writing',         difficulty: 'medium', weight: 20, questionCount: 1 },
      { id: 5, text: 'Corrective action planning',    difficulty: 'hard',   weight: 10, questionCount: 1 },
    ],
    requiredPortfolioOutputs: {
      canReviewProcessMap: false, canReviewRiskChecklist: true,
      canReviewRca: false, canReviewTechnicalMemo: true, canReviewAiUsageLog: true,
    },
    tasks: [
      { id: 1, subskillText: 'Hazard identification', difficulty: 'medium', questionType: 'table_input', questionText: 'Based on the HSE note and inspection records, list all hazards identified in Warehouse Zone C. For each: type, location, severity indicator, and current control status.', expectedAnswer: 'Hazard 1: Cracked forklift safety cage (Fork-01) — mechanical injury risk, discovered Oct 10, no repair yet. Hazard 2: Overloaded shelf Row C — collapse risk, >400 kg over rated limit, no action. Hazard 3: Blocked emergency exit C2 — evacuation risk, pallet blocking door, no action.', evidenceRequired: 'HSE note Oct 10, inspection log', score: 15, feedbackHint: 'All 3 hazards from the HSE note must be identified. Each needs location and control status.' },
      { id: 2, subskillText: 'Risk matrix', difficulty: 'medium', questionType: 'table_input', questionText: 'Complete a risk matrix for all 3 hazards. Assign Severity and Likelihood. Identify which require 24-hour action per SOP HSE-001 (Critical = High Severity + Likely).', expectedAnswer: 'Fork-01 cage: High × Likely = CRITICAL (24hr action). Shelf Row C: High × Likely = CRITICAL (24hr action). Exit C2: High × Likely = CRITICAL (24hr action). All 3 require immediate 24-hour response per SOP HSE-001.', evidenceRequired: 'Hazards from Task 1, SOP HSE-001', score: 25, feedbackHint: 'All 3 must be rated Critical. SOP HSE-001 Step 5 explicitly requires 24-hr action for Critical risks.' },
      { id: 3, subskillText: 'Audit trail creation', difficulty: 'hard', questionType: 'checklist', questionText: 'Create an audit trail checklist covering: (a) what evidence was reviewed, (b) what was physically inspected, (c) what gaps exist in the existing records, and (d) who was interviewed or notified.', expectedAnswer: 'Evidence: HSE incident reports, maintenance log for Fork-01, shelf loading records. Physical: Fork-01 cage, Shelf Row C, Exit C2. Gaps: No repair orders raised despite two prior reports. Notifications: Warehouse manager received 3 reports but took no action — must be documented.', evidenceRequired: 'All incident reports, HSE note, previous reports', score: 20, feedbackHint: 'Must address all 4 components (a–d). Gap in existing records must be explicitly called out.' },
      { id: 4, subskillText: 'Technical memo writing', difficulty: 'medium', questionType: 'memo', questionText: 'Write the audit findings memo to Management. Sections: Audit Scope, Summary of Findings, Critical Risks (with 24-hr actions), Medium-term Recommendations, and Next Audit Date.', expectedAnswer: 'Clear scope (Zone C, Apr–Oct). 3 critical findings with severity ratings. 24-hr actions for each critical hazard. Medium-term: schedule maintenance review board, update shelf weight policy, run emergency evacuation drill. Next audit: 3 months or after corrective actions verified.', evidenceRequired: 'Risk matrix from Task 2, SOP HSE-001', score: 25, feedbackHint: 'Memo must include all 5 sections. 24-hr actions must be stated for each CRITICAL risk.' },
      { id: 5, subskillText: 'Corrective action planning', difficulty: 'hard', questionType: 'short_answer', questionText: 'Draft a corrective action register for Warehouse Zone C. For each of the 3 critical hazards: immediate action, person responsible, due date, verification method, and escalation trigger.', expectedAnswer: 'Fork-01: Take offline, repair cage — Maintenance Supervisor — today — post-repair inspection. Shelf Row C: Unload to rated capacity — Warehouse Lead — today — weight re-measurement. Exit C2: Clear pallet immediately — Warehouse Lead — today — photographic evidence. Escalation trigger: if incomplete by end of shift, notify HSE Director.', evidenceRequired: 'All previous tasks', score: 15, feedbackHint: 'All 5 fields required per hazard. Escalation trigger is mandatory as per spec.' },
    ],
    version: 1, createdAt: '2024-10-01', updatedAt: '2024-10-25',
  },
};

// ── Pre-computed demo assignments ──────────────────────────────────────────
export const DEMO_ASSIGNMENTS = [
  {
    id: 'assign-001',
    studentId: 'student-001',
    scenarioId: 'scenario-001',
    mentorId: 'mentor-001',
    scenarioScore: 90,
    mentorScore: 90,
    status: 'suggested',
  },
  {
    id: 'assign-002',
    studentId: 'student-002',
    scenarioId: 'scenario-002',
    mentorId: 'mentor-002',
    scenarioScore: 90,
    mentorScore: 90,
    status: 'suggested',
  },
  {
    id: 'assign-003',
    studentId: 'student-003',
    scenarioId: 'scenario-003',
    mentorId: 'mentor-003',
    scenarioScore: 90,
    mentorScore: 95,
    status: 'suggested',
  },
];
