import fs from 'fs';
const enPath = './src/i18n/en.json';
const thPath = './src/i18n/th.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const th = JSON.parse(fs.readFileSync(thPath, 'utf8'));

const newKeys = {
  "profile.title": ["Profile", "โปรไฟล์"],
  "profile.subtitle": ["Your public learner profile — what mentors and recruiters see.", "โปรไฟล์ผู้เรียนสาธารณะของคุณ — สิ่งที่เมนเทอร์และผู้สรรหาบุคลากรเห็น"],
  "profile.openToRoles": ["Open to ", "เปิดรับสำหรับตำแหน่ง "],
  "profile.rolesSuffix": [" roles", ""],
  "profile.educationLevel": ["Education Level", "ระดับการศึกษา"],
  "profile.targetIndustry": ["Target Industry", "อุตสาหกรรมเป้าหมาย"],
  "profile.about": ["About", "เกี่ยวกับฉัน"],
  "profile.aboutDesc": ["Final-year student targeting {0} roles. Active in WorkReady AI's mentorship track, with hands-on simulated experience in production incident response, database tuning, and secure code review.", "นักศึกษาชั้นปีสุดท้ายที่กำลังมองหาตำแหน่ง {0} ใช้งานในโปรแกรมเมนเทอร์ของ WorkReady AI มีประสบการณ์ลงมือปฏิบัติจำลองการตอบสนองต่อเหตุการณ์ระบบจริง การปรับแต่งฐานข้อมูล และการตรวจสอบโค้ดเพื่อความปลอดภัย"],
  "profile.careerGoals": ["Career Goals", "เป้าหมายอาชีพ"],
  "profile.strengths": ["Strengths", "จุดแข็ง"],
  "profile.developAreas": ["Develop areas", "พื้นที่พัฒนา"],
  "profile.certifications": ["Certifications & Badges", "ใบรับรองและป้ายรางวัล"],
  "profile.badgeAws": ["AWS Cloud Practitioner", "ผู้ปฏิบัติงานคลาวด์ AWS"],
  "profile.badgeGit": ["Git Pro", "ผู้เชี่ยวชาญ Git"]
};

for (const [key, [enStr, thStr]] of Object.entries(newKeys)) {
  en[key] = enStr;
  th[key] = thStr;
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(thPath, JSON.stringify(th, null, 2));

let content = fs.readFileSync('./src/screen/Student/StudentProfile.jsx', 'utf8');

// Add import
content = content.replace("import React from 'react';", "import React from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';");

// Add hook
content = content.replace(/export default function StudentProfile\((.*?)\) \{/, "export default function StudentProfile($1) {\n  const { t } = useLanguage();");

const replacements = [
  ["<h1 className=\"student-page-title\">Profile</h1>", "<h1 className=\"student-page-title\">{t('profile.title')}</h1>"],
  ["<p className=\"student-page-subtitle\">Your public learner profile — what mentors and recruiters see.</p>", "<p className=\"student-page-subtitle\">{t('profile.subtitle')}</p>"],
  ["<p className=\"profile-cohort\">Cohort 2026 — {targetTrack} Track</p>", "<p className=\"profile-cohort\">{t('dashboard.cohortPrefix')}{targetTrack}{t('dashboard.cohortSuffix')}</p>"],
  ["<span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>Open to {occupationGoal} roles</span>", "<span style={{ color: 'var(--accent-teal)', fontWeight: '600' }}>{t('profile.openToRoles')}{occupationGoal}{t('profile.rolesSuffix')}</span>"],
  ["<span>Education Level</span>", "<span>{t('profile.educationLevel')}</span>"],
  ["<span>Target Industry</span>", "<span>{t('profile.targetIndustry')}</span>"],
  ["<h4 className=\"profile-section-title\">About</h4>", "<h4 className=\"profile-section-title\">{t('profile.about')}</h4>"],
  ["<h4 className=\"profile-section-title\">Career Goals</h4>", "<h4 className=\"profile-section-title\">{t('profile.careerGoals')}</h4>"],
  ["<h4 className=\"profile-section-title\" style={{ color: 'var(--accent-green)', borderColor: '#a7f3d0' }}>Strengths</h4>", "<h4 className=\"profile-section-title\" style={{ color: 'var(--accent-green)', borderColor: '#a7f3d0' }}>{t('profile.strengths')}</h4>"],
  ["<h4 className=\"profile-section-title\" style={{ color: 'var(--accent-blue)', borderColor: '#bfdbfe' }}>Develop areas</h4>", "<h4 className=\"profile-section-title\" style={{ color: 'var(--accent-blue)', borderColor: '#bfdbfe' }}>{t('profile.developAreas')}</h4>"],
  ["<h4 className=\"profile-section-title\">Certifications & Badges</h4>", "<h4 className=\"profile-section-title\">{t('profile.certifications')}</h4>"],
  ["<span className=\"profile-pill badge\">Clean Coder</span>", "<span className=\"profile-pill badge\">{t('dashboard.badge1')}</span>"],
  ["<span className=\"profile-pill badge\">Incident Responder</span>", "<span className=\"profile-pill badge\">{t('dashboard.badge2')}</span>"],
  ["<span className=\"profile-pill badge\">Code Reviewer</span>", "<span className=\"profile-pill badge\">{t('dashboard.badge3')}</span>"],
  ["<span className=\"profile-pill badge\">System Designer</span>", "<span className=\"profile-pill badge\">{t('dashboard.badge4')}</span>"],
  ["<span className=\"profile-pill badge highlight\">AWS Cloud Practitioner</span>", "<span className=\"profile-pill badge highlight\">{t('profile.badgeAws')}</span>"],
  ["<span className=\"profile-pill badge\">Git Pro</span>", "<span className=\"profile-pill badge\">{t('profile.badgeGit')}</span>"]
];

for (const [from, to] of replacements) {
  content = content.replace(from, to);
}

// Special case for about section due to dynamic text that we need to replace
content = content.replace(
  /<p className="profile-about-text">\s*Final-year student targeting \{occupationGoal\} roles.*?\s*<\/p>/sg,
  `<p className="profile-about-text">\n                    {t('profile.aboutDesc').replace('{0}', occupationGoal || '')}\n                  </p>`
);

fs.writeFileSync('./src/screen/Student/StudentProfile.jsx', content);
console.log('done');
