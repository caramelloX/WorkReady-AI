import React from 'react';

export default function StudentDashboard({ firstName, initials, fullName, targetTrack, major, educationLevel, occupationGoal, targetIndustry, setActiveTab, scenarios, handleOpenScenario }) {
  return (
    <div className="student-tab-panel dashboard-container-updated">
            
            {/* Greeting Header Row */}
            <div className="student-dashboard-header">
              <div className="student-dashboard-header-text">
                <h1>Welcome back, {firstName}</h1>
                <p>Here's where you stand today, and what to tackle next.</p>
              </div>
              <button className="continue-training-btn" onClick={() => setActiveTab('simulator')}>
                <span>Continue training</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Student ID Profile Card */}
            <div className="student-profile-overview-card">
              <div className="student-profile-overview-header">
                <div className="student-profile-overview-avatar">{initials}</div>
                <div className="student-profile-overview-meta">
                  <h2>
                    {fullName}
                    <span className="student-cohort-pill">· Cohort 2026 — {targetTrack} Track</span>
                  </h2>
                </div>
              </div>
              
              <div className="student-info-columns-grid">
                {/* Major Column */}
                <div className="student-info-column">
                  <span className="student-info-column-label">MAJOR</span>
                  <div className="student-info-column-content-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-info-column-icon">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                    </svg>
                    <div className="student-info-column-details">
                      <h4 className="student-info-column-title">{major}</h4>
                      <p className="student-info-column-subtitle">{educationLevel}</p>
                    </div>
                  </div>
                </div>

                {/* Occupation Goal Column */}
                <div className="student-info-column">
                  <span className="student-info-column-label">OCCUPATION GOAL</span>
                  <div className="student-info-column-content-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-info-column-icon">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <div className="student-info-column-details">
                      <h4 className="student-info-column-title">{occupationGoal}</h4>
                      <p className="student-info-column-subtitle">Targeting {targetIndustry}</p>
                    </div>
                  </div>
                </div>

                {/* Goals Column */}
                <div className="student-info-column">
                  <span className="student-info-column-label">GOALS</span>
                  <div className="student-info-column-content-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-info-column-icon orange">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                    <div className="student-info-column-details">
                      <ul className="student-goals-bullet-list">
                        <li>Reach Work-Ready Score 85</li>
                        <li>Ship 3 mentor-reviewed memos</li>
                        <li>Land summer internship</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick-Link Shortcut Cards */}
            <div className="student-sublinks-grid">
              <div className="student-sublink-card" onClick={() => setActiveTab('portfolio')}>
                <div className="student-sublink-card-left">
                  <div className="student-sublink-icon-wrapper blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div className="student-sublink-info">
                    <h4 className="student-sublink-title">View Portfolio</h4>
                    <p className="student-sublink-subtitle">9 mentor-reviewed evidence items</p>
                  </div>
                </div>
                <svg className="student-sublink-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              <div className="student-sublink-card" onClick={() => setActiveTab('portfolio')}>
                <div className="student-sublink-card-left">
                  <div className="student-sublink-icon-wrapper teal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div className="student-sublink-info">
                    <h4 className="student-sublink-title">View Feedback</h4>
                    <p className="student-sublink-subtitle">Mentor + AI coach notes on your work</p>
                  </div>
                </div>
                <svg className="student-sublink-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              <div className="student-sublink-card" onClick={() => {
                const element = document.querySelector('.dashboard-breakdown-card');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                <div className="student-sublink-card-left">
                  <div className="student-sublink-icon-wrapper orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      <polyline points="12 12 16 8" />
                    </svg>
                  </div>
                  <div className="student-sublink-info">
                    <h4 className="student-sublink-title">Check Readiness Score</h4>
                    <p className="student-sublink-subtitle">74/100 against Backend Software Engineer</p>
                  </div>
                </div>
                <svg className="student-sublink-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>

            {/* Stats Metrics Cards Grid */}
            <div className="student-stats-grid">
              {/* Card 1: Work-Ready Score */}
              <div className="student-stat-card">
                <div className="student-stat-label-row">
                  <span className="student-stat-label">WORK-READY SCORE</span>
                  <span className="student-stat-dot blue"></span>
                </div>
                <h3 className="student-stat-value">74/100</h3>
                <p className="student-stat-comparison">vs Backend Software Engineer</p>
              </div>

              {/* Card 2: Scenarios Completed */}
              <div className="student-stat-card">
                <div className="student-stat-label-row">
                  <span className="student-stat-label">SCENARIOS COMPLETED</span>
                  <span className="student-stat-dot teal"></span>
                </div>
                <h3 className="student-stat-value">14/24</h3>
                <p className="student-stat-comparison">58% of cohort</p>
              </div>

              {/* Card 3: RCA Coach Rating */}
              <div className="student-stat-card">
                <div className="student-stat-label-row">
                  <span className="student-stat-label">RCA COACH RATING</span>
                  <span className="student-stat-dot green"></span>
                </div>
                <h3 className="student-stat-value">4.2</h3>
                <p className="student-stat-comparison">Across 11 sessions</p>
              </div>

              {/* Card 4: Streak */}
              <div className="student-stat-card">
                <div className="student-stat-label-row">
                  <span className="student-stat-label">STREAK</span>
                  <span className="student-stat-dot orange"></span>
                </div>
                <h3 className="student-stat-value">18 days</h3>
                <p className="student-stat-comparison">Personal best</p>
              </div>
            </div>

            {/* 1. Work-Ready Score Breakdown Card */}
            <div className="dashboard-breakdown-card">
              <div className="breakdown-header">
                <div className="breakdown-title-area">
                  <span className="breakdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="icon-globe">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      <path d="M2 12h20" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="breakdown-card-title">Work-Ready Score breakdown</h3>
                    <p className="breakdown-card-subtitle">Weighted coverage of skills required for Backend Software Engineer against your current levels.</p>
                  </div>
                </div>
                
                <div className="breakdown-score-badge">
                  <div className="score-main">74<span className="score-max">/100</span></div>
                  <div className="score-gap-label">Biggest gap: <span className="highlight-gap">Cloud & DevOps (AWS/Docker)</span></div>
                </div>
              </div>
              
              <div className="breakdown-skills-grid">
                {/* Left Column */}
                <div className="skills-col">
                  {/* Skill 1 */}
                  <div className="skill-progress-item">
                    <div className="skill-info-row">
                      <span className="skill-name">System Design <span className="skill-weight">· w 25%</span></span>
                      <span className="skill-score-details">42/75 <span className="skill-diff">+14.0</span></span>
                    </div>
                    <div className="skill-bar-outer">
                      <div className="skill-bar-inner orange" style={{ width: '56%' }}></div>
                    </div>
                  </div>

                  {/* Skill 2 */}
                  <div className="skill-progress-item">
                    <div className="skill-info-row">
                      <span className="skill-name">Cloud & DevOps (AWS/Docker) <span className="skill-weight">· w 20%</span></span>
                      <span className="skill-score-details">38/70 <span className="skill-diff">+10.9</span></span>
                    </div>
                    <div className="skill-bar-outer">
                      <div className="skill-bar-inner orange" style={{ width: '54%' }}></div>
                    </div>
                  </div>

                  {/* Skill 3 */}
                  <div className="skill-progress-item">
                    <div className="skill-info-row">
                      <span className="skill-name">Git & Code Review <span className="skill-weight">· w 15%</span></span>
                      <span className="skill-score-details">65/80 <span className="skill-diff">+12.2</span></span>
                    </div>
                    <div className="skill-bar-outer">
                      <div className="skill-bar-inner blue" style={{ width: '81%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="skills-col">
                  {/* Skill 4 */}
                  <div className="skill-progress-item">
                    <div className="skill-info-row">
                      <span className="skill-name">Data Structures & Algorithms <span className="skill-weight">· w 20%</span></span>
                      <span className="skill-score-details">78/90 <span className="skill-diff">+17.3</span></span>
                    </div>
                    <div className="skill-bar-outer">
                      <div className="skill-bar-inner green" style={{ width: '86%' }}></div>
                    </div>
                  </div>

                  {/* Skill 5 */}
                  <div className="skill-progress-item">
                    <div className="skill-info-row">
                      <span className="skill-name">Secure Coding (OWASP) <span className="skill-weight">· w 15%</span></span>
                      <span className="skill-score-details">88/90 <span className="skill-diff">+14.7</span></span>
                    </div>
                    <div className="skill-bar-outer">
                      <div className="skill-bar-inner green" style={{ width: '97%' }}></div>
                    </div>
                  </div>

                  {/* Skill 6 */}
                  <div className="skill-progress-item">
                    <div className="skill-info-row">
                      <span className="skill-name">Technical Writing <span className="skill-weight">· w 5%</span></span>
                      <span className="skill-score-details">81/85 <span className="skill-diff">+4.8</span></span>
                    </div>
                    <div className="skill-bar-outer">
                      <div className="skill-bar-inner green" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="breakdown-footer">
                Score = &Sigma; (skill coverage &times; occupation weight). Coverage is capped at the role's target per skill.
              </div>
            </div>

            {/* 2. Middle Row: Upcoming Scenarios (65%) & Top Skill Gaps (35%) */}
            <div className="dashboard-middle-row">
              
              {/* Left Panel: Upcoming Scenarios */}
              <div className="dashboard-card scenarios-panel">
                <div className="panel-header">
                  <h3 className="panel-title">Upcoming scenarios</h3>
                  <button className="panel-link-btn" onClick={() => setActiveTab('simulator')}>View all</button>
                </div>
                
                <div className="scenarios-list">
                  {scenarios.slice(0, 3).map((sc) => (
                    <div className="scenario-row-item" key={sc.id}>
                      <div className="scenario-left-info">
                        <div className="scenario-badge-row">
                          <span className="sc-code-badge">{sc.id}</span>
                          <span className={`sc-status-pill ${sc.difficulty === 'In progress' ? 'in-progress' : 'available'}`}>
                            {sc.difficulty}
                          </span>
                        </div>
                        <h4 className="sc-title-text" onClick={() => handleOpenScenario(sc.id)}>
                          {sc.title}
                        </h4>
                        <p className="sc-meta-text">{sc.desc}</p>
                      </div>
                      <button className="sc-open-link" onClick={() => handleOpenScenario(sc.id)}>
                        <span>Open</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Panel: Top Skill Gaps */}
              <div className="dashboard-card skillgaps-panel">
                <div className="panel-header">
                  <h3 className="panel-title">Top skill gaps</h3>
                </div>
                
                <div className="skillgaps-list">
                  {/* Gap 1 */}
                  <div className="gap-item">
                    <div className="gap-info">
                      <span className="gap-name">Data Structures & Algorithms</span>
                      <span className="gap-score">78/90</span>
                    </div>
                    <div className="gap-bar-outer">
                      <div className="gap-bar-inner green" style={{ width: '86%' }}></div>
                    </div>
                  </div>

                  {/* Gap 2 */}
                  <div className="gap-item">
                    <div className="gap-info">
                      <span className="gap-name">System Design</span>
                      <span className="gap-score">42/75</span>
                    </div>
                    <div className="gap-bar-outer">
                      <div className="gap-bar-inner orange" style={{ width: '56%' }}></div>
                    </div>
                  </div>

                  {/* Gap 3 */}
                  <div className="gap-item">
                    <div className="gap-info">
                      <span className="gap-name">Git & Code Review</span>
                      <span className="gap-score">65/80</span>
                    </div>
                    <div className="gap-bar-outer">
                      <div className="gap-bar-inner blue" style={{ width: '81%' }}></div>
                    </div>
                  </div>

                  {/* Gap 4 */}
                  <div className="gap-item">
                    <div className="gap-info">
                      <span className="gap-name">Technical Writing</span>
                      <span className="gap-score">81/85</span>
                    </div>
                    <div className="gap-bar-outer">
                      <div className="gap-bar-inner green" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>

                <button className="gaps-assessment-link" onClick={() => setActiveTab('skillgap')}>
                  <span>Full assessment</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>

            </div>

            {/* 3. Bottom Row: Three Columns */}
            <div className="dashboard-bottom-row">
              
              {/* Badges Earned */}
              <div className="dashboard-card bottom-card">
                <div className="bottom-card-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="bottom-card-icon badge-icon">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                  <h4 className="bottom-card-title">Badges earned</h4>
                </div>
                <div className="badges-pills-row">
                  <span className="badge-pill">Clean Coder</span>
                  <span className="badge-pill">Incident Responder</span>
                  <span className="badge-pill">Code Reviewer</span>
                  <span className="badge-pill">System Designer</span>
                </div>
              </div>

              {/* This Week */}
              <div className="dashboard-card bottom-card">
                <div className="bottom-card-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="bottom-card-icon week-icon">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <h4 className="bottom-card-title">This week</h4>
                </div>
                <p className="bottom-card-text font-accent-dark">
                  3 scenarios, 2 RCA reviews, 1 memo drafted.
                </p>
              </div>

              {/* Next Mentor Sync */}
              <div className="dashboard-card bottom-card">
                <div className="bottom-card-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="bottom-card-icon sync-icon">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <h4 className="bottom-card-title">Next mentor sync</h4>
                </div>
                <p className="bottom-card-text">
                  Fri, 12:30 PM with M. Iyer (Staff Engineer, Razorpay).
                </p>
              </div>

            </div>

          </div>
  );
}
