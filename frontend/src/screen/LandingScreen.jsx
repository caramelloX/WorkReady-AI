import React from 'react';
import './LandingScreen.css';

export default function LandingScreen({ onNavigate }) {
  const handleLogoClick = (e) => {
    e.preventDefault();
    if (onNavigate) onNavigate('landing');
  };

  const handleLaunchDemo = () => {
    if (onNavigate) onNavigate('demo');
  };

  const handleNavClick = (section, e) => {
    e.preventDefault();
    const sectionElement = document.getElementById(section);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="landing-screen">
      {/* Dynamic ambient backgrounds */}
      <div className="landing-glow-1"></div>
      <div className="landing-glow-2"></div>

      {/* Header / Navigation bar */}
      <header className="landing-header">
        <div className="landing-logo" onClick={handleLogoClick}>
          <div className="landing-logo-icon">
            <svg viewBox="0 0 24 24" className="landing-logo-svg">
              <path
                fill="currentColor"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              />
            </svg>
          </div>
          <span>WorkReady AI</span>
        </div>

        <nav className="landing-nav">
          <a href="#features" className="landing-nav-link" onClick={(e) => handleNavClick('features', e)}>
            Features
          </a>
          <a href="#who-its-for" className="landing-nav-link" onClick={(e) => handleNavClick('who-its-for', e)}>
            Who it's for
          </a>
          <a href="#how-it-works" className="landing-nav-link" onClick={(e) => handleNavClick('how-it-works', e)}>
            How it works
          </a>
        </nav>

        <div className="landing-actions">
          <button className="landing-btn-text" onClick={handleLaunchDemo}>
            Sign in
          </button>
          <button className="landing-btn-primary" onClick={handleLaunchDemo}>
            Get started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="landing-hero-section">
        {/* Rounded badge */}
        <div className="landing-badge">
          <span className="landing-badge-dot"></span>
          <span>National Software Competition 2026 Entry</span>
        </div>

        {/* Heading */}
        <h1 className="landing-title">
          Turn fresh CS graduates into <span>work-ready</span> software engineers.
        </h1>

        {/* Subtitle */}
        <p className="landing-subtitle">
          WorkReady AI simulates real production incidents, coaches root-cause thinking,
          and builds an evidence portfolio mentors and employers can trust.
        </p>

        {/* Hero CTAs */}
        <div className="landing-hero-ctas">
          <button className="landing-btn-hero-primary" onClick={handleLaunchDemo}>
            <span>Launch Demo</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <button 
            className="landing-btn-hero-secondary"
            onClick={(e) => handleNavClick('features', e)}
          >
            See features
          </button>
        </div>

        {/* Stats Section */}
        <div id="stats" className="landing-stats-grid">
          <div className="landing-stat-card">
            <span className="landing-stat-num">1,284</span>
            <span className="landing-stat-label">Active Learners</span>
          </div>
          <div className="landing-stat-card">
            <span className="landing-stat-num">24+</span>
            <span className="landing-stat-label">Production Scenarios</span>
          </div>
          <div className="landing-stat-card">
            <span className="landing-stat-num">47</span>
            <span className="landing-stat-label">Tech Mentors</span>
          </div>
          <div className="landing-stat-card">
            <span className="landing-stat-num">92%</span>
            <span className="landing-stat-label">Hire-Ready Rate</span>
          </div>
        </div>
      </main>

      {/* Capabilities Section */}
      <section id="features" className="landing-capabilities-section">
        <div className="landing-capabilities-container">
          <div className="landing-section-header">
            <span className="landing-section-tag">Capabilities</span>
            <h2 className="landing-section-title">Everything a graduate needs to ship code on day one.</h2>
          </div>

          <div className="landing-capabilities-grid">
            {/* Card 1 */}
            <div className="landing-cap-card">
              <div className="landing-cap-icon-box">
                <svg viewBox="0 0 24 24" className="landing-cap-svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                  <path d="M6 8h4v4H6z" />
                </svg>
              </div>
              <h3 className="landing-cap-title">Scenario Simulator</h3>
              <p className="landing-cap-desc">
                Step into a live production system. Diagnose outages, regressions, and security events with AI-driven branching.
              </p>
            </div>

            {/* Card 2 */}
            <div className="landing-cap-card">
              <div className="landing-cap-icon-box">
                <svg viewBox="0 0 24 24" className="landing-cap-svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2Z" />
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2Z" />
                </svg>
              </div>
              <h3 className="landing-cap-title">RCA Coach</h3>
              <p className="landing-cap-desc">
                Guided 5-Whys and post-mortem analysis with a coaching agent that asks the questions a senior engineer would.
              </p>
            </div>

            {/* Card 3 */}
            <div className="landing-cap-card">
              <div className="landing-cap-icon-box">
                <svg viewBox="0 0 24 24" className="landing-cap-svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 className="landing-cap-title">Technical Memo Builder</h3>
              <p className="landing-cap-desc">
                Translate findings into clean post-mortems, RFCs, and incident reports — instantly reviewable.
              </p>
            </div>

            {/* Card 4 */}
            <div className="landing-cap-card">
              <div className="landing-cap-icon-box">
                <svg viewBox="0 0 24 24" className="landing-cap-svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="landing-cap-title">Mentor Workspace</h3>
              <p className="landing-cap-desc">
                Industry mentors review pull requests and reports, leave structured feedback, and flag at-risk mentees.
              </p>
            </div>

            {/* Card 5 */}
            <div className="landing-cap-card">
              <div className="landing-cap-icon-box">
                <svg viewBox="0 0 24 24" className="landing-cap-svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 11 11 13 15 9" />
                </svg>
              </div>
              <h3 className="landing-cap-title">Evidence Portfolio</h3>
              <p className="landing-cap-desc">
                Every solved scenario becomes a verified artifact. Recruiters see proof, not promises.
              </p>
            </div>

            {/* Card 6 */}
            <div className="landing-cap-card">
              <div className="landing-cap-icon-box">
                <svg viewBox="0 0 24 24" className="landing-cap-svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <h3 className="landing-cap-title">Skill Gap Engine</h3>
              <p className="landing-cap-desc">
                Continuous diagnostics map each learner to software engineering competencies — and prescribe what's next.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience Section ("Who it's for") */}
      <section id="who-its-for" className="landing-audience-section">
        <div className="landing-audience-container">
          <div className="landing-audience-grid">
            {/* Student Card */}
            <div className="landing-aud-card">
              <span className="landing-aud-tag">FOR STUDENTS</span>
              <p className="landing-aud-text">Fresh CS graduates building real engineering readiness.</p>
            </div>

            {/* Mentor Card */}
            <div className="landing-aud-card">
              <span className="landing-aud-tag">FOR MENTORS</span>
              <p className="landing-aud-text">Senior engineers shaping the next generation, asynchronously.</p>
            </div>

            {/* Admin Card */}
            <div className="landing-aud-card">
              <span className="landing-aud-tag">FOR ADMINS</span>
              <p className="landing-aud-text">Programs & TPOs tracking cohort outcomes and ROI.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to see it in action / Bottom CTA Section */}
      <section id="how-it-works" className="landing-cta-section">
        <div className="landing-cta-container">
          <h2 className="landing-cta-title">Ready to see it in action?</h2>
          <p className="landing-cta-subtitle">Pick a role and explore the workspace with realistic demo data.</p>
          <button className="landing-cta-btn" onClick={handleLaunchDemo}>
            <span>Try the demo</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </section>
    </div>
  );
}
