import fs from 'fs';
const enPath = './src/i18n/en.json';
const thPath = './src/i18n/th.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const th = JSON.parse(fs.readFileSync(thPath, 'utf8'));

const newKeys = {
  "employer.portalAccess": ["PORTAL ACCESS", "การเข้าถึงพอร์ทัล"],
  "employer.talentSearch": ["Talent Search", "ค้นหาผู้มีความสามารถ"],
  "employer.guestRecruiter": ["Guest Recruiter", "ผู้สรรหา (ผู้เยี่ยมชม)"],
  "employer.publicPreview": ["Public Preview", "ตัวอย่างสาธารณะ"],
  "employer.backToHome": ["Back to Home", "กลับหน้าหลัก"],
  "employer.title": ["Find work-ready engineering talent", "ค้นหาบุคลากรวิศวกรรมที่พร้อมทำงาน"],
  "employer.subtitle": ["Search verified graduates with mentor-reviewed evidence portfolios.", "ค้นหาผู้สำเร็จการศึกษาที่ผ่านการตรวจสอบพร้อมแฟ้มสะสมผลงานที่ได้รับการประเมินจากเมนเทอร์"],
  "employer.searchPlaceholder": ["Search by name, university, or skill (e.g. Kubernetes)", "ค้นหาตามชื่อ มหาวิทยาลัย หรือทักษะ (เช่น Kubernetes)"],
  "employer.allTracks": ["All tracks", "ทุกสายงาน"],
  "employer.anyLevel": ["Any Level", "ทุกระดับ"],
  "employer.jobReady": ["Job-ready (>90)", "พร้อมทำงาน (>90)"],
  "employer.competent": ["Competent (86-90)", "มีความสามารถ (86-90)"],
  "employer.developing": ["Developing (80-85)", "กำลังพัฒนา (80-85)"],
  "employer.foundational": ["Foundational (<80)", "พื้นฐาน (<80)"],
  "employer.syncing": ["Syncing premium talent profiles from database...", "กำลังซิงค์โปรไฟล์จากฐานข้อมูล..."],
  "employer.refineSearch": ["Refine your search parameters", "ปรับแต่งพารามิเตอร์การค้นหาของคุณ"],
  "employer.enterSearch": ["Enter a search term or apply a filter to view candidates.", "ป้อนคำค้นหาหรือใช้ตัวกรองเพื่อดูผู้สมัคร"],
  "employer.try": ["Try:", "ลอง:"],
  "employer.backendTrack": ["Backend Track", "สายงาน Backend"],
  "employer.verifiedPortfolios": ["Verified portfolios", "แฟ้มสะสมผลงานที่ตรวจสอบแล้ว"],
  "employer.clearFilters": ["Clear all filters", "ล้างตัวกรองทั้งหมด"],
  "employer.scenarios": ["Scenarios", "สถานการณ์"],
  "employer.rca": ["RCA", "RCA"],
  "employer.evidence": ["Evidence", "หลักฐาน"],
  "employer.immediate": ["Immediate availability", "พร้อมเริ่มงานทันที"],
  "employer.view": ["View", "ดู"],
  "employer.verifiedPortfolio": ["Verified portfolio", "แฟ้มสะสมผลงานที่ตรวจสอบแล้ว"],
  "employer.wrScore": ["WR SCORE", "คะแนน WR"],
  "employer.summary": ["Summary", "สรุป"],
  "employer.education": ["Education", "การศึกษา"],
  "employer.processMap": ["Architectural Process Map", "แผนผังกระบวนการทางสถาปัตยกรรม"],
  "employer.safetyQuality": ["Safety / Quality", "ความปลอดภัย / คุณภาพ"],
  "employer.guardrails": ["Reliability Guardrails", "มาตรฐานความน่าเชื่อถือ"],
  "employer.rcaSection": ["Root Cause Analysis (RCA)", "การวิเคราะห์สาเหตุหลัก (RCA)"],
  "employer.rootCause": ["Root cause:", "สาเหตุหลัก:"],
  "employer.fix": ["Fix:", "การแก้ไข:"],
  "employer.technicalMemo": ["Technical Memo", "บันทึกทางเทคนิค"],
  "employer.viewRfc": ["View full technical RFC layout ➔", "ดูเค้าโครง RFC ทางเทคนิคแบบเต็ม ➔"],
  "employer.aiIntegration": ["AI Co-Pilot Integration", "การรวม AI Co-Pilot"],
  "employer.workExperience": ["Work Experience", "ประสบการณ์การทำงาน"],
  "employer.mentorReviewed": ["Mentor-Reviewed Evidence", "หลักฐานที่ได้รับการประเมินจากเมนเทอร์"],
  "employer.aggregateSim": ["Aggregate Simulator Performance", "ประสิทธิภาพการจำลองรวม"],
  "employer.totalScenarios": ["Total Scenarios", "สถานการณ์ทั้งหมด"],
  "employer.rcaRating": ["RCA Star Rating", "คะแนนดาว RCA"],
  "employer.verifiedEvidence": ["Verified Evidence", "หลักฐานที่ตรวจสอบแล้ว"],
  "employer.technicalSkills": ["Technical Skills", "ทักษะทางเทคนิค"],
  "employer.certifications": ["Certifications & Badges", "การรับรองและป้ายบอกระดับ"],
  "employer.contactCandidate": ["Contact Candidate", "ติดต่อผู้สมัคร"],
  "employer.showing": ["Showing", "แสดง"],
  "employer.verifiedCand": ["verified candidates", "ผู้สมัครที่ได้รับการตรวจสอบแล้ว"],
  
  "mentor.portal": ["MENTOR PORTAL", "พอร์ทัลเมนเทอร์"],
  "mentor.dashboardTab": ["Mentor Dashboard", "แดชบอร์ดเมนเทอร์"],
  "mentor.studentListTab": ["Student List", "รายชื่อนักศึกษา"],
  "mentor.submissionsTab": ["Submissions", "การส่งงาน"],
  "mentor.portfolioTab": ["Portfolio Review", "รีวิวแฟ้มสะสมผลงาน"],
  "mentor.signOut": ["Sign out", "ออกจากระบบ"],
  "mentor.dashTitle": ["Mentor Dashboard", "แดชบอร์ดเมนเทอร์"],
  "mentor.dashSubtitle": ["Coach your cohort through real-world software engineering incidents.", "ฝึกสอนกลุ่มของคุณผ่านเหตุการณ์วิศวกรรมซอฟต์แวร์ในโลกแห่งความเป็นจริง"],
  "mentor.mentees": ["Mentees", "ผู้รับการฝึกสอน"],
  "mentor.activeTerm": ["Active this term", "ใช้งานในภาคเรียนนี้"],
  "mentor.unfinished": ["Unfinished", "ยังไม่เสร็จ"],
  "mentor.requiresAttn": ["Requires attention", "ต้องการความสนใจ"],
  "mentor.available": ["Available", "มีอยู่"],
  "mentor.incidentsOpen": ["Incident scenarios open", "สถานการณ์เปิดอยู่"],
  "mentor.finished": ["Finished", "เสร็จแล้ว"],
  "mentor.approvedEv": ["Approved evidence logs", "บันทึกหลักฐานที่อนุมัติแล้ว"],
  "mentor.studentProg": ["Student Progress", "ความก้าวหน้าของนักศึกษา"],
  "mentor.thStudent": ["Student", "นักศึกษา"],
  "mentor.thReadiness": ["Readiness", "ความพร้อม"],
  "mentor.thScenarios": ["Scenarios", "สถานการณ์"],
  "mentor.thRisk": ["Risk", "ความเสี่ยง"],
  "mentor.thLastActive": ["Last Active", "ใช้งานล่าสุด"],
  "mentor.thActions": ["Actions", "การกระทำ"],
  "mentor.pendingRev": ["Pending Reviews", "รอการตรวจสอบ"],
  "mentor.allRevDone": ["All reviews completed! 🎉", "ตรวจสอบเสร็จสิ้นทั้งหมดแล้ว! 🎉"],
  "mentor.today": ["Today", "วันนี้"],
  "mentor.overdue": ["Overdue", "เกินกำหนด"],
  "mentor.unfinReminders": ["Unfinished Reminders", "การแจ้งเตือนงานที่ยังไม่เสร็จ"],
  "mentor.studListTitle": ["Student List", "รายชื่อนักศึกษา"],
  "mentor.studListSub": ["Detailed engineering readiness progression tracking for active candidates.", "การติดตามความก้าวหน้าความพร้อมด้านวิศวกรรมโดยละเอียดสำหรับผู้สมัครที่ใช้งานอยู่"],
  "mentor.activeCand": ["Active Candidates", "ผู้สมัครที่ใช้งานอยู่"],
  "mentor.thName": ["Student Name", "ชื่อนักศึกษา"],
  "mentor.thIndustry": ["Target Industry", "อุตสาหกรรมเป้าหมาย"],
  "mentor.thLevel": ["Competency Level", "ระดับความสามารถ"],
  "mentor.thSolved": ["Scenarios Solved", "สถานการณ์ที่แก้ไขแล้ว"],
  "mentor.inspect": ["Inspect Portfolio", "ตรวจสอบแฟ้มสะสมผลงาน"],
  "mentor.subTitle": ["Evidence Submissions", "การส่งหลักฐาน"],
  "mentor.subSub": ["Verify student incident write-ups and diagnostic process charts.", "ตรวจสอบการเขียนสรุปเหตุการณ์ของนักศึกษาและแผนภูมิกะบวนการวินิจฉัย"],
  "mentor.queue": ["Solutions Queue", "คิวโซลูชัน"],
  "mentor.thArtifactType": ["Artifact Type", "ประเภทอาร์ติแฟกต์"],
  "mentor.thEvidenceName": ["Evidence Artifact Name", "ชื่ออาร์ติแฟกต์หลักฐาน"],
  "mentor.thDate": ["Submitted Date", "วันที่ส่ง"],
  "mentor.thStatus": ["Status", "สถานะ"],
  "mentor.approve": ["Approve", "อนุมัติ"],
  "mentor.revise": ["Revise", "แก้ไข"],
  "mentor.assess": ["Assess Solution", "ประเมินโซลูชัน"],
  "mentor.menteeList": ["Mentees list", "รายชื่อผู้รับการฝึกสอน"],
  "mentor.ready": ["Ready", "พร้อม"],
  "mentor.jobReadyIdx": ["Job Readiness Index", "ดัชนีความพร้อมในการทำงาน"],
  "mentor.candHasSolved": ["Candidate has solved", "ผู้สมัครได้แก้ไขแล้ว"],
  "mentor.incidentsMet": ["incident modules and met Stripe diagnostic standard benchmarks.", "โมดูลเหตุการณ์ และผ่านเกณฑ์มาตรฐานการวินิจฉัย"],
  "mentor.highlightsTitle": ["Mentor Highlights", "ไฮไลท์จากเมนเทอร์"],
  "mentor.noHighlights": ["No custom highlights provided yet.", "ยังไม่มีไฮไลท์แบบกำหนดเอง"],
  "mentor.updateBtn": ["Update Highlights", "อัปเดตไฮไลท์"],
  "mentor.evFolder": ["Evidence Artifact Folder", "โฟลเดอร์อาร์ติแฟกต์หลักฐาน"],
  "mentor.pts": ["pts", "คะแนน"],
  "mentor.loadingCand": ["Loading candidate portfolio...", "กำลังโหลดแฟ้มสะสมผลงานผู้สมัคร..."],
  
  "admin.portal": ["ADMIN PORTAL", "พอร์ทัลผู้ดูแลระบบ"],
  "admin.dashboardTab": ["Platform Overview", "ภาพรวมแพลตฟอร์ม"],
  "admin.usersTab": ["User Management", "การจัดการผู้ใช้"],
  "admin.contentTab": ["Scenario Content", "เนื้อหาสถานการณ์"],
  "admin.settingsTab": ["System Settings", "การตั้งค่าระบบ"],
  "admin.title": ["Admin Dashboard", "แดชบอร์ดผู้ดูแลระบบ"],
  "admin.subtitle": ["System health, user metrics, and platform operations.", "สถานะระบบ เมตริกผู้ใช้ และการทำงานของแพลตฟอร์ม"],
  "admin.totalUsers": ["Total Users", "ผู้ใช้ทั้งหมด"],
  "admin.activeScenarios": ["Active Scenarios", "สถานการณ์ที่เปิดใช้งาน"],
  "admin.avgReadiness": ["Avg Readiness", "ความพร้อมเฉลี่ย"],
  "admin.systemStatus": ["System Status", "สถานะระบบ"],
  "admin.usersList": ["Users List", "รายชื่อผู้ใช้"],
  "admin.thRole": ["Role", "บทบาท"],
  "admin.thJoined": ["Joined", "เข้าร่วมเมื่อ"],
  "admin.contentList": ["Content Modules", "โมดูลเนื้อหา"],
  "admin.thModule": ["Module Name", "ชื่อโมดูล"],
  "admin.thDiff": ["Difficulty", "ความยาก"],
  "admin.thCompletions": ["Completions", "จำนวนครั้งที่เสร็จสิ้น"],
  "admin.edit": ["Edit", "แก้ไข"]
};

