import React, { useState, useEffect } from 'react';
import './StudentScenarioSimulator.css';
import QuizModal from './QuizModal';

export default function StudentScenarioSimulator({ scenarios, activeScenario, handleOpenScenario, handleLaunchScenario, simCompleted, stepIndex, terminalLogs, chatMessages, inputVal, setInputVal, handleSendChat, choicesForStep }) {
  const [selectedScenarioId, setSelectedScenarioId] = useState(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Default selection
  useEffect(() => {
    if (scenarios && scenarios.length > 0 && !selectedScenarioId) {
      setSelectedScenarioId(scenarios[0].id);
    }
  }, [scenarios, selectedScenarioId]);

  const selectedScenario = scenarios?.find(s => s.id === selectedScenarioId) || scenarios?.[0];

  return (
    <div className="student-tab-panel scenario-simulator-root">
      <div className="student-page-header">
        <div className="student-page-title-area">
          <h1 className="student-page-title">Scenario Simulator</h1>
          <p className="student-page-subtitle">Step into a live production system. Diagnose. Decide. Defend your choices.</p>
        </div>
      </div>

      {/* If no scenario is running, show selector layout */}
      {!activeScenario ? (
        <div className="scenario-simulator-layout">
          {/* Left Column: Scenario Library */}
          <div className="scenario-library-column">
            <h3 className="scenario-library-title">Scenario library</h3>
            <div className="scenario-lib-list">
              {scenarios.map((sc) => {
                const isActive = sc.id === selectedScenarioId;
                const statusClass = sc.difficulty === 'Available' ? 'available' : sc.difficulty === 'In progress' ? 'in-progress' : 'completed';
                
                return (
                  <div 
                    className={`scenario-lib-card ${isActive ? 'active' : ''} ${isActive && statusClass === 'in-progress' ? 'in-progress' : ''}`} 
                    key={sc.id}
                    onClick={() => setSelectedScenarioId(sc.id)}
                  >
                    <div className="lib-card-header">
                      <span className="lib-card-id">{sc.id}</span>
                      <span className={`status-badge ${statusClass}`}>{sc.difficulty}</span>
                    </div>
                    <h4 className="lib-card-title">{sc.title}</h4>
                    
                    <div className="lib-card-tags">
                      {sc.tags?.map((tag, i) => {
                        let tagClass = 'tag-domain';
                        if (tag.toLowerCase() === 'beginner') tagClass = 'tag-beginner';
                        if (tag.toLowerCase() === 'intermediate') tagClass = 'tag-intermediate';
                        if (tag.toLowerCase() === 'advanced') tagClass = 'tag-advanced';
                        return <span key={i} className={`tag-badge ${tagClass}`}>{tag}</span>;
                      })}
                    </div>
                    
                    <div className="lib-card-footer">
                      {sc.category || 'Backend'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Scenario Detail */}
          {selectedScenario && (
            <div className="scenario-detail-column">
              <div className="detail-header-row">
                <div className="detail-title-area">
                  <p className="detail-subtitle">{selectedScenario.id} · {selectedScenario.category || 'Backend'}</p>
                  <h2>{selectedScenario.title}</h2>
                  
                  <div className="detail-meta-row">
                    <div className="meta-item">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {selectedScenario.estimatedTime || '30 min'}
                    </div>
                    <div className="meta-item">
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      {selectedScenario.tags?.[0] || 'Intermediate'}
                    </div>
                    <div className="meta-item">
                      <span className={`status-badge ${selectedScenario.difficulty === 'Available' ? 'available' : selectedScenario.difficulty === 'In progress' ? 'in-progress' : 'completed'}`}>
                        {selectedScenario.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button className="launch-btn" onClick={() => setIsQuizOpen(true)}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Launch simulation
                </button>
              </div>

              <div className="detail-card briefing">
                <h4 className="detail-card-title">Briefing</h4>
                <p className="detail-briefing-text">
                  {selectedScenario.briefing || "The incident commander has escalated an active issue to you. Check the logs and engage with the AI Coach to resolve it."}
                </p>
              </div>

              <div className="detail-grid">
                <div className="detail-card">
                  <h4 className="detail-card-title">Your Objectives</h4>
                  <ul className="detail-bullet-list objectives-list">
                    {(selectedScenario.objectives || ['Identify root cause', 'Recommend fix']).map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-card">
                  <h4 className="detail-card-title">AI Coach Will Evaluate</h4>
                  <ul className="detail-bullet-list evaluation-list">
                    {(selectedScenario.evaluationCriteria || ['Diagnostic speed', 'Accuracy']).map((crit, i) => (
                      <li key={i}>{crit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
              // Active simulation console panel
              <div className="simulator-layout">
                <div className="simulator-console">
                  
                  {/* Left Column: Staging Pod Terminal */}
                  <div className="simulator-terminal-column">
                    <div className="simulator-terminal-card">
                      <div className="simulator-terminal-header">
                        <div className="simulator-terminal-dots">
                          <span className="simulator-terminal-dot red"></span>
                          <span className="simulator-terminal-dot yellow"></span>
                          <span className="simulator-terminal-dot green"></span>
                        </div>
                        <span className="simulator-terminal-title">Staging Shell · {activeScenario.id}</span>
                      </div>

                      <div className="simulator-terminal-body">
                        {terminalLogs.map((log, index) => {
                          let className = 'simulator-terminal-line';
                          if (log.startsWith('$ ')) className += ' command';
                          else if (log.includes('[ERR]') || log.includes('failed')) className += ' error';
                          else if (log.includes('[SUCCESS]') || log.includes('[PASS]')) className += ' success';
                          return (
                            <div className={className} key={index}>
                              {log}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Decision Branching Choices */}
                    <div className="simulator-choices-container">
                      <span className="simulator-choice-title">Select Diagnostic Strategy:</span>
                      
                      {!simCompleted ? (
                        choicesForStep[stepIndex] && choicesForStep[stepIndex].map((ch, idx) => (
                          <button
                            className="simulator-choice-btn"
                            key={idx}
                            onClick={ch.action}
                          >
                            {ch.text}
                          </button>
                        ))
                      ) : (
                        <div className="student-card" style={{ padding: '16px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', textAlign: 'center' }}>
                          <h4 style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-heading)' }}>🎉 Scenario Successfully Cleared!</h4>
                          <p style={{ margin: 0, fontSize: '13px' }}>Your evidence memo has been compiled and submitted to Emily Vance for validation.</p>
                          <button className="student-header-btn" style={{ marginTop: '12px' }} onClick={() => {
                            setActiveScenario(null);
                            setActiveTab('portfolio');
                          }}>Go to Evidence Portfolio</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: AI RCA Coach Chat */}
                  <div className="simulator-chat-column">
                    <div className="student-card simulator-chat-card">
                      
                      <div className="simulator-chat-header">
                        <div className="simulator-chat-coach-pic">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
                            <path d="M17 16a5 5 0 0 1-10 0v-2h10v2z" />
                            <circle cx="12" cy="7" r="1" fill="currentColor" />
                          </svg>
                        </div>
                        <div className="simulator-chat-coach-info">
                          <h4 className="simulator-chat-coach-name">AI Incident Coach</h4>
                          <span className="simulator-chat-coach-status">● Live SRE Coach</span>
                        </div>
                      </div>

                      <div className="simulator-chat-body">
                        {chatMessages.map((msg, idx) => (
                          <div className={`simulator-chat-bubble ${msg.sender}`} key={idx}>
                            <p>{msg.text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="simulator-chat-footer">
                        <form className="simulator-chat-input-wrapper" onSubmit={handleSendChat}>
                          <input
                            type="text"
                            className="simulator-chat-input"
                            placeholder="Type a message to the AI coach..."
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                          />
                          <button type="submit" className="simulator-chat-send-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="22" y1="2" x2="11" y2="13"></line>
                              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                          </button>
                        </form>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Console Footer */}
                <div className="simulator-console-footer">
                  <button className="simulator-quit-btn" onClick={() => setActiveScenario(null)}>
                    Quit Simulation
                  </button>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Staging Pod: deployment-coupon-verify-4491-db-slot</span>
                </div>
              </div>
            )}

            <QuizModal 
              isOpen={isQuizOpen} 
              onClose={() => setIsQuizOpen(false)} 
              scenario={selectedScenario} 
            />

          </div>
  );
}
