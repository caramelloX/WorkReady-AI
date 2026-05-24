import fs from 'fs';
const enPath = './src/i18n/en.json';
const thPath = './src/i18n/th.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const th = JSON.parse(fs.readFileSync(thPath, 'utf8'));

const newKeys = {
  "skillgap.title": ["Skill Gap Assessment", "การประเมินช่องว่างทักษะ"],
  "skillgap.subtitle": ["View your competencies based on your initial assessment.", "ดูความสามารถของคุณตามการประเมินเบื้องต้น"],
  "skillgap.overall": ["Overall Readiness", "ความพร้อมโดยรวม"],
  "skillgap.overallDesc": ["Composite from self-rating", "คะแนนรวมจากการประเมินตนเอง"],
  "skillgap.strengths": ["Strengths", "จุดแข็ง"],
  "skillgap.strengthsDesc": ["Rated High by student", "ได้รับคะแนนระดับสูงจากนักศึกษา"],
  "skillgap.gaps": ["Gaps to Close", "ช่องว่างที่ต้องปรับปรุง"],
  "skillgap.gapsDesc": ["Rated Low by student", "ได้รับคะแนนระดับต่ำจากนักศึกษา"],
  "skillgap.competencies": ["Competencies", "สมรรถนะ"],
  "skillgap.competenciesDesc": ["Tracked in this assessment", "ที่ติดตามในการประเมินนี้"],
  "skillgap.ratingQuestions": ["Rating questions", "คำถามเพื่อการประเมิน"],
  "skillgap.scaleLegend": ["Scale: Low — Medium — High", "ระดับ: ต่ำ — ปานกลาง — สูง"],
  "skillgap.q1": ["I can draw an end-to-end process map for an unfamiliar workflow.", "ฉันสามารถวาดแผนผังกระบวนการแบบ end-to-end สำหรับเวิร์กโฟลว์ที่ไม่คุ้นเคยได้"],
  "skillgap.q2": ["I can independently spot edge-case safety or quality regressions in existing systems.", "ฉันสามารถระบุความเสี่ยงด้านความปลอดภัยหรือคุณภาพแบบ edge-case ในระบบที่มีอยู่ได้ด้วยตนเอง"],
  "skillgap.q3": ["I know how to run a structured 5-Whys or fishbone analysis to find true root causes.", "ฉันรู้วิธีดำเนินการวิเคราะห์ 5-Whys หรือแผนภูมิก้างปลาเพื่อค้นหาสาเหตุที่แท้จริงได้"],
  "skillgap.q4": ["I can trace logs, metrics, or artifacts back to their source without getting lost.", "ฉันสามารถติดตามบันทึก ตัวชี้วัด หรืออาร์ติแฟกต์กลับไปยังแหล่งที่มาได้โดยไม่หลงทาง"],
  "skillgap.q5": ["I can write a crisp 1-page technical memo outlining an incident, root cause, and next steps.", "ฉันสามารถเขียนบันทึกเทคนิค 1 หน้าที่ชัดเจนซึ่งสรุปเหตุการณ์ สาเหตุที่แท้จริง และขั้นตอนถัดไปได้"],
  "skillgap.q6": ["I understand how to design and evaluate features to avoid bias and ensure fairness.", "ฉันเข้าใจวิธีการออกแบบและประเมินฟีเจอร์เพื่อหลีกเลี่ยงอคติและสร้างความมั่นใจในความยุติธรรม"],
  "skillgap.radarTitle": ["Skill-gap radar", "เรดาร์ช่องว่างทักษะ"],
  "skillgap.radarLegend": ["Blue/Teal — your current level. Outer borders — target proficiency", "สีฟ้า/เขียวอมฟ้า — ระดับปัจจุบันของคุณ ขอบด้านนอก — ความเชี่ยวชาญเป้าหมาย"],
  "skillgap.feedbackStrengths": ["Strengths", "จุดแข็ง"],
  "skillgap.noHighRatings": ["No High ratings yet — keep practicing.", "ยังไม่มีการประเมินในระดับสูง — ฝึกฝนต่อไป"],
  "skillgap.feedbackWeaknesses": ["Weaknesses", "จุดอ่อน"],
  "skillgap.noLowRatings": ["No Low ratings — nice work!", "ไม่มีการประเมินในระดับต่ำ — เยี่ยมมาก!"],
  "skillgap.recommended": ["Recommended training", "การฝึกอบรมที่แนะนำ"],
  "skillgap.thCompetency": ["Competency", "สมรรถนะ"],
  "skillgap.thCurrent": ["Current", "ปัจจุบัน"],
  "skillgap.thPriority": ["Priority", "ลำดับความสำคัญ"],
  "skillgap.thTrainNext": ["What to Train Next", "สิ่งที่ต้องฝึกฝนต่อไป"],
  "skillgap.fb1": ["Capable of mapping and optimizing workflows.", "มีความสามารถในการทำแผนผังและเพิ่มประสิทธิภาพของเวิร์กโฟลว์"],
  "skillgap.fb2": ["Skilled at isolating critical system threats.", "มีทักษะในการแยกแยะภัยคุกคามระบบที่สำคัญ"],
  "skillgap.fb3": ["Mastery of incident debug and 5-Why root-cause flows.", "มีความเชี่ยวชาญในการดีบักเหตุการณ์และค้นหาสาเหตุที่แท้จริงด้วย 5-Why"],
  "skillgap.fb4": ["Rigidly links features, code reviews, and automated builds.", "สามารถเชื่อมโยงฟีเจอร์ การตรวจสอบโค้ด และบิลด์อัตโนมัติได้อย่างรัดกุม"],
  "skillgap.fb5": ["Strong developer-advocacy post-mortem documentation skill.", "มีทักษะด้านเอกสาร post-mortem ที่แข็งแกร่ง"],
  "skillgap.fb6": ["Proactively inspects prompts and LLM security constraints.", "ตรวจสอบคำสั่งเชิงรุกและข้อจำกัดความปลอดภัย LLM"],
  "skillgap.rec1": ["Struggle to visualize architecture flows.", "พบความยากลำบากในการแสดงภาพกระแสสถาปัตยกรรม"],
  "skillgap.rec1act": ["Workshop: Mapping a production line using SIPOC + swimlane diagrams.", "เวิร์กชอป: การทำแผนที่สายการผลิตโดยใช้แผนภาพ SIPOC + swimlane"],
  "skillgap.rec2": ["Need guidelines to rank vulnerability scores.", "ต้องการแนวทางในการจัดอันดับคะแนนความเปราะบาง"],
  "skillgap.rec2act": ["Module: FMEA + 5-Why for a packaging-line near-miss case.", "โมดูล: FMEA + 5-Why สำหรับกรณี near-miss สายการบรรจุ"],
  "skillgap.rec3": ["Easily treat symptoms rather than root bugs.", "มักรักษาตามอาการมากกว่าที่จะแก้บั๊กที่ต้นเหตุ"],
  "skillgap.rec3act": ["Scenario S-102 — Database pool exhaustion: build the full RCA tree.", "สถานการณ์ S-102 — Database pool exhaustion: สร้างต้นไม้ RCA ฉบับเต็ม"],
  "skillgap.rec4": ["Lacks clean traceability indexes in test scripts.", "ขาดดัชนีการตรวจสอบย้อนกลับที่ชัดเจนในสคริปต์ทดสอบ"],
  "skillgap.rec4act": ["Lab: Build a traceability matrix linking requirements → tests → defects.", "ห้องปฏิบัติการ: สร้าง traceability matrix เชื่อมโยง requirements → tests → defects"],
  "skillgap.rec5": ["Need to clarify writing style for non-tech audiences.", "ต้องอธิบายสไตล์การเขียนให้ผู้ชมที่ไม่ใช่ช่างเทคนิคเข้าใจ"],
  "skillgap.rec5act": ["Practice: Draft a post-mortem memo for the Checkout API outage.", "ฝึกหัด: ร่างบันทึก post-mortem สำหรับการหยุดทำงานของ API การชำระเงิน"],
  "skillgap.rec6": ["Prone to blindly copying third-party chatbot answers.", "มีแนวโน้มที่จะคัดลอกคำตอบแชทบอทของบุคคลที่สามอย่างไม่ลืมหูลืมตา"],
  "skillgap.rec6act": ["Quiz: Responsible AI checklist + redaction practice on sample prompts.", "ควิซ: แบบสำรวจ AI อย่างรับผิดชอบ + ฝึกการแก้ไขคำสั่ง"]
};

