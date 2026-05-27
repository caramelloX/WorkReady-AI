import React, { useState, useRef } from 'react';
import {
  Info, Target, Layers, FileText, ClipboardList, Users,
  CheckSquare, Eye, AlertTriangle, Plus, Trash2, X, CheckCircle2,
  Sparkles, Loader2
} from 'lucide-react';
import { checkScenarioQuality } from '../../utils/aiMentorService.js';
import './ScenarioManager.css';
import { FACULTIES, MAJORS, SKILLS } from '../../data/scenarioData.js';

const TRACKS = [
  { code: 'quality_assurance',   label: 'Quality Assurance' },
  { code: 'maintenance_machine', label: 'Machine Maintenance' },
  { code: 'production_process',  label: 'Production Process' },
  { code: 'safety_compliance',   label: 'Safety & Compliance' },
];

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

const PORTFOLIO_CAPS = [
  { key: 'canReviewProcessMap',      label: 'Process Map' },
  { key: 'canReviewRiskChecklist',   label: 'Risk Checklist' },
  { key: 'canReviewRca',             label: 'RCA / 5-Why' },
  { key: 'canReviewTechnicalMemo',   label: 'Technical Memo' },
  { key: 'canReviewAiUsageLog',      label: 'AI Usage Log' },
];

const STEPS = [
  { id: 0, icon: Info,          label: 'Basic Info' },
  { id: 1, icon: Target,        label: 'Targeting' },
  { id: 2, icon: Layers,        label: 'Skill Mapping' },
  { id: 3, icon: FileText,      label: 'Evidence Pack' },
  { id: 4, icon: ClipboardList, label: 'Portfolio Outputs' },
  { id: 5, icon: Users,         label: 'Mentor Requirements' },
  { id: 6, icon: CheckSquare,   label: 'Task Builder' },
  { id: 7, icon: Eye,           label: 'Preview' },
];

const EMPTY_TASK = () => ({
  id: Date.now(),
  subskillText: '',
  difficulty: 'medium',
  questionType: 'short_answer',
  questionText: '',
  expectedAnswer: '',
  evidenceRequired: '',
  score: 10,
  feedbackHint: '',
});

function makeDefaultForm() {
  return {
    title: '',
    description: '',
    primaryTrack: '',
    secondaryTrack: '',
    difficulty: 'beginner',
    estimatedTime: '30 min',
    targetFaculties: [],
    targetMajors: [],
    targetRoles: [],
    careerGoalKeywords: [],
    mainSkillCode: '',
    relatedSkills: [],
    focusSubskills: [],
    context: '',
    sopExcerpt: '',
    operatorNote: '',
    status: 'draft',
    requiredMentorTracks: [],
    requiredMentorSkills: [],
    preferredMentorKeywords: [],
    requiredPortfolioOutputs: {
      canReviewProcessMap: false,
      canReviewRiskChecklist: false,
      canReviewRca: false,
      canReviewTechnicalMemo: false,
      canReviewAiUsageLog: false,
    },
    tasks: [EMPTY_TASK()],
  };
}

function mergeEnrichment(base, enrichment) {
  if (!enrichment) return { ...makeDefaultForm(), ...base };
  return {
    ...makeDefaultForm(),
    ...base,
    status: enrichment.status || base.status || 'draft',
    targetRoles: enrichment.targetRoles || [],
    requiredMentorTracks: enrichment.requiredMentorTracks || [],
    requiredMentorSkills: enrichment.requiredMentorSkills || [],
    preferredMentorKeywords: enrichment.preferredMentorKeywords || [],
    requiredPortfolioOutputs: enrichment.requiredPortfolioOutputs || makeDefaultForm().requiredPortfolioOutputs,
    tasks: enrichment.tasks?.length ? enrichment.tasks.map(t => ({ ...t, id: t.id ?? Date.now() + Math.random() })) : [EMPTY_TASK()],
    focusSubskills: base.focusSubskills || enrichment.subskillsStructured?.map(s => s.text) || [],
  };
}

