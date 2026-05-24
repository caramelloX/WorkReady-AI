import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './MentorScreen.css';
import { api } from '../../api.js';
import StudentSettings from '../Student/StudentSettings';

export default function MentorScreen({ onNavigate }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('mentorActiveTab') || 'dashboard';
  });

  useEffect(() => {
    sessionStorage.setItem('mentorActiveTab', activeTab);
  }, [activeTab]);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('student-01');
  const [submissionFilter, setSubmissionFilter] = useState('All'); // All, Pending, Reviewed, Needs Revision
  const [mentorHighlights, setMentorHighlights] = useState({
    'student-01': 'Exceptional logical thinking during pool diagnostics. Writing style is clean and structured.',
    'student-02': 'Demonstrates deep systems understanding. Excellent network and diagnostic approach.',
    'student-03': 'Needs guidance on exception block safety patterns. Shows solid base capabilities.',
    'student-04': 'Excellent security focus. Solved all security modules with distinction.',
    'student-05': 'Strong progression. Active in resolving code smells.',
    'student-06': 'Competent post-mortem memo drafting. Very collaborative attitude.'
  });
  const [editingHighlight, setEditingHighlight] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [students, setStudents] = useState([]);
  const [scenarios, setScenarios] = useState([]);

  // Retrieve current user from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const mentorName = currentUser?.fullname || currentUser?.username || 'Alex Carter';
  const mentorInitials = mentorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const mentorRole = currentUser?.role === 'mentor' ? 'Mentor' : 'Admin';

  // Load submissions and highlights on mount
  const loadMentorData = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const subs = await api.getSubmissions();
      setSubmissions(subs || []);
      
      const highlights = await api.getMentorHighlights();
      if (highlights) {
        setMentorHighlights(highlights);
      }

      const stData = await api.getMentorStudents();
      setStudents(stData || []);

      const scens = await api.getScenarios();
      setScenarios(scens || []);
    } catch (err) {
      console.error('Failed to load mentor workspace data from database:', err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMentorData();
    // Poll every 5 seconds for real-time updates
    const interval = setInterval(() => loadMentorData(true), 5000);
    return () => clearInterval(interval);
  }, []);

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0] || null;

  const handleSaveHighlight = async (e) => {
    e.preventDefault();
    if (!editingHighlight.trim()) return;
    try {
      await api.saveMentorHighlight(selectedStudentId, editingHighlight);
      setMentorHighlights({
        ...mentorHighlights,
        [selectedStudentId]: editingHighlight
      });
      alert('Mentor highlight comment updated successfully and saved to database!');
      setEditingHighlight('');
    } catch (err) {
      console.error('Failed to save mentor highlight to DB:', err);
      alert('Failed to save highlight to database.');
    }
  };

  const handleReviewSub = async (id, status, feedback) => {
    try {
      await api.reviewSubmission(id, status, feedback);
      // Reload submissions queue
      const subs = await api.getSubmissions();
      setSubmissions(subs || []);
      alert(`Submission marked as ${status}!`);
    } catch (err) {
      console.error('Failed to review submission:', err);
      alert('Failed to review submission in database.');
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    if (submissionFilter === 'All') return true;
    return sub.status === submissionFilter;
  });

  return (
    <div className="mentor-workspace">
      {/* 1. Global Navigation Sidebar */}
      <div className="mentor-sidebar">
        <div className="mentor-sidebar-brand" onClick={() => onNavigate('landing')}>
          <div className="mentor-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span>WorkReady AI</span>
        </div>

        <div className="mentor-sidebar-header">{t('mentor.portal')}</div>

        <nav className="mentor-sidebar-nav">
          <button 
            className={`mentor-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mentor-nav-icon">
              <rect x="3" y="3" width="7" height="9" rx="1" />
              <rect x="14" y="3" width="7" height="5" rx="1" />
              <rect x="14" y="12" width="7" height="9" rx="1" />
              <rect x="3" y="16" width="7" height="5" rx="1" />
            </svg>
            <span>{t('mentor.dashboardTab')}</span>
          </button>

          <button 
            className={`mentor-nav-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mentor-nav-icon">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{t('mentor.studentListTab')}</span>
          </button>

          <button 
            className={`mentor-nav-btn ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mentor-nav-icon">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <span>{t('mentor.submissionsTab')}</span>
            {submissions.filter(sub => sub.status === 'Pending').length > 0 && (
              <span className="mentor-badge-count">
                {submissions.filter(sub => sub.status === 'Pending').length}
              </span>
            )}
          </button>

          <button 
            className={`mentor-nav-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => { setActiveTab('portfolio'); setSelectedStudentId('student-01'); }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mentor-nav-icon">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span>{t('mentor.portfolioTab')}</span>
          </button>
        </nav>

        <div className="mentor-sidebar-footer">
          <div className="mentor-profile-dropdown-container">
            <button className="mentor-profile-btn" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
              {currentUser && currentUser.avatar_base64 ? (
                <img src={currentUser.avatar_base64} alt="Avatar" className="mentor-profile-avatar" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="mentor-profile-avatar">{mentorInitials}</div>
              )}
              <div className="mentor-profile-info">
                <span className="mentor-profile-name">{mentorName}</span>
                <span className="mentor-profile-role">{mentorRole}</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`dropdown-icon ${showProfileDropdown ? 'open' : ''}`}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {showProfileDropdown && (
              <div className="mentor-profile-dropdown-menu">
                <button className="dropdown-item" onClick={() => { setShowProfileDropdown(false); setActiveTab('settings'); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-item-icon">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  {t('sidebar.settings') || 'Settings'}
                </button>
                <button className="dropdown-item logout" onClick={() => onNavigate('logout')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-item-icon">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  {t('mentor.signOut')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Panel Content Area */}
      <div className="mentor-main-panel">
        
        {/* ====================================================
            TAB VIEW: MENTOR DASHBOARD (DEFAULT VIEW)
           ==================================================== */}
        {activeTab === 'dashboard' && (
          <>
            <header className="mentor-header">
              <div className="mentor-header-title-box">
                <h1 className="mentor-page-title">{t('mentor.dashTitle')}</h1>
                <p className="mentor-page-subtitle">{t('mentor.dashSubtitle')}</p>
              </div>
            </header>

            <main className="mentor-content">
              {/* 2. Top Metrics (4 Cards) */}
              <div className="mentor-stats-grid">
                <div className="mentor-stat-card border-blue">
                  <div className="stat-card-inner">
                    <span className="mentor-stat-label color-blue">{t('mentor.mentees')}</span>
                    <h3 className="mentor-stat-value">{students.length}</h3>
                    <p className="mentor-stat-subtext">{t('mentor.activeTerm')}</p>
                  </div>
                </div>
                <div className="mentor-stat-card border-yellow">
                  <div className="stat-card-inner">
                    <span className="mentor-stat-label color-yellow">{t('mentor.unfinished')}</span>
                    <h3 className="mentor-stat-value">{submissions.filter(s => s.status === 'Pending' || s.status === 'Needs Revision').length}</h3>
                    <p className="mentor-stat-subtext">{t('mentor.requiresAttn')}</p>
                  </div>
                </div>
                <div className="mentor-stat-card border-teal">
                  <div className="stat-card-inner">
                    <span className="mentor-stat-label color-teal">{t('mentor.available')}</span>
                    <h3 className="mentor-stat-value">{scenarios.length}</h3>
                    <p className="mentor-stat-subtext">{t('mentor.incidentsOpen')}</p>
                  </div>
                </div>
                <div className="mentor-stat-card border-green">
                  <div className="stat-card-inner">
                    <span className="mentor-stat-label color-green">{t('mentor.finished')}</span>
                    <h3 className="mentor-stat-value">{submissions.filter(s => s.status === 'Reviewed').length}</h3>
                    <p className="mentor-stat-subtext">{t('mentor.approvedEv')}</p>
                  </div>
                </div>
              </div>

              {/* Grid split for Student Table & Sidebar Widgets */}
              <div className="mentor-grid-layout">
                {/* Left: Student Progress Table */}
                <div className="mentor-table-card">
                  <h3 className="card-title">{t('mentor.studentProg')}</h3>
                  <div className="table-responsive">
                    <table className="mentor-custom-table">
                      <thead>
                        <tr>
                          <th>{t('mentor.thStudent')}</th>
                          <th>{t('mentor.thReadiness')}</th>
                          <th>{t('mentor.thScenarios')}</th>
                          <th>{t('mentor.thRisk')}</th>
                          <th>{t('mentor.thLastActive')}</th>
                          <th>{t('mentor.thActions')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((st) => (
                          <tr key={st.id}>
                            <td className="student-cell">
                              <span className="avatar-placeholder">{st.name.split(' ').map(n => n[0]).join('')}</span>
                              <span className="name">{st.name}</span>
                            </td>
                            <td>
                              <div className="table-readiness-wrapper">
                                <span className="readiness-num">{st.readiness}%</span>
                                <div className="readiness-bar-bg">
                                  <div className="readiness-bar-fill" style={{ width: `${st.readiness}%` }}></div>
                                </div>
                              </div>
                            </td>
                            <td>{st.scenarios}</td>
                            <td>
                              <span className={`risk-badge ${st.risk.toLowerCase()}`}>
                                {st.risk}
                              </span>
                            </td>
                            <td className="active-cell">{st.lastActive}</td>
                            <td>
                              <div className="table-action-row">
                                <button className="action-btn" title="View details" onClick={() => { setSelectedStudentId(st.id); setActiveTab('portfolio'); }}>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                  </svg>
                                </button>
                                <button className="action-btn" title="Send message" onClick={() => alert(`Opening chat overlay for ${st.name}...`)}>
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: Sidebar Widgets */}
                <div className="mentor-sidebar-widgets">
                  {/* Pending Reviews Widget */}
                  <div className="widget-card">
                    <h3 className="widget-title">{t('mentor.pendingRev')}</h3>
                    <div className="widget-list">
                      {submissions.filter(sub => sub.status === 'Pending').length === 0 ? (
                        <p style={{ fontSize: '13px', color: '#94a3b8', margin: '10px 0' }}>{t('mentor.allRevDone')}</p>
                      ) : (
                        submissions.filter(sub => sub.status === 'Pending').map(sub => (
                          <div className="widget-item" key={sub.id}>
                            <div className="widget-item-info">
                              <span className="student">{sub.student}</span>
                              <span className="task">{sub.artifact} ({sub.type})</span>
                            </div>
                            <span className={`widget-badge ${sub.date === 'Today' ? 'today' : 'overdue'}`}>
                              {sub.date === 'Today' ? t('mentor.today') : t('mentor.overdue')}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Unfinished Task Reminders */}
                  <div className="widget-card">
                    <h3 className="widget-title">{t('mentor.unfinReminders')}</h3>
                    <div className="widget-list">
                      <div className="widget-item">
                        <div className="widget-item-info">
                          <span className="student">Vikram Singh</span>
                          <span className="task">Process Map draft</span>
                        </div>
                        <span className="widget-badge overdue">Overdue</span>
                      </div>
                      <div className="widget-item">
                        <div className="widget-item-info">
                          <span className="student">Neha Verma</span>
                          <span className="task">AI Usage Log</span>
                        </div>
                        <span className="widget-badge today">Today</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </>
        )}

        {/* ====================================================
            TAB VIEW: STUDENT LIST
           ==================================================== */}
        {activeTab === 'students' && (
          <>
            <header className="mentor-header">
              <div className="mentor-header-title-box">
                <h1 className="mentor-page-title">{t('mentor.studListTitle')}</h1>
                <p className="mentor-page-subtitle">{t('mentor.studListSub')}</p>
              </div>
            </header>

            <main className="mentor-content">
              <div className="mentor-table-card full-width">
                <h3 className="card-title">{t('mentor.activeCand')}</h3>
                <div className="table-responsive">
                  <table className="mentor-custom-table">
                    <thead>
                      <tr>
                        <th>{t('mentor.thName')}</th>
                        <th>{t('mentor.thIndustry')}</th>
                        <th>{t('mentor.thLevel')}</th>
                        <th>{t('mentor.thSolved')}</th>
                        <th>{t('mentor.thLastActive')}</th>
                        <th>{t('mentor.thActions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((st) => (
                        <tr key={st.id}>
                          <td className="student-cell font-medium">{st.name}</td>
                          <td>{st.targetIndustry}</td>
                          <td>
                            <span className={`level-pill ${st.level.toLowerCase().replace(' ', '-')}`}>
                              {st.level}
                            </span>
                          </td>
                          <td>{st.scenarios}</td>
                          <td>{st.lastActive}</td>
                          <td>
                            <button 
                              className="view-details-btn-new"
                              onClick={() => { setSelectedStudentId(st.id); setActiveTab('portfolio'); }}
                            >
                              Inspect Portfolio
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
          </>
        )}

        {/* ====================================================
            TAB VIEW: SUBMISSIONS
           ==================================================== */}
        {activeTab === 'submissions' && (
          <>
            <header className="mentor-header">
              <div className="mentor-header-title-box">
                <h1 className="mentor-page-title">{t('mentor.subTitle')}</h1>
                <p className="mentor-page-subtitle">{t('mentor.subSub')}</p>
              </div>
            </header>

            <main className="mentor-content">
              {/* Submission Filter Tabs */}
              <div className="submission-filters-bar">
                {['All', 'Pending', 'Reviewed', 'Needs Revision'].map((filt) => (
                  <button
                    key={filt}
                    className={`filter-btn ${submissionFilter === filt ? 'active' : ''}`}
                    onClick={() => setSubmissionFilter(filt)}
                  >
                    {filt}
                  </button>
                ))}
              </div>

              <div className="mentor-table-card full-width">
                <h3 className="card-title">{t('mentor.queue')}</h3>
                <div className="table-responsive">
                  <table className="mentor-custom-table">
                    <thead>
                      <tr>
                        <th>{t('mentor.thStudent')}</th>
                        <th>{t('mentor.thArtifactType')}</th>
                        <th>{t('mentor.thEvidenceName')}</th>
                        <th>{t('mentor.thDate')}</th>
                        <th>{t('mentor.thStatus')}</th>
                        <th>{t('mentor.thActions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((sub) => (
                        <tr key={sub.id}>
                          <td className="student-cell font-medium">{sub.student}</td>
                          <td>
                            <span className="type-tag">{sub.type}</span>
                          </td>
                          <td className="artifact-cell">{sub.artifact}</td>
                          <td>{sub.date}</td>
                          <td>
                            <span className={`status-badge-new ${sub.status.toLowerCase().replace(' ', '-')}`}>
                              {sub.status}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {sub.status === 'Pending' ? (
                                <>
                                  <button 
                                    className="approve-action-btn"
                                    onClick={() => handleReviewSub(sub.id, 'Reviewed', 'Excellent work!')}
                                  >
                                    Approve
                                  </button>
                                  <button 
                                    className="revise-action-btn"
                                    onClick={() => handleReviewSub(sub.id, 'Needs Revision', 'Please clarify your diagrams.')}
                                  >
                                    Revise
                                  </button>
                                </>
                              ) : (
                                <button 
                                  className="assess-action-btn"
                                  onClick={() => {
                                    const matched = students.find(s => s.name === sub.student);
                                    if (matched) {
                                      setSelectedStudentId(matched.id);
                                      setActiveTab('portfolio');
                                    }
                                  }}
                                >
                                  Assess Solution
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>
          </>
        )}

        {/* ====================================================
            TAB VIEW: PORTFOLIO REVIEW (MASTER-DETAIL)
           ==================================================== */}
        {activeTab === 'portfolio' && (
          <div className="portfolio-review-layout">
            
            {/* Left Sidebar student selector */}
            <div className="portfolio-master-sidebar">
              <h3 className="master-title">{t('mentor.menteeList')}</h3>
              <div className="master-list">
                {students.map((st) => (
                  <div 
                    key={st.id} 
                    className={`master-student-item ${selectedStudentId === st.id ? 'active' : ''}`}
                    onClick={() => { setSelectedStudentId(st.id); setEditingHighlight(''); }}
                  >
                    <span className="name">{st.name}</span>
                    <span className="readiness-score">{st.readiness}% {t('mentor.ready')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Main Panel detailed view */}
            {currentStudent ? (
              <div className="portfolio-detail-panel">
                <div className="detail-panel-header">
                  <div>
                    <h2 className="detail-student-name">{currentStudent.name}</h2>
                    <p className="detail-student-meta">Target Industry: {currentStudent.targetIndustry} | Current Level: {currentStudent.level}</p>
                  </div>
                </div>

                <div className="detail-panel-body">
                  {/* Readiness Progress Indicator */}
                  <div className="detail-section-card">
                    <h4 className="section-card-title">{t('mentor.jobReadyIdx')}</h4>
                    <div className="readiness-big-display">
                      <div className="readiness-circle">
                        <svg width="80" height="80" viewBox="0 0 80 80" style={{ transform: 'rotate(-90deg)' }}>
                          <circle cx="40" cy="40" r="34" fill="none" stroke="#eff6ff" strokeWidth="6" />
                          <circle 
                            cx="40" 
                            cy="40" 
                            r="34" 
                            fill="none" 
                            stroke="var(--accent-blue)" 
                            strokeWidth="6" 
                            strokeDasharray={`${(currentStudent.readiness / 100) * 2 * Math.PI * 34} 999`}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dasharray 1s ease-out' }}
                          />
                        </svg>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="num">{currentStudent.readiness}%</span>
                        </div>
                      </div>
                      <div className="readiness-scale-info">
                        <div className="scale-bar-container">
                          <div className="scale-bar-fill" style={{ width: `${currentStudent.readiness}%` }}></div>
                        </div>
                        <p className="description">{t('mentor.candHasSolved')} {currentStudent.scenarios} {t('mentor.incidentsMet')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Mentor Highlights (Review Comments) */}
                  <div className="detail-section-card">
                    <h4 className="section-card-title">{t('mentor.highlightsTitle')}</h4>
                    <p className="highlight-text">{mentorHighlights[currentStudent.id] || t('mentor.noHighlights')}</p>
                    
                    <form onSubmit={handleSaveHighlight} className="highlight-edit-form">
                      <textarea 
                        className="highlight-textarea"
                        rows="2"
                        placeholder="Write structural observations or commendations for this candidate portfolio..."
                        value={editingHighlight}
                        onChange={(e) => setEditingHighlight(e.target.value)}
                      ></textarea>
                      <button type="submit" className="save-highlight-btn">
                        Update Highlights
                      </button>
                    </form>
                  </div>

                  {/* Evidence List */}
                  <div className="detail-section-card">
                    <h4 className="section-card-title">{t('mentor.evFolder')}</h4>
                    <div className="evidence-list-widget">
                      {currentStudent.evidence && currentStudent.evidence.map((ev, idx) => (
                        <div key={idx} className="evidence-item-row">
                          <div className="evidence-info">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="doc-icon">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                            <span className="name">{ev.name}</span>
                          </div>
                          <span className="score-pill">{ev.points} / 100 {t('mentor.pts')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            ) : (
              <div className="portfolio-detail-panel" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <p>{t('mentor.loadingCand')}</p>
              </div>
            )}

          </div>
        )}

        {activeTab === 'settings' && (
          <StudentSettings currentUser={currentUser} />
        )}

      </div>
    </div>
  );
}
