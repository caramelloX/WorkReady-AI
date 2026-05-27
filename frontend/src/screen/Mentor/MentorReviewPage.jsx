import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DEMO_PORTFOLIO_ANAN, DEMO_STUDENTS, DEMO_SCENARIO, DEMO_MENTORS } from '../../data/demoData';
import { getReadinessLevel } from '../../utils/readiness';
import './MentorReviewPage.css';

const RUBRIC = [
  { key: 'processMap',    labelKey: 'skills.processMapAss',          max: 15 },
  { key: 'riskChecklist', labelKey: 'skills.safetyRiskAss',          max: 15 },
  { key: 'rca',           labelKey: 'skills.rcaAss',                 max: 25 },
  { key: 'documentation', labelKey: 'skills.traceabilityAss',        max: 15 },
  { key: 'technicalMemo', labelKey: 'skills.memoAss',                max: 15 },
  { key: 'responsibleAi', labelKey: 'skills.responsibleAiAss',       max: 15 },
];

const TABS = [
  { key: 'processMap',    prefix: '1. ', labelKey: 'skills.processMapAss' },
  { key: 'riskChecklist', prefix: '2. ', labelKey: 'skills.safetyRiskAss' },
  { key: 'rcaLog',        prefix: '3. ', labelKey: 'skills.rcaAss' },
  { key: 'technicalMemo', prefix: '4. ', labelKey: 'skills.memoAss' },
  { key: 'aiUsageLog',    prefix: '5. ', labelKey: 'skills.responsibleAiAss' },
  { key: 'rubric',        prefix: '6. ', labelKey: 'mentor.reviewFeedback' },
];

