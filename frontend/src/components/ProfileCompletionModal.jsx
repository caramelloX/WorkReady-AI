import React, { useState, useEffect } from 'react';
import './ProfileCompletionModal.css';
import { api } from '../api.js';

export default function ProfileCompletionModal({ user, onComplete }) {
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
        setError('Failed to update profile.');
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
          <h2>Almost there, {user?.fullname?.split(' ')[0] || 'Student'}!</h2>
          <p>
            Complete your profile to personalize your training dashboard. 
            We use this data to tailor your simulations and pair you with relevant mentors.
          </p>
          <div className="profile-modal-steps">
            <div className="step-item active">
              <div className="step-dot"></div>
              <span>Academic Background</span>
            </div>
            <div className="step-item active">
              <div className="step-dot"></div>
              <span>Career Ambitions</span>
            </div>
            <div className="step-item active">
              <div className="step-dot"></div>
              <span>Skills Assessment</span>
            </div>
          </div>
        </div>

        <div className="profile-modal-right">
          <h3>Profile Details</h3>
          {error && <div className="profile-modal-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="profile-modal-form">
            
            <div className="form-row">
              <div className="form-group">
                <label>Major / Degree Focus</label>
                <input 
                  type="text" 
                  value={obMajor} 
                  onChange={e => setObMajor(e.target.value)} 
                  required 
                  placeholder="e.g. Computer Science" 
                />
              </div>
              <div className="form-group">
                <label>Education Level</label>
                <select value={obEducationLevel} onChange={e => setObEducationLevel(e.target.value)}>
                  <option value="Bachelor's (Final year)">Bachelor's (Final year)</option>
                  <option value="Bootcamp Graduate">Bootcamp Graduate</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Target Industry</label>
                <input 
                  type="text" 
                  value={obTargetIndustry} 
                  onChange={e => setObTargetIndustry(e.target.value)} 
                  required 
                  placeholder="e.g. Fintech" 
                />
              </div>
              <div className="form-group">
                <label>Occupation Goal</label>
                <input 
                  type="text" 
                  value={obOccupationGoal} 
                  onChange={e => setObOccupationGoal(e.target.value)} 
                  required 
                  placeholder="e.g. Backend Engineer" 
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Career Goal Description</label>
              <textarea 
                value={obCareerGoal} 
                onChange={e => setObCareerGoal(e.target.value)} 
                required 
                rows={2} 
                placeholder="e.g. Land a backend role at a Series B+ startup" 
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Key Strengths (comma separated)</label>
                <input 
                  type="text" 
                  value={obStrengths} 
                  onChange={e => setObStrengths(e.target.value)} 
                  required 
                  placeholder="e.g. System design, Python" 
                />
              </div>
              <div className="form-group">
                <label>Areas to Develop (comma separated)</label>
                <input 
                  type="text" 
                  value={obDevelopAreas} 
                  onChange={e => setObDevelopAreas(e.target.value)} 
                  required 
                  placeholder="e.g. Cloud architecture, CI/CD" 
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="loader"></span>
                ) : 'Complete Profile'}
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
