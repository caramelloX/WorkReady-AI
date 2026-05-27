import React, { useState, useEffect, useRef } from 'react';
import './StudentScreen.css';
import StudentDashboard from './StudentDashboard';
import StudentProfile from './StudentProfile';
import StudentSkillGap from './StudentSkillGap';
import StudentScenarioSimulator from './StudentScenarioSimulator';
import StudentEvidencePortfolio from './StudentEvidencePortfolio';
import SkillAssessmentQuizModal from './SkillAssessmentQuizModal';
import AiSkillQuizModal from './AiSkillQuizModal';
import StudentSettings from './StudentSettings';
import ScenarioWorkspace from './ScenarioWorkspace';
import { api } from '../../components/api';
import { useLanguage } from '../../contexts/LanguageContext';
import ChatWidget from '../../components/Chat/ChatWidget';
import { DEMO_SCENARIO } from '../../data/demoData.js';
import { SCENARIOS } from '../../data/scenarioData.js';
import { getTopRecommendation } from '../../utils/scenarioRecommendation.js';
import { getTopMentorMatch } from '../../utils/scenarioMentorMatching.js';
import { DEMO_MENTORS } from '../../data/demoData.js';
import SkillGapResult from './SkillGapResult';

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
  const [major, setMajor] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [occupationGoal, setOccupationGoal] = useState('');
  const [targetIndustry, setTargetIndustry] = useState('');
  const [email, setEmail] = useState('');
  const [careerGoal, setCareerGoal] = useState('');
  const [bio, setBio] = useState('');
  const [strengthsList, setStrengthsList] = useState([]);
  const [developAreasList, setDevelopAreasList] = useState([]);

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
        if (user.bio) setBio(user.bio);
        if (user.strengths && Array.isArray(user.strengths) && user.strengths.length > 0) {
          setStrengthsList(user.strengths);
        }
        if (user.develop_areas && Array.isArray(user.develop_areas) && user.develop_areas.length > 0) {
          setDevelopAreasList(user.develop_areas);
        }
      } catch(e) {
        console.error('Failed to parse currentUser from localStorage', e);
      }
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
    if (updatedUser.major) setMajor(updatedUser.major);
    if (updatedUser.education_level) setEducationLevel(updatedUser.education_level);
    if (updatedUser.occupation_goal) setOccupationGoal(updatedUser.occupation_goal);
    if (updatedUser.target_industry) setTargetIndustry(updatedUser.target_industry);
    if (updatedUser.career_goal) setCareerGoal(updatedUser.career_goal);
    if (updatedUser.bio !== undefined) setBio(updatedUser.bio);
    if (updatedUser.strengths && Array.isArray(updatedUser.strengths) && updatedUser.strengths.length > 0) {
      setStrengthsList(updatedUser.strengths);
    }
    if (updatedUser.develop_areas && Array.isArray(updatedUser.develop_areas) && updatedUser.develop_areas.length > 0) {
      setDevelopAreasList(updatedUser.develop_areas);
    }
  };
  
  const [ratings, setRatings] = useState({});
  const [aiRatings, setAiRatings] = useState({});

  const [overallReadiness, setOverallReadiness] = useState(0);
  const [strengthsCount, setStrengthsCount] = useState(0);
  const [gapsCount, setGapsCount] = useState(0);

  // Scenario & mentor recommendations (computed from aiRatings + user profile)
  const recommendedResult = React.useMemo(() => {
    if (!Object.keys(aiRatings).length) return null;
    const studentProfile = {
      target_track: targetTrack,
      facultyId: currentUser?.facultyId,
      majorCode: currentUser?.majorCode,
      weakestSkillCode: currentUser?.weakestSkillCode,
      career_goal: careerGoal || occupationGoal,
    };
    return getTopRecommendation(studentProfile, aiRatings, overallReadiness, SCENARIOS);
  }, [aiRatings, overallReadiness, targetTrack, careerGoal, occupationGoal, currentUser]);

  const suggestedMentorResult = React.useMemo(() => {
    if (!recommendedResult?.scenario) return null;
    const studentProfile = { target_track: targetTrack };
    return getTopMentorMatch(studentProfile, recommendedResult.scenario, DEMO_MENTORS.filter(m => m.role === 'mentor'));
  }, [recommendedResult, targetTrack]);

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
  const [workspaceScenario, setWorkspaceScenario] = useState(null); // full scenario object for workspace
  const [simCompleted, setSimCompleted] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [choicesForStep, setChoicesForStep] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const chatMessagesRef = useRef([]);
  
  // Portfolio State
  const [portfolioItems, setPortfolioItems] = useState([]);

  // Chat State
  const [assignedMentor, setAssignedMentor] = useState(null);

  useEffect(() => {
    // Fetch a mentor for the student to chat with
    const fetchMentor = async () => {
      try {
        const res = await fetch(`${api.API_URL || 'http://localhost:5000'}/api/users/mentors`);
        if (res.ok) {
          const mentors = await res.json();
          if (mentors && mentors.length > 0) {
            setAssignedMentor(mentors[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch mentors', err);
      }
    };
    fetchMentor();
  }, []);

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
    chatMessagesRef.current = chatMessages;
  }, [chatMessages]);

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

  const handleAssessmentSubmit = (newRatings, newReadiness) => {
    setAiRatings(newRatings);
    const storedUserStr = localStorage.getItem('currentUser');
    if (storedUserStr) {
      try {
        const user = JSON.parse(storedUserStr);
        api.saveStudentRatings(user.id, newRatings).catch(e => console.error('Failed to save ratings', e));
      } catch(e) {}
    }
  };

  const resolveScenario = (scenarioOrId) => {
    if (!scenarioOrId) return null;
    if (typeof scenarioOrId === 'string') {
      return scenarios.find(sc => sc.id === scenarioOrId) || null;
    }
    return scenarioOrId;
  };

  const buildChoiceActions = (choices, scenario) => {
    const active = scenario || activeScenario;
    return (choices || []).map(choice => {
      const text = typeof choice === 'string' ? choice : choice.text;
      return {
        text,
        action: () => runScenarioAction(text, active)
      };
    });
  };

  const handleOpenScenario = (scenario) => {
    const resolvedScenario = resolveScenario(scenario);
    if (resolvedScenario) {
      handleLaunchScenario(resolvedScenario);
    } else {
      setActiveTab('simulator');
    }
  };

  const handleLaunchScenario = (scenario) => {
    const resolvedScenario = resolveScenario(scenario);
    if (!resolvedScenario) return;

    setActiveScenario(resolvedScenario);
    setActiveTab('simulator');
    setSimCompleted(false);
    setStepIndex(0);
    setTerminalLogs(resolvedScenario.initialLogs?.length ? resolvedScenario.initialLogs : [
      `$ scenarioctl open ${resolvedScenario.id}`,
      `[INFO] Loaded incident briefing for ${resolvedScenario.title}`,
      '[INFO] Start by observing evidence before changing production state.'
    ]);
    const initialMessages = resolvedScenario.initialChat?.length ? resolvedScenario.initialChat.map(msg => ({
      sender: msg.sender === 'coach' ? 'coach' : 'user',
      text: msg.text
    })) : [
      {
        sender: 'coach',
        text: `Let's take this one carefully. Read the briefing for ${resolvedScenario.id}, tell me what signal you want to inspect first, and I will help you reason through the tradeoffs.`
      }
    ];
    setChatMessages(initialMessages);
    chatMessagesRef.current = initialMessages;
    setChoicesForStep([buildChoiceActions([
      { text: 'Summarize the incident and list the first signals to inspect' },
      { text: 'Show the most relevant logs and recent deploy activity' },
      { text: 'Check service health without making changes' }
    ], resolvedScenario)]);
  };

  const handleCloseScenario = () => {
    setActiveScenario(null);
    setInputVal('');
    setIsSimulating(false);
  };

  const runScenarioAction = async (message, scenario = activeScenario) => {
    const resolvedScenario = resolveScenario(scenario);
    if (!message?.trim() || !resolvedScenario || isSimulating) return;

    const userMessage = { text: message.trim(), sender: 'user' };
    const nextHistory = [...chatMessagesRef.current, userMessage];

    setChatMessages(nextHistory);
    chatMessagesRef.current = nextHistory;
    setInputVal('');
    setIsSimulating(true);

    try {
      const result = await api.chatWithScenario(
        resolvedScenario.id,
        resolvedScenario.title,
        userMessage.text,
        nextHistory,
        resolvedScenario
      );

      setTerminalLogs(prev => [...prev, ...(result.terminalLogs || [])]);
      if (result.coachReply) {
        const coachMessage = { text: result.coachReply, sender: 'coach' };
        setChatMessages(prev => {
          const updated = [...prev, coachMessage];
          chatMessagesRef.current = updated;
          return updated;
        });
      }
      setChoicesForStep([buildChoiceActions(result.choices || [], resolvedScenario)]);
      setSimCompleted(Boolean(result.completed));
    } catch (err) {
      console.error('Failed to run scenario action:', err);
      setChatMessages(prev => {
        const updated = [...prev, {
          text: 'I could not reach the scenario coach right now. Keep your notes and try again in a moment; do not lose the reasoning you already built.',
          sender: 'coach'
        }];
        chatMessagesRef.current = updated;
        return updated;
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    runScenarioAction(inputVal);
  };

  const handleSubmitPortfolio = () => {
    // Handle submission
  };

  const handleSubmitScenarioToMentor = async () => {
    if (!activeScenario) return;
    try {
      const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const studentName = user.fullname || user.username || 'Student';
      await api.addSubmission(studentName, 'Scenario Simulation', activeScenario.title);
      return true;
    } catch (err) {
      console.error('Failed to submit scenario to mentor:', err);
      return false;
    }
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

          {assignedMentor && (
            <button
              className={`student-nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
              style={{ position: 'relative' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-nav-icon">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>{t('sidebar.chat')}</span>
            </button>
          )}
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
                <span className="student-profile-role">{t('settings.studentRole')}</span>
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
          <StudentDashboard
            avatarBase64={currentUser?.avatar_base64}
            firstName={firstName} initials={initials} fullName={fullName}
            targetTrack={targetTrack} major={major} educationLevel={educationLevel}
            occupationGoal={occupationGoal} targetIndustry={targetIndustry}
            setActiveTab={setActiveTab} scenarios={scenarios}
            handleOpenScenario={handleOpenScenario}
            overallReadiness={overallReadiness} ratings={ratings} aiRatings={aiRatings}
            assignedMentor={assignedMentor}
            recommendedResult={recommendedResult}
            suggestedMentorResult={suggestedMentorResult}
            onStartScenario={(sc) => {
              handleLaunchScenario(sc);
              const enriched = { ...DEMO_SCENARIO, ...sc };
              setWorkspaceScenario(enriched);
            }}
            onViewSkillGapResult={() => setActiveTab('skillgapresult')}
          />
        )}
        
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <StudentProfile avatarBase64={currentUser?.avatar_base64} initials={initials} fullName={fullName} targetTrack={targetTrack} major={major} educationLevel={educationLevel} occupationGoal={occupationGoal} targetIndustry={targetIndustry} email={email} bio={bio} careerGoal={careerGoal} strengthsList={strengthsList} developAreasList={developAreasList} />
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
            onNavigate={onNavigate}
          />
        )}
        
        {/* SKILL GAP TAB */}
        {activeTab === 'skillgap' && (
          <StudentSkillGap
            userId={currentUser?.id}
            onSubmit={handleAssessmentSubmit}
            onViewResult={() => setActiveTab('skillgapresult')}
          />
        )}

        {/* SKILL GAP RESULT TAB */}
        {activeTab === 'skillgapresult' && (
          <SkillGapResult
            student={currentUser}
            aiRatings={aiRatings}
            overallReadiness={overallReadiness}
            recommendedResult={recommendedResult}
            mentorMatchResult={suggestedMentorResult}
            onStartScenario={(sc) => {
              handleLaunchScenario(sc);
              const enriched = { ...DEMO_SCENARIO, ...sc };
              setWorkspaceScenario(enriched);
              setActiveTab('simulator');
            }}
            onViewScenarioDetail={(sc) => {
              handleLaunchScenario(sc);
              const enriched = { ...DEMO_SCENARIO, ...sc };
              setWorkspaceScenario(enriched);
              setActiveTab('simulator');
            }}
            onMessageMentor={() => setActiveTab('chat')}
            onBack={() => setActiveTab('skillgap')}
          />
        )}
        
        {/* SCENARIO SIMULATOR TAB — launches full ScenarioWorkspace when a scenario is open */}
        {activeTab === 'simulator' && workspaceScenario ? (
          <ScenarioWorkspace
            scenario={workspaceScenario}
            currentUser={currentUser}
            onClose={() => setWorkspaceScenario(null)}
            onSubmitToMentor={async () => {
              await handleSubmitScenarioToMentor();
            }}
          />
        ) : activeTab === 'simulator' && (
          <StudentScenarioSimulator
            scenarios={scenarios}
            activeScenario={activeScenario}
            handleOpenScenario={(id) => {
              handleOpenScenario(id);
              // Launch workspace with demo scenario or matching DB scenario
              const dbScenario = scenarios.find(s => s.id === id);
              if (dbScenario) {
                // Merge DB scenario with demo data for rich context
                const enriched = { ...DEMO_SCENARIO, ...dbScenario };
                setWorkspaceScenario(enriched);
              } else {
                setWorkspaceScenario(DEMO_SCENARIO);
              }
            }}
            handleLaunchScenario={(sc) => {
              handleLaunchScenario(sc);
              const enriched = { ...DEMO_SCENARIO, ...sc };
              setWorkspaceScenario(enriched);
            }}
            simCompleted={simCompleted}
            stepIndex={stepIndex}
            terminalLogs={terminalLogs}
            chatMessages={chatMessages}
            inputVal={inputVal}
            setInputVal={setInputVal}
            handleSendChat={handleSendChat}
            choicesForStep={choicesForStep}
            isSimulating={isSimulating}
            onCloseScenario={handleCloseScenario}
            onGoToPortfolio={() => {
              setActiveScenario(null);
              setActiveTab('portfolio');
            }}
            onRegenerate={handleRegenerateScenarios}
            onSubmitToMentor={handleSubmitScenarioToMentor}
          />
        )}
        
        {/* EVIDENCE PORTFOLIO TAB */}
        {activeTab === 'portfolio' && (
          <StudentEvidencePortfolio portfolioItems={portfolioItems} handleSubmitPortfolio={handleSubmitPortfolio} onNavigate={onNavigate} targetTrack={targetTrack} overallReadiness={overallReadiness} currentUser={currentUser} />
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && assignedMentor && currentUser && (
          <div className="student-tab-panel">
            <div className="student-page-header">
              <div className="student-page-title-area">
                <h1 className="student-page-title">{t('sidebar.chat')}</h1>
                <p className="student-page-subtitle">{assignedMentor.fullname || assignedMentor.name || assignedMentor.username}</p>
              </div>
            </div>
            <div className="student-card" style={{ padding: 0, overflow: 'hidden', height: '560px', display: 'flex', flexDirection: 'column' }}>
              <ChatWidget
                currentUser={currentUser}
                contactUser={assignedMentor}
                isFloating={false}
              />
            </div>
          </div>
        )}
      </div>

      <SkillAssessmentQuizModal
        isOpen={showSkillAssessment}
        onClose={() => setShowSkillAssessment(false)}
        onComplete={handleAssessmentComplete}
        userProfile={{
          career_goal:     careerGoal,
          target_track:    targetTrack,
          target_industry: targetIndustry,
          occupation_goal: occupationGoal,
          major,
        }}
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
