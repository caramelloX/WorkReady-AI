const fs = require('fs');

const enFile = 'src/i18n/en.json';
const thFile = 'src/i18n/th.json';

const enData = JSON.parse(fs.readFileSync(enFile, 'utf8'));
const thData = JSON.parse(fs.readFileSync(thFile, 'utf8'));

const translationsEn = {
  "admin.brand": "WorkReady Admin",
  "admin.sidebar.header": "ADMIN",
  "admin.sidebar.dashboard": "Dashboard",
  "admin.sidebar.users": "User Management",
  "admin.sidebar.students": "Students",
  "admin.sidebar.mentors": "Mentors",
  "admin.sidebar.scenarios": "Scenarios",
  "admin.sidebar.modules": "Modules",
  "admin.sidebar.submissions": "Submissions",
  "admin.sidebar.reports": "Reports",
  "admin.profile.role": "ADMIN",
  
  "admin.dashboard.title": "Platform Overview",
  "admin.dashboard.totalUsers": "TOTAL USERS",
  "admin.dashboard.activeScenarios": "ACTIVE SCENARIOS",
  "admin.dashboard.avgReadiness": "AVG READINESS",
  "admin.dashboard.systemStatus": "SYSTEM STATUS",
  
  "admin.users.title": "User Management",
  "admin.users.addBtn": "Add User",
  
  "admin.students.title": "Student Directory",
  "admin.mentors.title": "Mentor Directory",
  "admin.scenarios.title": "Scenario Library",
  "admin.modules.title": "Learning Modules",
  "admin.submissions.title": "Recent Submissions",
  "admin.reports.title": "Reports",
  
  "admin.table.name": "Name",
  "admin.table.email": "Email",
  "admin.table.role": "Role",
  "admin.table.status": "Status",
  "admin.table.joined": "Joined",
  "admin.table.actions": "Actions",
  
  "admin.modal.close": "Close",
  "admin.modal.cancel": "Cancel",
  "admin.modal.save": "Save Changes",
  "admin.modal.editUser": "Edit User Profile",
  "admin.modal.addUser": "Add New User"
};

const translationsTh = {
  "admin.brand": "เวิร์คเรดดี้ แอดมิน",
  "admin.sidebar.header": "ผู้ดูแลระบบ",
  "admin.sidebar.dashboard": "แดชบอร์ด",
  "admin.sidebar.users": "จัดการผู้ใช้งาน",
  "admin.sidebar.students": "นักศึกษา",
  "admin.sidebar.mentors": "พี่เลี้ยง",
  "admin.sidebar.scenarios": "สถานการณ์",
  "admin.sidebar.modules": "โมดูล",
  "admin.sidebar.submissions": "การส่งงาน",
  "admin.sidebar.reports": "รายงาน",
  "admin.profile.role": "ผู้ดูแลระบบ",
  
  "admin.dashboard.title": "ภาพรวมแพลตฟอร์ม",
  "admin.dashboard.totalUsers": "ผู้ใช้ทั้งหมด",
  "admin.dashboard.activeScenarios": "สถานการณ์ที่เปิดใช้งาน",
  "admin.dashboard.avgReadiness": "ความพร้อมเฉลี่ย",
  "admin.dashboard.systemStatus": "สถานะระบบ",
  
  "admin.users.title": "การจัดการผู้ใช้",
  "admin.users.addBtn": "เพิ่มผู้ใช้",
  
  "admin.students.title": "รายชื่อนักศึกษา",
  "admin.mentors.title": "รายชื่อพี่เลี้ยง",
  "admin.scenarios.title": "คลังสถานการณ์",
  "admin.modules.title": "โมดูลการเรียนรู้",
  "admin.submissions.title": "การส่งงานล่าสุด",
  "admin.reports.title": "รายงาน",
  
  "admin.table.name": "ชื่อ",
  "admin.table.email": "อีเมล",
  "admin.table.role": "บทบาท",
  "admin.table.status": "สถานะ",
  "admin.table.joined": "เข้าร่วมเมื่อ",
  "admin.table.actions": "การกระทำ",
  
  "admin.modal.close": "ปิด",
  "admin.modal.cancel": "ยกเลิก",
  "admin.modal.save": "บันทึกการเปลี่ยนแปลง",
  "admin.modal.editUser": "แก้ไขโปรไฟล์ผู้ใช้",
  "admin.modal.addUser": "เพิ่มผู้ใช้ใหม่"
};

Object.assign(enData, translationsEn);
Object.assign(thData, translationsTh);

fs.writeFileSync(enFile, JSON.stringify(enData, null, 2));
fs.writeFileSync(thFile, JSON.stringify(thData, null, 2));

const adminFile = 'src/screen/Admin/AdminScreen.jsx';
let content = fs.readFileSync(adminFile, 'utf8');

