import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { DEMO_PORTFOLIO_ANAN, DEMO_SCENARIO, DEMO_MENTORS, getMentorForStudent } from '../../data/demoData.js';
import { getReadinessLevel } from '../../utils/readiness.js';

const FIVE_OUTPUTS = [
  { key: 'processMap',    label: 'Process Map',                icon: 'map',     color: '#3B82F6', bg: '#EFF6FF'  },
  { key: 'riskChecklist', label: 'Safety & Quality Checklist', icon: 'shield',  color: '#EF4444', bg: '#FEF2F2'  },
  { key: 'rcaLog',        label: 'RCA Log',                    icon: 'search',  color: '#F59E0B', bg: '#FFFBEB'  },
  { key: 'technicalMemo', label: 'Technical Memo',             icon: 'file',    color: '#8B5CF6', bg: '#F5F3FF'  },
  { key: 'aiUsageLog',    label: 'AI Usage Log',               icon: 'cpu',     color: '#10B981', bg: '#ECFDF5'  },
];

const ICON = {
  map:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>,
  shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  file:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  cpu:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="15" x2="23" y2="15"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="15" x2="4" y2="15"/></svg>,
};

const STATUS_LABEL = { completed: 'Completed', reviewed: 'Reviewed', needs_revision: 'Needs Revision', draft: 'Draft', not_started: 'Not Started' };
const STATUS_COLOR = { completed: '#10B981', reviewed: '#2563EB', needs_revision: '#F59E0B', draft: '#8B5CF6', not_started: '#94A3B8' };
const STATUS_BG    = { completed: '#ECFDF5', reviewed: '#EFF6FF', needs_revision: '#FFFBEB', draft: '#F5F3FF', not_started: '#F8FAFC' };

const LAST_UPDATED = {
  processMap: '2026-05-20 09:00',
  riskChecklist: '2026-05-20 09:15',
  rcaLog: '2026-05-20 09:35',
  technicalMemo: '2026-05-20 09:55',
  aiUsageLog: '2026-05-20 10:15',
};

const QUALITY_INDICATORS = {
  processMap: { level: 'Good', color: '#10B981' },
  riskChecklist: { level: 'Strong', color: '#2563EB' },
  rcaLog: { level: 'Good', color: '#10B981' },
  technicalMemo: { level: 'Good', color: '#10B981' },
  aiUsageLog: { level: 'Strong', color: '#2563EB' },
};

const SUMMARIES = {
  processMap: '8 process steps mapped with 3 risk points identified. Facts and assumptions separated.',
  riskChecklist: '4 risks identified: 3 High severity, 1 Medium. All types covered (Safety, Quality, SOP, Traceability).',
  rcaLog: '5-Why analysis complete. 4 available evidence items, 4 missing evidence items documented.',
  technicalMemo: 'Professional memo with problem summary, evidence, analysis, and 5 recommended actions.',
  aiUsageLog: '3 AI usage entries logged. Human decisions recorded for all: 2 accepted, 1 revised.',
};

