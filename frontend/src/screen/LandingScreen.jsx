import React from 'react';
import './LandingScreen.css';

export default function LandingScreen({ onNavigate }) {
  return (
    <div className="landing-container">
      {/* Navbar */}
      <nav className="landing-nav">
        <div className="landing-brand">
          <div className="landing-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span>WorkReady AI</span>
        </div>
        <div className="landing-nav-actions">
          <button className="landing-btn-login" onClick={() => onNavigate('login')}>Sign In</button>
          <button className="landing-btn-register" onClick={() => onNavigate('register')}>Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero">
        <div className="landing-hero-glow"></div>
        <div className="landing-hero-content">
          <h1 className="landing-headline">
            Experience Production.<br />
            <span className="landing-headline-highlight">Before Day One.</span>
          </h1>
          <p className="landing-subheadline">
            Step into live-replica engineering environments. Resolve database incidents, debug APIs, and build a mentor-verified portfolio that proves you are job-ready.
          </p>
          <div className="landing-hero-actions">
            <button className="landing-btn-primary" onClick={() => onNavigate('register')}>
              Start Training Now
            </button>
            <button className="landing-btn-secondary" onClick={() => onNavigate('login')}>
              Returning User
            </button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="landing-features">
        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <h3>Live Simulators</h3>
          <p>Tackle real-world scenarios in a sandboxed, risk-free environment. No generic coding puzzles.</p>
        </div>

        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3>Mentor Verified</h3>
          <p>Get your solutions reviewed by industry experts and build a verified engineering portfolio.</p>
        </div>

        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3>Employer Matching</h3>
          <p>Companies hire directly from the platform based on your demonstrated competence.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>© 2026 WorkReady AI Inc. Powered by advanced agentic simulators.</p>
      </footer>
    </div>
  );
}
