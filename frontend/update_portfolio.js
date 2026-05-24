import fs from 'fs';
const enPath = './src/i18n/en.json';
const thPath = './src/i18n/th.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const th = JSON.parse(fs.readFileSync(thPath, 'utf8'));

const newKeys = {
  "portfolio.title": ["Evidence Portfolio", "แฟ้มสะสมผลงาน"],
  "portfolio.subtitle": ["Every solved scenario becomes verified proof recruiters and mentors can trust.", "ทุกสถานการณ์ที่แก้ไขจะเป็นเครื่องพิสูจน์ที่ได้รับการตรวจสอบซึ่งผู้สรรหาบุคลากรและเมนเทอร์เชื่อถือได้"],
  "portfolio.linkCopied": ["Recruiter access link copied to clipboard!", "คัดลอกลิงก์การเข้าถึงสำหรับผู้สรรหาบุคลากรลงในคลิปบอร์ดแล้ว!"],
  "portfolio.share": ["Share portfolio", "แชร์แฟ้มสะสมผลงาน"],
  "portfolio.artifacts": ["ARTIFACTS", "อาร์ติแฟกต์"],
  "portfolio.artifactsCompleted": ["3 completed", "เสร็จสิ้นแล้ว 3 รายการ"],
  "portfolio.totalPoints": ["TOTAL POINTS", "คะแนนรวม"],
  "portfolio.acrossAll": ["Across all evidence", "จากหลักฐานทั้งหมด"],
  "portfolio.mentorReviews": ["MENTOR REVIEWS", "การตรวจสอบจากเมนเทอร์"],
  "portfolio.last30Days": ["Last 30 days", "30 วันที่ผ่านมา"],
  "portfolio.readiness": ["READINESS", "ความพร้อม"],
  "portfolio.jobReadyScore": ["Job-ready score", "คะแนนความพร้อมในการทำงาน"],
  "portfolio.evidenceList": ["Evidence list", "รายการหลักฐาน"],
  "portfolio.evidenceListDesc": ["All artifacts collected through scenarios and coaching.", "อาร์ติแฟกต์ทั้งหมดที่รวบรวมผ่านสถานการณ์และการฝึกสอน"],
  "portfolio.readinessScore": ["READINESS SCORE", "คะแนนความพร้อม"],
  "portfolio.readinessDesc": ["Weighted competency index showing your target match against standard backend junior roles.", "ดัชนีความสามารถแบบถ่วงน้ำหนักที่แสดงความสอดคล้องกับบทบาทจูเนียร์ Backend มาตรฐาน"],
  "portfolio.completed": ["Completed", "เสร็จสมบูรณ์"],
  "portfolio.needsReview": ["Needs review", "รอการตรวจสอบ"],
  "portfolio.needsRevision": ["Needs revision", "ต้องแก้ไข"],
  "portfolio.submitReview": ["Submit for review", "ส่งเพื่อตรวจสอบ"],
  "portfolio.submitReviewDesc": ["Send your completed evidence portfolio to your course mentor for final assessment.", "ส่งแฟ้มสะสมผลงานที่เสร็จสมบูรณ์ของคุณไปยังเมนเทอร์ประจำหลักสูตรเพื่อประเมินผลขั้นสุดท้าย"],
  "portfolio.submitPortfolio": ["Submit portfolio", "ส่งแฟ้มสะสมผลงาน"],
  "portfolio.submitNotification": ["You'll be notified when reviews are completed.", "คุณจะได้รับการแจ้งเตือนเมื่อการตรวจสอบเสร็จสิ้น"],
  "portfolio.mentorFeedback": ["Mentor Feedback", "ข้อเสนอแนะจากเมนเทอร์"],
  "portfolio.mentorFeedbackDesc": ["Feedback and comments from industry mentors on your submitted evidence.", "ข้อเสนอแนะและความคิดเห็นจากเมนเทอร์ในอุตสาหกรรมเกี่ยวกับหลักฐานที่คุณส่งมา"],
  "portfolio.solvedScenario": ["Solved Scenario ", "สถานการณ์ที่แก้ไขแล้ว "],
  "portfolio.score": [" Score", " คะแนน"],
  "portfolio.returnApp": ["Return to App Dashboard", "กลับสู่แดชบอร์ดแอป"],
  "Completed": ["Completed", "เสร็จสมบูรณ์"],
  "Needs review": ["Needs review", "รอการตรวจสอบ"],
  "Needs revision": ["Needs revision", "ต้องแก้ไข"]
};

