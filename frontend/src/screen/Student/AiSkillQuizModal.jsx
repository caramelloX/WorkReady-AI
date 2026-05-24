import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { createPortal } from 'react-dom';
import './QuizModal.css';
import Swal from 'sweetalert2';

export default function AiSkillQuizModal({ isOpen, onClose, onComplete, occupationGoal }) {
  const { t } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateQuiz = async () => {
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occupationGoal: occupationGoal || 'Software Engineer' })
      });
      if (!res.ok) throw new Error('Failed to generate quiz');
      const data = await res.json();
      if (data.success && data.questions) {
        setQuestions(data.questions);
      } else {
        throw new Error('Invalid response from AI');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load AI quiz. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedOptions({});
      setIsSubmitting(false);
      setLoading(true);
      setError(null);
      setQuestions([]);
      generateQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, occupationGoal]);



  if (!isOpen) return null;

  if (loading) {
    return createPortal(
      <div className="quiz-modal-overlay">
        <div className="quiz-modal-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
          <div className="quiz-modal-header-icon" style={{ animation: 'spin 2s linear infinite', marginBottom: '20px' }}>&gt;_</div>
          <h2 className="quiz-modal-title" style={{ textAlign: 'center' }}>{t('aiquiz.generating')}</h2>
          <p style={{ color: '#8892b0', marginTop: '10px' }}>{t('aiquiz.generatingDesc')}</p>
        </div>
      </div>,
      document.body
    );
  }

  if (error) {
    return createPortal(
      <div className="quiz-modal-overlay">
        <div className="quiz-modal-container" style={{ padding: '40px', textAlign: 'center' }}>
          <h2 className="quiz-modal-title" style={{ color: '#ff6b6b' }}>{t('aiquiz.error')}</h2>
          <p style={{ color: '#8892b0', marginTop: '10px' }}>{error}</p>
          <button className="quiz-btn-primary" style={{ marginTop: '20px' }} onClick={onClose}>{t('aiquiz.close')}</button>
        </div>
      </div>,
      document.body
    );
  }

  const totalSteps = questions.length;
  const currentQuizItem = questions[currentStep - 1];
  const answeredCount = Object.keys(selectedOptions).length;

  const handleOptionSelect = (optionIndex) => {
    setSelectedOptions(prev => ({
      ...prev,
      [currentStep - 1]: optionIndex
    }));
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Finish quiz
      setIsSubmitting(true);
      
      // Calculate scores
      const scoreMap = {
        'System Design': { correct: 0, total: 0, key: 'processMap' },
        'Cloud & DevOps (AWS/Docker)': { correct: 0, total: 0, key: 'safetyRisk' },
        'Git & Code Review': { correct: 0, total: 0, key: 'rca' },
        'Data Structures & Algorithms': { correct: 0, total: 0, key: 'traceability' },
        'Secure Coding (OWASP)': { correct: 0, total: 0, key: 'memo' },
        'Technical Writing': { correct: 0, total: 0, key: 'responsibleAi' }
      };

      questions.forEach((q, idx) => {
        const skillCategory = scoreMap[q.skill];
        if (skillCategory) {
          skillCategory.total += 1;
          if (selectedOptions[idx] === q.correctIndex) {
            skillCategory.correct += 1;
          }
        }
      });

      const finalRatings = {};
      Object.keys(scoreMap).forEach(k => {
        const cat = scoreMap[k];
        const pct = cat.total > 0 ? cat.correct / cat.total : 0;
        let rating = 'low';
        if (pct >= 0.8) rating = 'high';
        else if (pct >= 0.4) rating = 'medium';
        finalRatings[cat.key] = rating;
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

  const currentSelection = selectedOptions[currentStep - 1];
  const isNextDisabled = currentSelection === undefined || isSubmitting;

  return createPortal(
    <div className="quiz-modal-overlay">
      <div className="quiz-modal-container">
        
        {/* Header */}
        <div className="quiz-modal-header">
          <div className="quiz-modal-header-left">
            <span className="quiz-modal-header-icon">&gt;_</span>
            <h2 className="quiz-modal-title">{t('aiquiz.title')}</h2>
          </div>
          <div className="quiz-modal-header-right" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{color: '#64ffda', fontSize: '12px'}}>[ {currentQuizItem.skill} ]</span>
            <button className="quiz-modal-close-btn" onClick={handleCloseConfirm} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
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
            Previous
          </button>
          <button 
            className="quiz-btn-primary" 
            onClick={handleNext}
            disabled={isNextDisabled}
          >
            {isSubmitting ? t('aiquiz.scoring') : currentStep === totalSteps ? t('aiquiz.finish') : t('aiquiz.next')}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
