import React, { useState, useRef } from 'react';
import './StudentSettings.css';
import { api } from '../../components/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import Swal from 'sweetalert2';

export default function StudentSettings({ currentUser, onProfileUpdate, initials, fullName, email, targetIndustry, major, onNavigate }) {
  const { t, language, changeLanguage } = useLanguage();
  const { theme, changeTheme } = useTheme();
  const roleName = currentUser?.role?.toLowerCase();
  const isEmployerOrAdmin = roleName === 'employer' || roleName === 'admin';
  const [activeTab, setActiveTab] = useState(isEmployerOrAdmin ? 'preferences' : 'profile');

  // Form State
  const [formData, setFormData] = useState({
    fullname: currentUser?.fullname || fullName || '',
    username: currentUser?.username || (fullName ? fullName.toLowerCase().replace(/\s+/g, '.') : ''),
    email: currentUser?.email || email || '',
    phone: currentUser?.phone || '',
    university: currentUser?.major || major || '',
    location: currentUser?.location || '',
    bio: currentUser?.bio || '',
    avatar_base64: currentUser?.avatar_base64 || ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar_base64: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, avatar_base64: '' }));
  };

  const handleSave = async () => {
    if (!currentUser || !currentUser.id) {
      Swal.fire({
        title: t('settings.error'),
        text: t('settings.errorNoUser'),
        icon: 'error',
        confirmButtonColor: '#003057'
      });
      return;
    }
    
    setIsSaving(true);
    try {
      const result = await api.updateProfile(currentUser.id, formData);
      if (result.success && onProfileUpdate) {
        onProfileUpdate(result.user);
        Swal.fire({
          title: t('settings.success'),
          text: t('settings.saveSuccess'),
          icon: 'success',
          confirmButtonColor: '#003057'
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: t('settings.error'),
        text: t('settings.saveError') + ': ' + error.message,
        icon: 'error',
        confirmButtonColor: '#003057'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async () => {
    setPasswordError('');
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError(t('settings.pwdFillAll'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(t('settings.pwdMismatch'));
      return;
    }

    // Validation rules from Registration
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasNonAlphas = /\W|_/.test(newPassword);

    if (newPassword.length < 8 || !hasUpperCase || !hasLowerCase || !hasNumbers || !hasNonAlphas) {
      setPasswordError(t('settings.pwdWeak'));
      return;
    }

    if (!currentUser || !currentUser.id) {
      setPasswordError(t('settings.errorNoUser'));
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const result = await api.changePassword(currentUser.id, currentPassword, newPassword);
      if (result.success) {
        Swal.fire({
          title: t('settings.success'),
          text: t('settings.pwdSuccess'),
          icon: 'success',
          confirmButtonColor: '#003057'
        });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      console.error(error);
      setPasswordError(error.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: t('settings.deleteConfirmTitle'),
      text: t('settings.deleteConfirmText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: t('settings.deleteConfirmBtn'),
      cancelButtonText: t('settings.deleteCancelBtn')
    });

    if (!result.isConfirmed) return;

    if (!currentUser || !currentUser.id) {
      Swal.fire({ title: t('settings.error'), text: t('settings.errorNoUser'), icon: 'error', confirmButtonColor: '#003057' });
      return;
    }

    try {
      await api.deleteAccount(currentUser.id);
      localStorage.removeItem('currentUser');
      localStorage.removeItem(`hasCompletedSkillQuiz_${currentUser.id}`);
      localStorage.removeItem(`hasCompletedAiQuiz_${currentUser.id}`);
      await Swal.fire({
        title: t('settings.deleteSuccessTitle'),
        text: t('settings.deleteSuccessText'),
        icon: 'success',
        confirmButtonColor: '#003057',
        allowOutsideClick: false
      });
      if (onNavigate) onNavigate('logout');
    } catch (error) {
      console.error(error);
      Swal.fire({ title: t('settings.error'), text: error.message, icon: 'error', confirmButtonColor: '#003057' });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="settings-content-card">
            <div className="settings-avatar-section">
              {formData.avatar_base64 ? (
                <img src={formData.avatar_base64} alt="Avatar" className="settings-avatar-large" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="settings-avatar-large">{initials || ''}</div>
              )}
              <div className="settings-avatar-actions">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handlePhotoUpload}
                />
                <button className="settings-btn-upload" onClick={() => fileInputRef.current.click()}>{t('settings.uploadPhoto')}</button>
                {formData.avatar_base64 && (
                  <button className="settings-btn-remove" onClick={handleRemovePhoto}>{t('settings.removePhoto')}</button>
                )}
              </div>
            </div>

            <div className="settings-form-grid">
              <div className="settings-form-group">
                <label>{t('settings.fullname')}</label>
                <input
                  type="text"
                  name="fullname"
                  className="settings-input settings-input-readonly"
                  value={formData.fullname}
                  readOnly
                />
              </div>
              <div className="settings-form-group">
                <label>{t('settings.username')}</label>
                <input
                  type="text"
                  name="username"
                  className="settings-input settings-input-readonly"
                  value={formData.username}
                  readOnly
                />
              </div>

              <div className="settings-form-group">
                <label>{t('settings.email')}</label>
                <input
                  type="email"
                  name="email"
                  className="settings-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="settings-form-group">
                <label>{t('settings.phone')}</label>
                <input
                  type="tel"
                  name="phone"
                  className="settings-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="settings-form-group">
                <label>{t('settings.university')}</label>
                <input
                  type="text"
                  name="university"
                  className="settings-input"
                  value={formData.university}
                  onChange={handleChange}
                />
              </div>
              <div className="settings-form-group">
                <label>{t('settings.location')}</label>
                <input
                  type="text"
                  name="location"
                  className="settings-input"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="settings-form-group full-width">
                <label>{t('settings.bio')}</label>
                <textarea
                  name="bio"
                  className="settings-textarea"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="settings-form-actions">
              <button className="settings-btn-cancel">{t('settings.cancel')}</button>
              <button className="settings-btn-save" onClick={handleSave} disabled={isSaving}>
                {isSaving ? t('settings.saving') : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    {t('settings.saveChanges')}
                  </>
                )}
              </button>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="settings-content-wrapper" style={{ flexGrow: 1 }}>
            {/* Change Password Card */}
            <div className="settings-section-card">
              <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: 'var(--neutral-heading)' }}>{t('settings.changePassword')}</h3>

              {passwordError && (
                <div style={{ color: '#ef4444', fontSize: '13px', marginBottom: '16px', padding: '10px', backgroundColor: '#fef2f2', borderRadius: '6px' }}>
                  {passwordError}
                </div>
              )}

              <div className="settings-form-grid">
                <div className="settings-form-group full-width">
                  <label>{t('settings.currentPassword')}</label>
                  <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} className="settings-input" />
                </div>
                <div className="settings-form-group">
                  <label>{t('settings.newPassword')}</label>
                  <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} className="settings-input" />
                </div>
                <div className="settings-form-group">
                  <label>{t('settings.confirmNewPassword')}</label>
                  <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} className="settings-input" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                <button className="settings-btn-save" onClick={handleUpdatePassword} disabled={isUpdatingPassword}>
                  {isUpdatingPassword ? t('settings.updatingPassword') : t('settings.updatePassword')}
                </button>
              </div>
            </div>


            {/* Active sessions Card */}
            <div className="settings-section-card">
              <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', color: 'var(--neutral-heading)' }}>{t('settings.activeSessions')}</h3>
              <div className="settings-session-list">
                <div className="settings-session-item">
                  <div className="settings-session-info">
                    <h4>Chrome on macOS <span className="settings-badge-success">{t('settings.thisDevice')}</span></h4>
                    <p>Bengaluru, India · Active now</p>
                  </div>
                </div>
                <div className="settings-session-item">
                  <div className="settings-session-info">
                    <h4>Safari on iPhone</h4>
                    <p>Bengaluru, India · 2 hours ago</p>
                  </div>
                  <button className="settings-btn-danger-text">{t('settings.revoke')}</button>
                </div>
              </div>
            </div>

            {/* Delete account Card */}
            <div className="settings-section-card danger-zone">
              <div className="settings-danger-header">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                {t('settings.deleteAccount')}
              </div>
              <button className="settings-btn-danger-outline" onClick={handleDeleteAccount}>{t('settings.deleteMyAccount')}</button>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-content-card" style={{ padding: '24px 32px' }}>
            <div className="settings-notification-header">
              <div>{t('settings.notifHeader')}</div>
              <div style={{ textAlign: 'center' }}>{t('settings.notifEmail')}</div>
              <div style={{ textAlign: 'center' }}>{t('settings.notifPush')}</div>
            </div>

            <div className="settings-notification-row">
              <div className="settings-notification-info">
                <h4>{t('settings.notifScenario')}</h4>
                <p>{t('settings.notifScenarioDesc')}</p>
              </div>
              <div className="settings-notification-checkbox-container">
                <input type="checkbox" className="settings-checkbox" defaultChecked />
              </div>
              <div className="settings-notification-checkbox-container">
                <input type="checkbox" className="settings-checkbox" defaultChecked />
              </div>
            </div>

            <div className="settings-notification-row">
              <div className="settings-notification-info">
                <h4>{t('settings.notifEvidence')}</h4>
                <p>{t('settings.notifEvidenceDesc')}</p>
              </div>
              <div className="settings-notification-checkbox-container">
                <input type="checkbox" className="settings-checkbox" defaultChecked />
              </div>
              <div className="settings-notification-checkbox-container">
                <input type="checkbox" className="settings-checkbox" />
              </div>
            </div>

            <div className="settings-notification-row">
              <div className="settings-notification-info">
                <h4>{t('settings.notifWeekly')}</h4>
                <p>{t('settings.notifWeeklyDesc')}</p>
              </div>
              <div className="settings-notification-checkbox-container">
                <input type="checkbox" className="settings-checkbox" defaultChecked />
              </div>
              <div className="settings-notification-checkbox-container">
                <input type="checkbox" className="settings-checkbox" />
              </div>
            </div>

            <div className="settings-notification-row">
              <div className="settings-notification-info">
                <h4>{t('settings.notifMentor')}</h4>
                <p>{t('settings.notifMentorDesc')}</p>
              </div>
              <div className="settings-notification-checkbox-container">
                <input type="checkbox" className="settings-checkbox" />
              </div>
              <div className="settings-notification-checkbox-container">
                <input type="checkbox" className="settings-checkbox" defaultChecked />
              </div>
            </div>

            <div className="settings-notification-row">
              <div className="settings-notification-info">
                <h4>{t('settings.notifProduct')}</h4>
                <p>{t('settings.notifProductDesc')}</p>
              </div>
              <div className="settings-notification-checkbox-container">
                <input type="checkbox" className="settings-checkbox" />
              </div>
              <div className="settings-notification-checkbox-container">
                <input type="checkbox" className="settings-checkbox" />
              </div>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="settings-content-card">
            <div className="settings-form-grid">
              <div className="settings-form-group">
                <label>{t('prefs.language')}</label>
                <select className="settings-select" value={language} onChange={(e) => changeLanguage(e.target.value)}>
                  <option value="en">{t('lang.en')}</option>
                  <option value="th">{t('lang.th')}</option>
                </select>
              </div>
              <div className="settings-form-group">
                <label>{t('prefs.timezone')}</label>
                <select className="settings-select" defaultValue="Asia/Kolkata (IST)">
                  <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                </select>
              </div>

              <div className="settings-form-group">
                <label>{t('prefs.theme')}</label>
                <select className="settings-select" value={theme} onChange={(e) => changeTheme(e.target.value)}>
                  <option value="system">Match system</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div className="settings-form-group">
                <label>{t('prefs.dateFormat')}</label>
                <select className="settings-select" defaultValue="DD / MM / YYYY">
                  <option value="DD / MM / YYYY">DD / MM / YYYY</option>
                  <option value="MM / DD / YYYY">MM / DD / YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              {!isEmployerOrAdmin && (
                <>
                  <div className="settings-form-group">
                    <label>{t('prefs.difficulty')}</label>
                    <select className="settings-select" defaultValue="Intermediate">
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="settings-form-group">
                    <label>{t('prefs.reminder')}</label>
                    <select className="settings-select" defaultValue="Evening (7 PM)">
                      <option value="Morning (9 AM)">Morning (9 AM)</option>
                      <option value="Evening (7 PM)">Evening (7 PM)</option>
                      <option value="Off">Off</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            <div className="settings-form-actions">
              <button className="settings-btn-save" onClick={handleSave}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
                {t('prefs.saveBtn')}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentRoleStr = currentUser?.role ? currentUser.role.toLowerCase() : 'student';
  const settingsTitle = t(`settings.title.${currentRoleStr}`) || t('settings.title');

  return (
    <div className="student-tab-panel">
      <div className="student-settings-container">
        <div className="settings-header">
          <h2 className="settings-page-title" style={{ textAlign: 'left' }}>{settingsTitle}</h2>
          <p className="settings-page-subtitle" style={{ textAlign: 'left' }}>{t('settings.subtitle')}</p>
        </div>

        <div className="settings-main-layout">
          {/* Left Sidebar Navigation */}
          <div className="settings-sidebar">
            {!isEmployerOrAdmin && (
              <button 
                className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {t('settings.tab.profile')}
              </button>
            )}
            
            {!isEmployerOrAdmin && (
              <button 
                className={`settings-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                {t('settings.tab.security')}
              </button>
            )}
            
            {!isEmployerOrAdmin && (
              <button 
                className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {t('settings.tab.notifications')}
              </button>
            )}
            
            <button 
              className={`settings-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              {t('settings.tab.preferences')}
            </button>
          </div>

          {/* Main Content Card */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