for (const [key, [enStr, thStr]] of Object.entries(newKeys)) {
  en[key] = enStr;
  th[key] = thStr;
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(thPath, JSON.stringify(th, null, 2));

let content = fs.readFileSync('./src/screen/Student/StudentEvidencePortfolio.jsx', 'utf8');

// Add import
content = content.replace("import React from 'react';", "import React from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';");

// Add hook
content = content.replace(/export default function StudentEvidencePortfolio\((.*?)\) \{/, "export default function StudentEvidencePortfolio($1) {\n  const { t } = useLanguage();");

const replacements = [
  ["<h1 className=\"student-page-title\">Evidence Portfolio</h1>", "<h1 className=\"student-page-title\">{t('portfolio.title')}</h1>"],
  ["<p className=\"student-page-subtitle\">Every solved scenario becomes verified proof recruiters and mentors can trust.</p>", "<p className=\"student-page-subtitle\">{t('portfolio.subtitle')}</p>"],
  ["onClick={() => alert('Recruiter access link copied to clipboard!')}", "onClick={() => alert(t('portfolio.linkCopied'))}"],
  ["<span>Share portfolio</span>", "<span>{t('portfolio.share')}</span>"],
  ["<span className=\"portfolio-stat-label\">ARTIFACTS</span>", "<span className=\"portfolio-stat-label\">{t('portfolio.artifacts')}</span>"],
  ["<p className=\"portfolio-stat-subtext\">3 completed</p>", "<p className=\"portfolio-stat-subtext\">{t('portfolio.artifactsCompleted')}</p>"],
  ["<span className=\"portfolio-stat-label\">TOTAL POINTS</span>", "<span className=\"portfolio-stat-label\">{t('portfolio.totalPoints')}</span>"],
  ["<p className=\"portfolio-stat-subtext\">Across all evidence</p>", "<p className=\"portfolio-stat-subtext\">{t('portfolio.acrossAll')}</p>"],
  ["<span className=\"portfolio-stat-label\">MENTOR REVIEWS</span>", "<span className=\"portfolio-stat-label\">{t('portfolio.mentorReviews')}</span>"],
  ["<p className=\"portfolio-stat-subtext\">Last 30 days</p>", "<p className=\"portfolio-stat-subtext\">{t('portfolio.last30Days')}</p>"],
  ["<span className=\"portfolio-stat-label\">READINESS</span>", "<span className=\"portfolio-stat-label\">{t('portfolio.readiness')}</span>"],
  ["<p className=\"portfolio-stat-subtext\">Job-ready score</p>", "<p className=\"portfolio-stat-subtext\">{t('portfolio.jobReadyScore')}</p>"],
  ["<h3 className=\"portfolio-card-title\">Evidence list</h3>", "<h3 className=\"portfolio-card-title\">{t('portfolio.evidenceList')}</h3>"],
  ["<p className=\"portfolio-card-subtitle\">All artifacts collected through scenarios and coaching.</p>", "<p className=\"portfolio-card-subtitle\">{t('portfolio.evidenceListDesc')}</p>"],
  ["<span className={`portfolio-evidence-badge ${badgeClass}`}>{item.status}</span>", "<span className={`portfolio-evidence-badge ${badgeClass}`}>{t(item.status)}</span>"],
  ["<span className=\"portfolio-card-mini-label\">READINESS SCORE</span>", "<span className=\"portfolio-card-mini-label\">{t('portfolio.readinessScore')}</span>"],
  ["<p className=\"portfolio-readiness-desc\">", "<p className=\"portfolio-readiness-desc\">\n                    {t('portfolio.readinessDesc')} </p>\n                  {/* "], // hack to comment out the old string
  ["roles.\n                  </p>", "roles.\n                  */}  "],
  ["<span className=\"portfolio-metric-name\">Completed</span>", "<span className=\"portfolio-metric-name\">{t('portfolio.completed')}</span>"],
  ["<span className=\"portfolio-metric-name\">Needs review</span>", "<span className=\"portfolio-metric-name\">{t('portfolio.needsReview')}</span>"],
  ["<span className=\"portfolio-metric-name\">Needs revision</span>", "<span className=\"portfolio-metric-name\">{t('portfolio.needsRevision')}</span>"],
  ["<h4 className=\"portfolio-submit-title\">Submit for review</h4>", "<h4 className=\"portfolio-submit-title\">{t('portfolio.submitReview')}</h4>"],
  ["<p className=\"portfolio-submit-desc\">", "<p className=\"portfolio-submit-desc\">\n                    {t('portfolio.submitReviewDesc')} </p>\n                  {/*"],
  ["assessment.\n                  </p>", "assessment.\n                  */} "],
  ["<span>Submit portfolio</span>", "<span>{t('portfolio.submitPortfolio')}</span>"],
  ["<span className=\"portfolio-submit-notification\">", "<span className=\"portfolio-submit-notification\">\n                    {t('portfolio.submitNotification')} </span>\n                  {/*"],
  ["completed.\n                  </span>", "completed.\n                  */} "],
  ["<h2 className=\"portfolio-section-title\">Mentor Feedback</h2>", "<h2 className=\"portfolio-section-title\">{t('portfolio.mentorFeedback')}</h2>"],
  ["<p className=\"portfolio-section-subtitle\">Feedback and comments from industry mentors on your submitted evidence.</p>", "<p className=\"portfolio-section-subtitle\">{t('portfolio.mentorFeedbackDesc')}</p>"],
  ["<span className=\"portfolio-feedback-scenario\">Solved Scenario {item.scenarioId}</span>", "<span className=\"portfolio-feedback-scenario\">{t('portfolio.solvedScenario')}{item.scenarioId}</span>"],
  ["<div className=\"portfolio-feedback-score\">{item.score} Score</div>", "<div className=\"portfolio-feedback-score\">{item.score}{t('portfolio.score')}</div>"],
  ["<span>Return to App Dashboard</span>", "<span>{t('portfolio.returnApp')}</span>"]
];

for (const [from, to] of replacements) {
  content = content.replace(from, to);
}

// Ensure the block comment hack does not leave any unmatched comments
// For example:
// <p className="portfolio-readiness-desc">
//                     {t('portfolio.readinessDesc')} </p>
//                   {/* 
//                     Weighted competency index showing your target match against standard backend junior roles.
//                   */}  

content = content.replace(
  /<p className="portfolio-readiness-desc">\s*Weighted competency index showing your target match against standard backend junior roles\.\s*<\/p>/g,
  `<p className="portfolio-readiness-desc">\n                    {t('portfolio.readinessDesc')}\n                  </p>`
);

content = content.replace(
  /<p className="portfolio-submit-desc">\s*Send your completed evidence portfolio to your course mentor for final assessment\.\s*<\/p>/g,
  `<p className="portfolio-submit-desc">\n                    {t('portfolio.submitReviewDesc')}\n                  </p>`
);

content = content.replace(
  /<span className="portfolio-submit-notification">\s*You'll be notified when reviews are completed\.\s*<\/span>/g,
  `<span className="portfolio-submit-notification">\n                    {t('portfolio.submitNotification')}\n                  </span>`
);

fs.writeFileSync('./src/screen/Student/StudentEvidencePortfolio.jsx', content);
console.log('done');