function validateForPublish(form) {
  const errors = [];
  if (!form.title.trim())          errors.push('Title is required');
  if (!form.primaryTrack)          errors.push('Primary career track is required');
  if (!form.targetFaculties.length && !form.targetMajors.length)
                                   errors.push('At least one target faculty or major is required');
  if (!form.mainSkillCode)         errors.push('Main skill is required');
  if (!form.focusSubskills.length) errors.push('At least one focus subskill is required');
  if (!form.requiredMentorTracks.length) errors.push('At least one required mentor track is required');
  if (!form.requiredMentorSkills.length) errors.push('At least one required mentor skill is required');
  if (!form.tasks.length || !form.tasks[0].questionText?.trim())
                                   errors.push('At least one task with a question is required');
  const hasOutput = Object.values(form.requiredPortfolioOutputs).some(Boolean);
  if (!hasOutput)                  errors.push('At least one required portfolio output must be selected');
  if (!form.context.trim())        errors.push('Scenario context (Evidence Pack) is required');
  return errors;
}

/* ── Tag input helper ─────────────────────────────────────── */
function TagInput({ values, onChange, placeholder }) {
  const [input, setInput] = useState('');
  const ref = useRef(null);

  function addTag(raw) {
    const val = raw.trim();
    if (val && !values.includes(val)) onChange([...values, val]);
    setInput('');
  }

  function handleKey(e) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && values.length) {
      onChange(values.slice(0, -1));
    }
  }

  return (
    <div className="sf-tag-row" onClick={() => ref.current?.focus()}>
      {values.map((v, i) => (
        <span key={i} className="sf-tag">
          {v}
          <button type="button" className="sf-tag-del" onClick={() => onChange(values.filter((_, j) => j !== i))}>×</button>
        </span>
      ))}
      <input
        ref={ref}
        className="sf-tag-input"
        value={input}
        placeholder={values.length ? '' : placeholder}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKey}
        onBlur={() => { if (input.trim()) addTag(input); }}
      />
    </div>
  );
}

