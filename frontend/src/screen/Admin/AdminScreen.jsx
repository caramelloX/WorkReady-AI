import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './AdminScreen.css';
import { api } from '../../api.js';
import StudentSettings from '../Student/StudentSettings';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Layers, 
  Inbox, 
  BarChart3,
  LogOut,
  Plus,
  Eye,
  Edit,
  Ban,
  UploadCloud,
  Copy,
  Archive,
  AlertCircle,
  CheckCircle2,
  Server,
  Database,
  Cpu,
  BrainCircuit,
  ChevronRight
} from 'lucide-react';

// Reusable Components
const StatCard = ({ label, value }) => (
  <div className="admin-stat-card">
    <span className="admin-stat-label">{label}</span>
    <h3 className="admin-stat-value">{value}</h3>
  </div>
);

const StatusBadge = ({ variant, children }) => {
  return (
    <span className={`admin-badge admin-badge-${variant}`}>
      {children}
    </span>
  );
};

export default function AdminScreen({ onNavigate }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('adminActiveTab') || 'dashboard';
  });

  useEffect(() => {
    sessionStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);
  const [isLoading, setIsLoading] = useState(false);

  // MOCK DATA STATES
  const [usersData, setUsersData] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [mentorsData, setMentorsData] = useState([]);
  const [scenariosData, setScenariosData] = useState([]);
  const [modulesData, setModulesData] = useState([]);
  const [submissionsData, setSubmissionsData] = useState([]);
  const [statsData, setStatsData] = useState({ totalStudents: 0, totalMentors: 0, totalScenarios: 0 });

  // Fetch Data Simulation
  const fetchAdminData = async (silent = false) => {
    try {
      if (!silent) setIsLoading(true);
      const data = await api.getAdminDashboardData();
      setUsersData(data.users || []);
      setStudentsData(data.students || []);
      setMentorsData(data.mentors || []);
      setScenariosData(data.scenarios || []);
      setStatsData(data.stats || { totalStudents: 0, totalMentors: 0, totalScenarios: 0 });
      
      // Modules and Submissions don't have backend data yet, keep empty or mocked
      setModulesData([
        { id: 1, title: t('admin.mock.module1'), status: t('admin.mock.statusPub'), meta: t('admin.mock.meta1') },
        { id: 2, title: t('admin.mock.module2'), status: t('admin.mock.statusPub'), meta: t('admin.mock.meta2') }
      ]);
      setSubmissionsData([]);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    // Poll for real-time updates every 5 seconds without triggering the loading spinner
    const intervalId = setInterval(() => fetchAdminData(true), 5000);
    return () => clearInterval(intervalId);
  }, []);

  // Retrieve current user from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const handleProfileUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const adminName = currentUser?.fullname || currentUser?.username || 'System Admin';
  const adminInitials = adminName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  // Add User Modal State
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    role: 'Student'
  });
  const [isAddingUser, setIsAddingUser] = useState(false);

  const [selectedProfile, setSelectedProfile] = useState(null);

  // Edit Profile State
  const [editingProfile, setEditingProfile] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const handleEditClick = (user) => {
    setEditingProfile(user);
    setEditForm({
      fullname: user.fullname || user.name || '',
      email: user.email || '',
      username: user.username || '',
      role: user.role || 'Student',
      target_track: user.target_track || '',
      target_industry: user.target_industry || '',
      occupation_goal: user.occupation_goal || '',
      major: user.major || '',
      education_level: user.education_level || '',
      career_goal: user.career_goal || '',
      strengths: Array.isArray(user.strengths) ? user.strengths.join(', ') : '',
      develop_areas: Array.isArray(user.develop_areas) ? user.develop_areas.join(', ') : ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmittingEdit(true);
      await api.updateAdminUser(editingProfile.id, editForm);
      setEditingProfile(null);
      await fetchAdminData();
    } catch (err) {
      console.error('Failed to update user', err);
      alert(err.message || 'Failed to update user');
    } finally {
      setIsSubmittingEdit(false);
    }
  };
  const handleAddUserSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsAddingUser(true);
      await api.addAdminUser(addUserForm);
      setShowAddUserModal(false);
      setAddUserForm({ fullname: '', email: '', username: '', password: '', role: 'Student' });
      // Refresh the table
      await fetchAdminData();
    } catch (err) {
      console.error('Failed to add user', err);
      alert(err.message || 'Failed to add user');
    } finally {
      setIsAddingUser(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended';
    
    // Optimistic UI Update
    setUsersData(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    
    try {
      await api.updateUserStatus(userId, newStatus);
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status: ' + err.message);
      // Revert on failure
      setUsersData(prev => prev.map(u => u.id === userId ? { ...u, status: currentStatus } : u));
    }
  };

  const navItems = [
    { id: 'dashboard', label: t('admin.sidebar.dashboard') || 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: t('admin.sidebar.users') || 'User Management', icon: Users },
    { id: 'students', label: t('admin.sidebar.students') || 'Students', icon: GraduationCap },
    { id: 'mentors', label: t('admin.sidebar.mentors') || 'Mentors', icon: Briefcase },
    { id: 'scenarios', label: t('admin.sidebar.scenarios') || 'Scenarios', icon: BookOpen },
    { id: 'modules', label: t('admin.sidebar.modules') || 'Modules', icon: Layers },
    { id: 'submissions', label: t('admin.sidebar.submissions') || 'Submissions', icon: Inbox },
    { id: 'reports', label: t('admin.sidebar.reports') || 'Reports', icon: BarChart3 },
  ];

  const getRiskBadge = (risk) => {
    switch(risk) {
      case 'Low': return 'success';
      case 'Medium': return 'warning';
      case 'High': return 'danger';
      default: return 'neutral';
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Active': case 'Available': case 'Published': case 'Reviewed': return 'success';
      case 'Inactive': case 'Draft': case 'Pending': return 'neutral';
      case 'Suspended': case 'Needs Revision': return 'danger';
      case 'In progress': case 'Overloaded': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <div className="admin-workspace">
      {/* 1. Sidebar Component */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand" onClick={() => onNavigate('landing')}>
          <div className="admin-brand-icon">
            <LayoutDashboard size={18} />
          </div>
          <span>{t('admin.brand')}</span>
        </div>

        <div className="admin-sidebar-header">{t('admin.sidebar.header').toUpperCase()}</div>
        
        <nav className="admin-sidebar-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button 
                key={item.id}
                className={`admin-nav-btn ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="admin-nav-icon" />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-profile-dropdown-container">
            <button className="admin-profile-btn" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
              {currentUser && currentUser.avatar_base64 ? (
                <img src={currentUser.avatar_base64} alt="Avatar" className="admin-profile-avatar" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="admin-profile-avatar">{adminInitials}</div>
              )}
              <div className="admin-profile-info">
                <span className="admin-profile-name">{adminName}</span>
                <span className="admin-profile-role">{t('admin.profile.role') || 'Admin'}</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`dropdown-icon ${showProfileDropdown ? 'open' : ''}`}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {showProfileDropdown && (
              <div className="admin-profile-dropdown-menu">
                <button className="dropdown-item" onClick={() => { setShowProfileDropdown(false); setActiveTab('settings'); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-item-icon">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  {t('sidebar.settings') || 'Settings'}
                </button>
                <button className="dropdown-item logout" onClick={() => onNavigate('logout')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-item-icon">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  {t('mentor.signOut')}
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-panel">
        
        {/* ========================================================= */}
        {/* DASHBOARD PAGE */}
        {/* ========================================================= */}
        {activeTab === 'dashboard' && (
          <>
            <header className="admin-header">
              <div>
                <h1 className="admin-page-title">Admin Dashboard</h1>
                <p className="admin-page-subtitle">Program-wide overview, system status, and quick actions.</p>
              </div>
              <div className="admin-header-actions">
                <StatusBadge variant="success">
                  <CheckCircle2 size={12} style={{marginRight: '4px'}}/>
                  ALL SYSTEMS NORMAL
                </StatusBadge>
              </div>
            </header>

            <div className="admin-content">
              {/* Top Stats */}
              <div className="admin-stats-grid">
                <StatCard label="Students" value={statsData.totalStudents} />
                <StatCard label="Mentors" value={statsData.totalMentors} />
                <StatCard label="Active Scenarios" value={statsData.totalScenarios} />
                <StatCard label="Submitted Portfolios" value="12" />
                <StatCard label="Pending Reviews" value="3" />
              </div>

              {/* Middle Section */}
              <div className="admin-grid-2col">
                <div className="admin-card">
                  <h3 className="admin-card-header">System status</h3>
                  <div className="system-status-grid">
                    <div className="system-status-item">
                      <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <Server size={18} color="currentColor" />
                        <span className="name">API Gateway</span>
                      </div>
                      <StatusBadge variant="success">Operational</StatusBadge>
                    </div>
                    <div className="system-status-item">
                      <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <Cpu size={18} color="currentColor" />
                        <span className="name">Scenario Engine</span>
                      </div>
                      <StatusBadge variant="success">Operational</StatusBadge>
                    </div>
                    <div className="system-status-item">
                      <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <Database size={18} color="currentColor" />
                        <span className="name">Storage Clusters</span>
                      </div>
                      <StatusBadge variant="success">Operational</StatusBadge>
                    </div>
                    <div className="system-status-item">
                      <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <BrainCircuit size={18} color="currentColor" />
                        <span className="name">AI Mentor Service</span>
                      </div>
                      <StatusBadge variant="warning">Degraded</StatusBadge>
                    </div>
                  </div>
                </div>

                <div className="admin-card">
                  <h3 className="admin-card-header">Quick actions</h3>
                  <div className="quick-action-list">
                    <button className="quick-action-btn" onClick={() => setActiveTab('scenarios')}>
                      Manage scenarios <ChevronRight size={16} color="currentColor"/>
                    </button>
                    <button className="quick-action-btn" onClick={() => setActiveTab('users')}>
                      Manage users <ChevronRight size={16} color="currentColor"/>
                    </button>
                    <button className="quick-action-btn" onClick={() => setActiveTab('reports')}>
                      View reports <ChevronRight size={16} color="currentColor"/>
                    </button>
                  </div>
                </div>
              </div>

              {/* Lower Section */}
              <div className="admin-grid-2col">
                <div className="admin-card">
                  <h3 className="admin-card-header">Cohort performance</h3>
                  <div className="progress-bar-container">
                    <div className="progress-item">
                      <div className="progress-label-row">
                        <span>Frontend Engineering</span><span>78%</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{width: '78%'}}></div></div>
                    </div>
                    <div className="progress-item">
                      <div className="progress-label-row">
                        <span>Backend Engineering</span><span>65%</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{width: '65%'}}></div></div>
                    </div>
                    <div className="progress-item">
                      <div className="progress-label-row">
                        <span>Cloud Infrastructure</span><span>82%</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{width: '82%'}}></div></div>
                    </div>
                    <div className="progress-item">
                      <div className="progress-label-row">
                        <span>Security Auditing</span><span>54%</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{width: '54%'}}></div></div>
                    </div>
                    <div className="progress-item">
                      <div className="progress-label-row">
                        <span>Data Science</span><span>41%</span>
                      </div>
                      <div className="progress-track"><div className="progress-fill" style={{width: '41%'}}></div></div>
                    </div>
                  </div>
                </div>

                <div className="admin-card">
                  <h3 className="admin-card-header">System alerts</h3>
                  <div className="alerts-list">
                    <div className="alert-item alert-danger">
                      <AlertCircle size={16} />
                      <div>Database CPU spike detected on primary cluster.</div>
                    </div>
                    <div className="alert-item alert-warning">
                      <AlertCircle size={16} />
                      <div>AI Mentor latency is elevated (&gt;500ms).</div>
                    </div>
                    <div className="alert-item alert-info">
                      <AlertCircle size={16} />
                      <div>Scheduled maintenance window in 2 days.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="bottom-workspace-grid">
                <div className="workspace-card" style={{borderTopColor: '#3B82F6'}} onClick={() => setActiveTab('students')}>
                  <h4>Students</h4><p>View {statsData.totalStudents} students</p>
                </div>
                <div className="workspace-card" style={{borderTopColor: '#10B981'}} onClick={() => setActiveTab('mentors')}>
                  <h4>Mentors</h4><p>Manage {statsData.totalMentors} mentors</p>
                </div>
                <div className="workspace-card" style={{borderTopColor: '#8B5CF6'}} onClick={() => setActiveTab('scenarios')}>
                  <h4>Scenarios</h4><p>Edit {statsData.totalScenarios} scenarios</p>
                </div>
                <div className="workspace-card" style={{borderTopColor: '#F59E0B'}} onClick={() => setActiveTab('submissions')}>
                  <h4>Submissions</h4><p>3 pending review</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* USER MANAGEMENT PAGE */}
        {/* ========================================================= */}
        {activeTab === 'users' && (
          <>
            <header className="admin-header">
              <div>
                <h1 className="admin-page-title">{t('admin.users.title')}</h1>
              </div>
              <div className="admin-header-actions">
                <button className="admin-btn-primary" onClick={() => setShowAddUserModal(true)}>
                  <Plus size={16} /> Add user
                </button>
              </div>
            </header>
            <div className="admin-content">
              <div className="admin-table-container">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>USER</th>
                        <th>ROLE</th>
                        <th>STATUS</th>
                        <th>LAST ACTIVITY</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.filter(u => u.role !== 'Admin').map(u => (
                        <tr key={u.id}>
                          <td>
                            <div className="user-name-cell" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {u.avatar_base64 ? (
                                <img src={u.avatar_base64} alt={u.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                              ) : (
                                <span className="avatar-placeholder" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>{u.name.split(' ').map(n => n[0] || '').join('')}</span>
                              )}
                              <div>
                                <span className="name" style={{ display: 'block' }}>{u.name}</span>
                                <span className="email" style={{ display: 'block' }}>{u.email}</span>
                              </div>
                            </div>
                          </td>
                          <td><StatusBadge variant={u.role === 'Admin' ? 'danger' : u.role === 'Mentor' ? 'warning' : 'info'}>{u.role}</StatusBadge></td>
                          <td><StatusBadge variant={getStatusBadge(u.status)}>{u.status}</StatusBadge></td>
                          <td><span style={{color: '#64748B', fontSize: '13px'}}>{u.lastActivity}</span></td>
                          <td>
                            <div className="admin-table-actions">
                              <button className="admin-icon-btn" onClick={() => setSelectedProfile(u)}><Eye size={16} /></button>
                              <button className="admin-icon-btn" onClick={() => handleEditClick(u)}><Edit size={16} /></button>
                              <button 
                                className="admin-icon-btn" 
                                title={u.status === 'Suspended' ? 'Reactivate User' : 'Suspend User'}
                                onClick={() => handleToggleStatus(u.id, u.status)}
                              >
                                {u.status === 'Suspended' ? <CheckCircle2 size={16} color="#166534" /> : <Ban size={16} color="#991B1B" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* STUDENTS PAGE */}
        {/* ========================================================= */}
        {activeTab === 'students' && (
          <>
            <header className="admin-header">
              <div>
                <h1 className="admin-page-title">Students</h1>
                <p className="admin-page-subtitle">{studentsData.length} shown</p>
              </div>
              <div className="admin-header-actions">
                <button className="admin-btn-primary"><Plus size={16} /> Add student</button>
              </div>
            </header>
            <div className="admin-content">
              <div className="admin-table-container">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>STUDENT</th>
                        <th>SCORE</th>
                        <th>SCENARIOS</th>
                        <th>RISK</th>
                        <th>LAST ACTIVE</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsData.map(st => (
                        <tr key={st.id}>
                          <td style={{fontWeight: 500}}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {st.avatar_base64 ? (
                                <img src={st.avatar_base64} alt={st.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                              ) : (
                                <span className="avatar-placeholder" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>{st.name.split(' ').map(n => n[0] || '').join('')}</span>
                              )}
                              {st.name}
                            </div>
                          </td>
                          <td>{st.score}%</td>
                          <td>{st.scenarios}</td>
                          <td><StatusBadge variant={getRiskBadge(st.risk)}>{st.risk}</StatusBadge></td>
                          <td><span style={{color: '#64748B', fontSize: '13px'}}>{st.lastActive}</span></td>
                          <td>
                            <div className="admin-table-actions">
                              <button className="admin-icon-btn" onClick={() => setSelectedProfile(st)}><Eye size={16} /></button>
                              <button className="admin-icon-btn" onClick={() => handleEditClick(st)}><Edit size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* MENTORS PAGE */}
        {/* ========================================================= */}
        {activeTab === 'mentors' && (
          <>
            <header className="admin-header">
              <div>
                <h1 className="admin-page-title">Mentors</h1>
              </div>
              <div className="admin-header-actions">
                <button className="admin-btn-primary"><Plus size={16} /> Invite mentor</button>
              </div>
            </header>
            <div className="admin-content">
              <div className="admin-table-container">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>MENTOR</th>
                        <th>ORGANIZATION</th>
                        <th>MENTEES</th>
                        <th>RATING</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mentorsData.map(m => (
                        <tr key={m.id}>
                          <td style={{fontWeight: 500}}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {m.avatar_base64 ? (
                                <img src={m.avatar_base64} alt={m.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                              ) : (
                                <span className="avatar-placeholder" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>{m.name.split(' ').map(n => n[0] || '').join('')}</span>
                              )}
                              {m.name}
                            </div>
                          </td>
                          <td>{m.org}</td>
                          <td>{m.mentees}</td>
                          <td>{m.rating} ★</td>
                          <td><StatusBadge variant={getStatusBadge(m.status)}>{m.status}</StatusBadge></td>
                          <td>
                            <div className="admin-table-actions">
                              <button className="admin-icon-btn" onClick={() => setSelectedProfile(m)}><Eye size={16} /></button>
                              <button className="admin-icon-btn" onClick={() => handleEditClick(m)}><Edit size={16} /></button>
                              <button className="admin-icon-btn"><Ban size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* SCENARIOS PAGE */}
        {/* ========================================================= */}
        {activeTab === 'scenarios' && (
          <>
            <header className="admin-header">
              <div>
                <h1 className="admin-page-title">Scenario Manager</h1>
              </div>
              <div className="admin-header-actions">
                <button className="admin-btn-primary"><Plus size={16} /> New scenario</button>
              </div>
            </header>
            <div className="admin-content">
              <div className="admin-table-container">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>TITLE</th>
                        <th>INDUSTRY</th>
                        <th>DIFFICULTY</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenariosData.map(sc => (
                        <tr key={sc.id}>
                          <td style={{color: '#64748B', fontSize: '13px'}}>{sc.id}</td>
                          <td style={{fontWeight: 500}}>{sc.title}</td>
                          <td>{sc.industry}</td>
                          <td>
                            <StatusBadge variant={sc.difficulty === 'Advanced' ? 'danger' : sc.difficulty === 'Intermediate' ? 'warning' : 'info'}>
                              {sc.difficulty}
                            </StatusBadge>
                          </td>
                          <td><StatusBadge variant={getStatusBadge(sc.status)}>{sc.status}</StatusBadge></td>
                          <td>
                            <div className="admin-table-actions">
                              <button className="admin-icon-btn"><Edit size={16} /></button>
                              <button className="admin-icon-btn"><UploadCloud size={16} /></button>
                              <button className="admin-icon-btn"><Copy size={16} /></button>
                              <button className="admin-icon-btn"><Archive size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* MODULES PAGE */}
        {/* ========================================================= */}
        {activeTab === 'modules' && (
          <>
            <header className="admin-header">
              <div>
                <h1 className="admin-page-title">Modules</h1>
              </div>
              <div className="admin-header-actions">
                <button className="admin-btn-primary"><Plus size={16} /> New module</button>
              </div>
            </header>
            <div className="admin-content">
              <div className="admin-card">
                <div className="modules-grid">
                  {modulesData.map(mod => (
                    <div className="module-card" key={mod.id}>
                      <div className="module-card-header">
                        <h4 className="module-card-title">{mod.title}</h4>
                        <StatusBadge variant={getStatusBadge(mod.status)}>{mod.status}</StatusBadge>
                      </div>
                      <p className="module-card-subtitle">{mod.meta}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* SUBMISSIONS PAGE */}
        {/* ========================================================= */}
        {activeTab === 'submissions' && (
          <>
            <header className="admin-header">
              <div>
                <h1 className="admin-page-title">Submissions</h1>
              </div>
            </header>
            <div className="admin-content">
              <div className="admin-table-container">
                <div className="admin-table-header-row">
                  <span className="admin-table-title">Recent submissions</span>
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>STUDENT</th>
                        <th>TYPE</th>
                        <th>SCENARIO</th>
                        <th>SUBMITTED</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submissionsData.map(sub => (
                        <tr key={sub.id}>
                          <td style={{color: '#64748B', fontSize: '13px'}}>{sub.id}</td>
                          <td style={{fontWeight: 500}}>{sub.student}</td>
                          <td><StatusBadge variant="info">{sub.type}</StatusBadge></td>
                          <td>{sub.scenario}</td>
                          <td style={{color: '#64748B', fontSize: '13px'}}>{sub.submitted}</td>
                          <td><StatusBadge variant={getStatusBadge(sub.status)}>{sub.status}</StatusBadge></td>
                          <td>
                            <div className="admin-table-actions">
                              <button className="admin-icon-btn"><Eye size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========================================================= */}
        {/* REPORTS PAGE */}
        {/* ========================================================= */}
        {activeTab === 'reports' && (
          <>
            <header className="admin-header">
              <div>
                <h1 className="admin-page-title">{t('admin.reports.title')}</h1>
              </div>
            </header>
            <div className="admin-content">
              <div className="admin-stats-grid">
                <StatCard label={t('admin.dashboard.avgReadiness')} value="68%" />
                <StatCard label="SCENARIOS RUN" value="8,920" />
                <StatCard label="COMPLETION RATE" value="63%" />
                <StatCard label="EVIDENCE ITEMS" value="920" />
              </div>

              <div className="admin-grid-2col">
                <div className="admin-card">
                  <h3 className="admin-card-header">{t('admin.reports.cohortCompletion')}</h3>
                  <table className="admin-table" style={{marginTop: '16px'}}>
                    <thead>
                      <tr>
                        <th>{t('admin.reports.cohort')}</th>
                        <th>{t('admin.reports.avgScore')}</th>
                        <th>{t('admin.reports.completion')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{t('admin.reports.c1')}</td>
                        <td>82%</td>
                        <td style={{width: '200px'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <div className="progress-track" style={{flexGrow: 1}}><div className="progress-fill" style={{width: '90%'}}></div></div>
                            <span style={{fontSize: '13px', fontWeight: 500}}>90%</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>{t('admin.reports.c2')}</td>
                        <td>64%</td>
                        <td>
                          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <div className="progress-track" style={{flexGrow: 1}}><div className="progress-fill" style={{width: '45%'}}></div></div>
                            <span style={{fontSize: '13px', fontWeight: 500}}>45%</span>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
                  <div className="admin-card">
                    <h3 className="admin-card-header">{t('admin.reports.topScenarios')}</h3>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                        <span style={{fontWeight: 500}}>{t('admin.reports.s1')}</span><span style={{color: '#64748B'}}>1,204 {t('admin.reports.runs')}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                        <span style={{fontWeight: 500}}>{t('admin.reports.s2')}</span><span style={{color: '#64748B'}}>984 {t('admin.reports.runs')}</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                        <span style={{fontWeight: 500}}>{t('admin.reports.s3')}</span><span style={{color: '#64748B'}}>842 {t('admin.reports.runs')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="admin-card">
                    <h3 className="admin-card-header">{t('admin.reports.engagement')}</h3>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                        <span style={{fontWeight: 500, color: '#64748B'}}>{t('admin.reports.dau')}</span><span style={{fontWeight: 600}}>845</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                        <span style={{fontWeight: 500, color: '#64748B'}}>{t('admin.reports.avgSession')}</span><span style={{fontWeight: 600}}>42m 15s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        {activeTab === 'settings' && (
          <StudentSettings currentUser={currentUser || { role: 'admin', fullname: 'System Admin' }} onProfileUpdate={handleProfileUpdate} />
        )}

      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content glass-panel">
            <h2 className="admin-modal-title">{t('admin.modal.addUser')}</h2>
            <form onSubmit={handleAddUserSubmit} className="admin-modal-form">
              <div className="form-group">
                <label>{t('admin.edit.fullName')}</label>
                <input 
                  type="text" 
                  value={addUserForm.fullname} 
                  onChange={e => setAddUserForm({...addUserForm, fullname: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('admin.edit.email')}</label>
                <input 
                  type="email" 
                  value={addUserForm.email} 
                  onChange={e => setAddUserForm({...addUserForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('admin.edit.username')}</label>
                <input 
                  type="text" 
                  value={addUserForm.username} 
                  onChange={e => setAddUserForm({...addUserForm, username: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  value={addUserForm.password} 
                  onChange={e => setAddUserForm({...addUserForm, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>{t('admin.edit.role')}</label>
                <select 
                  value={addUserForm.role} 
                  onChange={e => setAddUserForm({...addUserForm, role: e.target.value})}
                >
                  <option value="Student">{t('admin.roles.student')}</option>
                  <option value="Mentor">{t('admin.roles.mentor')}</option>
                </select>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn-secondary" onClick={() => setShowAddUserModal(false)}>{t('admin.modal.cancel')}</button>
                <button type="submit" className="admin-btn-primary" disabled={isAddingUser}>
                  {isAddingUser ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal (Detailed 2-Column Layout) */}
      {selectedProfile && (
        <div className="admin-modal-overlay" onClick={() => setSelectedProfile(null)}>
          <div 
            className="admin-modal-content glass-panel" 
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '900px', padding: '32px' }}
          >
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <h2 className="admin-modal-title" style={{margin: 0}}>Profile</h2>
              <button className="admin-icon-btn" onClick={() => setSelectedProfile(null)}>✕</button>
            </div>
            <p style={{margin: '-16px 0 24px 0', color: '#64748B', fontSize: '14px'}}>
              Public learner profile — what mentors and recruiters see.
            </p>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px'}}>
              {/* LEFT COLUMN */}
              <div style={{background: 'rgba(255,255,255,0.4)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '12px'}}>
                  <div style={{width: '90px', height: '90px', borderRadius: '50%', background: '#0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '36px', fontWeight: 'bold', boxShadow: '0 4px 15px rgba(13, 148, 136, 0.3)'}}>
                    {(selectedProfile.name || selectedProfile.fullname || 'U').charAt(0)}
                  </div>
                  <div>
                    <h3 style={{margin: 0, fontSize: '22px', color: '#0F172A', fontWeight: 800}}>{selectedProfile.name || selectedProfile.fullname}</h3>
                    <p style={{margin: '4px 0 0 0', color: '#64748B', fontSize: '13px'}}>{selectedProfile.major || 'Unknown Major'} — {selectedProfile.target_track || selectedProfile.role || 'Track'}</p>
                  </div>
                </div>

                <div style={{borderTop: '1px solid rgba(255,255,255,0.5)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  {selectedProfile.email && (
                    <div style={{display: 'flex', gap: '12px', alignItems: 'center', color: '#475569', fontSize: '14px'}}>
                      <Inbox size={16} /> <span>{selectedProfile.email}</span>
                    </div>
                  )}
                  {selectedProfile.org && (
                    <div style={{display: 'flex', gap: '12px', alignItems: 'center', color: '#475569', fontSize: '14px'}}>
                      <GraduationCap size={16} /> <span>{selectedProfile.org}</span>
                    </div>
                  )}
                  <div style={{display: 'flex', gap: '12px', alignItems: 'center', color: '#10b981', fontSize: '14px', fontWeight: 700}}>
                    <Briefcase size={16} /> <span>Open to roles</span>
                  </div>
                </div>

                <div style={{borderTop: '1px solid rgba(255,255,255,0.5)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left'}}>
                  <div style={{textAlign: 'left'}}>
                    <div style={{fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <BookOpen size={12} /> EDUCATION LEVEL
                    </div>
                    <div style={{fontSize: '14px', color: '#0F172A', fontWeight: 600}}>{selectedProfile.education_level || 'Not specified'}</div>
                  </div>
                  <div style={{textAlign: 'left'}}>
                    <div style={{fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <Database size={12} /> TARGET INDUSTRY
                    </div>
                    <div style={{fontSize: '14px', color: '#0F172A', fontWeight: 600}}>{selectedProfile.target_industry || 'Not specified'}</div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN */}
              <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
                
                {/* ABOUT */}
                <div style={{background: 'rgba(255,255,255,0.4)', borderRadius: '16px', padding: '24px'}}>
                  <h4 style={{margin: '0 0 16px 0', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0F172A', borderBottom: '1px solid rgba(255,255,255,0.5)', paddingBottom: '12px'}}>
                    About
                  </h4>
                  <p style={{margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.6}}>
                    {selectedProfile.occupation_goal ? `Targeting ${selectedProfile.occupation_goal} roles. Active in WorkReady AI's mentorship track.` : 'No description provided.'}
                  </p>
                </div>

                {/* CAREER GOALS */}
                <div style={{background: 'rgba(255,255,255,0.4)', borderRadius: '16px', padding: '24px'}}>
                  <h4 style={{margin: '0 0 16px 0', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0F172A', borderBottom: '1px solid rgba(255,255,255,0.5)', paddingBottom: '12px'}}>
                    Career Goals
                  </h4>
                  <p style={{margin: 0, fontSize: '14px', color: '#475569', fontStyle: 'italic'}}>
                    {selectedProfile.career_goal ? `"${selectedProfile.career_goal}"` : '"Not specified"'}
                  </p>
                </div>

                {/* STRENGTHS & DEVELOP AREAS */}
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                  <div style={{background: 'rgba(255,255,255,0.4)', borderRadius: '16px', padding: '24px'}}>
                    <h4 style={{margin: '0 0 16px 0', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10b981', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', paddingBottom: '12px'}}>
                      Strengths
                    </h4>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                      {selectedProfile.strengths && selectedProfile.strengths.length > 0 ? selectedProfile.strengths.map((s, i) => (
                        <span key={i} style={{padding: '6px 12px', background: 'rgba(209, 250, 229, 0.6)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#047857', borderRadius: '20px', fontSize: '12px', fontWeight: 600}}>{s}</span>
                      )) : <span style={{fontSize: '13px', color: '#64748B'}}>None listed</span>}
                    </div>
                  </div>
                  
                  <div style={{background: 'rgba(255,255,255,0.4)', borderRadius: '16px', padding: '24px'}}>
                    <h4 style={{margin: '0 0 16px 0', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#3b82f6', borderBottom: '1px solid rgba(59, 130, 246, 0.2)', paddingBottom: '12px'}}>
                      Develop Areas
                    </h4>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                      {selectedProfile.develop_areas && selectedProfile.develop_areas.length > 0 ? selectedProfile.develop_areas.map((d, i) => (
                        <span key={i} style={{padding: '6px 12px', background: 'rgba(219, 234, 254, 0.6)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#1d4ed8', borderRadius: '20px', fontSize: '12px', fontWeight: 600}}>{d}</span>
                      )) : <span style={{fontSize: '13px', color: '#64748B'}}>None listed</span>}
                    </div>
                  </div>
                </div>

                {/* CERTIFICATIONS */}
                <div style={{background: 'rgba(255,255,255,0.4)', borderRadius: '16px', padding: '24px'}}>
                  <h4 style={{margin: '0 0 16px 0', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0F172A', borderBottom: '1px solid rgba(255,255,255,0.5)', paddingBottom: '12px'}}>
                    Certifications & Badges
                  </h4>
                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                    <span style={{padding: '8px 16px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.8)', color: '#475569', borderRadius: '24px', fontSize: '13px', fontWeight: 600}}>Clean Coder</span>
                    <span style={{padding: '8px 16px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.8)', color: '#475569', borderRadius: '24px', fontSize: '13px', fontWeight: 600}}>Incident Responder</span>
                    <span style={{padding: '8px 16px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.8)', color: '#475569', borderRadius: '24px', fontSize: '13px', fontWeight: 600}}>Code Reviewer</span>
                    <span style={{padding: '8px 16px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.8)', color: '#475569', borderRadius: '24px', fontSize: '13px', fontWeight: 600}}>System Designer</span>
                    <span style={{padding: '8px 16px', background: 'rgba(209, 250, 229, 0.6)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#047857', borderRadius: '24px', fontSize: '13px', fontWeight: 600}}>AWS Cloud Practitioner</span>
                    <span style={{padding: '8px 16px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.8)', color: '#475569', borderRadius: '24px', fontSize: '13px', fontWeight: 600}}>Git Pro</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="admin-modal-actions" style={{marginTop: '24px'}}>
              <button type="button" className="admin-btn-secondary" onClick={() => setSelectedProfile(null)}>{t('admin.modal.close')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {editingProfile && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content glass-panel" style={{ maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 className="admin-modal-title">{t('admin.modal.editUser')}</h2>
            <form onSubmit={handleEditSubmit} className="admin-modal-form">
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div className="form-group">
                  <label>{t('admin.edit.fullName')}</label>
                  <input type="text" value={editForm.fullname} onChange={e => setEditForm({...editForm, fullname: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>{t('admin.edit.email')}</label>
                  <input type="email" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>{t('admin.edit.username')}</label>
                  <input type="text" value={editForm.username} onChange={e => setEditForm({...editForm, username: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>{t('admin.edit.role')}</label>
                  <select value={editForm.role} onChange={e => setEditForm({...editForm, role: e.target.value})}>
                    <option value="Student">{t('admin.roles.student')}</option>
                    <option value="Mentor">{t('admin.roles.mentor')}</option>
                    <option value="Admin">{t('admin.roles.admin')}</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>{t('admin.edit.track')}</label>
                  <input type="text" value={editForm.target_track} onChange={e => setEditForm({...editForm, target_track: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>{t('admin.edit.industry')}</label>
                  <input type="text" value={editForm.target_industry} onChange={e => setEditForm({...editForm, target_industry: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>{t('admin.edit.major')}</label>
                  <input type="text" value={editForm.major} onChange={e => setEditForm({...editForm, major: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>{t('admin.edit.eduLevel')}</label>
                  <input type="text" value={editForm.education_level} onChange={e => setEditForm({...editForm, education_level: e.target.value})} />
                </div>
              </div>

              <div className="form-group" style={{marginTop: '16px'}}>
                <label>{t('admin.edit.occupation')}</label>
                <textarea value={editForm.occupation_goal} onChange={e => setEditForm({...editForm, occupation_goal: e.target.value})} rows={2} />
              </div>

              <div className="form-group">
                <label>{t('admin.edit.careerGoal')}</label>
                <textarea value={editForm.career_goal} onChange={e => setEditForm({...editForm, career_goal: e.target.value})} rows={2} />
              </div>

              <div className="form-group">
                <label>{t('admin.edit.strengths')}</label>
                <input type="text" value={editForm.strengths} onChange={e => setEditForm({...editForm, strengths: e.target.value})} />
              </div>

              <div className="form-group">
                <label>{t('admin.edit.develop')}</label>
                <input type="text" value={editForm.develop_areas} onChange={e => setEditForm({...editForm, develop_areas: e.target.value})} />
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-btn-secondary" onClick={() => setEditingProfile(null)}>{t('admin.modal.cancel')}</button>
                <button type="submit" className="admin-btn-primary" disabled={isSubmittingEdit}>
                  {isSubmittingEdit ? t('admin.edit.saving') : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
