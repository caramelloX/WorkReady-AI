import React from 'react';
import './SkillGapResult.css';
import { getReadinessLevel } from '../../utils/readiness.js';
import { useLanguage } from '../../contexts/LanguageContext';

const SKILL_LABELS = {
  processMap:    'Industrial Flow & Process Mapping',
  safetyRisk:    'Safety & Quality Risk',
  rca:           'Evidence-Based RCA',
  traceability:  'Documentation & Traceability',
  memo:          'Technical Communication',
  responsibleAi: 'Responsible AI Usage',
};

const LEVEL_SCORE = { high: 100, medium: 50, low: 10 };

export default function SkillGapResult({
  student,
  aiRatings,
  overallReadiness,
  recommendedResult,
  mentorMatchResult,
  onStartScenario,
  onViewScenarioDetail,
  onMessageMentor,
  onBack,
}) {
  const { t } = useLanguage();
  const readinessInfo = getReadinessLevel(overallReadiness || 0);

  const skillRows = Object.entries(SKILL_LABELS).map(([key, label]) => {
    const val = aiRatings?.[key] || 'low';
    const score = LEVEL_SCORE[val] ?? 10;
    const color = score >= 80 ? '#10B981' : score >= 50 ? '#3B82F6' : '#F59E0B';
    return { key, label, score, color, val };
  });

  const sortedSkills = [...skillRows].sort((a, b) => a.score - b.score);
  const scenario = recommendedResult?.scenario;
  const mentor = mentorMatchResult?.mentor;

  const REVIEW_CAP_LABELS = {
    canReviewProcessMap:    'Process Map',
    canReviewRiskChecklist: 'Risk Checklist',
    canReviewRca:           'RCA Report',
    canReviewTechnicalMemo: 'Technical Memo',
    canReviewAiUsageLog:    'AI Usage Log',
  };

  return (
    <div className="sgr-root">

      {/* Header */}
      <div className="sgr-header">
        <button className="sgr-back-btn" onClick={onBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back
        </button>
        <div>
          <h1 className="sgr-title">Skill Gap Assessment Result</h1>
          <p className="sgr-subtitle">Your personalised readiness snapshot and scenario recommendation</p>
        </div>
      </div>

      {/* Responsible AI Notice */}
      <div className="sgr-notice">
        <svg viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" width="20" height="20" style={{ flexShrink: 0 }}>
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <p>
          <strong>AI Recommendation Notice:</strong> This recommendation is a support tool only. Your assigned scenario and mentor must be confirmed by an Admin. This system does not make employment or final training decisions.
        </p>
      </div>

      <div className="sgr-body">

        {/* LEFT COLUMN */}
        <div className="sgr-left">

          {/* Readiness Summary Card */}
          <div className="sgr-card sgr-readiness-card">
            <div className="sgr-card-header">
              <h3>Readiness Overview</h3>
            </div>
            <div className="sgr-readiness-row">
              <div className="sgr-score-circle" style={{ background: readinessInfo.color }}>
                <span className="sgr-score-num">{overallReadiness || 0}</span>
                <span className="sgr-score-max">/100</span>
              </div>
              <div>
                <div className="sgr-readiness-level" style={{ color: readinessInfo.color }}>
                  {readinessInfo.level}
                </div>
                <div className="sgr-readiness-desc">{readinessInfo.desc || 'Keep practising to improve your score.'}</div>
                <div className="sgr-student-meta">
                  <span>{student?.target_track?.replace(/_/g, ' ') || 'Track not set'}</span>
                  <span>·</span>
                  <span>{student?.major || student?.education_level || 'Major not set'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Breakdown */}
          <div className="sgr-card">
            <div className="sgr-card-header">
              <h3>Skill Breakdown</h3>
            </div>
            <div className="sgr-skills-list">
              {sortedSkills.map(skill => (
                <div className="sgr-skill-row" key={skill.key}>
                  <div className="sgr-skill-info">
                    <span className="sgr-skill-name">{skill.label}</span>
                    <span className="sgr-skill-score" style={{ color: skill.color }}>{skill.score}/100</span>
                  </div>
                  <div className="sgr-skill-bar-outer">
                    <div className="sgr-skill-bar-inner" style={{ width: `${skill.score}%`, background: skill.color }} />
                  </div>
                  {skill.score <= 10 && (
                    <span className="sgr-gap-tag">Priority Gap</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="sgr-right">

          {/* Recommended Scenario */}
          {scenario ? (
            <div className="sgr-card sgr-scenario-card">
              <div className="sgr-card-header">
                <h3>Recommended Scenario</h3>
                {recommendedResult?.score && (
                  <span className="sgr-match-badge">{recommendedResult.score}% match</span>
                )}
              </div>

              <div className="sgr-scenario-title-row">
                <div className="sgr-scenario-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <div>
                  <div className="sgr-scenario-name">{scenario.title}</div>
                  <div className="sgr-scenario-meta">
                    <span className="sgr-pill">{scenario.difficulty}</span>
                    <span className="sgr-pill">{scenario.estimatedTime}</span>
                    <span className="sgr-pill">{scenario.primaryTrack?.replace(/_/g, ' ')}</span>
                  </div>
                </div>
              </div>

              <p className="sgr-scenario-desc">{scenario.description}</p>

              {/* Match Reasons */}
              {recommendedResult?.reasons?.length > 0 && (
                <div className="sgr-reasons">
                  <div className="sgr-reasons-label">Why this scenario was recommended:</div>
                  <ul className="sgr-reasons-list">
                    {recommendedResult.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Focus Subskills */}
              {scenario.focusSubskills?.length > 0 && (
                <div className="sgr-subskills">
                  <div className="sgr-subskills-label">Focus subskills:</div>
                  <div className="sgr-subskills-chips">
                    {scenario.focusSubskills.map((sub, i) => (
                      <span key={i} className="sgr-chip">{sub}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="sgr-scenario-actions">
                <button className="sgr-btn-primary" onClick={() => onStartScenario?.(scenario)}>
                  Start Scenario
                </button>
                <button className="sgr-btn-secondary" onClick={() => onViewScenarioDetail?.(scenario)}>
                  View Details
                </button>
              </div>
            </div>
          ) : (
            <div className="sgr-card sgr-empty">
              <p>No scenario recommendation available. Complete the skill assessment to receive a recommendation.</p>
            </div>
          )}

          {/* Suggested Mentor */}
          {mentor ? (
            <div className="sgr-card sgr-mentor-card">
              <div className="sgr-card-header">
                <h3>Suggested Mentor</h3>
                {mentorMatchResult?.matchScore && (
                  <span className="sgr-match-badge" style={{ background: '#F5F3FF', color: '#8B5CF6', border: '1px solid #DDD6FE' }}>
                    {mentorMatchResult.matchScore}% match
                  </span>
                )}
              </div>

              <div className="sgr-mentor-row">
                <div className="sgr-mentor-avatar">
                  {(mentor.fullname || 'M').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div className="sgr-mentor-name">{mentor.fullname}</div>
                  <div className="sgr-mentor-title">{mentor.jobTitle}</div>
                  <div className="sgr-mentor-capacity">
                    {mentor.currentStudents}/{mentor.maxStudents} students · {mentor.availableStatus}
                  </div>
                </div>
              </div>

              {/* Match Reasons */}
              {mentorMatchResult?.matchReason?.length > 0 && (
                <div className="sgr-reasons">
                  <div className="sgr-reasons-label">Why this mentor was suggested:</div>
                  <ul className="sgr-reasons-list">
                    {mentorMatchResult.matchReason.slice(0, 4).map((r, i) => (
                      <li key={i} style={{ color: r.includes('⚠') ? '#DC2626' : 'inherit' }}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Review Capabilities */}
              {scenario?.reviewCapabilitiesRequired?.length > 0 && (
                <div className="sgr-capabilities">
                  <div className="sgr-capabilities-label">Can review for this scenario:</div>
                  <div className="sgr-capabilities-chips">
                    {scenario.reviewCapabilitiesRequired.map(cap => (
                      <span
                        key={cap}
                        className={`sgr-cap-chip ${mentor[cap] ? 'can' : 'cannot'}`}
                      >
                        {mentor[cap] ? '✓' : '✗'} {REVIEW_CAP_LABELS[cap] || cap}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="sgr-mentor-notice">
                Admin must confirm final mentor assignment. This suggestion is AI-assisted only.
              </div>

              <button className="sgr-btn-secondary sgr-btn-full" onClick={() => onMessageMentor?.(mentor)}>
                Message Mentor
              </button>
            </div>
          ) : (
            <div className="sgr-card sgr-empty">
              <p>Mentor suggestion will appear after scenario recommendation is confirmed by Admin.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
