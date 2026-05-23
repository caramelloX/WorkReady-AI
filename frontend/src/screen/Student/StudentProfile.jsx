import React from 'react';

export default function StudentProfile({ initials, fullName, targetTrack, major, educationLevel, occupationGoal, targetIndustry, email, careerGoal, strengthsList, developAreasList }) {
  return (
    <div className="student-tab-panel">
            <div className="student-page-header">
              <div className="student-page-title-area">
                <h1 className="student-page-title">Profile</h1>
                <p className="student-page-subtitle">Your public learner profile — what mentors and recruiters see.</p>
              </div>
            </div>

            <div className="profile-grid">
              
              {/* Profile Left Details Card */}
              <div className="student-card profile-left-card">
                <div className="profile-avatar-circle">{initials}</div>
                <h3 className="profile-name">{fullName}</h3>
                <p className="profile-cohort">Cohort 2026 — {targetTrack} Track</p>

                <div className="profile-contact-details">
                  <div className="profile-contact-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>{email}</span>
                  </div>
                  <div className="profile-contact-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                    </svg>
                    <span>IIT Roorkee</span>
                  </div>
                  <div className="profile-contact-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>Open to {occupationGoal} roles</span>
                  </div>
                </div>

                <div className="profile-education-details">
                  <div className="profile-details-section">
                    <span className="profile-detail-label">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      </svg>
                      <span>Education Level</span>
                    </span>
                    <span className="profile-detail-val">{educationLevel} — {major}</span>
                  </div>

                  <div className="profile-details-section">
                    <span className="profile-detail-label">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      <span>Target Industry</span>
                    </span>
                    <span className="profile-detail-val">{targetIndustry}</span>
                  </div>
                </div>
              </div>

              {/* Profile Right Subcards */}
              <div className="profile-right-grid">
                
                {/* About Card */}
                <div className="student-card">
                  <h4 className="profile-section-title">About</h4>
                  <p className="profile-about-text">
                    Final-year student targeting {occupationGoal} roles. Active in WorkReady AI's mentorship track, with hands-on simulated experience in production incident response, database tuning, and secure code review.
                  </p>
                </div>

                {/* Career Goals */}
                <div className="student-card">
                  <h4 className="profile-section-title">Career Goals</h4>
                  <p className="profile-about-text" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                    "{careerGoal}"
                  </p>
                </div>

                {/* Strengths & Develop Areas */}
                {/* Strengths & Develop Areas */}
                <div className="profile-two-column-row">
                  
                  {/* Strengths */}
                  <div className="student-card">
                    <h4 className="profile-section-title" style={{ color: 'var(--accent-green)', borderColor: '#a7f3d0' }}>Strengths</h4>
                    <div className="profile-tags-container">
                      {strengthsList.map((str, idx) => (
                        <span key={idx} className="profile-pill green">{str}</span>
                      ))}
                    </div>
                  </div>

                  {/* Develop Areas */}
                  <div className="student-card">
                    <h4 className="profile-section-title" style={{ color: 'var(--accent-blue)', borderColor: '#bfdbfe' }}>Develop areas</h4>
                    <div className="profile-tags-container">
                      {developAreasList.map((dev, idx) => (
                        <span key={idx} className="profile-pill blue">{dev}</span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Certifications & Badges */}
                <div className="student-card">
                  <h4 className="profile-section-title">Certifications & Badges</h4>
                  <div className="profile-tags-container">
                    <span className="profile-pill badge">Clean Coder</span>
                    <span className="profile-pill badge">Incident Responder</span>
                    <span className="profile-pill badge">Code Reviewer</span>
                    <span className="profile-pill badge">System Designer</span>
                    <span className="profile-pill badge highlight">AWS Cloud Practitioner</span>
                    <span className="profile-pill badge">Git Pro</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
  );
}
