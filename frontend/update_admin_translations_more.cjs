const fs = require('fs');

const enFile = 'src/i18n/en.json';
const thFile = 'src/i18n/th.json';

const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));
const thData = JSON.parse(fs.readFileSync(thFile, 'utf8'));

const translationsEn = {
  "admin.mock.module1": "Backend Fundamentals",
  "admin.mock.module2": "Cloud Infrastructure",
  "admin.mock.statusPub": "Published",
  "admin.mock.meta1": "24 scenarios · 312 students",
  "admin.mock.meta2": "18 scenarios · 205 students",
  "admin.reports.cohortCompletion": "Cohort completion",
  "admin.reports.cohort": "COHORT",
  "admin.reports.avgScore": "AVG SCORE",
  "admin.reports.completion": "COMPLETION",
  "admin.reports.topScenarios": "Top scenarios",
  "admin.reports.engagement": "Engagement",
  "admin.reports.dau": "Daily Active Users (DAU)",
  "admin.reports.avgSession": "Avg Session Length",
  "admin.reports.runs": "runs",
  "admin.edit.fullName": "Full Name",
  "admin.edit.email": "Email",
  "admin.edit.username": "Username",
  "admin.edit.role": "Role",
  "admin.edit.track": "Target Track",
  "admin.edit.industry": "Target Industry",
  "admin.edit.major": "Major / Organization",
  "admin.edit.eduLevel": "Education Level",
  "admin.edit.occupation": "Occupation Goal (About)",
  "admin.edit.careerGoal": "Career Goal",
  "admin.edit.strengths": "Strengths (Comma separated)",
  "admin.edit.develop": "Develop Areas (Comma separated)",
  "admin.edit.saving": "Saving...",
  "admin.roles.student": "Student",
  "admin.roles.mentor": "Mentor",
  "admin.roles.admin": "Admin",
  "admin.search.placeholder": "Search users, scenarios...",
  "admin.badge.status": "Status",
  "admin.badge.risk": "Risk",
  "admin.badge.active": "Active",
  "admin.badge.suspended": "Suspended",
  "admin.badge.inactive": "Inactive",
  "admin.badge.pending": "Pending",
  "admin.reports.c1": "Spring 2026 Alpha",
  "admin.reports.c2": "Spring 2026 Beta",
  "admin.reports.s1": "Database Outage RCA",
  "admin.reports.s2": "Memory Leak Debugging",
  "admin.reports.s3": "API Rate Limiting"
};