for (const [key, [enStr, thStr]] of Object.entries(newKeys)) {
  en[key] = enStr;
  th[key] = thStr;
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(thPath, JSON.stringify(th, null, 2));

let content = fs.readFileSync('./src/screen/Student/StudentSkillGap.jsx', 'utf8');

// Add import
content = content.replace("import React from 'react';", "import React from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';");

// Add hook
content = content.replace(/export default function StudentSkillGap\((.*?)\) \{/, "export default function StudentSkillGap($1) {\n  const { t } = useLanguage();");

const replacements = [
  ["<h1 className=\"student-page-title\">Skill Gap Assessment</h1>", "<h1 className=\"student-page-title\">{t('skillgap.title')}</h1>"],
  ["<p className=\"student-page-subtitle\">View your competencies based on your initial assessment.</p>", "<p className=\"student-page-subtitle\">{t('skillgap.subtitle')}</p>"],
  ["<span className=\"label\">Overall Readiness</span>", "<span className=\"label\">{t('skillgap.overall')}</span>"],
  ["<p className=\"desc\">Composite from self-rating</p>", "<p className=\"desc\">{t('skillgap.overallDesc')}</p>"],
  ["<span className=\"label\">Strengths</span>", "<span className=\"label\">{t('skillgap.strengths')}</span>"],
  ["<p className=\"desc\">Rated High by student</p>", "<p className=\"desc\">{t('skillgap.strengthsDesc')}</p>"],
  ["<span className=\"label\">Gaps to Close</span>", "<span className=\"label\">{t('skillgap.gaps')}</span>"],
  ["<p className=\"desc\">Rated Low by student</p>", "<p className=\"desc\">{t('skillgap.gapsDesc')}</p>"],
  ["<span className=\"label\">Competencies</span>", "<span className=\"label\">{t('skillgap.competencies')}</span>"],
  ["<p className=\"desc\">Tracked in this assessment</p>", "<p className=\"desc\">{t('skillgap.competenciesDesc')}</p>"],
  ["<h4 className=\"skillgap-card-title\">Rating questions</h4>", "<h4 className=\"skillgap-card-title\">{t('skillgap.ratingQuestions')}</h4>"],
  ["<span className=\"skillgap-scale-legend\">Scale: Low — Medium — High</span>", "<span className=\"skillgap-scale-legend\">{t('skillgap.scaleLegend')}</span>"],
  ["<h5 className=\"skillgap-question-title\">Process Map</h5>", "<h5 className=\"skillgap-question-title\">{t('skills.processMapAss')}</h5>"],
  ["<span className=\"skillgap-item-text\">I can draw an end-to-end process map for an unfamiliar workflow.</span>", "<span className=\"skillgap-item-text\">{t('skillgap.q1')}</span>"],
  ["<h5 className=\"skillgap-question-title\">Safety & Quality Risk Identification</h5>", "<h5 className=\"skillgap-question-title\">{t('skills.safetyRiskAss')}</h5>"],
  ["<span className=\"skillgap-item-text\">I can independently spot edge-case safety or quality regressions in existing systems.</span>", "<span className=\"skillgap-item-text\">{t('skillgap.q2')}</span>"],
  ["<h5 className=\"skillgap-question-title\">Root Cause Analysis (RCA)</h5>", "<h5 className=\"skillgap-question-title\">{t('skills.rcaAss')}</h5>"],
  ["<span className=\"skillgap-item-text\">I know how to run a structured 5-Whys or fishbone analysis to find true root causes.</span>", "<span className=\"skillgap-item-text\">{t('skillgap.q3')}</span>"],
  ["<h5 className=\"skillgap-question-title\">Traceability</h5>", "<h5 className=\"skillgap-question-title\">{t('skills.traceabilityAss')}</h5>"],
  ["<span className=\"skillgap-item-text\">I can trace logs, metrics, or artifacts back to their source without getting lost.</span>", "<span className=\"skillgap-item-text\">{t('skillgap.q4')}</span>"],
  ["<h5 className=\"skillgap-question-title\">Technical Memo</h5>", "<h5 className=\"skillgap-question-title\">{t('skills.memoAss')}</h5>"],
  ["<span className=\"skillgap-item-text\">I can write a crisp 1-page technical memo outlining an incident, root cause, and next steps.</span>", "<span className=\"skillgap-item-text\">{t('skillgap.q5')}</span>"],
  ["<h5 className=\"skillgap-question-title\">Responsible AI Usage</h5>", "<h5 className=\"skillgap-question-title\">{t('skills.responsibleAiAss')}</h5>"],
  ["<span className=\"skillgap-item-text\">I understand how to design and evaluate features to avoid bias and ensure fairness.</span>", "<span className=\"skillgap-item-text\">{t('skillgap.q6')}</span>"],
  ["<h4 className=\"skillgap-card-title\">Skill-gap radar</h4>", "<h4 className=\"skillgap-card-title\">{t('skillgap.radarTitle')}</h4>"],
  ["<p className=\"skillgap-radar-legend\">Blue/Teal — your current level. Outer borders — target proficiency</p>", "<p className=\"skillgap-radar-legend\">{t('skillgap.radarLegend')}</p>"],
  [">Strengths</span>", ">{t('skillgap.strengths')}</span>"], // Note: span tag replacement
  [">Weaknesses</span>", ">{t('skillgap.feedbackWeaknesses')}</span>"],
  ["<p className=\"skillgap-feedback-empty\">No High ratings yet — keep practicing.</p>", "<p className=\"skillgap-feedback-empty\">{t('skillgap.noHighRatings')}</p>"],
  ["<p className=\"skillgap-feedback-empty\">No Low ratings — nice work!</p>", "<p className=\"skillgap-feedback-empty\">{t('skillgap.noLowRatings')}</p>"],
  ["<li><strong>Process Map:</strong> Capable of mapping and optimizing workflows.</li>", "<li><strong>{t('skills.processMapAss')}:</strong> {t('skillgap.fb1')}</li>"],
  ["<li><strong>Safety & Risk:</strong> Skilled at isolating critical system threats.</li>", "<li><strong>{t('skills.safetyRiskAss')}:</strong> {t('skillgap.fb2')}</li>"],
  ["<li><strong>RCA:</strong> Mastery of incident debug and 5-Why root-cause flows.</li>", "<li><strong>{t('skills.rcaAss')}:</strong> {t('skillgap.fb3')}</li>"],
  ["<li><strong>Traceability:</strong> Rigidly links features, code reviews, and automated builds.</li>", "<li><strong>{t('skills.traceabilityAss')}:</strong> {t('skillgap.fb4')}</li>"],
  ["<li><strong>Technical Memo:</strong> Strong developer-advocacy post-mortem documentation skill.</li>", "<li><strong>{t('skills.memoAss')}:</strong> {t('skillgap.fb5')}</li>"],
  ["<li><strong>Responsible AI:</strong> Proactively inspects prompts and LLM security constraints.</li>", "<li><strong>{t('skills.responsibleAiAss')}:</strong> {t('skillgap.fb6')}</li>"],
  ["<li><strong>Process Map:</strong> Struggle to visualize architecture flows. Recommendation: Workshop: Mapping a production line using SIPOC + swimlane diagrams.</li>", "<li><strong>{t('skills.processMapAss')}:</strong> {t('skillgap.rec1')} {t('skillgap.rec1act')}</li>"],
  ["<li><strong>Safety & Risk:</strong> Need guidelines to rank vulnerability scores. Recommendation: Module: FMEA + 5-Why for a packaging-line near-miss case.</li>", "<li><strong>{t('skills.safetyRiskAss')}:</strong> {t('skillgap.rec2')} {t('skillgap.rec2act')}</li>"],
  ["<li><strong>RCA:</strong> Easily treat symptoms rather than root bugs. Recommendation: Scenario S-102 — Database pool exhaustion: build the full RCA tree.</li>", "<li><strong>{t('skills.rcaAss')}:</strong> {t('skillgap.rec3')} {t('skillgap.rec3act')}</li>"],
  ["<li><strong>Traceability:</strong> Lacks clean traceability indexes in test scripts. Recommendation: Lab: Build a traceability matrix linking requirements &rarr; tests &rarr; defects.</li>", "<li><strong>{t('skills.traceabilityAss')}:</strong> {t('skillgap.rec4')} {t('skillgap.rec4act')}</li>"],
  ["<li><strong>Technical Memo:</strong> Need to clarify writing style for non-tech audiences. Recommendation: Practice: Draft a post-mortem memo for the Checkout API outage.</li>", "<li><strong>{t('skills.memoAss')}:</strong> {t('skillgap.rec5')} {t('skillgap.rec5act')}</li>"],
  ["<li><strong>Responsible AI:</strong> Prone to blindly copying third-party chatbot answers. Recommendation: Quiz: Responsible AI checklist + redaction practice on sample prompts.</li>", "<li><strong>{t('skills.responsibleAiAss')}:</strong> {t('skillgap.rec6')} {t('skillgap.rec6act')}</li>"],
  ["<h4 className=\"skillgap-card-title\" style={{ marginBottom: '20px' }}>Recommended training</h4>", "<h4 className=\"skillgap-card-title\" style={{ marginBottom: '20px' }}>{t('skillgap.recommended')}</h4>"],
  ["<th>Competency</th>", "<th>{t('skillgap.thCompetency')}</th>"],
  ["<th>Current</th>", "<th>{t('skillgap.thCurrent')}</th>"],
  ["<th>Priority</th>", "<th>{t('skillgap.thPriority')}</th>"],
  ["<th>What to Train Next</th>", "<th>{t('skillgap.thTrainNext')}</th>"],
  ["<td className=\"skillgap-table-competency\">Process Map</td>", "<td className=\"skillgap-table-competency\">{t('skills.processMapAss')}</td>"],
  ["<td>Workshop: Mapping a production line using SIPOC + swimlane diagrams.</td>", "<td>{t('skillgap.rec1act')}</td>"],
  ["<td className=\"skillgap-table-competency\">Safety & Quality Risk Identification</td>", "<td className=\"skillgap-table-competency\">{t('skills.safetyRiskAss')}</td>"],
  ["<td>Module: FMEA + 5-Why for a packaging-line near-miss case.</td>", "<td>{t('skillgap.rec2act')}</td>"],
  ["<td className=\"skillgap-table-competency\">Root Cause Analysis (RCA)</td>", "<td className=\"skillgap-table-competency\">{t('skills.rcaAss')}</td>"],
  ["<td>Scenario S-102 — Database pool exhaustion: build the full RCA tree.</td>", "<td>{t('skillgap.rec3act')}</td>"],
  ["<td className=\"skillgap-table-competency\">Traceability</td>", "<td className=\"skillgap-table-competency\">{t('skills.traceabilityAss')}</td>"],
  ["<td>Lab: Build a traceability matrix linking requirements &rarr; tests &rarr; defects.</td>", "<td>{t('skillgap.rec4act')}</td>"],
  ["<td className=\"skillgap-table-competency\">Technical Memo</td>", "<td className=\"skillgap-table-competency\">{t('skills.memoAss')}</td>"],
  ["<td>Practice: Draft a post-mortem memo for the Checkout API outage.</td>", "<td>{t('skillgap.rec5act')}</td>"],
  ["<td className=\"skillgap-table-competency\">Responsible AI Usage</td>", "<td className=\"skillgap-table-competency\">{t('skills.responsibleAiAss')}</td>"],
  ["<td>Quiz: Responsible AI checklist + redaction practice on sample prompts.</td>", "<td>{t('skillgap.rec6act')}</td>"]
];

for (const [from, to] of replacements) {
  content = content.replace(from, to);
}

fs.writeFileSync('./src/screen/Student/StudentSkillGap.jsx', content);
console.log('done');
