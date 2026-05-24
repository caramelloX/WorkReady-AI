import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { createPortal } from 'react-dom';
import './QuizModal.css'; // Reusing the same CSS

import Swal from 'sweetalert2';

const getQuizQuestions = (t) => [
  { id: 'processMap', question: t('quiz.q1'), options: [t('quiz.q1_opt1'), t('quiz.q1_opt2'), t('quiz.q1_opt3')] },
  { id: 'safetyRisk', question: t('quiz.q2'), options: [t('quiz.q2_opt1'), t('quiz.q2_opt2'), t('quiz.q2_opt3')] },
  { id: 'rca', question: t('quiz.q3'), options: [t('quiz.q3_opt1'), t('quiz.q3_opt2'), t('quiz.q3_opt3')] },
  { id: 'traceability', question: t('quiz.q4'), options: [t('quiz.q4_opt1'), t('quiz.q4_opt2'), t('quiz.q4_opt3')] },
  { id: 'memo', question: t('quiz.q5'), options: [t('quiz.q5_opt1'), t('quiz.q5_opt2'), t('quiz.q5_opt3')] },
  { id: 'responsibleAi', question: t('quiz.q6'), options: [t('quiz.q6_opt1'), t('quiz.q6_opt2'), t('quiz.q6_opt3')] }
];

export default function SkillAssessmentQuizModal({ isOpen, onClose, onComplete }) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedOptions({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
      // Finish quiz
      setIsSubmitting(true);
      
      // Map indices (0, 1, 2) to ('low', 'medium', 'high')
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

  const handleCloseConfirm = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Your progress will be lost if you close this assessment.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#062b50',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, close it',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        onClose();
      }
    });
  };

  const currentSelection = selectedOptions[currentQuizItem.id];
  const isNextDisabled = currentSelection === undefined || isSubmitting;

  return createPortal(
    <div className="quiz-modal-overlay">
      <div className="quiz-modal-container">
        
        {/* Header */}
        <div className="quiz-modal-header">
          <div className="quiz-modal-header-left">
            <span className="quiz-modal-header-icon">&gt;_</span>
            <h2 className="quiz-modal-title">{t('quiz.title')}</h2>
          </div>
          <button className="quiz-modal-close-btn" onClick={handleCloseConfirm} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="quiz-modal-body">
          {/* Progress Row */}
          <div className="quiz-progress-row">
            <span className="quiz-progress-text">{t('aiquiz.questionOf')}{currentStep}{t('aiquiz.of')}{totalSteps}</span>
            <div className="quiz-progress-track">
              <div 
                className="quiz-progress-fill" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <span className="quiz-progress-text">{answeredCount}/{totalSteps}{t('aiquiz.answered')}</span>
          </div>

          {/* Question Area */}
          <div className="quiz-question-container">
            <h3 className="quiz-question-text">{currentQuizItem.question}</h3>
          </div>

          {/* Options */}
          <div className="quiz-options-container">
            {currentQuizItem.options.map((opt, idx) => {
              const isSelected = currentSelection === idx;
              return (
                <div 
                  key={idx} 
                  className={`quiz-option-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleOptionSelect(idx)}
                  style={{ pointerEvents: isSubmitting ? 'none' : 'auto' }}
                >
                  <div className="quiz-option-radio"></div>
                  <span className="quiz-option-text">{opt}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="quiz-modal-footer">
          <button 
            className="quiz-btn-secondary" 
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
          >
            {t('aiquiz.previous')}
          </button>
          <button 
            className="quiz-btn-primary" 
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            {isSubmitting ? t('quiz.saving') : currentStep === totalSteps ? t('quiz.finishProfile') : t('aiquiz.next')}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
