import React, { useState } from 'react';
import './RegisterScreen.css';
import { api } from '../api.js';
import ProfileCompletionModal from '../components/ProfileCompletionModal';

export default function RegisterScreen({ onNavigate }) {
  const [role, setRole] = useState('student'); // 'student' or 'mentor'
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetTrack, setTargetTrack] = useState('');
  const [targetIndustry, setTargetIndustry] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({});
  
  // Modal State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const isFieldValid = (field) => {
    if (errors[field]) return false;
    switch(field) {
      case 'firstName': return firstName.trim().length > 0;
      case 'lastName': return lastName.trim().length > 0;
      case 'username': return username.length > 0 && /^[a-zA-Z]+$/.test(username);
      case 'email': return email.length > 0 && email.includes('@');
      case 'password': 
        if (!password) return false;
        return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password) && /[\W_]/.test(password);
      case 'confirmPassword': return confirmPassword.length > 0 && password === confirmPassword;
      case 'middleName': return middleName.trim().length > 0;
      default: return false;
    }
  };

  const getFieldClass = (field) => {
    if (errors[field]) return 'register-input-field error';
    if (isFieldValid(field)) return 'register-input-field success';
    return 'register-input-field';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setErrors({});
    
    let newErrors = {};
    let errMsg = '';

    if (!firstName) newErrors.firstName = true;
    if (!lastName) newErrors.lastName = true;
    if (!username) newErrors.username = true;
    if (!email) newErrors.email = true;
    if (!password) newErrors.password = true;
    if (!confirmPassword) newErrors.confirmPassword = true;

    if (Object.keys(newErrors).length > 0) {
      errMsg = 'กรุณากรอกข้อมูลให้ครบถ้วนในช่องสีแดง';
    }

    if (!agreeTerms) {
      if (!errMsg) errMsg = 'กรุณายอมรับเงื่อนไขการให้บริการและนโยบายความเป็นส่วนตัว';
    }

    // Username validation: English only
    if (username && !/^[a-zA-Z]+$/.test(username)) {
      newErrors.username = true;
      if (!errMsg) errMsg = 'Username ต้องเป็นภาษาอังกฤษเท่านั้น';
    }

    // Email validation
    if (email && !email.includes('@')) {
      newErrors.email = true;
      if (!errMsg) errMsg = 'กรุณากรอก Email ให้ถูกต้อง (ต้องมี @)';
    }

    // Password validation
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasNonAlphas = /\W|_/.test(password);
    if (password && (password.length < 8 || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasNonAlphas)) {
      newErrors.password = true;
      if (!errMsg) errMsg = 'Password ต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวพิมพ์ใหญ่ พิมพ์เล็ก ตัวเลข และอักษรพิเศษ';
    }

    // Confirm password
    if (confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = true;
      if (!errMsg) errMsg = 'Password และ Confirm Password ไม่ตรงกัน';
    }

    if (Object.keys(newErrors).length > 0 || errMsg) {
      setErrors(newErrors);
      setErrorMessage(errMsg);
      return;
    }

    const fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');

    console.log('[DEBUG] Frontend submitting registration data:', { role, fullName, username, email, password, target_track: targetTrack, target_industry: targetIndustry });

    try {
      const resData = await api.register(role, fullName, username, email, password, targetTrack, targetIndustry);
      if (resData.success && resData.user) {
        if (role === 'student') {
          // Immediately show the onboarding modal, which will also log them in when complete
          setRegisteredUser(resData.user);
          setShowProfileModal(true);
        } else {
          alert(`Account created successfully! Please sign in to continue.`);
          onNavigate('login');
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

            {/* Name Fields */}
            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="firstName" className="register-field-label">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  className={getFieldClass('firstName')}
                  placeholder="e.g. Jane"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setErrors({...errors, firstName: false}); }}
                />
              </div>
              <div className="register-form-group">
                <label htmlFor="middleName" className="register-field-label">Middle Name (Optional)</label>
                <input
                  id="middleName"
                  type="text"
                  className={getFieldClass('middleName')}
                  placeholder="e.g. Ann"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>
            </div>

            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="lastName" className="register-field-label">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  className={getFieldClass('lastName')}
                  placeholder="e.g. Doe"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setErrors({...errors, lastName: false}); }}
                />
              </div>
              <div className="register-form-group">
                <label htmlFor="username" className="register-field-label">Username</label>
                <input
                  id="username"
                  type="text"
                  className={getFieldClass('username')}
                  placeholder="e.g. janedoe"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setErrors({...errors, username: false}); }}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="register-form-group">
              <label htmlFor="email" className="register-field-label">Email Address</label>
              <input
                id="email"
                type="email"
                className={getFieldClass('email')}
                placeholder="e.g. jane.doe@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors({...errors, email: false}); }}
              />
            </div>

            {/* Password */}
            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="password" className="register-field-label">Password</label>
                <input
                  id="password"
                  type="password"
                  className={getFieldClass('password')}
                  placeholder="Choose a strong password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({...errors, password: false}); }}
                />
              </div>
              <div className="register-form-group">
                <label htmlFor="confirmPassword" className="register-field-label">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={getFieldClass('confirmPassword')}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors({...errors, confirmPassword: false}); }}
                />
              </div>
            </div>


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

            {/* Name Fields */}
            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="firstName" className="register-field-label">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  className={getFieldClass('firstName')}
                  placeholder="e.g. Jane"
                  value={firstName}
                  onChange={(e) => { setFirstName(e.target.value); setErrors({...errors, firstName: false}); }}
                />
              </div>
              <div className="register-form-group">
                <label htmlFor="middleName" className="register-field-label">Middle Name (Optional)</label>
                <input
                  id="middleName"
                  type="text"
                  className={getFieldClass('middleName')}
                  placeholder="e.g. Ann"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>
            </div>

            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="lastName" className="register-field-label">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  className={getFieldClass('lastName')}
                  placeholder="e.g. Doe"
                  value={lastName}
                  onChange={(e) => { setLastName(e.target.value); setErrors({...errors, lastName: false}); }}
                />
              </div>
              <div className="register-form-group">
                <label htmlFor="username" className="register-field-label">Username</label>
                <input
                  id="username"
                  type="text"
                  className={getFieldClass('username')}
                  placeholder="e.g. janedoe"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setErrors({...errors, username: false}); }}
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="register-form-group">
              <label htmlFor="email" className="register-field-label">Email Address</label>
              <input
                id="email"
                type="email"
                className={getFieldClass('email')}
                placeholder="e.g. jane.doe@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors({...errors, email: false}); }}
              />
            </div>

            {/* Password */}
            <div className="register-form-row">
              <div className="register-form-group">
                <label htmlFor="password" className="register-field-label">Password</label>
                <input
                  id="password"
                  type="password"
                  className={getFieldClass('password')}
                  placeholder="Choose a strong password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({...errors, password: false}); }}
                />
              </div>
              <div className="register-form-group">
                <label htmlFor="confirmPassword" className="register-field-label">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={getFieldClass('confirmPassword')}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setErrors({...errors, confirmPassword: false}); }}
                />
              </div>
            </div>


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

      {/* Show Profile Completion Modal immediately after registration for students */}
      {showProfileModal && registeredUser && (
        <ProfileCompletionModal 
          user={registeredUser} 
          onComplete={(updatedUser) => {
            setShowProfileModal(false);
            alert(`Account created and profile completed successfully! Please sign in to continue.`);
            if (onNavigate) onNavigate('login');
          }} 
        />
      )}
    </div>
  );
}
