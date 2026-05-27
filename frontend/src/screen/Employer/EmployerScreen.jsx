import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './EmployerScreen.css';
import { api } from '../../components/api.js';
import { Briefcase, Search, LogOut, LayoutDashboard } from 'lucide-react';
import StudentSettings from '../Student/StudentSettings';

export default function EmployerScreen({ onNavigate }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');
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
        const data = await api.getCandidates({
          q: debouncedQuery,
          domain: domainFilter,
          experience: experienceFilter
        });
        setCandidates(data);
      } catch (err) {
        console.error('Failed to retrieve candidates from database:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCandidates();
  }, [debouncedQuery, domainFilter, experienceFilter]);


  // Removed client-side filteredCandidates logic as search happens via backend

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
            <LayoutDashboard size={18} />
          </div>
          <span>WorkReady AI</span>
        </div>

        <div className="employer-sidebar-header">{t('employer.portalAccess')}</div>

        <nav className="employer-sidebar-nav">
          <button className={`employer-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <Briefcase className="employer-nav-icon" />
            <span>{t('employer.talentSearch')}</span>
          </button>
        </nav>

        <div className="employer-sidebar-footer">
          <button className="employer-nav-btn" onClick={() => onNavigate('logout')} style={{ color: '#ef4444' }}>
            <LogOut className="employer-nav-icon" />
            <span>{t('employer.backToHome')}</span>
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="employer-main-panel">
        {activeTab === 'dashboard' && (<>
        
        {/* Header Section */}
        <header className="employer-header">
          <div className="employer-header-title-box">
            <h1 className="employer-page-title">{t('employer.title')}</h1>
            <p className="employer-page-subtitle">{t('employer.subtitle')}</p>
          </div>
        </header>

        <main className="employer-content">
          {/* 2. Search Component & Filters */}
          <div className="employer-search-filter-section">
            <div className="employer-search-bar-container">
              <Search className="employer-search-icon" size={18} />
              <input
                type="text"
                placeholder={t('employer.searchPlaceholder')}
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
                <input
                  type="text"
                  className="employer-filter-dropdown"
                  placeholder={t('employer.allTracks')}
                  value={domainFilter === 'All tracks' ? '' : domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value || 'All tracks')}
                />
              </div>

              <div className="employer-filter-dropdown-wrapper">
                <select
                  className="employer-filter-dropdown"
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(e.target.value)}
                >
                  <option value="Any">{t('employer.anyLevel')}</option>
                  <option value="Job-ready">{t('employer.jobReady')}</option>
                  <option value="Competent">{t('employer.competent')}</option>
                  <option value="Developing">{t('employer.developing')}</option>
                  <option value="Foundational">{t('employer.foundational')}</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="employer-loading-container">
              <div className="employer-loading-spinner"></div>
              <p>{t('employer.syncing')}</p>
            </div>
          ) : isEmptyState ? (
            <div className="employer-empty-state-card">
              <div className="employer-empty-state-inner">
                <svg className="employer-empty-state-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <path d="M8 11h6" />
                </svg>
                <h3>{t('employer.refineSearch')}</h3>
                <p>{t('employer.enterSearch')}</p>
                <div className="employer-empty-state-quick-keywords">
                  <span>{t('employer.try')}</span>
                  <button onClick={() => setSearchQuery('Kubernetes')}>Kubernetes</button>
                  <button onClick={() => setSearchQuery('React')}>React</button>
                  <button onClick={() => setDomainFilter('Backend')}>{t('employer.backendTrack')}</button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* 3. Search Results Header */}
              <div className="employer-results-header">
                <div className="employer-results-summary">
                  {t('employer.showing')} <strong>{candidates.length}</strong> {t('employer.verifiedCand')}
                </div>
                <div className="employer-results-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14" className="badge-check-icon">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>{t('employer.verifiedPortfolios')}</span>
                </div>
              </div>

              {/* Grid Layout */}
              {candidates.length === 0 ? (
                <div className="employer-no-results-card">
                  <p>{t('employer.noCandidates').replace('{query}', debouncedQuery)}</p>
                  <button className="employer-reset-btn" onClick={() => { setSearchQuery(''); setDomainFilter('All tracks'); setExperienceFilter('Any'); }}>
                    {t('employer.clearFilters')}
                  </button>
                </div>
              ) : (
                <div className="employer-candidate-grid">
                  {candidates.map((cand) => (
                    /* 4. Candidate Card Anatomy */
                    <div key={cand.id} className="employer-candidate-card" onClick={() => handleOpenPanel(cand)}>
                      
                      {/* Top Row (Profile Summary) */}
                      <div className="card-top-row">
                        <div className="avatar-circle">
                          {cand.avatar_base64 ? (
                            <img src={cand.avatar_base64} alt={cand.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                          ) : (
                            cand.avatar
                          )}
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
                          <span className="label">{t('employer.scenarios')}</span>
                          <span className="value">{cand.scenarios}</span>
                        </div>
                        <div className="metric-col border-x">
                          <span className="label">{t('employer.rca')}</span>
                          <span className="value">{cand.rcaRating} <span className="star-icon">★</span></span>
                        </div>
                        <div className="metric-col">
                          <span className="label">{t('employer.evidence')}</span>
                          <span className="value">{cand.evidence}</span>
                        </div>
                      </div>

                      {/* Bottom Row (Availability & Action) */}
                      <div className="card-bottom-row">
                        <span className={`availability-badge avail-${cand.availability.toLowerCase().replace(' ', '-')}`}>
                          {cand.availability === 'Immediate' ? t('employer.immediate') : `${t('employer.availableIn').split('{')[0]}${cand.availability}`}
                        </span>
                        <button className="view-portfolio-btn" onClick={(e) => { e.stopPropagation(); handleOpenPanel(cand); }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" className="eye-icon">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <span>{t('employer.view')}</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
        </>)}

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
                    <span>{t('employer.verifiedPortfolio')}</span>
                  </div>
                  <div className="panel-wr-score-display">
                    <span className="lbl">{t('employer.wrScore')}</span>
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
                  <h4 className="section-subheader">{t('employer.summary')}</h4>
                  <p className="summary-paragraph">{selectedCandidate.summary}</p>
                </section>

                <hr className="panel-divider" />

                {/* 2. Education */}
                <section className="detail-section">
                  <h4 className="section-subheader">{t('employer.education')}</h4>
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
                  <h4 className="section-subheader">{t('employer.processMap')}</h4>
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
                  <h4 className="section-subheader">{t('employer.safetyQuality')}</h4>
                  <div className="guardrails-title font-medium">{t('employer.guardrails')}</div>
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
                  <h4 className="section-subheader">{t('employer.rcaSection')}</h4>
                  <div className="bordered-card border-purple-glow">
                    <div className="card-header-row">
                      <h5 className="card-title font-medium">{selectedCandidate.rca.title}</h5>
                      <span className="card-rating-pill">{selectedCandidate.rca.rating} ★</span>
                    </div>
                    <div className="card-block">
                      <strong>{t('employer.rootCause')}</strong>
                      <p>{selectedCandidate.rca.cause}</p>
                    </div>
                    <div className="card-block">
                      <strong>{t('employer.fix')}</strong>
                      <p>{selectedCandidate.rca.fix}</p>
                    </div>
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 6. Technical Memo */}
                <section className="detail-section">
                  <h4 className="section-subheader">{t('employer.technicalMemo')}</h4>
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
                      {t('employer.viewRfc')}
                    </a>
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 7. AI Usage */}
                <section className="detail-section">
                  <h4 className="section-subheader">{t('employer.aiIntegration')}</h4>
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
                  <h4 className="section-subheader">{t('employer.workExperience')}</h4>
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
                  <h4 className="section-subheader">{t('employer.mentorReviewed')}</h4>
                  <div className="evidence-cards-list">
                    {selectedCandidate.mentorReviews.map((rev, idx) => (
                      <div key={idx} className="bordered-card border-blue-glow">
                        <div className="evidence-hdr-row">
                          <h5 className="evidence-project font-medium">{rev.project}</h5>
                          <span className="evidence-rating">{rev.rating} ★</span>
                        </div>
                        <p className="evidence-desc">{rev.description}</p>
                        <div className="evidence-reviewer">{t('employer.reviewedBy').replace('{reviewer}', '')} <strong>{rev.reviewer}</strong></div>
                      </div>
                    ))}
                  </div>

                  <div className="evidence-metrics-summary-block">
                    <h5 className="summary-title font-medium">{t('employer.aggregateSim')}</h5>
                    <div className="metrics-summary-row">
                      <div className="metric-box">
                        <span className="lbl">{t('employer.totalScenarios')}</span>
                        <span className="val">{selectedCandidate.scenarios}</span>
                      </div>
                      <div className="metric-box">
                        <span className="lbl">{t('employer.rcaRating')}</span>
                        <span className="val">{selectedCandidate.rcaRating} ★</span>
                      </div>
                      <div className="metric-box">
                        <span className="lbl">{t('employer.verifiedEvidence')}</span>
                        <span className="val">{selectedCandidate.evidence}</span>
                      </div>
                    </div>
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 10. Skills */}
                <section className="detail-section">
                  <h4 className="section-subheader">{t('employer.technicalSkills')}</h4>
                  <div className="skills-pill-wrap">
                    {selectedCandidate.skills.map((skill, idx) => (
                      <span key={idx} className="skill-pill large">{skill}</span>
                    ))}
                  </div>
                </section>

                <hr className="panel-divider" />

                {/* 11. Certifications */}
                <section className="detail-section">
                  <h4 className="section-subheader">{t('employer.certifications')}</h4>
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
                {selectedCandidate.availability === 'Immediate' ? t('employer.immediate') : `${t('employer.availableIn').split('{')[0]}${selectedCandidate.availability}`}
              </span>
              

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