for (const [key, [enStr, thStr]] of Object.entries(newKeys)) {
  en[key] = enStr;
  th[key] = thStr;
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(thPath, JSON.stringify(th, null, 2));


// We will do a generic search and replace via node for each file.
const doReplace = (path, replacements) => {
  let content = fs.readFileSync(path, 'utf8');
  if (!content.includes("import { useLanguage } from")) {
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';");
  }
  // check component declaration
  const compRegex = /export default function ([a-zA-Z]+)\((.*?)\) \{/;
  const match = content.match(compRegex);
  if (match) {
    const compName = match[1];
    const args = match[2];
    if (!content.includes("const { t } = useLanguage();")) {
      content = content.replace(compRegex, `export default function ${compName}(${args}) {\n  const { t } = useLanguage();`);
    }
  }

  for (const [from, to] of replacements) {
    // using split join for global replacement of literal strings
    content = content.split(from).join(to);
  }
  fs.writeFileSync(path, content);
};

// 1. EmployerScreen
const employerReps = [
  ["<div className=\"employer-sidebar-header\">PORTAL ACCESS</div>", "<div className=\"employer-sidebar-header\">{t('employer.portalAccess')}</div>"],
  ["<span>Talent Search</span>", "<span>{t('employer.talentSearch')}</span>"],
  ["<span className=\"employer-profile-name\">Guest Recruiter</span>", "<span className=\"employer-profile-name\">{t('employer.guestRecruiter')}</span>"],
  ["<span className=\"employer-profile-role\">Public Preview</span>", "<span className=\"employer-profile-role\">{t('employer.publicPreview')}</span>"],
  ["Back to Home\n                </button>", "{t('employer.backToHome')}\n                </button>"],
  ["<h1 className=\"employer-page-title\">Find work-ready engineering talent</h1>", "<h1 className=\"employer-page-title\">{t('employer.title')}</h1>"],
  ["<p className=\"employer-page-subtitle\">Search verified graduates with mentor-reviewed evidence portfolios.</p>", "<p className=\"employer-page-subtitle\">{t('employer.subtitle')}</p>"],
  ["placeholder=\"Search by name, university, or skill (e.g. Kubernetes)\"", "placeholder={t('employer.searchPlaceholder')}"],
  [">All tracks</option>", ">{t('employer.allTracks')}</option>"],
  [">Any Level</option>", ">{t('employer.anyLevel')}</option>"],
  [">Job-ready (&gt;90)</option>", ">{t('employer.jobReady')}</option>"],
  [">Competent (86-90)</option>", ">{t('employer.competent')}</option>"],
  [">Developing (80-85)</option>", ">{t('employer.developing')}</option>"],
  [">Foundational (&lt;80)</option>", ">{t('employer.foundational')}</option>"],
  ["<p>Syncing premium talent profiles from database...</p>", "<p>{t('employer.syncing')}</p>"],
  ["<h3>Refine your search parameters</h3>", "<h3>{t('employer.refineSearch')}</h3>"],
  ["<p>Enter a search term or apply a filter to view candidates.</p>", "<p>{t('employer.enterSearch')}</p>"],
  ["<span>Try:</span>", "<span>{t('employer.try')}</span>"],
  ["<button onClick={() => setDomainFilter('Backend')}>Backend Track</button>", "<button onClick={() => setDomainFilter('Backend')}>{t('employer.backendTrack')}</button>"],
  ["Showing <strong>{candidates.length}</strong> verified candidates", "{t('employer.showing')} <strong>{candidates.length}</strong> {t('employer.verifiedCand')}"],
  ["<span>Verified portfolios</span>", "<span>{t('employer.verifiedPortfolios')}</span>"],
  ["<p>No candidates match your current search query <strong>\"{debouncedQuery}\"</strong>.</p>", "<p>{t('employer.noCandidates').replace('{query}', debouncedQuery)}</p>"],
  ["Clear all filters\n                  </button>", "{t('employer.clearFilters')}\n                  </button>"],
  ["<span className=\"label\">Scenarios</span>", "<span className=\"label\">{t('employer.scenarios')}</span>"],
  ["<span className=\"label\">RCA</span>", "<span className=\"label\">{t('employer.rca')}</span>"],
  ["<span className=\"label\">Evidence</span>", "<span className=\"label\">{t('employer.evidence')}</span>"],
  ["<span>View</span>", "<span>{t('employer.view')}</span>"],
  ["<span>Verified portfolio</span>", "<span>{t('employer.verifiedPortfolio')}</span>"],
  ["<span className=\"lbl\">WR SCORE</span>", "<span className=\"lbl\">{t('employer.wrScore')}</span>"],
  ["<h4 className=\"section-subheader\">Summary</h4>", "<h4 className=\"section-subheader\">{t('employer.summary')}</h4>"],
  ["<h4 className=\"section-subheader\">Education</h4>", "<h4 className=\"section-subheader\">{t('employer.education')}</h4>"],
  ["<h4 className=\"section-subheader\">Architectural Process Map</h4>", "<h4 className=\"section-subheader\">{t('employer.processMap')}</h4>"],
  ["<h4 className=\"section-subheader\">Safety / Quality</h4>", "<h4 className=\"section-subheader\">{t('employer.safetyQuality')}</h4>"],
  ["<div className=\"guardrails-title font-medium\">Reliability Guardrails</div>", "<div className=\"guardrails-title font-medium\">{t('employer.guardrails')}</div>"],
  ["<h4 className=\"section-subheader\">Root Cause Analysis (RCA)</h4>", "<h4 className=\"section-subheader\">{t('employer.rcaSection')}</h4>"],
  ["<strong>Root cause:</strong>", "<strong>{t('employer.rootCause')}</strong>"],
  ["<strong>Fix:</strong>", "<strong>{t('employer.fix')}</strong>"],
  ["<h4 className=\"section-subheader\">Technical Memo</h4>", "<h4 className=\"section-subheader\">{t('employer.technicalMemo')}</h4>"],
  ["View full technical RFC layout ➔", "{t('employer.viewRfc')}"],
  ["<h4 className=\"section-subheader\">AI Co-Pilot Integration</h4>", "<h4 className=\"section-subheader\">{t('employer.aiIntegration')}</h4>"],
  ["<h4 className=\"section-subheader\">Work Experience</h4>", "<h4 className=\"section-subheader\">{t('employer.workExperience')}</h4>"],
  ["<h4 className=\"section-subheader\">Mentor-Reviewed Evidence</h4>", "<h4 className=\"section-subheader\">{t('employer.mentorReviewed')}</h4>"],
  ["<div className=\"evidence-reviewer\">Reviewed by <strong>{rev.reviewer}</strong></div>", "<div className=\"evidence-reviewer\">{t('employer.reviewedBy').replace('{reviewer}', '')} <strong>{rev.reviewer}</strong></div>"],
  ["<h5 className=\"summary-title font-medium\">Aggregate Simulator Performance</h5>", "<h5 className=\"summary-title font-medium\">{t('employer.aggregateSim')}</h5>"],
  ["<span className=\"lbl\">Total Scenarios</span>", "<span className=\"lbl\">{t('employer.totalScenarios')}</span>"],
  ["<span className=\"lbl\">RCA Star Rating</span>", "<span className=\"lbl\">{t('employer.rcaRating')}</span>"],
  ["<span className=\"lbl\">Verified Evidence</span>", "<span className=\"lbl\">{t('employer.verifiedEvidence')}</span>"],
  ["<h4 className=\"section-subheader\">Technical Skills</h4>", "<h4 className=\"section-subheader\">{t('employer.technicalSkills')}</h4>"],
  ["<h4 className=\"section-subheader\">Certifications & Badges</h4>", "<h4 className=\"section-subheader\">{t('employer.certifications')}</h4>"],
  ["<span>Contact Candidate</span>", "<span>{t('employer.contactCandidate')}</span>"],
  ["{cand.availability === 'Immediate' ? 'Immediate availability' : \`Available in \${cand.availability}\`}", "{cand.availability === 'Immediate' ? t('employer.immediate') : \`\${t('employer.availableIn').split('{')[0]}\${cand.availability}\`}"],
  ["{selectedCandidate.availability === 'Immediate' ? 'Immediate availability' : \`Available in \${selectedCandidate.availability}\`}", "{selectedCandidate.availability === 'Immediate' ? t('employer.immediate') : \`\${t('employer.availableIn').split('{')[0]}\${selectedCandidate.availability}\`}"]
];
doReplace('./src/screen/Employer/EmployerScreen.jsx', employerReps);


// 2. MentorScreen
const mentorReps = [
  ["<div className=\"mentor-sidebar-header\">MENTOR PORTAL</div>", "<div className=\"mentor-sidebar-header\">{t('mentor.portal')}</div>"],
  ["<span>Mentor Dashboard</span>", "<span>{t('mentor.dashboardTab')}</span>"],
  ["<span>Student List</span>", "<span>{t('mentor.studentListTab')}</span>"],
  ["<span>Submissions</span>", "<span>{t('mentor.submissionsTab')}</span>"],
  ["<span>Portfolio Review</span>", "<span>{t('mentor.portfolioTab')}</span>"],
  ["Sign out\n                </button>", "{t('mentor.signOut')}\n                </button>"],
  ["<h1 className=\"mentor-page-title\">Mentor Dashboard</h1>", "<h1 className=\"mentor-page-title\">{t('mentor.dashTitle')}</h1>"],
  ["<p className=\"mentor-page-subtitle\">Coach your cohort through real-world software engineering incidents.</p>", "<p className=\"mentor-page-subtitle\">{t('mentor.dashSubtitle')}</p>"],
  ["<span className=\"mentor-stat-label color-blue\">Mentees</span>", "<span className=\"mentor-stat-label color-blue\">{t('mentor.mentees')}</span>"],
  ["<p className=\"mentor-stat-subtext\">Active this term</p>", "<p className=\"mentor-stat-subtext\">{t('mentor.activeTerm')}</p>"],
  ["<span className=\"mentor-stat-label color-yellow\">Unfinished</span>", "<span className=\"mentor-stat-label color-yellow\">{t('mentor.unfinished')}</span>"],
  ["<p className=\"mentor-stat-subtext\">Requires attention</p>", "<p className=\"mentor-stat-subtext\">{t('mentor.requiresAttn')}</p>"],
  ["<span className=\"mentor-stat-label color-teal\">Available</span>", "<span className=\"mentor-stat-label color-teal\">{t('mentor.available')}</span>"],
  ["<p className=\"mentor-stat-subtext\">Incident scenarios open</p>", "<p className=\"mentor-stat-subtext\">{t('mentor.incidentsOpen')}</p>"],
  ["<span className=\"mentor-stat-label color-green\">Finished</span>", "<span className=\"mentor-stat-label color-green\">{t('mentor.finished')}</span>"],
  ["<p className=\"mentor-stat-subtext\">Approved evidence logs</p>", "<p className=\"mentor-stat-subtext\">{t('mentor.approvedEv')}</p>"],
  ["<h3 className=\"card-title\">Student Progress</h3>", "<h3 className=\"card-title\">{t('mentor.studentProg')}</h3>"],
  ["<th>Student</th>", "<th>{t('mentor.thStudent')}</th>"],
  ["<th>Readiness</th>", "<th>{t('mentor.thReadiness')}</th>"],
  ["<th>Scenarios</th>", "<th>{t('mentor.thScenarios')}</th>"],
  ["<th>Risk</th>", "<th>{t('mentor.thRisk')}</th>"],
  ["<th>Last Active</th>", "<th>{t('mentor.thLastActive')}</th>"],
  ["<th>Actions</th>", "<th>{t('mentor.thActions')}</th>"],
  ["<h3 className=\"widget-title\">Pending Reviews</h3>", "<h3 className=\"widget-title\">{t('mentor.pendingRev')}</h3>"],
  ["All reviews completed! 🎉", "{t('mentor.allRevDone')}"],
  ["{sub.date === 'Today' ? 'Today' : 'Overdue'}", "{sub.date === 'Today' ? t('mentor.today') : t('mentor.overdue')}"],
  ["<h3 className=\"widget-title\">Unfinished Reminders</h3>", "<h3 className=\"widget-title\">{t('mentor.unfinReminders')}</h3>"],
  ["<h1 className=\"mentor-page-title\">Student List</h1>", "<h1 className=\"mentor-page-title\">{t('mentor.studListTitle')}</h1>"],
  ["<p className=\"mentor-page-subtitle\">Detailed engineering readiness progression tracking for active candidates.</p>", "<p className=\"mentor-page-subtitle\">{t('mentor.studListSub')}</p>"],
  ["<h3 className=\"card-title\">Active Candidates</h3>", "<h3 className=\"card-title\">{t('mentor.activeCand')}</h3>"],
  ["<th>Student Name</th>", "<th>{t('mentor.thName')}</th>"],
  ["<th>Target Industry</th>", "<th>{t('mentor.thIndustry')}</th>"],
  ["<th>Competency Level</th>", "<th>{t('mentor.thLevel')}</th>"],
  ["<th>Scenarios Solved</th>", "<th>{t('mentor.thSolved')}</th>"],
  ["Inspect Portfolio\n                            </button>", "{t('mentor.inspect')}\n                            </button>"],
  ["<h1 className=\"mentor-page-title\">Evidence Submissions</h1>", "<h1 className=\"mentor-page-title\">{t('mentor.subTitle')}</h1>"],
  ["<p className=\"mentor-page-subtitle\">Verify student incident write-ups and diagnostic process charts.</p>", "<p className=\"mentor-page-subtitle\">{t('mentor.subSub')}</p>"],
  ["<h3 className=\"card-title\">Solutions Queue</h3>", "<h3 className=\"card-title\">{t('mentor.queue')}</h3>"],
  ["<th>Candidate</th>", "<th>{t('mentor.thStudent')}</th>"],
  ["<th>Artifact Type</th>", "<th>{t('mentor.thArtifactType')}</th>"],
  ["<th>Evidence Artifact Name</th>", "<th>{t('mentor.thEvidenceName')}</th>"],
  ["<th>Submitted Date</th>", "<th>{t('mentor.thDate')}</th>"],
  ["<th>Status</th>", "<th>{t('mentor.thStatus')}</th>"],
  ["<th>Action</th>", "<th>{t('mentor.thActions')}</th>"],
  ["Approve\n                                  </button>", "{t('mentor.approve')}\n                                  </button>"],
  ["Revise\n                                  </button>", "{t('mentor.revise')}\n                                  </button>"],
  ["Assess Solution\n                                </button>", "{t('mentor.assess')}\n                                </button>"],
  ["<h3 className=\"master-title\">Mentees list</h3>", "<h3 className=\"master-title\">{t('mentor.menteeList')}</h3>"],
  ["<span className=\"readiness-score\">{st.readiness}% Ready</span>", "<span className=\"readiness-score\">{st.readiness}% {t('mentor.ready')}</span>"],
  ["<h4 className=\"section-card-title\">Job Readiness Index</h4>", "<h4 className=\"section-card-title\">{t('mentor.jobReadyIdx')}</h4>"],
  ["<p className=\"description\">Candidate has solved {currentStudent.scenarios} incident modules and met Stripe diagnostic standard benchmarks.</p>", "<p className=\"description\">{t('mentor.candHasSolved')} {currentStudent.scenarios} {t('mentor.incidentsMet')}</p>"],
  ["<h4 className=\"section-card-title\">Mentor Highlights</h4>", "<h4 className=\"section-card-title\">{t('mentor.highlightsTitle')}</h4>"],
  ["<p className=\"highlight-text\">{mentorHighlights[currentStudent.id] || 'No custom highlights provided yet.'}</p>", "<p className=\"highlight-text\">{mentorHighlights[currentStudent.id] || t('mentor.noHighlights')}</p>"],
  ["Update Highlights\n                      </button>", "{t('mentor.updateBtn')}\n                      </button>"],
  ["<h4 className=\"section-card-title\">Evidence Artifact Folder</h4>", "<h4 className=\"section-card-title\">{t('mentor.evFolder')}</h4>"],
  ["<span className=\"score-pill\">{ev.points} / 100 pts</span>", "<span className=\"score-pill\">{ev.points} / 100 {t('mentor.pts')}</span>"],
  ["<p>Loading candidate portfolio...</p>", "<p>{t('mentor.loadingCand')}</p>"]
];
doReplace('./src/screen/Mentor/MentorScreen.jsx', mentorReps);


// 3. AdminScreen
// Assuming AdminScreen has similar structures. Wait, let's just create generic replacements for AdminScreen.
let adminContent = "";
try {
  adminContent = fs.readFileSync('./src/screen/Admin/AdminScreen.jsx', 'utf8');
} catch(e) {
  // if not exists
}

if (adminContent) {
  const adminReps = [
    ["<div className=\"mentor-sidebar-header\">ADMIN PORTAL</div>", "<div className=\"mentor-sidebar-header\">{t('admin.portal')}</div>"],
    ["<span>Platform Overview</span>", "<span>{t('admin.dashboardTab')}</span>"],
    ["<span>User Management</span>", "<span>{t('admin.usersTab')}</span>"],
    ["<span>Scenario Content</span>", "<span>{t('admin.contentTab')}</span>"],
    ["<span>System Settings</span>", "<span>{t('admin.settingsTab')}</span>"],
    ["Sign out\n                </button>", "{t('mentor.signOut')}\n                </button>"],
    ["<h1 className=\"mentor-page-title\">Admin Dashboard</h1>", "<h1 className=\"mentor-page-title\">{t('admin.title')}</h1>"],
    ["<p className=\"mentor-page-subtitle\">System health, user metrics, and platform operations.</p>", "<p className=\"mentor-page-subtitle\">{t('admin.subtitle')}</p>"],
    ["<span className=\"mentor-stat-label color-blue\">Total Users</span>", "<span className=\"mentor-stat-label color-blue\">{t('admin.totalUsers')}</span>"],
    ["<span className=\"mentor-stat-label color-teal\">Active Scenarios</span>", "<span className=\"mentor-stat-label color-teal\">{t('admin.activeScenarios')}</span>"],
    ["<h3 className=\"card-title\">Users List</h3>", "<h3 className=\"card-title\">{t('admin.usersList')}</h3>"],
    ["<th>Role</th>", "<th>{t('admin.thRole')}</th>"],
    ["<th>Joined</th>", "<th>{t('admin.thJoined')}</th>"]
  ];
  doReplace('./src/screen/Admin/AdminScreen.jsx', adminReps);
}

console.log('done');
