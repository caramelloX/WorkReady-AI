import React, { useState, useEffect, useRef } from 'react';
import './ScenarioWorkspace.css';

const STATIONS = [
  { id: 1, key: 'factProcess', label: 'Fact & Process',   shortLabel: 'Facts'   },
  { id: 2, key: 'riskScan',    label: 'Risk Scan',         shortLabel: 'Risks'   },
  { id: 3, key: 'rca',         label: 'RCA Investigation', shortLabel: 'RCA'     },
  { id: 4, key: 'memo',        label: 'Technical Memo',    shortLabel: 'Memo'    },
  { id: 5, key: 'aiLog',       label: 'AI Usage Log',      shortLabel: 'AI Log'  },
];

const RISK_TYPES = ['Safety Risk', 'Quality Risk', 'SOP Deviation', 'Traceability Issue'];

const emptyWorkData = () => ({
  facts: [{ id: Date.now(), claim: '', isAssumption: false, evidenceNeeded: '' }],
  processSteps: [{ id: 1, step: '', responsible: '', risk: false, notes: '' }],
  risks: [{ id: Date.now(), type: 'Safety Risk', description: '', evidence: '', severity: 'Medium', confidence: 'Likely', requiredEvidence: '', suggestedAction: '' }],
  rcaProblem: '',
  fiveWhy: [1,2,3,4,5].map(n => ({ why: n, question: `Why ${n}:`, answer: '' })),
  rcaAvailableEvidence: [''],
  rcaMissingEvidence: [''],
  rcaCorrective: '',
  rcaVerification: '',
  memoSubject: '',
  memoProblemSummary: '',
  memoEvidence: '',
  memoAnalysis: '',
  memoRecommended: '',
  memoNextStep: '',
  memoDate: new Date().toISOString().split('T')[0],
  memoPreparedBy: '',
  aiEntries: [],
  submitted: false,
});

