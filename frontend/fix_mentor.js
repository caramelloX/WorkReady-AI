import fs from 'fs';
const file = 'src/screen/Mentor/MentorScreen.jsx';
const content = fs.readFileSync(file, 'utf8');

const target1 = `            <span>{t('mentor.submissionsTab')}</span>
            {submissions.filter(sub => sub.status === 'Pending').length > 0 && (
                <div className="mentor-stat-card border-teal">`;

const missingBlock = `              <span className="mentor-badge-count">
                {submissions.filter(sub => sub.status === 'Pending').length}
              </span>
            )}
          </button>

          <button 
            className={\`mentor-nav-btn \${activeTab === 'portfolio' ? 'active' : ''}\`}
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={\`dropdown-icon \${showProfileDropdown ? 'open' : ''}\`}>
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
                <button className="dropdown-item logout" onClick={() => onNavigate('landing')}>
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
                <div className="mentor-stat-card border-teal">`;

const replacement = `            <span>{t('mentor.submissionsTab')}</span>\r\n            {submissions.filter(sub => sub.status === 'Pending').length > 0 && (\r\n${missingBlock}`;

if (content.replace(/\r\n/g, '\n').includes(target1.replace(/\r\n/g, '\n'))) {
    const newContent = content.replace(/\r\n/g, '\n').replace(target1.replace(/\r\n/g, '\n'), replacement.replace(/\r\n/g, '\n'));
    fs.writeFileSync(file, newContent);
    console.log('Fixed MentorScreen.jsx successfully.');
} else {
    console.log('Target block not found in MentorScreen.jsx');
}
