import React, { useState } from 'react';
import './RegisterScreen.css';

export default function RegisterScreen({ onNavigate }) {
  const [role, setRole] = useState('student'); // 'student' or 'mentor'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogoClick = (e) => {
    e.preventDefault();
    if (onNavigate) onNavigate('landing');
  };

  const handleSignInClick = (e) => {
    e.preventDefault();
    if (onNavigate) onNavigate('login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMessage('You must agree to the Terms and Privacy Policy.');
      return;
    }
    
    setErrorMessage('');
    // Successful registration mock: navigate to student screen ('demo')
    if (onNavigate) onNavigate('demo');
  };

  return (
    <div className="register-screen-container">
      {/* Left Column: Branding and Gradient Info */}
      <div className="register-left-panel">
        <div className="register-left-glow"></div>

        {/* Logo */}
        <div className="register-brand-logo" onClick={handleLogoClick}>
          <div className="register-brand-logo-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" className="register-brand-logo-svg">
              {/* Premium 4-pointed AI Spark */}
              <path d="M12 2a0.75 0.75 0 0 0-.75.75c0 4.5-3.5 8-8 8a0.75 0.75 0 0 0 0 1.5c4.5 0 8 3.5 8 8a0.75 0.75 0 0 0 1.5 0c0-4.5 3.5-8 8-8a0.75 0.75 0 0 0 0-1.5c-4.5 0-8-3.5-8-8A0.75 0.75 0 0 0 12 2z" />
              <circle cx="5" cy="5" r="1.2" />
              <circle cx="19" cy="18" r="1" />
            </svg>
          </div>
          <span>WorkReady AI</span>
        </div>

        {/* Hero Branding Info */}
        <div className="register-left-content">
          <h1 className="register-left-title">
            Start your journey to becoming work-ready.
          </h1>
          <p className="register-left-subtitle">
            Join 1,200+ engineering graduates training on real production scenarios — mentored by industry leaders.
          </p>

          {/* Bullet Points */}
          <ul className="register-feature-list">
            <li>
              <span className="bullet-dot">•</span>
              <span>24+ live production scenarios</span>
            </li>
            <li>
              <span className="bullet-dot">•</span>
              <span>AI-guided RCA and post-mortem coaching</span>
            </li>
            <li>
              <span className="bullet-dot">•</span>
              <span>Mentor-verified evidence portfolio</span>
            </li>
          </ul>
        </div>

        {/* Competition Footer */}
        <div className="register-left-footer">
          National Software Competition 2026
        </div>
      </div>

      {/* Right Column: Registration Form Panel */}
      <div className="register-right-panel">
        <div className="register-form-container">
          {/* Header */}
          <div className="register-form-header">
            <h2 className="register-form-title">Create your account</h2>
            <p className="register-form-subtitle">Takes less than a minute.</p>
          </div>

          {errorMessage && <div className="register-error-banner">{errorMessage}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Joining As Selector */}
            <div className="register-form-group">
              <label className="register-field-label">I'm joining as</label>
              <div className="register-role-selector">
                <button
                  type="button"
                  className={`register-role-pill ${role === 'student' ? 'active' : ''}`}
                  onClick={() => setRole('student')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="register-role-icon">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                  </svg>
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  className={`register-role-pill ${role === 'mentor' ? 'active' : ''}`}
                  onClick={() => setRole('mentor')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="register-role-icon">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>Mentor</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="register-form-group">
              <label htmlFor="fullName" className="register-field-label">Full name</label>
              <input
                id="fullName"
                type="text"
                className="register-input-field"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Aarav Sharma"
                required
              />
            </div>

            {/* Email */}
            <div className="register-form-group">
              <label htmlFor="email" className="register-field-label">Email</label>
              <input
                id="email"
                type="email"
                className="register-input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@university.edu"
                required
              />
            </div>

            {/* Username */}
            <div className="register-form-group">
              <label htmlFor="username" className="register-field-label">Username</label>
              <input
                id="username"
                type="text"
                className="register-input-field"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="aarav.sharma"
                required
              />
            </div>

            {/* Password Fields (Side-by-Side) */}
            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="password" className="register-field-label">Password</label>
                <input
                  id="password"
                  type="password"
                  className="register-input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="register-form-group">
                <label htmlFor="confirmPassword" className="register-field-label">Confirm</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="register-input-field"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Terms and Privacy Checkbox */}
            <div className="register-checkbox-group">
              <input
                id="agreeTerms"
                type="checkbox"
                className="register-checkbox-input"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
              <label htmlFor="agreeTerms" className="register-checkbox-label">
                I agree to the WorkReady AI <a href="#terms" onClick={(e) => e.preventDefault()}>Terms</a> and <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="register-btn-primary">
              <span>Create account</span>
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

          {/* Form Footer */}
          <div className="register-form-footer">
            Already have an account? 
            <a href="#signin" className="register-signin-link" onClick={handleSignInClick}>Sign in</a>
          </div>
        </div>
      </div>
    </div>
  );
}
