import React, { useState } from 'react';

export default function ScenarioEditForm({ scenario, onSave, onCancel, onGenerate, isGenerating }) {
  const [title, setTitle] = useState(scenario.title || '');
  const [desc, setDesc] = useState(scenario.desc || scenario.description || '');
  const [quizzes, setQuizzes] = useState(scenario.quiz || []);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const handleAddQuiz = (type) => {
    if (type === 'choice') {
      setQuizzes([...quizzes, { type: 'choice', question: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' }]);
    } else {
      setQuizzes([...quizzes, { type: 'essay', question: '', explanation: '' }]);
    }
    setShowTypeSelector(false);
  };

  const handleQuizChange = (index, field, value) => {
    const newQuizzes = [...quizzes];
    newQuizzes[index][field] = value;
    setQuizzes(newQuizzes);
  };

  const handleOptionChange = (quizIndex, optionIndex, value) => {
    const newQuizzes = [...quizzes];
    newQuizzes[quizIndex].options[optionIndex] = value;
    setQuizzes(newQuizzes);
  };

  const handleRemoveQuiz = (index) => {
    const newQuizzes = [...quizzes];
    newQuizzes.splice(index, 1);
    setQuizzes(newQuizzes);
  };

  return (
    <div className="scenario-edit-form" style={{ display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '70vh' }}>
      <div className="form-scroll-container" style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem', textAlign: 'left' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '1rem', color: 'var(--neutral-text, #6b7280)', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Scenario Title</label>
          <input className="swal2-input" style={{ margin: 0, width: '100%', boxSizing: 'border-box', fontSize: '1.1rem', padding: '1.5rem 1rem', background: 'var(--neutral-card, #ffffff)', color: 'var(--neutral-heading, #0f172a)' }} value={title} onChange={e => setTitle(e.target.value)} />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ fontSize: '1rem', color: 'var(--neutral-text, #6b7280)', display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Scenario Description</label>
          <textarea className="swal2-textarea" style={{ margin: 0, width: '100%', boxSizing: 'border-box', height: '150px', fontSize: '1rem', lineHeight: '1.5', padding: '1rem', background: 'var(--neutral-card, #ffffff)', color: 'var(--neutral-heading, #0f172a)' }} value={desc} onChange={e => setDesc(e.target.value)} />
        </div>

        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '1.2rem', color: 'var(--neutral-heading, #111827)', fontWeight: '600' }}>Quizzes</label>
          
          <div style={{ position: 'relative' }}>
            {!showTypeSelector ? (
              <button type="button" onClick={() => setShowTypeSelector(true)} style={{ background: 'var(--accent-blue, #3b82f6)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add Quiz
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button type="button" onClick={() => handleAddQuiz('choice')} style={{ background: '#10b981', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Multiple Choice
                </button>
                <button type="button" onClick={() => handleAddQuiz('essay')} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Written / Essay
                </button>
                <button type="button" onClick={() => setShowTypeSelector(false)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {quizzes.length === 0 && (
          <p style={{ color: 'var(--neutral-text, #6b7280)', fontStyle: 'italic', marginBottom: '1rem' }}>No quizzes added yet.</p>
        )}

        {quizzes.map((quiz, qIndex) => {
          const isEssay = quiz.type === 'essay';
          return (
          <div key={qIndex} style={{ background: 'var(--neutral-bg, #f3f4f6)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--border-color, #e5e7eb)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h4 style={{ margin: 0, color: 'var(--neutral-heading, #111827)' }}>
                Question {qIndex + 1} <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 'normal', marginLeft: '0.5rem' }}>({isEssay ? 'Written / Essay' : 'Multiple Choice'})</span>
              </h4>
              <button type="button" onClick={() => handleRemoveQuiz(qIndex)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer', fontWeight: '600' }}>Remove</button>
            </div>
            
            <input placeholder="Question text" value={quiz.question} onChange={e => handleQuizChange(qIndex, 'question', e.target.value)} style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box', background: 'var(--neutral-card, #ffffff)', color: 'var(--neutral-heading, #0f172a)' }} />
            
            {!isEssay && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                {quiz.options && quiz.options.map((opt, oIndex) => (
                  <input key={oIndex} placeholder={`Option ${oIndex + 1}`} value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box', background: 'var(--neutral-card, #ffffff)', color: 'var(--neutral-heading, #0f172a)' }} />
                ))}
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: isEssay ? '1fr' : '1fr 1fr', gap: '1rem' }}>
              {!isEssay && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--neutral-text)' }}>Correct Answer</label>
                  <select value={quiz.correctAnswer} onChange={e => handleQuizChange(qIndex, 'correctAnswer', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box', background: 'var(--neutral-card, #ffffff)', color: 'var(--neutral-heading, #0f172a)' }}>
                    <option value="">Select correct option...</option>
                    {quiz.options && quiz.options.map((opt, oIndex) => (
                      opt ? <option key={oIndex} value={opt}>{opt}</option> : null
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--neutral-text)' }}>
                  {isEssay ? 'Expected Answer / Rubric (Optional)' : 'Explanation (Optional)'}
                </label>
                <input placeholder={isEssay ? "Keywords or criteria for the mentor to grade against" : "Explanation"} value={quiz.explanation || ''} onChange={e => handleQuizChange(qIndex, 'explanation', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box', background: 'var(--neutral-card, #ffffff)', color: 'var(--neutral-heading, #0f172a)' }} />
              </div>
            </div>
          </div>
        )})}
      </div>

      {/* SweetAlert style actions */}
      <div className="swal2-actions" style={{ display: 'flex', justifyContent: 'center', marginTop: '1.5rem', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
        <button type="button" className="swal2-cancel swal2-styled" style={{ backgroundColor: '#6b7280', margin: 0 }} onClick={onCancel} disabled={isGenerating}>
          Cancel
        </button>
        <button type="button" className="swal2-confirm swal2-styled" style={{ backgroundColor: '#3b82f6', margin: 0 }} onClick={() => onSave({ title, desc, quiz: quizzes })} disabled={isGenerating}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
