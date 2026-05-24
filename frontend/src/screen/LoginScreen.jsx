import React, { useState } from 'react';
import './LoginScreen.css';
import { api } from '../api.js';
import ProfileCompletionModal from '../components/ProfileCompletionModal';
import { useLanguage } from '../contexts/LanguageContext';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginScreen({ onNavigate }) {
  const { t } = useLanguage();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Saved Accounts State
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [showSavedAccounts, setShowSavedAccounts] = useState(true);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('savedAccounts');
      if (stored) {
        const accounts = JSON.parse(stored);
        if (accounts && accounts.length > 0) {
          const filteredAccounts = accounts.filter(acc => acc.role === 'mentor' || acc.role === 'student');
          setSavedAccounts(filteredAccounts);
        }
      }
    } catch (e) {}
  }, []);

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (onNavigate) onNavigate('landing');
  };

  const handleSignIn = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');
    
    try {
      const resData = await api.login(username, password);
      if (resData.success && resData.user) {
        // Store session info
        localStorage.setItem('currentUser', JSON.stringify(resData.user));
        
        // Add to saved accounts for easy re-login
        try {
          const existingAccountsStr = localStorage.getItem('savedAccounts');
          let existingAccounts = [];
          if (existingAccountsStr) existingAccounts = JSON.parse(existingAccountsStr);
          // Remove duplicate username
          existingAccounts = existingAccounts.filter(acc => acc.username !== resData.user.username);
          // Only save mentor and student accounts
          if (resData.user.role === 'mentor' || resData.user.role === 'student') {
            existingAccounts.unshift(resData.user);
          }
          localStorage.setItem('savedAccounts', JSON.stringify(existingAccounts));
        } catch(e) {}
        
        // Clear any saved active tabs so user always lands on the dashboard
        sessionStorage.removeItem('studentActiveTab');
        sessionStorage.removeItem('mentorActiveTab');
        sessionStorage.removeItem('adminActiveTab');
        
        const role = resData.user.role;
        if (role === 'mentor') {
          if (onNavigate) onNavigate('mentor');
        } else if (role === 'admin' || role === 'employer') {
          if (onNavigate) onNavigate('admin');
        } else {
          if (resData.user.profile_completed) {
            if (onNavigate) onNavigate('demo');
          } else {
            setLoggedInUser(resData.user);
            setShowProfileModal(true);
          }
        }
      } else {
        setErrorMessage(t('login.errorMsg'));
      }
    } catch (err) {
      setErrorMessage(err.message === 'Account suspended. Please contact support.' ? err.message : t('login.errorMsg'));
    }
  };

  const handleContinueAsEmployer = () => {
    if (onNavigate) onNavigate('employer');
  };

  const handleSavedAccountClick = (account) => {
    // Instead of auto-login, pre-fill the username and show the password form
    setUsername(account.username);
    setPassword('');
    setShowSavedAccounts(false);
    // Focus the password input automatically if possible, otherwise they just type it
  };

  return (
    <div className="login-screen-container">
      {/* Left Column: Branding and Gradient */}
      <div className="login-left-panel">
        <div className="login-left-glow"></div>

        {/* Logo */}
        <div className="login-brand-logo" onClick={handleLogoClick}>
          <div className="login-brand-logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" className="login-brand-logo-svg">
              {/* Premium 4-pointed AI Spark */}
              <path d="M12 2a0.75 0.75 0 0 0-.75.75c0 4.5-3.5 8-8 8a0.75 0.75 0 0 0 0 1.5c4.5 0 8 3.5 8 8a0.75 0.75 0 0 0 1.5 0c0-4.5 3.5-8 8-8a0.75 0.75 0 0 0 0-1.5c-4.5 0-8-3.5-8-8A0.75 0.75 0 0 0 12 2z" />
              <circle cx="5" cy="5" r="1.2" />
              <circle cx="19" cy="18" r="1" />
            </svg>
          </div>
          <span>WorkReady AI</span>
        </div>

        {/* Hero Branding Info */}
        <div className="login-left-content">
          <h1 className="login-left-title">
            {t('login.title')}
          </h1>
          <p className="login-left-subtitle">
            {t('login.subtitle')}
          </p>
        </div>

        {/* Competition Footer */}
        <div className="login-left-footer">
          {t('login.footer')}
        </div>
      </div>

      {/* Right Column: Form Panel */}
      <div className="login-right-panel">
        <div className="login-form-container">
          
          {savedAccounts.length > 0 && showSavedAccounts ? (
            <>
              <div className="login-form-header">
                <h2 className="login-form-title">{t('login.recentAccounts')}</h2>
                <p className="login-form-subtitle">{t('login.recentAccountsDesc')}</p>
              </div>
              
              <div className="saved-accounts-list">
                {savedAccounts.map((acc, idx) => (
                  <div key={idx} className="saved-account-item" onClick={() => handleSavedAccountClick(acc)}>
                    <div className="saved-avatar">{(acc.fullname || acc.username)[0].toUpperCase()}</div>
                    <div className="saved-info">
                      <div className="saved-name">{acc.fullname || acc.username}</div>
                      <div className="saved-role">@{acc.username} • {acc.role}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button type="button" className="login-btn-secondary" onClick={() => setShowSavedAccounts(false)}>
                {t('login.otherAccount')}
              </button>
              
              <div className="login-divider" style={{margin: '16px 0'}}>{t('login.or')}</div>
              
              <button className="login-btn-secondary" onClick={handleContinueAsEmployer}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="login-btn-secondary-icon">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <span>{t('login.employer')}</span>
              </button>
            </>
          ) : (
            <>
              {/* Header */}
              <div className="login-form-header">
                <h2 className="login-form-title">{t('login.welcome')}</h2>
                <p className="login-form-subtitle">{t('login.welcomeSub')}</p>
              </div>
              {errorMessage && (
                <div className="login-error-banner">
                  {errorMessage}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSignIn}>
                {/* Username */}
                <div className="login-form-group">
                  <div className="login-label-row">
                    <label htmlFor="username" className="login-field-label">{t('login.username')}</label>
                  </div>
                  <input
                    id="username"
                    type="text"
                    className="login-input-field"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('login.usernamePlaceholder')}
                    required
                  />
                </div>

                {/* Password */}
                <div className="login-form-group">
                  <div className="login-label-row">
                    <label htmlFor="password" className="login-field-label">{t('login.password')}</label>
                    <a href="#forgot" className="login-forgot-link" onClick={(e) => e.preventDefault()}>{t('login.forgot')}</a>
                  </div>
                  <div className="password-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      className="login-input-field"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('login.passwordPlaceholder')}
                      required
                      style={{ paddingRight: '44px' }}
                    />
                    <button 
                      type="button" 
                      className="password-toggle-icon" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '12px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex' }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button type="submit" className="login-btn-primary">
                  <span>{t('login.signin')}</span>
                  <svg
                    width="16"
                    height="16"
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
              </form>

              {/* Divider */}
              <div className="login-divider">{t('login.or')}</div>

              {/* Continue as Employer Button */}
              <button className="login-btn-secondary" onClick={handleContinueAsEmployer}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="login-btn-secondary-icon">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                </svg>
                <span>{t('login.employer')}</span>
              </button>
              
              {/* Add Back to Saved Accounts link if any exist */}
              {savedAccounts.length > 0 && (
                <div style={{textAlign: 'center', marginTop: '16px'}}>
                  <a href="#saved" className="login-signup-link" onClick={(e) => { e.preventDefault(); setShowSavedAccounts(true); }}>
                    {t('login.backToSaved')}
                  </a>
                </div>
              )}
            </>
          )}



          {/* Form Footer */}
          <div className="login-form-footer">
            {t('login.newTo')}
            <a href="#signup" className="login-signup-link" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('register'); }}>{t('login.createAccount')}</a>
          </div>
        </div>
      </div>
      
      {showProfileModal && loggedInUser && (
        <ProfileCompletionModal 
          user={loggedInUser} 
          onComplete={(updatedUser) => {
            setShowProfileModal(false);
            if (onNavigate) onNavigate('demo');
          }} 
        />
      )}
    </div>
  );
}
