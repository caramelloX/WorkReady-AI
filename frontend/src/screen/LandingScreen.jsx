import React from 'react';
import './LandingScreen.css';
import { useLanguage } from '../contexts/LanguageContext';

export default function LandingScreen({ onNavigate }) {
  const { t } = useLanguage();
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse currentUser', e);
      }
    }
  }, []);

  const handleContinue = () => {
    if (currentUser && currentUser.role) {
      const target = currentUser.role === 'student' ? 'demo' : currentUser.role;
      onNavigate(target);
    } else {
      onNavigate('demo'); // fallback
    }
  };

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
          <span>{t('landing.brand')}</span>
        </div>
        <div className="landing-nav-actions">
          {currentUser ? (
            <>
              <button className="landing-btn-login" onClick={() => onNavigate('login')}>{t('landing.nav.login')}</button>
              <button className="landing-btn-register" onClick={handleContinue}>
                Continue as {currentUser.username || 'User'}
              </button>
            </>
          ) : (
            <>
              <button className="landing-btn-login" onClick={() => onNavigate('login')}>{t('landing.nav.login')}</button>
              <button className="landing-btn-register" onClick={() => onNavigate('register')}>{t('landing.nav.register')}</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="landing-hero">
        <div className="landing-hero-glow"></div>
        <div className="landing-hero-content">
          <h1 className="landing-headline">
            {t('landing.hero.title1')}<br />
            <span className="landing-headline-highlight">{t('landing.hero.title2')}</span>
          </h1>
          <p className="landing-subheadline">
            {t('landing.hero.subtitle')}
          </p>
          <div className="landing-hero-actions">
            {currentUser ? (
              <>
                <button className="landing-btn-primary" onClick={handleContinue}>
                  Continue as {currentUser.username || 'User'}
                </button>
                <button className="landing-btn-secondary" onClick={() => onNavigate('login')}>
                  {t('landing.hero.btnSecondary')}
                </button>
              </>
            ) : (
              <>
                <button className="landing-btn-primary" onClick={() => onNavigate('register')}>
                  {t('landing.hero.btnPrimary')}
                </button>
                <button className="landing-btn-secondary" onClick={() => onNavigate('login')}>
                  {t('landing.hero.btnSecondary')}
                </button>
              </>
            )}
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
          <h3>{t('landing.feature1.title')}</h3>
          <p>{t('landing.feature1.desc')}</p>
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
          <h3>{t('landing.feature2.title')}</h3>
          <p>{t('landing.feature2.desc')}</p>
        </div>

        <div className="landing-feature-card">
          <div className="landing-feature-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <h3>{t('landing.feature3.title')}</h3>
          <p>{t('landing.feature3.desc')}</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>{t('landing.footer')}</p>
      </footer>
    </div>
  );
}
