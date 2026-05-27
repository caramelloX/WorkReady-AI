import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './MentorScreen.css';
import { api } from '../../components/api.js';
import { DEMO_MENTORS } from '../../data/demoData';
import { SCENARIOS, DEMO_ASSIGNMENTS } from '../../data/scenarioData';
import { getReadinessLevel } from '../../utils/readiness';
import MentorSettings from './MentorSettings';
import ChatWidget from '../../components/Chat/ChatWidget';
import MentorReviewPage from './MentorReviewPage';

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
  const [activeChatStudent, setActiveChatStudent] = useState(null);
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
  const [reviewModal, setReviewModal] = useState(null); // { sub } | null
  const [reviewScore, setReviewScore] = useState('');
  const [reviewFeedback, setReviewFeedback] = useState('');
  const [reviewStatus, setReviewStatus] = useState('Reviewed');

  const [students, setStudents] = useState([]);
  const [scenarios, setScenarios] = useState([]);
  const [scenarioForm, setScenarioForm] = useState({ title: '', description: '', difficulty: 'Medium', industry: '' });
  const [scenarioFormOpen, setScenarioFormOpen] = useState(false);
  const [scenarioSaving, setScenarioSaving] = useState(false);

  // Dashboard filters
  const [filterTrack, setFilterTrack] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterReadiness, setFilterReadiness] = useState('All');

  // Retrieve current user from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const handleProfileUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const mentorName = currentUser?.fullname || currentUser?.username || 'Somchai Panya';
  const mentorInitials = mentorName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const mentorRole = currentUser?.role === 'mentor' ? 'Mentor' : 'Admin';
  const demoMentor = DEMO_MENTORS[0]; // Somchai P.

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

      const currentMentor = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const stData = await api.getMentorStudents(currentMentor.id);
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

  const handleReviewSub = async (id, status, feedback, score) => {
    try {
      await api.reviewSubmission(id, status, feedback, score ? Number(score) : undefined);
      const subs = await api.getSubmissions();
      setSubmissions(subs || []);
      setReviewModal(null);
      setReviewScore('');
      setReviewFeedback('');
      setReviewStatus('Reviewed');
    } catch (err) {
      console.error('Failed to review submission:', err);
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
            className={`mentor-nav-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mentor-nav-icon">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{t('mentor.messagesTab')}</span>
          </button>

          <button
            className={`mentor-nav-btn ${activeTab === 'scenarios' ? 'active' : ''}`}
            onClick={() => setActiveTab('scenarios')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mentor-nav-icon">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{t('mentor.scenariosTab')}</span>
          </button>

          <button
            className={`mentor-nav-btn ${activeTab === 'review' ? 'active' : ''}`}
            onClick={() => setActiveTab('review')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mentor-nav-icon">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            <span>Review</span>
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

            {/* Mentor Profile Info Bar */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap', padding: '0 4px' }}>
              <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', gap: '14px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px 18px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#2563EB', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '15px', flexShrink: 0 }}>{mentorInitials}</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0F172A' }}>{mentorName}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{currentUser?.jobTitle || demoMentor.jobTitle}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px 18px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" width="18" height="18"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase' }}>Organization</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>{currentUser?.organization || demoMentor.organization}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px 18px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" width="18" height="18"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase' }}>Expertise</div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#1E293B' }}>{currentUser?.expertise || demoMentor.expertise}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '14px 18px' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '600', textTransform: 'uppercase' }}>Capacity</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>{currentUser?.currentStudents || demoMentor.currentStudents}/{currentUser?.maxStudents || demoMentor.maxStudents} Students</div>
                </div>
              </div>
            </div>

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
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {st.avatar_base64 ? (
                                  <img src={st.avatar_base64} alt={st.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                ) : (
                                  <span className="avatar-placeholder" style={{ flexShrink: 0 }}>{st.name.split(' ').map(n => n[0] || '').join('')}</span>
                                )}
                                <span className="name">{st.name}</span>
                              </div>
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
                                <button className="action-btn" title="Send message" onClick={() => setActiveChatStudent(st)}>
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
              {/* Filter Bar */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#475569' }}>Filters:</div>
                <select className="mentor-filter-select" value={filterTrack} onChange={e => setFilterTrack(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px', fontWeight: '600' }}>
                  <option value="All">All Tracks</option>
                  <option value="quality_assurance">Quality Assurance</option>
                  <option value="production_process">Production Process</option>
                  <option value="maintenance_machine">Maintenance & Machine</option>
                  <option value="safety_compliance">Safety & Compliance</option>
                </select>
                <select className="mentor-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px', fontWeight: '600' }}>
                  <option value="All">All Statuses</option>
                  <option value="Waiting for Review">Waiting for Review</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Needs Revision">Needs Revision</option>
                </select>
                <select className="mentor-filter-select" value={filterReadiness} onChange={e => setFilterReadiness(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1.5px solid #E2E8F0', fontSize: '13px', fontWeight: '600' }}>
                  <option value="All">All Readiness</option>
                  <option value="Awareness">Awareness (0-39)</option>
                  <option value="Guided Practice">Guided Practice (40-59)</option>
                  <option value="Work-Ready Basic">Work-Ready Basic (60-79)</option>
                  <option value="Strong Junior Talent">Strong Junior Talent (80-100)</option>
                </select>
              </div>

              <div className="mentor-table-card full-width">
                <h3 className="card-title">{t('mentor.activeCand')}</h3>
                <div className="table-responsive">
                  <table className="mentor-custom-table">
                    <thead>
                      <tr>
                        <th>{t('mentor.thName')}</th>
                        <th>Target Track</th>
                        <th>Career Goal</th>
                        <th>Weakest Skill</th>
                        <th>{t('mentor.thReadiness')}</th>
                        <th>Portfolio</th>
                        <th>{t('mentor.thActions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((st) => (
                        <tr key={st.id}>
                          <td className="student-cell font-medium">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {st.avatar_base64 ? (
                                <img src={st.avatar_base64} alt={st.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                              ) : (
                                <span className="avatar-placeholder" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>{st.name.split(' ').map(n => n[0] || '').join('')}</span>
                              )}
                              {st.name}
                            </div>
                          </td>
                          <td>{st.targetTrack || 'quality_assurance'}</td>
                          <td>{st.careerGoal || 'Junior QA Technician'}</td>
                          <td>{st.weakestSkill || 'RCA'}</td>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: '600' }}>{st.readiness || 58}/100</span>
                              <span style={{ fontSize: '11px', color: '#64748B' }}>{st.level}</span>
                            </div>
                          </td>
                          <td>{st.portfolioCompletion || 3}/5</td>
                          <td>
                            <button 
                              className="view-details-btn-new"
                              onClick={() => { setSelectedStudentId(st.id); setActiveTab('review'); }}
                            >
                              Review Portfolio
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
                        <th>{t('mentor.thScore')}</th>
                        <th>{t('mentor.thActions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((sub) => (
                        <tr key={sub.id}>
                          <td className="student-cell font-medium">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {(() => {
                                const matched = students.find(s => s.name === sub.student);
                                if (matched?.avatar_base64) {
                                  return <img src={matched.avatar_base64} alt={sub.student} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />;
                                }
                                return <span className="avatar-placeholder" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>{sub.student.split(' ').map(n => n[0] || '').join('')}</span>;
                              })()}
                              {sub.student}
                            </div>
                          </td>
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
                            {sub.score != null ? (
                              <span style={{ fontWeight: '700', color: sub.score >= 80 ? '#16a34a' : sub.score >= 50 ? '#d97706' : '#dc2626' }}>
                                {sub.score}/100
                              </span>
                            ) : '—'}
                          </td>
                          <td>
                            <button
                              className="approve-action-btn"
                              onClick={() => {
                                setSelectedStudentId('student-demo-01'); // In real app, sub.studentId
                                setActiveTab('review');
                              }}
                            >
                              {t('mentor.reviewBtn')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </main>

            {/* Review Modal - Removed in favor of MentorReviewPage */}
          </>
        )}

        {/* ====================================================
            TAB VIEW: MENTOR REVIEW PAGE
           ==================================================== */}
        {activeTab === 'review' && (
          <MentorReviewPage 
            studentId={selectedStudentId} 
            onBack={() => setActiveTab('dashboard')} 
          />
        )}


        {/* ====================================================
            TAB VIEW: MESSAGES
           ==================================================== */}
        {activeTab === 'messages' && currentUser && (
          <>
            <header className="mentor-header">
              <div className="mentor-header-title-box">
                <h1 className="mentor-page-title">{t('mentor.messagesTab')}</h1>
                <p className="mentor-page-subtitle">{t('mentor.messagesSub')}</p>
              </div>
            </header>
            <main className="mentor-content">
              <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', height: 'calc(100vh - 200px)' }}>
                {/* Student list */}
                <div className="mentor-table-card" style={{ padding: '16px', overflowY: 'auto' }}>
                  <h3 className="card-title" style={{ fontSize: '14px', marginBottom: '12px' }}>{t('mentor.menteeList')}</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {students.map(st => (
                      <button
                        key={st.id}
                        onClick={() => setActiveChatStudent(activeChatStudent?.id === st.id ? null : st)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 12px', borderRadius: '10px', border: '1.5px solid',
                          borderColor: activeChatStudent?.id === st.id ? 'var(--accent-blue)' : 'var(--border-color)',
                          background: activeChatStudent?.id === st.id ? '#eff6ff' : '#fff',
                          cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s'
                        }}
                      >
                        {st.avatar_base64 ? (
                          <img src={st.avatar_base64} alt={st.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                        ) : (
                          <span style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-blue)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', flexShrink: 0 }}>
                            {st.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        )}
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '13px', color: 'var(--neutral-heading)' }}>{st.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--neutral-text)' }}>{st.targetIndustry || 'Student'}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                {/* Chat area */}
                <div className="mentor-table-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {activeChatStudent ? (
                    <ChatWidget
                      currentUser={currentUser}
                      contactUser={activeChatStudent}
                      isFloating={false}
                    />
                  ) : (
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: 'var(--neutral-text)' }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48" style={{ opacity: 0.3 }}>
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <p style={{ margin: 0, fontSize: '14px' }}>{t('mentor.selectStudent')}</p>
                    </div>
                  )}
                </div>
              </div>
            </main>
          </>
        )}

        {/* ====================================================
            TAB VIEW: SCENARIOS
           ==================================================== */}
        {activeTab === 'scenarios' && (
          <>
            <header className="mentor-header">
              <div className="mentor-header-title-box">
                <h1 className="mentor-page-title">{t('mentor.scenariosTab')}</h1>
                <p className="mentor-page-subtitle">{t('mentor.scenariosSub')}</p>
              </div>
              <div className="mentor-header-actions">
                <button
                  className="mentor-btn-primary"
                  onClick={() => { setScenarioFormOpen(true); setScenarioForm({ title: '', description: '', difficulty: 'Medium', industry: '' }); }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  {t('mentor.addScenario')}
                </button>
              </div>
            </header>
            <main className="mentor-content">
              {/* Add Scenario Form */}
              {scenarioFormOpen && (
                <div className="mentor-table-card" style={{ marginBottom: '24px' }}>
                  <h3 className="card-title" style={{ marginBottom: '16px' }}>{t('mentor.addScenario')}</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--neutral-heading)', display: 'block', marginBottom: '6px' }}>{t('mentor.scenarioTitle')}</label>
                      <input
                        type="text"
                        className="mentor-filter-select"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid var(--border-color)', fontSize: '14px' }}
                        value={scenarioForm.title}
                        onChange={e => setScenarioForm(f => ({ ...f, title: e.target.value }))}
                        placeholder={t('mentor.scenarioTitlePlaceholder')}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--neutral-heading)', display: 'block', marginBottom: '6px' }}>{t('mentor.scenarioIndustry')}</label>
                      <input
                        type="text"
                        className="mentor-filter-select"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid var(--border-color)', fontSize: '14px' }}
                        value={scenarioForm.industry}
                        onChange={e => setScenarioForm(f => ({ ...f, industry: e.target.value }))}
                        placeholder={t('mentor.scenarioIndustryPlaceholder')}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--neutral-heading)', display: 'block', marginBottom: '6px' }}>{t('mentor.scenarioDifficulty')}</label>
                      <select
                        className="mentor-filter-select"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid var(--border-color)', fontSize: '14px' }}
                        value={scenarioForm.difficulty}
                        onChange={e => setScenarioForm(f => ({ ...f, difficulty: e.target.value }))}
                      >
                        <option value="Easy">{t('mentor.diffEasy')}</option>
                        <option value="Medium">{t('mentor.diffMedium')}</option>
                        <option value="Hard">{t('mentor.diffHard')}</option>
                      </select>
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ fontSize: '13px', fontWeight: '600', color: 'var(--neutral-heading)', display: 'block', marginBottom: '6px' }}>{t('mentor.scenarioDesc')}</label>
                      <textarea
                        rows={3}
                        className="mentor-filter-select"
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid var(--border-color)', fontSize: '14px', resize: 'vertical' }}
                        value={scenarioForm.description}
                        onChange={e => setScenarioForm(f => ({ ...f, description: e.target.value }))}
                        placeholder={t('mentor.scenarioDescPlaceholder')}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '16px', justifyContent: 'flex-end' }}>
                    <button className="mentor-btn-secondary" onClick={() => setScenarioFormOpen(false)}>{t('mentor.reviewCancel')}</button>
                    <button
                      className="mentor-btn-primary"
                      disabled={scenarioSaving || !scenarioForm.title.trim()}
                      onClick={async () => {
                        setScenarioSaving(true);
                        try {
                          await api.createScenario(scenarioForm);
                          const scens = await api.getScenarios();
                          setScenarios(scens || []);
                          setScenarioFormOpen(false);
                        } catch (err) {
                          console.error(err);
                        } finally {
                          setScenarioSaving(false);
                        }
                      }}
                    >
                      {scenarioSaving ? '...' : t('mentor.reviewSubmit')}
                    </button>
                  </div>
                </div>
              )}

              {/* Scenarios list */}
              {scenarios.length === 0 ? (
                <div className="mentor-table-card" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--neutral-text)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48" style={{ opacity: 0.3, marginBottom: '12px' }}>
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p style={{ margin: 0 }}>{t('mentor.noScenarios')}</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                  {scenarios.map((sc) => (
                    <div key={sc.id || sc._id} className="mentor-table-card" style={{ padding: '20px', position: 'relative' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <span style={{
                          fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px',
                          background: sc.difficulty === 'Hard' ? '#fee2e2' : sc.difficulty === 'Easy' ? '#dcfce7' : '#fef3c7',
                          color: sc.difficulty === 'Hard' ? '#dc2626' : sc.difficulty === 'Easy' ? '#16a34a' : '#d97706'
                        }}>{sc.difficulty || 'Medium'}</span>
                        <button
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '4px' }}
                          title={t('mentor.deleteScenario')}
                          onClick={async () => {
                            if (!window.confirm(t('mentor.confirmDelete'))) return;
                            await api.deleteScenario(sc.id || sc._id);
                            setScenarios(prev => prev.filter(s => (s.id || s._id) !== (sc.id || sc._id)));
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                          </svg>
                        </button>
                      </div>
                      <h4 style={{ margin: '0 0 8px', fontSize: '15px', fontWeight: '700', color: 'var(--neutral-heading)' }}>{sc.title}</h4>
                      {sc.industry && <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--neutral-text)', fontWeight: '600' }}>{sc.industry}</p>}
                      <p style={{ margin: 0, fontSize: '13px', color: 'var(--neutral-text)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {sc.description || sc.context || '—'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {st.avatar_base64 ? (
                        <img src={st.avatar_base64} alt={st.name} style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : null}
                      <span className="name">{st.name}</span>
                    </div>
                    <span className="readiness-score">{st.readiness}% {t('mentor.ready')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Main Panel detailed view */}
            {currentStudent ? (
              <div className="portfolio-detail-panel">
                <div className="detail-panel-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {currentStudent.avatar_base64 ? (
                      <img src={currentStudent.avatar_base64} alt={currentStudent.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : null}
                    <div>
                      <h2 className="detail-student-name">{currentStudent.name}</h2>
                      <p className="detail-student-meta">Target Industry: {currentStudent.targetIndustry} | Current Level: {currentStudent.level}</p>
                    </div>
                  </div>
                </div>

                <div className="detail-panel-body">
                  
                  {/* Comprehensive Profile Info */}
                  <div className="detail-section-card profile-summary-card">
                    <h4 className="section-card-title">Profile Overview</h4>
                    <div className="profile-grid">
                      <div className="profile-item">
                        <span className="profile-label">Email:</span>
                        <span className="profile-value">{currentStudent.email || 'Not specified'}</span>
                      </div>
                      <div className="profile-item">
                        <span className="profile-label">Phone:</span>
                        <span className="profile-value">{currentStudent.phone || 'Not specified'}</span>
                      </div>
                      <div className="profile-item">
                        <span className="profile-label">Major:</span>
                        <span className="profile-value">{currentStudent.major || 'Not specified'}</span>
                      </div>
                      <div className="profile-item">
                        <span className="profile-label">Career Goal:</span>
                        <span className="profile-value">{currentStudent.careerGoal || 'Not specified'}</span>
                      </div>
                    </div>
                    {currentStudent.bio && (
                      <div className="profile-bio" style={{ marginTop: '16px' }}>
                        <span className="profile-label">Bio:</span>
                        <p style={{ marginTop: '4px', fontSize: '13px', lineHeight: '1.5' }}>{currentStudent.bio}</p>
                      </div>
                    )}
                  </div>

                  {/* Scenario Context Card */}
                  {(() => {
                    const assignment = DEMO_ASSIGNMENTS.find(a => a.studentId === currentStudent.id);
                    const scenario = assignment ? SCENARIOS.find(s => s.id === assignment.scenarioId) : null;
                    if (!scenario) return null;
                    return (
                      <div className="detail-section-card" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', marginBottom: '20px' }}>
                        <h4 className="section-card-title" style={{ color: '#1E3A8A' }}>Scenario Assignment Context</h4>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                          <div style={{ flex: 1, minWidth: '200px' }}>
                            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>Assigned Scenario</div>
                            <div style={{ fontWeight: '700', fontSize: '15px', color: '#0F172A', marginBottom: '6px' }}>{scenario.title}</div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                              <span style={{ fontSize: '11px', background: '#DBEAFE', color: '#2563EB', padding: '2px 8px', borderRadius: '99px', fontWeight: '600' }}>{scenario.difficulty}</span>
                              <span style={{ fontSize: '11px', background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '99px' }}>{scenario.estimatedTime}</span>
                              <span style={{ fontSize: '11px', background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '99px', textTransform: 'capitalize' }}>{scenario.primaryTrack?.replace(/_/g, ' ')}</span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#475569' }}>
                              <strong>Focus skill:</strong> {scenario.mainSkillCode?.replace(/_/g, ' ')}
                            </div>
                          </div>
                          <div style={{ flex: 1, minWidth: '200px' }}>
                            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>Focus Subskills to Review</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                              {(scenario.focusSubskills || []).map((sub, i) => (
                                <span key={i} style={{ fontSize: '11px', background: '#EFF6FF', color: '#2563EB', border: '1px solid #BFDBFE', padding: '2px 8px', borderRadius: '99px' }}>{sub}</span>
                              ))}
                            </div>
                            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>Match Score</div>
                            <div style={{ fontWeight: '700', fontSize: '14px', color: '#2563EB' }}>{assignment.mentorScore}% mentor fit</div>
                          </div>
                          <div style={{ flex: 1, minWidth: '180px' }}>
                            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '6px' }}>Required Portfolio Reviews</div>
                            {(scenario.reviewCapabilitiesRequired || []).map(cap => {
                              const labels = { canReviewProcessMap: 'Process Map', canReviewRiskChecklist: 'Risk Checklist', canReviewRca: 'RCA Report', canReviewTechnicalMemo: 'Technical Memo', canReviewAiUsageLog: 'AI Usage Log' };
                              return (
                                <div key={cap} style={{ fontSize: '12px', color: '#334155', marginBottom: '4px' }}>
                                  ✓ {labels[cap] || cap}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div style={{ marginTop: '12px', fontSize: '11px', color: '#3B82F6', fontStyle: 'italic' }}>
                          AI matching suggested this assignment. Final assignment was confirmed by Admin.
                        </div>
                      </div>
                    );
                  })()}

                  {/* Skills & Strengths Row */}
                  <div className="detail-grid-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    
                    {/* Strengths and Develop Areas */}
                    <div className="detail-section-card">
                      <h4 className="section-card-title">Strengths & Development</h4>
                      
                      <div className="tags-group" style={{ marginBottom: '16px' }}>
                        <span className="profile-label" style={{ display: 'block', marginBottom: '8px' }}>Core Strengths:</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {currentStudent.strengths && currentStudent.strengths.length > 0 ? (
                            currentStudent.strengths.map((str, idx) => (
                              <span key={idx} className="skill-tag strength-tag">{str}</span>
                            ))
                          ) : <span style={{ fontSize: '12px', color: '#94a3b8' }}>None recorded</span>}
                        </div>
                      </div>

                      <div className="tags-group">
                        <span className="profile-label" style={{ display: 'block', marginBottom: '8px' }}>Areas for Development:</span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {currentStudent.developAreas && currentStudent.developAreas.length > 0 ? (
                            currentStudent.developAreas.map((area, idx) => (
                              <span key={idx} className="skill-tag develop-tag">{area}</span>
                            ))
                          ) : <span style={{ fontSize: '12px', color: '#94a3b8' }}>None recorded</span>}
                        </div>
                      </div>
                    </div>

                    {/* Detailed Skills Analysis */}
                    <div className="detail-section-card">
                      <h4 className="section-card-title">Detailed Skills Analysis</h4>
                      <div className="skills-breakdown">
                        {[
                          { key: 'processMap', label: 'Process Mapping' },
                          { key: 'safetyRisk', label: 'Safety & Risk' },
                          { key: 'rca', label: 'Root Cause Analysis' },
                          { key: 'traceability', label: 'Traceability' },
                          { key: 'memo', label: 'Memo Drafting' },
                          { key: 'responsibleAi', label: 'Responsible AI' }
                        ].map((skill, idx) => {
                          const rawVal = currentStudent.ratings?.[skill.key] || 'none';
                          const score = rawVal === 'high' ? 100 : rawVal === 'medium' ? 50 : rawVal === 'low' ? 10 : 0;
                          return (
                            <div key={idx} className="skill-bar-row">
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '12px', fontWeight: '600' }}>{skill.label}</span>
                                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'capitalize' }}>{rawVal}</span>
                              </div>
                              <div className="scale-bar-container" style={{ height: '6px' }}>
                                <div className="scale-bar-fill" style={{ width: `${score}%`, background: score >= 80 ? 'var(--accent-green)' : score >= 40 ? 'var(--accent-yellow)' : 'var(--accent-red)' }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

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
          <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px' }}>
            <MentorSettings currentUser={currentUser} onProfileUpdate={handleProfileUpdate} onNavigate={onNavigate} />
          </div>
        )}

      </div>

    </div>
  );
}
