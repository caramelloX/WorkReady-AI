import React, { useState } from 'react';
import './RegisterScreen.css';
import { api } from '../api.js';

export default function RegisterScreen({ onNavigate }) {
  const [role, setRole] = useState('student'); // 'student' or 'mentor'
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetTrack, setTargetTrack] = useState('');
  const [targetIndustry, setTargetIndustry] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!agreeTerms) {
      setErrorMessage('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    console.log('[DEBUG] Frontend submitting registration data:', { role, fullName, username, email, password, target_track: targetTrack, target_industry: targetIndustry });

    try {
      const resData = await api.register(role, fullName, username, email, password, targetTrack, targetIndustry);
      if (resData.success && resData.user) {
        // Save the logged-in user session
        localStorage.setItem('currentUser', JSON.stringify(resData.user));
        alert(`Account created successfully! Welcome, ${fullName}.`);
        
        if (role === 'student') {
          onNavigate('demo'); // Renders the Student Screen workspace
        } else {
          onNavigate('mentor'); // Renders the Mentor Workspace
        }
      } else {
        setErrorMessage('Failed to create account. Please try again.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create account.');
    }
  };

  return (
    <div className="register-screen-container">
      {/* Left Brand Panel */}
      <div className="register-left-panel">
        <div className="register-left-glow"></div>
        
        {/* Brand Logo */}
        <div className="register-brand-logo" onClick={() => onNavigate('landing')}>
          <div className="register-brand-logo-icon">
            <svg className="register-brand-logo-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span>WorkReady AI</span>
        </div>

        {/* Left Main Content */}
        <div className="register-left-content">
          <h1 className="register-left-title">Build Job-Ready Competence.</h1>
          <p className="register-left-subtitle">
            Join the elite simulator platform where software engineers resolve production incidents and compile stellar diagnostic evidence portfolios.
          </p>
          <ul className="register-feature-list">
            <li>
              <span className="bullet-dot">✓</span> Live-replica transaction database incidents
            </li>
            <li>
              <span className="bullet-dot">✓</span> Direct assessment & highlights from expert mentors
            </li>
            <li>
              <span className="bullet-dot">✓</span> Direct matching opportunities with target recruiters
            </li>
          </ul>
        </div>

        {/* Left Footer */}
        <div className="register-left-footer">
          © 2026 WorkReady AI Inc. Powered by advanced agentic simulators.
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="register-right-panel">
        <div className="register-form-container">
          
          <div className="register-form-header">
            <h2 className="register-form-title">Create your account</h2>
            <p className="register-form-subtitle">Choose your pathway and start training today.</p>
          </div>

          {errorMessage && (
            <div className="register-error-banner">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Role Selector Pills */}
            <div className="register-form-group">
              <label className="register-field-label">I want to register as a</label>
              <div className="register-role-selector">
                <button
                  type="button"
                  className={`register-role-pill ${role === 'student' ? 'active' : ''}`}
                  onClick={() => setRole('student')}
                >
                  <svg className="register-role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                  </svg>
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  className={`register-role-pill ${role === 'mentor' ? 'active' : ''}`}
                  onClick={() => setRole('mentor')}
                >
                  <svg className="register-role-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span>Mentor</span>
                </button>
              </div>
            </div>

            {/* Full Name & Username */}
            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="fullname" className="register-field-label">Full Name</label>
                <input
                  id="fullname"
                  type="text"
                  className="register-input-field"
                  placeholder="e.g. Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="register-form-group">
                <label htmlFor="username" className="register-field-label">Username</label>
                <input
                  id="username"
                  type="text"
                  className="register-input-field"
                  placeholder="e.g. janedoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="register-form-group">
              <label htmlFor="email" className="register-field-label">Email Address</label>
              <input
                id="email"
                type="email"
                className="register-input-field"
                placeholder="e.g. jane.doe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="register-form-group">
              <label htmlFor="password" className="register-field-label">Password</label>
              <input
                id="password"
                type="password"
                className="register-input-field"
                placeholder="Choose a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Target Track & Industry (Student only) */}
            {role === 'student' && (
              <div className="register-form-row">
                <div className="register-form-group">
                  <label htmlFor="targetTrack" className="register-field-label">Target Track (Optional)</label>
                  <select
                    id="targetTrack"
                    className="register-input-field"
                    value={targetTrack}
                    onChange={(e) => setTargetTrack(e.target.value)}
                  >
                    <option value="">Select a track</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Product Manager">Product Manager</option>
                  </select>
                </div>
                <div className="register-form-group">
                  <label htmlFor="targetIndustry" className="register-field-label">Target Industry (Optional)</label>
                  <input
                    id="targetIndustry"
                    type="text"
                    className="register-input-field"
                    placeholder="e.g. Fintech, Healthtech"
                    value={targetIndustry}
                    onChange={(e) => setTargetIndustry(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Terms of Service Checkbox */}
            <div className="register-checkbox-group">
              <input
                id="terms"
                type="checkbox"
                className="register-checkbox-input"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                required
              />
              <label htmlFor="terms" className="register-checkbox-label">
                I agree to the <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a> and <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>, and consent to diagnostic simulator metrics sharing.
              </label>
            </div>

            {/* Create Account Button */}
            <button type="submit" className="register-btn-primary">
              <span>Create Account</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </form>

          {/* Form Footer */}
          <div className="register-form-footer">
            Already have an account?
            <a
              href="#"
              className="register-signin-link"
              onClick={(e) => {
                e.preventDefault();
                onNavigate('login');
              }}
            >
              Sign in
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
