import React, { useState, useEffect } from 'react';
import './AdminScreen.css';
import { api } from '../../api.js';
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
  const [activeTab, setActiveTab] = useState('dashboard');
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
        { id: 1, title: 'Backend Fundamentals', status: 'Published', meta: '24 scenarios · 312 students' },
        { id: 2, title: 'Cloud Infrastructure', status: 'Published', meta: '18 scenarios · 205 students' }
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

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    role: 'Student'
  });
  const [isAddingUser, setIsAddingUser] = useState(false);

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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'mentors', label: 'Mentors', icon: Briefcase },
    { id: 'scenarios', label: 'Scenarios', icon: BookOpen },
    { id: 'modules', label: 'Modules', icon: Layers },
    { id: 'submissions', label: 'Submissions', icon: Inbox },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
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
          <span>WorkReady Admin</span>
        </div>

        <div className="admin-sidebar-header">Admin</div>
        
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
          <button className="admin-logout-btn" onClick={() => onNavigate('landing')}>
            <LogOut size={14} style={{ display: 'inline', marginRight: '8px' }} />
            Sign out
          </button>
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
                <h1 className="admin-page-title">User Management</h1>
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
                            <div className="user-name-cell">
                              <span className="name">{u.name}</span>
                              <span className="email">{u.email}</span>
                            </div>
                          </td>
                          <td><StatusBadge variant={u.role === 'Admin' ? 'danger' : u.role === 'Mentor' ? 'warning' : 'info'}>{u.role}</StatusBadge></td>
                          <td><StatusBadge variant={getStatusBadge(u.status)}>{u.status}</StatusBadge></td>
                          <td><span style={{color: '#64748B', fontSize: '13px'}}>{u.lastActivity}</span></td>
                          <td>
                            <div className="admin-table-actions">
                              <button className="admin-icon-btn"><Eye size={16} /></button>
                              <button className="admin-icon-btn"><Edit size={16} /></button>
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
                          <td style={{fontWeight: 500}}>{st.name}</td>
                          <td>{st.score}%</td>
                          <td>{st.scenarios}</td>
                          <td><StatusBadge variant={getRiskBadge(st.risk)}>{st.risk}</StatusBadge></td>
                          <td><span style={{color: '#64748B', fontSize: '13px'}}>{st.lastActive}</span></td>
                          <td>
                            <div className="admin-table-actions">
                              <button className="admin-icon-btn"><Eye size={16} /></button>
                              <button className="admin-icon-btn"><Edit size={16} /></button>
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
                          <td style={{fontWeight: 500}}>{m.name}</td>
                          <td>{m.org}</td>
                          <td>{m.mentees}</td>
                          <td>{m.rating} ★</td>
                          <td><StatusBadge variant={getStatusBadge(m.status)}>{m.status}</StatusBadge></td>
                          <td>
                            <div className="admin-table-actions">
                              <button className="admin-icon-btn"><Eye size={16} /></button>
                              <button className="admin-icon-btn"><Edit size={16} /></button>
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
                <h1 className="admin-page-title">Reports</h1>
              </div>
            </header>
            <div className="admin-content">
              <div className="admin-stats-grid">
                <StatCard label="AVG. READINESS" value="68%" />
                <StatCard label="SCENARIOS RUN" value="8,920" />
                <StatCard label="COMPLETION RATE" value="63%" />
                <StatCard label="EVIDENCE ITEMS" value="920" />
              </div>

              <div className="admin-grid-2col">
                <div className="admin-card">
                  <h3 className="admin-card-header">Cohort completion</h3>
                  <table className="admin-table" style={{marginTop: '16px'}}>
                    <thead>
                      <tr>
                        <th>COHORT</th>
                        <th>AVG SCORE</th>
                        <th>COMPLETION</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Spring 2026 Alpha</td>
                        <td>82%</td>
                        <td style={{width: '200px'}}>
                          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <div className="progress-track" style={{flexGrow: 1}}><div className="progress-fill" style={{width: '90%'}}></div></div>
                            <span style={{fontSize: '13px', fontWeight: 500}}>90%</span>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>Spring 2026 Beta</td>
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
                    <h3 className="admin-card-header">Top scenarios</h3>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                        <span style={{fontWeight: 500}}>Database Outage RCA</span><span style={{color: '#64748B'}}>1,204 runs</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                        <span style={{fontWeight: 500}}>Memory Leak Debugging</span><span style={{color: '#64748B'}}>984 runs</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                        <span style={{fontWeight: 500}}>API Rate Limiting</span><span style={{color: '#64748B'}}>842 runs</span>
                      </div>
                    </div>
                  </div>

                  <div className="admin-card">
                    <h3 className="admin-card-header">Engagement</h3>
                    <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                        <span style={{fontWeight: 500, color: '#64748B'}}>Daily Active Users (DAU)</span><span style={{fontWeight: 600}}>845</span>
                      </div>
                      <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px'}}>
                        <span style={{fontWeight: 500, color: '#64748B'}}>Avg Session Length</span><span style={{fontWeight: 600}}>42m 15s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

      </main>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content glass-panel">
            <h2 className="admin-modal-title">Add New User</h2>
            <form onSubmit={handleAddUserSubmit} className="admin-modal-form">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={addUserForm.fullname} 
                  onChange={e => setAddUserForm({...addUserForm, fullname: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={addUserForm.email} 
                  onChange={e => setAddUserForm({...addUserForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Username</label>
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
                <label>Role</label>
                <select 
                  value={addUserForm.role} 
                  onChange={e => setAddUserForm({...addUserForm, role: e.target.value})}
                >
                  <option value="Student">Student</option>
                  <option value="Mentor">Mentor</option>
                </select>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn-secondary" onClick={() => setShowAddUserModal(false)}>Cancel</button>
                <button type="submit" className="admin-btn-primary" disabled={isAddingUser}>
                  {isAddingUser ? 'Adding...' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