export default function StudentEvidencePortfolio({ portfolioItems, handleSubmitPortfolio, onNavigate, targetTrack, overallReadiness, currentUser, setActiveTab }) {
  const { t } = useLanguage();
  const [workData, setWorkData] = useState(null);
  const [selectedOutput, setSelectedOutput] = useState(null);
  const [submissionSent, setSubmissionSent] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      const key = `sw_scenario-001_${currentUser.id}`;
      try {
        const saved = localStorage.getItem(key);
        if (saved) setWorkData(JSON.parse(saved));
      } catch {}
    }
  }, [currentUser?.id]);

  const getOutputStatus = (key) => {
    if (!workData) {
      const demo = DEMO_PORTFOLIO_ANAN[key];
      return demo ? demo.status : 'not_started';
    }
    switch (key) {
      case 'processMap':    return workData.processSteps?.some(s => s.step) ? 'completed' : 'not_started';
      case 'riskChecklist': return workData.risks?.some(r => r.description) ? 'completed' : 'not_started';
      case 'rcaLog':        return (workData.rcaProblem && workData.fiveWhy?.filter(w => w.answer).length >= 3) ? 'completed' : 'not_started';
      case 'technicalMemo': return (workData.memoSubject && workData.memoAnalysis) ? 'completed' : 'not_started';
      case 'aiUsageLog':    return workData.aiEntries?.length > 0 ? 'completed' : 'not_started';
      default:              return 'not_started';
    }
  };

  const displayReadiness = overallReadiness || 0;
  const readinessInfo = getReadinessLevel(displayReadiness);
  const completedCount = FIVE_OUTPUTS.filter(o => getOutputStatus(o.key) === 'completed').length;

  // Get mentor feedback: first check localStorage for live review, then fallback to demo
  const liveReview = (() => {
    try {
      const data = localStorage.getItem(`mentorReview_${currentUser?.id || 'student-demo-01'}`);
      return data ? JSON.parse(data) : null;
    } catch { return null; }
  })();
  const feedback = liveReview || DEMO_PORTFOLIO_ANAN.mentorFeedback;

  const assignedMentor = getMentorForStudent(currentUser?.id || 'student-demo-01') || DEMO_MENTORS[0];

  const handleSendToMentor = () => {
    setSubmissionSent(true);
    if (handleSubmitPortfolio) handleSubmitPortfolio();
    setTimeout(() => setSubmissionSent(false), 4000);
  };

  return (
    <div className="student-tab-panel portfolio-tab-panel-updated">
            
            {/* ── TOP SUMMARY SECTION ───────────────────────────────────────── */}
            <div className="student-page-header portfolio-header-row">
              <div className="student-page-title-area">
                <h1 className="student-page-title">{t('portfolio.title')}</h1>
                <p className="student-page-subtitle">{t('portfolio.subtitle')}</p>
                <div style={{ marginTop: '8px', padding: '6px 12px', background: '#EFF6FF', color: '#1E40AF', borderRadius: '6px', fontSize: '13px', display: 'inline-block' }}>
                  ⚠ Evidence portfolio is a learning artefact and should be reviewed by a qualified human.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="portfolio-share-btn-new" onClick={() => alert('Export Portfolio: Coming soon in Phase 5!')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  <span>Export Portfolio</span>
                </button>
                <button className="portfolio-share-btn-new" style={{ background: '#EFF6FF', color: '#2563EB' }} onClick={() => setActiveTab && setActiveTab('dashboard')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                  </svg>
                  <span>Back to Dashboard</span>
                </button>
              </div>
            </div>

            {/* ── SUMMARY INFO BAR ─────────────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '14px', marginBottom: '20px' }}>
              {/* Student Info */}
              <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px 18px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Student</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>{currentUser?.fullname || 'Anan Jaidee'}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Track: {targetTrack || 'quality_assurance'}</div>
              </div>
              {/* Scenario */}
              <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px 18px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Scenario</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>{DEMO_SCENARIO.title}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{DEMO_SCENARIO.difficulty} · {DEMO_SCENARIO.estimatedTime}</div>
              </div>
              {/* Assigned Mentor */}
              <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px 18px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Assigned Mentor</div>
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A' }}>{assignedMentor.fullname}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{assignedMentor.jobTitle} · {assignedMentor.organization}</div>
              </div>
              {/* Submission Status */}
              <div style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px 18px', textAlign: 'center', minWidth: '140px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', marginBottom: '4px' }}>Status</div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: feedback?.reviewStatus === 'reviewed' ? '#10B981' : '#F59E0B', background: feedback?.reviewStatus === 'reviewed' ? '#ECFDF5' : '#FFFBEB', padding: '4px 12px', borderRadius: '8px', display: 'inline-block' }}>
                  {feedback?.reviewStatus === 'reviewed' ? 'Reviewed' : 'Waiting for Review'}
                </div>
              </div>
            </div>

            {/* ── KPI CARDS ────────────────────────────────────────────────── */}
            <div className="portfolio-stats-container">
              <div className="portfolio-stat-card">
                <div className="portfolio-stat-dot blue"></div>
                <span className="portfolio-stat-label">{t('portfolio.artifacts')}</span>
                <h3 className="portfolio-stat-value">{completedCount}/5</h3>
                <p className="portfolio-stat-subtext">{t('portfolio.artifactsCompleted')}</p>
              </div>
              <div className="portfolio-stat-card">
                <div className="portfolio-stat-dot teal"></div>
                <span className="portfolio-stat-label">Mentor Score</span>
                <h3 className="portfolio-stat-value">{feedback?.scores?.total || '—'}/100</h3>
                <p className="portfolio-stat-subtext">Latest review</p>
              </div>
              <div className="portfolio-stat-card">
                <div className="portfolio-stat-dot green"></div>
                <span className="portfolio-stat-label">Readiness Level</span>
                <h3 className="portfolio-stat-value" style={{ fontSize: '14px', color: readinessInfo.color }}>{readinessInfo.level}</h3>
                <p className="portfolio-stat-subtext">{displayReadiness}/100 score</p>
              </div>
              <div className="portfolio-stat-card">
                <div className="portfolio-stat-dot yellow"></div>
                <span className="portfolio-stat-label">{t('portfolio.readiness')}</span>
                <h3 className="portfolio-stat-value">{displayReadiness}%</h3>
                <p className="portfolio-stat-subtext">{t('portfolio.jobReadyScore')}</p>
              </div>
            </div>

            {/* ── TWO-COLUMN LAYOUT ────────────────────────────────────────── */}
            <div className="portfolio-layout-grid">
              
              {/* Left Column: 5 Evidence Output Cards */}
              <div className="portfolio-left-column">
                <div className="student-card portfolio-evidence-list-card">
                  <div className="portfolio-card-header">
                    <h3 className="portfolio-card-title">{t('portfolio.evidenceList')}</h3>
                    <p className="portfolio-card-subtitle">5 required evidence outputs — click to view details</p>
                  </div>
                  <div className="portfolio-evidence-items">
                    {FIVE_OUTPUTS.map(output => {
                      const status = getOutputStatus(output.key);
                      const quality = QUALITY_INDICATORS[output.key];
                      const sectionFeedback = feedback?.scores?.[output.key === 'rcaLog' ? 'rca' : output.key === 'riskChecklist' ? 'riskChecklist' : output.key === 'technicalMemo' ? 'technicalMemo' : output.key === 'aiUsageLog' ? 'responsibleAi' : output.key];
                      return (
                        <div
                          key={output.key}
                          className="portfolio-evidence-item"
                          style={{ cursor: 'pointer', background: selectedOutput === output.key ? output.bg : 'white', borderLeft: selectedOutput === output.key ? `3px solid ${output.color}` : '3px solid transparent' }}
                          onClick={() => setSelectedOutput(selectedOutput === output.key ? null : output.key)}
                        >
                          <div className="portfolio-evidence-item-left">
                            <div className="portfolio-icon-wrapper" style={{ background: output.bg, color: output.color }}>
                              {ICON[output.icon]}
                            </div>
                            <div className="portfolio-evidence-item-details">
                              <span className="portfolio-evidence-item-code" style={{ fontWeight: '700' }}>{output.label}</span>
                              <span style={{ fontSize: '12px', color: '#64748B', display: 'block', marginTop: '2px' }}>{SUMMARIES[output.key]?.slice(0, 80)}…</span>
                              <div style={{ display: 'flex', gap: '8px', marginTop: '6px', alignItems: 'center' }}>
                                <span style={{ fontSize: '10px', color: '#94A3B8' }}>Updated: {LAST_UPDATED[output.key]}</span>
                                <span style={{ fontSize: '10px', fontWeight: '700', color: quality.color }}>● {quality.level}</span>
                                {sectionFeedback != null && <span style={{ fontSize: '10px', color: '#2563EB', fontWeight: '600' }}>Score: {sectionFeedback}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="portfolio-evidence-item-right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                            <span className="portfolio-evidence-badge" style={{ background: STATUS_BG[status], color: STATUS_COLOR[status] }}>
                              {STATUS_LABEL[status]}
                            </span>
                            <span style={{ fontSize: '11px', color: '#64748B', cursor: 'pointer' }}>
                              {selectedOutput === output.key ? '▲ Hide' : '▼ View Details'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── EXPANDED DETAIL SECTION ──────────────────────────────── */}
                {selectedOutput && (
                  <div className="student-card" style={{ marginTop: '16px', padding: '20px' }}>
                    {selectedOutput === 'processMap' && DEMO_PORTFOLIO_ANAN.processMap && (
                      <>
                        <h4 style={{ margin: '0 0 12px', color: '#0F172A' }}>Process Map — {DEMO_PORTFOLIO_ANAN.processMap.steps.length} Steps</h4>
                        {DEMO_PORTFOLIO_ANAN.processMap.steps.map((s, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: s.risk ? '#FEE2E2' : '#EFF6FF', color: s.risk ? '#DC2626' : '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>{i+1}</div>
                            <div style={{ flex: 1, fontSize: '13px', color: '#374151' }}>{s.step}</div>
                            <div style={{ fontSize: '12px', color: '#64748B' }}>{s.responsible}</div>
                            {s.risk && <span style={{ fontSize: '10px', fontWeight: '700', color: '#DC2626', background: '#FEF2F2', padding: '2px 6px', borderRadius: '4px' }}>⚠ RISK</span>}
                          </div>
                        ))}
                        <h5 style={{ margin: '16px 0 8px', color: '#475569', fontSize: '13px' }}>Facts ({DEMO_PORTFOLIO_ANAN.processMap.facts.length})</h5>
                        <ul style={{ paddingLeft: '16px', margin: 0, fontSize: '13px', color: '#475569' }}>
                          {DEMO_PORTFOLIO_ANAN.processMap.facts.map((f, i) => <li key={i} style={{ marginBottom: '4px' }}>{f}</li>)}
                        </ul>
                        <h5 style={{ margin: '12px 0 8px', color: '#92400E', fontSize: '13px' }}>Assumptions ({DEMO_PORTFOLIO_ANAN.processMap.assumptions.length})</h5>
                        {DEMO_PORTFOLIO_ANAN.processMap.assumptions.map((a, i) => (
                          <div key={i} style={{ padding: '8px 10px', border: '1px dashed #F59E0B', borderRadius: '6px', background: '#FFFBEB', marginBottom: '6px', fontSize: '12px' }}>
                            <div style={{ fontWeight: '600', color: '#92400E' }}>"{a.claim}"</div>
                            <div style={{ color: '#B45309', marginTop: '2px' }}>Evidence needed: {a.evidenceNeeded}</div>
                          </div>
                        ))}
                      </>
                    )}
                    {selectedOutput === 'riskChecklist' && DEMO_PORTFOLIO_ANAN.riskChecklist && (
                      <>
                        <h4 style={{ margin: '0 0 12px', color: '#0F172A' }}>Safety & Quality Risks — {DEMO_PORTFOLIO_ANAN.riskChecklist.risks.length} Items</h4>
                        {DEMO_PORTFOLIO_ANAN.riskChecklist.risks.map((r, i) => (
                          <div key={i} style={{ padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '10px', borderLeft: `4px solid ${r.severity === 'High' ? '#EF4444' : r.severity === 'Medium' ? '#F59E0B' : '#22C55E'}` }}>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                              <span style={{ fontSize: '13px', fontWeight: '700', color: '#374151' }}>{r.type}</span>
                              <span style={{ fontSize: '11px', fontWeight: '700', color: r.severity === 'High' ? '#DC2626' : '#D97706', background: r.severity === 'High' ? '#FEF2F2' : '#FFFBEB', padding: '2px 8px', borderRadius: '10px' }}>{r.severity}</span>
                              <span style={{ fontSize: '11px', fontWeight: '600', color: '#475569', background: '#F1F5F9', padding: '2px 8px', borderRadius: '10px' }}>{r.confidence}</span>
                            </div>
                            <p style={{ margin: '0 0 6px', fontSize: '13px', color: '#475569' }}>{r.description}</p>
                            <p style={{ margin: '0', fontSize: '12px', color: '#94A3B8' }}><strong>Evidence:</strong> {r.evidence}</p>
                          </div>
                        ))}
                      </>
                    )}
                    {selectedOutput === 'rcaLog' && DEMO_PORTFOLIO_ANAN.rcaLog && (
                      <>
                        <h4 style={{ margin: '0 0 8px', color: '#0F172A' }}>RCA Investigation</h4>
                        <div style={{ padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
                          <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>Problem Statement</div>
                          <p style={{ margin: 0, fontSize: '14px', color: '#1E293B', lineHeight: '1.6' }}>{DEMO_PORTFOLIO_ANAN.rcaLog.problem}</p>
                        </div>
                        <h5 style={{ margin: '0 0 8px', color: '#475569', fontSize: '13px' }}>5-Why Analysis</h5>
                        {DEMO_PORTFOLIO_ANAN.rcaLog.fiveWhy.map(w => (
                          <div key={w.why} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid #F1F5F9' }}>
                            <div style={{ width: '50px', flexShrink: 0, fontSize: '11px', fontWeight: '800', color: '#2563EB', background: '#EFF6FF', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>Why {w.why}</div>
                            <div><p style={{ margin: '0 0 2px', fontSize: '12px', fontWeight: '600', color: '#64748B' }}>{w.question}</p><p style={{ margin: 0, fontSize: '13px', color: '#374151' }}>{w.answer}</p></div>
                          </div>
                        ))}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                          <div>
                            <h5 style={{ margin: '0 0 6px', fontSize: '12px', color: '#10B981', fontWeight: '700' }}>✓ Available Evidence ({DEMO_PORTFOLIO_ANAN.rcaLog.availableEvidence.length})</h5>
                            <ul style={{ paddingLeft: '14px', margin: 0, fontSize: '12px', color: '#475569' }}>
                              {DEMO_PORTFOLIO_ANAN.rcaLog.availableEvidence.map((e, i) => <li key={i} style={{ marginBottom: '3px' }}>{e}</li>)}
                            </ul>
                          </div>
                          <div>
                            <h5 style={{ margin: '0 0 6px', fontSize: '12px', color: '#EF4444', fontWeight: '700' }}>✗ Missing Evidence ({DEMO_PORTFOLIO_ANAN.rcaLog.missingEvidence.length})</h5>
                            <ul style={{ paddingLeft: '14px', margin: 0, fontSize: '12px', color: '#475569' }}>
                              {DEMO_PORTFOLIO_ANAN.rcaLog.missingEvidence.map((e, i) => <li key={i} style={{ marginBottom: '3px' }}>{e}</li>)}
                            </ul>
                          </div>
                        </div>
                        <div style={{ marginTop: '12px', padding: '10px', background: '#F0FDF4', borderRadius: '6px', fontSize: '13px', color: '#065F46' }}>
                          <strong>Corrective Action:</strong> {DEMO_PORTFOLIO_ANAN.rcaLog.initialCorrectiveAction}
                        </div>
                        <div style={{ marginTop: '8px', padding: '10px', background: '#EFF6FF', borderRadius: '6px', fontSize: '13px', color: '#1E40AF' }}>
                          <strong>Verification Plan:</strong> {DEMO_PORTFOLIO_ANAN.rcaLog.verificationPlan}
                        </div>
                      </>
                    )}
                    {selectedOutput === 'technicalMemo' && DEMO_PORTFOLIO_ANAN.technicalMemo && (
                      <>
                        <div style={{ border: '1px solid #CBD5E1', borderRadius: '10px', overflow: 'hidden' }}>
                          <div style={{ background: 'linear-gradient(135deg, #0F172A, #1E293B)', padding: '16px 20px', textAlign: 'center' }}>
                            <div style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>WorkReady AI Training Platform</div>
                            <h3 style={{ margin: '4px 0 0', color: '#FFF', fontSize: '16px' }}>TECHNICAL MEMO</h3>
                          </div>
                          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#F8FAFC' }}>
                            <tbody>
                              <tr><td style={{ padding: '6px 16px', fontSize: '12px', fontWeight: '700', color: '#334155', width: '100px', borderBottom: '1px solid #E2E8F0' }}>To:</td><td style={{ padding: '6px 16px', fontSize: '12px', color: '#475569', borderBottom: '1px solid #E2E8F0' }}>Management / QA Lead</td></tr>
                              <tr><td style={{ padding: '6px 16px', fontSize: '12px', fontWeight: '700', color: '#334155', borderBottom: '1px solid #E2E8F0' }}>Subject:</td><td style={{ padding: '6px 16px', fontSize: '12px', color: '#475569', borderBottom: '1px solid #E2E8F0' }}>{DEMO_PORTFOLIO_ANAN.technicalMemo.subject}</td></tr>
                              <tr><td style={{ padding: '6px 16px', fontSize: '12px', fontWeight: '700', color: '#334155', borderBottom: '1px solid #E2E8F0' }}>Date:</td><td style={{ padding: '6px 16px', fontSize: '12px', color: '#475569', borderBottom: '1px solid #E2E8F0' }}>{DEMO_PORTFOLIO_ANAN.technicalMemo.date}</td></tr>
                              <tr><td style={{ padding: '6px 16px', fontSize: '12px', fontWeight: '700', color: '#334155' }}>Prepared By:</td><td style={{ padding: '6px 16px', fontSize: '12px', color: '#475569' }}>{DEMO_PORTFOLIO_ANAN.technicalMemo.preparedBy}</td></tr>
                            </tbody>
                          </table>
                          <div style={{ padding: '16px 20px', fontSize: '13px', lineHeight: '1.7', color: '#374151' }}>
                            <h5 style={{ margin: '0 0 6px', color: '#1E293B' }}>1. Problem Summary</h5>
                            <p style={{ margin: '0 0 12px' }}>{DEMO_PORTFOLIO_ANAN.technicalMemo.problemSummary}</p>
                            <h5 style={{ margin: '0 0 6px', color: '#1E293B' }}>2. Evidence</h5>
                            <p style={{ margin: '0 0 12px' }}>{DEMO_PORTFOLIO_ANAN.technicalMemo.evidence}</p>
                            <h5 style={{ margin: '0 0 6px', color: '#1E293B' }}>3. Analysis</h5>
                            <p style={{ margin: '0 0 12px' }}>{DEMO_PORTFOLIO_ANAN.technicalMemo.analysis}</p>
                            <h5 style={{ margin: '0 0 6px', color: '#1E293B' }}>4. Recommended Action</h5>
                            <p style={{ margin: '0 0 12px', whiteSpace: 'pre-line' }}>{DEMO_PORTFOLIO_ANAN.technicalMemo.recommendedAction}</p>
                            <h5 style={{ margin: '0 0 6px', color: '#1E293B' }}>5. Next Step</h5>
                            <p style={{ margin: 0 }}>{DEMO_PORTFOLIO_ANAN.technicalMemo.nextStep}</p>
                          </div>
                        </div>
                      </>
                    )}
                    {selectedOutput === 'aiUsageLog' && DEMO_PORTFOLIO_ANAN.aiUsageLog && (
                      <>
                        <h4 style={{ margin: '0 0 12px', color: '#0F172A' }}>AI Usage Log — {DEMO_PORTFOLIO_ANAN.aiUsageLog.entries.length} Entries</h4>
                        <div style={{ overflowX: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead>
                              <tr style={{ background: '#F1F5F9' }}>
                                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '700', color: '#475569', borderBottom: '2px solid #E2E8F0' }}>#</th>
                                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '700', color: '#475569', borderBottom: '2px solid #E2E8F0' }}>AI Task</th>
                                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '700', color: '#475569', borderBottom: '2px solid #E2E8F0' }}>Prompt Used</th>
                                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '700', color: '#475569', borderBottom: '2px solid #E2E8F0' }}>AI Suggestion</th>
                                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '700', color: '#475569', borderBottom: '2px solid #E2E8F0' }}>Action</th>
                                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '700', color: '#475569', borderBottom: '2px solid #E2E8F0' }}>Reason</th>
                                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '700', color: '#475569', borderBottom: '2px solid #E2E8F0' }}>Verified</th>
                                <th style={{ padding: '8px 10px', textAlign: 'left', fontWeight: '700', color: '#475569', borderBottom: '2px solid #E2E8F0' }}>Conf.</th>
                              </tr>
                            </thead>
                            <tbody>
                              {DEMO_PORTFOLIO_ANAN.aiUsageLog.entries.map((e, i) => (
                                <tr key={e.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                  <td style={{ padding: '8px 10px', color: '#64748B' }}>{i+1}</td>
                                  <td style={{ padding: '8px 10px', fontWeight: '600', whiteSpace: 'nowrap' }}>{e.task}</td>
                                  <td style={{ padding: '8px 10px', maxWidth: '160px', color: '#64748B' }}>{e.promptUsed.slice(0, 80)}…</td>
                                  <td style={{ padding: '8px 10px', maxWidth: '160px', color: '#64748B' }}>{e.aiSuggestion.slice(0, 80)}…</td>
                                  <td style={{ padding: '8px 10px' }}>
                                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '10px', background: e.humanAction === 'accept' ? '#DCFCE7' : e.humanAction === 'reject' ? '#FEE2E2' : '#FEF3C7', color: e.humanAction === 'accept' ? '#166534' : e.humanAction === 'reject' ? '#991B1B' : '#92400E' }}>{e.humanAction}</span>
                                  </td>
                                  <td style={{ padding: '8px 10px', maxWidth: '160px', color: '#475569' }}>{e.reason.slice(0, 80)}…</td>
                                  <td style={{ padding: '8px 10px', textAlign: 'center' }}>{e.verifiedStatus ? '✓' : '—'}</td>
                                  <td style={{ padding: '8px 10px', color: '#64748B' }}>{e.confidence}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ── MENTOR FEEDBACK CARD ──────────────────────────────────── */}
                {feedback && (
                  <div className="student-card" style={{ marginTop: '16px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <h4 style={{ margin: 0, color: '#0F172A', fontSize: '15px' }}>Mentor Feedback</h4>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#2563EB' }}>{feedback.scores?.total || totalFromScores(feedback.scores)}</span>
                        <span style={{ fontSize: '13px', color: '#64748B' }}>/ 100</span>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                      {[
                        { label: 'Process Map', score: feedback.scores?.processMap, max: 15 },
                        { label: 'Risk Checklist', score: feedback.scores?.riskChecklist, max: 15 },
                        { label: 'RCA', score: feedback.scores?.rca, max: 25 },
                        { label: 'Documentation', score: feedback.scores?.documentation, max: 15 },
                        { label: 'Technical Memo', score: feedback.scores?.technicalMemo, max: 15 },
                        { label: 'Responsible AI', score: feedback.scores?.responsibleAi, max: 15 },
                      ].map(item => (
                        <div key={item.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: '600', color: '#64748B', marginBottom: '3px' }}>
                            <span>{item.label}</span><span>{item.score}/{item.max}</span>
                          </div>
                          <div style={{ height: '5px', background: '#E2E8F0', borderRadius: '3px' }}>
                            <div style={{ height: '100%', width: `${((item.score || 0)/item.max)*100}%`, background: '#2563EB', borderRadius: '3px' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {feedback.strength && <div style={{ padding: '10px 12px', background: '#ECFDF5', borderRadius: '8px', fontSize: '13px', color: '#065F46' }}><strong>Strength:</strong> {feedback.strength}</div>}
                      {feedback.improvement && <div style={{ padding: '10px 12px', background: '#FFFBEB', borderRadius: '8px', fontSize: '13px', color: '#78350F' }}><strong>Improvement:</strong> {feedback.improvement}</div>}
                      {feedback.missingEvidence && <div style={{ padding: '10px 12px', background: '#FEF2F2', borderRadius: '8px', fontSize: '13px', color: '#991B1B' }}><strong>Missing Evidence:</strong> {feedback.missingEvidence}</div>}
                      {feedback.suggestedNextStep && <div style={{ padding: '10px 12px', background: '#EFF6FF', borderRadius: '8px', fontSize: '13px', color: '#1E40AF' }}><strong>Suggested Next Step:</strong> {feedback.suggestedNextStep}</div>}
                      {feedback.finalComment && <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', fontSize: '13px', color: '#374151' }}><strong>Final Comment:</strong> {feedback.finalComment}</div>}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Readiness Score & Submit */}
              <div className="portfolio-right-column">
                
                {/* Readiness Score Card */}
                <div className="student-card portfolio-readiness-card">
                  <span className="portfolio-card-mini-label">{t('portfolio.readinessScore')}</span>
                  <div className="portfolio-readiness-score-display">
                    <h2 className="portfolio-readiness-score-number">{feedback?.scores?.total || displayReadiness}</h2>
                    <span className="portfolio-readiness-score-denom">/ 100</span>
                  </div>
                  <p className="portfolio-readiness-desc">
                    {t('portfolio.readinessDesc').replace('{track}', targetTrack || t('dashboard.yourTrack'))} </p>
                  
                  <div className="portfolio-readiness-bar">
                    <div className="portfolio-progress-fill" style={{ width: `${feedback?.scores?.total || displayReadiness}%` }}></div>
                  </div>

                  <div className="portfolio-metrics-list">
                    <div className="portfolio-metric-row">
                      <span className="portfolio-metric-name">{t('portfolio.completed')}</span>
                      <span className="portfolio-metric-value">{completedCount} / 5</span>
                    </div>
                    <div className="portfolio-metric-row">
                      <span className="portfolio-metric-name">Readiness Level</span>
                      <span className="portfolio-metric-value" style={{ color: readinessInfo.color }}>{readinessInfo.level}</span>
                    </div>
                    <div className="portfolio-metric-row">
                      <span className="portfolio-metric-name">Review Status</span>
                      <span className="portfolio-metric-value" style={{ color: feedback?.reviewStatus === 'reviewed' ? '#10B981' : '#F59E0B' }}>
                        {feedback?.reviewStatus === 'reviewed' ? 'Reviewed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit for Review Card */}
                <div className="student-card portfolio-submit-card">
                  <h4 className="portfolio-submit-title">{t('portfolio.submitReview')}</h4>
                  <p className="portfolio-submit-desc">{t('portfolio.submitReviewDesc')}</p>
                  {submissionSent ? (
                    <div style={{ padding: '12px', background: '#ECFDF5', borderRadius: '8px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: '#059669' }}>
                      ✓ Portfolio sent to mentor for review!
                    </div>
                  ) : (
                    <button className="portfolio-submit-btn" onClick={handleSendToMentor}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                      <span>Send to Mentor Review</span>
                    </button>
                  )}
                  <span className="portfolio-submit-notification">{t('portfolio.submitNotification')}</span>
                </div>

              </div>

            </div>

          </div>
  );
}

function totalFromScores(scores) {
  if (!scores) return 0;
  return (scores.processMap || 0) + (scores.riskChecklist || 0) + (scores.rca || 0) + (scores.documentation || 0) + (scores.technicalMemo || 0) + (scores.responsibleAi || 0);
}
