import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './QuizModal.css'; // Reusing the same CSS

const QUIZ_QUESTIONS = [
  {
    id: 'processMap',
    question: "How comfortable are you with drawing end-to-end process maps?",
    options: [
      "I don't know how to create process maps.",
      "I can create basic flowcharts but struggle with complex workflows.",
      "I can confidently draw detailed end-to-end process maps for unfamiliar workflows."
    ]
  },
  {
    id: 'safetyRisk',
    question: "How would you rate your ability to identify safety and quality risks?",
    options: [
      "I rarely consider edge-case safety regressions.",
      "I can identify common risks but might miss complex system interactions.",
      "I can independently spot edge-case safety or quality regressions in existing systems."
    ]
  },
  {
    id: 'rca',
    question: "How experienced are you with Root Cause Analysis (RCA)?",
    options: [
      "I usually just fix the immediate bug without structured analysis.",
      "I know what RCA is but haven't run structured 5-Whys or fishbone reviews.",
      "I know how to run a structured 5-Whys or fishbone analysis to find true root causes."
    ]
  },
  {
    id: 'traceability',
    question: "How well can you trace artifacts back to their source?",
    options: [
      "I find it difficult to connect requirements with code and tests.",
      "I can somewhat trace artifacts but sometimes get lost in complex systems.",
      "I can trace logs, metrics, or artifacts back to their source without getting lost."
    ]
  },
  {
    id: 'memo',
    question: "How comfortable are you writing technical incident memos?",
    options: [
      "I have never written a technical incident report.",
      "I can write a report but it's often unstructured or too detailed.",
      "I can write a crisp 1-page technical memo outlining an incident, root cause, and next steps."
    ]
  },
  {
    id: 'responsibleAi',
    question: "How well do you understand Responsible AI practices?",
    options: [
      "I am unfamiliar with designing features for fairness and avoiding bias.",
      "I have a basic understanding but lack practical experience evaluating AI bias.",
      "I understand how to design and evaluate features to avoid bias and ensure fairness."
    ]
  }
];

export default function SkillAssessmentQuizModal({ isOpen, onClose, onComplete }) {
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

  const currentSelection = selectedOptions[currentQuizItem.id];
  const isNextDisabled = currentSelection === undefined || isSubmitting;

  return createPortal(
    <div className="quiz-modal-overlay">
      <div className="quiz-modal-container">
        
        {/* Header */}
        <div className="quiz-modal-header">
          <div className="quiz-modal-header-left">
            <span className="quiz-modal-header-icon">&gt;_</span>
            <h2 className="quiz-modal-title">Initial Skill Gap Assessment</h2>
          </div>
        </div>

        {/* Body */}
        <div className="quiz-modal-body">
          {/* Progress Row */}
          <div className="quiz-progress-row">
            <span className="quiz-progress-text">QUESTION {currentStep} OF {totalSteps}</span>
            <div className="quiz-progress-track">
              <div 
                className="quiz-progress-fill" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <span className="quiz-progress-text">{answeredCount}/{totalSteps} answered</span>
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
            {isSubmitting ? 'Saving...' : currentStep === totalSteps ? 'Finish & View Profile →' : 'Next →'}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
