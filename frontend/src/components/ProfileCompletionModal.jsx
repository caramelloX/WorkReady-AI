import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './ProfileCompletionModal.css';
import { api } from '../api.js';

export default function ProfileCompletionModal({ user, onComplete }) {
  const { t } = useLanguage();
  const [obMajor, setObMajor] = useState('');
  const [obEducationLevel, setObEducationLevel] = useState('Bootcamp Graduate');
  const [obTargetIndustry, setObTargetIndustry] = useState('');
  const [obOccupationGoal, setObOccupationGoal] = useState('');
  const [obCareerGoal, setObCareerGoal] = useState('');
  const [obStrengths, setObStrengths] = useState('');
  const [obDevelopAreas, setObDevelopAreas] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.target_industry) {
      setObTargetIndustry(user.target_industry);
    }
    if (user && user.target_track) {
      setObOccupationGoal(user.target_track);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const strengthsArr = obStrengths.split(',').map(s => s.trim()).filter(Boolean);
      const developArr = obDevelopAreas.split(',').map(d => d.trim()).filter(Boolean);

      const userId = user._id || user.id;

      const res = await api.updateProfile(userId, {
        major: obMajor,
        education_level: obEducationLevel,
        career_goal: obCareerGoal,
        occupation_goal: obOccupationGoal,
        target_industry: obTargetIndustry,
        strengths: strengthsArr,
        develop_areas: developArr
      });

      if (res.success) {
        // Update local session
        localStorage.setItem('currentUser', JSON.stringify(res.user));
        
        // Use a short timeout to ensure state flushes and modal closes before navigation
        setTimeout(() => {
          onComplete(res.user);
        }, 50);
      } else {
        setError(t('profileModal.error'));
        console.error("Profile update failed:", res);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal-container">
        
        <div className="profile-modal-left">
          <div className="profile-modal-brand">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <span>WorkReady AI</span>
          </div>
          <h2>{t('profileModal.almost')}{user?.fullname?.split(' ')[0] || 'Student'}!</h2>
          <p>
            {t('profileModal.desc')}
          </p>
          <div className="profile-modal-steps">
            <div className="step-item active">
              <div className="step-dot"></div>
              <span>{t('profileModal.step1')}</span>
            </div>
            <div className="step-item active">
              <div className="step-dot"></div>
              <span>{t('profileModal.step2')}</span>
            </div>
            <div className="step-item active">
              <div className="step-dot"></div>
              <span>{t('profileModal.step3')}</span>
            </div>
          </div>
        </div>

        <div className="profile-modal-right">
          <h3>{t('profileModal.details')}</h3>
          {error && <div className="profile-modal-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="profile-modal-form">
            
            <div className="form-row">
              <div className="form-group">
                <label>{t('profileModal.major')}</label>
                <input 
                  type="text" 
                  value={obMajor} 
                  onChange={e => setObMajor(e.target.value)} 
                  required 
                  placeholder={t('profileModal.majorPh')} 
                />
              </div>
              <div className="form-group">
                <label>{t('profileModal.education')}</label>
                <select value={obEducationLevel} onChange={e => setObEducationLevel(e.target.value)}>
                  <option value="Bachelor's (Final year)">{t('profileModal.bachelor')}</option>
                  <option value="Bootcamp Graduate">{t('profileModal.bootcamp')}</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('profileModal.industry')}</label>
                <input 
                  type="text" 
                  value={obTargetIndustry} 
                  onChange={e => setObTargetIndustry(e.target.value)} 
                  required 
                  placeholder={t('profileModal.industryPh')} 
                />
              </div>
              <div className="form-group">
                <label>{t('profileModal.occupation')}</label>
                <input 
                  type="text" 
                  value={obOccupationGoal} 
                  onChange={e => setObOccupationGoal(e.target.value)} 
                  required 
                  placeholder={t('profileModal.occupationPh')} 
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>{t('profileModal.career')}</label>
              <textarea 
                value={obCareerGoal} 
                onChange={e => setObCareerGoal(e.target.value)} 
                required 
                rows={2} 
                placeholder={t('profileModal.careerPh')} 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>{t('profileModal.strengths')}</label>
                <input 
                  type="text" 
                  value={obStrengths} 
                  onChange={e => setObStrengths(e.target.value)} 
                  required 
                  placeholder={t('profileModal.strengthsPh')} 
                />
              </div>
              <div className="form-group">
                <label>{t('profileModal.develop')}</label>
                <input 
                  type="text" 
                  value={obDevelopAreas} 
                  onChange={e => setObDevelopAreas(e.target.value)} 
                  required 
                  placeholder={t('profileModal.developPh')} 
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="loader"></span>
                ) : t('profileModal.complete')}
                {!isSubmitting && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