export default function ScenarioWorkspace({ scenario, currentUser, onClose, onSubmitToMentor }) {
  const [activeStation, setActiveStation] = useState(1);
  const [work, setWork] = useState(emptyWorkData);
  const [saved, setSaved] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitDone, setSubmitDone] = useState(false);

  // AI Coach state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);
  const [humanAction, setHumanAction] = useState('');
  const [humanReason, setHumanReason] = useState('');
  const [aiLogSaved, setAiLogSaved] = useState(false);
  const [activeAiTask, setActiveAiTask] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Restore saved work
  useEffect(() => {
    if (!scenario?.id) return;
    const key = `sw_${scenario.id}_${currentUser?.id || 'guest'}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { setWork(JSON.parse(saved)); } catch {}
    }
    if (currentUser?.fullname) {
      setWork(w => ({ ...w, memoPreparedBy: currentUser.fullname }));
    }
  }, [scenario?.id, currentUser?.id]);

  const saveWork = () => {
    if (!scenario?.id) return;
    const key = `sw_${scenario.id}_${currentUser?.id || 'guest'}`;
    localStorage.setItem(key, JSON.stringify(work));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // ── AI Coach ──────────────────────────────────────────────────────────────
  const getAiContext = () => {
    const ctx = scenario?.context || '';
    const facts = work.facts.filter(f => f.claim).map(f => `- ${f.claim}${f.isAssumption ? ' [ASSUMPTION]' : ''}`).join('\n');
    const risks = work.risks.filter(r => r.description).map(r => `- ${r.type}: ${r.description} (${r.severity})`).join('\n');
    const rca = work.fiveWhy.map(w => `Why ${w.why}: ${w.answer}`).filter(w => !w.endsWith(': ')).join('\n');
    return `Scenario: ${scenario?.title}\n\nContext: ${ctx}\n\nStudent Facts:\n${facts}\n\nRisks:\n${risks}\n\nRCA:\n${rca}`;
  };

  const callAiCoach = async (task, prompt) => {
    setAiLoading(true);
    setActiveAiTask(task);
    setAiSuggestion(null);
    setHumanAction('');
    setHumanReason('');
    setAiLogSaved(false);
    try {
      const res = await fetch(`${API_URL}/api/scenario/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario?.id,
          scenarioTitle: scenario?.title,
          message: prompt,
          chatHistory: [],
          scenarioContext: getAiContext(),
        }),
      });
      const data = await res.json();
      setAiSuggestion(data.reply || data.message || 'No suggestion available.');
    } catch {
      setAiSuggestion('AI Coach is temporarily unavailable. Please continue without AI assistance.');
    } finally {
      setAiLoading(false);
    }
  };

  const saveToAiLog = () => {
    if (!aiSuggestion || !humanAction || !humanReason.trim()) return;
    const entry = {
      id: Date.now(),
      task: activeAiTask,
      promptUsed: '(contextual prompt)',
      aiSuggestion,
      humanAction,
      reason: humanReason,
      verifiedStatus: humanAction === 'accept',
      confidence: 'Medium',
    };
    setWork(w => ({ ...w, aiEntries: [...w.aiEntries, entry] }));
    setAiLogSaved(true);
    setActiveStation(5);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (onSubmitToMentor) await onSubmitToMentor();
      setSubmitDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  const completionPercent = () => {
    let done = 0;
    if (work.facts.some(f => f.claim)) done++;
    if (work.processSteps.some(s => s.step)) done++;
    if (work.risks.some(r => r.description)) done++;
    if (work.rcaProblem) done++;
    if (work.fiveWhy.filter(w => w.answer).length >= 3) done++;
    if (work.memoSubject) done++;
    if (work.aiEntries.length > 0) done++;
    return Math.round((done / 7) * 100);
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const setWorkField = (field, value) => setWork(w => ({ ...w, [field]: value }));

  const updateFact = (id, field, value) =>
    setWork(w => ({ ...w, facts: w.facts.map(f => f.id === id ? { ...f, [field]: value } : f) }));
  const addFact = () =>
    setWork(w => ({ ...w, facts: [...w.facts, { id: Date.now(), claim: '', isAssumption: false, evidenceNeeded: '' }] }));
  const removeFact = (id) =>
    setWork(w => ({ ...w, facts: w.facts.filter(f => f.id !== id) }));

  const updateStep = (idx, field, value) =>
    setWork(w => ({ ...w, processSteps: w.processSteps.map((s, i) => i === idx ? { ...s, [field]: value } : s) }));
  const addStep = () =>
    setWork(w => ({ ...w, processSteps: [...w.processSteps, { id: Date.now(), step: '', responsible: '', risk: false, notes: '' }] }));
  const removeStep = (idx) =>
    setWork(w => ({ ...w, processSteps: w.processSteps.filter((_, i) => i !== idx) }));

  const updateRisk = (id, field, value) =>
    setWork(w => ({ ...w, risks: w.risks.map(r => r.id === id ? { ...r, [field]: value } : r) }));
  const addRisk = () =>
    setWork(w => ({ ...w, risks: [...w.risks, { id: Date.now(), type: 'Safety Risk', description: '', evidence: '', severity: 'Medium', confidence: 'Likely', requiredEvidence: '', suggestedAction: '' }] }));
  const removeRisk = (id) =>
    setWork(w => ({ ...w, risks: w.risks.filter(r => r.id !== id) }));

  const updateWhy = (idx, value) =>
    setWork(w => ({ ...w, fiveWhy: w.fiveWhy.map((item, i) => i === idx ? { ...item, answer: value } : item) }));

  const updateListItem = (field, idx, value) =>
    setWork(w => ({ ...w, [field]: w[field].map((item, i) => i === idx ? value : item) }));
  const addListItem = (field) =>
    setWork(w => ({ ...w, [field]: [...w[field], ''] }));
  const removeListItem = (field, idx) =>
    setWork(w => ({ ...w, [field]: w[field].filter((_, i) => i !== idx) }));

  const removeAiEntry = (id) =>
    setWork(w => ({ ...w, aiEntries: w.aiEntries.filter(e => e.id !== id) }));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="sw-root">

      {/* ── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="sw-topbar">
        <button className="sw-back-btn" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back
        </button>
        <div className="sw-topbar-center">
          <div className="sw-scenario-meta">
            <span className="sw-app-tag">WorkReady AI</span>
            <span className="sw-sep">›</span>
            <span className="sw-page-tag">Factory Scenario Simulator</span>
          </div>
          <h1 className="sw-scenario-title">{scenario?.title || 'Scenario'}</h1>
          <div className="sw-scenario-badges">
            <span className="sw-badge sw-badge--difficulty">{scenario?.difficulty || 'Medium'}</span>
            <span className="sw-badge sw-badge--time">⏱ {scenario?.estimatedTime || '25 min'}</span>
            <span className="sw-badge sw-badge--status">In Progress</span>
          </div>
        </div>
        <div className="sw-topbar-actions">
          <button className="sw-btn sw-btn--ghost" onClick={saveWork}>{saved ? '✓ Saved' : 'Save Draft'}</button>
          {submitDone
            ? <span className="sw-submit-done">✓ Submitted to Mentor</span>
            : <button className="sw-btn sw-btn--primary" disabled={submitting} onClick={handleSubmit}>
                {submitting ? 'Submitting…' : 'Submit to Mentor'}
              </button>
          }
        </div>
      </div>

      {/* ── Progress Stepper ─────────────────────────────────────────────── */}
      <div className="sw-stepper">
        {STATIONS.map((st, idx) => (
          <React.Fragment key={st.id}>
            <button
              className={`sw-step ${activeStation === st.id ? 'active' : ''} ${activeStation > st.id ? 'done' : ''}`}
              onClick={() => setActiveStation(st.id)}
            >
              <div className="sw-step-circle">
                {activeStation > st.id
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  : st.id}
              </div>
              <span className="sw-step-label">{st.label}</span>
            </button>
            {idx < STATIONS.length - 1 && <div className={`sw-step-line ${activeStation > st.id ? 'done' : ''}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* ── Body: 3-column ───────────────────────────────────────────────── */}
      <div className="sw-body">

        {/* Left: Evidence Panel */}
        <aside className="sw-evidence-panel">
          <div className="sw-panel-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            Scenario Evidence
          </div>

          <details className="sw-evidence-section" open>
            <summary>Scenario Brief</summary>
            <p>{scenario?.context}</p>
          </details>

          <details className="sw-evidence-section" open>
            <summary>Process Data</summary>
            {scenario?.processData && (
              <table className="sw-evidence-table">
                <tbody>
                  <tr><td>Line</td><td>{scenario.processData.lineId}</td></tr>
                  <tr><td>Product</td><td>{scenario.processData.product}</td></tr>
                  <tr><td>Baseline Defect</td><td>{scenario.processData.baseline_defect_rate}</td></tr>
                  <tr><td>Current Defect</td><td><strong style={{color:'#DC2626'}}>{scenario.processData.current_defect_rate}</strong></td></tr>
                  <tr><td>Volume</td><td>{scenario.processData.production_volume}</td></tr>
                  <tr><td>Period</td><td>{scenario.processData.observation_period}</td></tr>
                </tbody>
              </table>
            )}
            <div className="sw-machine-list">
              {scenario?.processData?.machines?.map(m => (
                <div key={m.id} className={`sw-machine-tag ${m.status === 'Under Review' ? 'review' : ''}`}>
                  <strong>{m.id}</strong> — {m.status}<br/><small>{m.notes}</small>
                </div>
              ))}
            </div>
          </details>

          <details className="sw-evidence-section">
            <summary>SOP Excerpt</summary>
            <pre className="sw-sop-text">{scenario?.sopExcerpt}</pre>
          </details>

          <details className="sw-evidence-section">
            <summary>Defect Log</summary>
            <table className="sw-evidence-table">
              <thead><tr><th>Batch</th><th>Shift</th><th>Rate</th></tr></thead>
              <tbody>
                {scenario?.defectLog?.map((d, i) => (
                  <tr key={i}>
                    <td>{d.batchId}</td>
                    <td>{d.shift}</td>
                    <td style={{color: parseFloat(d.defectRate)>5?'#DC2626':'inherit', fontWeight:'600'}}>{d.defectRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>

          <details className="sw-evidence-section">
            <summary>Operator Note</summary>
            <pre className="sw-operator-note">{scenario?.operatorNote}</pre>
          </details>
        </aside>

        {/* Center: Station Workspace */}
        <main className="sw-workspace">

          {/* ── STATION 1: Fact Lock & Process Map ──────────────────────── */}
          {activeStation === 1 && (
            <div className="sw-station">
              <div className="sw-station-header">
                <div>
                  <h2>Station 1: Fact Lock & Process Map</h2>
                  <p>Identify confirmed facts from evidence. Tag any claim without direct evidence as an Assumption.</p>
                </div>
              </div>

              <div className="sw-guardrail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <strong>Fact Lock:</strong> You must identify confirmed facts before requesting AI review. Claims without evidence must be tagged as assumptions.
              </div>

              <h3 className="sw-section-title">Facts & Assumptions Table</h3>
              <div className="sw-fact-table">
                <div className="sw-fact-header">
                  <span style={{flex:3}}>Claim / Statement</span>
                  <span style={{flex:1,textAlign:'center'}}>Assumption?</span>
                  <span style={{flex:2}}>Evidence Needed (if assumption)</span>
                  <span style={{width:'40px'}}></span>
                </div>
                {work.facts.map(fact => (
                  <div key={fact.id} className={`sw-fact-row ${fact.isAssumption ? 'assumption' : ''}`}>
                    <textarea
                      style={{flex:3}}
                      placeholder="Enter a factual claim from the scenario evidence..."
                      value={fact.claim}
                      rows={2}
                      onChange={e => updateFact(fact.id, 'claim', e.target.value)}
                    />
                    <div style={{flex:1,display:'flex',justifyContent:'center',alignItems:'flex-start',paddingTop:'8px'}}>
                      <input
                        type="checkbox"
                        checked={fact.isAssumption}
                        onChange={e => updateFact(fact.id, 'isAssumption', e.target.checked)}
                        className="sw-checkbox"
                      />
                    </div>
                    <textarea
                      style={{flex:2}}
                      placeholder="What evidence would confirm this?"
                      value={fact.evidenceNeeded}
                      rows={2}
                      disabled={!fact.isAssumption}
                      onChange={e => updateFact(fact.id, 'evidenceNeeded', e.target.value)}
                    />
                    <button className="sw-remove-btn" onClick={() => removeFact(fact.id)}>×</button>
                  </div>
                ))}
                <button className="sw-add-btn" onClick={addFact}>+ Add Row</button>
              </div>

              <h3 className="sw-section-title" style={{marginTop:'28px'}}>Process Map Builder</h3>
              <p className="sw-section-sub">Map the sequence of steps in the production process. Mark steps with a risk flag where you see a control gap or failure point.</p>
              <div className="sw-process-map">
                {work.processSteps.map((step, idx) => (
                  <div key={step.id || idx} className="sw-process-step-row">
                    <div className={`sw-step-num ${step.risk ? 'risk' : ''}`}>{idx + 1}</div>
                    <input
                      className="sw-input sw-input--step"
                      placeholder="Process step description..."
                      value={step.step}
                      onChange={e => updateStep(idx, 'step', e.target.value)}
                    />
                    <input
                      className="sw-input sw-input--resp"
                      placeholder="Responsible party..."
                      value={step.responsible}
                      onChange={e => updateStep(idx, 'responsible', e.target.value)}
                    />
                    <label className="sw-risk-flag">
                      <input
                        type="checkbox"
                        checked={step.risk}
                        onChange={e => updateStep(idx, 'risk', e.target.checked)}
                      />
                      <span>Risk</span>
                    </label>
                    <button className="sw-remove-btn" onClick={() => removeStep(idx)}>×</button>
                  </div>
                ))}
                <button className="sw-add-btn" onClick={addStep}>+ Add Step</button>
              </div>
            </div>
          )}

          {/* ── STATION 2: Safety & Quality Risk Scan ────────────────────── */}
          {activeStation === 2 && (
            <div className="sw-station">
              <div className="sw-station-header">
                <div>
                  <h2>Station 2: Safety & Quality Risk Scan</h2>
                  <p>Identify safety risks, quality risks, SOP deviations, and traceability issues. Rate each by severity and confidence level.</p>
                </div>
              </div>

              <div className="sw-guardrail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <strong>AI Guardrail:</strong> AI cannot make final safety decisions. All risk ratings must be confirmed by a human reviewer.
              </div>

              <div className="sw-risk-list">
                {work.risks.map(risk => (
                  <div key={risk.id} className={`sw-risk-card ${risk.severity.toLowerCase()}`}>
                    <div className="sw-risk-card-top">
                      <select
                        className="sw-select sw-select--type"
                        value={risk.type}
                        onChange={e => updateRisk(risk.id, 'type', e.target.value)}
                      >
                        {RISK_TYPES.map(t => <option key={t}>{t}</option>)}
                      </select>
                      <select
                        className="sw-select"
                        value={risk.severity}
                        onChange={e => updateRisk(risk.id, 'severity', e.target.value)}
                      >
                        <option>Low</option><option>Medium</option><option>High</option>
                      </select>
                      <select
                        className="sw-select"
                        value={risk.confidence}
                        onChange={e => updateRisk(risk.id, 'confidence', e.target.value)}
                      >
                        <option>Confirmed</option><option>Likely</option><option>Assumption</option>
                      </select>
                      <button className="sw-remove-btn" onClick={() => removeRisk(risk.id)}>×</button>
                    </div>
                    <div className="sw-risk-fields">
                      <label>Description</label>
                      <textarea rows={2} placeholder="Describe the risk..." value={risk.description} onChange={e => updateRisk(risk.id, 'description', e.target.value)} />
                      <label>Evidence</label>
                      <textarea rows={2} placeholder="What evidence supports this risk?" value={risk.evidence} onChange={e => updateRisk(risk.id, 'evidence', e.target.value)} />
                      <label>Required Evidence</label>
                      <textarea rows={1} placeholder="What additional evidence is still needed?" value={risk.requiredEvidence} onChange={e => updateRisk(risk.id, 'requiredEvidence', e.target.value)} />
                      <label>Suggested Action</label>
                      <textarea rows={2} placeholder="What immediate or corrective action do you recommend?" value={risk.suggestedAction} onChange={e => updateRisk(risk.id, 'suggestedAction', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="sw-add-btn sw-add-btn--card" onClick={addRisk}>+ Add Risk Item</button>
            </div>
          )}

          {/* ── STATION 3: RCA Investigation ─────────────────────────────── */}
          {activeStation === 3 && (
            <div className="sw-station">
              <div className="sw-station-header">
                <div>
                  <h2>Station 3: RCA Investigation</h2>
                  <p>Complete a structured 5-Why Root Cause Analysis. Separate confirmed facts from assumptions. Identify what evidence is missing.</p>
                </div>
              </div>

              <h3 className="sw-section-title">Problem Statement</h3>
              <textarea
                className="sw-textarea"
                rows={3}
                placeholder="Clearly state the problem to be investigated. Include what, where, when, and magnitude..."
                value={work.rcaProblem}
                onChange={e => setWorkField('rcaProblem', e.target.value)}
              />

              <h3 className="sw-section-title" style={{marginTop:'24px'}}>5-Why Analysis</h3>
              <div className="sw-five-why">
                {work.fiveWhy.map((item, idx) => (
                  <div key={item.why} className="sw-why-row">
                    <div className="sw-why-num">{item.why}</div>
                    <div className="sw-why-content">
                      <div className="sw-why-q">{item.question}</div>
                      <textarea
                        className="sw-textarea"
                        rows={2}
                        placeholder={`Because...`}
                        value={item.answer}
                        onChange={e => updateWhy(idx, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="sw-rca-grid">
                <div>
                  <h3 className="sw-section-title">Available Evidence</h3>
                  {work.rcaAvailableEvidence.map((ev, idx) => (
                    <div key={idx} className="sw-list-row">
                      <input className="sw-input" placeholder="Evidence item..." value={ev} onChange={e => updateListItem('rcaAvailableEvidence', idx, e.target.value)} />
                      <button className="sw-remove-btn" onClick={() => removeListItem('rcaAvailableEvidence', idx)}>×</button>
                    </div>
                  ))}
                  <button className="sw-add-btn" onClick={() => addListItem('rcaAvailableEvidence')}>+ Add</button>
                </div>
                <div>
                  <h3 className="sw-section-title">Missing Evidence</h3>
                  {work.rcaMissingEvidence.map((ev, idx) => (
                    <div key={idx} className="sw-list-row">
                      <input className="sw-input" placeholder="Missing evidence item..." value={ev} onChange={e => updateListItem('rcaMissingEvidence', idx, e.target.value)} />
                      <button className="sw-remove-btn" onClick={() => removeListItem('rcaMissingEvidence', idx)}>×</button>
                    </div>
                  ))}
                  <button className="sw-add-btn" onClick={() => addListItem('rcaMissingEvidence')}>+ Add</button>
                </div>
              </div>

              <h3 className="sw-section-title" style={{marginTop:'24px'}}>Initial Corrective Action</h3>
              <textarea className="sw-textarea" rows={2} placeholder="What immediate action should be taken now?" value={work.rcaCorrective} onChange={e => setWorkField('rcaCorrective', e.target.value)} />

              <h3 className="sw-section-title" style={{marginTop:'16px'}}>Verification Plan</h3>
              <textarea className="sw-textarea" rows={2} placeholder="How will you verify the corrective action resolved the root cause?" value={work.rcaVerification} onChange={e => setWorkField('rcaVerification', e.target.value)} />
            </div>
          )}

          {/* ── STATION 4: Technical Memo Builder ────────────────────────── */}
          {activeStation === 4 && (
            <div className="sw-station sw-station--memo">
              <div className="sw-station-header">
                <div>
                  <h2>Station 4: Technical Memo Builder</h2>
                  <p>Convert your investigation findings into a structured, professional technical memo.</p>
                </div>
              </div>

              <div className="sw-memo-layout">
                {/* Memo Form */}
                <div className="sw-memo-form">
                  <div className="sw-memo-row">
                    <label>Subject</label>
                    <input className="sw-input" placeholder="Root Cause Investigation — [Topic]" value={work.memoSubject} onChange={e => setWorkField('memoSubject', e.target.value)} />
                  </div>
                  <div className="sw-memo-row-2col">
                    <div>
                      <label>Date</label>
                      <input type="date" className="sw-input" value={work.memoDate} onChange={e => setWorkField('memoDate', e.target.value)} />
                    </div>
                    <div>
                      <label>Prepared By</label>
                      <input className="sw-input" placeholder="Your name / role" value={work.memoPreparedBy} onChange={e => setWorkField('memoPreparedBy', e.target.value)} />
                    </div>
                  </div>
                  <div className="sw-memo-row">
                    <label>Problem Summary</label>
                    <textarea className="sw-textarea" rows={3} placeholder="Concise summary of the problem, scope, and timeline..." value={work.memoProblemSummary} onChange={e => setWorkField('memoProblemSummary', e.target.value)} />
                  </div>
                  <div className="sw-memo-row">
                    <label>Evidence</label>
                    <textarea className="sw-textarea" rows={3} placeholder="Key evidence documents, data, and sources referenced..." value={work.memoEvidence} onChange={e => setWorkField('memoEvidence', e.target.value)} />
                  </div>
                  <div className="sw-memo-row">
                    <label>Analysis</label>
                    <textarea className="sw-textarea" rows={4} placeholder="Your analysis linking evidence to the root cause..." value={work.memoAnalysis} onChange={e => setWorkField('memoAnalysis', e.target.value)} />
                  </div>
                  <div className="sw-memo-row">
                    <label>Recommended Action</label>
                    <textarea className="sw-textarea" rows={3} placeholder="Specific corrective and preventive actions recommended..." value={work.memoRecommended} onChange={e => setWorkField('memoRecommended', e.target.value)} />
                  </div>
                  <div className="sw-memo-row">
                    <label>Next Step</label>
                    <textarea className="sw-textarea" rows={2} placeholder="Who does what by when to implement the recommendation?" value={work.memoNextStep} onChange={e => setWorkField('memoNextStep', e.target.value)} />
                  </div>
                </div>

                {/* Live Preview */}
                <div className="sw-memo-preview">
                  <div className="sw-memo-preview-header">Live Preview</div>
                  <div className="sw-memo-doc">
                    <div className="sw-memo-doc-header">
                      <div className="sw-memo-doc-company">WorkReady AI Training Platform</div>
                      <h2 className="sw-memo-doc-title">TECHNICAL MEMO</h2>
                    </div>
                    <table className="sw-memo-meta-table">
                      <tbody>
                        <tr><td>Subject:</td><td>{work.memoSubject || '—'}</td></tr>
                        <tr><td>Date:</td><td>{work.memoDate || '—'}</td></tr>
                        <tr><td>Prepared by:</td><td>{work.memoPreparedBy || '—'}</td></tr>
                        <tr><td>Scenario:</td><td>{scenario?.title}</td></tr>
                      </tbody>
                    </table>
                    {work.memoProblemSummary && <><h4>1. Problem Summary</h4><p>{work.memoProblemSummary}</p></>}
                    {work.memoEvidence && <><h4>2. Evidence</h4><p>{work.memoEvidence}</p></>}
                    {work.memoAnalysis && <><h4>3. Analysis</h4><p>{work.memoAnalysis}</p></>}
                    {work.memoRecommended && <><h4>4. Recommended Action</h4><p>{work.memoRecommended}</p></>}
                    {work.memoNextStep && <><h4>5. Next Step</h4><p>{work.memoNextStep}</p></>}
                    {!work.memoSubject && !work.memoProblemSummary && (
                      <p className="sw-memo-placeholder">Fill in the form to see your memo preview here.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STATION 5: AI Usage Log & Portfolio Submit ────────────────── */}
          {activeStation === 5 && (
            <div className="sw-station">
              <div className="sw-station-header">
                <div>
                  <h2>Station 5: AI Usage Log & Portfolio Submit</h2>
                  <p>Document how AI assisted you and what human decision you made. This is required to demonstrate responsible AI usage.</p>
                </div>
              </div>

              <div className="sw-guardrail">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <strong>Responsible AI:</strong> Every AI suggestion must have a recorded human decision (Accept, Reject, or Revise) with a reason. AI cannot make final safety or employment decisions.
              </div>

              {/* AI Log Table */}
              <h3 className="sw-section-title">AI Usage Log ({work.aiEntries.length} entries)</h3>
              {work.aiEntries.length === 0 ? (
                <p className="sw-empty-hint">No AI usage recorded yet. Use the AI Coach sidebar to get suggestions, then save them here.</p>
              ) : (
                <div className="sw-ai-log-table-wrapper">
                  <table className="sw-ai-log-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>AI Task</th>
                        <th>AI Suggestion (summary)</th>
                        <th>Human Action</th>
                        <th>Reason</th>
                        <th>Verified</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {work.aiEntries.map((entry, idx) => (
                        <tr key={entry.id}>
                          <td>{idx + 1}</td>
                          <td>{entry.task}</td>
                          <td className="sw-ai-log-suggestion">{entry.aiSuggestion?.slice(0, 120)}…</td>
                          <td>
                            <span className={`sw-action-badge ${entry.humanAction}`}>{entry.humanAction}</span>
                          </td>
                          <td>{entry.reason}</td>
                          <td>{entry.verifiedStatus ? '✓' : '—'}</td>
                          <td><button className="sw-remove-btn" onClick={() => removeAiEntry(entry.id)}>×</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Portfolio Completion Checklist */}
              <h3 className="sw-section-title" style={{marginTop:'28px'}}>Portfolio Completion Checklist</h3>
              <div className="sw-checklist">
                {[
                  { label: 'Process Map', done: work.processSteps.some(s => s.step) },
                  { label: 'Safety & Quality Checklist', done: work.risks.some(r => r.description) },
                  { label: 'RCA Log', done: !!(work.rcaProblem && work.fiveWhy.filter(w => w.answer).length >= 3) },
                  { label: 'Technical Memo', done: !!(work.memoSubject && work.memoAnalysis) },
                  { label: 'AI Usage Log', done: work.aiEntries.length > 0 },
                ].map(item => (
                  <div key={item.label} className={`sw-checklist-item ${item.done ? 'done' : ''}`}>
                    <div className={`sw-checklist-dot ${item.done ? 'done' : ''}`}>
                      {item.done
                        ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        : null}
                    </div>
                    <span>{item.label}</span>
                    <span className={`sw-checklist-status ${item.done ? 'done' : ''}`}>{item.done ? 'Completed' : 'Not started'}</span>
                  </div>
                ))}
              </div>

              <div className="sw-submit-section">
                <div>
                  <div className="sw-progress-label">Overall Completion: {completionPercent()}%</div>
                  <div className="sw-progress-bar"><div className="sw-progress-fill" style={{width:`${completionPercent()}%`}}/></div>
                </div>
                {submitDone
                  ? <div className="sw-submit-done-card">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
                      Portfolio submitted to mentor for review!
                    </div>
                  : <button className="sw-btn sw-btn--primary sw-btn--lg" disabled={submitting} onClick={handleSubmit}>
                      {submitting ? 'Submitting…' : 'Send to Mentor Review'}
                    </button>
                }
              </div>
            </div>
          )}

          {/* ── Bottom Navigation ─────────────────────────────────────────── */}
          <div className="sw-bottom-nav">
            <button className="sw-btn sw-btn--ghost" disabled={activeStation === 1} onClick={() => setActiveStation(s => s - 1)}>← Previous</button>
            <div className="sw-bottom-progress">
              <div className="sw-mini-bar"><div style={{width:`${completionPercent()}%`}} className="sw-mini-fill"/></div>
              <span>{completionPercent()}% complete</span>
            </div>
            <button className="sw-btn sw-btn--ghost" disabled={activeStation === 5} onClick={() => setActiveStation(s => s + 1)}>Next →</button>
          </div>
        </main>

        {/* Right: AI Coach Sidebar */}
        <aside className="sw-ai-sidebar">
          <div className="sw-ai-sidebar-header">
            <div className="sw-ai-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              AI Coach
            </div>
            <div className="sw-human-first-badge">Human First / AI Second</div>
          </div>

          <p className="sw-ai-sidebar-desc">AI suggests — you decide. Every suggestion requires your Accept, Reject, or Revise decision.</p>

          <div className="sw-ai-notice">
            ⚠ AI is a coach, not a decision maker. Every AI suggestion requires human action. AI cannot make final safety, corrective-action, or employment decisions.
          </div>

          <div className="sw-ai-action-buttons">
            <button className="sw-ai-btn" disabled={aiLoading} onClick={() => callAiCoach('Review Facts', 'Review my list of facts from the scenario. Identify any claims I should tag as assumptions rather than confirmed facts. Point out what evidence is missing.')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Review Facts
            </button>
            <button className="sw-ai-btn" disabled={aiLoading} onClick={() => callAiCoach('Check Missing Evidence', 'Based on the scenario evidence and the risks identified, what critical evidence is still missing? What should I look for to strengthen my analysis?')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              Check Missing Evidence
            </button>
            <button className="sw-ai-btn" disabled={aiLoading} onClick={() => callAiCoach('Challenge RCA', 'Review my 5-Why RCA analysis. Is the root cause I identified at Why 5 a genuine root cause, or is there a deeper systemic issue? Challenge my logic and suggest improvements.')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              Challenge RCA
            </button>
            <button className="sw-ai-btn" disabled={aiLoading} onClick={() => callAiCoach('Polish Memo', 'Review my technical memo for clarity, professional tone, and completeness. Suggest improvements to make the analysis and recommended action sections stronger.')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              Polish Memo
            </button>
            <button className="sw-ai-btn" disabled={aiLoading} onClick={() => callAiCoach('Generate AI Usage Log', 'Summarise the key moments in this investigation where AI assistance would have been useful. List 2–3 specific AI tasks with example prompts a student might use.')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              Generate AI Usage Log
            </button>
          </div>

          {/* Suggestion Card */}
          {aiLoading && (
            <div className="sw-ai-loading">
              <div className="sw-ai-spinner" />
              AI Coach is thinking…
            </div>
          )}

          {aiSuggestion && !aiLoading && (
            <div className="sw-ai-suggestion-card">
              <div className="sw-ai-suggestion-label">AI Suggestion — {activeAiTask}</div>
              <p className="sw-ai-suggestion-text">{aiSuggestion}</p>

              <div className="sw-human-decision">
                <div className="sw-human-decision-title">Your Decision (required)</div>
                <div className="sw-action-row">
                  {['accept', 'reject', 'revise'].map(a => (
                    <button
                      key={a}
                      className={`sw-action-btn ${a} ${humanAction === a ? 'selected' : ''}`}
                      onClick={() => setHumanAction(a)}
                    >
                      {a.charAt(0).toUpperCase() + a.slice(1)}
                    </button>
                  ))}
                </div>
                <textarea
                  className="sw-textarea"
                  rows={3}
                  placeholder="Explain your decision. Why did you accept, reject, or revise this suggestion?"
                  value={humanReason}
                  onChange={e => setHumanReason(e.target.value)}
                />
                <button
                  className="sw-btn sw-btn--primary"
                  style={{width:'100%', marginTop:'8px'}}
                  disabled={!humanAction || !humanReason.trim()}
                  onClick={saveToAiLog}
                >
                  {aiLogSaved ? '✓ Saved to AI Log' : 'Save to AI Usage Log'}
                </button>
              </div>
            </div>
          )}

          {!aiSuggestion && !aiLoading && (
            <div className="sw-ai-idle">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5">
                <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
              <p>Click an action above to ask the AI Coach for guidance.</p>
            </div>
          )}
        </aside>

      </div>
    </div>
  );
}
