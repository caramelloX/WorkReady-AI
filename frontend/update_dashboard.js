import fs from 'fs';

let content = fs.readFileSync('./src/screen/Student/StudentDashboard.jsx', 'utf8');

// Add import
content = content.replace("import React from 'react';", "import React from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';");

// Add hook
content = content.replace(/export default function StudentDashboard\((.*?)\) \{/, "export default function StudentDashboard($1) {\n  const { t } = useLanguage();");

// Replace skillMapping
content = content.replace(
  /const skillMapping = \{[\s\S]*?\};/,
`const skillMapping = {
    processMap: { title: t('skills.processMap'), weight: '25%' },
    safetyRisk: { title: t('skills.safetyRisk'), weight: '20%' },
    rca: { title: t('skills.rca'), weight: '15%' },
    traceability: { title: t('skills.traceability'), weight: '20%' },
    memo: { title: t('skills.memo'), weight: '15%' },
    responsibleAi: { title: t('skills.responsibleAi'), weight: '5%' }
  };`
);

content = content.replace(
  /const assessmentMapping = \{[\s\S]*?\};/,
`const assessmentMapping = {
    processMap: t('skills.processMapAss'),
    safetyRisk: t('skills.safetyRiskAss'),
    rca: t('skills.rcaAss'),
    traceability: t('skills.traceabilityAss'),
    memo: t('skills.memoAss'),
    responsibleAi: t('skills.responsibleAiAss')
  };`
);

const replacements = [
  ["<h1>Welcome back, {firstName}</h1>", "<h1>{t('dashboard.welcome')}, {firstName}</h1>"],
  ["<p>Here's where you stand today, and what to tackle next.</p>", "<p>{t('dashboard.subtitle')}</p>"],
  ["<span>Continue training</span>", "<span>{t('dashboard.continueTraining')}</span>"],
  ["<span className=\"student-cohort-pill\">· Cohort 2026 — {targetTrack} Track</span>", "<span className=\"student-cohort-pill\">· {t('dashboard.cohortPrefix')}{targetTrack}{t('dashboard.cohortSuffix')}</span>"],
  ["<span className=\"student-info-column-label\">MAJOR</span>", "<span className=\"student-info-column-label\">{t('dashboard.major')}</span>"],
  ["<span className=\"student-info-column-label\">OCCUPATION GOAL</span>", "<span className=\"student-info-column-label\">{t('dashboard.occupationGoal')}</span>"],
  ["<p className=\"student-info-column-subtitle\">Targeting {targetIndustry}</p>", "<p className=\"student-info-column-subtitle\">{t('dashboard.targeting')}{targetIndustry}</p>"],
  ["<span className=\"student-info-column-label\">GOALS</span>", "<span className=\"student-info-column-label\">{t('dashboard.goals')}</span>"],
  ["<li>Reach Work-Ready Score 85</li>", "<li>{t('dashboard.goal1')}</li>"],
  ["<li>Ship 3 mentor-reviewed memos</li>", "<li>{t('dashboard.goal2')}</li>"],
  ["<li>Land summer internship</li>", "<li>{t('dashboard.goal3')}</li>"],
  ["<h4 className=\"student-sublink-title\">View Portfolio</h4>", "<h4 className=\"student-sublink-title\">{t('dashboard.viewPortfolio')}</h4>"],
  ["<p className=\"student-sublink-subtitle\">9 mentor-reviewed evidence items</p>", "<p className=\"student-sublink-subtitle\">{t('dashboard.portfolioDesc')}</p>"],
  ["<h4 className=\"student-sublink-title\">View Feedback</h4>", "<h4 className=\"student-sublink-title\">{t('dashboard.viewFeedback')}</h4>"],
  ["<p className=\"student-sublink-subtitle\">Mentor + AI coach notes on your work</p>", "<p className=\"student-sublink-subtitle\">{t('dashboard.feedbackDesc')}</p>"],
  ["<h4 className=\"student-sublink-title\">Check Readiness Score</h4>", "<h4 className=\"student-sublink-title\">{t('dashboard.checkReadiness')}</h4>"],
  ["<p className=\"student-sublink-subtitle\">{displayReadiness}/100 against {targetTrack || 'your track'}</p>", "<p className=\"student-sublink-subtitle\">{displayReadiness}{t('dashboard.readinessAgainst')}{targetTrack || t('dashboard.yourTrack')}</p>"],
  ["<span className=\"student-stat-label\">WORK-READY SCORE</span>", "<span className=\"student-stat-label\">{t('dashboard.workReadyScore')}</span>"],
  ["<p className=\"student-stat-comparison\">vs {targetTrack || 'your track'}</p>", "<p className=\"student-stat-comparison\">{t('dashboard.vsTrack')}{targetTrack || t('dashboard.yourTrack')}</p>"],
  ["<span className=\"student-stat-label\">SCENARIOS COMPLETED</span>", "<span className=\"student-stat-label\">{t('dashboard.scenariosCompleted')}</span>"],
  ["<span className=\"student-stat-label\">RCA COACH RATING</span>", "<span className=\"student-stat-label\">{t('dashboard.rcaRating')}</span>"],
  ["<span className=\"student-stat-label\">STREAK</span>", "<span className=\"student-stat-label\">{t('dashboard.streak')}</span>"],
  ["<h3 className=\"breakdown-card-title\">Work-Ready Score breakdown</h3>", "<h3 className=\"breakdown-card-title\">{t('dashboard.breakdownTitle')}</h3>"],
  ["<p className=\"breakdown-card-subtitle\">Weighted coverage of skills required for Backend Software Engineer against your current levels.</p>", "<p className=\"breakdown-card-subtitle\">{t('dashboard.breakdownDesc')}</p>"],
  ["<div className=\"score-gap-label\">Biggest gap: <span className=\"highlight-gap\">{biggestGap}</span></div>", "<div className=\"score-gap-label\">{t('dashboard.biggestGap')}<span className=\"highlight-gap\">{biggestGap}</span></div>"],
  ["Score = &Sigma; (skill coverage &times; occupation weight). Coverage is capped at the role's target per skill.", "{t('dashboard.scoreFormula')}"],
  ["<h3 className=\"panel-title\">Upcoming scenarios</h3>", "<h3 className=\"panel-title\">{t('dashboard.upcomingScenarios')}</h3>"],
  ["<button className=\"panel-link-btn\" onClick={() => setActiveTab('simulator')}>View all</button>", "<button className=\"panel-link-btn\" onClick={() => setActiveTab('simulator')}>{t('dashboard.viewAll')}</button>"],
  ["<span>Open</span>", "<span>{t('dashboard.open')}</span>"],
  ["<h3 className=\"panel-title\">Top skill gaps</h3>", "<h3 className=\"panel-title\">{t('dashboard.topSkillGaps')}</h3>"],
  ["<span>Full assessment</span>", "<span>{t('dashboard.fullAssessment')}</span>"],
  ["<h4 className=\"bottom-card-title\">Badges earned</h4>", "<h4 className=\"bottom-card-title\">{t('dashboard.badgesEarned')}</h4>"],
  ["<span className=\"badge-pill\">Clean Coder</span>", "<span className=\"badge-pill\">{t('dashboard.badge1')}</span>"],
  ["<span className=\"badge-pill\">Incident Responder</span>", "<span className=\"badge-pill\">{t('dashboard.badge2')}</span>"],
  ["<span className=\"badge-pill\">Code Reviewer</span>", "<span className=\"badge-pill\">{t('dashboard.badge3')}</span>"],
  ["<span className=\"badge-pill\">System Designer</span>", "<span className=\"badge-pill\">{t('dashboard.badge4')}</span>"],
  ["<h4 className=\"bottom-card-title\">This week</h4>", "<h4 className=\"bottom-card-title\">{t('dashboard.thisWeek')}</h4>"],
  ["3 scenarios, 2 RCA reviews, 1 memo drafted.", "{t('dashboard.thisWeekDesc')}"],
  ["<h4 className=\"bottom-card-title\">Next mentor sync</h4>", "<h4 className=\"bottom-card-title\">{t('dashboard.nextMentorSync')}</h4>"],
  ["Fri, 12:30 PM with M. Iyer (Staff Engineer, Razorpay).", "{t('dashboard.nextMentorSyncDesc')}"]
];

for (const [from, to] of replacements) {
  content = content.replace(from, to);
}

fs.writeFileSync('./src/screen/Student/StudentDashboard.jsx', content);
console.log('updated dashboard');
