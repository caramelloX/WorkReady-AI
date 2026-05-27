import React, { useState, useMemo, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

// ── Skill metadata (weights match StudentScreen scoring) ──────────────────────
const SKILLS_META = [
  { key: 'processMap',     label: 'Industrial Flow & Process Mapping',  labelTh: 'การทำ Process Map', weight: 0.25 },
  { key: 'safetyRisk',     label: 'Safety & Quality Risk Assessment',   labelTh: 'ความเสี่ยงด้านความปลอดภัย', weight: 0.20 },
  { key: 'rca',            label: 'Evidence-Based Root Cause Analysis', labelTh: 'การวิเคราะห์สาเหตุ (RCA)', weight: 0.15 },
  { key: 'traceability',   label: 'Documentation & Traceability',       labelTh: 'เอกสารและการตรวจสอบย้อนหลัง', weight: 0.20 },
  { key: 'memo',           label: 'Technical Communication',            labelTh: 'การสื่อสารเชิงเทคนิค', weight: 0.15 },
  { key: 'responsibleAi',  label: 'Responsible AI Usage',               labelTh: 'การใช้ AI อย่างมีความรับผิดชอบ', weight: 0.05 },
];

// ── 30 self-assessment questions (6 skills × 5 subskills) ────────────────────
const ASSESSMENT_QUESTIONS = [
  // Industrial Flow & Process Mapping
  { id: 'q01', skillKey: 'processMap', subskill: 'process step identification', question: 'ฉันสามารถระบุขั้นตอนทุกขั้นในกระบวนการผลิตและเรียงลำดับให้ถูกต้องได้', difficulty: 'easy' },
  { id: 'q02', skillKey: 'processMap', subskill: 'flow documentation', question: 'ฉันสามารถจัดทำเอกสารกระบวนการที่เข้าใจง่ายสำหรับผู้ที่ยังไม่เคยทำงานในส่วนนั้น', difficulty: 'easy' },
  { id: 'q03', skillKey: 'processMap', subskill: 'swim-lane diagram', question: 'ฉันสามารถวาด Swim-Lane Diagram เพื่อแสดงหน้าที่รับผิดชอบข้ามแผนกได้อย่างถูกต้อง', difficulty: 'medium' },
  { id: 'q04', skillKey: 'processMap', subskill: 'value stream mapping', question: 'ฉันสามารถวิเคราะห์กระแสคุณค่า (Value Stream) และระบุขั้นตอนที่ไม่สร้างมูลค่าได้', difficulty: 'hard' },
  { id: 'q05', skillKey: 'processMap', subskill: 'bottleneck analysis', question: 'ฉันสามารถระบุจุดคอขวด (Bottleneck) จากข้อมูลกระบวนการและอธิบายผลกระทบเชิงปริมาณได้', difficulty: 'hard' },
  // Safety & Quality Risk Assessment
  { id: 'q06', skillKey: 'safetyRisk', subskill: 'SOP compliance check', question: 'ฉันสามารถอ่าน SOP และตรวจสอบว่ากระบวนการปฏิบัติตามขั้นตอนที่กำหนดครบถ้วนหรือไม่', difficulty: 'easy' },
  { id: 'q07', skillKey: 'safetyRisk', subskill: 'quality checkpoint review', question: 'ฉันสามารถประเมินจุดตรวจสอบคุณภาพในกระบวนการและระบุว่าจุดใดขาดหายหรือไม่เพียงพอ', difficulty: 'easy' },
  { id: 'q08', skillKey: 'safetyRisk', subskill: 'hazard identification', question: 'ฉันสามารถระบุอันตรายที่อาจเกิดขึ้นในพื้นที่ทำงานจากการสังเกตและข้อมูลที่มีอยู่', difficulty: 'medium' },
  { id: 'q09', skillKey: 'safetyRisk', subskill: 'risk matrix', question: 'ฉันสามารถประเมินความเสี่ยงโดยใช้ Risk Matrix (ความรุนแรง × โอกาสเกิด) และจัดลำดับได้', difficulty: 'medium' },
  { id: 'q10', skillKey: 'safetyRisk', subskill: 'corrective action planning', question: 'ฉันสามารถวางแผนการแก้ไขที่เป็นรูปธรรม ระบุผู้รับผิดชอบ และกำหนดกรอบเวลาได้', difficulty: 'hard' },
  // Evidence-Based Root Cause Analysis
  { id: 'q11', skillKey: 'rca', subskill: 'evidence vs assumption tagging', question: 'ฉันสามารถแยกแยะระหว่างข้อเท็จจริงที่มีหลักฐานยืนยัน กับสมมติฐานที่ยังไม่ได้รับการพิสูจน์', difficulty: 'easy' },
  { id: 'q12', skillKey: 'rca', subskill: '5-Why method', question: 'ฉันสามารถใช้วิธี 5-Why ในการสืบหาสาเหตุที่แท้จริงของปัญหาได้อย่างมีตรรกะ', difficulty: 'medium' },
  { id: 'q13', skillKey: 'rca', subskill: 'fishbone diagram', question: 'ฉันสามารถวาดและวิเคราะห์ Fishbone Diagram เพื่อจำแนกสาเหตุที่เป็นไปได้ในหลายมิติ', difficulty: 'medium' },
  { id: 'q14', skillKey: 'rca', subskill: 'causal chain documentation', question: 'ฉันสามารถบันทึกห่วงโซ่สาเหตุ (Causal Chain) ตั้งแต่อาการที่สังเกตเห็นจนถึงต้นตอที่แท้จริง', difficulty: 'hard' },
  { id: 'q15', skillKey: 'rca', subskill: 'verification planning', question: 'ฉันสามารถออกแบบแผนการตรวจสอบเพื่อยืนยันหรือโต้แย้งสาเหตุที่ระบุก่อนดำเนินการแก้ไข', difficulty: 'hard' },
  // Documentation & Traceability
  { id: 'q16', skillKey: 'traceability', subskill: 'batch record keeping', question: 'ฉันสามารถบันทึกและติดตามข้อมูล Batch ในกระบวนการผลิตได้อย่างครบถ้วนและเชื่อถือได้', difficulty: 'easy' },
  { id: 'q17', skillKey: 'traceability', subskill: 'version control', question: 'ฉันเข้าใจหลักการควบคุมเวอร์ชันของเอกสารและสามารถระบุฉบับที่เป็นปัจจุบันได้เสมอ', difficulty: 'easy' },
  { id: 'q18', skillKey: 'traceability', subskill: 'change log maintenance', question: 'ฉันสามารถจัดทำและดูแล Change Log ที่บันทึกการเปลี่ยนแปลงทั้งหมดในกระบวนการอย่างสม่ำเสมอ', difficulty: 'medium' },
  { id: 'q19', skillKey: 'traceability', subskill: 'evidence file linking', question: 'ฉันสามารถเชื่อมโยงเอกสารหลักฐานต่างๆ เข้าด้วยกันให้สามารถอ้างอิงย้อนหลังได้', difficulty: 'medium' },
  { id: 'q20', skillKey: 'traceability', subskill: 'audit trail creation', question: 'ฉันสามารถสร้าง Audit Trail ที่แสดงลำดับเหตุการณ์ การตัดสินใจ และผู้รับผิดชอบได้อย่างครบถ้วน', difficulty: 'hard' },
  // Technical Communication
  { id: 'q21', skillKey: 'memo', subskill: 'stakeholder summary', question: 'ฉันสามารถสรุปข้อมูลทางเทคนิคให้ผู้ที่ไม่ใช่ผู้เชี่ยวชาญเข้าใจได้โดยไม่เสียความถูกต้อง', difficulty: 'easy' },
  { id: 'q22', skillKey: 'memo', subskill: 'incident report structure', question: 'ฉันสามารถเขียนรายงานเหตุการณ์ที่ครอบคลุมข้อเท็จจริง สาเหตุ และการดำเนินการอย่างมีโครงสร้าง', difficulty: 'medium' },
  { id: 'q23', skillKey: 'memo', subskill: 'technical memo writing', question: 'ฉันสามารถเขียน Technical Memo ที่มีโครงสร้างชัดเจนตามมาตรฐานวิชาชีพและนำไปใช้ได้จริง', difficulty: 'medium' },
  { id: 'q24', skillKey: 'memo', subskill: 'recommendation clarity', question: 'ฉันสามารถเขียนข้อเสนอแนะที่ชัดเจน เฉพาะเจาะจง ระบุผู้รับผิดชอบ และกำหนดกรอบเวลาได้', difficulty: 'medium' },
  { id: 'q25', skillKey: 'memo', subskill: 'executive briefing', question: 'ฉันสามารถนำเสนอสรุปผู้บริหาร (Executive Briefing) ที่กระชับ ตรงประเด็น และใช้เวลาน้อยที่สุด', difficulty: 'hard' },
  // Responsible AI Usage
  { id: 'q26', skillKey: 'responsibleAi', subskill: 'AI suggestion verification', question: 'ฉันตรวจสอบคำแนะนำจาก AI ด้วยหลักฐานและการตัดสินใจของตนเองทุกครั้งก่อนนำไปใช้', difficulty: 'easy' },
  { id: 'q27', skillKey: 'responsibleAi', subskill: 'human decision logging', question: 'ฉันบันทึกได้ชัดเจนว่าส่วนใดที่ฉันตัดสินใจเอง และส่วนใดที่อ้างอิงจากคำแนะนำของ AI', difficulty: 'easy' },
  { id: 'q28', skillKey: 'responsibleAi', subskill: 'AI limitation awareness', question: 'ฉันเข้าใจข้อจำกัดของ AI และสามารถระบุสถานการณ์ที่ AI อาจให้ข้อมูลผิดพลาดหรือไม่ครบถ้วน', difficulty: 'medium' },
  { id: 'q29', skillKey: 'responsibleAi', subskill: 'bias check', question: 'ฉันสามารถตรวจหาความลำเอียง (Bias) ในผลลัพธ์ของ AI ที่อาจส่งผลต่อคุณภาพการตัดสินใจ', difficulty: 'hard' },
  { id: 'q30', skillKey: 'responsibleAi', subskill: 'AI action traceability', question: 'ฉันสามารถบันทึกและอ้างอิงได้ว่า AI แนะนำอะไร ฉันใช้หรือปรับเปลี่ยนอย่างไร และเหตุใด', difficulty: 'medium' },
];

const TOTAL = ASSESSMENT_QUESTIONS.length; // 30

// ── localStorage helpers ──────────────────────────────────────────────────────
function sk(userId, type) {
  return `sga_${type}_${userId || 'guest'}`;
}

function loadState(userId) {
  try {
    const answers = JSON.parse(localStorage.getItem(sk(userId, 'answers')) || '{}');
    const status  = localStorage.getItem(sk(userId, 'status')) || 'not_started';
    return { answers, status };
  } catch {
    return { answers: {}, status: 'not_started' };
  }
}

function saveState(userId, answers, status) {
  try {
    localStorage.setItem(sk(userId, 'answers'), JSON.stringify(answers));
    localStorage.setItem(sk(userId, 'status'), status);
  } catch { /* ignore */ }
}

// ── Score calculators ─────────────────────────────────────────────────────────
const LEVEL_SCORE = { high: 100, medium: 50, low: 10 };

function calculateResults(answers) {
  const ratings = {};
  for (const sm of SKILLS_META) {
    const qs  = ASSESSMENT_QUESTIONS.filter(q => q.skillKey === sm.key);
    const avg = qs.reduce((sum, q) => sum + (LEVEL_SCORE[answers[q.id]] || 0), 0) / qs.length;
    ratings[sm.key] = avg >= 75 ? 'high' : avg >= 35 ? 'medium' : 'low';
  }
  const overallReadiness = Math.round(
    SKILLS_META.reduce((sum, sm) => {
      const s = LEVEL_SCORE[ratings[sm.key]] || 0;
      return sum + s * sm.weight;
    }, 0)
  );
  const strengthsCount = Object.values(ratings).filter(v => v === 'high').length;
  const gapsCount      = Object.values(ratings).filter(v => v === 'low').length;
  return { ratings, overallReadiness, strengthsCount, gapsCount };
}

function getRadarPoints(ratings) {
  const r = (key) => {
    const v = ratings[key];
    return v === 'high' ? 100 : v === 'medium' ? 66 : 33;
  };
  const p1 = `${150},${150 - r('processMap')}`;
  const p2 = `${150 + r('safetyRisk') * 0.866},${150 - r('safetyRisk') * 0.5}`;
  const p3 = `${150 + r('rca') * 0.866},${150 + r('rca') * 0.5}`;
  const p4 = `${150},${150 + r('traceability')}`;
  const p5 = `${150 - r('memo') * 0.866},${150 + r('memo') * 0.5}`;
  const p6 = `${150 - r('responsibleAi') * 0.866},${150 - r('responsibleAi') * 0.5}`;
  return `${p1} ${p2} ${p3} ${p4} ${p5} ${p6}`;
}

function getDifficultyLabel(d) {
  if (d === 'easy')   return 'Easy';
  if (d === 'medium') return 'Medium';
  return 'Hard';
}

// ── Main component ────────────────────────────────────────────────────────────
export default function StudentSkillGap({ userId, onSubmit, onViewResult }) {
  const { t } = useLanguage();

  const [answers, setAnswers]           = useState({});
  const [assessmentStatus, setStatus]   = useState('not_started');
  const [loaded, setLoaded]             = useState(false);

  // Load persisted state on mount / userId change
  useEffect(() => {
    const saved = loadState(userId);
    setAnswers(saved.answers);
    setStatus(saved.status);
    setLoaded(true);
  }, [userId]);

  // Derived counts
  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount >= TOTAL;
  const isSubmitted   = assessmentStatus === 'submitted';

  // Compute results (only meaningful when submitted)
  const results = useMemo(() => {
    if (!isSubmitted) return null;
    return calculateResults(answers);
  }, [isSubmitted, answers]);

  // Notify parent once after load (for backward-compat DB ratings or on re-mount)
  useEffect(() => {
    if (loaded && isSubmitted && results) {
      onSubmit?.(results.ratings, results.overallReadiness);
    }
  }, [loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleAnswer(qId, level) {
    const next = { ...answers, [qId]: level };
    setAnswers(next);

    let nextStatus = assessmentStatus;
    if (assessmentStatus === 'not_started') nextStatus = 'in_progress';
    const allDone = Object.keys(next).length >= TOTAL;
    if (allDone) nextStatus = 'ready_to_submit';
    else if (nextStatus === 'ready_to_submit') nextStatus = 'in_progress';

    setStatus(nextStatus);
    saveState(userId, next, nextStatus);
  }

  function handleSubmit() {
    if (!isAllAnswered) return;
    const nextStatus = 'submitted';
    setStatus(nextStatus);
    saveState(userId, answers, nextStatus);
    const res = calculateResults(answers);
    onSubmit?.(res.ratings, res.overallReadiness);
  }

  function handleReset() {
    setAnswers({});
    setStatus('not_started');
    saveState(userId, {}, 'not_started');
    onSubmit?.({}, 0);
  }

  if (!loaded) return null;

  return (
    <div className="student-tab-panel">
      {/* Page header */}
      <div className="skillgap-header-row">
        <div className="student-page-title-area">
          <h1 className="student-page-title">{t('skillgap.title')}</h1>
          <p className="student-page-subtitle">{t('skillgap.subtitle')}</p>
        </div>
        {isSubmitted && (
          <button className="sga-reset-btn" onClick={handleReset} title="ทำแบบประเมินใหม่">
            ทำแบบประเมินใหม่
          </button>
        )}
      </div>

      {/* ── PRE-SUBMIT VIEW ─────────────────────────────────────────────────── */}
      {!isSubmitted && (
        <>
          {/* Empty-state notice */}
          <div className="sga-empty-state">
            <div className="sga-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <div>
              <p className="sga-empty-title">ยังไม่มีผลการประเมิน</p>
              <p className="sga-empty-desc">
                กรุณาตอบคำถามให้ครบและกดส่งแบบประเมินก่อน
                ระบบจึงจะแสดงคะแนน Skill Gap, Radar Chart, Scenario และ Mentor ที่เหมาะสม
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="sga-progress-wrap">
            <div className="sga-progress-header">
              <span className="sga-progress-label">ความคืบหน้า</span>
              <span className="sga-progress-count">
                <strong>{answeredCount}</strong> / {TOTAL} คำถาม
              </span>
            </div>
            <div className="sga-progress-track">
              <div
                className="sga-progress-fill"
                style={{ width: `${(answeredCount / TOTAL) * 100}%` }}
              />
            </div>
            <div className="sga-progress-state">
              {assessmentStatus === 'not_started' && 'ยังไม่เริ่ม — กดตอบคำถามด้านล่าง'}
              {assessmentStatus === 'in_progress' && `กำลังทำ — ตอบแล้ว ${answeredCount} จาก ${TOTAL} ข้อ`}
              {assessmentStatus === 'ready_to_submit' && 'ตอบครบแล้ว — กดส่งแบบประเมินได้เลย'}
            </div>
          </div>

          {/* Question sections */}
          <div className="sga-sections">
            {SKILLS_META.map((sm) => {
              const qs = ASSESSMENT_QUESTIONS.filter(q => q.skillKey === sm.key);
              const answered = qs.filter(q => answers[q.id]).length;
              return (
                <div key={sm.key} className="sga-section student-card">
                  <div className="sga-section-header">
                    <div>
                      <h4 className="sga-section-title">{sm.label}</h4>
                      <span className="sga-section-subtitle">{sm.labelTh}</span>
                    </div>
                    <span className={`sga-section-progress ${answered === qs.length ? 'done' : ''}`}>
                      {answered}/{qs.length}
                    </span>
                  </div>

                  <div className="sga-questions-list">
                    {qs.map((q, qi) => (
                      <div key={q.id} className="sga-question-row">
                        <div className="sga-question-top">
                          <span className="sga-question-num">{`Q${q.id.slice(1)}`}</span>
                          <span className={`sga-difficulty-badge ${q.difficulty}`}>
                            {getDifficultyLabel(q.difficulty)}
                          </span>
                          <span className="sga-subskill-tag">{q.subskill}</span>
                        </div>
                        <p className="sga-question-text">{q.question}</p>
                        <div className="sga-answer-group">
                          {[
                            { value: 'low',    label: 'ยังไม่มั่นใจ', en: 'Not Confident' },
                            { value: 'medium', label: 'พอใช้ได้',    en: 'Somewhat' },
                            { value: 'high',   label: 'มั่นใจดี',    en: 'Confident' },
                          ].map(opt => (
                            <button
                              key={opt.value}
                              type="button"
                              className={`sga-answer-btn sga-answer-${opt.value}${answers[q.id] === opt.value ? ' selected' : ''}`}
                              onClick={() => handleAnswer(q.id, opt.value)}
                            >
                              <span className="sga-answer-label-th">{opt.label}</span>
                              <span className="sga-answer-label-en">{opt.en}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit bar */}
          <div className="sga-submit-bar">
            <div className="sga-submit-info">
              {isAllAnswered
                ? 'ตอบครบทุกข้อแล้ว — พร้อมส่งแบบประเมิน'
                : `ยังเหลืออีก ${TOTAL - answeredCount} ข้อที่ยังไม่ได้ตอบ`}
            </div>
            <button
              type="button"
              className="sga-submit-btn"
              disabled={!isAllAnswered}
              onClick={handleSubmit}
            >
              {isAllAnswered ? 'ส่งแบบประเมิน' : `ส่งแบบประเมิน (${answeredCount}/${TOTAL})`}
            </button>
          </div>
        </>
      )}

      {/* ── POST-SUBMIT RESULTS VIEW ─────────────────────────────────────────── */}
      {isSubmitted && results && (
        <>
          {/* Summary cards */}
          <div className="skillgap-summary-row">
            <div className="skillgap-summary-card">
              <div className="label-row">
                <span className="label">{t('skillgap.overall')}</span>
                <span className="dot" style={{ backgroundColor: 'var(--accent-blue)' }} />
              </div>
              <h3 className="val">{results.overallReadiness}%</h3>
              <p className="desc">{t('skillgap.overallDesc')}</p>
            </div>
            <div className="skillgap-summary-card">
              <div className="label-row">
                <span className="label">{t('skillgap.strengths')}</span>
                <span className="dot" style={{ backgroundColor: 'var(--accent-green)' }} />
              </div>
              <h3 className="val">{results.strengthsCount}</h3>
              <p className="desc">{t('skillgap.strengthsDesc')}</p>
            </div>
            <div className="skillgap-summary-card">
              <div className="label-row">
                <span className="label">{t('skillgap.gaps')}</span>
                <span className="dot" style={{ backgroundColor: 'var(--accent-yellow)' }} />
              </div>
              <h3 className="val">{results.gapsCount}</h3>
              <p className="desc">{t('skillgap.gapsDesc')}</p>
            </div>
            <div className="skillgap-summary-card">
              <div className="label-row">
                <span className="label">{t('skillgap.competencies')}</span>
                <span className="dot" style={{ backgroundColor: 'var(--accent-teal)' }} />
              </div>
              <h3 className="val">6</h3>
              <p className="desc">{t('skillgap.competenciesDesc')}</p>
            </div>
          </div>

          {/* View full result button */}
          {onViewResult && (
            <div style={{ marginBottom: '16px' }}>
              <button
                className="sga-view-result-btn"
                onClick={onViewResult}
              >
                ดู Skill Gap Result พร้อม Scenario และ Mentor ที่แนะนำ →
              </button>
            </div>
          )}

          {/* Body grid: answered questions summary + radar chart */}
          <div className="skillgap-body-grid">
            {/* Skills summary */}
            <div className="student-card skillgap-assessment-card">
              <div className="skillgap-rating-header">
                <h4 className="skillgap-card-title">ผลการประเมินทักษะ</h4>
                <span className="skillgap-scale-legend">High / Medium / Low</span>
              </div>
              {SKILLS_META.map(sm => {
                const level = results.ratings[sm.key];
                const bgColor  = level === 'high' ? '#d1fae5' : level === 'low' ? '#fee2e2' : '#fef3c7';
                const txtColor = level === 'high' ? '#065f46' : level === 'low' ? '#b91c1c' : '#d97706';
                const qs = ASSESSMENT_QUESTIONS.filter(q => q.skillKey === sm.key);
                const answered = qs.filter(q => answers[q.id]).length;
                return (
                  <div key={sm.key} className="skillgap-question-section">
                    <div className="skillgap-question-header">
                      <div>
                        <h5 className="skillgap-question-title">{sm.label}</h5>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{answered}/{qs.length} ข้อ</span>
                      </div>
                      <span className="skillgap-level-indicator" style={{ backgroundColor: bgColor, color: txtColor }}>
                        {level?.toUpperCase() || '—'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Radar chart */}
            <div className="student-card skillgap-radar-card">
              <h4 className="skillgap-card-title">{t('skillgap.radarTitle')}</h4>
              <div className="skillgap-radar-container">
                <svg viewBox="0 0 300 300" width="100%" height="100%" style={{ overflow: 'visible' }}>
                  <polygon points="150,115 180,132 180,167 150,185 120,167 120,132" fill="none" stroke="#f1f5f9" strokeWidth="1.5" />
                  <polygon points="150,82 208,115 208,183 150,217 91,183 91,115"   fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
                  <polygon points="150,50 236,100 236,200 150,250 63,200 63,100"   fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
                  <line x1="150" y1="150" x2="150" y2="50"  stroke="#cbd5e1" strokeDasharray="3 3" />
                  <line x1="150" y1="150" x2="236" y2="100" stroke="#cbd5e1" strokeDasharray="3 3" />
                  <line x1="150" y1="150" x2="236" y2="200" stroke="#cbd5e1" strokeDasharray="3 3" />
                  <line x1="150" y1="150" x2="150" y2="250" stroke="#cbd5e1" strokeDasharray="3 3" />
                  <line x1="150" y1="150" x2="63"  y2="200" stroke="#cbd5e1" strokeDasharray="3 3" />
                  <line x1="150" y1="150" x2="63"  y2="100" stroke="#cbd5e1" strokeDasharray="3 3" />
                  <text x="150" y="38"  textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">Process</text>
                  <text x="246" y="96"  textAnchor="start"  fontSize="10" fontWeight="600" fill="#64748b">Safety/Quality</text>
                  <text x="246" y="208" textAnchor="start"  fontSize="10" fontWeight="600" fill="#64748b">RCA</text>
                  <text x="150" y="265" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">Traceability</text>
                  <text x="54"  y="208" textAnchor="end"    fontSize="10" fontWeight="600" fill="#64748b">Tech Memo</text>
                  <text x="54"  y="96"  textAnchor="end"    fontSize="10" fontWeight="600" fill="#64748b">Responsible AI</text>
                  <polygon
                    className="radar-polygon-active"
                    points={getRadarPoints(results.ratings)}
                    fill="rgba(20,184,166,0.25)"
                    stroke="var(--accent-teal)"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>
              <p className="skillgap-radar-legend">{t('skillgap.radarLegend')}</p>
            </div>
          </div>

          {/* Strengths & Gaps cards */}
          <div className="skillgap-bottom-grid">
            <div className="student-card skillgap-feedback-card">
              <h4 className="skillgap-feedback-title strengths">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{t('skillgap.strengths')}</span>
              </h4>
              {results.strengthsCount === 0 ? (
                <p className="skillgap-feedback-empty">{t('skillgap.noHighRatings')}</p>
              ) : (
                <ul className="skillgap-feedback-list">
                  {results.ratings.processMap    === 'high' && <li><strong>{t('skills.processMapAss')}:</strong> {t('skillgap.fb1')}</li>}
                  {results.ratings.safetyRisk    === 'high' && <li><strong>{t('skills.safetyRiskAss')}:</strong> {t('skillgap.fb2')}</li>}
                  {results.ratings.rca           === 'high' && <li><strong>{t('skills.rcaAss')}:</strong> {t('skillgap.fb3')}</li>}
                  {results.ratings.traceability  === 'high' && <li><strong>{t('skills.traceabilityAss')}:</strong> {t('skillgap.fb4')}</li>}
                  {results.ratings.memo          === 'high' && <li><strong>{t('skills.memoAss')}:</strong> {t('skillgap.fb5')}</li>}
                  {results.ratings.responsibleAi === 'high' && <li><strong>{t('skills.responsibleAiAss')}:</strong> {t('skillgap.fb6')}</li>}
                </ul>
              )}
            </div>

            <div className="student-card skillgap-feedback-card">
              <h4 className="skillgap-feedback-title weaknesses">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span>{t('skillgap.feedbackWeaknesses')}</span>
              </h4>
              {results.gapsCount === 0 ? (
                <p className="skillgap-feedback-empty">{t('skillgap.noLowRatings')}</p>
              ) : (
                <ul className="skillgap-feedback-list">
                  {results.ratings.processMap    === 'low' && <li><strong>{t('skills.processMapAss')}:</strong> {t('skillgap.rec1')} {t('skillgap.rec1act')}</li>}
                  {results.ratings.safetyRisk    === 'low' && <li><strong>{t('skills.safetyRiskAss')}:</strong> {t('skillgap.rec2')} {t('skillgap.rec2act')}</li>}
                  {results.ratings.rca           === 'low' && <li><strong>{t('skills.rcaAss')}:</strong> {t('skillgap.rec3')} {t('skillgap.rec3act')}</li>}
                  {results.ratings.traceability  === 'low' && <li><strong>{t('skills.traceabilityAss')}:</strong> {t('skillgap.rec4')} {t('skillgap.rec4act')}</li>}
                  {results.ratings.memo          === 'low' && <li><strong>{t('skills.memoAss')}:</strong> {t('skillgap.rec5')} {t('skillgap.rec5act')}</li>}
                  {results.ratings.responsibleAi === 'low' && <li><strong>{t('skills.responsibleAiAss')}:</strong> {t('skillgap.rec6')} {t('skillgap.rec6act')}</li>}
                </ul>
              )}
            </div>
          </div>

          {/* Training table */}
          <div className="student-card skillgap-training-card">
            <h4 className="skillgap-card-title" style={{ marginBottom: '20px' }}>{t('skillgap.recommended')}</h4>
            <div className="skillgap-table-wrapper">
              <table className="skillgap-table">
                <thead>
                  <tr>
                    <th>{t('skillgap.thCompetency')}</th>
                    <th>{t('skillgap.thCurrent')}</th>
                    <th>{t('skillgap.thPriority')}</th>
                    <th>{t('skillgap.thTrainNext')}</th>
                  </tr>
                </thead>
                <tbody>
                  {SKILLS_META.map(sm => {
                    const level = results.ratings[sm.key];
                    const priority = level === 'high' ? 'low' : level === 'low' ? 'high' : 'medium';
                    const recKey = sm.key === 'processMap'    ? 'rec1act'
                                 : sm.key === 'safetyRisk'   ? 'rec2act'
                                 : sm.key === 'rca'          ? 'rec3act'
                                 : sm.key === 'traceability' ? 'rec4act'
                                 : sm.key === 'memo'         ? 'rec5act'
                                 : 'rec6act';
                    return (
                      <tr key={sm.key}>
                        <td className="skillgap-table-competency">{sm.label}</td>
                        <td><span className={`skillgap-table-level ${level}`}>{level}</span></td>
                        <td><span className={`skillgap-table-level ${priority}`}>{priority}</span></td>
                        <td>{t(`skillgap.${recKey}`)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
