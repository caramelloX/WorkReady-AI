import React, { useState, useEffect } from 'react';
import './EmployerScreen.css';
import { api } from '../../api.js';

export default function EmployerScreen({ onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('All tracks');
  const [experienceFilter, setExperienceFilter] = useState('Any');
  
  // Slide-out modal state
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [candidates, setCandidates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load candidates on mount from SQLite backend (with offline fallback)
  useEffect(() => {
    const loadCandidates = async () => {
      try {
        setIsLoading(true);
        const data = await api.getCandidates();
        setCandidates(data);
      } catch (err) {
        console.error('Failed to retrieve candidates from database:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCandidates();
  }, []);


  // Search and Filter candidate selection logic
  const filteredCandidates = candidates.filter(cand => {
    // 1. Domain/Track filter
    if (domainFilter !== 'All tracks') {
      if (cand.role.toLowerCase() !== domainFilter.toLowerCase()) {
        return false;
      }
    }

    // 2. Experience level / score ranges
    if (experienceFilter !== 'Any') {
      // Foundational: < 80 score
      // Developing: 80 - 85 score
      // Competent: 86 - 90 score
      // Job-ready: > 90 score
      if (experienceFilter === 'Foundational' && cand.score >= 80) return false;
      if (experienceFilter === 'Developing' && (cand.score < 80 || cand.score > 85)) return false;
      if (experienceFilter === 'Competent' && (cand.score < 86 || cand.score > 90)) return false;
      if (experienceFilter === 'Job-ready' && cand.score <= 90) return false;
    }

    // 3. Debounced search query
    if (debouncedQuery.trim() !== '') {
      const q = debouncedQuery.toLowerCase();
      const matchesName = cand.name.toLowerCase().includes(q);
      const matchesUniv = cand.university.toLowerCase().includes(q);
      const matchesSkill = cand.skills.some(skill => skill.toLowerCase().includes(q));
      return matchesName || matchesUniv || matchesSkill;
    }

    return true;
  });

  // Check if we render the empty state
  const isEmptyState = searchQuery.trim() === '' && domainFilter === 'All tracks' && experienceFilter === 'Any';

  const handleOpenPanel = (cand) => {
    setSelectedCandidate(cand);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedCandidate(null);
  };

  return (
    <div className="employer-workspace">
      {/* 1. Sidebar Navigation */}
      <div className="employer-sidebar">
        <div className="employer-sidebar-brand" onClick={() => onNavigate('landing')}>
          <div className="employer-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span>WorkReady AI</span>
        </div>

        <div className="employer-sidebar-header">PORTAL ACCESS</div>

        <nav className="employer-sidebar-nav">
          <button className="employer-nav-btn active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="employer-nav-icon" width="20" height="20">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span>Talent Search</span>
          </button>
        </nav>

        <div className="employer-sidebar-footer">
          <div className="employer-user-card">
            <div className="employer-avatar">EP</div>
            <div className="employer-user-info">
              <span className="employer-user-name">Guest Recruiter</span>
              <span className="employer-user-role">Public Preview</span>
            </div>
          </div>
          <button className="employer-logout-btn" onClick={() => onNavigate('landing')}>
            Back to Home
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="employer-main-panel">
        
        {/* Header Section */}
        <header className="employer-header">
          <div className="employer-header-title-box">
            <h1 className="employer-page-title">Find work-ready engineering talent</h1>
            <p className="employer-page-subtitle">Search verified graduates with mentor-reviewed evidence portfolios.</p>
          </div>
        </header>

        <main className="employer-content">
          {/* 2. Search Component & Filters */}
          <div className="employer-search-filter-section">
            <div className="employer-search-bar-container">
              <svg className="employer-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="18" height="18">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, university, or skill (e.g. Kubernetes)"
                className="employer-search-input-field"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="employer-clear-search-btn" onClick={() => setSearchQuery('')}>
                  ✕
                </button>
              )}
            </div>

            <div className="employer-filters-container">
              <div className="employer-filter-dropdown-wrapper">
                <select
                  className="employer-filter-dropdown"
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                >
                  <option value="All tracks">All tracks</option>
                  <option value="Backend">Backend</option>
                  <option value="Frontend">Frontend</option>
                  <option value="DevOps">DevOps</option>
                  <option value="Security">Security</option>
                  <option value="Fullstack">Fullstack</option>
                  <option value="AI / Data">AI / Data</option>
                </select>
              </div>

              <div className="employer-filter-dropdown-wrapper">
                <select
                  className="employer-filter-dropdown"
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                >
                  <option value="Any">Any Level</option>
                  <option value="Job-ready">Job-ready (&gt;90)</option>
                  <option value="Competent">Competent (86-90)</option>
                  <option value="Developing">Developing (80-85)</option>
                  <option value="Foundational">Foundational (&lt;80)</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="employer-loading-container">
              <div className="employer-loading-spinner"></div>
              <p>Syncing premium talent profiles from database...</p>
            </div>
          ) : isEmptyState ? (
            <div className="employer-empty-state-card">
              <div className="employer-empty-state-inner">
                <svg className="employer-empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <path d="M8 11h6" />
                </svg>
                <h3>Refine your search parameters</h3>
                <p>Enter a search term or apply a filter to view candidates.</p>
                <div className="employer-empty-state-quick-keywords">
                  <span>Try:</span>
                  <button onClick={() => setSearchQuery('Kubernetes')}>Kubernetes</button>
                  <button onClick={() => setSearchQuery('React')}>React</button>
                  <button onClick={() => setDomainFilter('Backend')}>Backend Track</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 3. Search Results Header */}
              <div className="employer-results-header">
                <div className="employer-results-summary">
                  Showing <strong>{filteredCandidates.length}</strong> of <strong>{candidates.length}</strong> candidates
                </div>
                <div className="employer-results-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" className="badge-check-icon">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Verified portfolios</span>
                </div>
              </div>

              {/* Grid Layout */}
              {filteredCandidates.length === 0 ? (
                <div className="employer-no-results-card">
                  <p>No candidates match your current search query <strong>"{debouncedQuery}"</strong>.</p>
                  <button className="employer-reset-btn" onClick={() => { setSearchQuery(''); setDomainFilter('All tracks'); setExperienceFilter('Any'); }}>
                    Clear all filters
                  </button>
                </div>
              ) : (
                <div className="employer-candidate-grid">
                  {filteredCandidates.map((cand) => (
                    /* 4. Candidate Card Anatomy */
                    <div key={cand.id} className="employer-candidate-card" onClick={() => handleOpenPanel(cand)}>
                      
                      {/* Top Row (Profile Summary) */}
                      <div className="card-top-row">
                        <div className="avatar-circle">
                          {cand.avatar}
                        </div>
                        <div className="identity-box">
                          <h3 className="name">{cand.name}</h3>
                          <div className="univ-line">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" className="cap-icon">
                              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                            </svg>
                            <span>{cand.university}</span>
                          </div>
                          <div className="role-line">{cand.location} · {cand.role}</div>
                        </div>
                        <div className="score-badge" title="WorkReady score">
                          <span className="label">WR</span>
                          <span className="num">{cand.score}</span>
                        </div>
                      </div>

                      {/* Middle Row (Skills) */}
                      <div className="card-middle-row">
                        <div className="skills-pill-wrap">
                          {cand.skills.slice(0, 4).map((skill, idx) => (
                            <span key={idx} className="skill-pill">{skill}</span>
                          ))}
                          {cand.skills.length > 4 && (
                            <span className="skill-pill-more">+{cand.skills.length - 4}</span>
                          )}
                        </div>
                      </div>

                      {/* Data Row (Metrics) */}
                      <div className="card-data-row">
                        <div className="metric-col">
                          <span className="label">Scenarios</span>
                          <span className="value">{cand.scenarios}</span>
                        </div>
                        <div className="metric-col border-x">
                          <span className="label">RCA</span>
                          <span className="value">{cand.rcaRating} <span className="star-icon">★</span></span>
                        </div>
                        <div className="metric-col">
                          <span className="label">Evidence</span>
                          <span className="value">{cand.evidence}</span>
                        </div>
                      </div>

                      {/* Bottom Row (Availability & Action) */}
                      <div className="card-bottom-row">
                        <span className={`availability-badge avail-${cand.availability.toLowerCase().replace(' ', '-')}`}>
                          {cand.availability === 'Immediate' ? 'Immediate availability' : `Available in ${cand.availability}`}
                        </span>
                        <button className="view-portfolio-btn" onClick={(e) => { e.stopPropagation(); handleOpenPanel(cand); }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" className="eye-icon">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <span>View</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* 5. Candidate Detail Panel (Slide-out Modal) */}
      {isPanelOpen && selectedCandidate && (
        <div className="modal-backdrop-overlay" onClick={handleClosePanel}>
          <div className="slideout-detail-panel" onClick={(e) => e.stopPropagation()}>
            
            {/* Header Close button */}
            <button className="panel-close-btn" onClick={handleClosePanel} aria-label="Close panel">
              ✕
            </button>

            {/* Panel Content wrapper (Scrollable) */}
            <div className="panel-scroll-content">
              
              {/* Header Box */}
              <div className="panel-detail-header">
                <div className="header-info-left">
                  <h2 className="detail-candidate-name">{selectedCandidate.name}</h2>
                  <p className="detail-candidate-subtitle">
                    {selectedCandidate.role} Engineer · Available {selectedCandidate.availability.toLowerCase() === 'immediate' ? 'immediately' : `in ${selectedCandidate.availability}`}
                  </p>
                </div>
                
                <div className="header-scores-right">
                  <div className="panel-results-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="12" height="12" className="badge-check-icon">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    <span>Verified portfolio</span>
                  </div>
                  <div className="panel-wr-score-display">
                    <span className="lbl">WR SCORE</span>
                    <span className="val">{selectedCandidate.score}</span>
                  </div>
                </div>
              </div>

              {/* Grid of contact details */}
              <div className="panel-contact-grid">
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="contact-icon">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>{selectedCandidate.email}</span>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="contact-icon">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{selectedCandidate.phone}</span>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="contact-icon">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>{selectedCandidate.location}, India</span>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="contact-icon">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                  <span className="link-text">{selectedCandidate.linkedin}</span>
                </div>
                <div className="contact-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" className="contact-icon">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span className="link-text">{selectedCandidate.website}</span>
                </div>
              </div>

              <hr className="panel-divider" />

              {/* Scrollable Body Sections */}
              <div className="panel-sections-container">
                
                {/* 1. Summary */}
                <section className="detail-section">
                  <h4 className="section-subheader">Summary</h4>
                  <p className="summary-paragraph">{selectedCandidate.summary}</p>
                </section>

                <hr className="panel-divider" />

                {/* 2. Education */}
                <section className="detail-section">
                  <h4 className="section-subheader">Education</h4>
                  <div className="education-row">
                    <div className="edu-left">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="edu-icon">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5-10 5z" />
                        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                      </svg>
                      <div>
                        <div className="edu-univ font-medium">{selectedCandidate.education.university}</div>
                        <div className="edu-degree">{selectedCandidate.education.degree}</div>
                      </div>
                    </div>
                    <div className="edu-right-year">
                      {selectedCandidate.education.year}
                    </div>
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 3. Process Map */}
                <section className="detail-section">
                  <h4 className="section-subheader">Architectural Process Map</h4>
                  <div className="process-map-flow">
                    {selectedCandidate.processMap.map((step, idx) => (
                      <React.Fragment key={idx}>
                        <span className="flow-step-pill">{step}</span>
                        {idx < selectedCandidate.processMap.length - 1 && (
                          <span className="flow-arrow">➔</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 4. Safety / Quality */}
                <section className="detail-section">
                  <h4 className="section-subheader">Safety / Quality</h4>
                  <div className="guardrails-title font-medium">Reliability Guardrails</div>
                  <ul className="guardrails-list">
                    {selectedCandidate.reliabilityGuardrails.map((g, idx) => (
                      <li key={idx}>
                        <span className="bullet">●</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <hr className="panel-divider" />

                {/* 5. Root Cause Analysis */}
                <section className="detail-section">
                  <h4 className="section-subheader">Root Cause Analysis (RCA)</h4>
                  <div className="bordered-card border-purple-glow">
                    <div className="card-header-row">
                      <h5 className="card-title font-medium">{selectedCandidate.rca.title}</h5>
                      <span className="card-rating-pill">{selectedCandidate.rca.rating} ★</span>
                    </div>
                    <div className="card-block">
                      <strong>Root cause:</strong>
                      <p>{selectedCandidate.rca.cause}</p>
                    </div>
                    <div className="card-block">
                      <strong>Fix:</strong>
                      <p>{selectedCandidate.rca.fix}</p>
                    </div>
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 6. Technical Memo */}
                <section className="detail-section">
                  <h4 className="section-subheader">Technical Memo</h4>
                  <div className="bordered-card">
                    <div className="memo-title-row">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="doc-icon">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <h5 className="memo-title font-medium">{selectedCandidate.memo.title}</h5>
                    </div>
                    <p className="memo-summary">{selectedCandidate.memo.summary}</p>
                    <a href={selectedCandidate.memo.link} onClick={(e) => { e.preventDefault(); alert(`Opening document link: ${selectedCandidate.memo.link}`); }} className="memo-link">
                      View full technical RFC layout ➔
                    </a>
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 7. AI Usage */}
                <section className="detail-section">
                  <h4 className="section-subheader">AI Co-Pilot Integration</h4>
                  <div className="ai-tools-row">
                    {selectedCandidate.aiUsage.tools.map((t, idx) => (
                      <span key={idx} className="ai-tool-pill">{t}</span>
                    ))}
                  </div>
                  <ul className="ai-bullets-list">
                    {selectedCandidate.aiUsage.bullets.map((b, idx) => (
                      <li key={idx}>
                        <span className="bullet">●</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <hr className="panel-divider" />

                {/* 8. Experience */}
                <section className="detail-section">
                  <h4 className="section-subheader">Work Experience</h4>
                  <div className="experience-list">
                    {selectedCandidate.experience.map((exp, idx) => (
                      <div key={idx} className="experience-item">
                        <div className="exp-title-row">
                          <div>
                            <span className="exp-title font-medium">{exp.title}</span>
                            <span className="exp-company"> · {exp.company}</span>
                          </div>
                          <span className="exp-dates">{exp.dates}</span>
                        </div>
                        <ul className="exp-bullets">
                          {exp.bullets.map((b, bIdx) => (
                            <li key={bIdx}>{b}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 9. Mentor-Reviewed Evidence */}
                <section className="detail-section">
                  <h4 className="section-subheader">Mentor-Reviewed Evidence</h4>
                  <div className="evidence-cards-list">
                    {selectedCandidate.mentorReviews.map((rev, idx) => (
                      <div key={idx} className="bordered-card border-blue-glow">
                        <div className="evidence-hdr-row">
                          <h5 className="evidence-project font-medium">{rev.project}</h5>
                          <span className="evidence-rating">{rev.rating} ★</span>
                        </div>
                        <p className="evidence-desc">{rev.description}</p>
                        <div className="evidence-reviewer">Reviewed by <strong>{rev.reviewer}</strong></div>
                      </div>
                    ))}
                  </div>

                  <div className="evidence-metrics-summary-block">
                    <h5 className="summary-title font-medium">Aggregate Simulator Performance</h5>
                    <div className="metrics-summary-row">
                      <div className="metric-box">
                        <span className="lbl">Total Scenarios</span>
                        <span className="val">{selectedCandidate.scenarios}</span>
                      </div>
                      <div className="metric-box">
                        <span className="lbl">RCA Star Rating</span>
                        <span className="val">{selectedCandidate.rcaRating} ★</span>
                      </div>
                      <div className="metric-box">
                        <span className="lbl">Verified Evidence</span>
                        <span className="val">{selectedCandidate.evidence}</span>
                      </div>
                    </div>
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 10. Skills */}
                <section className="detail-section">
                  <h4 className="section-subheader">Technical Skills</h4>
                  <div className="skills-pill-wrap">
                    {selectedCandidate.skills.map((skill, idx) => (
                      <span key={idx} className="skill-pill large">{skill}</span>
                    ))}
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 11. Certifications */}
                <section className="detail-section">
                  <h4 className="section-subheader">Certifications & Badges</h4>
                  <div className="certifications-list">
                    {selectedCandidate.certifications.map((cert, idx) => (
                      <div key={idx} className="cert-row">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" className="award-ribbon-icon">
                          <circle cx="12" cy="8" r="7" />
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                        </svg>
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </section>

              </div>

            </div>

            {/* Sticky Footer */}
            <div className="panel-detail-footer">
              <span className={`availability-badge avail-${selectedCandidate.availability.toLowerCase().replace(' ', '-')}`}>
                {selectedCandidate.availability === 'Immediate' ? 'Immediate availability' : `Available in ${selectedCandidate.availability}`}
              </span>
              
              <button className="panel-contact-button" onClick={() => alert(`Contacting ${selectedCandidate.name} via recruiter dashboard integration...`)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" className="envelope-icon">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span>Contact Candidate</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