const translationsTh = {
  "admin.mock.module1": "พื้นฐานด้านแบ็กเอนด์",
  "admin.mock.module2": "โครงสร้างพื้นฐานคลาวด์",
  "admin.mock.statusPub": "เผยแพร่แล้ว",
  "admin.mock.meta1": "24 สถานการณ์ · นักศึกษา 312 คน",
  "admin.mock.meta2": "18 สถานการณ์ · นักศึกษา 205 คน",
  "admin.reports.cohortCompletion": "การสำเร็จการศึกษาตามรุ่น",
  "admin.reports.cohort": "รุ่น",
  "admin.reports.avgScore": "คะแนนเฉลี่ย",
  "admin.reports.completion": "ความสำเร็จ",
  "admin.reports.topScenarios": "สถานการณ์ยอดนิยม",
  "admin.reports.engagement": "การมีส่วนร่วม",
  "admin.reports.dau": "ผู้ใช้งานรายวัน (DAU)",
  "admin.reports.avgSession": "ระยะเวลาเซสชั่นเฉลี่ย",
  "admin.reports.runs": "ครั้ง",
  "admin.edit.fullName": "ชื่อ-นามสกุล",
  "admin.edit.email": "อีเมล",
  "admin.edit.username": "ชื่อผู้ใช้",
  "admin.edit.role": "บทบาท",
  "admin.edit.track": "เส้นทางที่ตั้งเป้าหมาย",
  "admin.edit.industry": "อุตสาหกรรมที่ตั้งเป้าหมาย",
  "admin.edit.major": "วิชาเอก / องค์กร",
  "admin.edit.eduLevel": "ระดับการศึกษา",
  "admin.edit.occupation": "เป้าหมายอาชีพ (เกี่ยวกับ)",
  "admin.edit.careerGoal": "เป้าหมายการทำงาน",
  "admin.edit.strengths": "จุดแข็ง (คั่นด้วยจุลภาค)",
  "admin.edit.develop": "ส่วนที่ต้องพัฒนา (คั่นด้วยจุลภาค)",
  "admin.edit.saving": "กำลังบันทึก...",
  "admin.roles.student": "นักศึกษา",
  "admin.roles.mentor": "พี่เลี้ยง",
  "admin.roles.admin": "ผู้ดูแลระบบ",
  "admin.search.placeholder": "ค้นหาผู้ใช้, สถานการณ์...",
  "admin.badge.status": "สถานะ",
  "admin.badge.risk": "ความเสี่ยง",
  "admin.badge.active": "ใช้งานอยู่",
  "admin.badge.suspended": "ถูกระงับ",
  "admin.badge.inactive": "ไม่ได้ใช้งาน",
  "admin.badge.pending": "รอดำเนินการ",
  "admin.reports.c1": "ฤดูใบไม้ผลิ 2026 อัลฟ่า",
  "admin.reports.c2": "ฤดูใบไม้ผลิ 2026 เบต้า",
  "admin.reports.s1": "RCA การหยุดทำงานของฐานข้อมูล",
  "admin.reports.s2": "การแก้ไขหน่วยความจำรั่วไหล",
  "admin.reports.s3": "การจำกัดอัตรา API"
};

Object.assign(enData, translationsEn);
Object.assign(thData, translationsTh);

fs.writeFileSync(enFile, JSON.stringify(enData, null, 2));
fs.writeFileSync(thFile, JSON.stringify(thData, null, 2));

const adminFile = 'src/screen/Admin/AdminScreen.jsx';
let content = fs.readFileSync(adminFile, 'utf8');

// Replace mock modules data
content = content.replace(
  `{ id: 1, title: 'Backend Fundamentals', status: 'Published', meta: '24 scenarios · 312 students' }`,
  `{ id: 1, title: t('admin.mock.module1'), status: t('admin.mock.statusPub'), meta: t('admin.mock.meta1') }`
);
content = content.replace(
  `{ id: 2, title: 'Cloud Infrastructure', status: 'Published', meta: '18 scenarios · 205 students' }`,
  `{ id: 2, title: t('admin.mock.module2'), status: t('admin.mock.statusPub'), meta: t('admin.mock.meta2') }`
);

// Search placeholder
content = content.replace(
  `placeholder="Search users, scenarios..."`,
  `placeholder={t('admin.search.placeholder')}`
);

// Replace hardcoded Reports content
content = content.replace(`<h3 className="admin-card-header">Cohort completion</h3>`, `<h3 className="admin-card-header">{t('admin.reports.cohortCompletion')}</h3>`);
content = content.replace(/<th>COHORT<\/th>/g, `<th>{t('admin.reports.cohort')}</th>`);
content = content.replace(/<th>AVG SCORE<\/th>/g, `<th>{t('admin.reports.avgScore')}</th>`);
content = content.replace(/<th>COMPLETION<\/th>/g, `<th>{t('admin.reports.completion')}</th>`);
content = content.replace(/<td>Spring 2026 Alpha<\/td>/g, `<td>{t('admin.reports.c1')}</td>`);
content = content.replace(/<td>Spring 2026 Beta<\/td>/g, `<td>{t('admin.reports.c2')}</td>`);

