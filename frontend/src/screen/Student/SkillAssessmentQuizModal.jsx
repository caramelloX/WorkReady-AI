import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Swal from 'sweetalert2';
import { generateSkillAssessment } from '../../utils/aiMentorService';
import './QuizModal.css';

// ── Skill metadata ────────────────────────────────────────────────────────────
const SKILLS_META = [
  { key: 'processMap',     label: 'Industrial Flow & Process Mapping',  labelTh: 'การทำ Process Map',                   weight: 0.25 },
  { key: 'safetyRisk',    label: 'Safety & Quality Risk Assessment',   labelTh: 'ความเสี่ยงด้านความปลอดภัย',         weight: 0.20 },
  { key: 'rca',           label: 'Evidence-Based Root Cause Analysis', labelTh: 'การวิเคราะห์สาเหตุ (RCA)',           weight: 0.15 },
  { key: 'traceability',  label: 'Documentation & Traceability',       labelTh: 'เอกสารและการตรวจสอบย้อนหลัง',       weight: 0.20 },
  { key: 'memo',          label: 'Technical Communication',            labelTh: 'การสื่อสารเชิงเทคนิค',              weight: 0.15 },
  { key: 'responsibleAi', label: 'Responsible AI Usage',              labelTh: 'การใช้ AI อย่างมีความรับผิดชอบ',    weight: 0.05 },
];

