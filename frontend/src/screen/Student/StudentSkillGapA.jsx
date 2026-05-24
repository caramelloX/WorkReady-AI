import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const getQuizQuestions = (t) => [
  { id: 'processMap', question: t('quiz.q1'), options: [t('quiz.q1_opt1'), t('quiz.q1_opt2'), t('quiz.q1_opt3')] },
  { id: 'safetyRisk', question: t('quiz.q2'), options: [t('quiz.q2_opt1'), t('quiz.q2_opt2'), t('quiz.q2_opt3')] },
  { id: 'rca', question: t('quiz.q3'), options: [t('quiz.q3_opt1'), t('quiz.q3_opt2'), t('quiz.q3_opt3')] },
  { id: 'traceability', question: t('quiz.q4'), options: [t('quiz.q4_opt1'), t('quiz.q4_opt2'), t('quiz.q4_opt3')] },
  { id: 'memo', question: t('quiz.q5'), options: [t('quiz.q5_opt1'), t('quiz.q5_opt2'), t('quiz.q5_opt3')] },
  { id: 'responsibleAi', question: t('quiz.q6'), options: [t('quiz.q6_opt1'), t('quiz.q6_opt2'), t('quiz.q6_opt3')] }
];

export default function StudentSkillGapA({ onComplete }) {
  const { t } = useLanguage();
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const QUIZ_QUESTIONS = getQuizQuestions(t);
  const totalSteps = QUIZ_QUESTIONS.length;
  const currentQuizItem = QUIZ_QUESTIONS[currentStep - 1];
  const answeredCount = Object.keys(selectedOptions).length;

  const handleOptionSelect = (optionIndex) => {
    setSelectedOptions(prev => ({
      ...prev,
      [currentQuizItem.id]: optionIndex
    }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      const levelMap = { 0: 'low', 1: 'medium', 2: 'high' };
      const finalRatings = {};
      Object.keys(selectedOptions).forEach(key => {
        finalRatings[key] = levelMap[selectedOptions[key]];
      });
      await onComplete(finalRatings);
      setIsSubmitting(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!isStarted) {
    return (
      <div className="student-tab-panel">
        <div className="skillgap-header-row">
          <div className="student-page-title-area">
            <h1 className="student-page-title">{t('skillgap.title', 'Skill Gap Assessment')}</h1>
            <p className="student-page-subtitle">{t('skillgap.subtitle', 'View your competencies based on your initial assessment.')}</p>
          </div>
        </div>

        <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--card-bg, #18181b)', borderRadius: '12px', border: '1px dashed var(--border-color, #27272a)', marginTop: '2rem' }}>
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1rem' }}>Welcome to Skill Gap Analysis</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>You haven't completed the initial assessment yet. Please complete the assessment to discover your strengths and areas for growth.</p>
          <button 
            onClick={() => setIsStarted(true)}
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: 'var(--accent-blue, #3b82f6)', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '600', 
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.background = '#2563eb'}
            onMouseOut={(e) => e.target.style.background = 'var(--accent-blue, #3b82f6)'}
          >
            Take Initial Assessment
          </button>
        </div>
      </div>
    );
  }

  const currentSelection = selectedOptions[currentQuizItem.id];
  const isNextDisabled = currentSelection === undefined || isSubmitting;

  return (
    <div className="student-tab-panel">
      <div className="skillgap-header-row">
        <div className="student-page-title-area">
          <h1 className="student-page-title">{t('quiz.title', 'Initial Skill Assessment')}</h1>
          <p className="student-page-subtitle">Answer the questions below to assess your current competencies.</p>
        </div>
      </div>

      <div style={{ background: 'var(--card-bg, #fff)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>
            {t('aiquiz.questionOf', 'Question ')}{currentStep}{t('aiquiz.of', ' of ')}{totalSteps}
          </span>
          <div style={{ flex: 1, margin: '0 1.5rem', height: '6px', background: 'var(--bg-color)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${(currentStep / totalSteps) * 100}%`, height: '100%', background: 'var(--accent-blue, #3b82f6)', transition: 'width 0.3s ease' }}></div>
          </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '500' }}>
            {answeredCount}/{totalSteps} {t('aiquiz.answered', 'answered')}
          </span>
        </div>

        <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
          {currentQuizItem.question}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {currentQuizItem.options.map((opt, idx) => {
            const isSelected = currentSelection === idx;
            return (
              <div 
                key={idx} 
                onClick={() => handleOptionSelect(idx)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '1rem', 
                  border: `2px solid ${isSelected ? 'var(--accent-blue, #3b82f6)' : 'var(--border-color)'}`, 
                  borderRadius: '8px', 
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  background: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                  transition: 'all 0.2s ease',
                  pointerEvents: isSubmitting ? 'none' : 'auto'
                }}
              >
                <div style={{ 
                  width: '20px', 
                  height: '20px', 
                  borderRadius: '50%', 
                  border: `2px solid ${isSelected ? 'var(--accent-blue, #3b82f6)' : 'var(--text-secondary)'}`, 
                  marginRight: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-blue, #3b82f6)' }}></div>}
                </div>
                <span style={{ color: 'var(--text-primary)', fontSize: '1rem' }}>{opt}</span>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button 
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: 'transparent', 
              color: currentStep === 1 ? 'var(--text-secondary)' : 'var(--text-primary)', 
              border: '1px solid', 
              borderColor: currentStep === 1 ? 'var(--border-color)' : 'var(--text-secondary)',
              borderRadius: '8px', 
              fontWeight: '600', 
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              opacity: currentStep === 1 ? 0.5 : 1
            }}
          >
            {t('aiquiz.previous', 'Previous')}
          </button>
          <button 
            onClick={handleNext}
            disabled={isNextDisabled}
            style={{ 
              padding: '0.75rem 2rem', 
              background: isNextDisabled ? 'var(--border-color)' : 'var(--accent-blue, #3b82f6)', 
              color: isNextDisabled ? 'var(--text-secondary)' : '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: '600', 
              cursor: isNextDisabled ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            {isSubmitting ? t('quiz.saving', 'Saving...') : currentStep === totalSteps ? t('quiz.finishProfile', 'Finish Assessment') : t('aiquiz.next', 'Next')}
          </button>
        </div>
      </div>
    </div>
  );
}
