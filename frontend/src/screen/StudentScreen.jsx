import React, { useState, useEffect } from 'react';
import './StudentScreen.css';

export default function StudentScreen({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Interactive self-rating competency ratings ('low', 'medium', 'high')
  const [ratings, setRatings] = useState({
    processMap: 'medium',
    safetyRisk: 'medium',
    rca: 'medium',
    traceability: 'medium',
    memo: 'medium',
    responsibleAi: 'medium',
  });

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
  const handleRate = (competency, level) => {
    setRatings((prev) => ({
      ...prev,
      [competency]: level,
    }));
  };

  // Reset ratings handler
  const handleResetRatings = () => {
    setRatings({
      processMap: 'medium',
      safetyRisk: 'medium',
      rca: 'medium',
      traceability: 'medium',
      memo: 'medium',
      responsibleAi: 'medium',
    });
  };

  // Interactive Scenario Simulator States
  const [activeScenario, setActiveScenario] = useState(null);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [simCompleted, setSimCompleted] = useState(false);

  // Scenarios mock data
  const scenarios = [
    {
      id: 'S-101',
      title: 'Production API Returning 500s — Checkout Service',
      desc: 'A recent deployment broke key card verification pipelines. Inspect GitHub PR diffs, write automated tests, and restore payment pathways.',
      difficulty: 'Intermediate',
    },
    {
      id: 'S-102',
      title: 'Database Connection Pool Exhausted at 2 AM',
      desc: 'Checkout API response times spiked to 4500ms under high load. Uncover why database connections are failing and fix the root-cause bug.',
      difficulty: 'Advanced',
    },
    {
      id: 'S-104',
      title: 'Memory Leak in Node.js Worker',
      desc: 'Heap sizes spike every 6 hours, triggering container OOM kills. Analyze core dumps, locate closure references, and plug the memory leak.',
      difficulty: 'Intermediate',
    },
  ];


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
    setTerminalLogs([
      `[SYSTEM] 2026-05-22T14:09:44Z - Spin up simulated staging environment...`,
      `[SYSTEM] Connecting to mock checkout db instance: postgresql://admin:****@db-cluster.us-east-1.internal:5432/checkout...`,
      `[WARN] 2026-05-22T14:09:46Z - API response time exceeds threshold: 4610ms on /v1/checkout`,
      `[ERR] 2026-05-22T14:09:47Z - PostgreSQL connection refused: Fatal: remaining connection slots are reserved for non-replication superuser connections`,
      `[ERR] 2026-05-22T14:09:48Z - Pool exhausted! active=100 idle=0 waiting=89`,
    ]);

    // Initial AI Coach chats
    setChatMessages([
      {
        sender: 'coach',
        text: `Hey Aarav! We have a critical SRE alert: Checkout requests are timing out, and logs show PostgreSQL connection pool exhaustion (100/100 active connections). What should we do first to isolate this issue?`
      }
    ]);
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

  // Mock Evidence Portfolio data
  const portfolioItems = [
    {
      id: 'P-901',
      scenarioId: 'S-102',
      title: 'Database connection pool exhaustion',
      topic: 'Database Tuning & Triage',
      status: 'Verified',
      score: '91/100',
      desc: 'Diagnosed a high-priority outage on the coupons route in a PostgreSQL backend. Isolated an "idle in transaction" leak and refactored core code with bulletproof try-catch-finally constructs.',
      logs: [
        'Checked DB connections using telemetry suites.',
        'Identified early-return unreleased clients on verifyCoupon.',
        'Fixed using standard finally block connection cleanup.'
      ],
      mentor: 'Outstanding root cause tracing, Aarav! You backed up your theory with solid telemetry checks rather than scaling settings blindly. Excellent RFC note.',
      mentorName: 'Emily Vance, Principal SRE at FinTech Corp'
    },
    {
      id: 'P-882',
      scenarioId: 'S-104',
      title: 'Optimizing Slow SQL JOIN Queries',
      topic: 'Backend Optimization',
      status: 'Verified',
      score: '88/100',
      desc: 'Tackled an 800ms query latency on analytics dashboards. Analyzed query execution planners (EXPLAIN ANALYZE), discovered sequential scan bottlenecks, and added composite indexes.',
      logs: [
        'Ran EXPLAIN ANALYZE on metrics queries.',
        'Located nested loop and seq-scans on users table.',
        'Created composite index idx_users_org_created_at.'
      ],
      mentor: 'Excellent optimization! A composite index was exactly what was needed. Latency dropped by 98%. Double check index bloat thresholds in the future.',
      mentorName: 'Rajesh Koothra, Tech Lead at Razorpay'
    },
    {
      id: 'P-821',
      scenarioId: 'S-109',
      title: 'CSRF Token Verification Triage',
      topic: 'Application Security',
      status: 'Verified',
      score: '85/100',
      desc: 'Resolved high-priority CORS and CSRF authentication failures in decoupled SPA environments. Restored secure SameSite cookies configuration rules.',
      logs: [
        'Debugged Axios requests dropping credentials.',
        'Analyzed CORS pre-flight HTTP logs.',
        'Configured express-cors and helmet rules.'
      ],
      mentor: 'Securing web applications is highly challenging. You explained CORS pre-flight and SameSite cookie headers like a seasoned engineer.',
      mentorName: 'Sarah Jenkins, Lead Security Architect'
    }
  ];

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
          <div className="student-tab-panel dashboard-container-updated">
            
            {/* Greeting Header Row */}
            <div className="student-dashboard-header">
              <div className="student-dashboard-header-text">
                <h1>Welcome back, Aarav</h1>
                <p>Here's where you stand today, and what to tackle next.</p>
              </div>
              <button className="continue-training-btn" onClick={() => setActiveTab('simulator')}>
                <span>Continue training</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="16" height="16">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Student ID Profile Card */}
            <div className="student-profile-overview-card">
              <div className="student-profile-overview-header">
                <div className="student-profile-overview-avatar">AS</div>
                <div className="student-profile-overview-meta">
                  <h2>
                    Aarav Sharma
                    <span className="student-cohort-pill">· Cohort 2026 — Computer Engineering Track</span>
                  </h2>
                </div>
              </div>
              
              <div className="student-info-columns-grid">
                {/* Major Column */}
                <div className="student-info-column">
                  <span className="student-info-column-label">MAJOR</span>
                  <div className="student-info-column-content-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-info-column-icon">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                    </svg>
                    <div className="student-info-column-details">
                      <h4 className="student-info-column-title">Computer Science & Engineering</h4>
                      <p className="student-info-column-subtitle">IIT Roorkee</p>
                    </div>
                  </div>
                </div>

                {/* Occupation Goal Column */}
                <div className="student-info-column">
                  <span className="student-info-column-label">OCCUPATION GOAL</span>
                  <div className="student-info-column-content-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-info-column-icon">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <div className="student-info-column-details">
                      <h4 className="student-info-column-title">Backend Software Engineer</h4>
                      <p className="student-info-column-subtitle">Targeting Series B+ fintech</p>
                    </div>
                  </div>
                </div>

                {/* Goals Column */}
                <div className="student-info-column">
                  <span className="student-info-column-label">GOALS</span>
                  <div className="student-info-column-content-row">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="student-info-column-icon orange">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                    <div className="student-info-column-details">
                      <ul className="student-goals-bullet-list">
                        <li>Reach Work-Ready Score 85</li>
                        <li>Ship 3 mentor-reviewed memos</li>
                        <li>Land summer internship</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick-Link Shortcut Cards */}
            <div className="student-sublinks-grid">
              <div className="student-sublink-card" onClick={() => setActiveTab('portfolio')}>
                <div className="student-sublink-card-left">
                  <div className="student-sublink-icon-wrapper blue">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div className="student-sublink-info">
                    <h4 className="student-sublink-title">View Portfolio</h4>
                    <p className="student-sublink-subtitle">9 mentor-reviewed evidence items</p>
                  </div>
                </div>
                <svg className="student-sublink-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              <div className="student-sublink-card" onClick={() => setActiveTab('portfolio')}>
                <div className="student-sublink-card-left">
                  <div className="student-sublink-icon-wrapper teal">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                  </div>
                  <div className="student-sublink-info">
                    <h4 className="student-sublink-title">View Feedback</h4>
                    <p className="student-sublink-subtitle">Mentor + AI coach notes on your work</p>
                  </div>
                </div>
                <svg className="student-sublink-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>

              <div className="student-sublink-card" onClick={() => {
                const element = document.querySelector('.dashboard-breakdown-card');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}>
                <div className="student-sublink-card-left">
                  <div className="student-sublink-icon-wrapper orange">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      <polyline points="12 12 16 8" />
                    </svg>
                  </div>
                  <div className="student-sublink-info">
                    <h4 className="student-sublink-title">Check Readiness Score</h4>
                    <p className="student-sublink-subtitle">74/100 against Backend Software Engineer</p>
                  </div>
                </div>
                <svg className="student-sublink-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </div>

            {/* Stats Metrics Cards Grid */}
            <div className="student-stats-grid">
              {/* Card 1: Work-Ready Score */}
              <div className="student-stat-card">
                <div className="student-stat-label-row">
                  <span className="student-stat-label">WORK-READY SCORE</span>
                  <span className="student-stat-dot blue"></span>
                </div>
                <h3 className="student-stat-value">74/100</h3>
                <p className="student-stat-comparison">vs Backend Software Engineer</p>
              </div>

              {/* Card 2: Scenarios Completed */}
              <div className="student-stat-card">
                <div className="student-stat-label-row">
                  <span className="student-stat-label">SCENARIOS COMPLETED</span>
                  <span className="student-stat-dot teal"></span>
                </div>
                <h3 className="student-stat-value">14/24</h3>
                <p className="student-stat-comparison">58% of cohort</p>
              </div>

              {/* Card 3: RCA Coach Rating */}
              <div className="student-stat-card">
                <div className="student-stat-label-row">
                  <span className="student-stat-label">RCA COACH RATING</span>
                  <span className="student-stat-dot green"></span>
                </div>
                <h3 className="student-stat-value">4.2</h3>
                <p className="student-stat-comparison">Across 11 sessions</p>
              </div>

              {/* Card 4: Streak */}
              <div className="student-stat-card">
                <div className="student-stat-label-row">
                  <span className="student-stat-label">STREAK</span>
                  <span className="student-stat-dot orange"></span>
                </div>
                <h3 className="student-stat-value">18 days</h3>
                <p className="student-stat-comparison">Personal best</p>
              </div>
            </div>

            {/* 1. Work-Ready Score Breakdown Card */}
            <div className="dashboard-breakdown-card">
              <div className="breakdown-header">
                <div className="breakdown-title-area">
                  <span className="breakdown-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="icon-globe">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      <path d="M2 12h20" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="breakdown-card-title">Work-Ready Score breakdown</h3>
                    <p className="breakdown-card-subtitle">Weighted coverage of skills required for Backend Software Engineer against your current levels.</p>
                  </div>
                </div>
                
                <div className="breakdown-score-badge">
                  <div className="score-main">74<span className="score-max">/100</span></div>
                  <div className="score-gap-label">Biggest gap: <span className="highlight-gap">Cloud & DevOps (AWS/Docker)</span></div>
                </div>
              </div>
              
              <div className="breakdown-skills-grid">
                {/* Left Column */}
                <div className="skills-col">
                  {/* Skill 1 */}
                  <div className="skill-progress-item">
                    <div className="skill-info-row">
                      <span className="skill-name">System Design <span className="skill-weight">· w 25%</span></span>
                      <span className="skill-score-details">42/75 <span className="skill-diff">+14.0</span></span>
                    </div>
                    <div className="skill-bar-outer">
                      <div className="skill-bar-inner orange" style={{ width: '56%' }}></div>
                    </div>
                  </div>

                  {/* Skill 2 */}
                  <div className="skill-progress-item">
                    <div className="skill-info-row">
                      <span className="skill-name">Cloud & DevOps (AWS/Docker) <span className="skill-weight">· w 20%</span></span>
                      <span className="skill-score-details">38/70 <span className="skill-diff">+10.9</span></span>
                    </div>
                    <div className="skill-bar-outer">
                      <div className="skill-bar-inner orange" style={{ width: '54%' }}></div>
                    </div>
                  </div>

                  {/* Skill 3 */}
                  <div className="skill-progress-item">
                    <div className="skill-info-row">
                      <span className="skill-name">Git & Code Review <span className="skill-weight">· w 15%</span></span>
                      <span className="skill-score-details">65/80 <span className="skill-diff">+12.2</span></span>
                    </div>
                    <div className="skill-bar-outer">
                      <div className="skill-bar-inner blue" style={{ width: '81%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="skills-col">
                  {/* Skill 4 */}
                  <div className="skill-progress-item">
                    <div className="skill-info-row">
                      <span className="skill-name">Data Structures & Algorithms <span className="skill-weight">· w 20%</span></span>
                      <span className="skill-score-details">78/90 <span className="skill-diff">+17.3</span></span>
                    </div>
                    <div className="skill-bar-outer">
                      <div className="skill-bar-inner green" style={{ width: '86%' }}></div>
                    </div>
                  </div>

                  {/* Skill 5 */}
                  <div className="skill-progress-item">
                    <div className="skill-info-row">
                      <span className="skill-name">Secure Coding (OWASP) <span className="skill-weight">· w 15%</span></span>
                      <span className="skill-score-details">88/90 <span className="skill-diff">+14.7</span></span>
                    </div>
                    <div className="skill-bar-outer">
                      <div className="skill-bar-inner green" style={{ width: '97%' }}></div>
                    </div>
                  </div>

                  {/* Skill 6 */}
                  <div className="skill-progress-item">
                    <div className="skill-info-row">
                      <span className="skill-name">Technical Writing <span className="skill-weight">· w 5%</span></span>
                      <span className="skill-score-details">81/85 <span className="skill-diff">+4.8</span></span>
                    </div>
                    <div className="skill-bar-outer">
                      <div className="skill-bar-inner green" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="breakdown-footer">
                Score = &Sigma; (skill coverage &times; occupation weight). Coverage is capped at the role's target per skill.
              </div>
            </div>

            {/* 2. Middle Row: Upcoming Scenarios (65%) & Top Skill Gaps (35%) */}
            <div className="dashboard-middle-row">
              
              {/* Left Panel: Upcoming Scenarios */}
              <div className="dashboard-card scenarios-panel">
                <div className="panel-header">
                  <h3 className="panel-title">Upcoming scenarios</h3>
                  <button className="panel-link-btn" onClick={() => setActiveTab('simulator')}>View all</button>
                </div>
                
                <div className="scenarios-list">
                  {/* Scenario 1 */}
                  <div className="scenario-row-item">
                    <div className="scenario-left-info">
                      <div className="scenario-badge-row">
                        <span className="sc-code-badge">S-101</span>
                        <span className="sc-status-pill available">Available</span>
                      </div>
                      <h4 className="sc-title-text" onClick={() => handleOpenScenario('S-101')}>
                        Production API Returning 500s — Checkout Service
                      </h4>
                      <p className="sc-meta-text">Backend · Intermediate · 25 min</p>
                    </div>
                    <button className="sc-open-link" onClick={() => handleOpenScenario('S-101')}>
                      <span>Open</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>

                  {/* Scenario 2 */}
                  <div className="scenario-row-item">
                    <div className="scenario-left-info">
                      <div className="scenario-badge-row">
                        <span className="sc-code-badge">S-102</span>
                        <span className="sc-status-pill in-progress">In progress</span>
                      </div>
                      <h4 className="sc-title-text" onClick={() => handleOpenScenario('S-102')}>
                        Database Connection Pool Exhausted at 2 AM
                      </h4>
                      <p className="sc-meta-text">Infra · Advanced · 40 min</p>
                    </div>
                    <button className="sc-open-link" onClick={() => handleOpenScenario('S-102')}>
                      <span>Open</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>

                  {/* Scenario 3 */}
                  <div className="scenario-row-item">
                    <div className="scenario-left-info">
                      <div className="scenario-badge-row">
                        <span className="sc-code-badge">S-104</span>
                        <span className="sc-status-pill available">Available</span>
                      </div>
                      <h4 className="sc-title-text" onClick={() => handleOpenScenario('S-104')}>
                        Memory Leak in Node.js Worker
                      </h4>
                      <p className="sc-meta-text">Backend · Intermediate · 30 min</p>
                    </div>
                    <button className="sc-open-link" onClick={() => handleOpenScenario('S-104')}>
                      <span>Open</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Panel: Top Skill Gaps */}
              <div className="dashboard-card skillgaps-panel">
                <div className="panel-header">
                  <h3 className="panel-title">Top skill gaps</h3>
                </div>
                
                <div className="skillgaps-list">
                  {/* Gap 1 */}
                  <div className="gap-item">
                    <div className="gap-info">
                      <span className="gap-name">Data Structures & Algorithms</span>
                      <span className="gap-score">78/90</span>
                    </div>
                    <div className="gap-bar-outer">
                      <div className="gap-bar-inner green" style={{ width: '86%' }}></div>
                    </div>
                  </div>

                  {/* Gap 2 */}
                  <div className="gap-item">
                    <div className="gap-info">
                      <span className="gap-name">System Design</span>
                      <span className="gap-score">42/75</span>
                    </div>
                    <div className="gap-bar-outer">
                      <div className="gap-bar-inner orange" style={{ width: '56%' }}></div>
                    </div>
                  </div>

                  {/* Gap 3 */}
                  <div className="gap-item">
                    <div className="gap-info">
                      <span className="gap-name">Git & Code Review</span>
                      <span className="gap-score">65/80</span>
                    </div>
                    <div className="gap-bar-outer">
                      <div className="gap-bar-inner blue" style={{ width: '81%' }}></div>
                    </div>
                  </div>

                  {/* Gap 4 */}
                  <div className="gap-item">
                    <div className="gap-info">
                      <span className="gap-name">Technical Writing</span>
                      <span className="gap-score">81/85</span>
                    </div>
                    <div className="gap-bar-outer">
                      <div className="gap-bar-inner green" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                </div>

                <button className="gaps-assessment-link" onClick={() => setActiveTab('skillgap')}>
                  <span>Full assessment</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>

            </div>

            {/* 3. Bottom Row: Three Columns */}
            <div className="dashboard-bottom-row">
              
              {/* Badges Earned */}
              <div className="dashboard-card bottom-card">
                <div className="bottom-card-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="bottom-card-icon badge-icon">
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                  <h4 className="bottom-card-title">Badges earned</h4>
                </div>
                <div className="badges-pills-row">
                  <span className="badge-pill">Clean Coder</span>
                  <span className="badge-pill">Incident Responder</span>
                  <span className="badge-pill">Code Reviewer</span>
                  <span className="badge-pill">System Designer</span>
                </div>
              </div>

              {/* This Week */}
              <div className="dashboard-card bottom-card">
                <div className="bottom-card-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="bottom-card-icon week-icon">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                  <h4 className="bottom-card-title">This week</h4>
                </div>
                <p className="bottom-card-text font-accent-dark">
                  3 scenarios, 2 RCA reviews, 1 memo drafted.
                </p>
              </div>

              {/* Next Mentor Sync */}
              <div className="dashboard-card bottom-card">
                <div className="bottom-card-header">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="bottom-card-icon sync-icon">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <h4 className="bottom-card-title">Next mentor sync</h4>
                </div>
                <p className="bottom-card-text">
                  Fri, 12:30 PM with M. Iyer (Staff Engineer, Razorpay).
                </p>
              </div>

            </div>

          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="student-tab-panel">
            <div className="student-page-header">
              <div className="student-page-title-area">
                <h1 className="student-page-title">Profile</h1>
                <p className="student-page-subtitle">Your public learner profile — what mentors and recruiters see.</p>
              </div>
            </div>

            <div className="profile-grid">
              
              {/* Profile Left Details Card */}
              <div className="student-card profile-left-card">
                <div className="profile-avatar-circle">AS</div>
                <h3 className="profile-name">Aarav Sharma</h3>
                <p className="profile-cohort">Cohort 2026 — Computer Engineering Track</p>

                <div className="profile-contact-details">
                  <div className="profile-contact-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                    <span>aarav.sharma@workready.ai</span>
                  </div>
                  <div className="profile-contact-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                    </svg>
                    <span>IIT Roorkee</span>
                  </div>
                  <div className="profile-contact-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                    </svg>
                    <span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>Open to backend / SRE roles</span>
                  </div>
                </div>

                <div className="profile-education-details">
                  <div className="profile-details-section">
                    <span className="profile-detail-label">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                      </svg>
                      <span>Education Level</span>
                    </span>
                    <span className="profile-detail-val">Bachelor's (Final year) — B.E. Computer Science</span>
                  </div>

                  <div className="profile-details-section">
                    <span className="profile-detail-label">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="2" y1="12" x2="22" y2="12" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                      <span>Target Industry</span>
                    </span>
                    <span className="profile-detail-val">Fintech & SaaS — backend / site reliability</span>
                  </div>
                </div>
              </div>

              {/* Profile Right Subcards */}
              <div className="profile-right-grid">
                
                {/* About Card */}
                <div className="student-card">
                  <h4 className="profile-section-title">About</h4>
                  <p className="profile-about-text">
                    Final-year computer engineering student with a focus on backend systems and site reliability engineering. Active in WorkReady AI's Razorpay mentorship track, with hands-on simulated experience in production incident response, database tuning, and secure code review.
                  </p>
                </div>

                {/* Career Goals */}
                <div className="student-card">
                  <h4 className="profile-section-title">Career Goals</h4>
                  <ul className="profile-goals-list">
                    <li>Land a backend software engineering role at a Series B+ fintech.</li>
                    <li>Reach a composite Work-Ready score of 85+ before graduation.</li>
                    <li>Ship 3 mentor-reviewed RCA memos and a portfolio-grade incident write-up.</li>
                  </ul>
                </div>

                {/* Strengths & Develop Areas */}
                <div className="profile-two-column-row">
                  
                  {/* Strengths */}
                  <div className="student-card">
                    <h4 className="profile-section-title" style={{ color: 'var(--accent-green)', borderColor: '#a7f3d0' }}>Strengths</h4>
                    <div className="profile-tags-container">
                      <span className="profile-pill green">Understanding of systems</span>
                      <span className="profile-pill green">Root cause analysis</span>
                      <span className="profile-pill green">Technical writing</span>
                      <span className="profile-pill green">Secure code review</span>
                    </div>
                  </div>

                  {/* Develop Areas */}
                  <div className="student-card">
                    <h4 className="profile-section-title" style={{ color: 'var(--accent-blue)', borderColor: '#bfdbfe' }}>Develop areas</h4>
                    <div className="profile-tags-container">
                      <span className="profile-pill blue">System design at scale</span>
                      <span className="profile-pill blue">Cloud / DevOps depth</span>
                      <span className="profile-pill blue">Stakeholder communication</span>
                    </div>
                  </div>

                </div>

                {/* Certifications & Badges */}
                <div className="student-card">
                  <h4 className="profile-section-title">Certifications & Badges</h4>
                  <div className="profile-tags-container">
                    <span className="profile-pill badge">Clean Coder</span>
                    <span className="profile-pill badge">Incident Responder</span>
                    <span className="profile-pill badge">Code Reviewer</span>
                    <span className="profile-pill badge">System Designer</span>
                    <span className="profile-pill badge highlight">AWS Cloud Practitioner</span>
                    <span className="profile-pill badge">Git Pro</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* SKILL GAP TAB */}
        {activeTab === 'skillgap' && (
          <div className="student-tab-panel">
            <div className="skillgap-header-row">
              <div className="student-page-title-area">
                <h1 className="student-page-title">Skill Gap Assessment</h1>
                <p className="student-page-subtitle">Self-rate each competency. We'll build your strengths, gaps, and a training plan.</p>
              </div>
              <button className="skillgap-reset-btn" onClick={handleResetRatings}>Reset answers</button>
            </div>

            {/* Assessment mini cards */}
            <div className="skillgap-summary-row">
              
              {/* Composite Score */}
              <div className="skillgap-summary-card">
                <div className="label-row">
                  <span className="label">Overall Readiness</span>
                  <span className="dot" style={{ backgroundColor: 'var(--accent-blue)' }}></span>
                </div>
                <h3 className="val">{overallReadiness}%</h3>
                <p className="desc">Composite from self-rating</p>
              </div>

              {/* Strengths count */}
              <div className="skillgap-summary-card">
                <div className="label-row">
                  <span className="label">Strengths</span>
                  <span className="dot" style={{ backgroundColor: 'var(--accent-green)' }}></span>
                </div>
                <h3 className="val">{strengthsCount}</h3>
                <p className="desc">Rated High by student</p>
              </div>

              {/* Gaps count */}
              <div className="skillgap-summary-card">
                <div className="label-row">
                  <span className="label">Gaps to Close</span>
                  <span className="dot" style={{ backgroundColor: 'var(--accent-yellow)' }}></span>
                </div>
                <h3 className="val">{gapsCount}</h3>
                <p className="desc">Rated Low by student</p>
              </div>

              {/* Tracked count */}
              <div className="skillgap-summary-card">
                <div className="label-row">
                  <span className="label">Competencies</span>
                  <span className="dot" style={{ backgroundColor: 'var(--accent-teal)' }}></span>
                </div>
                <h3 className="val">6</h3>
                <p className="desc">Tracked in this assessment</p>
              </div>

            </div>

            {/* Main questionnaire & Radar split grid */}
            <div className="skillgap-body-grid">
              
              {/* Question list */}
              <div className="student-card skillgap-assessment-card">
                <div className="skillgap-rating-header">
                  <h4 className="skillgap-card-title">Rating questions</h4>
                  <span className="skillgap-scale-legend">Scale: Low — Medium — High</span>
                </div>

                {/* 1. Process Map */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">Process Map</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: ratings.processMap === 'high' ? '#d1fae5' : ratings.processMap === 'low' ? '#fee2e2' : '#fef3c7',
                      color: ratings.processMap === 'high' ? '#065f46' : ratings.processMap === 'low' ? '#b91c1c' : '#d97706',
                    }}>{ratings.processMap}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">I can draw an end-to-end process map for an unfamiliar workflow.</span>
                      <div className="skillgap-btn-group">
                        <button className={`skillgap-rate-btn ${ratings.processMap === 'low' ? 'active' : ''}`} onClick={() => handleRate('processMap', 'low')}>Low</button>
                        <button className={`skillgap-rate-btn ${ratings.processMap === 'medium' ? 'active' : ''}`} onClick={() => handleRate('processMap', 'medium')}>Medium</button>
                        <button className={`skillgap-rate-btn ${ratings.processMap === 'high' ? 'active' : ''}`} onClick={() => handleRate('processMap', 'high')}>High</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Safety Risk */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">Safety & Quality Risk Identification</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: ratings.safetyRisk === 'high' ? '#d1fae5' : ratings.safetyRisk === 'low' ? '#fee2e2' : '#fef3c7',
                      color: ratings.safetyRisk === 'high' ? '#065f46' : ratings.safetyRisk === 'low' ? '#b91c1c' : '#d97706',
                    }}>{ratings.safetyRisk}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">I can classify quality and security risks in a system by severity and impact likelihood.</span>
                      <div className="skillgap-btn-group">
                        <button className={`skillgap-rate-btn ${ratings.safetyRisk === 'low' ? 'active' : ''}`} onClick={() => handleRate('safetyRisk', 'low')}>Low</button>
                        <button className={`skillgap-rate-btn ${ratings.safetyRisk === 'medium' ? 'active' : ''}`} onClick={() => handleRate('safetyRisk', 'medium')}>Medium</button>
                        <button className={`skillgap-rate-btn ${ratings.safetyRisk === 'high' ? 'active' : ''}`} onClick={() => handleRate('safetyRisk', 'high')}>High</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. RCA */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">Root Cause Analysis (RCA)</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: ratings.rca === 'high' ? '#d1fae5' : ratings.rca === 'low' ? '#fee2e2' : '#fef3c7',
                      color: ratings.rca === 'high' ? '#065f46' : ratings.rca === 'low' ? '#b91c1c' : '#d97706',
                    }}>{ratings.rca}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">I can run structured 5-Why and fishbone reviews to trace back production incident bugs.</span>
                      <div className="skillgap-btn-group">
                        <button className={`skillgap-rate-btn ${ratings.rca === 'low' ? 'active' : ''}`} onClick={() => handleRate('rca', 'low')}>Low</button>
                        <button className={`skillgap-rate-btn ${ratings.rca === 'medium' ? 'active' : ''}`} onClick={() => handleRate('rca', 'medium')}>Medium</button>
                        <button className={`skillgap-rate-btn ${ratings.rca === 'high' ? 'active' : ''}`} onClick={() => handleRate('rca', 'high')}>High</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Traceability */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">Traceability</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: ratings.traceability === 'high' ? '#d1fae5' : ratings.traceability === 'low' ? '#fee2e2' : '#fef3c7',
                      color: ratings.traceability === 'high' ? '#065f46' : ratings.traceability === 'low' ? '#b91c1c' : '#d97706',
                    }}>{ratings.traceability}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">I keep clean linkage matrices connecting requirements, code commits, and testing.</span>
                      <div className="skillgap-btn-group">
                        <button className={`skillgap-rate-btn ${ratings.traceability === 'low' ? 'active' : ''}`} onClick={() => handleRate('traceability', 'low')}>Low</button>
                        <button className={`skillgap-rate-btn ${ratings.traceability === 'medium' ? 'active' : ''}`} onClick={() => handleRate('traceability', 'medium')}>Medium</button>
                        <button className={`skillgap-rate-btn ${ratings.traceability === 'high' ? 'active' : ''}`} onClick={() => handleRate('traceability', 'high')}>High</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Technical Memo */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">Technical Memo</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: ratings.memo === 'high' ? '#d1fae5' : ratings.memo === 'low' ? '#fee2e2' : '#fef3c7',
                      color: ratings.memo === 'high' ? '#065f46' : ratings.memo === 'low' ? '#b91c1c' : '#d97706',
                    }}>{ratings.memo}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">I can write a structured, data-driven post-mortem or incident report RFC.</span>
                      <div className="skillgap-btn-group">
                        <button className={`skillgap-rate-btn ${ratings.memo === 'low' ? 'active' : ''}`} onClick={() => handleRate('memo', 'low')}>Low</button>
                        <button className={`skillgap-rate-btn ${ratings.memo === 'medium' ? 'active' : ''}`} onClick={() => handleRate('memo', 'medium')}>Medium</button>
                        <button className={`skillgap-rate-btn ${ratings.memo === 'high' ? 'active' : ''}`} onClick={() => handleRate('memo', 'high')}>High</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 6. Responsible AI */}
                <div className="skillgap-question-section">
                  <div className="skillgap-question-header">
                    <h5 className="skillgap-question-title">Responsible AI Usage</h5>
                    <span className="skillgap-level-indicator" style={{
                      backgroundColor: ratings.responsibleAi === 'high' ? '#d1fae5' : ratings.responsibleAi === 'low' ? '#fee2e2' : '#fef3c7',
                      color: ratings.responsibleAi === 'high' ? '#065f46' : ratings.responsibleAi === 'low' ? '#b91c1c' : '#d97706',
                    }}>{ratings.responsibleAi}</span>
                  </div>
                  <div className="skillgap-question-items">
                    <div className="skillgap-item-row">
                      <span className="skillgap-item-text">I audit all generated code outputs and avoid sharing sensitive API environment variables.</span>
                      <div className="skillgap-btn-group">
                        <button className={`skillgap-rate-btn ${ratings.responsibleAi === 'low' ? 'active' : ''}`} onClick={() => handleRate('responsibleAi', 'low')}>Low</button>
                        <button className={`skillgap-rate-btn ${ratings.responsibleAi === 'medium' ? 'active' : ''}`} onClick={() => handleRate('responsibleAi', 'medium')}>Medium</button>
                        <button className={`skillgap-rate-btn ${ratings.responsibleAi === 'high' ? 'active' : ''}`} onClick={() => handleRate('responsibleAi', 'high')}>High</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Visual Radar Card */}
              <div className="student-card skillgap-radar-card">
                <h4 className="skillgap-card-title">Skill-gap radar</h4>
                
                <div className="skillgap-radar-container">
                  <svg viewBox="0 0 300 300" width="100%" height="100%" style={{ overflow: 'visible' }}>
                    
                    {/* Background Grids (Low scale) */}
                    <polygon points="150,115 180,132 180,167 150,185 120,167 120,132" fill="none" stroke="#f1f5f9" strokeWidth="1.5" />
                    {/* Medium Scale Grid */}
                    <polygon points="150,82 208,115 208,183 150,217 91,183 91,115" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
                    {/* High Scale Grid */}
                    <polygon points="150,50 236,100 236,200 150,250 63,200 63,100" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />

                    {/* Outer Label Lines */}
                    <line x1="150" y1="150" x2="150" y2="50" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="236" y2="100" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="236" y2="200" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="150" y2="250" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="63" y2="200" stroke="#cbd5e1" strokeDasharray="3 3" />
                    <line x1="150" y1="150" x2="63" y2="100" stroke="#cbd5e1" strokeDasharray="3 3" />

                    {/* Labels text */}
                    <text x="150" y="38" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">Process</text>
                    <text x="246" y="96" textAnchor="start" fontSize="10" fontWeight="600" fill="#64748b">Safety/Quality</text>
                    <text x="246" y="208" textAnchor="start" fontSize="10" fontWeight="600" fill="#64748b">RCA</text>
                    <text x="150" y="265" textAnchor="middle" fontSize="10" fontWeight="600" fill="#64748b">Traceability</text>
                    <text x="54" y="208" textAnchor="end" fontSize="10" fontWeight="600" fill="#64748b">Tech Memo</text>
                    <text x="54" y="96" textAnchor="end" fontSize="10" fontWeight="600" fill="#64748b">Responsible AI</text>

                    {/* Active dynamic polygon representing student level */}
                    <polygon
                      className="radar-polygon-active"
                      points={calculateRadarPoints()}
                      fill="rgba(20, 184, 166, 0.25)"
                      stroke="var(--accent-teal)"
                      strokeWidth="2.5"
                    />

                  </svg>
                </div>

                <p className="skillgap-radar-legend">Blue/Teal — your current level. Outer borders — target proficiency</p>
              </div>

            </div>

            {/* Strengths & Weaknesses Feedback */}
            <div className="skillgap-bottom-grid">
              
              {/* Strengths list */}
              <div className="student-card skillgap-feedback-card">
                <h4 className="skillgap-feedback-title strengths">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Strengths</span>
                </h4>
                {strengthsCount === 0 ? (
                  <p className="skillgap-feedback-empty">No High ratings yet — keep practicing.</p>
                ) : (
                  <ul className="skillgap-feedback-list">
                    {ratings.processMap === 'high' && <li><strong>Process Map:</strong> Capable of mapping and optimizing workflows.</li>}
                    {ratings.safetyRisk === 'high' && <li><strong>Safety & Risk:</strong> Skilled at isolating critical system threats.</li>}
                    {ratings.rca === 'high' && <li><strong>RCA:</strong> Mastery of incident debug and 5-Why root-cause flows.</li>}
                    {ratings.traceability === 'high' && <li><strong>Traceability:</strong> Rigidly links features, code reviews, and automated builds.</li>}
                    {ratings.memo === 'high' && <li><strong>Technical Memo:</strong> Strong developer-advocacy post-mortem documentation skill.</li>}
                    {ratings.responsibleAi === 'high' && <li><strong>Responsible AI:</strong> Proactively inspects prompts and LLM security constraints.</li>}
                  </ul>
                )}
              </div>

              {/* Weaknesses list */}
              <div className="student-card skillgap-feedback-card">
                <h4 className="skillgap-feedback-title weaknesses">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  <span>Weaknesses</span>
                </h4>
                {gapsCount === 0 ? (
                  <p className="skillgap-feedback-empty">No Low ratings — nice work!</p>
                ) : (
                  <ul className="skillgap-feedback-list">
                    {ratings.processMap === 'low' && <li><strong>Process Map:</strong> Struggle to visualize architecture flows. Recommendation: Workshop: Mapping a production line using SIPOC + swimlane diagrams.</li>}
                    {ratings.safetyRisk === 'low' && <li><strong>Safety & Risk:</strong> Need guidelines to rank vulnerability scores. Recommendation: Module: FMEA + 5-Why for a packaging-line near-miss case.</li>}
                    {ratings.rca === 'low' && <li><strong>RCA:</strong> Easily treat symptoms rather than root bugs. Recommendation: Scenario S-102 — Database pool exhaustion: build the full RCA tree.</li>}
                    {ratings.traceability === 'low' && <li><strong>Traceability:</strong> Lacks clean traceability indexes in test scripts. Recommendation: Lab: Build a traceability matrix linking requirements &rarr; tests &rarr; defects.</li>}
                    {ratings.memo === 'low' && <li><strong>Technical Memo:</strong> Need to clarify writing style for non-tech audiences. Recommendation: Practice: Draft a post-mortem memo for the Checkout API outage.</li>}
                    {ratings.responsibleAi === 'low' && <li><strong>Responsible AI:</strong> Prone to blindly copying third-party chatbot answers. Recommendation: Quiz: Responsible AI checklist + redaction practice on sample prompts.</li>}
                  </ul>
                )}
              </div>

            </div>

            {/* Recommended Training Courses */}
            <div className="student-card skillgap-training-card">
              <h4 className="skillgap-card-title" style={{ marginBottom: '20px' }}>Recommended training</h4>
              
              <div className="skillgap-table-wrapper">
                <table className="skillgap-table">
                  <thead>
                    <tr>
                      <th>Competency</th>
                      <th>Current</th>
                      <th>Priority</th>
                      <th>What to Train Next</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                    <tr>
                      <td className="skillgap-table-competency">Process Map</td>
                      <td><span className={`skillgap-table-level ${ratings.processMap}`}>{ratings.processMap}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.processMap === 'high' ? 'low' : ratings.processMap === 'low' ? 'high' : 'medium'}`}>{ratings.processMap === 'high' ? 'low' : ratings.processMap === 'low' ? 'high' : 'medium'}</span></td>
                      <td>Workshop: Mapping a production line using SIPOC + swimlane diagrams.</td>
                    </tr>

                    <tr>
                      <td className="skillgap-table-competency">Safety & Quality Risk Identification</td>
                      <td><span className={`skillgap-table-level ${ratings.safetyRisk}`}>{ratings.safetyRisk}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.safetyRisk === 'high' ? 'low' : ratings.safetyRisk === 'low' ? 'high' : 'medium'}`}>{ratings.safetyRisk === 'high' ? 'low' : ratings.safetyRisk === 'low' ? 'high' : 'medium'}</span></td>
                      <td>Module: FMEA + 5-Why for a packaging-line near-miss case.</td>
                    </tr>

                    <tr>
                      <td className="skillgap-table-competency">Root Cause Analysis (RCA)</td>
                      <td><span className={`skillgap-table-level ${ratings.rca}`}>{ratings.rca}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.rca === 'high' ? 'low' : ratings.rca === 'low' ? 'high' : 'medium'}`}>{ratings.rca === 'high' ? 'low' : ratings.rca === 'low' ? 'high' : 'medium'}</span></td>
                      <td>Scenario S-102 — Database pool exhaustion: build the full RCA tree.</td>
                    </tr>

                    <tr>
                      <td className="skillgap-table-competency">Traceability</td>
                      <td><span className={`skillgap-table-level ${ratings.traceability}`}>{ratings.traceability}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.traceability === 'high' ? 'low' : ratings.traceability === 'low' ? 'high' : 'medium'}`}>{ratings.traceability === 'high' ? 'low' : ratings.traceability === 'low' ? 'high' : 'medium'}</span></td>
                      <td>Lab: Build a traceability matrix linking requirements &rarr; tests &rarr; defects.</td>
                    </tr>

                    <tr>
                      <td className="skillgap-table-competency">Technical Memo</td>
                      <td><span className={`skillgap-table-level ${ratings.memo}`}>{ratings.memo}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.memo === 'high' ? 'low' : ratings.memo === 'low' ? 'high' : 'medium'}`}>{ratings.memo === 'high' ? 'low' : ratings.memo === 'low' ? 'high' : 'medium'}</span></td>
                      <td>Practice: Draft a post-mortem memo for the Checkout API outage.</td>
                    </tr>

                    <tr>
                      <td className="skillgap-table-competency">Responsible AI Usage</td>
                      <td><span className={`skillgap-table-level ${ratings.responsibleAi}`}>{ratings.responsibleAi}</span></td>
                      <td><span className={`skillgap-table-level ${ratings.responsibleAi === 'high' ? 'low' : ratings.responsibleAi === 'low' ? 'high' : 'medium'}`}>{ratings.responsibleAi === 'high' ? 'low' : ratings.responsibleAi === 'low' ? 'high' : 'medium'}</span></td>
                      <td>Quiz: Responsible AI checklist + redaction practice on sample prompts.</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* SCENARIO SIMULATOR TAB */}
        {activeTab === 'simulator' && (
          <div className="student-tab-panel">
            <div className="student-page-header">
              <div className="student-page-title-area">
                <h1 className="student-page-title">Scenario Simulator</h1>
                <p className="student-page-subtitle">Test your triage skills under fire in isolated staging pods.</p>
              </div>
            </div>

            {/* If no scenario is running, show selector cards */}
            {!activeScenario ? (
              <div className="simulator-layout">
                <div className="simulator-scenarios-grid">
                  {scenarios.map((sc) => (
                    <div className="simulator-scenario-card" key={sc.id}>
                      <div>
                        <span className="simulator-sc-code">{sc.id} · {sc.difficulty}</span>
                        <h4 className="simulator-sc-title">{sc.title}</h4>
                        <p className="simulator-sc-desc">{sc.desc}</p>
                      </div>
                      <button className="simulator-sc-launch-btn" onClick={() => handleLaunchScenario(sc)}>
                        <span>Start Simulation</span>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Active simulation console panel
              <div className="simulator-layout">
                <div className="simulator-console">
                  
                  {/* Left Column: Staging Pod Terminal */}
                  <div className="simulator-terminal-column">
                    <div className="simulator-terminal-card">
                      <div className="simulator-terminal-header">
                        <div className="simulator-terminal-dots">
                          <span className="simulator-terminal-dot red"></span>
                          <span className="simulator-terminal-dot yellow"></span>
                          <span className="simulator-terminal-dot green"></span>
                        </div>
                        <span className="simulator-terminal-title">Staging Shell · {activeScenario.id}</span>
                      </div>

                      <div className="simulator-terminal-body">
                        {terminalLogs.map((log, index) => {
                          let className = 'simulator-terminal-line';
                          if (log.startsWith('$ ')) className += ' command';
                          else if (log.includes('[ERR]') || log.includes('failed')) className += ' error';
                          else if (log.includes('[SUCCESS]') || log.includes('[PASS]')) className += ' success';
                          return (
                            <div className={className} key={index}>
                              {log}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Decision Branching Choices */}
                    <div className="simulator-choices-container">
                      <span className="simulator-choice-title">Select Diagnostic Strategy:</span>
                      
                      {!simCompleted ? (
                        choicesForStep[stepIndex] && choicesForStep[stepIndex].map((ch, idx) => (
                          <button
                            className="simulator-choice-btn"
                            key={idx}
                            onClick={ch.action}
                          >
                            {ch.text}
                          </button>
                        ))
                      ) : (
                        <div className="student-card" style={{ padding: '16px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', textAlign: 'center' }}>
                          <h4 style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-heading)' }}>🎉 Scenario Successfully Cleared!</h4>
                          <p style={{ margin: 0, fontSize: '13px' }}>Your evidence memo has been compiled and submitted to Emily Vance for validation.</p>
                          <button className="student-header-btn" style={{ marginTop: '12px' }} onClick={() => {
                            setActiveScenario(null);
                            setActiveTab('portfolio');
                          }}>Go to Evidence Portfolio</button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: AI RCA Coach Chat */}
                  <div className="simulator-chat-column">
                    <div className="student-card simulator-chat-card">
                      
                      <div className="simulator-chat-header">
                        <div className="simulator-chat-coach-pic">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
                            <path d="M17 16a5 5 0 0 1-10 0v-2h10v2z" />
                            <circle cx="12" cy="7" r="1" fill="currentColor" />
                          </svg>
                        </div>
                        <div className="simulator-chat-coach-info">
                          <h4 className="simulator-chat-coach-name">AI Incident Coach</h4>
                          <span className="simulator-chat-coach-status">● Live SRE Coach</span>
                        </div>
                      </div>

                      <div className="simulator-chat-body">
                        {chatMessages.map((msg, idx) => (
                          <div className={`simulator-chat-bubble ${msg.sender}`} key={idx}>
                            <p>{msg.text}</p>
                          </div>
                        ))}
                      </div>

                      <div className="simulator-chat-footer">
                        <form className="simulator-chat-input-wrapper" onSubmit={handleSendChat}>
                          <input
                            type="text"
                            className="simulator-chat-input"
                            placeholder="Type a message to the AI coach..."
                            value={inputVal}
                            onChange={(e) => setInputVal(e.target.value)}
                          />
                          <button type="submit" className="simulator-chat-send-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <line x1="22" y1="2" x2="11" y2="13"></line>
                              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                          </button>
                        </form>
                      </div>

                    </div>
                  </div>

                </div>

                {/* Console Footer */}
                <div className="simulator-console-footer">
                  <button className="simulator-quit-btn" onClick={() => setActiveScenario(null)}>
                    Quit Simulation
                  </button>
                  <span style={{ fontSize: '12px', color: '#94a3b8' }}>Staging Pod: deployment-coupon-verify-4491-db-slot</span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* EVIDENCE PORTFOLIO TAB */}
        {activeTab === 'portfolio' && (
          <div className="student-tab-panel">
            <div className="student-page-header">
              <div className="student-page-title-area">
                <h1 className="student-page-title">Evidence Portfolio</h1>
                <p className="student-page-subtitle">Every solved scenario becomes verified proof recruiters and mentors can trust.</p>
              </div>
            </div>

            <div className="portfolio-intro-row">
              <span style={{ fontSize: '14px', color: 'var(--neutral-text)' }}>Share this portfolio with hiring companies to prove day-one readiness.</span>
              <button className="portfolio-share-btn" onClick={() => alert('Recruiter access link copied to clipboard!')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
                <span>Share Portfolio</span>
              </button>
            </div>

            <div className="portfolio-list">
              {portfolioItems.map((item) => (
                <div className="portfolio-item-card" key={item.id}>
                  
                  {/* Item Header */}
                  <div className="portfolio-item-header">
                    <div className="portfolio-item-title-col">
                      <div className="portfolio-item-meta">
                        <span className="portfolio-item-tag">{item.id}</span>
                        <span>·</span>
                        <span>Solved scenario {item.scenarioId}</span>
                        <span>·</span>
                        <span>{item.topic}</span>
                      </div>
                      <h3 className="portfolio-item-title">{item.title}</h3>
                    </div>

                    <div className="portfolio-item-badges">
                      <span className="portfolio-status-badge verified">{item.status}</span>
                      <span className="portfolio-score-badge">{item.score} Score</span>
                    </div>
                  </div>

                  {/* Details Split Columns */}
                  <div className="portfolio-item-details">
                    
                    {/* Left details */}
                    <div>
                      <p className="portfolio-item-desc">{item.desc}</p>
                      <div className="portfolio-evidence-log">
                        <h5 className="portfolio-log-title">Verified Evidence Logs</h5>
                        <ul className="portfolio-log-list">
                          {item.logs.map((log, index) => (
                            <li key={index}>{log}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right Mentor Notes */}
                    <div className="portfolio-mentor-notes">
                      <div>
                        <h5 className="portfolio-mentor-title">Mentor Review Feedback</h5>
                        <p className="portfolio-mentor-text">"{item.mentor}"</p>
                      </div>
                      <span className="portfolio-mentor-author">— {item.mentorName}</span>
                    </div>

                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
