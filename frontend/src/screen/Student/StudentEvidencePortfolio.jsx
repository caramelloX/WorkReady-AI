import React from 'react';

export default function StudentEvidencePortfolio({ portfolioItems, handleSubmitPortfolio, onNavigate }) {
  return (
    <div className="student-tab-panel portfolio-tab-panel-updated">
            
            {/* Header Row */}
            <div className="student-page-header portfolio-header-row">
              <div className="student-page-title-area">
                <h1 className="student-page-title">Evidence Portfolio</h1>
                <p className="student-page-subtitle">Every solved scenario becomes verified proof recruiters and mentors can trust.</p>
              </div>
              <button className="portfolio-share-btn-new" onClick={() => alert('Recruiter access link copied to clipboard!')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="portfolio-share-icon" width="16" height="16">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                <span>Share portfolio</span>
              </button>
            </div>

            {/* KPI Cards Row */}
            <div className="portfolio-stats-container">
              <div className="portfolio-stat-card">
                <div className="portfolio-stat-dot blue"></div>
                <span className="portfolio-stat-label">ARTIFACTS</span>
                <h3 className="portfolio-stat-value">5</h3>
                <p className="portfolio-stat-subtext">3 completed</p>
              </div>

              <div className="portfolio-stat-card">
                <div className="portfolio-stat-dot teal"></div>
                <span className="portfolio-stat-label">TOTAL POINTS</span>
                <h3 className="portfolio-stat-value">380/500</h3>
                <p className="portfolio-stat-subtext">Across all evidence</p>
              </div>

              <div className="portfolio-stat-card">
                <div className="portfolio-stat-dot green"></div>
                <span className="portfolio-stat-label">MENTOR REVIEWS</span>
                <h3 className="portfolio-stat-value">2</h3>
                <p className="portfolio-stat-subtext">Last 30 days</p>
              </div>

              <div className="portfolio-stat-card">
                <div className="portfolio-stat-dot yellow"></div>
                <span className="portfolio-stat-label">READINESS</span>
                <h3 className="portfolio-stat-value">76%</h3>
                <p className="portfolio-stat-subtext">Job-ready score</p>
              </div>
            </div>

            {/* Two-Column Grid */}
            <div className="portfolio-layout-grid">
              
              {/* Left Column: Evidence List */}
              <div className="portfolio-left-column">
                <div className="student-card portfolio-evidence-list-card">
                  <div className="portfolio-card-header">
                    <h3 className="portfolio-card-title">Evidence list</h3>
                    <p className="portfolio-card-subtitle">All artifacts collected through scenarios and coaching.</p>
                  </div>
                  <div className="portfolio-evidence-items">
                    {portfolioItems.map(item => {
                      const getIcon = (topic) => {
                        if (topic === 'blue') return (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                            <line x1="9" y1="3" x2="9" y2="18" />
                            <line x1="15" y1="6" x2="15" y2="21" />
                          </svg>
                        );
                        if (topic === 'green') return (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <polyline points="9 11 11 13 15 9" />
                          </svg>
                        );
                        if (topic === 'yellow') return (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                        );
                        if (topic === 'orange') return (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                        );
                        return (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                            <rect x="4" y="4" width="16" height="16" rx="2" />
                            <rect x="9" y="9" width="6" height="6" />
                            <line x1="9" y1="1" x2="9" y2="4" />
                            <line x1="15" y1="1" x2="15" y2="4" />
                            <line x1="9" y1="20" x2="9" y2="23" />
                            <line x1="15" y1="20" x2="15" y2="23" />
                            <line x1="20" y1="9" x2="23" y2="9" />
                            <line x1="20" y1="15" x2="23" y2="15" />
                            <line x1="1" y1="9" x2="4" y2="9" />
                            <line x1="1" y1="15" x2="4" y2="15" />
                          </svg>
                        );
                      };

                      const badgeClass = item.status === 'Completed' ? 'completed' 
                        : item.status === 'Needs review' ? 'needs-review' 
                        : 'needs-revision';
                      
                      const scoreVal = item.score ? item.score.split('/')[0] : 0;
                      let barColor = 'green';
                      if (scoreVal < 60) barColor = 'orange';
                      else if (scoreVal < 80) barColor = 'blue';

                      return (
                        <div className="portfolio-evidence-item" key={item.id}>
                          <div className="portfolio-evidence-item-left">
                            <div className={`portfolio-icon-wrapper ${item.topic}`}>
                              {getIcon(item.topic)}
                            </div>
                            <div className="portfolio-evidence-item-details">
                              <span className="portfolio-evidence-item-code">{item.id}</span>
                              <span className="portfolio-evidence-item-name">{item.title}</span>
                            </div>
                          </div>
                          <div className="portfolio-evidence-item-right">
                            <span className={`portfolio-evidence-badge ${badgeClass}`}>{item.status}</span>
                            <div className="portfolio-evidence-progress-section">
                              <span className="portfolio-evidence-score">{item.score}</span>
                              <div className="portfolio-evidence-progress-bar-container">
                                <div className={`portfolio-evidence-progress-bar-fill ${barColor}`} style={{ width: `${scoreVal}%` }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Readiness Score & Submit Card */}
              <div className="portfolio-right-column">
                
                {/* Readiness Score Card */}
                <div className="student-card portfolio-readiness-card">
                  <span className="portfolio-card-mini-label">READINESS SCORE</span>
                  <div className="portfolio-readiness-score-display">
                    <h2 className="portfolio-readiness-score-number">76</h2>
                    <span className="portfolio-readiness-score-denom">/ 100</span>
                  </div>
                  <p className="portfolio-readiness-desc">
                    Weighted competency index showing your target match against standard backend junior roles.
                  </p>
                  
                  <div className="portfolio-readiness-bar">
                    <div className="portfolio-progress-fill" style={{ width: '76%' }}></div>
                  </div>

                  <div className="portfolio-metrics-list">
                    <div className="portfolio-metric-row">
                      <span className="portfolio-metric-name">Completed</span>
                      <span className="portfolio-metric-value">3 / 5</span>
                    </div>
                    <div className="portfolio-metric-row">
                      <span className="portfolio-metric-name">Needs review</span>
                      <span className="portfolio-metric-value text-blue">1</span>
                    </div>
                    <div className="portfolio-metric-row">
                      <span className="portfolio-metric-name">Needs revision</span>
                      <span className="portfolio-metric-value text-orange">1</span>
                    </div>
                  </div>
                </div>

                {/* Submit for Review Card */}
                <div className="student-card portfolio-submit-card">
                  <h4 className="portfolio-submit-title">Submit for review</h4>
                  <p className="portfolio-submit-desc">
                    Send your completed evidence portfolio to your course mentor for final assessment.
                  </p>
                  <button className="portfolio-submit-btn" onClick={handleSubmitPortfolio}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                    <span>Submit portfolio</span>
                  </button>
                  <span className="portfolio-submit-notification">
                    You'll be notified when reviews are completed.
                  </span>
                </div>

              </div>

            </div>

            {/* Mentor Feedback Section */}
            <div className="portfolio-mentor-feedback-section">
              <div className="portfolio-section-header">
                <h2 className="portfolio-section-title">Mentor Feedback</h2>
                <p className="portfolio-section-subtitle">Feedback and comments from industry mentors on your submitted evidence.</p>
              </div>

              <div className="portfolio-mentor-feedback-list">
                {portfolioItems.map((item) => (
                  <div className="portfolio-feedback-item-card" key={item.id}>
                    <div className="portfolio-feedback-header">
                      <div className="portfolio-feedback-meta-left">
                        <span className="portfolio-feedback-id">{item.id}</span>
                        <span className="portfolio-feedback-scenario">Solved Scenario {item.scenarioId}</span>
                        <span className="portfolio-feedback-topic">· {item.topic}</span>
                      </div>
                      <div className="portfolio-feedback-score">{item.score} Score</div>
                    </div>
                    <h3 className="portfolio-feedback-title">{item.title}</h3>
                    <p className="portfolio-feedback-desc">{item.desc}</p>
                    
                    <div className="portfolio-feedback-body">
                      <div className="portfolio-feedback-quote-icon">“</div>
                      <div className="portfolio-feedback-text-content">
                        <p className="portfolio-feedback-text">
                          {item.mentor}
                        </p>
                        <span className="portfolio-feedback-author">— {item.mentorName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Back Navigation Row */}
            <div className="portfolio-navigation-row">
              <button className="portfolio-app-link-btn" onClick={() => onNavigate('landing')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                <span>Return to App Dashboard</span>
              </button>
            </div>

          </div>
  );
}
