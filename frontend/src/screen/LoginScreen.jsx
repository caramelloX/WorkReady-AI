import React, { useState } from 'react';
import './LoginScreen.css';
import { api } from '../api.js';
import ProfileCompletionModal from '../components/ProfileCompletionModal';

export default function LoginScreen({ onNavigate }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

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
        
        const role = resData.user.role;
        if (role === 'mentor') {
          if (onNavigate) onNavigate('mentor');
        } else if (role === 'admin' || role === 'employer') {
          if (onNavigate) onNavigate('admin');
        } else {
          // If Student
          if (resData.user.profile_completed) {
            if (onNavigate) onNavigate('demo');
          } else {
            setLoggedInUser(resData.user);
            setShowProfileModal(true);
          }
        }
      } else {
        setErrorMessage('Failed to sign in. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid username or password.');
    }
  };

  const handleContinueAsEmployer = () => {
    if (onNavigate) onNavigate('admin');
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
            Industry-grade engineering practice, before day one.
          </h1>
          <p className="login-left-subtitle">
            Step into a live production system. Diagnose, document, and prove your readiness with mentor-verified evidence.
          </p>
        </div>

        {/* Competition Footer */}
        <div className="login-left-footer">
          National Software Competition 2026
        </div>
      </div>

      {/* Right Column: Form Panel */}
      <div className="login-right-panel">
        <div className="login-form-container">
          {/* Header */}
          <div className="login-form-header">
            <h2 className="login-form-title">Welcome back</h2>
            <p className="login-form-subtitle">Sign in to continue your training.</p>
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
                <label htmlFor="username" className="login-field-label">Username</label>
              </div>
              <input
                id="username"
                type="text"
                className="login-input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>

            {/* Password */}
            <div className="login-form-group">
              <div className="login-label-row">
                <label htmlFor="password" className="login-field-label">Password</label>
                <a href="#forgot" className="login-forgot-link" onClick={(e) => e.preventDefault()}>Forgot?</a>
              </div>
              <input
                id="password"
                type="password"
                className="login-input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Submit Button */}
            <button type="submit" className="login-btn-primary">
              <span>Sign in</span>
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
          <div className="login-divider">or</div>

          {/* Continue as Employer Button */}
          <button className="login-btn-secondary" onClick={handleContinueAsEmployer}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="login-btn-secondary-icon">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            <span>Continue as Employer — find students</span>
          </button>



          {/* Form Footer */}
          <div className="login-form-footer">
            New to WorkReady AI? 
            <a href="#signup" className="login-signup-link" onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('register'); }}>Create an account</a>
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
