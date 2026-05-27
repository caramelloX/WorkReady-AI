import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import './AdminScreen.css';
import { api, checkGroqStatus } from '../../components/api.js';
import StudentSettings from '../Student/StudentSettings';
import MentorMatchingDashboard from './MentorMatchingDashboard';
import ScenarioManager from './ScenarioManager.jsx';
import { DEMO_STUDENTS, DEMO_MENTORS } from '../../data/demoData.js';
import { SCENARIOS, SCENARIO_ENRICHMENT } from '../../data/scenarioData.js';
import Swal from 'sweetalert2';
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
  Trash2,
  AlertCircle,
  CheckCircle2,
  Server,
  Database,
  Cpu,
  BrainCircuit,
  ChevronRight,
  TrendingUp,
  FileCheck,
  Clock,
  UserCog,
  ScrollText
} from 'lucide-react';

// Reusable Components
const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="admin-stat-card" style={{'--stat-color': color}}>
    {Icon && (
      <div className="admin-stat-icon-wrap">
        <Icon size={20} />
      </div>
    )}
    <span className="admin-stat-label">{label}</span>
    <h3 className="admin-stat-value">{value}</h3>
    <div className="admin-stat-bar" />
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
const [submissionsData, setSubmissionsData] = useState([]);
  const [statsData, setStatsData] = useState({ totalStudents: 0, totalMentors: 0, totalScenarios: 0 });
  const [groqStatus, setGroqStatus] = useState('loading');

  useEffect(() => {
    checkGroqStatus().then(setGroqStatus);
  }, []);

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
      
      setSubmissionsData([]);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
    // Poll for real-time updates every 60 seconds without triggering the loading spinner
    const intervalId = setInterval(() => fetchAdminData(true), 60000);
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
  const [showAddScenarioModal, setShowAddScenarioModal] = useState(false);
  const [addScenarioForm, setAddScenarioForm] = useState({
    id: '',
    title: '',
    category: '',
    difficulty: 'Available',
    estimatedTime: '25 min',
    briefing: '',
    objectives: ''
  });
  const [isAddingScenario, setIsAddingScenario] = useState(false);
  const [isGeneratingScenarios, setIsGeneratingScenarios] = useState(false);
  const [activeScenarioTrack, setActiveScenarioTrack] = useState('All tracks');
  const [activeUserTrack, setActiveUserTrack] = useState('All tracks');

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [matchingStudent, setMatchingStudent] = useState(null);

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

  const handleAddScenarioSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsAddingScenario(true);
      const scenario = await api.createScenario(addScenarioForm);
      setScenariosData(prev => [...prev, scenario]);
      setStatsData(prev => ({ ...prev, totalScenarios: (prev.totalScenarios || 0) + 1 }));
      setShowAddScenarioModal(false);
      setAddScenarioForm({
        id: '',
        title: '',
        category: '',
        difficulty: 'Available',
        estimatedTime: '25 min',
        briefing: '',
        objectives: ''
      });
      await fetchAdminData(true);
    } catch (err) {
      console.error('Failed to add scenario', err);
      Swal.fire({
        title: 'Unable to add scenario',
        text: err.message || 'Failed to add scenario',
        icon: 'error'
      });
    } finally {
      setIsAddingScenario(false);
    }
  };

  const handleGenerateScenarios = async () => {
    const trackScope = activeScenarioTrack === 'All tracks' ? 'all learner tracks' : activeScenarioTrack;
    const result = await Swal.fire({
      title: 'Generate learner-fit scenarios?',
      text: `AI will use student goals, target industries, and related fields to create job-ready scenarios for ${trackScope}. This will replace the current scenario list.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Generate by learner goals',
      cancelButtonText: 'Cancel'
    });

    if (!result.isConfirmed) return;

    try {
      setIsGeneratingScenarios(true);
      const data = await api.regenerateScenarios({
        useLearnerProfiles: true,
        track: activeScenarioTrack === 'All tracks' ? '' : activeScenarioTrack,
        count: activeScenarioTrack === 'All tracks' ? 6 : 4
      });
      const generatedScenarios = data.scenarios || [];
      setScenariosData(generatedScenarios);
      setStatsData(prev => ({ ...prev, totalScenarios: generatedScenarios.length }));
      setActiveScenarioTrack('All tracks');
      await Swal.fire({
        title: 'Scenarios generated',
        text: `Generated ${generatedScenarios.length} scenarios using ${data.learnerProfilesUsed || 0} learner profiles.`,
        icon: 'success',
        timer: 1600,
        showConfirmButton: false
      });
      await fetchAdminData(true);
    } catch (err) {
      console.error('Failed to generate scenarios', err);
      Swal.fire({
        title: 'Unable to generate scenarios',
        text: err.message || 'Failed to generate scenarios',
        icon: 'error'
      });
    } finally {
      setIsGeneratingScenarios(false);
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

  const handleDeleteUser = async (user) => {
    const result = await Swal.fire({
      title: t('admin.delete.confirmTitle'),
      text: t('admin.delete.confirmText'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: t('admin.delete.confirmBtn'),
      cancelButtonText: t('admin.delete.cancelBtn')
    });

    if (!result.isConfirmed) return;

    try {
      await api.deleteAccount(user.id);
      setUsersData(prev => prev.filter(u => u.id !== user.id));
      setStudentsData(prev => prev.filter(st => st.id !== user.id));
      setMentorsData(prev => prev.filter(m => m.id !== user.id));
      await Swal.fire({
        title: t('admin.delete.successTitle'),
        text: t('admin.delete.successText'),
        icon: 'success',
        timer: 1600,
        showConfirmButton: false
      });
      await fetchAdminData(true);
    } catch (err) {
      console.error('Failed to delete user', err);
      Swal.fire({
        title: t('admin.delete.errorTitle'),
        text: err.message || 'Failed to delete user',
        icon: 'error'
      });
    }
  };

  const handleDeleteScenario = async (scenario) => {
    const result = await Swal.fire({
      title: t('admin.delete.scenario.title'),
      text: t('admin.delete.scenario.text').replace('{0}', scenario.title),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: t('admin.delete.scenario.confirmBtn'),
      cancelButtonText: t('admin.delete.cancelBtn')
    });

    if (!result.isConfirmed) return;

    try {
      await api.deleteScenario(scenario.id);
      setScenariosData(prev => prev.filter(sc => sc.id !== scenario.id));
      setStatsData(prev => ({ ...prev, totalScenarios: Math.max((prev.totalScenarios || 1) - 1, 0) }));
      await Swal.fire({
        title: 'Scenario deleted',
        icon: 'success',
        timer: 1400,
        showConfirmButton: false
      });
      await fetchAdminData(true);
    } catch (err) {
      console.error('Failed to delete scenario', err);
      Swal.fire({
        title: 'Unable to delete scenario',
        text: err.message || 'Failed to delete scenario',
        icon: 'error'
      });
    }
  };

  const navItems = [
    { id: 'dashboard', label: t('admin.sidebar.dashboard') || 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: t('admin.sidebar.users') || 'User Management', icon: Users },
    { id: 'students', label: t('admin.sidebar.students') || 'Students', icon: GraduationCap },
    { id: 'mentors', label: t('admin.sidebar.mentors') || 'Mentors', icon: Briefcase },
    { id: 'matching', label: 'Mentor Matching', icon: TrendingUp },
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

  const getScenarioTrack = (scenario) => {
    const fallbackTag = scenario.tags?.find(tag => !['Beginner', 'Intermediate', 'Advanced'].includes(tag));
    return scenario.industry || scenario.category || fallbackTag || 'General';
  };

  const scenarioTrackCounts = scenariosData.reduce((counts, scenario) => {
    const track = getScenarioTrack(scenario);
    counts[track] = (counts[track] || 0) + 1;
    return counts;
  }, {});

  const scenarioTracks = ['All tracks', ...Object.keys(scenarioTrackCounts).sort((a, b) => a.localeCompare(b))];

  // Modules = scenarios grouped by track (derived, no separate state needed)
  const modulesData = Object.entries(scenarioTrackCounts).map(([track, count]) => ({
    id: track,
    title: track,
    count,
  }));
  const filteredScenariosData = activeScenarioTrack === 'All tracks'
    ? scenariosData
    : scenariosData.filter(scenario => getScenarioTrack(scenario) === activeScenarioTrack);

  const userTrackCounts = usersData.filter(u => u.role === 'student').reduce((counts, user) => {
    const track = user.target_track || user.targetTrack || 'General';
    counts[track] = (counts[track] || 0) + 1;
    return counts;
  }, {});

  const userTracks = ['All tracks', ...Object.keys(userTrackCounts).sort((a, b) => a.localeCompare(b))];

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
                <h1 className="admin-page-title">{t('admin.page.dashboard')}</h1>
                <p className="admin-page-subtitle">{t('admin.page.dashboard.sub')}</p>
              </div>
              <div className="admin-header-actions">
                <StatusBadge variant="success">
                  <CheckCircle2 size={12} style={{marginRight: '4px'}}/>
                  {t('admin.status.allNormal')}
                </StatusBadge>
              </div>
            </header>

            <div className="admin-content">
              {/* Top Stats */}
              <div className="admin-stats-grid">
                <StatCard label={t('admin.stat.students')}        value={statsData.totalStudents}  icon={GraduationCap} color="#3B82F6" />
                <StatCard label={t('admin.stat.mentors')}          value={statsData.totalMentors}   icon={Users}         color="#10B981" />
                <StatCard label={t('admin.stat.activeScenarios')}  value={statsData.totalScenarios} icon={BookOpen}      color="#8B5CF6" />
                <StatCard label={t('admin.stat.portfolios')}       value="12"                       icon={FileCheck}     color="#F59E0B" />
                <StatCard label={t('admin.stat.reviews')}          value="3"                        icon={Clock}         color="#EF4444" />
              </div>

              {/* Scenario Summary Cards */}
              {(() => {
                const enrichedScenarios = SCENARIOS.map(sc => ({ ...sc, ...(SCENARIO_ENRICHMENT[sc.id] || {}) }));
                const activeCount   = enrichedScenarios.filter(s => s.status === 'active').length;
                const draftCount    = enrichedScenarios.filter(s => s.status === 'draft').length;
                const archivedCount = enrichedScenarios.filter(s => s.status === 'archived').length;
                return (
                  <div className="admin-grid-2col" style={{ marginTop: 0 }}>
                    <div className="admin-card">
                      <h3 className="admin-card-header">Scenario Library Summary</h3>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
                        {[
                          { label: 'Total',    value: enrichedScenarios.length, color: '#6366f1' },
                          { label: 'Active',   value: activeCount,              color: '#10b981' },
                          { label: 'Draft',    value: draftCount,               color: '#f59e0b' },
                          { label: 'Archived', value: archivedCount,            color: '#94a3b8' },
                        ].map(item => (
                          <div key={item.label} style={{ textAlign: 'center', minWidth: 60 }}>
                            <div style={{ fontSize: 28, fontWeight: 800, color: item.color, lineHeight: 1 }}>{item.value}</div>
                            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>{item.label}</div>
                          </div>
                        ))}
                      </div>
                      <button className="quick-action-btn" style={{ marginTop: 16 }} onClick={() => setActiveTab('scenarios')}>
                        <div className="quick-action-left">
                          <span className="quick-action-icon" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}><BookOpen size={16} /></span>
                          Manage Scenarios
                        </div>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                    <div className="admin-card">
                      <h3 className="admin-card-header">Active Scenarios</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                        {enrichedScenarios.filter(s => s.status === 'active').slice(0, 3).map(sc => (
                          <div key={sc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: '1px solid rgba(226,232,240,0.6)' }}>
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>{sc.title}</span>
                            <span style={{ fontSize: 11, color: '#6366f1', fontWeight: 700, background: 'rgba(99,102,241,0.08)', padding: '2px 8px', borderRadius: 6 }}>{sc.difficulty || 'beginner'}</span>
                          </div>
                        ))}
                        {activeCount === 0 && <span style={{ color: '#94a3b8', fontSize: 13 }}>No active scenarios yet.</span>}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Middle Section */}
              <div className="admin-grid-2col">
                <div className="admin-card">
                  <h3 className="admin-card-header">{t('admin.sys.title')}</h3>
                  <div className="system-status-grid">
                    <div className="system-status-item">
                      <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <Server size={18} color="currentColor" />
                        <span className="name">{t('admin.sys.apiGateway')}</span>
                      </div>
                      <StatusBadge variant="success">{t('admin.sys.operational')}</StatusBadge>
                    </div>
                    <div className="system-status-item">
                      <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <Cpu size={18} color="currentColor" />
                        <span className="name">{t('admin.sys.scenarioEngine')}</span>
                      </div>
                      <StatusBadge variant="success">{t('admin.sys.operational')}</StatusBadge>
                    </div>
                    <div className="system-status-item">
                      <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <Database size={18} color="currentColor" />
                        <span className="name">{t('admin.sys.storage')}</span>
                      </div>
                      <StatusBadge variant="success">{t('admin.sys.operational')}</StatusBadge>
                    </div>
                    <div className="system-status-item">
                      <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <BrainCircuit size={18} color="currentColor" />
                        <span className="name">{t('admin.sys.aiMentor')}</span>
                      </div>
                      {groqStatus === 'loading'     && <StatusBadge variant="info">{t('admin.sys.checking')}</StatusBadge>}
                      {groqStatus === 'operational' && <StatusBadge variant="success">{t('admin.sys.operational')}</StatusBadge>}
                      {groqStatus === 'degraded'    && <StatusBadge variant="warning">{t('admin.sys.degraded')}</StatusBadge>}
                      {groqStatus === 'offline'     && <StatusBadge variant="danger">{t('admin.sys.offline')}</StatusBadge>}
                    </div>
                  </div>
                </div>

                <div className="admin-card">
                  <h3 className="admin-card-header">{t('admin.quick.title')}</h3>
                  <div className="quick-action-list">
                    <button className="quick-action-btn" onClick={() => setActiveTab('scenarios')}>
                      <div className="quick-action-left">
                        <span className="quick-action-icon" style={{background:'rgba(139,92,246,0.1)',color:'#8B5CF6'}}><BookOpen size={16}/></span>
                        {t('admin.quick.scenarios')}
                      </div>
                      <ChevronRight size={16} color="currentColor"/>
                    </button>
                    <button className="quick-action-btn" onClick={() => setActiveTab('users')}>
                      <div className="quick-action-left">
                        <span className="quick-action-icon" style={{background:'rgba(59,130,246,0.1)',color:'#3B82F6'}}><UserCog size={16}/></span>
                        {t('admin.quick.users')}
                      </div>
                      <ChevronRight size={16} color="currentColor"/>
                    </button>
                    <button className="quick-action-btn" onClick={() => setActiveTab('reports')}>
                      <div className="quick-action-left">
                        <span className="quick-action-icon" style={{background:'rgba(16,185,129,0.1)',color:'#10B981'}}><ScrollText size={16}/></span>
                        {t('admin.quick.reports')}
                      </div>
                      <ChevronRight size={16} color="currentColor"/>
                    </button>
                  </div>
                </div>
              </div>

              {/* Lower Section */}
              <div className="admin-grid-2col">
                <div className="admin-card">
                  <h3 className="admin-card-header">{t('admin.cohort.title')}</h3>
                  <div className="progress-bar-container">
                    {[
                      { label: t('admin.cohort.frontend'),    pct: 78, color: '#3B82F6' },
                      { label: t('admin.cohort.backend'),     pct: 65, color: '#8B5CF6' },
                      { label: t('admin.cohort.cloud'),       pct: 82, color: '#10B981' },
                      { label: t('admin.cohort.security'),    pct: 54, color: '#F59E0B' },
                      { label: t('admin.cohort.datascience'), pct: 41, color: '#EF4444' },
                    ].map(({ label, pct, color }) => (
                      <div className="progress-item" key={label}>
                        <div className="progress-label-row">
                          <span>{label}</span>
                          <span style={{color, fontWeight: 700}}>{pct}%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{width: `${pct}%`, background: color}} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="admin-card">
                  <h3 className="admin-card-header">{t('admin.alerts.title')}</h3>
                  <div className="alerts-list">
                    <div className="alert-item alert-danger">
                      <AlertCircle size={16} />
                      <div>{t('admin.alerts.cpuSpike')}</div>
                    </div>
                    <div className="alert-item alert-warning">
                      <AlertCircle size={16} />
                      <div>{t('admin.alerts.aiLatency')}</div>
                    </div>
                    <div className="alert-item alert-info">
                      <AlertCircle size={16} />
                      <div>{t('admin.alerts.maintenance')}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="bottom-workspace-grid">
                <div className="workspace-card" style={{borderTopColor: '#3B82F6'}} onClick={() => setActiveTab('students')}>
                  <h4>{t('admin.workspace.students')}</h4><p>{t('admin.workspace.viewStudents').replace('{0}', statsData.totalStudents)}</p>
                </div>
                <div className="workspace-card" style={{borderTopColor: '#10B981'}} onClick={() => setActiveTab('mentors')}>
                  <h4>{t('admin.workspace.mentors')}</h4><p>{t('admin.workspace.manageMentors').replace('{0}', statsData.totalMentors)}</p>
                </div>
                <div className="workspace-card" style={{borderTopColor: '#8B5CF6'}} onClick={() => setActiveTab('scenarios')}>
                  <h4>{t('admin.workspace.scenarios')}</h4><p>{t('admin.workspace.editScenarios').replace('{0}', statsData.totalScenarios)}</p>
                </div>
                <div className="workspace-card" style={{borderTopColor: '#F59E0B'}} onClick={() => setActiveTab('submissions')}>
                  <h4>{t('admin.workspace.submissions')}</h4><p>{t('admin.workspace.pendingReview')}</p>
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
                  <Plus size={16} /> {t('admin.btn.addUser')}
                </button>
              </div>
            </header>
            <div className="admin-content">
              <div className="admin-scenario-track-bar">
                {userTracks.map(track => (
                  <button
                    key={track}
                    className={`admin-scenario-track-btn ${activeUserTrack === track ? 'active' : ''}`}
                    onClick={() => setActiveUserTrack(track)}
                  >
                    <span>{track}</span>
                    <strong>{track === 'All tracks' ? usersData.filter(u => u.role === 'student').length : userTrackCounts[track]}</strong>
                  </button>
                ))}
              </div>
              <div className="admin-table-container">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>{t('admin.table.user')}</th>
                        <th>{t('admin.table.role')}</th>
                        <th>{t('admin.table.status')}</th>
                        <th>{t('admin.table.lastActivity')}</th>
                        <th>{t('admin.table.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.filter(u => u.role !== 'Admin')
                        .filter(u => activeUserTrack === 'All tracks' || u.target_track === activeUserTrack || u.targetTrack === activeUserTrack)
                        .map(u => (
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
                                title={u.status === 'Suspended' ? t('admin.btn.reactivate') : t('admin.btn.suspend')}
                                onClick={() => handleToggleStatus(u.id, u.status)}
                              >
                                {u.status === 'Suspended' ? <CheckCircle2 size={16} color="#166534" /> : <Ban size={16} color="#991B1B" />}
                              </button>
                              <button
                                className="admin-icon-btn admin-icon-btn-danger"
                                title={t('admin.btn.deleteUser')}
                                onClick={() => handleDeleteUser(u)}
                              >
                                <Trash2 size={16} />
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
                <h1 className="admin-page-title">{t('admin.sidebar.students')}</h1>
                <p className="admin-page-subtitle">{t('admin.students.shown').replace('{0}', studentsData.length)}</p>
              </div>
            </header>
            <div className="admin-content">
              <div className="admin-table-container">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>{t('admin.table.student')}</th>
                        <th>{t('admin.table.score')}</th>
                        <th>{t('admin.table.scenarios')}</th>
                        <th>{t('admin.table.risk')}</th>
                        <th>{t('admin.table.lastActive')}</th>
                        <th>{t('admin.table.actions')}</th>
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
                              <button
                                className="admin-icon-btn admin-icon-btn-danger"
                                title={t('admin.btn.deleteUser')}
                                onClick={() => handleDeleteUser(st)}
                              >
                                <Trash2 size={16} />
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
        {/* MENTORS PAGE */}
        {/* ========================================================= */}
        {activeTab === 'mentors' && (
          <>
            <header className="admin-header">
              <div>
                <h1 className="admin-page-title">{t('admin.sidebar.mentors')}</h1>
              </div>
            </header>
            <div className="admin-content">
              <div className="admin-table-container">
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>{t('admin.table.mentor')}</th>
                        <th>{t('admin.table.organization')}</th>
                        <th>{t('admin.table.mentees')}</th>
                        <th>{t('admin.table.rating')}</th>
                        <th>{t('admin.table.status')}</th>
                        <th>{t('admin.table.actions')}</th>
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
                              <button
                                className="admin-icon-btn admin-icon-btn-danger"
                                title={t('admin.btn.deleteUser')}
                                onClick={() => handleDeleteUser(m)}
                              >
                                <Trash2 size={16} />
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
        {/* MENTOR MATCHING PAGE */}
        {/* ========================================================= */}
        {activeTab === 'matching' && (
          <>
            <header className="admin-header">
              <div>
                <h1 className="admin-page-title">Mentor Matching Dashboard</h1>
                <p className="admin-page-subtitle">Match students with mentors by track, skill gap, expertise, and capacity.</p>
              </div>
            </header>
            <MentorMatchingDashboard
              students={studentsData.length ? studentsData : DEMO_STUDENTS}
              mentors={mentorsData.length ? mentorsData : DEMO_MENTORS}
              scenarios={SCENARIOS}
              onAssignmentConfirm={(studentId, mentorId, scenarioId, matchScore, reason) => {
                // Mock assignment logic
                console.log(`Assigned student ${studentId} to mentor ${mentorId} (Score: ${matchScore}, By: ${reason})`);
                
                // Update student data locally for demo purposes
                setStudentsData(prev => prev.map(s => {
                  if (s.id === studentId) return { ...s, assignedMentorId: mentorId };
                  return s;
                }));
                
                // Update mentor data locally
                setMentorsData(prev => prev.map(m => {
                  if (m.id === mentorId) return { ...m, currentStudents: (m.currentStudents || 0) + 1 };
                  return m;
                }));
              }}
            />
          </>
        )}

        {/* ========================================================= */}
        {/* SCENARIOS PAGE */}
        {/* ========================================================= */}
        {activeTab === 'scenarios' && (
          <>
            <header className="admin-header">
              <div>
                <h1 className="admin-page-title">{t('admin.page.scenarioManager') || 'Scenario Manager'}</h1>
                <p className="admin-page-subtitle">Create, edit, publish and archive learning scenarios.</p>
              </div>
            </header>
            <div className="admin-content">
              <ScenarioManager />
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
                <h1 className="admin-page-title">{t('admin.page.modules')}</h1>
              </div>
              <div className="admin-header-actions">
                <button className="admin-btn-primary"><Plus size={16} /> {t('admin.btn.newModule')}</button>
              </div>
            </header>
            <div className="admin-content">
              {modulesData.length === 0 ? (
                <div className="admin-card" style={{textAlign:'center', color:'#64748B', padding:'48px'}}>
                  {t('admin.scenarios.noAvailable')}
                </div>
              ) : (
                <div className="modules-grid">
                  {modulesData.map(mod => (
                    <div
                      className="module-card"
                      key={mod.id}
                      onClick={() => { setActiveScenarioTrack(mod.title); setActiveTab('scenarios'); }}
                      style={{cursor:'pointer'}}
                    >
                      <div className="module-card-header">
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                          <span style={{width:36, height:36, borderRadius:10, background:'rgba(99,102,241,0.1)', color:'#6366F1', display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <BookOpen size={18}/>
                          </span>
                          <h4 className="module-card-title">{mod.title}</h4>
                        </div>
                        <StatusBadge variant="success">{t('admin.mock.statusPub')}</StatusBadge>
                      </div>
                      <p className="module-card-subtitle" style={{marginTop:12}}>
                        {mod.count} {t('admin.table.scenarios').toLowerCase()}
                      </p>
                      <div style={{marginTop:12, fontSize:12, color:'#6366F1', fontWeight:600, display:'flex', alignItems:'center', gap:4}}>
                        {t('admin.quick.scenarios')} <ChevronRight size={13}/>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                <h1 className="admin-page-title">{t('admin.page.submissions')}</h1>
              </div>
            </header>
            <div className="admin-content">
              <div className="admin-table-container">
                <div className="admin-table-header-row">
                  <span className="admin-table-title">{t('admin.sub.recentTitle')}</span>
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>{t('admin.table.id')}</th>
                        <th>{t('admin.table.student')}</th>
                        <th>{t('admin.table.type')}</th>
                        <th>{t('admin.table.scenario')}</th>
                        <th>{t('admin.table.submitted')}</th>
                        <th>{t('admin.table.status')}</th>
                        <th>{t('admin.table.actions')}</th>
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
        {activeTab === 'reports' && (() => {
          const totalStudents  = studentsData.length;
          const totalMentors   = mentorsData.length;
          const totalScenarios = scenariosData.length;
          const totalSubs      = submissionsData.length;

          const highCount   = studentsData.filter(s => (s.readiness || s.score || 0) >= 80).length;
          const medCount    = studentsData.filter(s => { const r = s.readiness || s.score || 0; return r >= 50 && r < 80; }).length;
          const lowCount    = studentsData.filter(s => (s.readiness || s.score || 0) < 50).length;
          const avgReadiness = totalStudents > 0
            ? Math.round(studentsData.reduce((sum, s) => sum + (s.readiness || s.score || 0), 0) / totalStudents)
            : 0;

          const topStudents = [...studentsData]
            .sort((a, b) => (b.readiness || b.score || 0) - (a.readiness || a.score || 0))
            .slice(0, 5);

          const riskRows = [
            { label: 'Low Risk (≥80%)',    count: highCount,  color: '#10b981', pct: totalStudents ? Math.round(highCount / totalStudents * 100) : 0 },
            { label: 'Medium Risk (50–79%)', count: medCount, color: '#f59e0b', pct: totalStudents ? Math.round(medCount / totalStudents * 100) : 0 },
            { label: 'High Risk (<50%)',   count: lowCount,   color: '#ef4444', pct: totalStudents ? Math.round(lowCount / totalStudents * 100) : 0 },
          ];

          return (
            <>
              <header className="admin-header">
                <div>
                  <h1 className="admin-page-title">{t('admin.reports.title')}</h1>
                  <p className="admin-page-subtitle" style={{marginTop: 4, color: '#64748b', fontSize: 14}}>
                    Overview of platform activity and student readiness
                  </p>
                </div>
              </header>

              <div className="admin-content">
                {/* Summary stat cards */}
                <div className="admin-stats-grid">
                  <StatCard label="TOTAL STUDENTS"  value={totalStudents}  icon={GraduationCap} color="#3b82f6" />
                  <StatCard label="TOTAL MENTORS"   value={totalMentors}   icon={Briefcase}     color="#10b981" />
                  <StatCard label="SCENARIOS"       value={totalScenarios} icon={BookOpen}      color="#8b5cf6" />
                  <StatCard label="SUBMISSIONS"     value={totalSubs}      icon={Inbox}         color="#f59e0b" />
                  <StatCard label="AVG READINESS"   value={`${avgReadiness}%`} icon={TrendingUp} color="#6366f1" />
                </div>

                <div className="admin-grid-2col" style={{marginTop: 28}}>
                  {/* Readiness distribution */}
                  <div className="admin-card">
                    <h3 className="admin-card-header" style={{marginBottom: 20}}>Student Readiness Distribution</h3>
                    {totalStudents === 0 ? (
                      <p style={{color: '#94a3b8', fontSize: 13}}>No student data yet.</p>
                    ) : (
                      <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
                        {riskRows.map(row => (
                          <div key={row.label}>
                            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13}}>
                              <span style={{fontWeight: 500, color: '#374151'}}>{row.label}</span>
                              <span style={{color: '#64748b'}}>{row.count} students ({row.pct}%)</span>
                            </div>
                            <div className="progress-track">
                              <div className="progress-fill" style={{width: `${row.pct}%`, background: row.color}} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Top performing students */}
                  <div className="admin-card">
                    <h3 className="admin-card-header" style={{marginBottom: 16}}>Top Students by Readiness</h3>
                    {topStudents.length === 0 ? (
                      <p style={{color: '#94a3b8', fontSize: 13}}>No student data yet.</p>
                    ) : (
                      <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
                        {topStudents.map((s, i) => {
                          const score = s.readiness || s.score || 0;
                          const barColor = score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
                          return (
                            <div key={s.id || i} style={{display: 'flex', alignItems: 'center', gap: 10}}>
                              <span style={{fontSize: 12, color: '#94a3b8', width: 16, textAlign: 'right'}}>{i + 1}</span>
                              <span style={{fontSize: 13, fontWeight: 500, color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                {s.name || s.fullname || s.username || '—'}
                              </span>
                              <div className="progress-track" style={{width: 90}}>
                                <div className="progress-fill" style={{width: `${score}%`, background: barColor}} />
                              </div>
                              <span style={{fontSize: 12, fontWeight: 600, color: barColor, width: 36, textAlign: 'right'}}>{score}%</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent submissions */}
                <div className="admin-card" style={{marginTop: 24}}>
                  <h3 className="admin-card-header" style={{marginBottom: 16}}>Recent Submissions</h3>
                  {submissionsData.length === 0 ? (
                    <p style={{color: '#94a3b8', fontSize: 13}}>No submissions yet.</p>
                  ) : (
                    <div className="admin-table-wrapper">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Student</th>
                            <th>Type</th>
                            <th>Artifact</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {submissionsData.slice(0, 8).map((sub, i) => (
                            <tr key={sub.id || i}>
                              <td style={{fontWeight: 500}}>{sub.student}</td>
                              <td><StatusBadge variant="info">{sub.type}</StatusBadge></td>
                              <td style={{color: '#64748b', fontSize: 13}}>{sub.artifact || sub.scenario || '—'}</td>
                              <td style={{color: '#64748b', fontSize: 13}}>{sub.date || '—'}</td>
                              <td><StatusBadge variant={getStatusBadge(sub.status)}>{sub.status}</StatusBadge></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Scenario library summary */}
                <div className="admin-card" style={{marginTop: 24}}>
                  <h3 className="admin-card-header" style={{marginBottom: 16}}>Scenario Library</h3>
                  {scenariosData.length === 0 ? (
                    <p style={{color: '#94a3b8', fontSize: 13}}>No scenarios in library.</p>
                  ) : (
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12}}>
                      {scenariosData.slice(0, 6).map((sc, i) => (
                        <div key={sc.id || i} style={{padding: '12px 14px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)', borderRadius: 10}}>
                          <div style={{fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 4}}>{sc.title}</div>
                          <div style={{fontSize: 12, color: '#64748b'}}>{sc.difficulty || sc.category || '—'} · {sc.estimatedTime || ''}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          );
        })()}
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

      {/* Add Scenario Modal */}
      {showAddScenarioModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content glass-panel">
            <h2 className="admin-modal-title">New scenario</h2>
            <form onSubmit={handleAddScenarioSubmit} className="admin-modal-form">
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div className="form-group">
                  <label>Scenario ID</label>
                  <input
                    type="text"
                    value={addScenarioForm.id}
                    onChange={e => setAddScenarioForm({...addScenarioForm, id: e.target.value})}
                    placeholder="Auto-generated"
                  />
                </div>
                <div className="form-group">
                  <label>Industry</label>
                  <input
                    type="text"
                    value={addScenarioForm.category}
                    onChange={e => setAddScenarioForm({...addScenarioForm, category: e.target.value})}
                    placeholder="Backend, DevOps, Security"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={addScenarioForm.title}
                  onChange={e => setAddScenarioForm({...addScenarioForm, title: e.target.value})}
                  required
                />
              </div>

              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    value={addScenarioForm.difficulty}
                    onChange={e => setAddScenarioForm({...addScenarioForm, difficulty: e.target.value})}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Available">Available</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estimated time</label>
                  <input
                    type="text"
                    value={addScenarioForm.estimatedTime}
                    onChange={e => setAddScenarioForm({...addScenarioForm, estimatedTime: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Briefing</label>
                <textarea
                  value={addScenarioForm.briefing}
                  onChange={e => setAddScenarioForm({...addScenarioForm, briefing: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Objectives</label>
                <textarea
                  value={addScenarioForm.objectives}
                  onChange={e => setAddScenarioForm({...addScenarioForm, objectives: e.target.value})}
                  rows={4}
                  placeholder="One objective per line"
                />
              </div>

              <div className="admin-modal-actions">
                <button type="button" className="admin-btn-secondary" onClick={() => setShowAddScenarioModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary" disabled={isAddingScenario}>
                  {isAddingScenario ? 'Adding...' : 'Add scenario'}
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
              {selectedProfile.role === 'Mentor' ? 'Public mentor profile — what students see.' : 'Public learner profile — what mentors and recruiters see.'}
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
                    <p style={{margin: '4px 0 0 0', color: '#64748B', fontSize: '13px'}}>
                      {selectedProfile.role === 'Mentor' ? (selectedProfile.job_title || 'Unknown Role') : (selectedProfile.major || 'Unknown Major')} — {selectedProfile.role === 'Mentor' ? (selectedProfile.company || selectedProfile.org || 'Organization') : (selectedProfile.target_track || selectedProfile.role || 'Track')}
                    </p>
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
                    <Briefcase size={16} /> <span>{selectedProfile.role === 'Mentor' ? 'Available to Mentor' : 'Open to roles'}</span>
                  </div>
                </div>

                <div style={{borderTop: '1px solid rgba(255,255,255,0.5)', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'left'}}>
                  <div style={{textAlign: 'left'}}>
                    <div style={{fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <BookOpen size={12} /> {selectedProfile.role === 'Mentor' ? 'EXPERIENCE' : 'EDUCATION LEVEL'}
                    </div>
                    <div style={{fontSize: '14px', color: '#0F172A', fontWeight: 600}}>
                      {selectedProfile.role === 'Mentor' 
                        ? (selectedProfile.years_of_experience ? `${selectedProfile.years_of_experience} Years` : 'Not specified') 
                        : (selectedProfile.education_level || 'Not specified')}
                    </div>
                  </div>
                  <div style={{textAlign: 'left'}}>
                    <div style={{fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                      <Database size={12} /> {selectedProfile.role === 'Mentor' ? 'INDUSTRY' : 'TARGET INDUSTRY'}
                    </div>
                    <div style={{fontSize: '14px', color: '#0F172A', fontWeight: 600}}>
                      {selectedProfile.role === 'Mentor' ? (selectedProfile.industry || selectedProfile.target_industry || 'Not specified') : (selectedProfile.target_industry || 'Not specified')}
                    </div>
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
                    {selectedProfile.role === 'Mentor' 
                      ? 'Active mentor at WorkReady AI, sharing industry experience with students.' 
                      : (selectedProfile.occupation_goal ? `Targeting ${selectedProfile.occupation_goal} roles. Active in WorkReady AI's mentorship track.` : 'No description provided.')}
                  </p>
                </div>

                {/* CAREER GOALS */}
                <div style={{background: 'rgba(255,255,255,0.4)', borderRadius: '16px', padding: '24px'}}>
                  <h4 style={{margin: '0 0 16px 0', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#0F172A', borderBottom: '1px solid rgba(255,255,255,0.5)', paddingBottom: '12px'}}>
                    {selectedProfile.role === 'Mentor' ? 'Bio' : 'Career Goals'}
                  </h4>
                  <p style={{margin: 0, fontSize: '14px', color: '#475569', fontStyle: 'italic'}}>
                    {selectedProfile.role === 'Mentor'
                      ? (selectedProfile.bio ? `"${selectedProfile.bio}"` : '"Not specified"')
                      : (selectedProfile.career_goal ? `"${selectedProfile.career_goal}"` : '"Not specified"')}
                  </p>
                </div>

                {/* STRENGTHS & DEVELOP AREAS */}
                <div style={{display: 'grid', gridTemplateColumns: selectedProfile.role === 'Mentor' ? '1fr' : '1fr 1fr', gap: '20px'}}>
                  <div style={{background: 'rgba(255,255,255,0.4)', borderRadius: '16px', padding: '24px'}}>
                    <h4 style={{margin: '0 0 16px 0', fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#10b981', borderBottom: '1px solid rgba(16, 185, 129, 0.2)', paddingBottom: '12px'}}>
                      {selectedProfile.role === 'Mentor' ? 'Expertise' : 'Strengths'}
                    </h4>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                      {(selectedProfile.role === 'Mentor' ? selectedProfile.expertise || selectedProfile.strengths : selectedProfile.strengths)?.length > 0 ? (selectedProfile.role === 'Mentor' ? selectedProfile.expertise || selectedProfile.strengths : selectedProfile.strengths).map((s, i) => (
                        <span key={i} style={{padding: '6px 12px', background: 'rgba(209, 250, 229, 0.6)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#047857', borderRadius: '20px', fontSize: '12px', fontWeight: 600}}>{s}</span>
                      )) : <span style={{fontSize: '13px', color: '#64748B'}}>None listed</span>}
                    </div>
                  </div>
                  
                  {selectedProfile.role !== 'Mentor' && (
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
                  )}
                </div>

                {/* CERTIFICATIONS */}
                {selectedProfile.role !== 'Mentor' && (
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
                )}

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
