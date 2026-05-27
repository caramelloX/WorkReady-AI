/**
 * WorkReady AI — Core Type Definitions (JSDoc)
 * Since the project uses JavaScript, types are defined as JSDoc @typedef.
 * These serve as documentation and enable IDE type hints.
 */

/**
 * @typedef {'student'|'mentor'|'admin'|'employer'} UserRole
 */

/**
 * @typedef {'production_process'|'quality_assurance'|'safety_compliance'|'maintenance_machine'|'industrial_engineering'|'technical_documentation'|'ai_data_support'} CareerTrack
 */

/**
 * @typedef {'Awareness'|'Guided Practice'|'Work-Ready Basic'|'Strong Junior Talent'} ReadinessLevel
 */

/**
 * @typedef {'available'|'full'|'inactive'} MentorAvailability
 */

/**
 * @typedef {'pending'|'active'|'completed'} AssignmentStatus
 */

/**
 * @typedef {'system_suggestion'|'admin'|'mentor'} AssignedBy
 */

/**
 * @typedef {'not_started'|'in_progress'|'submitted'|'reviewed'|'needs_revision'} SubmissionStatus
 */

/**
 * @typedef {'Low'|'Medium'|'High'} Severity
 */

/**
 * @typedef {'Confirmed'|'Likely'|'Assumption'} ConfidenceLevel
 */

/**
 * @typedef {'accept'|'reject'|'revise'} HumanAction
 */

/**
 * @typedef {'Draft'|'Completed'|'Needs Review'|'Reviewed'} EvidenceStatus
 */

// ─── Core Entities ────────────────────────────────────────────────────────────

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} fullname
 * @property {UserRole} role
 * @property {string} email
 * @property {string} [avatar_base64]
 * @property {string} [bio]
 * @property {string} [phone]
 * @property {string} [location]
 */

/**
 * @typedef {Object} StudentProfile
 * @property {string} id
 * @property {string} major
 * @property {string} education_level
 * @property {CareerTrack} target_track
 * @property {string} target_industry
 * @property {string} career_goal
 * @property {string} occupation_goal
 * @property {string[]} strengths
 * @property {string[]} develop_areas
 */

/**
 * @typedef {Object} SkillGap
 * @property {'high'|'medium'|'low'|'none'} processMap
 * @property {'high'|'medium'|'low'|'none'} safetyRisk
 * @property {'high'|'medium'|'low'|'none'} rca
 * @property {'high'|'medium'|'low'|'none'} traceability
 * @property {'high'|'medium'|'low'|'none'} memo
 * @property {'high'|'medium'|'low'|'none'} responsibleAi
 */

/**
 * @typedef {Object} MentorProfile
 * @property {string} id
 * @property {string} fullname
 * @property {string} organization
 * @property {string} jobTitle
 * @property {CareerTrack[]} expertiseTracks
 * @property {string} expertise
 * @property {string} experience_years
 * @property {string} industryBackground
 * @property {number} maxStudents
 * @property {number} currentStudents
 * @property {MentorAvailability} availableStatus
 * @property {boolean} canReviewProcessMap
 * @property {boolean} canReviewRiskChecklist
 * @property {boolean} canReviewRca
 * @property {boolean} canReviewTechnicalMemo
 * @property {boolean} canReviewAiUsageLog
 * @property {string[]} keywords
 */

/**
 * @typedef {Object} MentorMatch
 * @property {string} studentId
 * @property {string} mentorId
 * @property {number} matchScore      0–100
 * @property {string[]} matchReason
 * @property {boolean} isRecommended
 * @property {AssignmentStatus} assignmentStatus
 * @property {AssignedBy} assignedBy
 */

// ─── Scenario & Stations ──────────────────────────────────────────────────────

/**
 * @typedef {Object} ScenarioFact
 * @property {string} claim
 * @property {boolean} [isAssumption]
 * @property {string} [evidenceNeeded]
 */

/**
 * @typedef {Object} ProcessStep
 * @property {number} id
 * @property {string} step
 * @property {string} responsible
 * @property {boolean} risk
 * @property {string} [notes]
 */

/**
 * @typedef {Object} RiskItem
 * @property {string} type   'Safety Risk'|'Quality Risk'|'SOP Deviation'|'Traceability Issue'
 * @property {string} description
 * @property {string} evidence
 * @property {Severity} severity
 * @property {ConfidenceLevel} confidence
 * @property {string} requiredEvidence
 * @property {string} suggestedAction
 */

/**
 * @typedef {Object} WhyStep
 * @property {number} why
 * @property {string} question
 * @property {string} answer
 */

/**
 * @typedef {Object} RcaLog
 * @property {string} problem
 * @property {WhyStep[]} fiveWhy
 * @property {string[]} availableEvidence
 * @property {string[]} missingEvidence
 * @property {string} initialCorrectiveAction
 * @property {string} verificationPlan
 */

/**
 * @typedef {Object} TechnicalMemo
 * @property {string} subject
 * @property {string} date
 * @property {string} preparedBy
 * @property {string} problemSummary
 * @property {string} evidence
 * @property {string} analysis
 * @property {string} recommendedAction
 * @property {string} nextStep
 */

/**
 * @typedef {Object} AiUsageEntry
 * @property {number} id
 * @property {string} task
 * @property {string} promptUsed
 * @property {string} aiSuggestion
 * @property {HumanAction} humanAction
 * @property {string} reason
 * @property {boolean} verifiedStatus
 * @property {'High'|'Medium'|'Low'} confidence
 */

/**
 * @typedef {Object} MentorFeedback
 * @property {string} mentorId
 * @property {string} reviewedAt
 * @property {'reviewed'|'needs_revision'} reviewStatus
 * @property {{ processMap: number, riskChecklist: number, rca: number, documentation: number, technicalMemo: number, responsibleAi: number, total: number }} scores
 * @property {ReadinessLevel} readinessLevel
 * @property {string} strength
 * @property {string} improvement
 * @property {string} missingEvidence
 * @property {string} suggestedNextStep
 * @property {string} finalComment
 */

/**
 * Scoring rubric weights
 */
export const RUBRIC = {
  processMap:    { label: 'Process Map',                            maxScore: 15 },
  riskChecklist: { label: 'Safety & Quality Risk Identification',   maxScore: 15 },
  rca:           { label: 'Evidence-Based Problem Solving & RCA',   maxScore: 25 },
  documentation: { label: 'Documentation Discipline & Traceability', maxScore: 15 },
  technicalMemo: { label: 'Technical Communication',                maxScore: 15 },
  responsibleAi: { label: 'Responsible AI Usage',                   maxScore: 15 },
};

export const RUBRIC_TOTAL = Object.values(RUBRIC).reduce((sum, r) => sum + r.maxScore, 0); // 100

/**
 * Station definitions for the 5-station workflow
 */
export const STATIONS = [
  { id: 1, key: 'factProcess',  label: 'Fact & Process',    shortLabel: 'Facts',    icon: 'lock'    },
  { id: 2, key: 'riskScan',     label: 'Risk Scan',          shortLabel: 'Risks',    icon: 'shield'  },
  { id: 3, key: 'rca',          label: 'RCA Investigation',  shortLabel: 'RCA',      icon: 'search'  },
  { id: 4, key: 'memo',         label: 'Technical Memo',     shortLabel: 'Memo',     icon: 'file'    },
  { id: 5, key: 'aiLog',        label: 'AI Usage Log',       shortLabel: 'AI Log',   icon: 'cpu'     },
];
