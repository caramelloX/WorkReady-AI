import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { getReadinessLevel } from '../../utils/readiness.js';

export default function StudentDashboard({ avatarBase64, firstName, initials, fullName, targetTrack, major, educationLevel, occupationGoal, targetIndustry, setActiveTab, scenarios, handleOpenScenario, overallReadiness, ratings, aiRatings, assignedMentor, recommendedResult, suggestedMentorResult, onStartScenario, onViewSkillGapResult }) {
  const { t } = useLanguage();
  
  const skillMapping = {
    processMap: { title: t('skills.processMap'), weight: '25%' },
    safetyRisk: { title: t('skills.safetyRisk'), weight: '20%' },
    rca: { title: t('skills.rca'), weight: '15%' },
    traceability: { title: t('skills.traceability'), weight: '20%' },
    memo: { title: t('skills.memo'), weight: '15%' },
    responsibleAi: { title: t('skills.responsibleAi'), weight: '5%' }
  };

  const assessmentMapping = {
    processMap: t('skills.processMapAss'),
    safetyRisk: t('skills.safetyRiskAss'),
    rca: t('skills.rcaAss'),
    traceability: t('skills.traceabilityAss'),
    memo: t('skills.memoAss'),
    responsibleAi: t('skills.responsibleAiAss')
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
  const readinessInfo = getReadinessLevel(displayReadiness);

  return (
    <div className="student-tab-panel dashboard-container-updated">
            
            {/* Greeting Header Row */}
            <div className="student-dashboard-header">
              <div className="student-dashboard-header-text">
                <h1>{t('dashboard.welcome')}, {firstName}</h1>
                <p>{t('dashboard.subtitle')}</p>
              </div>
              <button className="continue-training-btn" onClick={() => setActiveTab('simulator')}>
                <span>{t('dashboard.continueTraining')}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Student ID Profile Card */}
            <div className="student-profile-overview-card">
              <div className="student-profile-overview-header">
                {avatarBase64 ? (
                  <img src={avatarBase64} alt="Avatar" className="student-profile-overview-avatar" style={{ objectFit: 'cover' }} />
                ) : (
                  <div className="student-profile-overview-avatar">{initials}</div>
                )}
                <div className="student-profile-overview-meta">
                  <h2>
                    {fullName}
                    <span className="student-cohort-pill">· {t('dashboard.cohortPrefix')}{targetTrack}{t('dashboard.cohortSuffix')}</span>
                  </h2>
                </div>
              </div>
              
              <div className="student-info-columns-grid">
                {/* Major Column */}
                <div className="student-info-column">
                  <span className="student-info-column-label">{t('dashboard.major')}</span>
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
                  <span className="student-info-column-label">{t('dashboard.occupationGoal')}</span>
                  <div className="student-info-column-content-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-info-column-icon">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <div className="student-info-column-details">
                      <h4 className="student-info-column-title">{occupationGoal}</h4>
                      <p className="student-info-column-subtitle">{t('dashboard.targeting')}{targetIndustry}</p>
                    </div>
                  </div>
                </div>

                {/* Goals Column */}
                <div className="student-info-column">
                  <span className="student-info-column-label">{t('dashboard.goals')}</span>
                  <div className="student-info-column-content-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-info-column-icon orange">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                    <div className="student-info-column-details">
                      <ul className="student-goals-bullet-list">
                        <li>{t('dashboard.goal1')}</li>
                        <li>{t('dashboard.goal2')}</li>
                        <li>{t('dashboard.goal3')}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {/* Readiness Level + Mentor Card Row */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>

              {/* Readiness Level Badge */}
              <div style={{
                flex: '1', minWidth: '200px', padding: '16px 20px',
                background: readinessInfo.bg, border: `1.5px solid ${readinessInfo.color}30`,
                borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '14px'
              }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  background: readinessInfo.color, color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', fontWeight: '800', flexShrink: 0
                }}>
                  {displayReadiness}
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: readinessInfo.color, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>Readiness Level</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>{readinessInfo.level}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>out of 100</div>
                </div>
              </div>

              {/* Assigned Mentor Card */}
              {assignedMentor ? (
                <div style={{
                  flex: '2', minWidth: '280px', padding: '16px 20px',
                  background: 'white', border: '1.5px solid #E2E8F0',
                  borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '14px'
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '50%',
                    background: '#2563EB', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', fontWeight: '700', flexShrink: 0
                  }}>
                    {(assignedMentor.fullname || assignedMentor.name || 'M').split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>Assigned Mentor</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>{assignedMentor.fullname || assignedMentor.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>{assignedMentor.jobTitle || assignedMentor.expertise || 'Mentor'}</div>
                  </div>
                  <button
                    onClick={() => setActiveTab('chat')}
                    style={{
                      padding: '8px 14px', borderRadius: '8px', border: 'none',
                      background: '#EFF6FF', color: '#2563EB', fontWeight: '600',
                      fontSize: '12px', cursor: 'pointer', flexShrink: 0
                    }}
                  >
                    Message
                  </button>
                </div>
              ) : (
                <div style={{
                  flex: '2', minWidth: '280px', padding: '16px 20px',
                  background: '#F8FAFC', border: '1.5px dashed #CBD5E1',
                  borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '14px', color: '#94A3B8'
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" style={{ flexShrink: 0 }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
                  </svg>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: '#64748B' }}>No mentor assigned yet</div>
                    <div style={{ fontSize: '12px' }}>An admin will match you with a mentor based on your track and skill gaps.</div>
                  </div>
                </div>
              )}
            </div>

            {/* Recommended Scenario Row */}
            {recommendedResult && recommendedResult.scenario && (
              <div style={{
                display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap',
                padding: '16px 20px', background: '#EFF6FF',
                border: '1.5px solid #BFDBFE', borderRadius: '14px', alignItems: 'center'
              }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '10px',
                  background: '#2563EB', color: 'white',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
                    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>
                    Recommended Scenario · {recommendedResult.score}% match
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A', marginBottom: '3px' }}>
                    {recommendedResult.scenario.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#3B82F6' }}>
                    Trains: {recommendedResult.scenario.mainSkillCode?.replace(/_/g, ' ')} · {recommendedResult.scenario.difficulty} · {recommendedResult.scenario.estimatedTime}
                  </div>
                </div>
                {suggestedMentorResult && suggestedMentorResult.mentor && (
                  <div style={{ fontSize: '12px', color: '#475569', textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: '600' }}>Suggested Mentor</div>
                    <div>{suggestedMentorResult.mentor.fullname}</div>
                    <div style={{ color: '#94A3B8' }}>{suggestedMentorResult.matchScore}% fit</div>
                  </div>
                )}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => onStartScenario?.(recommendedResult.scenario)}
                    style={{
                      padding: '8px 14px', borderRadius: '8px', border: 'none',
                      background: '#2563EB', color: 'white', fontWeight: '700',
                      fontSize: '12px', cursor: 'pointer'
                    }}
                  >
                    Start
                  </button>
                  <button
                    onClick={() => onViewSkillGapResult?.()}
                    style={{
                      padding: '8px 14px', borderRadius: '8px',
                      border: '1px solid #BFDBFE', background: 'white',
                      color: '#2563EB', fontWeight: '600', fontSize: '12px', cursor: 'pointer'
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            )}

            {/* Stats Metrics Cards Grid */}
            <div className="student-stats-grid">
              {/* Card 1: Work-Ready Score */}
              <div className="student-stat-card">
                <div className="student-stat-label-row">
                  <span className="student-stat-label">{t('dashboard.workReadyScore')}</span>
                  <span className="student-stat-dot blue"></span>
                </div>
                <h3 className="student-stat-value">{displayReadiness}/100</h3>
                <p className="student-stat-comparison">{t('dashboard.vsTrack')}{targetTrack || t('dashboard.yourTrack')}</p>
              </div>

              {/* Card 2: Scenarios Completed */}
              <div className="student-stat-card">
                <div className="student-stat-label-row">
                  <span className="student-stat-label">{t('dashboard.scenariosCompleted')}</span>
                  <span className="student-stat-dot teal"></span>
                </div>
                <h3 className="student-stat-value">-</h3>
                <p className="student-stat-comparison">-</p>
              </div>

              {/* Card 3: RCA Coach Rating */}
              <div className="student-stat-card">
                <div className="student-stat-label-row">
                  <span className="student-stat-label">{t('dashboard.rcaRating')}</span>
                  <span className="student-stat-dot green"></span>
                </div>
                <h3 className="student-stat-value">-</h3>
                <p className="student-stat-comparison">-</p>
              </div>

              {/* Card 4: Streak */}
              <div className="student-stat-card">
                <div className="student-stat-label-row">
                  <span className="student-stat-label">{t('dashboard.streak')}</span>
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
                    <h3 className="breakdown-card-title">{t('dashboard.breakdownTitle')}</h3>
                    <p className="breakdown-card-subtitle">{t('dashboard.breakdownDesc').replace('{track}', targetTrack || t('dashboard.yourTrack'))}</p>
                  </div>
                </div>
                
                <div className="breakdown-score-badge">
                  <div className="score-main">{displayReadiness}<span className="score-max">/100</span></div>
                  <div className="score-gap-label">{t('dashboard.biggestGap')}<span className="highlight-gap">{biggestGap}</span></div>
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
                {t('dashboard.scoreFormula')}
              </div>
            </div>

            {/* 2. Middle Row: Upcoming Scenarios (65%) & Top Skill Gaps (35%) */}
            <div className="dashboard-middle-row">
              
              {/* Left Panel: Upcoming Scenarios */}
              <div className="dashboard-card scenarios-panel">
                <div className="panel-header">
                  <h3 className="panel-title">{t('dashboard.upcomingScenarios')}</h3>
                  <button className="panel-link-btn" onClick={() => setActiveTab('simulator')}>{t('dashboard.viewAll')}</button>
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
                        <span>{t('dashboard.open')}</span>
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
                  <h3 className="panel-title">{t('dashboard.topSkillGaps')}</h3>
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
                  <span>{t('dashboard.fullAssessment')}</span>
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
                  <h4 className="bottom-card-title">{t('dashboard.badgesEarned')}</h4>
                </div>
                <div className="badges-pills-row">
                  <span className="badge-pill">{t('dashboard.badge1')}</span>
                  <span className="badge-pill">{t('dashboard.badge2')}</span>
                  <span className="badge-pill">{t('dashboard.badge3')}</span>
                  <span className="badge-pill">{t('dashboard.badge4')}</span>
                </div>
              </div>

              {/* This Week */}
              <div className="dashboard-card bottom-card">
                <div className="bottom-card-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="bottom-card-icon week-icon">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <h4 className="bottom-card-title">{t('dashboard.thisWeek')}</h4>
                </div>
                <p className="bottom-card-text font-accent-dark">
                  {t('dashboard.thisWeekDesc')}
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
                  <h4 className="bottom-card-title">{t('dashboard.nextMentorSync')}</h4>
                </div>
                <p className="bottom-card-text">
                  {t('dashboard.nextMentorSyncDesc')}
                </p>
              </div>

            </div>

          </div>
  );
}
