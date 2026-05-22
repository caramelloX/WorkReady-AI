import React, { useState } from 'react';
import './MentorScreen.css';

export default function MentorScreen({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'students', 'submissions', 'portfolio'
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

  // Initial student roster data
  const students = [
    {
      id: 'student-01',
      name: 'Aarav Sharma',
      readiness: 76,
      scenarios: '5/12',
      risk: 'Medium',
      lastActive: '2 hours ago',
      targetIndustry: 'Fintech',
      level: 'Competent',
      evidence: [
        { name: 'EV-01: Database RCA Log', points: 88 },
        { name: 'EV-02: Connection Pool Memo', points: 76 },
        { name: 'EV-03: Process Map draft', points: 82 }
      ]
    },
    {
      id: 'student-02',
      name: 'Diya Patel',
      readiness: 89,
      scenarios: '8/12',
      risk: 'Low',
      lastActive: '5 hours ago',
      targetIndustry: 'E-commerce',
      level: 'Job-ready',
      evidence: [
        { name: 'EV-01: API WebSocket patch', points: 92 },
        { name: 'EV-02: Systems Memo', points: 86 },
        { name: 'EV-03: Gateway Diagnostics Map', points: 90 }
      ]
    },
    {
      id: 'student-03',
      name: 'Rohan Mehta',
      readiness: 45,
      scenarios: '3/12',
      risk: 'High',
      lastActive: 'Yesterday',
      targetIndustry: 'SaaS',
      level: 'Foundational',
      evidence: [
        { name: 'EV-01: Resource Leak RCA Log', points: 55 },
        { name: 'EV-02: Error Handling Memo', points: 40 }
      ]
    },
    {
      id: 'student-04',
      name: 'Sara Khan',
      readiness: 92,
      scenarios: '11/12',
      risk: 'Low',
      lastActive: '1 day ago',
      targetIndustry: 'Security / DevOps',
      level: 'Job-ready',
      evidence: [
        { name: 'EV-01: Security Penetration Memo', points: 96 },
        { name: 'EV-02: Token Sanitization log', points: 92 },
        { name: 'EV-03: Path Traversal RCA', points: 88 }
      ]
    },
    {
      id: 'student-05',
      name: 'Vikram Singh',
      readiness: 68,
      scenarios: '6/12',
      risk: 'Medium',
      lastActive: '3 days ago',
      targetIndustry: 'Enterprise SaaS',
      level: 'Developing',
      evidence: [
        { name: 'EV-01: Memory Diagnostics Map', points: 70 },
        { name: 'EV-02: GC Logs Memo', points: 66 }
      ]
    },
    {
      id: 'student-06',
      name: 'Neha Verma',
      readiness: 81,
      scenarios: '7/12',
      risk: 'Low',
      lastActive: 'Yesterday',
      targetIndustry: 'AI Solutions',
      level: 'Competent',
      evidence: [
        { name: 'EV-01: AI Interceptor RCA Log', points: 85 },
        { name: 'EV-02: Tokenizer usage process map', points: 80 },
        { name: 'EV-03: LLM Safety Memo', points: 78 }
      ]
    }
  ];

  // Mock submissions queue
  const submissionsData = [
    { id: 'sub-1', student: 'Rohan Mehta', type: 'RCA', artifact: 'Resource Leak RCA Log', date: 'Yesterday', status: 'Pending' },
    { id: 'sub-2', student: 'Aarav Sharma', type: 'Memo', artifact: 'Connection Pool Memo', date: 'Today', status: 'Pending' },
    { id: 'sub-3', student: 'Vikram Singh', type: 'Process Map', artifact: 'Memory Diagnostics Map', date: '2 days ago', status: 'Reviewed' },
    { id: 'sub-4', student: 'Neha Verma', type: 'Memo', artifact: 'Tokenizer usage Memo', date: 'Today', status: 'Needs Revision' },
    { id: 'sub-5', student: 'Diya Patel', type: 'RCA', artifact: 'API WebSocket patch', date: '3 days ago', status: 'Reviewed' }
  ];

  const currentStudent = students.find(s => s.id === selectedStudentId) || students[0];

  const handleSaveHighlight = (e) => {
    e.preventDefault();
    setMentorHighlights({
      ...mentorHighlights,
      [selectedStudentId]: editingHighlight || mentorHighlights[selectedStudentId]
    });
    alert('Mentor highlight comment updated successfully!');
    setEditingHighlight('');
  };

  const filteredSubmissions = submissionsData.filter(sub => {
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

        <div className="mentor-sidebar-header">MENTOR PORTAL</div>

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
            <span>Mentor Dashboard</span>
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
            <span>Student List</span>
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
            <span>Submissions</span>
            <span className="mentor-badge-count">2</span>
          </button>

          <button 
            className={`mentor-nav-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => { setActiveTab('portfolio'); setSelectedStudentId('student-01'); }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mentor-nav-icon">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span>Portfolio Review</span>
          </button>
        </nav>

        <div className="mentor-sidebar-footer">
          <div className="mentor-user-card">
            <div className="mentor-avatar">AC</div>
            <div className="mentor-user-info">
              <span className="mentor-user-name">Alex Carter</span>
              <span className="mentor-user-role">Lead Staff Coach</span>
            </div>
          </div>
          <button className="mentor-logout-btn" onClick={() => onNavigate('landing')}>
            Sign out
          </button>
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
                <h1 className="mentor-page-title">Mentor Dashboard</h1>
                <p className="mentor-page-subtitle">Coach your cohort through real-world software engineering incidents.</p>
              </div>
            </header>

            <main className="mentor-content">
              {/* 2. Top Metrics (4 Cards) */}
              <div className="mentor-stats-grid">
                <div className="mentor-stat-card border-blue">
                  <div className="stat-card-inner">
                    <span className="mentor-stat-label color-blue">Mentees</span>
                    <h3 className="mentor-stat-value">6</h3>
                    <p className="mentor-stat-subtext">Active this term</p>
                  </div>
                </div>
                <div className="mentor-stat-card border-yellow">
                  <div className="stat-card-inner">
                    <span className="mentor-stat-label color-yellow">Unfinished</span>
                    <h3 className="mentor-stat-value">4</h3>
                    <p className="mentor-stat-subtext">Requires attention</p>
                  </div>
                </div>
                <div className="mentor-stat-card border-teal">
                  <div className="stat-card-inner">
                    <span className="mentor-stat-label color-teal">Available</span>
                    <h3 className="mentor-stat-value">4</h3>
                    <p className="mentor-stat-subtext">Incident scenarios open</p>
                  </div>
                </div>
                <div className="mentor-stat-card border-green">
                  <div className="stat-card-inner">
                    <span className="mentor-stat-label color-green">Finished</span>
                    <h3 className="mentor-stat-value">18</h3>
                    <p className="mentor-stat-subtext">Approved evidence logs</p>
                  </div>
                </div>
              </div>

              {/* Grid split for Student Table & Sidebar Widgets */}
              <div className="mentor-grid-layout">
                {/* Left: Student Progress Table */}
                <div className="mentor-table-card">
                  <h3 className="card-title">Student Progress</h3>
                  <div className="table-responsive">
                    <table className="mentor-custom-table">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Readiness</th>
                          <th>Scenarios</th>
                          <th>Risk</th>
                          <th>Last Active</th>
                          <th>Actions</th>
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
                    <h3 className="widget-title">Pending Reviews</h3>
                    <div className="widget-list">
                      <div className="widget-item">
                        <div className="widget-item-info">
                          <span className="student">Rohan Mehta</span>
                          <span className="task">RCA Log - Outage #2</span>
                        </div>
                        <span className="widget-badge overdue">Overdue</span>
                      </div>
                      <div className="widget-item">
                        <div className="widget-item-info">
                          <span className="student">Aarav Sharma</span>
                          <span className="task">Connection Pool Memo</span>
                        </div>
                        <span className="widget-badge today">Today</span>
                      </div>
                    </div>
                  </div>

                  {/* Unfinished Task Reminders */}
                  <div className="widget-card">
                    <h3 className="widget-title">Unfinished Reminders</h3>
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
                <h1 className="mentor-page-title">Student List</h1>
                <p className="mentor-page-subtitle">Detailed engineering readiness progression tracking for active candidates.</p>
              </div>
            </header>

            <main className="mentor-content">
              <div className="mentor-table-card full-width">
                <h3 className="card-title">Active Candidates</h3>
                <div className="table-responsive">
                  <table className="mentor-custom-table">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Target Industry</th>
                        <th>Competency Level</th>
                        <th>Scenarios Solved</th>
                        <th>Last Active</th>
                        <th>Action</th>
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
                <h1 className="mentor-page-title">Evidence Submissions</h1>
                <p className="mentor-page-subtitle">Verify student incident write-ups and diagnostic process charts.</p>
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
                <h3 className="card-title">Solutions Queue</h3>
                <div className="table-responsive">
                  <table className="mentor-custom-table">
                    <thead>
                      <tr>
                        <th>Candidate</th>
                        <th>Artifact Type</th>
                        <th>Evidence Artifact Name</th>
                        <th>Submitted Date</th>
                        <th>Status</th>
                        <th>Action</th>
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
              <h3 className="master-title">Mentees list</h3>
              <div className="master-list">
                {students.map((st) => (
                  <div 
                    key={st.id} 
                    className={`master-student-item ${selectedStudentId === st.id ? 'active' : ''}`}
                    onClick={() => { setSelectedStudentId(st.id); setEditingHighlight(''); }}
                  >
                    <span className="name">{st.name}</span>
                    <span className="readiness-score">{st.readiness}% Ready</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Main Panel detailed view */}
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
                  <h4 className="section-card-title">Job Readiness Index</h4>
                  <div className="readiness-big-display">
                    <div className="readiness-circle">
                      <span className="num">{currentStudent.readiness}%</span>
                    </div>
                    <div className="readiness-scale-info">
                      <div className="scale-bar-container">
                        <div className="scale-bar-fill" style={{ width: `${currentStudent.readiness}%` }}></div>
                      </div>
                      <p className="description">Candidate has solved {currentStudent.scenarios} incident modules and met Stripe diagnostic standard benchmarks.</p>
                    </div>
                  </div>
                </div>

                {/* Mentor Highlights (Review Comments) */}
                <div className="detail-section-card">
                  <h4 className="section-card-title">Mentor Highlights</h4>
                  <p className="highlight-text">{mentorHighlights[currentStudent.id] || 'No custom highlights provided yet.'}</p>
                  
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
                  <h4 className="section-card-title">Evidence Artifact Folder</h4>
                  <div className="evidence-list-widget">
                    {currentStudent.evidence.map((ev, idx) => (
                      <div key={idx} className="evidence-item-row">
                        <div className="evidence-info">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="doc-icon">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          <span className="name">{ev.name}</span>
                        </div>
                        <span className="score-pill">{ev.points} / 100 pts</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
