import React, { useState, useEffect } from 'react';
import './StudentScreen.css';
import StudentDashboard from './StudentDashboard';
import StudentProfile from './StudentProfile';
import StudentSkillGap from './StudentSkillGap';
import StudentScenarioSimulator from './StudentScenarioSimulator';
import StudentEvidencePortfolio from './StudentEvidencePortfolio';
import SkillAssessmentQuizModal from './SkillAssessmentQuizModal';
import { api } from '../../api';

export default function StudentScreen({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSkillAssessment, setShowSkillAssessment] = useState(false);
  
  // User Profile State (from database / localStorage)
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
  
  // Skill Gap State
  const [ratings, setRatings] = useState({
    processMap: 'medium',
    safetyRisk: 'medium',
    rca: 'medium',
    traceability: 'medium',
    memo: 'medium',
    responsibleAi: 'medium'
  });

  const [overallReadiness, setOverallReadiness] = useState(50);
  const [strengthsCount, setStrengthsCount] = useState(0);
  const [gapsCount, setGapsCount] = useState(0);

  useEffect(() => {
    let strengths = 0;
    let gaps = 0;
    let totalScore = 0;
    Object.values(ratings).forEach(val => {
      if (val === 'high') { strengths++; totalScore += 100; }
      else if (val === 'medium') { totalScore += 50; }
      else if (val === 'low') { gaps++; totalScore += 10; } // minimum 10 to not be zero
    });
    setStrengthsCount(strengths);
    setGapsCount(gaps);
    setOverallReadiness(Math.round(totalScore / 6));
  }, [ratings]);

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
    if (activeTab === 'skillgap') {
      const storedUserStr = localStorage.getItem('currentUser');
      if (storedUserStr) {
        try {
          const user = JSON.parse(storedUserStr);
          const hasCompleted = localStorage.getItem(`hasCompletedSkillQuiz_${user.id}`);
          if (!hasCompleted) {
            setShowSkillAssessment(true);
          }
        } catch (e) {
          console.error(e);
        }
      }
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

  const handleRate = (skill, level) => {
    setRatings(prev => ({ ...prev, [skill]: level }));
  };

  const handleResetRatings = () => {
    setRatings({
      processMap: 'medium',
      safetyRisk: 'medium',
      rca: 'medium',
      traceability: 'medium',
      memo: 'medium',
      responsibleAi: 'medium'
    });
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
        <div className="student-sidebar-header">
          <div className="student-sidebar-avatar">{initials}</div>
          <div>
            <h2 className="student-sidebar-name">{fullName}</h2>
            <p className="student-sidebar-role">{targetTrack}</p>
          </div>
        </div>

        <nav className="student-nav">
          <button 
            className={`student-nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-nav-icon">
              <rect x="3" y="3" width="7" height="9" rx="1" />
              <rect x="14" y="3" width="7" height="5" rx="1" />
              <rect x="14" y="12" width="7" height="9" rx="1" />
              <rect x="3" y="16" width="7" height="5" rx="1" />
            </svg>
            <span>Dashboard</span>
          </button>
          <button 
            className={`student-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-nav-icon">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Profile</span>
          </button>
          <button 
            className={`student-nav-btn ${activeTab === 'skillgap' ? 'active' : ''}`}
            onClick={() => setActiveTab('skillgap')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-nav-icon">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span>Skill Gap Assessment</span>
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
            <span>Scenario Simulator</span>
          </button>
          <button 
            className={`student-nav-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-nav-icon">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span>Evidence Portfolio</span>
          </button>
        </nav>

        <div className="student-sidebar-footer">
          <button className="student-logout-btn" onClick={() => onNavigate('landing')}>
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="student-content-container">
        
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <StudentDashboard firstName={firstName} initials={initials} fullName={fullName} targetTrack={targetTrack} major={major} educationLevel={educationLevel} occupationGoal={occupationGoal} targetIndustry={targetIndustry} setActiveTab={setActiveTab} scenarios={scenarios} handleOpenScenario={handleOpenScenario} />
        )}
        
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <StudentProfile initials={initials} fullName={fullName} targetTrack={targetTrack} major={major} educationLevel={educationLevel} occupationGoal={occupationGoal} targetIndustry={targetIndustry} email={email} careerGoal={careerGoal} strengthsList={strengthsList} developAreasList={developAreasList} />
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
    </div>
  );
}
