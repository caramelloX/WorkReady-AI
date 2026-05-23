import StudentDashboard from './StudentDashboard';
import StudentProfile from './StudentProfile';
import StudentSkillGap from './StudentSkillGap';
import StudentScenarioSimulator from './StudentScenarioSimulator';
import StudentEvidencePortfolio from './StudentEvidencePortfolio';
import React, { useState, useEffect } from 'react';
import './StudentScreen.css';
import { api } from '../../api.js';

export default function StudentScreen({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        setCurrentUser(JSON.parse(userStr));
      } catch (e) {}
    }
  }, []);

  const firstName = currentUser?.fullname?.split(' ')[0] || 'Student';
  const fullName = currentUser?.fullname || 'Aarav Sharma';
  const initials = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST';
  const targetTrack = currentUser?.target_track || 'Computer Engineering';
  const targetIndustry = currentUser?.target_industry || 'Fintech';
  const occupationGoal = currentUser?.occupation_goal || targetTrack;
  const email = currentUser?.email || 'student@workready.ai';
  const major = currentUser?.major || 'Computer Science & Engineering';
  const educationLevel = currentUser?.education_level || "Bachelor's (Final year)";
  const careerGoal = currentUser?.career_goal || `Land a ${occupationGoal} role at a top ${targetIndustry} company.`;
  const strengthsList = currentUser?.strengths?.length ? currentUser.strengths : ['Understanding of systems', 'Root cause analysis', 'Technical writing', 'Secure code review'];
  const developAreasList = currentUser?.develop_areas?.length ? currentUser.develop_areas : ['System design at scale', 'Cloud / DevOps depth', 'Stakeholder communication'];

  // Interactive self-rating competency ratings ('low', 'medium', 'high')
  const [ratings, setRatings] = useState({
    processMap: 'medium',
    safetyRisk: 'medium',
    rca: 'medium',
    traceability: 'medium',
    memo: 'medium',
    responsibleAi: 'medium',
  });

  // Load backend data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const userStr = localStorage.getItem('currentUser');
        let userId = 'student-01';
        if (userStr) {
          try {
            const u = JSON.parse(userStr);
            userId = u._id || u.id || 'student-01';
          } catch(e) {}
        }

        const data = await api.getStudentRatings(userId);
        if (data) {
          setRatings({
            processMap: data.processMap || 'medium',
            safetyRisk: data.safetyRisk || 'medium',
            rca: data.rca || 'medium',
            traceability: data.traceability || 'medium',
            memo: data.memo || 'medium',
            responsibleAi: data.responsibleAi || 'medium',
          });
        }

        const scenariosData = await api.getScenarios();
        setScenarios(scenariosData || []);

        const portfolioData = await api.getPortfolio();
        setPortfolioItems(portfolioData || []);

      } catch (err) {
        console.error('Failed to retrieve data from database:', err);
      }
    };
    loadData();
  }, []);

  // Derived statistics based on ratings
  const [overallReadiness, setOverallReadiness] = useState(65);
  const [strengthsCount, setStrengthsCount] = useState(0);
  const [gapsCount, setGapsCount] = useState(0);

  // Recalculate dashboard statistics when ratings change
  useEffect(() => {
    let totalScore = 0;
    let high = 0;
    let low = 0;

    Object.values(ratings).forEach((val) => {
      if (val === 'high') {
        totalScore += 90;
        high += 1;
      } else if (val === 'medium') {
        totalScore += 65;
      } else {
        totalScore += 35;
        low += 1;
      }
    });

    const composite = Math.round(totalScore / 6);
    setOverallReadiness(composite);
    setStrengthsCount(high);
    setGapsCount(low);
  }, [ratings]);

  // Self-rating handler
  const handleRate = async (competency, level) => {
    const updated = {
      ...ratings,
      [competency]: level
    };
    setRatings(updated);
    try {
      const userId = currentUser?._id || currentUser?.id || 'student-01';
      await api.saveStudentRatings(userId, updated);
    } catch (err) {
      console.error('Failed to save ratings to DB:', err);
    }
  };

  // Reset ratings handler
  const handleResetRatings = async () => {
    const defaultRatings = {
      processMap: 'medium',
      safetyRisk: 'medium',
      rca: 'medium',
      traceability: 'medium',
      memo: 'medium',
      responsibleAi: 'medium',
    };
    setRatings(defaultRatings);
    try {
      const userId = currentUser?._id || currentUser?.id || 'student-01';
      await api.saveStudentRatings(userId, defaultRatings);
    } catch (err) {
      console.error('Failed to reset ratings in DB:', err);
    }
  };

  const handleSubmitPortfolio = async () => {
    try {
      await api.addSubmission(fullName, 'Full Portfolio', 'Evidence Portfolio Submission');
      alert('Portfolio successfully submitted to course mentor and persisted in database!');
    } catch (err) {
      console.error('Failed to submit portfolio:', err);
      alert('Failed to submit portfolio to database.');
    }
  };

  // Interactive Scenario Simulator States
  const [activeScenario, setActiveScenario] = useState(null);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [simCompleted, setSimCompleted] = useState(false);


  // Radar Chart Dynamic coordinate calculation for SVG
  const calculateRadarPoints = () => {
    // 6 competencies mapped around the circle
    const order = ['processMap', 'safetyRisk', 'rca', 'traceability', 'memo', 'responsibleAi'];
    const center = 150;
    const maxRadius = 100;

    const points = order.map((comp, index) => {
      // Angle in radians (60 degrees separation: 0, 60, 120, 180, 240, 300)
      const angleDeg = index * 60 - 90; // Start at top (-90 degrees)
      const angleRad = (angleDeg * Math.PI) / 180;
      
      const rating = ratings[comp];
      let radiusValue = 35; // default low
      if (rating === 'medium') radiusValue = 68;
      if (rating === 'high') radiusValue = 100;

      const x = center + Math.cos(angleRad) * radiusValue;
      const y = center + Math.sin(angleRad) * radiusValue;

      return `${x},${y}`;
    });

    return points.join(' ');
  };

  // Open and launch a scenario from the dashboard
  const handleOpenScenario = (scId) => {
    const sc = scenarios.find((s) => s.id === scId);
    if (sc) {
      handleLaunchScenario(sc);
      setActiveTab('simulator');
    } else {
      setActiveTab('simulator');
    }
  };

  // Launch simulated scenario
  const handleLaunchScenario = (sc) => {
    setActiveScenario(sc);
    setSimCompleted(false);
    setStepIndex(0);
    
    // Initial terminal logs
    setTerminalLogs(sc.initialLogs || []);

    // Initial AI Coach chats
    setChatMessages(sc.initialChat || []);
  };

  // Simulation Choices Flow
  const choicesForStep = [
    // Step 0 choices
    [
      {
        text: 'Check active database connection telemetry and list unreleased connection routes.',
        action: () => {
          setTerminalLogs((prev) => [
            ...prev,
            `$ wr-telemetry db-connections --show-active --limit 10`,
            `Active: 100, Idle: 0, Waiting: 89`,
            `Query Source Trace:`,
            `  -> 82 connections opened by route /v1/checkout/apply-coupon (status: idle in transaction)`,
            `  -> 10 connections opened by route /v1/cart (status: active)`,
            `  -> 8 connections opened by system worker threads (status: idle)`,
            `[SUCCESS] telemetry fetched. Massive leak detected on Coupon Application service!`
          ]);
          setChatMessages((prev) => [
            ...prev,
            { sender: 'student', text: 'Let\'s run database connections telemetry to trace which routes are reserving slots.' },
            { sender: 'coach', text: 'Brilliant choice! The telemetry shows that 82 of the 100 active connections are sitting in an "idle in transaction" state, originating from the Coupon Application service route. What is our next debugging step?' }
          ]);
          setStepIndex(1);
        }
      },
      {
        text: 'Restart the PostgreSQL database cluster to clear all active connection sockets.',
        action: () => {
          setTerminalLogs((prev) => [
            ...prev,
            `$ pg_ctl restart -D /var/lib/postgresql/data`,
            `[SYSTEM] Database cluster restarted. Clearing active tables...`,
            `[SYSTEM] Active connections reset to 0. Checkout response times returning to normal.`,
            `[WARN] 20 seconds elapsed. Pool starts swelling...`,
            `[ERR] Pool exhausted! active=100 idle=0 waiting=72. Timeout errors reappear.`,
            `[ERR] Restart was a band-aid! The leak is ongoing.`
          ]);
          setChatMessages((prev) => [
            ...prev,
            { sender: 'student', text: 'Let\'s restart the PostgreSQL cluster to wipe active connections immediately.' },
            { sender: 'coach', text: 'That cleared connections momentarily, but because the leak remains active, the database connection pool bloated again to 100% within 20 seconds. Restarting did not solve the root cause. Try to run database telemetry to isolate where the leaks are coming from.' }
          ]);
        }
      },
      {
        text: 'Vertically scale up the database connection pool limits from 100 to 500 in pg_hba.conf.',
        action: () => {
          setTerminalLogs((prev) => [
            ...prev,
            `$ nano /etc/postgresql/16/main/postgresql.conf`,
            `Changing max_connections from 100 to 500...`,
            `Applying configurations changes...`,
            `[ERR] Fatal memory threshold exceeded on Database: pg_mem_alloc failed! Database server crashed!`,
            `[ERR] Vertically scaling connections without allocating RAM caused an out-of-memory crash.`
          ]);
          setChatMessages((prev) => [
            ...prev,
            { sender: 'student', text: 'Let\'s edit configuration files to expand maximum database connection limits.' },
            { sender: 'coach', text: 'Whoops! Scaling connections without diagnosing why they leak caused the server to run out of RAM and crash entirely. We should keep limits safe and run active connection telemetry instead.' }
          ]);
        }
      }
    ],
    // Step 1 choices
    [
      {
        text: 'Inspect the coupon verification try/catch codebase for unreleased database clients.',
        action: () => {
          setTerminalLogs((prev) => [
            ...prev,
            `$ cat src/services/coupon.js`,
            `Lines 142-159:`,
            `  async function verifyCoupon(code) {`,
            `    const client = await db.connect(); // Opens postgres client from pool`,
            `    try {`,
            `      const result = await client.query('SELECT * FROM coupons WHERE code = $1', [code]);`,
            `      return result.rows[0];`,
            `      // MISSING: client.release() in early returns!`,
            `    } catch (err) {`,
            `      logger.error(err);`,
            `      client.release();`,
            `    }`,
            `  }`,
            `[SUCCESS] Root-cause bug located! DB connection client is never released back on successful queries!`
          ]);
          setChatMessages((prev) => [
            ...prev,
            { sender: 'student', text: 'Let\'s look at coupon.js source code to trace connection pool acquisitions.' },
            { sender: 'coach', text: 'Bingo! You located the root-cause bug. In `verifyCoupon`, when a coupon is successfully verified, the function performs an early return but forgets to call `client.release()`. The connection stays locked forever. How should we write the fix?' }
          ]);
          setStepIndex(2);
        }
      },
      {
        text: 'Check if index optimization on the coupons table is missing, causing queries to hang.',
        action: () => {
          setTerminalLogs((prev) => [
            ...prev,
            `$ psql -c "EXPLAIN ANALYZE SELECT * FROM coupons WHERE code = 'SAVE10'"`,
            `Index Scan using idx_coupons_code on coupons  (cost=0.15..8.17 rows=1 width=64) (actual time=0.041..0.042 rows=1 loops=1)`,
            `Planning Time: 0.088 ms`,
            `Execution Time: 0.065 ms`,
            `[INFO] Index is present, and query runs in less than 1ms. Query speed is not the issue.`
          ]);
          setChatMessages((prev) => [
            ...prev,
            { sender: 'student', text: 'Let\'s inspect if missing indexing is slowing queries down, causing pool bloat.' },
            { sender: 'coach', text: 'Good thought, but the database query execution planner shows we have a highly efficient index and coupon searches resolve in less than 1ms. The issue is structural — the connections are not being released. Let\'s review the codebase files.' }
          ]);
        }
      }
    ],
    // Step 2 choices
    [
      {
        text: 'Implement a finally{} block wrapping the return, ensuring client.release() triggers unconditionally.',
        action: () => {
          setTerminalLogs((prev) => [
            ...prev,
            `$ git diff src/services/coupon.js`,
            `@@ -142,12 +142,10 @@`,
            `   async function verifyCoupon(code) {`,
            `     const client = await db.connect();`,
            `     try {`,
            `       const result = await client.query('SELECT * FROM coupons WHERE code = $1', [code]);`,
            `       return result.rows[0];`,
            `-    } catch (err) {`,
            `-      logger.error(err);`,
            `-      client.release();`,
            `+    } finally {`,
            `+      client.release(); // Releases connections unconditionally`,
            `     }`,
            `   }`,
            `$ npm run test:integration`,
            `[PASS] integration_test_checkout_concurrency.js`,
            `[SUCCESS] 2026-05-22T14:10:12Z - Fix deployed! DB connections remain stable at 12 active/100.`
          ]);
          setChatMessages((prev) => [
            ...prev,
            { sender: 'student', text: 'Let\'s refactor code to use a finally block, ensuring client.release() runs on both success and error paths.' },
            { sender: 'coach', text: 'Absolutely correct! Adding a finally block guarantees the database connection is returned to the pool regardless of whether query operations succeed or crash. The checkout system is now completely healthy and connections stabilized! Excellent job!' }
          ]);
          setSimCompleted(true);
        }
      }
    ]
  ];

  // Send student chat text
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const text = inputVal;
    setInputVal('');

    setChatMessages((prev) => [
      ...prev,
      { sender: 'student', text }
    ]);

    // Simulated general response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'coach',
          text: `Great thoughts! But to progress through the simulation, please select one of the core strategic choices displayed below the terminal console.`
        }
      ]);
    }, 800);
  };


  return (
    <div className="student-workspace">
      {/* Sidebar Navigation */}
      <div className="student-sidebar">
        <div className="student-sidebar-header">Student</div>

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
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
            <span>Skill Gap</span>
          </button>

          <button
            className={`student-nav-btn ${activeTab === 'simulator' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulator')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-nav-icon">
              <polyline points="4 17 10 11 15 16 20 10" />
              <polyline points="14 10 20 10 20 16" />
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
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
          <StudentScenarioSimulator scenarios={scenarios} activeScenario={activeScenario} handleOpenScenario={handleOpenScenario} handleLaunchScenario={handleLaunchScenario} simCompleted={simCompleted} stepIndex={stepIndex} terminalLogs={terminalLogs} chatMessages={chatMessages} inputVal={inputVal} setInputVal={setInputVal} handleSendChat={handleSendChat} choicesForStep={choicesForStep} />
        )}
        {/* EVIDENCE PORTFOLIO TAB */}
        {activeTab === 'portfolio' && (
          <StudentEvidencePortfolio portfolioItems={portfolioItems} handleSubmitPortfolio={handleSubmitPortfolio} onNavigate={onNavigate} />
        )}
      </div>
    </div>
  );
}
