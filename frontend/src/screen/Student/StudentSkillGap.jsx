import React from 'react';

export default function StudentSkillGap({ ratings, handleRate, handleResetRatings, calculateRadarPoints, overallReadiness, strengthsCount, gapsCount }) {
  return (
    <div className="student-tab-panel">
            <div className="skillgap-header-row">
              <div className="student-page-title-area">
                <h1 className="student-page-title">Skill Gap Assessment</h1>
                <p className="student-page-subtitle">Self-rate each competency. We'll build your strengths, gaps, and a training plan.</p>
              </div>
              <button className="skillgap-reset-btn" onClick={handleResetRatings}>Reset answers</button>
            </div>

            {/* Assessment mini cards */}
            <div className="skillgap-summary-row">
              
              {/* Composite Score */}
              <div className="skillgap-summary-card">
                <div className="label-row">
                  <span className="label">Overall Readiness</span>
                  <span className="dot" style={{ backgroundColor: 'var(--accent-blue)' }}></span>
                </div>
                <h3 className="val">{overallReadiness}%</h3>
                <p className="desc">Composite from self-rating</p>
              </div>

              {/* Strengths count */}
              <div className="skillgap-summary-card">
                <div className="label-row">
                  <span className="label">Strengths</span>
                  <span className="dot" style={{ backgroundColor: 'var(--accent-green)' }}></span>
                </div>
                <h3 className="val">{strengthsCount}</h3>
                <p className="desc">Rated High by student</p>
              </div>

              {/* Gaps count */}
              <div className="skillgap-summary-card">
                <div className="label-row">
                  <span className="label">Gaps to Close</span>
                  <span className="dot" style={{ backgroundColor: 'var(--accent-yellow)' }}></span>
                </div>
                <h3 className="val">{gapsCount}</h3>
                <p className="desc">Rated Low by student</p>
              </div>

              {/* Tracked count */}
              <div className="skillgap-summary-card">
                <div className="label-row">
                  <span className="label">Competencies</span>
                  <span className="dot" style={{ backgroundColor: 'var(--accent-teal)' }}></span>
                </div>
                <h3 className="val">6</h3>
                <p className="desc">Tracked in this assessment</p>
              </div>

            </div>

            {/* Main questionnaire & Radar split grid */}
            <div className="skillgap-body-grid">
              
              {/* Question list */}
              <div className="student-card skillgap-assessment-card">
                <div className="skillgap-rating-header">
                  <h4 className="skillgap-card-title">Rating questions</h4>
                  <span className="skillgap-scale-legend">Scale: Low — Medium — High</span>
                </div>

                {/* 1. Process Map */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">Process Map</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: ratings.processMap === 'high' ? '#d1fae5' : ratings.processMap === 'low' ? '#fee2e2' : '#fef3c7',
                      color: ratings.processMap === 'high' ? '#065f46' : ratings.processMap === 'low' ? '#b91c1c' : '#d97706',
                    }}>{ratings.processMap}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">I can draw an end-to-end process map for an unfamiliar workflow.</span>
                      <div className="skillgap-btn-group">
                        <button className={`skillgap-rate-btn ${ratings.processMap === 'low' ? 'active' : ''}`} onClick={() => handleRate('processMap', 'low')}>Low</button>
                        <button className={`skillgap-rate-btn ${ratings.processMap === 'medium' ? 'active' : ''}`} onClick={() => handleRate('processMap', 'medium')}>Medium</button>
                        <button className={`skillgap-rate-btn ${ratings.processMap === 'high' ? 'active' : ''}`} onClick={() => handleRate('processMap', 'high')}>High</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Safety Risk */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">Safety & Quality Risk Identification</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: ratings.safetyRisk === 'high' ? '#d1fae5' : ratings.safetyRisk === 'low' ? '#fee2e2' : '#fef3c7',
                      color: ratings.safetyRisk === 'high' ? '#065f46' : ratings.safetyRisk === 'low' ? '#b91c1c' : '#d97706',
                    }}>{ratings.safetyRisk}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">I can classify quality and security risks in a system by severity and impact likelihood.</span>
                      <div className="skillgap-btn-group">
                        <button className={`skillgap-rate-btn ${ratings.safetyRisk === 'low' ? 'active' : ''}`} onClick={() => handleRate('safetyRisk', 'low')}>Low</button>
                        <button className={`skillgap-rate-btn ${ratings.safetyRisk === 'medium' ? 'active' : ''}`} onClick={() => handleRate('safetyRisk', 'medium')}>Medium</button>
                        <button className={`skillgap-rate-btn ${ratings.safetyRisk === 'high' ? 'active' : ''}`} onClick={() => handleRate('safetyRisk', 'high')}>High</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. RCA */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">Root Cause Analysis (RCA)</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: ratings.rca === 'high' ? '#d1fae5' : ratings.rca === 'low' ? '#fee2e2' : '#fef3c7',
                      color: ratings.rca === 'high' ? '#065f46' : ratings.rca === 'low' ? '#b91c1c' : '#d97706',
                    }}>{ratings.rca}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">I can run structured 5-Why and fishbone reviews to trace back production incident bugs.</span>
                      <div className="skillgap-btn-group">
                        <button className={`skillgap-rate-btn ${ratings.rca === 'low' ? 'active' : ''}`} onClick={() => handleRate('rca', 'low')}>Low</button>
                        <button className={`skillgap-rate-btn ${ratings.rca === 'medium' ? 'active' : ''}`} onClick={() => handleRate('rca', 'medium')}>Medium</button>
                        <button className={`skillgap-rate-btn ${ratings.rca === 'high' ? 'active' : ''}`} onClick={() => handleRate('rca', 'high')}>High</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Traceability */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">Traceability</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: ratings.traceability === 'high' ? '#d1fae5' : ratings.traceability === 'low' ? '#fee2e2' : '#fef3c7',
                      color: ratings.traceability === 'high' ? '#065f46' : ratings.traceability === 'low' ? '#b91c1c' : '#d97706',
                    }}>{ratings.traceability}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">I keep clean linkage matrices connecting requirements, code commits, and testing.</span>
                      <div className="skillgap-btn-group">
                        <button className={`skillgap-rate-btn ${ratings.traceability === 'low' ? 'active' : ''}`} onClick={() => handleRate('traceability', 'low')}>Low</button>
                        <button className={`skillgap-rate-btn ${ratings.traceability === 'medium' ? 'active' : ''}`} onClick={() => handleRate('traceability', 'medium')}>Medium</button>
                        <button className={`skillgap-rate-btn ${ratings.traceability === 'high' ? 'active' : ''}`} onClick={() => handleRate('traceability', 'high')}>High</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Technical Memo */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">Technical Memo</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: ratings.memo === 'high' ? '#d1fae5' : ratings.memo === 'low' ? '#fee2e2' : '#fef3c7',
                      color: ratings.memo === 'high' ? '#065f46' : ratings.memo === 'low' ? '#b91c1c' : '#d97706',
                    }}>{ratings.memo}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">I can write a structured, data-driven post-mortem or incident report RFC.</span>
                      <div className="skillgap-btn-group">
                        <button className={`skillgap-rate-btn ${ratings.memo === 'low' ? 'active' : ''}`} onClick={() => handleRate('memo', 'low')}>Low</button>
                        <button className={`skillgap-rate-btn ${ratings.memo === 'medium' ? 'active' : ''}`} onClick={() => handleRate('memo', 'medium')}>Medium</button>
                        <button className={`skillgap-rate-btn ${ratings.memo === 'high' ? 'active' : ''}`} onClick={() => handleRate('memo', 'high')}>High</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Responsible AI */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">Responsible AI Usage</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: ratings.responsibleAi === 'high' ? '#d1fae5' : ratings.responsibleAi === 'low' ? '#fee2e2' : '#fef3c7',
                      color: ratings.responsibleAi === 'high' ? '#065f46' : ratings.responsibleAi === 'low' ? '#b91c1c' : '#d97706',
                    }}>{ratings.responsibleAi}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">I audit all generated code outputs and avoid sharing sensitive API environment variables.</span>
                      <div className="skillgap-btn-group">
                        <button className={`skillgap-rate-btn ${ratings.responsibleAi === 'low' ? 'active' : ''}`} onClick={() => handleRate('responsibleAi', 'low')}>Low</button>
                        <button className={`skillgap-rate-btn ${ratings.responsibleAi === 'medium' ? 'active' : ''}`} onClick={() => handleRate('responsibleAi', 'medium')}>Medium</button>
                        <button className={`skillgap-rate-btn ${ratings.responsibleAi === 'high' ? 'active' : ''}`} onClick={() => handleRate('responsibleAi', 'high')}>High</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Visual Radar Card */}
              <div className="student-card skillgap-radar-card">
                <h4 className="skillgap-card-title">Skill-gap radar</h4>
                
                <div className="skillgap-radar-container">
                  <svg viewBox="0 0 300 300" width="100%" height="100%" style={{ overflow: 'visible' }}>
                    
                    {/* Background Grids (Low scale) */}
                    <polygon points="150,115 180,132 180,167 150,185 120,167 120,132" fill="none" stroke="#f1f5f9" strokeWidth="1.5" />
                    {/* Medium Scale Grid */}
                    <polygon points="150,82 208,115 208,183 150,217 91,183 91,115" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
                    {/* High Scale Grid */}
                    <polygon points="150,50 236,100 236,200 150,250 63,200 63,100" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

                    {/* Outer Label Lines */}
                    <line x1="150" y1="150" x2="150" y2="50" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="236" y2="100" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="236" y2="200" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="150" y2="250" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="63" y2="200" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="63" y2="100" stroke="#cbd5e1" strokeDasharray="3 3" />

                    {/* Labels text */}
                    <text x="150" y="38" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">Process</text>
                    <text x="246" y="96" textAnchor="start" fontSize="10" fontWeight="600" fill="#64748b">Safety/Quality</text>
                    <text x="246" y="208" textAnchor="start" fontSize="10" fontWeight="600" fill="#64748b">RCA</text>
                    <text x="150" y="265" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">Traceability</text>
                    <text x="54" y="208" textAnchor="end" fontSize="10" fontWeight="600" fill="#64748b">Tech Memo</text>
                    <text x="54" y="96" textAnchor="end" fontSize="10" fontWeight="600" fill="#64748b">Responsible AI</text>

                    {/* Active dynamic polygon representing student level */}
                    <polygon
                      className="radar-polygon-active"
                      points={calculateRadarPoints()}
                      fill="rgba(20, 184, 166, 0.25)"
                      stroke="var(--accent-teal)"
                      strokeWidth="2.5"
                    />

                  </svg>
                </div>

                <p className="skillgap-radar-legend">Blue/Teal — your current level. Outer borders — target proficiency</p>
              </div>

            </div>

            {/* Strengths & Weaknesses Feedback */}
            <div className="skillgap-bottom-grid">
              
              {/* Strengths list */}
              <div className="student-card skillgap-feedback-card">
                <h4 className="skillgap-feedback-title strengths">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Strengths</span>
                </h4>
                {strengthsCount === 0 ? (
                  <p className="skillgap-feedback-empty">No High ratings yet — keep practicing.</p>
                ) : (
                  <ul className="skillgap-feedback-list">
                    {ratings.processMap === 'high' && <li><strong>Process Map:</strong> Capable of mapping and optimizing workflows.</li>}
                    {ratings.safetyRisk === 'high' && <li><strong>Safety & Risk:</strong> Skilled at isolating critical system threats.</li>}
                    {ratings.rca === 'high' && <li><strong>RCA:</strong> Mastery of incident debug and 5-Why root-cause flows.</li>}
                    {ratings.traceability === 'high' && <li><strong>Traceability:</strong> Rigidly links features, code reviews, and automated builds.</li>}
                    {ratings.memo === 'high' && <li><strong>Technical Memo:</strong> Strong developer-advocacy post-mortem documentation skill.</li>}
                    {ratings.responsibleAi === 'high' && <li><strong>Responsible AI:</strong> Proactively inspects prompts and LLM security constraints.</li>}
                  </ul>
                )}
              </div>

              {/* Weaknesses list */}
              <div className="student-card skillgap-feedback-card">
                <h4 className="skillgap-feedback-title weaknesses">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>Weaknesses</span>
                </h4>
                {gapsCount === 0 ? (
                  <p className="skillgap-feedback-empty">No Low ratings — nice work!</p>
                ) : (
                  <ul className="skillgap-feedback-list">
                    {ratings.processMap === 'low' && <li><strong>Process Map:</strong> Struggle to visualize architecture flows. Recommendation: Workshop: Mapping a production line using SIPOC + swimlane diagrams.</li>}
                    {ratings.safetyRisk === 'low' && <li><strong>Safety & Risk:</strong> Need guidelines to rank vulnerability scores. Recommendation: Module: FMEA + 5-Why for a packaging-line near-miss case.</li>}
                    {ratings.rca === 'low' && <li><strong>RCA:</strong> Easily treat symptoms rather than root bugs. Recommendation: Scenario S-102 — Database pool exhaustion: build the full RCA tree.</li>}
                    {ratings.traceability === 'low' && <li><strong>Traceability:</strong> Lacks clean traceability indexes in test scripts. Recommendation: Lab: Build a traceability matrix linking requirements &rarr; tests &rarr; defects.</li>}
                    {ratings.memo === 'low' && <li><strong>Technical Memo:</strong> Need to clarify writing style for non-tech audiences. Recommendation: Practice: Draft a post-mortem memo for the Checkout API outage.</li>}
                    {ratings.responsibleAi === 'low' && <li><strong>Responsible AI:</strong> Prone to blindly copying third-party chatbot answers. Recommendation: Quiz: Responsible AI checklist + redaction practice on sample prompts.</li>}
                  </ul>
                )}
              </div>

            </div>

            {/* Recommended Training Courses */}
            <div className="student-card skillgap-training-card">
              <h4 className="skillgap-card-title" style={{ marginBottom: '20px' }}>Recommended training</h4>
              
              <div className="skillgap-table-wrapper">
                <table className="skillgap-table">
                  <thead>
                    <tr>
                      <th>Competency</th>
                      <th>Current</th>
                      <th>Priority</th>
                      <th>What to Train Next</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                    <tr>
                      <td className="skillgap-table-competency">Process Map</td>
                      <td><span className={`skillgap-table-level ${ratings.processMap}`}>{ratings.processMap}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.processMap === 'high' ? 'low' : ratings.processMap === 'low' ? 'high' : 'medium'}`}>{ratings.processMap === 'high' ? 'low' : ratings.processMap === 'low' ? 'high' : 'medium'}</span></td>
                      <td>Workshop: Mapping a production line using SIPOC + swimlane diagrams.</td>
                    </tr>

                    <tr>
                      <td className="skillgap-table-competency">Safety & Quality Risk Identification</td>
                      <td><span className={`skillgap-table-level ${ratings.safetyRisk}`}>{ratings.safetyRisk}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.safetyRisk === 'high' ? 'low' : ratings.safetyRisk === 'low' ? 'high' : 'medium'}`}>{ratings.safetyRisk === 'high' ? 'low' : ratings.safetyRisk === 'low' ? 'high' : 'medium'}</span></td>
                      <td>Module: FMEA + 5-Why for a packaging-line near-miss case.</td>
                    </tr>

                    <tr>
                      <td className="skillgap-table-competency">Root Cause Analysis (RCA)</td>
                      <td><span className={`skillgap-table-level ${ratings.rca}`}>{ratings.rca}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.rca === 'high' ? 'low' : ratings.rca === 'low' ? 'high' : 'medium'}`}>{ratings.rca === 'high' ? 'low' : ratings.rca === 'low' ? 'high' : 'medium'}</span></td>
                      <td>Scenario S-102 — Database pool exhaustion: build the full RCA tree.</td>
                    </tr>

                    <tr>
                      <td className="skillgap-table-competency">Traceability</td>
                      <td><span className={`skillgap-table-level ${ratings.traceability}`}>{ratings.traceability}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.traceability === 'high' ? 'low' : ratings.traceability === 'low' ? 'high' : 'medium'}`}>{ratings.traceability === 'high' ? 'low' : ratings.traceability === 'low' ? 'high' : 'medium'}</span></td>
                      <td>Lab: Build a traceability matrix linking requirements &rarr; tests &rarr; defects.</td>
                    </tr>

                    <tr>
                      <td className="skillgap-table-competency">Technical Memo</td>
                      <td><span className={`skillgap-table-level ${ratings.memo}`}>{ratings.memo}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.memo === 'high' ? 'low' : ratings.memo === 'low' ? 'high' : 'medium'}`}>{ratings.memo === 'high' ? 'low' : ratings.memo === 'low' ? 'high' : 'medium'}</span></td>
                      <td>Practice: Draft a post-mortem memo for the Checkout API outage.</td>
                    </tr>

                    <tr>
                      <td className="skillgap-table-competency">Responsible AI Usage</td>
                      <td><span className={`skillgap-table-level ${ratings.responsibleAi}`}>{ratings.responsibleAi}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.responsibleAi === 'high' ? 'low' : ratings.responsibleAi === 'low' ? 'high' : 'medium'}`}>{ratings.responsibleAi === 'high' ? 'low' : ratings.responsibleAi === 'low' ? 'high' : 'medium'}</span></td>
                      <td>Quiz: Responsible AI checklist + redaction practice on sample prompts.</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

          </div>
  );
}
