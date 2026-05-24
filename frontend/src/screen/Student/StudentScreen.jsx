import React, { useState, useEffect } from 'react';
import './StudentScreen.css';
import StudentDashboard from './StudentDashboard';
import StudentProfile from './StudentProfile';
import StudentSkillGap from './StudentSkillGap';
import StudentScenarioSimulator from './StudentScenarioSimulator';
import StudentEvidencePortfolio from './StudentEvidencePortfolio';
import SkillAssessmentQuizModal from './SkillAssessmentQuizModal';
import AiSkillQuizModal from './AiSkillQuizModal';
import StudentSettings from './StudentSettings';
import { api } from '../../api';
import { useLanguage } from '../../contexts/LanguageContext';

export default function StudentScreen({ onNavigate }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(() => {
    return sessionStorage.getItem('studentActiveTab') || 'dashboard';
  });

  useEffect(() => {
    sessionStorage.setItem('studentActiveTab', activeTab);
  }, [activeTab]);
  const [showSkillAssessment, setShowSkillAssessment] = useState(false);
  const [showAiQuiz, setShowAiQuiz] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // User Profile State (from database / localStorage)
  const [currentUser, setCurrentUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [initials, setInitials] = useState('');
  const [fullName, setFullName] = useState('');
  const [targetTrack, setTargetTrack] = useState('');
  const [major, setMajor] = useState('Computer Science');
  const [educationLevel, setEducationLevel] = useState('Senior');
  const [occupationGoal, setOccupationGoal] = useState('Software Engineer');
  const [targetIndustry, setTargetIndustry] = useState('Tech');
  const [email, setEmail] = useState('');
  const [careerGoal, setCareerGoal] = useState('Lead a global engineering team');
  const [strengthsList, setStrengthsList] = useState(['Process Optimization', 'Data Analysis']);
  const [developAreasList, setDevelopAreasList] = useState(['Automation', 'Leadership']);

  useEffect(() => {
    // Load from database session (localStorage)
    const storedUserStr = localStorage.getItem('currentUser');
    if (storedUserStr) {
      try {
        const user = JSON.parse(storedUserStr);
        setCurrentUser(user);
        const name = user.fullname || user.fullName;
        if (name) {
          setFullName(name);
          const parts = name.split(' ');
          setFirstName(parts[0]);
          const inits = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
          setInitials(inits.toUpperCase());
        }
        if (user.target_track) setTargetTrack(user.target_track);
        if (user.target_industry) setTargetIndustry(user.target_industry);
        if (user.email) setEmail(user.email);
        if (user.major) setMajor(user.major);
        if (user.education_level) setEducationLevel(user.education_level);
        if (user.occupation_goal) setOccupationGoal(user.occupation_goal);
        if (user.career_goal) setCareerGoal(user.career_goal);
      } catch(e) {
        console.error('Failed to parse currentUser from localStorage', e);
      }
    } else {
      // Fallback if not logged in
      setFullName('Jane Doe');
      setFirstName('Jane');
      setInitials('JD');
      setTargetTrack('Quality Engineer');
    }
  }, []);

  const handleProfileUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    const name = updatedUser.fullname || updatedUser.fullName;
    if (name) {
      setFullName(name);
      const parts = name.split(' ');
      setFirstName(parts[0]);
      const inits = parts.length > 1 ? parts[0][0] + parts[1][0] : parts[0][0];
      setInitials(inits.toUpperCase());
    }
    if (updatedUser.email) setEmail(updatedUser.email);
  };
  
  const [ratings, setRatings] = useState({});
  const [aiRatings, setAiRatings] = useState({});

  const [overallReadiness, setOverallReadiness] = useState(0);
  const [strengthsCount, setStrengthsCount] = useState(0);
  const [gapsCount, setGapsCount] = useState(0);

  useEffect(() => {
    let strengths = 0;
    let gaps = 0;
    let totalScore = 0;

    const weights = {
      processMap: 0.25,
      safetyRisk: 0.20,
      rca: 0.15,
      traceability: 0.20,
      memo: 0.15,
      responsibleAi: 0.05
    };

    if (Object.keys(aiRatings).length === 0) {
      setStrengthsCount(0);
      setGapsCount(0);
      setOverallReadiness(0);
      return;
    }

    Object.keys(weights).forEach(key => {
      const val = aiRatings[key];
      let score = 0;
      if (val === 'high') { strengths++; score = 100; }
      else if (val === 'medium') { score = 50; }
      else if (val === 'low') { gaps++; score = 10; }
      
      totalScore += score * weights[key];
    });

    setStrengthsCount(strengths);
    setGapsCount(gaps);
    setOverallReadiness(Math.round(totalScore));
  }, [aiRatings]);

  useEffect(() => {
    const fetchRatings = async () => {
      const storedUserStr = localStorage.getItem('currentUser');
      if (storedUserStr) {
        try {
          const user = JSON.parse(storedUserStr);
          if (user.id) {
            const dbRatings = await api.getStudentRatings(user.id);
            if (dbRatings && Object.keys(dbRatings).length > 0) {
              setRatings(prev => ({ ...prev, ...dbRatings }));
              setAiRatings(prev => ({ ...prev, ...dbRatings }));
            }
          }
        } catch (err) {
          console.error('Failed to fetch ratings from db', err);
        }
      }
    };
    fetchRatings();
  }, []);
  
  // Scenarios & Simulator State
  const [scenarios, setScenarios] = useState([]);
  const [activeScenario, setActiveScenario] = useState(null);
  const [simCompleted, setSimCompleted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [choicesForStep, setChoicesForStep] = useState([]);
  
  // Portfolio State
  const [portfolioItems, setPortfolioItems] = useState([]);

  useEffect(() => {
    // Fetch scenarios on mount
    const fetchScenarios = async () => {
      try {
        const scenariosData = await api.getScenarios();
        setScenarios(scenariosData || []);
      } catch (err) {
        console.error('Failed to fetch scenarios:', err);
      }
    };
    fetchScenarios();
  }, []);

  useEffect(() => {
    const storedUserStr = localStorage.getItem('currentUser');
    if (!storedUserStr) return;

    try {
      const user = JSON.parse(storedUserStr);
      
      if (activeTab === 'skillgap') {
        const hasCompletedSkill = localStorage.getItem(`hasCompletedSkillQuiz_${user.id}`);
        if (!hasCompletedSkill) {
          setShowSkillAssessment(true);
        }
      }

      if (activeTab === 'simulator') {
        const hasCompletedAiQuiz = localStorage.getItem(`hasCompletedAiQuiz_${user.id}`);
        if (!hasCompletedAiQuiz) {
          setShowAiQuiz(true);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeTab]);

  const handleAssessmentComplete = async (finalRatings) => {
    try {
      const storedUserStr = localStorage.getItem('currentUser');
      if (storedUserStr) {
        const user = JSON.parse(storedUserStr);
        await api.saveStudentRatings(user.id, finalRatings);
        setRatings(prev => ({ ...prev, ...finalRatings }));
        localStorage.setItem(`hasCompletedSkillQuiz_${user.id}`, 'true');
      }
    } catch (e) {
      console.error('Failed to save assessment', e);
    }
    setShowSkillAssessment(false);
  };

  const handleAiQuizComplete = async (newRatings) => {
    const updatedAiRatings = { ...aiRatings, ...newRatings };
    setAiRatings(updatedAiRatings);
    
    // Auto-calculate new score (mock logic for demo)
    const getScore = (val) => val === 'high' ? 100 : val === 'medium' ? 50 : val === 'low' ? 10 : 0;
    const values = Object.values(updatedAiRatings).map(getScore);
    const avg = values.length ? Math.round(values.reduce((a,b)=>a+b, 0) / values.length) : 0;
    
    setOverallReadiness(avg);
    setShowAiQuiz(false);

    try {
      const storedUserStr = localStorage.getItem('currentUser');
      if (storedUserStr) {
        const user = JSON.parse(storedUserStr);
        localStorage.setItem(`hasCompletedAiQuiz_${user.id}`, 'true');
      }
    } catch(e) {}
  };

  const handleRate = (skill, level) => {
    setRatings(prev => ({ ...prev, [skill]: level }));
  };

  const handleResetRatings = () => {
    setRatings({});
    setAiRatings({});
    setOverallReadiness(0);
    localStorage.removeItem('hasCompletedSkillAssessment');
  };

  const calculateRadarPoints = () => {
    const getR = (val) => val === 'high' ? 100 : val === 'low' ? 33 : 66;
    const p1 = `${150},${150 - getR(ratings.processMap)}`;
    const p2 = `${150 + getR(ratings.safetyRisk) * 0.866},${150 - getR(ratings.safetyRisk) * 0.5}`;
    const p3 = `${150 + getR(ratings.rca) * 0.866},${150 + getR(ratings.rca) * 0.5}`;
    const p4 = `${150},${150 + getR(ratings.traceability)}`;
    const p5 = `${150 - getR(ratings.memo) * 0.866},${150 + getR(ratings.memo) * 0.5}`;
    const p6 = `${150 - getR(ratings.responsibleAi) * 0.866},${150 - getR(ratings.responsibleAi) * 0.5}`;
    return `${p1} ${p2} ${p3} ${p4} ${p5} ${p6}`;
  };

  const handleOpenScenario = (scenario) => {
    setActiveScenario(scenario);
    setActiveTab('simulator');
  };

  const handleLaunchScenario = () => {
    // Launch logic
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    setChatMessages(prev => [...prev, { text: inputVal, sender: 'user' }]);
    setInputVal('');
  };

  const handleSubmitPortfolio = () => {
    // Handle submission
  };
  
  const handleRegenerateScenarios = async () => {
    try {
      const result = await api.regenerateScenarios();
      if (result && result.scenarios) {
        setScenarios(result.scenarios);
      }
    } catch (err) {
      console.error('Error regenerating scenarios', err);
    }
  };

  return (
    <div className="student-workspace">
      {/* Sidebar */}
      <div className="student-sidebar">
        <div className="student-sidebar-brand" onClick={() => onNavigate('landing')}>
          <div className="student-brand-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span>WorkReady AI</span>
        </div>

        <nav className="student-sidebar-nav">
          <button 
            className={`student-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-nav-icon">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
            </svg>
            <span>{t('sidebar.dashboard')}</span>
          </button>
          
          <button 
            className={`student-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-nav-icon">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>{t('sidebar.profile')}</span>
          </button>

          <button 
            className={`student-nav-btn ${activeTab === 'skillgap' ? 'active' : ''}`}
            onClick={() => setActiveTab('skillgap')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-nav-icon">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>{t('sidebar.skillgap')}</span>
          </button>

          <button 
            className={`student-nav-btn ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-nav-icon">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>{t('sidebar.simulator')}</span>
          </button>

          <button 
            className={`student-nav-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-nav-icon">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span>{t('sidebar.portfolio')}</span>
          </button>
        </nav>

        <div className="student-sidebar-footer">
          <div className="student-profile-dropdown-container">
            <button className="student-profile-btn" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
              {currentUser && currentUser.avatar_base64 ? (
                <img src={currentUser.avatar_base64} alt="Avatar" className="student-profile-avatar" style={{ objectFit: 'cover' }} />
              ) : (
                <div className="student-profile-avatar">{initials}</div>
              )}
              <div className="student-profile-info">
                <span className="student-profile-name">{firstName}</span>
                <span className="student-profile-role">Student</span>
              </div>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`dropdown-icon ${showProfileDropdown ? 'open' : ''}`}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {showProfileDropdown && (
              <div className="student-profile-dropdown-menu">
                <button className="dropdown-item" onClick={() => { setShowProfileDropdown(false); setActiveTab('settings'); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-item-icon">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  {t('sidebar.settings')}
                </button>
                <button className="dropdown-item logout" onClick={() => onNavigate('logout')}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-item-icon">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  {t('sidebar.signout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="student-content-container">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <StudentDashboard firstName={firstName} initials={initials} fullName={fullName} targetTrack={targetTrack} major={major} educationLevel={educationLevel} occupationGoal={occupationGoal} targetIndustry={targetIndustry} setActiveTab={setActiveTab} scenarios={scenarios} handleOpenScenario={handleOpenScenario} overallReadiness={overallReadiness} ratings={ratings} aiRatings={aiRatings} />
        )}
        
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <StudentProfile initials={initials} fullName={fullName} targetTrack={targetTrack} major={major} educationLevel={educationLevel} occupationGoal={occupationGoal} targetIndustry={targetIndustry} email={email} careerGoal={careerGoal} strengthsList={strengthsList} developAreasList={developAreasList} />
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <StudentSettings 
            currentUser={currentUser}
            onProfileUpdate={handleProfileUpdate}
            initials={initials} 
            fullName={fullName} 
            email={email} 
            targetIndustry={targetIndustry} 
            major={major} 
          />
        )}
        
        {/* SKILL GAP TAB */}
        {activeTab === 'skillgap' && (
          <StudentSkillGap ratings={ratings} handleRate={handleRate} handleResetRatings={handleResetRatings} calculateRadarPoints={calculateRadarPoints} overallReadiness={overallReadiness} strengthsCount={strengthsCount} gapsCount={gapsCount} />
        )}
        
        {/* SCENARIO SIMULATOR TAB */}
        {activeTab === 'simulator' && (
          <StudentScenarioSimulator 
            scenarios={scenarios} 
            activeScenario={activeScenario} 
            handleOpenScenario={handleOpenScenario} 
            handleLaunchScenario={handleLaunchScenario} 
            simCompleted={simCompleted} 
            stepIndex={stepIndex} 
            terminalLogs={terminalLogs} 
            chatMessages={chatMessages} 
            inputVal={inputVal} 
            setInputVal={setInputVal} 
            handleSendChat={handleSendChat} 
            choicesForStep={choicesForStep}
            onRegenerate={handleRegenerateScenarios}
          />
        )}
        
        {/* EVIDENCE PORTFOLIO TAB */}
        {activeTab === 'portfolio' && (
          <StudentEvidencePortfolio portfolioItems={portfolioItems} handleSubmitPortfolio={handleSubmitPortfolio} onNavigate={onNavigate} />
        )}
      </div>

      <SkillAssessmentQuizModal 
        isOpen={showSkillAssessment} 
        onClose={() => setShowSkillAssessment(false)}
        onComplete={handleAssessmentComplete} 
      />

      <AiSkillQuizModal 
        isOpen={showAiQuiz} 
        onClose={() => setShowAiQuiz(false)}
        onComplete={handleAiQuizComplete}
        occupationGoal={occupationGoal}
      />
    </div>
  );
}