// ── Default 30 questions (fallback when AI is unavailable) ───────────────────
const DEFAULT_QUESTIONS = [
  { id: 'q01', skillKey: 'processMap',    subskill: 'process step identification', question: 'ฉันสามารถระบุขั้นตอนทุกขั้นในกระบวนการผลิตและเรียงลำดับให้ถูกต้องได้',                              difficulty: 'easy'   },
  { id: 'q02', skillKey: 'processMap',    subskill: 'flow documentation',          question: 'ฉันสามารถจัดทำเอกสารกระบวนการที่เข้าใจง่ายสำหรับผู้ที่ยังไม่เคยทำงานในส่วนนั้น',               difficulty: 'easy'   },
  { id: 'q03', skillKey: 'processMap',    subskill: 'swim-lane diagram',            question: 'ฉันสามารถวาด Swim-Lane Diagram เพื่อแสดงหน้าที่รับผิดชอบข้ามแผนกได้อย่างถูกต้อง',               difficulty: 'medium' },
  { id: 'q04', skillKey: 'processMap',    subskill: 'value stream mapping',         question: 'ฉันสามารถวิเคราะห์กระแสคุณค่า (Value Stream) และระบุขั้นตอนที่ไม่สร้างมูลค่าได้',              difficulty: 'hard'   },
  { id: 'q05', skillKey: 'processMap',    subskill: 'bottleneck analysis',          question: 'ฉันสามารถระบุจุดคอขวด (Bottleneck) จากข้อมูลกระบวนการและอธิบายผลกระทบเชิงปริมาณได้',          difficulty: 'hard'   },
  { id: 'q06', skillKey: 'safetyRisk',   subskill: 'SOP compliance check',        question: 'ฉันสามารถอ่าน SOP และตรวจสอบว่ากระบวนการปฏิบัติตามขั้นตอนที่กำหนดครบถ้วนหรือไม่',              difficulty: 'easy'   },
  { id: 'q07', skillKey: 'safetyRisk',   subskill: 'quality checkpoint review',    question: 'ฉันสามารถประเมินจุดตรวจสอบคุณภาพในกระบวนการและระบุว่าจุดใดขาดหายหรือไม่เพียงพอ',            difficulty: 'easy'   },
  { id: 'q08', skillKey: 'safetyRisk',   subskill: 'hazard identification',        question: 'ฉันสามารถระบุอันตรายที่อาจเกิดขึ้นในพื้นที่ทำงานจากการสังเกตและข้อมูลที่มีอยู่',              difficulty: 'medium' },
  { id: 'q09', skillKey: 'safetyRisk',   subskill: 'risk matrix',                 question: 'ฉันสามารถประเมินความเสี่ยงโดยใช้ Risk Matrix (ความรุนแรง × โอกาสเกิด) และจัดลำดับได้',        difficulty: 'medium' },
  { id: 'q10', skillKey: 'safetyRisk',   subskill: 'corrective action planning',   question: 'ฉันสามารถวางแผนการแก้ไขที่เป็นรูปธรรม ระบุผู้รับผิดชอบ และกำหนดกรอบเวลาได้',               difficulty: 'hard'   },
  { id: 'q11', skillKey: 'rca',          subskill: 'evidence vs assumption',       question: 'ฉันสามารถแยกแยะระหว่างข้อเท็จจริงที่มีหลักฐานยืนยัน กับสมมติฐานที่ยังไม่ได้รับการพิสูจน์',   difficulty: 'easy'   },
  { id: 'q12', skillKey: 'rca',          subskill: '5-Why method',                 question: 'ฉันสามารถใช้วิธี 5-Why ในการสืบหาสาเหตุที่แท้จริงของปัญหาได้อย่างมีตรรกะ',                  difficulty: 'medium' },
  { id: 'q13', skillKey: 'rca',          subskill: 'fishbone diagram',             question: 'ฉันสามารถวาดและวิเคราะห์ Fishbone Diagram เพื่อจำแนกสาเหตุที่เป็นไปได้ในหลายมิติ',           difficulty: 'medium' },
  { id: 'q14', skillKey: 'rca',          subskill: 'causal chain documentation',   question: 'ฉันสามารถบันทึกห่วงโซ่สาเหตุ (Causal Chain) ตั้งแต่อาการที่สังเกตเห็นจนถึงต้นตอที่แท้จริง', difficulty: 'hard'   },
  { id: 'q15', skillKey: 'rca',          subskill: 'verification planning',        question: 'ฉันสามารถออกแบบแผนการตรวจสอบเพื่อยืนยันหรือโต้แย้งสาเหตุที่ระบุก่อนดำเนินการแก้ไข',       difficulty: 'hard'   },
  { id: 'q16', skillKey: 'traceability', subskill: 'batch record keeping',         question: 'ฉันสามารถบันทึกและติดตามข้อมูล Batch ในกระบวนการผลิตได้อย่างครบถ้วนและเชื่อถือได้',          difficulty: 'easy'   },
  { id: 'q17', skillKey: 'traceability', subskill: 'version control',              question: 'ฉันเข้าใจหลักการควบคุมเวอร์ชันของเอกสารและสามารถระบุฉบับที่เป็นปัจจุบันได้เสมอ',             difficulty: 'easy'   },
  { id: 'q18', skillKey: 'traceability', subskill: 'change log maintenance',       question: 'ฉันสามารถจัดทำและดูแล Change Log ที่บันทึกการเปลี่ยนแปลงทั้งหมดในกระบวนการอย่างสม่ำเสมอ',  difficulty: 'medium' },
  { id: 'q19', skillKey: 'traceability', subskill: 'evidence file linking',        question: 'ฉันสามารถเชื่อมโยงเอกสารหลักฐานต่างๆ เข้าด้วยกันให้สามารถอ้างอิงย้อนหลังได้',               difficulty: 'medium' },
  { id: 'q20', skillKey: 'traceability', subskill: 'audit trail creation',         question: 'ฉันสามารถสร้าง Audit Trail ที่แสดงลำดับเหตุการณ์ การตัดสินใจ และผู้รับผิดชอบได้ครบถ้วน',   difficulty: 'hard'   },
  { id: 'q21', skillKey: 'memo',         subskill: 'stakeholder summary',          question: 'ฉันสามารถสรุปข้อมูลทางเทคนิคให้ผู้ที่ไม่ใช่ผู้เชี่ยวชาญเข้าใจได้โดยไม่เสียความถูกต้อง',    difficulty: 'easy'   },
  { id: 'q22', skillKey: 'memo',         subskill: 'incident report structure',    question: 'ฉันสามารถเขียนรายงานเหตุการณ์ที่ครอบคลุมข้อเท็จจริง สาเหตุ และการดำเนินการอย่างมีโครงสร้าง', difficulty: 'medium' },
  { id: 'q23', skillKey: 'memo',         subskill: 'technical memo writing',       question: 'ฉันสามารถเขียน Technical Memo ที่มีโครงสร้างชัดเจนตามมาตรฐานวิชาชีพและนำไปใช้ได้จริง',      difficulty: 'medium' },
  { id: 'q24', skillKey: 'memo',         subskill: 'recommendation clarity',       question: 'ฉันสามารถเขียนข้อเสนอแนะที่ชัดเจน เฉพาะเจาะจง ระบุผู้รับผิดชอบ และกำหนดกรอบเวลาได้',     difficulty: 'medium' },
  { id: 'q25', skillKey: 'memo',         subskill: 'executive briefing',           question: 'ฉันสามารถนำเสนอสรุปผู้บริหาร (Executive Briefing) ที่กระชับ ตรงประเด็น และใช้เวลาน้อยที่สุด', difficulty: 'hard'   },
  { id: 'q26', skillKey: 'responsibleAi',subskill: 'AI suggestion verification',  question: 'ฉันตรวจสอบคำแนะนำจาก AI ด้วยหลักฐานและการตัดสินใจของตนเองทุกครั้งก่อนนำไปใช้',              difficulty: 'easy'   },
  { id: 'q27', skillKey: 'responsibleAi',subskill: 'human decision logging',      question: 'ฉันบันทึกได้ชัดเจนว่าส่วนใดที่ฉันตัดสินใจเอง และส่วนใดที่อ้างอิงจากคำแนะนำของ AI',          difficulty: 'easy'   },
  { id: 'q28', skillKey: 'responsibleAi',subskill: 'AI limitation awareness',     question: 'ฉันเข้าใจข้อจำกัดของ AI และสามารถระบุสถานการณ์ที่ AI อาจให้ข้อมูลผิดพลาดหรือไม่ครบถ้วน',  difficulty: 'medium' },
  { id: 'q29', skillKey: 'responsibleAi',subskill: 'bias check',                  question: 'ฉันสามารถตรวจหาความลำเอียง (Bias) ในผลลัพธ์ของ AI ที่อาจส่งผลต่อคุณภาพการตัดสินใจ',        difficulty: 'hard'   },
  { id: 'q30', skillKey: 'responsibleAi',subskill: 'AI action traceability',      question: 'ฉันสามารถบันทึกและอ้างอิงได้ว่า AI แนะนำอะไร ฉันใช้หรือปรับเปลี่ยนอย่างไร และเหตุใด',      difficulty: 'medium' },
];