// Replace sidebar labels
content = content.replace(
  `{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },`,
  `{ id: 'dashboard', label: t('admin.sidebar.dashboard') || 'Dashboard', icon: LayoutDashboard },`
);
content = content.replace(
  `{ id: 'users', label: 'User Management', icon: Users },`,
  `{ id: 'users', label: t('admin.sidebar.users') || 'User Management', icon: Users },`
);
content = content.replace(
  `{ id: 'students', label: 'Students', icon: GraduationCap },`,
  `{ id: 'students', label: t('admin.sidebar.students') || 'Students', icon: GraduationCap },`
);
content = content.replace(
  `{ id: 'mentors', label: 'Mentors', icon: Briefcase },`,
  `{ id: 'mentors', label: t('admin.sidebar.mentors') || 'Mentors', icon: Briefcase },`
);
content = content.replace(
  `{ id: 'scenarios', label: 'Scenarios', icon: BookOpen },`,
  `{ id: 'scenarios', label: t('admin.sidebar.scenarios') || 'Scenarios', icon: BookOpen },`
);
content = content.replace(
  `{ id: 'modules', label: 'Modules', icon: Layers },`,
  `{ id: 'modules', label: t('admin.sidebar.modules') || 'Modules', icon: Layers },`
);
content = content.replace(
  `{ id: 'submissions', label: 'Submissions', icon: Inbox },`,
  `{ id: 'submissions', label: t('admin.sidebar.submissions') || 'Submissions', icon: Inbox },`
);
content = content.replace(
  `{ id: 'reports', label: 'Reports', icon: BarChart3 },`,
  `{ id: 'reports', label: t('admin.sidebar.reports') || 'Reports', icon: BarChart3 },`
);

// General UI elements
content = content.replace(`<span>WorkReady Admin</span>`, `<span>{t('admin.brand')}</span>`);
content = content.replace(`<div className="admin-sidebar-header">Admin</div>`, `<div className="admin-sidebar-header">{t('admin.sidebar.header').toUpperCase()}</div>`);
content = content.replace(`<span className="admin-profile-role">Admin</span>`, `<span className="admin-profile-role">{t('admin.profile.role')}</span>`);

// Page Titles
content = content.replace(`<h1 className="admin-page-title">Platform Overview</h1>`, `<h1 className="admin-page-title">{t('admin.dashboard.title')}</h1>`);
content = content.replace(`<h1 className="admin-page-title">User Management</h1>`, `<h1 className="admin-page-title">{t('admin.users.title')}</h1>`);
content = content.replace(`<h1 className="admin-page-title">Student Directory</h1>`, `<h1 className="admin-page-title">{t('admin.students.title')}</h1>`);
content = content.replace(`<h1 className="admin-page-title">Mentor Directory</h1>`, `<h1 className="admin-page-title">{t('admin.mentors.title')}</h1>`);
content = content.replace(`<h1 className="admin-page-title">Scenario Library</h1>`, `<h1 className="admin-page-title">{t('admin.scenarios.title')}</h1>`);
content = content.replace(`<h1 className="admin-page-title">Learning Modules</h1>`, `<h1 className="admin-page-title">{t('admin.modules.title')}</h1>`);
content = content.replace(`<h1 className="admin-page-title">Recent Submissions</h1>`, `<h1 className="admin-page-title">{t('admin.submissions.title')}</h1>`);
content = content.replace(`<h1 className="admin-page-title">Reports</h1>`, `<h1 className="admin-page-title">{t('admin.reports.title')}</h1>`);

// Buttons
content = content.replace(/<span>Add User<\/span>/g, `<span>{t('admin.users.addBtn')}</span>`);

// Stats Labels
content = content.replace(/label="TOTAL USERS"/g, `label={t('admin.dashboard.totalUsers')}`);
content = content.replace(/label="ACTIVE SCENARIOS"/g, `label={t('admin.dashboard.activeScenarios')}`);
content = content.replace(/label="AVG READINESS"/g, `label={t('admin.dashboard.avgReadiness')}`);
content = content.replace(/label="SYSTEM STATUS"/g, `label={t('admin.dashboard.systemStatus')}`);
content = content.replace(/label="AVG. READINESS"/g, `label={t('admin.dashboard.avgReadiness')}`); // from reports tab

// Table Headers
content = content.replace(/<th>Name<\/th>/g, `<th>{t('admin.table.name')}</th>`);
content = content.replace(/<th>Email<\/th>/g, `<th>{t('admin.table.email')}</th>`);
content = content.replace(/<th>Role<\/th>/g, `<th>{t('admin.table.role')}</th>`);
content = content.replace(/<th>Status<\/th>/g, `<th>{t('admin.table.status')}</th>`);
content = content.replace(/<th>Joined<\/th>/g, `<th>{t('admin.table.joined')}</th>`);
content = content.replace(/<th>Actions<\/th>/g, `<th>{t('admin.table.actions')}</th>`);

// Modals
content = content.replace(/<button type="button" className="admin-btn-secondary" onClick=\{\(\) => setSelectedProfile\(null\)\}>Close<\/button>/g, `<button type="button" className="admin-btn-secondary" onClick={() => setSelectedProfile(null)}>{t('admin.modal.close')}</button>`);
content = content.replace(/<button type="button" className="admin-btn-secondary" onClick=\{\(\) => setEditingProfile\(null\)\}>Cancel<\/button>/g, `<button type="button" className="admin-btn-secondary" onClick={() => setEditingProfile(null)}>{t('admin.modal.cancel')}</button>`);
content = content.replace(/<button type="button" className="admin-btn-secondary" onClick=\{\(\) => setShowAddUserModal\(false\)\}>Cancel<\/button>/g, `<button type="button" className="admin-btn-secondary" onClick={() => setShowAddUserModal(false)}>{t('admin.modal.cancel')}</button>`);

content = content.replace(/<h2 className="admin-modal-title">Edit User Profile<\/h2>/g, `<h2 className="admin-modal-title">{t('admin.modal.editUser')}</h2>`);
content = content.replace(/<h2 className="admin-modal-title">Add New User<\/h2>/g, `<h2 className="admin-modal-title">{t('admin.modal.addUser')}</h2>`);

fs.writeFileSync(adminFile, content);
console.log('Admin translations applied');