content = content.replace(`<h3 className="admin-card-header">Top scenarios</h3>`, `<h3 className="admin-card-header">{t('admin.reports.topScenarios')}</h3>`);
content = content.replace(`<span style={{fontWeight: 500}}>Database Outage RCA</span>`, `<span style={{fontWeight: 500}}>{t('admin.reports.s1')}</span>`);
content = content.replace(`<span style={{color: '#64748B'}}>1,204 runs</span>`, `<span style={{color: '#64748B'}}>1,204 {t('admin.reports.runs')}</span>`);
content = content.replace(`<span style={{fontWeight: 500}}>Memory Leak Debugging</span>`, `<span style={{fontWeight: 500}}>{t('admin.reports.s2')}</span>`);
content = content.replace(`<span style={{color: '#64748B'}}>984 runs</span>`, `<span style={{color: '#64748B'}}>984 {t('admin.reports.runs')}</span>`);
content = content.replace(`<span style={{fontWeight: 500}}>API Rate Limiting</span>`, `<span style={{fontWeight: 500}}>{t('admin.reports.s3')}</span>`);
content = content.replace(`<span style={{color: '#64748B'}}>842 runs</span>`, `<span style={{color: '#64748B'}}>842 {t('admin.reports.runs')}</span>`);

content = content.replace(`<h3 className="admin-card-header">Engagement</h3>`, `<h3 className="admin-card-header">{t('admin.reports.engagement')}</h3>`);
content = content.replace(`<span style={{fontWeight: 500, color: '#64748B'}}>Daily Active Users (DAU)</span>`, `<span style={{fontWeight: 500, color: '#64748B'}}>{t('admin.reports.dau')}</span>`);
content = content.replace(`<span style={{fontWeight: 500, color: '#64748B'}}>Avg Session Length</span>`, `<span style={{fontWeight: 500, color: '#64748B'}}>{t('admin.reports.avgSession')}</span>`);

// Edit Profile Form Labels
content = content.replace(/<label>Full Name<\/label>/g, `<label>{t('admin.edit.fullName')}</label>`);
content = content.replace(/<label>Email<\/label>/g, `<label>{t('admin.edit.email')}</label>`);
content = content.replace(/<label>Username<\/label>/g, `<label>{t('admin.edit.username')}</label>`);
content = content.replace(/<label>Role<\/label>/g, `<label>{t('admin.edit.role')}</label>`);
content = content.replace(/<label>Target Track<\/label>/g, `<label>{t('admin.edit.track')}</label>`);
content = content.replace(/<label>Target Industry<\/label>/g, `<label>{t('admin.edit.industry')}</label>`);
content = content.replace(/<label>Major \/ Organization<\/label>/g, `<label>{t('admin.edit.major')}</label>`);
content = content.replace(/<label>Education Level<\/label>/g, `<label>{t('admin.edit.eduLevel')}</label>`);
content = content.replace(/<label>Occupation Goal \(About\)<\/label>/g, `<label>{t('admin.edit.occupation')}</label>`);
content = content.replace(/<label>Career Goal<\/label>/g, `<label>{t('admin.edit.careerGoal')}</label>`);
content = content.replace(/<label>Strengths \(Comma separated\)<\/label>/g, `<label>{t('admin.edit.strengths')}</label>`);
content = content.replace(/<label>Develop Areas \(Comma separated\)<\/label>/g, `<label>{t('admin.edit.develop')}</label>`);

// Select options
content = content.replace(/<option value="Student">Student<\/option>/g, `<option value="Student">{t('admin.roles.student')}</option>`);
content = content.replace(/<option value="Mentor">Mentor<\/option>/g, `<option value="Mentor">{t('admin.roles.mentor')}</option>`);
content = content.replace(/<option value="Admin">Admin<\/option>/g, `<option value="Admin">{t('admin.roles.admin')}</option>`);

// Saving state
content = content.replace(/'Saving...'/g, `t('admin.edit.saving')`);

fs.writeFileSync(adminFile, content);
console.log('Rest of admin translations applied');