const TOTAL = 30;
const LEVEL_SCORE = { high: 100, medium: 50, low: 10 };

function calculateResults(answers, questions) {
  const ratings = {};
  for (const sm of SKILLS_META) {
    const qs  = questions.filter(q => q.skillKey === sm.key);
    const avg = qs.reduce((sum, q) => sum + (LEVEL_SCORE[answers[q.id]] || 0), 0) / qs.length;
    ratings[sm.key] = avg >= 75 ? 'high' : avg >= 35 ? 'medium' : 'low';
  }
  return ratings;
}

const DIFF_COLOR = { easy: '#3b82f6', medium: '#f59e0b', hard: '#ef4444' };
const DIFF_BG    = { easy: '#eff6ff', medium: '#fffbeb', hard: '#fef2f2' };

const ANSWER_OPTS = [
  { value: 'low',    labelTh: 'ยังไม่มั่นใจ', labelEn: 'Not Confident' },
  { value: 'medium', labelTh: 'พอใช้ได้',     labelEn: 'Somewhat'      },
  { value: 'high',   labelTh: 'มั่นใจดี',     labelEn: 'Confident'     },
];

// ── Validate AI questions have the expected structure ─────────────────────────
function isValidQuestions(qs) {
  if (!Array.isArray(qs) || qs.length !== 30) return false;
  const validKeys = new Set(SKILLS_META.map(s => s.key));
  return qs.every(q =>
    q.id && q.skillKey && validKeys.has(q.skillKey) &&
    q.subskill && q.question && q.difficulty
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function LoadingState({ careerLabel }) {
  return (
    <div className="sqm-loading-wrap">
      <div className="sqm-loading-spinner" />
      <p className="sqm-loading-title">AI กำลังสร้างแบบประเมิน…</p>
      {careerLabel && (
        <p className="sqm-loading-sub">ปรับตามสายอาชีพ: <strong>{careerLabel}</strong></p>
      )}
      <p className="sqm-loading-hint">ใช้เวลาประมาณ 10–20 วินาที</p>
    </div>
  );
}

export default function SkillAssessmentQuizModal({ isOpen, onClose, onComplete, userProfile }) {
  const [step, setStep]             = useState(0);
  const [answers, setAnswers]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions]   = useState(DEFAULT_QUESTIONS);
  const [careerContext, setCareerContext] = useState('');
  const [loading, setLoading]       = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false);

  // When modal opens: try to generate career-tailored questions
  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    setAnswers({});
    setSubmitting(false);

    const hasCareer = userProfile && (
      userProfile.career_goal || userProfile.target_track || userProfile.target_industry || userProfile.occupation_goal
    );

    if (!hasCareer) {
      setQuestions(DEFAULT_QUESTIONS);
      setCareerContext('');
      setAiGenerated(false);
      return;
    }

    setLoading(true);
    setQuestions(DEFAULT_QUESTIONS);
    setAiGenerated(false);

    const profile = {
      career_goal:     userProfile.career_goal     || '',
      target_track:    userProfile.target_track    || '',
      target_industry: userProfile.target_industry || '',
      occupation_goal: userProfile.occupation_goal || '',
      major:           userProfile.major           || '',
    };

    generateSkillAssessment(profile)
      .then(result => {
        const qs = result?.questions;
        if (isValidQuestions(qs)) {
          setQuestions(qs);
          setCareerContext(result.careerContext || profile.career_goal || profile.target_track);
          setAiGenerated(true);
        }
      })
      .catch(() => {
        // Silently fall back to defaults
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const totalSteps    = SKILLS_META.length;
  const isLastStep    = step === totalSteps - 1;
  const skill         = SKILLS_META[step];
  const stepQuestions = questions.filter(q => q.skillKey === skill.key);
  const stepAnswered  = stepQuestions.filter(q => answers[q.id]).length;
  const stepDone      = stepAnswered === stepQuestions.length;
  const totalAnswered = Object.keys(answers).length;

  function handleAnswer(qId, value) {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  }

  async function handleSubmit() {
    if (!stepDone || submitting) return;
    setSubmitting(true);
    const ratings = calculateResults(answers, questions);
    await onComplete(ratings);
    setSubmitting(false);
  }

  function handleCloseConfirm() {
    if (totalAnswered === 0 && !loading) { onClose(); return; }
    Swal.fire({
      title: 'ปิดแบบประเมิน?',
      text: 'ความคืบหน้าจะหายไปหากปิดหน้าต่างนี้',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#062b50',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'ใช่ ปิดเลย',
      cancelButtonText: 'ยกเลิก',
    }).then(r => { if (r.isConfirmed) onClose(); });
  }

  return createPortal(
    <div className="quiz-modal-overlay">
      <div className="quiz-modal-container sqm-wide">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="quiz-modal-header">
          <div className="quiz-modal-header-left">
            <span className="quiz-modal-header-icon">&gt;_</span>
            <div>
              <h2 className="quiz-modal-title">การประเมินทักษะ Skill Gap</h2>
              <p className="sqm-header-sub">
                {loading
                  ? 'AI กำลังปรับแบบประเมินตามสายอาชีพ…'
                  : aiGenerated
                    ? `ปรับตามสายอาชีพ: ${careerContext}`
                    : 'ประเมินตัวเองใน 6 ทักษะหลัก — 30 คำถาม'}
              </p>
            </div>
          </div>
          <button className="quiz-modal-close-btn" onClick={handleCloseConfirm} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────── */}
        {loading ? (
          <div className="quiz-modal-body sqm-body">
            <LoadingState careerLabel={
              userProfile?.career_goal || userProfile?.target_track || userProfile?.occupation_goal
            } />
          </div>
        ) : (
          <div className="quiz-modal-body sqm-body">

            {/* Progress row */}
            <div className="quiz-progress-row" style={{ marginBottom: 20 }}>
              <span className="quiz-progress-text">ทักษะที่ {step + 1}/{totalSteps}</span>
              <div className="quiz-progress-track">
                <div className="quiz-progress-fill" style={{ width: `${((step + (stepDone ? 1 : stepAnswered / stepQuestions.length)) / totalSteps) * 100}%` }} />
              </div>
              <span className="quiz-progress-text">{totalAnswered}/{TOTAL} ตอบแล้ว</span>
            </div>

            {/* Skill header */}
            <div className="sqm-skill-header">
              <div className="sqm-skill-badge">{step + 1}</div>
              <div>
                <div className="sqm-skill-name">{skill.label}</div>
                <div className="sqm-skill-name-th">{skill.labelTh}</div>
              </div>
              <div className="sqm-step-progress">
                <span className={stepDone ? 'sqm-step-done' : ''}>{stepAnswered}/{stepQuestions.length}</span>
              </div>
            </div>

            {/* AI badge */}
            {aiGenerated && (
              <div className="sqm-ai-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
                AI-Tailored สำหรับสายอาชีพของคุณ
              </div>
            )}

            {/* Questions */}
            <div className="sqm-questions">
              {stepQuestions.map(q => {
                const selected = answers[q.id];
                return (
                  <div key={q.id} className={`sqm-question-row${selected ? ' answered' : ''}`}>
                    <div className="sqm-question-meta">
                      <span className="sqm-q-num">Q{q.id.slice(1)}</span>
                      <span
                        className="sqm-diff-badge"
                        style={{ color: DIFF_COLOR[q.difficulty], background: DIFF_BG[q.difficulty] }}
                      >
                        {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                      </span>
                      <span className="sqm-subskill">{q.subskill}</span>
                    </div>
                    <p className="sqm-question-text">{q.question}</p>
                    <div className="sqm-answer-group">
                      {ANSWER_OPTS.map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          className={`sqm-answer-btn sqm-answer-${opt.value}${selected === opt.value ? ' selected' : ''}`}
                          onClick={() => handleAnswer(q.id, opt.value)}
                          disabled={submitting}
                        >
                          <span className="sqm-answer-th">{opt.labelTh}</span>
                          <span className="sqm-answer-en">{opt.labelEn}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step dots */}
            <div className="sqm-dots">
              {SKILLS_META.map((sm, i) => {
                const qs   = questions.filter(q => q.skillKey === sm.key);
                const done = qs.every(q => answers[q.id]);
                return (
                  <button
                    key={sm.key}
                    className={`sqm-dot${i === step ? ' active' : ''}${done ? ' done' : ''}`}
                    onClick={() => setStep(i)}
                    title={sm.labelTh}
                  />
                );
              })}
            </div>

          </div>
        )}

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className="quiz-modal-footer">
          <button
            className="quiz-btn-secondary"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0 || submitting || loading}
          >
            ← ก่อนหน้า
          </button>

          <span className="sqm-footer-hint">
            {loading && 'AI กำลังสร้างคำถาม…'}
            {!loading && !stepDone && `ตอบอีก ${stepQuestions.length - stepAnswered} ข้อ`}
            {!loading && stepDone && !isLastStep && 'ทักษะนี้ครบแล้ว — ไปต่อได้'}
            {!loading && stepDone && isLastStep && `ตอบครบ ${TOTAL} ข้อ — พร้อมส่ง`}
          </span>

          {isLastStep ? (
            <button
              className="quiz-btn-primary"
              onClick={handleSubmit}
              disabled={!stepDone || submitting || loading}
            >
              {submitting ? 'กำลังบันทึก…' : 'ส่งแบบประเมิน →'}
            </button>
          ) : (
            <button
              className="quiz-btn-primary"
              onClick={() => setStep(s => s + 1)}
              disabled={!stepDone || loading}
            >
              ถัดไป →
            </button>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
}
