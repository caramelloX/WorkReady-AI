import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function StudentProfile({ avatarBase64, initials, fullName, targetTrack, major, faculty, educationLevel, occupationGoal, targetIndustry, email, careerGoal, strengthsList, developAreasList }) {
  const { t } = useLanguage();
  return (
    <div className="student-tab-panel">
            <div className="student-page-header">
              <div className="student-page-title-area">
                <h1 className="student-page-title">{t('profile.title')}</h1>
                <p className="student-page-subtitle">{t('profile.subtitle')}</p>
              </div>
            </div>

            <div className="profile-grid">
              
              {/* Profile Left Details Card */}
              <div className="student-card profile-left-card">
                {avatarBase64 ? (
                  <img src={avatarBase64} alt="Avatar" className="profile-avatar-circle" style={{ objectFit: 'cover', display: 'flex' }} />
                ) : (
                  <div className="profile-avatar-circle">{initials}</div>
                )}
                <h3 className="profile-name">{fullName}</h3>
                <p className="profile-cohort">{t('dashboard.cohortPrefix')}{targetTrack}{t('dashboard.cohortSuffix')}</p>

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
                    <span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>{t('profile.openToRoles')}{occupationGoal}{t('profile.rolesSuffix')}</span>
                  </div>
                </div>

                <div className="profile-education-details">
                  <div className="profile-details-section">
                    <span className="profile-detail-label">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      </svg>
                      <span>{t('profile.educationLevel')}</span>
                    </span>
                    <span className="profile-detail-val">{educationLevel} — {faculty ? `${faculty}, ${major}` : major}</span>
                  </div>

                  <div className="profile-details-section">
                    <span className="profile-detail-label">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      <span>{t('profile.targetIndustry')}</span>
                    </span>
                    <span className="profile-detail-val">{targetIndustry}</span>
                  </div>
                </div>
              </div>

              {/* Profile Right Subcards */}
              <div className="profile-right-grid">
                
                {/* About Card */}
                <div className="student-card">
                  <h4 className="profile-section-title">{t('profile.about')}</h4>
                  <p className="profile-about-text">
                    {t('profile.aboutDesc').replace('{0}', occupationGoal || '')}
                  </p>
                </div>

                {/* Career Goals */}
                <div className="student-card">
                  <h4 className="profile-section-title">{t('profile.careerGoals')}</h4>
                  <p className="profile-about-text" style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                    "{careerGoal}"
                  </p>
                </div>

                {/* Strengths & Develop Areas */}
                {/* Strengths & Develop Areas */}
                <div className="profile-two-column-row">
                  
                  {/* Strengths */}
                  <div className="student-card">
                    <h4 className="profile-section-title" style={{ color: 'var(--accent-green)', borderColor: '#a7f3d0' }}>{t('profile.strengths')}</h4>
                    <div className="profile-tags-container">
                      {strengthsList.map((str, idx) => (
                        <span key={idx} className="profile-pill green">{str}</span>
                      ))}
                    </div>
                  </div>

                  {/* Develop Areas */}
                  <div className="student-card">
                    <h4 className="profile-section-title" style={{ color: 'var(--accent-blue)', borderColor: '#bfdbfe' }}>{t('profile.developAreas')}</h4>
                    <div className="profile-tags-container">
                      {developAreasList.map((dev, idx) => (
                        <span key={idx} className="profile-pill blue">{dev}</span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Certifications & Badges */}
                <div className="student-card">
                  <h4 className="profile-section-title">{t('profile.certifications')}</h4>
                  <div className="profile-tags-container">
                    <span className="profile-pill badge">{t('dashboard.badge1')}</span>
                    <span className="profile-pill badge">{t('dashboard.badge2')}</span>
                    <span className="profile-pill badge">{t('dashboard.badge3')}</span>
                    <span className="profile-pill badge">{t('dashboard.badge4')}</span>
                    <span className="profile-pill badge highlight">{t('profile.badgeAws')}</span>
                    <span className="profile-pill badge">{t('profile.badgeGit')}</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
  );
}
