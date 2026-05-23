import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './QuizModal.css';

export default function QuizModal({ isOpen, onClose, scenario }) {
  const [phase, setPhase] = useState('quiz'); // 'quiz', 'rca', 'memo', 'results'
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [memoText, setMemoText] = useState('At 02:14 on May 12, the Checkout API began returning 500s for ~38% of requests. Auto-rollback engaged after two health-check failures. No data loss. Service degraded for 3h 20m. Probable cause: database connection pool exhaustion under a slow query regression.');

  // Reset state when modal opens for a new scenario
  useEffect(() => {
    if (isOpen) {
      setPhase('quiz');
      setCurrentStep(1);
      setSelectedOptions({});
      setChatInput('');
      setMemoText('At 02:14 on May 12, the Checkout API began returning 500s for ~38% of requests. Auto-rollback engaged after two health-check failures. No data loss. Service degraded for 3h 20m. Probable cause: database connection pool exhaustion under a slow query regression.');
      setChatHistory([{
        sender: 'coach',
        text: `Great work on the decisions. Final station — let's run a quick 5-Whys RCA. Why did the issue occur?`
      }]);
    }
  }, [isOpen, scenario?.id]);

  if (!isOpen || !scenario) return null;

  // Fallback if no quiz exists for this scenario
  const quizData = scenario.quiz || [];
  if (quizData.length === 0) {
    return (
      <div className="quiz-modal-overlay">
        <div className="quiz-modal-container" style={{ padding: '32px', textAlign: 'center' }}>
          <h3>No simulation quiz available for this scenario yet.</h3>
          <button className="quiz-btn-primary" onClick={onClose} style={{ marginTop: '16px', margin: '0 auto' }}>Close</button>
        </div>
      </div>
    );
  }

  const totalSteps = quizData.length;
  const currentQuizItem = quizData[currentStep - 1];
  const answeredCount = Object.keys(selectedOptions).length;
  
  const handleOptionSelect = (optionIndex) => {
    setSelectedOptions(prev => ({
      ...prev,
      [currentStep]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      setPhase('rca');
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatHistory(prev => [...prev, { sender: 'student', text: chatInput }]);
    setChatInput('');
    setTimeout(() => {
      setChatHistory(prev => [...prev, { sender: 'coach', text: "That's a good observation. What was the underlying root cause of that?" }]);
    }, 1000);
  };

  const currentSelection = selectedOptions[currentStep];
  const isNextDisabled = currentSelection === undefined;

  // Score calculation
  let correctCount = 0;
  quizData.forEach((q, idx) => {
    const stepNum = idx + 1;
    // Fallback to 1 if correctOptionIndex is missing to avoid crashing
    const correctIdx = q.correctOptionIndex !== undefined ? q.correctOptionIndex : 1;
    if (selectedOptions[stepNum] === correctIdx) {
      correctCount++;
    }
  });
  const scorePercentage = Math.round((correctCount / totalSteps) * 100);

  return createPortal(
    <div className="quiz-modal-overlay">
      <div className="quiz-modal-container">
        
        {/* Header (Shared) */}
        <div className="quiz-modal-header">
          <div className="quiz-modal-header-left">
            <span className="quiz-modal-header-icon">&gt;_</span>
            <h2 className="quiz-modal-title">Demo Simulation · {scenario.title}</h2>
          </div>
          <button className="quiz-modal-close-btn" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="quiz-modal-body">
          {phase === 'quiz' && (
            <>
              {/* Progress Row */}
              <div className="quiz-progress-row">
                <span className="quiz-progress-text">STEP {currentStep} OF {totalSteps}</span>
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
                {currentQuizItem.hint && (
                  <p className="quiz-question-hint">{currentQuizItem.hint}</p>
                )}
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
                    >
                      <div className="quiz-option-radio"></div>
                      <span className="quiz-option-text">{opt}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {phase === 'rca' && (
            <>
              <div className="rca-header-area">
                <h3 className="rca-title">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0ea5e9" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                    <circle cx="12" cy="5" r="2"></circle>
                    <path d="M12 7v4"></path>
                    <line x1="8" y1="16" x2="8" y2="16"></line>
                    <line x1="16" y1="16" x2="16" y2="16"></line>
                  </svg>
                  Final station · RCA Coach
                </h3>
                <span className="rca-badge">5-Whys</span>
              </div>
              <p className="rca-hint-text">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21h6"></path><path d="M12 2v2"></path><path d="M12 17v2"></path><path d="M5.6 5.6l1.4 1.4"></path><path d="M17 17l1.4 1.4"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M5.6 18.4l1.4-1.4"></path><path d="M17 7l1.4-1.4"></path>
                </svg>
                Anchor each "why" to evidence, not intuition.
              </p>

              <div className="rca-chat-box">
                {chatHistory.map((msg, i) => (
                  <div key={i} className="rca-chat-message" style={{ flexDirection: msg.sender === 'student' ? 'row-reverse' : 'row' }}>
                    {msg.sender === 'coach' && (
                      <div className="rca-chat-avatar">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                          <circle cx="12" cy="5" r="2"></circle>
                          <path d="M12 7v4"></path>
                        </svg>
                      </div>
                    )}
                    <div className="rca-chat-bubble" style={{ backgroundColor: msg.sender === 'student' ? '#f8fafc' : '#ffffff' }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form className="rca-input-area" onSubmit={handleSendChat}>
                <input 
                  type="text" 
                  className="rca-input-field" 
                  placeholder="Type your reasoning..." 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button type="submit" className="rca-send-btn" disabled={!chatInput.trim()}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"></line>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                  </svg>
                  Send
                </button>
              </form>
            </>
          )}

          {phase === 'memo' && (
            <>
              <div className="rca-header-area" style={{ marginBottom: '12px' }}>
                <h3 className="rca-title">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Final station · Technical Memo
                </h3>
                <button className="quiz-btn-secondary" style={{ backgroundColor: 'transparent', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', border: 'none' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Export PDF
                </button>
              </div>
              <p className="rca-hint-text">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
                Turn your findings into a 1-page memo your mentor can review in one pass.
              </p>

              <div className="memo-pills-row">
                {['Executive summary', 'Incident description', 'Root cause', 'Containment & corrective actions', 'Next steps & owners'].map((pill, i) => (
                  <div key={i} className="memo-pill">
                    {pill} <span className="memo-pill-badge">Done</span>
                  </div>
                ))}
              </div>

              <div className="memo-textarea-wrapper">
                <div className="memo-textarea-header">
                  <span className="memo-textarea-title">Executive summary</span>
                  <span className="memo-textarea-count">{memoText.length} chars</span>
                </div>
                <textarea 
                  className="memo-textarea" 
                  value={memoText}
                  onChange={(e) => setMemoText(e.target.value)}
                />
              </div>
            </>
          )}

          {phase === 'results' && (
            <>
              <div className="results-score-header">
                <div className="results-score-circle">
                  <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h1 className="results-score-text">{scorePercentage}%</h1>
                <p className="results-score-sub">{correctCount} of {totalSteps} decisions on target</p>
                <p className="results-score-hint">Review the correct answers below before going live.</p>
              </div>

              <div className="results-review-list">
                <span className="memo-textarea-count" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }}>Answer Review</span>
                
                {quizData.map((q, idx) => {
                  const stepNum = idx + 1;
                  const correctIdx = q.correctOptionIndex !== undefined ? q.correctOptionIndex : 1;
                  const userIdx = selectedOptions[stepNum];
                  const isCorrect = userIdx === correctIdx;
                  
                  return (
                    <div key={idx} className="review-card">
                      <div className="review-header">
                        {isCorrect ? (
                          <svg className="review-icon-correct" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        ) : (
                          <svg className="review-icon-wrong" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="15" y1="9" x2="9" y2="15"></line>
                            <line x1="9" y1="9" x2="15" y2="15"></line>
                          </svg>
                        )}
                        <h4 className="review-question">Q{stepNum}. {q.question.replace(/^T\+\d+:\d+\s+—\s+/, '')}</h4>
                      </div>
                      <div className="review-answer-row">
                        <span className="review-answer-label">Your answer:</span>
                        <span className={`review-answer-text ${isCorrect ? 'correct' : 'wrong'}`}>
                          {q.options[userIdx] || "No answer provided"}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="review-answer-row">
                          <span className="review-answer-label">Correct answer:</span>
                          <span className="review-answer-text correct">
                            {q.options[correctIdx]}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="quiz-modal-footer">
          {phase === 'quiz' && (
            <>
              <button 
                className="quiz-btn-secondary" 
                onClick={handlePrev}
                disabled={currentStep === 1}
              >
                Previous
              </button>
              <button 
                className="quiz-btn-primary" 
                onClick={handleNext}
                disabled={isNextDisabled}
              >
                {currentStep === totalSteps ? 'Continue to RCA Coach →' : 'Next →'}
              </button>
            </>
          )}
          
          {phase === 'rca' && (
            <>
              <button 
                className="quiz-btn-secondary" 
                onClick={() => setPhase('quiz')}
              >
                Back to decisions
              </button>
              <button 
                className="quiz-btn-primary" 
                onClick={() => setPhase('memo')}
              >
                Continue to Memo →
              </button>
            </>
          )}

          {phase === 'memo' && (
            <>
              <button 
                className="quiz-btn-secondary" 
                onClick={() => setPhase('rca')}
              >
                Back to RCA Coach
              </button>
              <button 
                className="quiz-btn-primary" 
                onClick={() => setPhase('results')}
              >
                Finish session →
              </button>
            </>
          )}

          {phase === 'results' && (
            <button 
              className="quiz-btn-primary" 
              onClick={onClose}
              style={{ margin: '0 auto' }}
            >
              Close
            </button>
          )}
        </div>

      </div>
    </div>,
    document.body
  );
}
