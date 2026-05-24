import fs from 'fs';
const enPath = './src/i18n/en.json';
const thPath = './src/i18n/th.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const th = JSON.parse(fs.readFileSync(thPath, 'utf8'));

const newKeys = {
  "sim.title": ["Scenario Simulator", "เครื่องจำลองสถานการณ์"],
  "sim.subtitle": ["Step into a live production system. Diagnose. Decide. Defend your choices.", "ก้าวเข้าสู่ระบบการผลิตจริง วินิจฉัย ตัดสินใจ และปกป้องทางเลือกของคุณ"],
  "sim.library": ["Scenario library", "คลังสถานการณ์"],
  "sim.generatingAi": ["Generating AI...", "กำลังสร้าง AI..."],
  "sim.aiGenerate": ["✨ AI Generate", "✨ สร้างด้วย AI"],
  "sim.min30": ["30 min", "30 นาที"],
  "sim.intermediate": ["Intermediate", "ระดับกลาง"],
  "sim.launch": ["Launch simulation", "เปิดใช้การจำลอง"],
  "sim.briefing": ["Briefing", "สรุปข้อมูล"],
  "sim.briefingDesc": ["The incident commander has escalated an active issue to you. Check the logs and engage with the AI Coach to resolve it.", "ผู้บัญชาการเหตุการณ์ได้ส่งต่อปัญหาที่ทำงานอยู่ให้กับคุณ ตรวจสอบบันทึกและปรึกษาโค้ช AI เพื่อแก้ไข"],
  "sim.objectives": ["Your Objectives", "วัตถุประสงค์ของคุณ"],
  "sim.obj1": ["Identify root cause", "ระบุสาเหตุที่แท้จริง"],
  "sim.obj2": ["Recommend fix", "แนะนำวิธีแก้ไข"],
  "sim.aiEval": ["AI Coach Will Evaluate", "สิ่งที่โค้ช AI จะประเมิน"],
  "sim.eval1": ["Diagnostic speed", "ความเร็วในการวินิจฉัย"],
  "sim.eval2": ["Accuracy", "ความแม่นยำ"],
  "sim.stagingShell": ["Staging Shell", "เชลล์จำลอง (Staging)"],
  "sim.selectStrategy": ["Select Diagnostic Strategy:", "เลือกกลยุทธ์การวินิจฉัย:"],
  "sim.cleared": ["🎉 Scenario Successfully Cleared!", "🎉 ผ่านสถานการณ์เรียบร้อยแล้ว!"],
  "sim.clearedDesc": ["Your evidence memo has been compiled and submitted to Emily Vance for validation.", "บันทึกหลักฐานของคุณได้รับการรวบรวมและส่งให้ผู้ประเมินตรวจสอบแล้ว"],
  "sim.goToPortfolio": ["Go to Evidence Portfolio", "ไปที่แฟ้มสะสมผลงาน"],
  "sim.coachName": ["AI Incident Coach", "โค้ช AI สำหรับเหตุการณ์"],
  "sim.coachStatus": ["● Live SRE Coach", "● โค้ช SRE สด"],
  "sim.chatPlaceholder": ["Type a message to the AI coach...", "พิมพ์ข้อความถึงโค้ช AI..."],
  "sim.quit": ["Quit Simulation", "ออกจากการจำลอง"],
  "sim.stagingPod": ["Staging Pod: deployment-coupon-verify-4491-db-slot", "พ็อดจำลอง: deployment-coupon-verify-4491-db-slot"]
};

