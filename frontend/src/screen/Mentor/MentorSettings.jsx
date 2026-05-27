import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../components/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTheme } from '../../contexts/ThemeContext';
import Swal from 'sweetalert2';
import '../Student/StudentSettings.css';

export default function MentorSettings({ currentUser, onProfileUpdate, onNavigate }) {
  const { t, language, changeLanguage } = useLanguage();
  const { theme, changeTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');

  const [formData, setFormData] = useState({
    fullname: currentUser?.fullname || '',
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    organization: currentUser?.organization || '',
    expertise: currentUser?.expertise || '',
    experience_years: currentUser?.experience_years || '',
    linkedin: currentUser?.linkedin || '',
    location: currentUser?.location || '',
    bio: currentUser?.bio || '',
    avatar_base64: currentUser?.avatar_base64 || ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Student assignment state
  const [allStudents, setAllStudents] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [assignSaving, setAssignSaving] = useState({});

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (activeTab === 'students') {
      loadStudents();
    }
  }, [activeTab]);

  const loadStudents = async () => {
    setLoadingStudents(true);
    try {
      const all = await api.getAllStudentsForAssignment();
      setAllStudents(all || []);
      const mine = (all || []).filter(s => s.mentor_id === currentUser?.id);
      setAssignedStudents(mine.map(s => s.id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleToggleAssign = async (student) => {
    const isAssigned = assignedStudents.includes(student.id);
    setAssignSaving(prev => ({ ...prev, [student.id]: true }));
    try {
      if (isAssigned) {
        await api.unassignStudent(student.id);
        setAssignedStudents(prev => prev.filter(id => id !== student.id));
      } else {
        await api.assignStudentToMentor(student.id, currentUser.id);
        setAssignedStudents(prev => [...prev, student.id]);
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, confirmButtonColor: '#2563EB' });
    } finally {
      setAssignSaving(prev => ({ ...prev, [student.id]: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, avatar_base64: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!currentUser?.id) return;
    setIsSaving(true);
    try {
      const result = await api.updateProfile(currentUser.id, formData);
      if (result.success && onProfileUpdate) {
        onProfileUpdate(result.user);
        Swal.fire({ title: t('settings.success'), text: t('settings.saveSuccess'), icon: 'success', confirmButtonColor: '#2563EB' });
      }
    } catch (error) {
      Swal.fire({ title: t('settings.error'), text: error.message, icon: 'error', confirmButtonColor: '#2563EB' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    setPasswordError('');
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!currentPassword || !newPassword || !confirmPassword) { setPasswordError(t('settings.pwdFillAll')); return; }
    if (newPassword !== confirmPassword) { setPasswordError(t('settings.pwdMismatch')); return; }
    if (newPassword.length < 8) { setPasswordError(t('settings.pwdWeak')); return; }
    setIsUpdatingPassword(true);
    try {
      const result = await api.changePassword(currentUser.id, currentPassword, newPassword);
      if (result.success) {
        Swal.fire({ title: t('settings.success'), text: t('settings.pwdSuccess'), icon: 'success', confirmButtonColor: '#2563EB' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      setPasswordError(error.message || 'Failed to update password.');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const initials = (formData.fullname || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const tabs = [
    {
      key: 'profile', label: t('settings.tab.profile'),
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
    },
    {
      key: 'students', label: t('mentor.assignStudents'),
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    {
      key: 'security', label: t('settings.tab.security'),
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
    },
    {
      key: 'preferences', label: t('settings.tab.preferences'),
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
    }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="settings-content-card">
            {/* Avatar */}
            <div className="settings-avatar-section">
              {formData.avatar_base64 ? (
                <img src={formData.avatar_base64} alt="Avatar" className="settings-avatar-large" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="settings-avatar-large">{initials}</div>
              )}
              <div className="settings-avatar-actions">
                <input type="file" accept="image/*" ref={fileInputRef} style={{ display: 'none' }} onChange={handlePhotoUpload} />
                <button className="settings-btn-upload" onClick={() => fileInputRef.current.click()}>{t('settings.uploadPhoto')}</button>
                {formData.avatar_base64 && (
                  <button className="settings-btn-remove" onClick={() => setFormData(p => ({ ...p, avatar_base64: '' }))}>{t('settings.removePhoto')}</button>
                )}
              </div>
            </div>

            {/* Basic info */}
            <div className="settings-form-grid">
              <div className="settings-form-group">
                <label>{t('settings.fullname')}</label>
                <input type="text" name="fullname" className="settings-input settings-input-readonly" value={formData.fullname} readOnly />
              </div>
              <div className="settings-form-group">
                <label>{t('settings.username')}</label>
                <input type="text" name="username" className="settings-input settings-input-readonly" value={formData.username} readOnly />
              </div>
              <div className="settings-form-group">
                <label>{t('settings.email')}</label>
                <input type="email" name="email" className="settings-input" value={formData.email} onChange={handleChange} />
              </div>
              <div className="settings-form-group">
                <label>{t('settings.phone')}</label>
                <input type="tel" name="phone" className="settings-input" value={formData.phone} onChange={handleChange} />
              </div>

              {/* Mentor-specific */}
              <div className="settings-form-group">
                <label>{t('mentor.settingsOrg')}</label>
                <input type="text" name="organization" className="settings-input" value={formData.organization} onChange={handleChange} placeholder={t('mentor.settingsOrgPlaceholder')} />
              </div>
              <div className="settings-form-group">
                <label>{t('mentor.settingsYears')}</label>
                <input type="text" name="experience_years" className="settings-input" value={formData.experience_years} onChange={handleChange} placeholder="เช่น 5 ปี" />
              </div>
              <div className="settings-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>{t('mentor.settingsExpertise')}</label>
                <input type="text" name="expertise" className="settings-input" value={formData.expertise} onChange={handleChange} placeholder={t('mentor.settingsExpertisePlaceholder')} />
              </div>
              <div className="settings-form-group">
                <label>LinkedIn</label>
                <input type="text" name="linkedin" className="settings-input" value={formData.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
              </div>
              <div className="settings-form-group">
                <label>{t('settings.location')}</label>
                <input type="text" name="location" className="settings-input" value={formData.location} onChange={handleChange} />
              </div>
              <div className="settings-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>{t('settings.bio')}</label>
                <textarea name="bio" className="settings-input settings-textarea" rows={4} value={formData.bio} onChange={handleChange} placeholder={t('mentor.settingsBioPlaceholder')} />
              </div>
            </div>

            <div className="settings-form-actions">
              <button className="settings-btn-cancel" onClick={() => setFormData({
                fullname: currentUser?.fullname || '', username: currentUser?.username || '',
                email: currentUser?.email || '', phone: currentUser?.phone || '',
                organization: currentUser?.organization || '', expertise: currentUser?.expertise || '',
                experience_years: currentUser?.experience_years || '', linkedin: currentUser?.linkedin || '',
                location: currentUser?.location || '', bio: currentUser?.bio || '',
                avatar_base64: currentUser?.avatar_base64 || ''
              })}>{t('settings.cancel')}</button>
              <button className="settings-btn-save" disabled={isSaving} onClick={handleSave}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                {isSaving ? t('settings.saving') : t('settings.saveChanges')}
              </button>
            </div>
          </div>
        );

      case 'students':
        return (
          <div className="settings-content-card">
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--neutral-heading)', margin: '0 0 6px' }}>{t('mentor.assignStudents')}</h3>
              <p style={{ fontSize: '14px', color: 'var(--neutral-text)', margin: 0 }}>{t('mentor.assignStudentsSub')}</p>
            </div>

            {loadingStudents ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--neutral-text)' }}>กำลังโหลด...</div>
            ) : allStudents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--neutral-text)' }}>{t('mentor.noStudentsToAssign')}</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {allStudents.map(student => {
                  const isAssigned = assignedStudents.includes(student.id);
                  const isMine = student.mentor_id === currentUser?.id;
                  const otherMentor = student.mentor_id && student.mentor_id !== currentUser?.id;
                  const studentName = student.fullname || student.username || 'Student';
                  const sInitials = studentName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

                  return (
                    <div key={student.id} style={{
                      display: 'flex', alignItems: 'center', gap: '14px',
                      padding: '14px 16px', borderRadius: '12px',
                      border: `1.5px solid ${isAssigned ? '#bfdbfe' : 'var(--border-color)'}`,
                      background: isAssigned ? '#eff6ff' : '#fff',
                      transition: 'all 0.2s'
                    }}>
                      {student.avatar_base64 ? (
                        <img src={student.avatar_base64} alt={studentName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isAssigned ? '#2563EB' : '#94A3B8', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flexShrink: 0 }}>
                          {sInitials}
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '14px', color: 'var(--neutral-heading)' }}>{studentName}</div>
                        <div style={{ fontSize: '12px', color: 'var(--neutral-text)', marginTop: '2px' }}>
                          {student.target_industry || 'ไม่ระบุอุตสาหกรรม'}
                          {otherMentor && <span style={{ marginLeft: '8px', color: '#F59E0B', fontWeight: '600' }}>• มี mentor แล้ว</span>}
                        </div>
                      </div>
                      <button
                        disabled={assignSaving[student.id] || otherMentor}
                        onClick={() => handleToggleAssign(student)}
                        style={{
                          padding: '8px 18px', borderRadius: '8px', border: 'none',
                          fontWeight: '600', fontSize: '13px', cursor: otherMentor ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          background: isAssigned ? '#fee2e2' : '#2563EB',
                          color: isAssigned ? '#dc2626' : '#fff',
                          opacity: otherMentor ? 0.5 : 1
                        }}
                      >
                        {assignSaving[student.id] ? '...' : isAssigned ? t('mentor.unassign') : t('mentor.assign')}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );

      case 'security':
        return (
          <div className="settings-content-card">
            <h3 className="settings-section-title">{t('settings.changePassword')}</h3>
            <div className="settings-form-grid" style={{ maxWidth: '480px' }}>
              <div className="settings-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>{t('settings.currentPassword')}</label>
                <input type="password" name="currentPassword" className="settings-input" value={passwordForm.currentPassword} onChange={e => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))} />
              </div>
              <div className="settings-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>{t('settings.newPassword')}</label>
                <input type="password" name="newPassword" className="settings-input" value={passwordForm.newPassword} onChange={e => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))} />
              </div>
              <div className="settings-form-group" style={{ gridColumn: '1 / -1' }}>
                <label>{t('settings.confirmPassword')}</label>
                <input type="password" name="confirmPassword" className="settings-input" value={passwordForm.confirmPassword} onChange={e => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))} />
              </div>
            </div>
            {passwordError && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '8px' }}>{passwordError}</p>}
            <div className="settings-form-actions" style={{ marginTop: '20px' }}>
              <button className="settings-btn-save" disabled={isUpdatingPassword} onClick={handleUpdatePassword}>
                {isUpdatingPassword ? t('settings.saving') : t('settings.updatePassword')}
              </button>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="settings-content-card">
            <h3 className="settings-section-title">{t('settings.tab.preferences')}</h3>
            <div className="settings-form-grid">
              <div className="settings-form-group">
                <label>{t('prefs.language')}</label>
                <select className="settings-input" value={language} onChange={e => changeLanguage(e.target.value)}>
                  <option value="en">English</option>
                  <option value="th">ภาษาไทย</option>
                </select>
              </div>
              <div className="settings-form-group">
                <label>{t('prefs.theme')}</label>
                <select className="settings-input" value={theme} onChange={e => changeTheme(e.target.value)}>
                  <option value="light">{t('prefs.light')}</option>
                  <option value="dark">{t('prefs.dark')}</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="student-settings-container">
      <div className="settings-header">
        <h1 className="settings-page-title">{t('mentor.settingsTitle')}</h1>
        <p className="settings-page-subtitle">{t('mentor.settingsSubtitle')}</p>
      </div>
      <div className="settings-main-layout">
        <nav className="settings-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`settings-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div style={{ flex: 1, minWidth: 0 }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
