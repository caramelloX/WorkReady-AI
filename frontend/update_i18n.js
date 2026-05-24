import fs from 'fs';
const enPath = './src/i18n/en.json';
const thPath = './src/i18n/th.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const th = JSON.parse(fs.readFileSync(thPath, 'utf8'));

const newKeys = {
  "dashboard.welcome": ["Welcome back", "ยินดีต้อนรับกลับมา"],
  "dashboard.subtitle": ["Here's where you stand today, and what to tackle next.", "นี่คือสถานะปัจจุบันของคุณ และสิ่งที่คุณต้องทำต่อไป"],
  "dashboard.continueTraining": ["Continue training", "ดำเนินการฝึกฝนต่อ"],
  "dashboard.cohortPrefix": ["Cohort 2026 — ", "รุ่นปี 2026 — "],
  "dashboard.cohortSuffix": [" Track", " สาขา"],
  "dashboard.major": ["MAJOR", "วิชาเอก"],
  "dashboard.occupationGoal": ["OCCUPATION GOAL", "เป้าหมายอาชีพ"],
  "dashboard.targeting": ["Targeting ", "เป้าหมาย "],
  "dashboard.goals": ["GOALS", "เป้าหมาย"],
  "dashboard.goal1": ["Reach Work-Ready Score 85", "ทำคะแนนความพร้อมในการทำงานให้ถึง 85"],
  "dashboard.goal2": ["Ship 3 mentor-reviewed memos", "ส่งบันทึกที่ผ่านการตรวจสอบจากเมนเทอร์ 3 ฉบับ"],
  "dashboard.goal3": ["Land summer internship", "ได้งานฝึกงานภาคฤดูร้อน"],
  "dashboard.viewPortfolio": ["View Portfolio", "ดูแฟ้มสะสมผลงาน"],
  "dashboard.portfolioDesc": ["9 mentor-reviewed evidence items", "หลักฐานที่ตรวจสอบโดยเมนเทอร์ 9 รายการ"],
  "dashboard.viewFeedback": ["View Feedback", "ดูข้อเสนอแนะ"],
  "dashboard.feedbackDesc": ["Mentor + AI coach notes on your work", "บันทึกจากเมนเทอร์และโค้ช AI เกี่ยวกับผลงานของคุณ"],
  "dashboard.checkReadiness": ["Check Readiness Score", "ตรวจสอบคะแนนความพร้อม"],
  "dashboard.readinessAgainst": ["/100 against ", "/100 เทียบกับสาขา "],
  "dashboard.yourTrack": ["your track", "สาขาของคุณ"],
  "dashboard.workReadyScore": ["WORK-READY SCORE", "คะแนนความพร้อมในการทำงาน"],
  "dashboard.vsTrack": ["vs ", "เทียบกับ "],
  "dashboard.scenariosCompleted": ["SCENARIOS COMPLETED", "สถานการณ์ที่สำเร็จ"],
  "dashboard.rcaRating": ["RCA COACH RATING", "คะแนนโค้ช RCA"],
  "dashboard.streak": ["STREAK", "ความต่อเนื่อง"],
  "dashboard.breakdownTitle": ["Work-Ready Score breakdown", "รายละเอียดคะแนนความพร้อมในการทำงาน"],
  "dashboard.breakdownDesc": ["Weighted coverage of skills required for Backend Software Engineer against your current levels.", "น้ำหนักครอบคลุมทักษะที่จำเป็นสำหรับวิศวกรซอฟต์แวร์ Backend เทียบกับระดับปัจจุบันของคุณ"],
  "dashboard.biggestGap": ["Biggest gap: ", "ช่องว่างที่ใหญ่ที่สุด: "],
  "dashboard.scoreFormula": ["Score = Σ (skill coverage × occupation weight). Coverage is capped at the role's target per skill.", "คะแนน = Σ (ความครอบคลุมทักษะ × น้ำหนักอาชีพ) ความครอบคลุมถูกจำกัดที่เป้าหมายของบทบาทต่อทักษะ"],
  "dashboard.upcomingScenarios": ["Upcoming scenarios", "สถานการณ์ที่กำลังจะมาถึง"],
  "dashboard.viewAll": ["View all", "ดูทั้งหมด"],
  "dashboard.open": ["Open", "เปิด"],
  "dashboard.topSkillGaps": ["Top skill gaps", "ช่องว่างทักษะอันดับต้น ๆ"],
  "dashboard.fullAssessment": ["Full assessment", "การประเมินผลฉบับเต็ม"],
  "dashboard.badgesEarned": ["Badges earned", "ป้ายรางวัลที่ได้รับ"],
  "dashboard.badge1": ["Clean Coder", "ผู้เขียนโค้ดสะอาด"],
  "dashboard.badge2": ["Incident Responder", "ผู้ตอบสนองต่อเหตุการณ์"],
  "dashboard.badge3": ["Code Reviewer", "ผู้ตรวจสอบโค้ด"],
  "dashboard.badge4": ["System Designer", "ผู้ออกแบบระบบ"],
  "dashboard.thisWeek": ["This week", "สัปดาห์นี้"],
  "dashboard.thisWeekDesc": ["3 scenarios, 2 RCA reviews, 1 memo drafted.", "3 สถานการณ์, ตรวจสอบ RCA 2 ครั้ง, ร่างบันทึก 1 ฉบับ"],
  "dashboard.nextMentorSync": ["Next mentor sync", "ซิงค์กับเมนเทอร์ครั้งถัดไป"],
  "dashboard.nextMentorSyncDesc": ["Fri, 12:30 PM with M. Iyer (Staff Engineer, Razorpay).", "วันศุกร์ 12:30 น. กับ M. Iyer (วิศวกรอาวุโส, Razorpay)"],
  "skills.processMap": ["System Design", "การออกแบบระบบ"],
  "skills.safetyRisk": ["Cloud & DevOps (AWS/Docker)", "คลาวด์และ DevOps (AWS/Docker)"],
  "skills.rca": ["Git & Code Review", "Git และการตรวจสอบโค้ด"],
  "skills.traceability": ["Data Structures & Algorithms", "โครงสร้างข้อมูลและอัลกอริทึม"],
  "skills.memo": ["Secure Coding (OWASP)", "การเขียนโค้ดที่ปลอดภัย (OWASP)"],
  "skills.responsibleAi": ["Technical Writing", "การเขียนเชิงเทคนิค"],
  "skills.processMapAss": ["Process Map", "แผนผังกระบวนการ"],
  "skills.safetyRiskAss": ["Safety & Quality Risk Identification", "การระบุความเสี่ยงด้านความปลอดภัยและคุณภาพ"],
  "skills.rcaAss": ["Root Cause Analysis (RCA)", "การวิเคราะห์สาเหตุที่แท้จริง (RCA)"],
  "skills.traceabilityAss": ["Traceability", "การตรวจสอบย้อนกลับ"],
  "skills.memoAss": ["Technical Memo", "บันทึกเชิงเทคนิค"],
  "skills.responsibleAiAss": ["Responsible AI Usage", "การใช้งาน AI อย่างรับผิดชอบ"]
};

for (const [key, [enStr, thStr]] of Object.entries(newKeys)) {
  en[key] = enStr;
  th[key] = thStr;
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(thPath, JSON.stringify(th, null, 2));
console.log('updated');