export default function MentorReviewPage({ studentId, onBack }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('processMap');

  // Lookup demo data
  const student = DEMO_STUDENTS.find(s => s.id === studentId) || DEMO_STUDENTS[0];
  const mentor = DEMO_MENTORS[0];
  const portfolio = DEMO_PORTFOLIO_ANAN;

  // Per-section mentor notes
  const [notes, setNotes] = useState({
    processMap: '', riskChecklist: '', rcaLog: '', technicalMemo: '', aiUsageLog: ''
  });
  const [sectionStatus, setSectionStatus] = useState({
    processMap: 'Good', riskChecklist: 'Good', rcaLog: 'Good', technicalMemo: 'Good', aiUsageLog: 'Good'
  });

  // Rubric scoring
  const [scores, setScores] = useState({
    processMap:    portfolio?.mentorFeedback?.scores?.processMap    || 0,
    riskChecklist: portfolio?.mentorFeedback?.scores?.riskChecklist || 0,
    rca:           portfolio?.mentorFeedback?.scores?.rca           || 0,
    documentation: portfolio?.mentorFeedback?.scores?.documentation || 0,
    technicalMemo: portfolio?.mentorFeedback?.scores?.technicalMemo || 0,
    responsibleAi: portfolio?.mentorFeedback?.scores?.responsibleAi || 0,
  });

  // Feedback form
  const [feedback, setFeedback] = useState({
    strength:          portfolio?.mentorFeedback?.strength          || '',
    improvement:       portfolio?.mentorFeedback?.improvement       || '',
    missingEvidence:   portfolio?.mentorFeedback?.missingEvidence   || '',
    suggestedNextStep: portfolio?.mentorFeedback?.suggestedNextStep || '',
    finalComment:      portfolio?.mentorFeedback?.finalComment      || '',
    status:            'Reviewed',
  });

  const [submitted, setSubmitted] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const totalScore = Object.values(scores).reduce((a, b) => a + Number(b), 0);
  const readinessInfo = getReadinessLevel(totalScore);

  const handleScoreChange = (key, val) => {
    const rubricItem = RUBRIC.find(r => r.key === key);
    const clamped = Math.max(0, Math.min(rubricItem?.max || 100, Number(val) || 0));
    setScores(prev => ({ ...prev, [key]: clamped }));
  };

  const handleSaveDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 2500);
  };

  const handleSubmit = () => {
    // Save to localStorage for the student portfolio to read
    const reviewData = {
      scores: { ...scores, total: totalScore },
      readinessLevel: readinessInfo.level,
      ...feedback,
      reviewedAt: new Date().toISOString(),
      mentorId: mentor.id,
      reviewStatus: feedback.status,
    };
    localStorage.setItem(`mentorReview_${student.id}`, JSON.stringify(reviewData));
    setSubmitted(true);
  };

  if (!portfolio) {
    return (
      <div className="mentor-review-page">
        <div className="review-top-bar">
          <button className="review-back-btn" onClick={onBack}>← {t('mentor.review.back')}</button>
        </div>
        <div className="review-empty-state">{t('mentor.review.noSubmission')}</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mentor-review-page">
        <div className="review-success-state">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" width="48" height="48">
              <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <h2>{t('mentor.review.successTitle')}</h2>
          <p>{t('mentor.review.successSaved').includes('Your review') ? <>Your review for <strong>{student.fullname}</strong> has been saved.</> : <>บันทึกการตรวจสอบของคุณสำหรับ <strong>{student.fullname}</strong> เรียบร้อยแล้ว</>}</p>
          <div className="success-summary">
            <div className="ss-item"><span>{t('mentor.review.totalScore')}</span><strong>{totalScore}/100</strong></div>
            <div className="ss-item"><span>{t('mentor.review.readinessLevel')}</span><strong style={{ color: readinessInfo.color }}>{readinessInfo.level}</strong></div>
            <div className="ss-item"><span>{t('mentor.review.status')}</span><strong>{feedback.status === 'Reviewed' ? t('mentor.review.reviewed') : t('mentor.review.statusNeedsRevision')}</strong></div>
          </div>
          <button className="review-primary-btn" onClick={onBack}>{t('mentor.review.returnDash')}</button>
        </div>
      </div>
    );
  }

  const completedCount = ['processMap', 'riskChecklist', 'rcaLog', 'technicalMemo', 'aiUsageLog']
    .filter(k => portfolio[k === 'rcaLog' ? 'rcaLog' : k]?.status === 'completed').length;

  return (
    <div className="mentor-review-page">
      {/* ── TOP BAR ─────────────────────────────────────────────── */}
      <div className="review-top-bar">
        <button className="review-back-btn" onClick={onBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          {t('mentor.review.back')}
        </button>
        <div className="review-top-right">
          <span className="review-submission-pill">{portfolio.status === 'reviewed' ? t('mentor.review.reviewed') : t('mentor.review.waiting')}</span>
          <span className="review-portfolio-pill">{t('mentor.review.artifactsCount').replace('{0}', completedCount)}</span>
        </div>
      </div>

      {/* ── SUMMARY CARDS ───────────────────────────────────────── */}
      <div className="review-summary-row">
        <div className="review-summary-card">
          <div className="rsc-label">{t('mentor.review.student')}</div>
          <div className="rsc-value">{student.fullname}</div>
          <div className="rsc-sub">{t('mentor.review.track')}: {student.target_track} · {t('mentor.review.goal')}: {student.career_goal}</div>
        </div>
        <div className="review-summary-card">
          <div className="rsc-label">{t('mentor.review.scenario')}</div>
          <div className="rsc-value">{DEMO_SCENARIO.title}</div>
          <div className="rsc-sub">{t('mentor.review.difficulty')}: {DEMO_SCENARIO.difficulty} · {DEMO_SCENARIO.estimatedTime}</div>
        </div>
        <div className="review-summary-card review-score-card">
          <div className="rsc-label">{t('mentor.review.currentReadiness')}</div>
          <div className="rsc-score-row">
            <span className="rsc-big-score">{student.readinessScore}</span>
            <span className="rsc-max">/100</span>
          </div>
          <div className="rsc-level" style={{ color: getReadinessLevel(student.readinessScore).color }}>
            {student.readinessLevel}
          </div>
        </div>
      </div>

      {/* ── MAIN AREA: TABS + CONTENT ───────────────────────────── */}
      <div className="review-main">
        <nav className="review-tab-nav">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`review-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.prefix}{t(tab.labelKey)}
            </button>
          ))}
        </nav>

        <div className="review-content">
          {/* ── 1. PROCESS MAP ─────────────────────────────────── */}
          {activeTab === 'processMap' && (
            <div className="review-section">
              <h2 className="rs-title">{t('mentor.review.processMapTitle')}</h2>

              <div className="artifact-block">
                <h4 className="ab-heading">{t('mentor.review.processFlow')} — {portfolio.processMap.steps.length} {t('mentor.review.steps')}</h4>
                <div className="process-flow-visual">
                  {portfolio.processMap.steps.map((s, i) => (
                    <div key={i} className="pf-step-wrapper">
                      <div className={`pf-step ${s.risk ? 'risk' : ''}`}>
                        <div className="pf-num">{i + 1}</div>
                        <div className="pf-info">
                          <div className="pf-desc">{s.step}</div>
                          <div className="pf-resp">{s.responsible}</div>
                        </div>
                        {s.risk && <span className="pf-risk-tag">{t('mentor.review.riskTag')}</span>}
                      </div>
                      {i < portfolio.processMap.steps.length - 1 && <div className="pf-arrow">↓</div>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="artifact-block">
                <h4 className="ab-heading">{t('mentor.review.factsIdentified')} ({portfolio.processMap.facts.length})</h4>
                <ul className="fact-list">
                  {portfolio.processMap.facts.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>

              <div className="artifact-block">
                <h4 className="ab-heading">{t('mentor.review.assumptions')} ({portfolio.processMap.assumptions.length})</h4>
                {portfolio.processMap.assumptions.map((a, i) => (
                  <div key={i} className="assumption-card">
                    <div className="ac-claim">"{a.claim}"</div>
                    <div className="ac-evidence">{t('mentor.review.evidenceNeeded')} {a.evidenceNeeded}</div>
                  </div>
                ))}
              </div>

              <div className="mentor-input-group">
                <div className="mig-header">
                  <label>{t('mentor.review.sectionStatus')}</label>
                  <select value={sectionStatus.processMap} onChange={e => setSectionStatus(s => ({ ...s, processMap: e.target.value }))}>
                    <option value="Good">{t('mentor.review.statusGood')}</option>
                    <option value="Needs More Evidence">{t('mentor.review.statusNeedsEvidence')}</option>
                    <option value="Needs Revision">{t('mentor.review.statusNeedsRevision')}</option>
                  </select>
                </div>
                <label>{t('mentor.review.mentorNote')}</label>
                <textarea rows="3" placeholder={t('mentor.review.processMapNotePh')} value={notes.processMap} onChange={e => setNotes(n => ({ ...n, processMap: e.target.value }))}/>
              </div>
            </div>
          )}

          {/* ── 2. RISK CHECKLIST ──────────────────────────────── */}
          {activeTab === 'riskChecklist' && (
            <div className="review-section">
              <h2 className="rs-title">{t('mentor.review.riskTitle')}</h2>

              <div className="artifact-block">
                <h4 className="ab-heading">{t('mentor.review.risksIdentified')} ({portfolio.riskChecklist.risks.length})</h4>
                {portfolio.riskChecklist.risks.map((r, i) => (
                  <div key={i} className={`risk-review-card severity-${r.severity.toLowerCase()}`}>
                    <div className="rrc-header">
                      <span className="rrc-type">{r.type}</span>
                      <div className="rrc-badges">
                        <span className={`rrc-severity ${r.severity.toLowerCase()}`}>{r.severity}</span>
                        <span className="rrc-confidence">{r.confidence}</span>
                      </div>
                    </div>
                    <p className="rrc-desc">{r.description}</p>
                    <div className="rrc-details">
                      <div><strong>{t('mentor.review.evidence')}</strong> {r.evidence}</div>
                      <div><strong>{t('mentor.review.requiredEvidence')}</strong> {r.requiredEvidence}</div>
                      <div><strong>{t('mentor.review.suggestedAction')}</strong> {r.suggestedAction}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mentor-input-group">
                <div className="mig-header">
                  <label>{t('mentor.review.sectionStatus')}</label>
                  <select value={sectionStatus.riskChecklist} onChange={e => setSectionStatus(s => ({ ...s, riskChecklist: e.target.value }))}>
                    <option value="Good">{t('mentor.review.statusGood')}</option>
                    <option value="Needs More Evidence">{t('mentor.review.statusNeedsEvidence')}</option>
                    <option value="Needs Revision">{t('mentor.review.statusNeedsRevision')}</option>
                  </select>
                </div>
                <label>{t('mentor.review.mentorNote')}</label>
                <textarea rows="3" placeholder={t('mentor.review.riskNotePh')} value={notes.riskChecklist} onChange={e => setNotes(n => ({ ...n, riskChecklist: e.target.value }))}/>
              </div>
            </div>
          )}

          {/* ── 3. RCA LOG ─────────────────────────────────────── */}
          {activeTab === 'rcaLog' && (
            <div className="review-section">
              <h2 className="rs-title">{t('mentor.review.rcaTitle')}</h2>

              <div className="artifact-block">
                <h4 className="ab-heading">{t('mentor.review.problemStatement')}</h4>
                <p className="problem-statement-text">{portfolio.rcaLog.problem}</p>
              </div>

              <div className="artifact-block">
                <h4 className="ab-heading">{t('mentor.review.fiveWhy')}</h4>
                <div className="five-why-chain">
                  {portfolio.rcaLog.fiveWhy.map((w, i) => (
                    <div key={i} className="fw-item">
                      <div className="fw-num">{t('mentor.review.why')} {w.why}</div>
                      <div className="fw-content">
                        <div className="fw-question">{w.question}</div>
                        <div className="fw-answer">{w.answer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rca-evidence-grid">
                <div className="artifact-block">
                  <h4 className="ab-heading">{t('mentor.review.availableEvidence')} ({portfolio.rcaLog.availableEvidence.length})</h4>
                  <ul className="evidence-list-check">
                    {portfolio.rcaLog.availableEvidence.map((e, i) => <li key={i}><span className="ev-check">✓</span>{e}</li>)}
                  </ul>
                </div>
                <div className="artifact-block">
                  <h4 className="ab-heading">{t('mentor.review.missingEvidence')} ({portfolio.rcaLog.missingEvidence.length})</h4>
                  <ul className="evidence-list-missing">
                    {portfolio.rcaLog.missingEvidence.map((e, i) => <li key={i}><span className="ev-miss">✗</span>{e}</li>)}
                  </ul>
                </div>
              </div>

              <div className="artifact-block">
                <h4 className="ab-heading">{t('mentor.review.correctiveAction')}</h4>
                <div className="ca-pair">
                  <div><strong>{t('mentor.review.initialCorrective')}</strong><p>{portfolio.rcaLog.initialCorrectiveAction}</p></div>
                  <div><strong>{t('mentor.review.verificationPlan')}</strong><p>{portfolio.rcaLog.verificationPlan}</p></div>
                </div>
              </div>

              <div className="mentor-input-group">
                <div className="mig-header">
                  <label>{t('mentor.review.sectionStatus')}</label>
                  <select value={sectionStatus.rcaLog} onChange={e => setSectionStatus(s => ({ ...s, rcaLog: e.target.value }))}>
                    <option value="Good">{t('mentor.review.statusGood')}</option>
                    <option value="Needs More Evidence">{t('mentor.review.statusNeedsEvidence')}</option>
                    <option value="Needs Revision">{t('mentor.review.statusNeedsRevision')}</option>
                  </select>
                </div>
                <label>{t('mentor.review.mentorNote')}</label>
                <textarea rows="3" placeholder={t('mentor.review.rcaNotePh')} value={notes.rcaLog} onChange={e => setNotes(n => ({ ...n, rcaLog: e.target.value }))}/>
              </div>
            </div>
          )}

          {/* ── 4. TECHNICAL MEMO ──────────────────────────────── */}
          {activeTab === 'technicalMemo' && (
            <div className="review-section">
              <h2 className="rs-title">{t('mentor.review.memoTitle')}</h2>

              <div className="memo-document">
                <div className="memo-doc-header">
                  <div className="memo-company">{t('mentor.review.memoCompany')}</div>
                  <h3 className="memo-doc-title">{t('mentor.review.memoDocTitle')}</h3>
                </div>
                <table className="memo-meta-table">
                  <tbody>
                    <tr><td>{t('mentor.review.memoTo')}</td><td>Management / QA Lead</td></tr>
                    <tr><td>{t('mentor.review.memoSubject')}</td><td>{portfolio.technicalMemo.subject}</td></tr>
                    <tr><td>{t('mentor.review.memoDate')}</td><td>{portfolio.technicalMemo.date}</td></tr>
                    <tr><td>{t('mentor.review.memoPreparedBy')}</td><td>{portfolio.technicalMemo.preparedBy}</td></tr>
                    <tr><td>{t('mentor.review.memoScenario')}</td><td>{DEMO_SCENARIO.title}</td></tr>
                  </tbody>
                </table>
                <div className="memo-body">
                  <h4>{t('mentor.review.memoProblemSummary')}</h4>
                  <p>{portfolio.technicalMemo.problemSummary}</p>
                  <h4>{t('mentor.review.memoEvidence')}</h4>
                  <p>{portfolio.technicalMemo.evidence}</p>
                  <h4>{t('mentor.review.memoAnalysis')}</h4>
                  <p>{portfolio.technicalMemo.analysis}</p>
                  <h4>{t('mentor.review.memoRecommendedAction')}</h4>
                  <p style={{ whiteSpace: 'pre-line' }}>{portfolio.technicalMemo.recommendedAction}</p>
                  <h4>{t('mentor.review.memoNextStep')}</h4>
                  <p>{portfolio.technicalMemo.nextStep}</p>
                </div>
              </div>

              <div className="mentor-input-group">
                <div className="mig-header">
                  <label>{t('mentor.review.sectionStatus')}</label>
                  <select value={sectionStatus.technicalMemo} onChange={e => setSectionStatus(s => ({ ...s, technicalMemo: e.target.value }))}>
                    <option value="Good">{t('mentor.review.statusGood')}</option>
                    <option value="Needs More Evidence">{t('mentor.review.statusNeedsEvidence')}</option>
                    <option value="Needs Revision">{t('mentor.review.statusNeedsRevision')}</option>
                  </select>
                </div>
                <label>{t('mentor.review.mentorNote')}</label>
                <textarea rows="3" placeholder={t('mentor.review.memoNotePh')} value={notes.technicalMemo} onChange={e => setNotes(n => ({ ...n, technicalMemo: e.target.value }))}/>
              </div>
            </div>
          )}

          {/* ── 5. AI USAGE LOG ────────────────────────────────── */}
          {activeTab === 'aiUsageLog' && (
            <div className="review-section">
              <h2 className="rs-title">{t('mentor.review.aiUsageTitle')}</h2>

              <div className="artifact-block">
                <h4 className="ab-heading">{t('mentor.review.aiUsageEntries')} ({portfolio.aiUsageLog.entries.length})</h4>
                <div className="ai-log-table-wrapper">
                  <table className="ai-log-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{t('mentor.review.aiTask')}</th>
                        <th>{t('mentor.review.promptUsed')}</th>
                        <th>{t('mentor.review.aiSuggestion')}</th>
                        <th>{t('mentor.review.humanAction')}</th>
                        <th>{t('mentor.review.reason')}</th>
                        <th>{t('mentor.review.verified')}</th>
                        <th>{t('mentor.review.confidence')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {portfolio.aiUsageLog.entries.map((entry, i) => (
                        <tr key={entry.id}>
                          <td>{i + 1}</td>
                          <td className="ai-task-cell">{entry.task}</td>
                          <td className="ai-prompt-cell">{entry.promptUsed}</td>
                          <td className="ai-suggestion-cell">{entry.aiSuggestion}</td>
                          <td>
                            <span className={`action-badge ${entry.humanAction}`}>{entry.humanAction}</span>
                          </td>
                          <td className="ai-reason-cell">{entry.reason}</td>
                          <td>{entry.verifiedStatus ? '✓' : '—'}</td>
                          <td>{entry.confidence}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mentor-input-group">
                <div className="mig-header">
                  <label>{t('mentor.review.sectionStatus')}</label>
                  <select value={sectionStatus.aiUsageLog} onChange={e => setSectionStatus(s => ({ ...s, aiUsageLog: e.target.value }))}>
                    <option value="Good">{t('mentor.review.statusGood')}</option>
                    <option value="Needs More Evidence">{t('mentor.review.statusNeedsEvidence')}</option>
                    <option value="Needs Revision">{t('mentor.review.statusNeedsRevision')}</option>
                  </select>
                </div>
                <label>{t('mentor.review.mentorNote')}</label>
                <textarea rows="3" placeholder={t('mentor.review.aiUsageNotePh')} value={notes.aiUsageLog} onChange={e => setNotes(n => ({ ...n, aiUsageLog: e.target.value }))}/>
              </div>
            </div>
          )}

          {/* ── 6. RUBRIC & FEEDBACK ───────────────────────────── */}
          {activeTab === 'rubric' && (
            <div className="review-section rubric-section">
              <h2 className="rs-title">{t('mentor.review.rubricTitle')}</h2>

              {/* Responsible Review Rules */}
              <div className="responsible-banner">
                <div className="rb-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div className="rb-content">
                  <h4>{t('mentor.review.rulesTitle')}</h4>
                  <ul>
                    <li>{t('mentor.review.rule1')}</li>
                    <li>{t('mentor.review.rule2')}</li>
                    <li>{t('mentor.review.rule3')}</li>
                  </ul>
                </div>
              </div>

              {/* Rubric Grid */}
              <div className="rubric-scoring-grid">
                {RUBRIC.map(item => (
                  <div key={item.key} className="rubric-item">
                    <div className="ri-label">
                      <span className="ri-name">{t(item.labelKey)}</span>
                      <span className="ri-max">{t('mentor.review.max')} {item.max}</span>
                    </div>
                    <div className="ri-input-row">
                      <input
                        type="number"
                        min="0"
                        max={item.max}
                        value={scores[item.key]}
                        onChange={e => handleScoreChange(item.key, e.target.value)}
                      />
                      <div className="ri-bar">
                        <div className="ri-bar-fill" style={{ width: `${(scores[item.key] / item.max) * 100}%` }}/>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Score */}
              <div className="total-score-card">
                <div className="tsc-left">
                  <span className="tsc-label">{t('mentor.review.totalScore')}</span>
                  <div className="tsc-score">
                    <span className="tsc-num">{totalScore}</span>
                    <span className="tsc-max">/100</span>
                  </div>
                </div>
                <div className="tsc-right">
                  <span className="tsc-label">{t('mentor.review.newReadiness')}</span>
                  <span className="tsc-level" style={{ color: readinessInfo.color, background: readinessInfo.bg }}>
                    {readinessInfo.level}
                  </span>
                </div>
              </div>

              {/* Feedback Form */}
              <div className="feedback-form">
                <h3 className="ff-heading">{t('mentor.review.structuredFeedback')}</h3>
                
                <div className="ff-field">
                  <label>{t('mentor.review.strength')}</label>
                  <textarea rows="2" value={feedback.strength} onChange={e => setFeedback(f => ({ ...f, strength: e.target.value }))} placeholder={t('mentor.review.strengthPh')}/>
                </div>
                <div className="ff-field">
                  <label>{t('mentor.review.improvement')}</label>
                  <textarea rows="2" value={feedback.improvement} onChange={e => setFeedback(f => ({ ...f, improvement: e.target.value }))} placeholder={t('mentor.review.improvementPh')}/>
                </div>
                <div className="ff-field">
                  <label>{t('mentor.review.missingEvidence')}</label>
                  <textarea rows="2" value={feedback.missingEvidence} onChange={e => setFeedback(f => ({ ...f, missingEvidence: e.target.value }))} placeholder={t('mentor.review.missingEvidencePh')}/>
                </div>
                <div className="ff-field">
                  <label>{t('mentor.review.nextStep')}</label>
                  <textarea rows="2" value={feedback.suggestedNextStep} onChange={e => setFeedback(f => ({ ...f, suggestedNextStep: e.target.value }))} placeholder={t('mentor.review.nextStepPh')}/>
                </div>
                <div className="ff-field">
                  <label>{t('mentor.review.finalComment')}</label>
                  <textarea rows="2" value={feedback.finalComment} onChange={e => setFeedback(f => ({ ...f, finalComment: e.target.value }))} placeholder={t('mentor.review.finalCommentPh')}/>
                </div>
                <div className="ff-field">
                  <label>{t('mentor.review.reviewStatus')}</label>
                  <select value={feedback.status} onChange={e => setFeedback(f => ({ ...f, status: e.target.value }))}>
                    <option value="Reviewed">{t('mentor.review.statusApprove')}</option>
                    <option value="Needs Revision">{t('mentor.review.statusReturn')}</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="feedback-actions">
                <button className="review-ghost-btn" onClick={handleSaveDraft}>
                  {draftSaved ? t('mentor.review.draftSaved') : t('mentor.review.saveDraft')}
                </button>
                <button className="review-secondary-btn" onClick={() => { setFeedback(f => ({ ...f, status: 'Needs Revision' })); handleSubmit(); }}>
                  {t('mentor.review.requestRevision')}
                </button>
                <button className="review-primary-btn" onClick={handleSubmit}>
                  {feedback.status === 'Needs Revision' ? t('mentor.review.requestRevision') : t('mentor.review.submitFeedback')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
