import React from 'react';

export default function StudentDashboard({ firstName, initials, fullName, targetTrack, major, educationLevel, occupationGoal, targetIndustry, setActiveTab, scenarios, handleOpenScenario, overallReadiness, ratings, aiRatings }) {
  
  const skillMapping = {
    processMap: { title: 'System Design', weight: '25%' },
    safetyRisk: { title: 'Cloud & DevOps (AWS/Docker)', weight: '20%' },
    rca: { title: 'Git & Code Review', weight: '15%' },
    traceability: { title: 'Data Structures & Algorithms', weight: '20%' },
    memo: { title: 'Secure Coding (OWASP)', weight: '15%' },
    responsibleAi: { title: 'Technical Writing', weight: '5%' }
  };

  const assessmentMapping = {
    processMap: 'Process Map',
    safetyRisk: 'Safety & Quality Risk Identification',
    rca: 'Root Cause Analysis (RCA)',
    traceability: 'Traceability',
    memo: 'Technical Memo',
    responsibleAi: 'Responsible AI Usage'
  };

  const getScore = (val) => val === 'high' ? 100 : val === 'medium' ? 50 : val === 'low' ? 10 : 0;
  const getColor = (score) => score >= 80 ? 'green' : score >= 50 ? 'blue' : 'orange';

  const mappedSkills = aiRatings && Object.keys(aiRatings).length > 0 ? Object.keys(skillMapping).map(key => {
    const score = getScore(aiRatings[key]);
    return { key, name: skillMapping[key].title, weight: skillMapping[key].weight, score: score, color: getColor(score) };
  }) : Object.keys(skillMapping).map(key => ({
    key, name: skillMapping[key].title, weight: skillMapping[key].weight, score: 0, color: 'orange'
  }));

  const assessmentSkills = ratings && Object.keys(ratings).length > 0 ? Object.keys(assessmentMapping).map(key => {
    const score = getScore(ratings[key]);
    return { key, name: assessmentMapping[key], score: score, color: getColor(score) };
  }) : Object.keys(assessmentMapping).map(key => ({
    key, name: assessmentMapping[key], score: 0, color: 'orange'
  }));

  const sortedSkills = [...assessmentSkills].sort((a, b) => a.score - b.score);
  const topGaps = sortedSkills.slice(0, 4);
  const biggestGap = [...mappedSkills].sort((a, b) => a.score - b.score)[0]?.name || '-';
  const displayReadiness = overallReadiness || 0;

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
                    <p className="student-sublink-subtitle">{displayReadiness}/100 against {targetTrack || 'your track'}</p>
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
                <h3 className="student-stat-value">{displayReadiness}/100</h3>
                <p className="student-stat-comparison">vs {targetTrack || 'your track'}</p>
              </div>

              {/* Card 2: Scenarios Completed */}
              <div className="student-stat-card">
                <div className="student-stat-label-row">
                  <span className="student-stat-label">SCENARIOS COMPLETED</span>
                  <span className="student-stat-dot teal"></span>
                </div>
                <h3 className="student-stat-value">-</h3>
                <p className="student-stat-comparison">-</p>
              </div>

              {/* Card 3: RCA Coach Rating */}
              <div className="student-stat-card">
                <div className="student-stat-label-row">
                  <span className="student-stat-label">RCA COACH RATING</span>
                  <span className="student-stat-dot green"></span>
                </div>
                <h3 className="student-stat-value">-</h3>
                <p className="student-stat-comparison">-</p>
              </div>

              {/* Card 4: Streak */}
              <div className="student-stat-card">
                <div className="student-stat-label-row">
                  <span className="student-stat-label">STREAK</span>
                  <span className="student-stat-dot orange"></span>
                </div>
                <h3 className="student-stat-value">-</h3>
                <p className="student-stat-comparison">-</p>
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
                  <div className="score-main">{displayReadiness}<span className="score-max">/100</span></div>
                  <div className="score-gap-label">Biggest gap: <span className="highlight-gap">{biggestGap}</span></div>
                </div>
              </div>
              
              <div className="breakdown-skills-grid">
                {/* Left Column */}
                <div className="skills-col">
                  {mappedSkills.slice(0, 3).map(skill => (
                    <div className="skill-progress-item" key={skill.key}>
                      <div className="skill-info-row">
                        <span className="skill-name">{skill.name} <span className="skill-weight">· w {skill.weight}</span></span>
                        <span className="skill-score-details">{skill.score}/100</span>
                      </div>
                      <div className="skill-bar-outer">
                        <div className={`skill-bar-inner ${skill.color}`} style={{ width: `${skill.score}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column */}
                <div className="skills-col">
                  {mappedSkills.slice(3, 6).map(skill => (
                    <div className="skill-progress-item" key={skill.key}>
                      <div className="skill-info-row">
                        <span className="skill-name">{skill.name} <span className="skill-weight">· w {skill.weight}</span></span>
                        <span className="skill-score-details">{skill.score}/100</span>
                      </div>
                      <div className="skill-bar-outer">
                        <div className={`skill-bar-inner ${skill.color}`} style={{ width: `${skill.score}%` }}></div>
                      </div>
                    </div>
                  ))}
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
                  {topGaps.map((gap, index) => (
                    <div className="gap-item" key={index}>
                      <div className="gap-info">
                        <span className="gap-name">{gap.name}</span>
                        <span className="gap-score">{gap.score}/100</span>
                      </div>
                      <div className="gap-bar-outer">
                        <div className={`gap-bar-inner ${gap.color}`} style={{ width: `${gap.score}%` }}></div>
                      </div>
                    </div>
                  ))}
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