/* ── Multi-select toggle group ───────────────────────────── */
function MultiSelect({ options, selected, onChange }) {
  function toggle(code) {
    onChange(selected.includes(code) ? selected.filter(c => c !== code) : [...selected, code]);
  }
  return (
    <div className="sf-multi-select">
      {options.map(opt => (
        <button
          key={opt.code}
          type="button"
          className={`sf-ms-option${selected.includes(opt.code) ? ' selected' : ''}`}
          onClick={() => toggle(opt.code)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function ScenarioForm({ scenario, enrichment, onSave, onCancel }) {
  const isEdit = Boolean(scenario?.id);
  const [form, setForm] = useState(() => mergeEnrichment(scenario || {}, enrichment || null));
  const [step, setStep] = useState(0);
  const [valErrors, setValErrors] = useState([]);
  const [aiCheckResult, setAiCheckResult] = useState(null);
  const [aiChecking, setAiChecking] = useState(false);
  const [aiCheckError, setAiCheckError] = useState('');

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }
  function setOutput(key, val) { setForm(f => ({ ...f, requiredPortfolioOutputs: { ...f.requiredPortfolioOutputs, [key]: val } })); }
  function setTask(idx, key, val) {
    setForm(f => {
      const tasks = f.tasks.map((t, i) => i === idx ? { ...t, [key]: val } : t);
      return { ...f, tasks };
    });
  }
  function addTask()       { setForm(f => ({ ...f, tasks: [...f.tasks, EMPTY_TASK()] })); }
  function removeTask(idx) { setForm(f => ({ ...f, tasks: f.tasks.filter((_, i) => i !== idx) })); }

  async function handleAiQualityCheck() {
    setAiChecking(true);
    setAiCheckResult(null);
    setAiCheckError('');
    try {
      const result = await checkScenarioQuality(form);
      setAiCheckResult(result);
    } catch (err) {
      setAiCheckError(err.message || 'AI Quality Check failed. Check that the backend is running.');
    } finally {
      setAiChecking(false);
    }
  }

  function handleSaveDraft() {
    setValErrors([]);
    onSave({ form: { ...form, status: 'draft' } });
  }

  function handlePublish() {
    const errors = validateForPublish(form);
    if (errors.length) { setValErrors(errors); return; }
    setValErrors([]);
    onSave({ form: { ...form, status: 'active' } });
  }

  const stepDone = (s) => {
    if (s === 0) return Boolean(form.title && form.primaryTrack && form.difficulty);
    if (s === 1) return Boolean(form.targetFaculties.length || form.targetMajors.length);
    if (s === 2) return Boolean(form.mainSkillCode && form.focusSubskills.length);
    if (s === 3) return Boolean(form.context);
    if (s === 4) return Object.values(form.requiredPortfolioOutputs).some(Boolean);
    if (s === 5) return Boolean(form.requiredMentorTracks.length && form.requiredMentorSkills.length);
    if (s === 6) return Boolean(form.tasks.length && form.tasks[0].questionText);
    return false;
  };

  return (
    <div className="sf-overlay">
      <div className="sf-root">
        {/* header */}
        <div className="sf-header">
          <h2>{isEdit ? `Edit Scenario — ${form.title || 'Untitled'}` : 'New Scenario'}</h2>
          <button type="button" className="sf-close-btn" onClick={onCancel}>✕</button>
        </div>

        {/* stepper */}
        <div className="sf-stepper">
          {STEPS.map(s => (
            <button
              key={s.id}
              type="button"
              className={`sf-step-btn${step === s.id ? ' active' : ''}${stepDone(s.id) && step !== s.id ? ' done' : ''}`}
              onClick={() => setStep(s.id)}
            >
              <span className="sf-step-num">
                {stepDone(s.id) && step !== s.id ? <CheckCircle2 size={12} /> : s.id + 1}
              </span>
              {s.label}
            </button>
          ))}
        </div>

        {/* body */}
        <div className="sf-body">
          <div className="sf-notice">
            <AlertTriangle size={15} />
            Use synthetic or approved data only. Scenario content is for learning simulation — not a real safety instruction or production SOP.
          </div>

          {valErrors.length > 0 && (
            <div className="sf-val-error">
              <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <strong>Cannot publish — fix these issues:</strong>
                <ul>{valErrors.map((e, i) => <li key={i}>{e}</li>)}</ul>
              </div>
            </div>
          )}

          {/* ── Step 0: Basic Info ──────────────────────────── */}
          {step === 0 && (
            <>
              <div className="sf-section-heading"><Info size={15} /> Basic Information</div>
              <div className="sf-form-row full">
                <div className="sf-field">
                  <label>Title <span className="sf-req">*</span></label>
                  <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Defect Rate Spike — Line 3" className={!form.title ? 'error' : ''} />
                </div>
              </div>
              <div className="sf-form-row full">
                <div className="sf-field">
                  <label>Description</label>
                  <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="One-line summary shown on cards" rows={2} />
                </div>
              </div>
              <div className="sf-form-row">
                <div className="sf-field">
                  <label>Primary Career Track <span className="sf-req">*</span></label>
                  <select value={form.primaryTrack} onChange={e => set('primaryTrack', e.target.value)}>
                    <option value="">— select —</option>
                    {TRACKS.map(t => <option key={t.code} value={t.code}>{t.label}</option>)}
                  </select>
                </div>
                <div className="sf-field">
                  <label>Secondary Track (optional)</label>
                  <select value={form.secondaryTrack} onChange={e => set('secondaryTrack', e.target.value)}>
                    <option value="">— none —</option>
                    {TRACKS.map(t => <option key={t.code} value={t.code}>{t.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="sf-form-row">
                <div className="sf-field">
                  <label>Difficulty <span className="sf-req">*</span></label>
                  <select value={form.difficulty} onChange={e => set('difficulty', e.target.value)}>
                    {DIFFICULTIES.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </select>
                </div>
                <div className="sf-field">
                  <label>Estimated Time</label>
                  <input value={form.estimatedTime} onChange={e => set('estimatedTime', e.target.value)} placeholder="e.g. 30 min" />
                </div>
              </div>
              <div className="sf-form-row">
                <div className="sf-field">
                  <label>Status</label>
                  <select value={form.status} onChange={e => set('status', e.target.value)}>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* ── Step 1: Targeting ──────────────────────────── */}
          {step === 1 && (
            <>
              <div className="sf-section-heading"><Target size={15} /> Targeting</div>
              <div className="sf-form-row full">
                <div className="sf-field">
                  <label>Target Faculties</label>
                  <MultiSelect
                    options={FACULTIES.map(f => ({ code: f.id, label: f.name }))}
                    selected={form.targetFaculties}
                    onChange={v => set('targetFaculties', v)}
                  />
                </div>
              </div>
              <div className="sf-form-row full">
                <div className="sf-field">
                  <label>Target Majors</label>
                  <MultiSelect
                    options={MAJORS.map(m => ({ code: m.code, label: m.name }))}
                    selected={form.targetMajors}
                    onChange={v => set('targetMajors', v)}
                  />
                </div>
              </div>
              <div className="sf-form-row full">
                <div className="sf-field">
                  <label>Target Roles (press Enter to add)</label>
                  <TagInput values={form.targetRoles} onChange={v => set('targetRoles', v)} placeholder="e.g. Junior QA Technician" />
                </div>
              </div>
              <div className="sf-form-row full">
                <div className="sf-field">
                  <label>Career Goal Keywords (press Enter to add)</label>
                  <TagInput values={form.careerGoalKeywords} onChange={v => set('careerGoalKeywords', v)} placeholder="e.g. quality, qa, technician" />
                </div>
              </div>
            </>
          )}

          {/* ── Step 2: Skill Mapping ─────────────────────── */}
          {step === 2 && (
            <>
              <div className="sf-section-heading"><Layers size={15} /> Skill Mapping</div>
              <div className="sf-form-row full">
                <div className="sf-field">
                  <label>Main Skill <span className="sf-req">*</span></label>
                  <select value={form.mainSkillCode} onChange={e => set('mainSkillCode', e.target.value)}>
                    <option value="">— select main skill —</option>
                    {SKILLS.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="sf-form-row full">
                <div className="sf-field">
                  <label>Related Skills</label>
                  <MultiSelect
                    options={SKILLS.map(s => ({ code: s.code, label: s.name }))}
                    selected={form.relatedSkills}
                    onChange={v => set('relatedSkills', v)}
                  />
                </div>
              </div>
              <div className="sf-form-row full">
                <div className="sf-field">
                  <label>Focus Subskills (press Enter to add) <span className="sf-req">*</span></label>
                  <TagInput values={form.focusSubskills} onChange={v => set('focusSubskills', v)} placeholder="e.g. 5-Why method" />
                </div>
              </div>
              {form.mainSkillCode && (
                <div style={{ marginTop: 8, fontSize: 12, color: '#6366f1' }}>
                  Suggested subskills for "{SKILLS.find(s => s.code === form.mainSkillCode)?.name}":&nbsp;
                  {SKILLS.find(s => s.code === form.mainSkillCode)?.subskills.map(sub => (
                    <button
                      key={sub} type="button"
                      style={{ background: 'rgba(99,102,241,0.08)', border: 'none', borderRadius: 6, padding: '2px 8px', marginRight: 4, marginBottom: 4, fontSize: 11.5, color: '#4338ca', cursor: 'pointer', fontWeight: 600 }}
                      onClick={() => { if (!form.focusSubskills.includes(sub)) set('focusSubskills', [...form.focusSubskills, sub]); }}
                    >+ {sub}</button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── Step 3: Evidence Pack ─────────────────────── */}
          {step === 3 && (
            <>
              <div className="sf-section-heading"><FileText size={15} /> Evidence Pack</div>
              <div className="sf-form-row full">
                <div className="sf-field">
                  <label>Scenario Context <span className="sf-req">*</span></label>
                  <textarea value={form.context} onChange={e => set('context', e.target.value)} rows={4} placeholder="Describe the workplace situation students must investigate..." className={!form.context ? 'error' : ''} />
                </div>
              </div>
              <div className="sf-form-row full">
                <div className="sf-field">
                  <label>SOP Excerpt (optional)</label>
                  <textarea value={form.sopExcerpt} onChange={e => set('sopExcerpt', e.target.value)} rows={4} placeholder="Paste a synthetic SOP excerpt relevant to this scenario..." />
                </div>
              </div>
              <div className="sf-form-row full">
                <div className="sf-field">
                  <label>Operator / HSE Note (optional)</label>
                  <textarea value={form.operatorNote} onChange={e => set('operatorNote', e.target.value)} rows={3} placeholder="Simulated field note from an operator or safety officer..." />
                </div>
              </div>
            </>
          )}

          {/* ── Step 4: Portfolio Outputs ─────────────────── */}
          {step === 4 && (
            <>
              <div className="sf-section-heading"><ClipboardList size={15} /> Required Portfolio Outputs</div>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16, marginTop: 0 }}>
                Select which portfolio outputs a mentor must be able to review for this scenario.
              </p>
              <div className="sf-check-grid">
                {PORTFOLIO_CAPS.map(cap => (
                  <label
                    key={cap.key}
                    className={`sf-check-item${form.requiredPortfolioOutputs[cap.key] ? ' checked' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={form.requiredPortfolioOutputs[cap.key]}
                      onChange={e => setOutput(cap.key, e.target.checked)}
                    />
                    <span>{cap.label}</span>
                  </label>
                ))}
              </div>
            </>
          )}

          {/* ── Step 5: Mentor Requirements ───────────────── */}
          {step === 5 && (
            <>
              <div className="sf-section-heading"><Users size={15} /> Mentor Requirements</div>
              <div className="sf-form-row full">
                <div className="sf-field">
                  <label>Required Mentor Tracks <span className="sf-req">*</span></label>
                  <MultiSelect
                    options={TRACKS}
                    selected={form.requiredMentorTracks}
                    onChange={v => set('requiredMentorTracks', v)}
                  />
                </div>
              </div>
              <div className="sf-form-row full">
                <div className="sf-field">
                  <label>Required Mentor Skills <span className="sf-req">*</span></label>
                  <MultiSelect
                    options={SKILLS.map(s => ({ code: s.code, label: s.name }))}
                    selected={form.requiredMentorSkills}
                    onChange={v => set('requiredMentorSkills', v)}
                  />
                </div>
              </div>
              <div className="sf-form-row full">
                <div className="sf-field">
                  <label>Preferred Mentor Keywords (press Enter to add)</label>
                  <TagInput values={form.preferredMentorKeywords} onChange={v => set('preferredMentorKeywords', v)} placeholder="e.g. QA, RCA, defect" />
                </div>
              </div>
            </>
          )}

          {/* ── Step 6: Task Builder ──────────────────────── */}
          {step === 6 && (
            <>
              <div className="sf-section-heading"><CheckSquare size={15} /> Task Builder</div>
              <p style={{ fontSize: 13, color: '#64748b', marginBottom: 16, marginTop: 0 }}>
                Add tasks students must complete. At least one task with a question is required to publish.
              </p>
              <div className="sf-task-list">
                {form.tasks.map((task, idx) => (
                  <div key={task.id} className="sf-task-item">
                    <div className="sf-task-header">
                      <span className="sf-task-num">Task {idx + 1}</span>
                      {form.tasks.length > 1 && (
                        <button type="button" className="sf-task-del-btn" onClick={() => removeTask(idx)}>
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    <div className="sf-form-row">
                      <div className="sf-field">
                        <label>Subskill</label>
                        <input value={task.subskillText} onChange={e => setTask(idx, 'subskillText', e.target.value)} placeholder="e.g. 5-Why method" />
                      </div>
                      <div className="sf-field">
                        <label>Question Type</label>
                        <select value={task.questionType} onChange={e => setTask(idx, 'questionType', e.target.value)}>
                          <option value="short_answer">Short Answer</option>
                          <option value="table_input">Table Input</option>
                          <option value="checklist">Checklist</option>
                          <option value="memo">Memo</option>
                          <option value="rca">RCA / 5-Why</option>
                          <option value="reflection">Reflection</option>
                        </select>
                      </div>
                    </div>
                    <div className="sf-form-row">
                      <div className="sf-field">
                        <label>Difficulty</label>
                        <select value={task.difficulty} onChange={e => setTask(idx, 'difficulty', e.target.value)}>
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                      <div className="sf-field">
                        <label>Score (pts)</label>
                        <input type="number" min={1} max={100} value={task.score} onChange={e => setTask(idx, 'score', Number(e.target.value))} />
                      </div>
                    </div>
                    <div className="sf-field">
                      <label>Question Text <span className="sf-req">*</span></label>
                      <textarea value={task.questionText} onChange={e => setTask(idx, 'questionText', e.target.value)} rows={3} placeholder="What should students analyze or produce?" />
                    </div>
                    <div className="sf-field">
                      <label>Expected Answer / Model Answer</label>
                      <textarea value={task.expectedAnswer} onChange={e => setTask(idx, 'expectedAnswer', e.target.value)} rows={2} placeholder="Guide for mentor review" />
                    </div>
                    <div className="sf-form-row">
                      <div className="sf-field">
                        <label>Evidence Required</label>
                        <input value={task.evidenceRequired} onChange={e => setTask(idx, 'evidenceRequired', e.target.value)} placeholder="e.g. Defect log, operator note" />
                      </div>
                      <div className="sf-field">
                        <label>Feedback Hint (for mentor)</label>
                        <input value={task.feedbackHint} onChange={e => setTask(idx, 'feedbackHint', e.target.value)} placeholder="Minimum criteria for full marks" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="sf-add-task-btn" onClick={addTask}>
                <Plus size={14} /> Add Task
              </button>
            </>
          )}

          {/* ── Step 7: Preview ───────────────────────────── */}
          {step === 7 && (
            <>
              <div className="sf-section-heading"><Eye size={15} /> Preview</div>

              {/* AI Quality Check panel */}
              <div className="sf-ai-check-bar">
                <button
                  type="button"
                  className="sf-btn sf-ai-check-btn"
                  onClick={handleAiQualityCheck}
                  disabled={aiChecking}
                >
                  {aiChecking
                    ? <><Loader2 size={14} className="sf-spin" /> Checking…</>
                    : <><Sparkles size={14} /> AI Quality Check</>}
                </button>
                <span className="sf-ai-check-hint">
                  AI ตรวจสอบความครบถ้วนก่อน Publish — ต้องให้ Admin ยืนยันก่อนเผยแพร่
                </span>
              </div>

              {aiCheckError && (
                <div className="sf-ai-result blocked">
                  <AlertTriangle size={15} /> {aiCheckError}
                </div>
              )}

              {aiCheckResult && (
                <div className={`sf-ai-result ${aiCheckResult.qualityStatus === 'ready_to_publish' ? 'ready' : aiCheckResult.qualityStatus === 'needs_revision' ? 'warning' : 'blocked'}`}>
                  <div className="sf-ai-result-header">
                    <strong>
                      {aiCheckResult.qualityStatus === 'ready_to_publish' && '✓ Ready to Publish'}
                      {aiCheckResult.qualityStatus === 'needs_revision'   && '⚠ Needs Revision'}
                      {aiCheckResult.qualityStatus === 'blocked'          && '✕ Blocked'}
                    </strong>
                    <span className="sf-ai-notice">{aiCheckResult.responsibleContentNotice}</span>
                  </div>

                  {aiCheckResult.publishRecommendation && (
                    <p className="sf-ai-recommendation">{aiCheckResult.publishRecommendation}</p>
                  )}

                  {aiCheckResult.blockingIssues?.length > 0 && (
                    <div className="sf-ai-section">
                      <div className="sf-ai-label">Blocking Issues</div>
                      <ul>{aiCheckResult.blockingIssues.map((item, i) => <li key={i}>{item}</li>)}</ul>
                    </div>
                  )}
                  {aiCheckResult.missingItems?.length > 0 && (
                    <div className="sf-ai-section">
                      <div className="sf-ai-label">Missing Items</div>
                      <ul>{aiCheckResult.missingItems.map((item, i) => <li key={i}>{item}</li>)}</ul>
                    </div>
                  )}
                  {aiCheckResult.warnings?.length > 0 && (
                    <div className="sf-ai-section">
                      <div className="sf-ai-label">Warnings</div>
                      <ul>{aiCheckResult.warnings.map((item, i) => <li key={i}>{item}</li>)}</ul>
                    </div>
                  )}
                  {aiCheckResult.suggestedFixes?.length > 0 && (
                    <div className="sf-ai-section">
                      <div className="sf-ai-label">Suggested Fixes</div>
                      <ul>{aiCheckResult.suggestedFixes.map((item, i) => <li key={i}>{item}</li>)}</ul>
                    </div>
                  )}
                </div>
              )}

              <div className="sf-preview-block">
                <div className="sf-preview-card">
                  <h4>Basic</h4>
                  <div className="sf-preview-row">
                    <span><span className="k">Title:</span> {form.title || '—'}</span>
                    <span><span className="k">Track:</span> {form.primaryTrack || '—'}</span>
                    <span><span className="k">Difficulty:</span> {form.difficulty}</span>
                    <span><span className="k">Time:</span> {form.estimatedTime}</span>
                    <span>
                      <span className="k">Status:</span>{' '}
                      <span className={`sf-preview-chip ${form.status}`}>{form.status}</span>
                    </span>
                  </div>
                  {form.description && <p style={{ fontSize: 13, color: '#64748b', marginTop: 8, marginBottom: 0 }}>{form.description}</p>}
                </div>

                <div className="sf-preview-card">
                  <h4>Targeting</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ fontSize: 12.5, color: '#374151' }}>
                      <strong>Faculties:</strong> {form.targetFaculties.join(', ') || '—'}
                    </div>
                    <div style={{ fontSize: 12.5, color: '#374151' }}>
                      <strong>Majors:</strong> {form.targetMajors.join(', ') || '—'}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Target Roles:</div>
                      <div className="sf-preview-chip-row">{form.targetRoles.map((r, i) => <span key={i} className="sf-preview-chip">{r}</span>)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Keywords:</div>
                      <div className="sf-preview-chip-row">{form.careerGoalKeywords.map((k, i) => <span key={i} className="sf-preview-chip">{k}</span>)}</div>
                    </div>
                  </div>
                </div>

                <div className="sf-preview-card">
                  <h4>Skill Mapping</h4>
                  <div style={{ fontSize: 12.5, color: '#374151', marginBottom: 6 }}>
                    <strong>Main skill:</strong> {SKILLS.find(s => s.code === form.mainSkillCode)?.name || form.mainSkillCode || '—'}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Focus Subskills:</div>
                    <div className="sf-preview-chip-row">{form.focusSubskills.map((s, i) => <span key={i} className="sf-preview-chip">{s}</span>)}</div>
                  </div>
                </div>

                <div className="sf-preview-card">
                  <h4>Portfolio Outputs</h4>
                  <div className="sf-preview-chip-row">
                    {PORTFOLIO_CAPS.filter(c => form.requiredPortfolioOutputs[c.key]).map(c => (
                      <span key={c.key} className="sf-preview-chip active">{c.label}</span>
                    ))}
                    {!PORTFOLIO_CAPS.some(c => form.requiredPortfolioOutputs[c.key]) && <span style={{ color: '#94a3b8', fontSize: 12 }}>None selected</span>}
                  </div>
                </div>

                <div className="sf-preview-card">
                  <h4>Mentor Requirements</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Required Tracks:</div>
                      <div className="sf-preview-chip-row">{form.requiredMentorTracks.map((t, i) => <span key={i} className="sf-preview-chip">{t}</span>)}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>Required Skills:</div>
                      <div className="sf-preview-chip-row">{form.requiredMentorSkills.map((s, i) => <span key={i} className="sf-preview-chip">{s}</span>)}</div>
                    </div>
                  </div>
                </div>

                <div className="sf-preview-card">
                  <h4>Tasks ({form.tasks.length})</h4>
                  {form.tasks.map((t, i) => (
                    <div key={t.id} style={{ fontSize: 13, color: '#374151', marginBottom: 8 }}>
                      <strong>Task {i + 1}:</strong> {t.subskillText || '—'} — {t.questionType} — {t.score} pts
                      {t.questionText && <div style={{ color: '#64748b', fontSize: 12, marginTop: 2 }}>{t.questionText.slice(0, 100)}{t.questionText.length > 100 ? '…' : ''}</div>}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* footer */}
        <div className="sf-footer">
          <div className="sf-footer-left">
            <button type="button" className="sf-btn secondary" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>
              ← Back
            </button>
            <button type="button" className="sf-btn secondary" onClick={() => setStep(s => Math.min(7, s + 1))} disabled={step === 7}>
              Next →
            </button>
          </div>
          <div className="sf-footer-right">
            <button type="button" className="sf-btn secondary" onClick={onCancel}>Cancel</button>
            {isEdit && form.status !== 'archived' && (
              <button type="button" className="sf-btn archive" onClick={() => onSave({ form: { ...form, status: 'archived' } })}>
                Archive
              </button>
            )}
            <button type="button" className="sf-btn primary" onClick={handleSaveDraft}>
              Save Draft
            </button>
            <button type="button" className="sf-btn publish" onClick={handlePublish}>
              Publish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