for (const [key, [enStr, thStr]] of Object.entries(newKeys)) {
  en[key] = enStr;
  th[key] = thStr;
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(thPath, JSON.stringify(th, null, 2));

let content = fs.readFileSync('./src/screen/Student/StudentScenarioSimulator.jsx', 'utf8');

// Add import
content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';");

// Add hook
content = content.replace(/export default function StudentScenarioSimulator\((.*?)\) \{/, "export default function StudentScenarioSimulator($1) {\n  const { t } = useLanguage();");

const replacements = [
  ["<h1 className=\"student-page-title\">Scenario Simulator</h1>", "<h1 className=\"student-page-title\">{t('sim.title')}</h1>"],
  ["<p className=\"student-page-subtitle\">Step into a live production system. Diagnose. Decide. Defend your choices.</p>", "<p className=\"student-page-subtitle\">{t('sim.subtitle')}</p>"],
  ["<h3 className=\"scenario-library-title\" style={{ marginBottom: 0 }}>Scenario library</h3>", "<h3 className=\"scenario-library-title\" style={{ marginBottom: 0 }}>{t('sim.library')}</h3>"],
  ["{isGenerating ? 'Generating AI...' : '✨ AI Generate'}", "{isGenerating ? t('sim.generatingAi') : t('sim.aiGenerate')}"],
  ["{selectedScenario.estimatedTime || '30 min'}", "{selectedScenario.estimatedTime || t('sim.min30')}"],
  ["{selectedScenario.tags?.[0] || 'Intermediate'}", "{selectedScenario.tags?.[0] || t('sim.intermediate')}"],
  ["Launch simulation\n                </button>", "{t('sim.launch')}\n                </button>"],
  ["<h4 className=\"detail-card-title\">Briefing</h4>", "<h4 className=\"detail-card-title\">{t('sim.briefing')}</h4>"],
  ["{selectedScenario.briefing || \"The incident commander has escalated an active issue to you. Check the logs and engage with the AI Coach to resolve it.\"}", "{selectedScenario.briefing || t('sim.briefingDesc')}"],
  ["<h4 className=\"detail-card-title\">Your Objectives</h4>", "<h4 className=\"detail-card-title\">{t('sim.objectives')}</h4>"],
  ["(selectedScenario.objectives || ['Identify root cause', 'Recommend fix'])", "(selectedScenario.objectives || [t('sim.obj1'), t('sim.obj2')])"],
  ["<h4 className=\"detail-card-title\">AI Coach Will Evaluate</h4>", "<h4 className=\"detail-card-title\">{t('sim.aiEval')}</h4>"],
  ["(selectedScenario.evaluationCriteria || ['Diagnostic speed', 'Accuracy'])", "(selectedScenario.evaluationCriteria || [t('sim.eval1'), t('sim.eval2')])"],
  ["<span className=\"simulator-terminal-title\">Staging Shell · {activeScenario.id}</span>", "<span className=\"simulator-terminal-title\">{t('sim.stagingShell')} · {activeScenario.id}</span>"],
  ["<span className=\"simulator-choice-title\">Select Diagnostic Strategy:</span>", "<span className=\"simulator-choice-title\">{t('sim.selectStrategy')}</span>"],
  ["<h4 style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-heading)' }}>🎉 Scenario Successfully Cleared!</h4>", "<h4 style={{ margin: '0 0 8px 0', fontFamily: 'var(--font-heading)' }}>{t('sim.cleared')}</h4>"],
  ["<p style={{ margin: 0, fontSize: '13px' }}>Your evidence memo has been compiled and submitted to Emily Vance for validation.</p>", "<p style={{ margin: 0, fontSize: '13px' }}>{t('sim.clearedDesc')}</p>"],
  [">Go to Evidence Portfolio</button>", ">{t('sim.goToPortfolio')}</button>"],
  ["<h4 className=\"simulator-chat-coach-name\">AI Incident Coach</h4>", "<h4 className=\"simulator-chat-coach-name\">{t('sim.coachName')}</h4>"],
  ["<span className=\"simulator-chat-coach-status\">● Live SRE Coach</span>", "<span className=\"simulator-chat-coach-status\">{t('sim.coachStatus')}</span>"],
  ["placeholder=\"Type a message to the AI coach...\"", "placeholder={t('sim.chatPlaceholder')}"],
  ["Quit Simulation\n                  </button>", "{t('sim.quit')}\n                  </button>"],
  ["<span style={{ fontSize: '12px', color: '#94a3b8' }}>Staging Pod: deployment-coupon-verify-4491-db-slot</span>", "<span style={{ fontSize: '12px', color: '#94a3b8' }}>{t('sim.stagingPod')}</span>"]
];

for (const [from, to] of replacements) {
  content = content.replace(from, to);
}

fs.writeFileSync('./src/screen/Student/StudentScenarioSimulator.jsx', content);
console.log('done');
