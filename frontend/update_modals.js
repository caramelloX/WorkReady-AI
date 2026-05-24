import fs from 'fs';
const enPath = './src/i18n/en.json';
const thPath = './src/i18n/th.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const th = JSON.parse(fs.readFileSync(thPath, 'utf8'));

const newKeys = {
  "aiquiz.generating": ["Generating your personalized assessment...", "กำลังสร้างการประเมินส่วนบุคคลของคุณ..."],
  "aiquiz.generatingDesc": ["Our AI is designing 50 questions to test your core skills. This may take a minute...", "AI ของเรากำลังออกแบบ 50 คำถามเพื่อทดสอบทักษะหลักของคุณ อาจใช้เวลาสักครู่..."],
  "aiquiz.error": ["Error", "ข้อผิดพลาด"],
  "aiquiz.close": ["Close", "ปิด"],
  "aiquiz.title": ["AI Occupation Simulator Quiz", "แบบทดสอบจำลองอาชีพด้วย AI"],
  "aiquiz.questionOf": ["QUESTION ", "คำถามที่ "],
  "aiquiz.of": [" OF ", " จาก "],
  "aiquiz.answered": [" answered", " ตอบแล้ว"],
  "aiquiz.previous": ["Previous", "ก่อนหน้า"],
  "aiquiz.scoring": ["Scoring...", "กำลังให้คะแนน..."],
  "aiquiz.finish": ["Finish Assessment →", "สิ้นสุดการประเมิน →"],
  "aiquiz.next": ["Next →", "ถัดไป →"],
  "quiz.title": ["Initial Skill Gap Assessment", "การประเมินช่องว่างทักษะเบื้องต้น"],
  "quiz.saving": ["Saving...", "กำลังบันทึก..."],
  "quiz.finishProfile": ["Finish & View Profile →", "เสร็จสิ้นและดูโปรไฟล์ →"],
  "quiz.q1": ["How comfortable are you with drawing end-to-end process maps?", "คุณมีความเชี่ยวชาญในการวาดแผนผังกระบวนการแบบ end-to-end มากแค่ไหน?"],
  "quiz.q1_opt1": ["I don't know how to create process maps.", "ฉันไม่รู้วิธีสร้างแผนผังกระบวนการ"],
  "quiz.q1_opt2": ["I can create basic flowcharts but struggle with complex workflows.", "ฉันสร้างโฟลว์ชาร์ตพื้นฐานได้แต่มีปัญหากับเวิร์กโฟลว์ที่ซับซ้อน"],
  "quiz.q1_opt3": ["I can confidently draw detailed end-to-end process maps for unfamiliar workflows.", "ฉันสามารถวาดแผนผังกระบวนการที่มีรายละเอียดอย่างมั่นใจสำหรับเวิร์กโฟลว์ที่ไม่คุ้นเคยได้"],
  "quiz.q2": ["How would you rate your ability to identify safety and quality risks?", "คุณประเมินความสามารถในการระบุความเสี่ยงด้านความปลอดภัยและคุณภาพของคุณอย่างไร?"],
  "quiz.q2_opt1": ["I rarely consider edge-case safety regressions.", "ฉันแทบไม่พิจารณาถึงข้อบกพร่องด้านความปลอดภัยที่เกิดจาก edge-case"],
  "quiz.q2_opt2": ["I can identify common risks but might miss complex system interactions.", "ฉันสามารถระบุความเสี่ยงทั่วไปได้แต่อาจพลาดปฏิกิริยาระบบที่ซับซ้อน"],
  "quiz.q2_opt3": ["I can independently spot edge-case safety or quality regressions in existing systems.", "ฉันสามารถระบุข้อบกพร่องด้านความปลอดภัยหรือคุณภาพแบบ edge-case ในระบบที่มีอยู่ได้ด้วยตนเอง"],
  "quiz.q3": ["How experienced are you with Root Cause Analysis (RCA)?", "คุณมีประสบการณ์เกี่ยวกับการวิเคราะห์หาสาเหตุ (RCA) มากน้อยเพียงใด?"],
  "quiz.q3_opt1": ["I usually just fix the immediate bug without structured analysis.", "ฉันมักจะแก้ไขข้อบกพร่องทันทีโดยไม่มีการวิเคราะห์ที่มีโครงสร้าง"],
  "quiz.q3_opt2": ["I know what RCA is but haven't run structured 5-Whys or fishbone reviews.", "ฉันรู้ว่า RCA คืออะไร แต่ไม่เคยใช้หลักการ 5-Why หรือแผนภูมิก้างปลา"],
  "quiz.q3_opt3": ["I know how to run a structured 5-Whys or fishbone analysis to find true root causes.", "ฉันรู้วิธีรัน 5-Whys หรือแผนภูมิก้างปลาเพื่อหาสาเหตุที่แท้จริงได้"],
  "quiz.q4": ["How well can you trace artifacts back to their source?", "คุณติดตามอาร์ติแฟกต์กลับไปยังแหล่งที่มาได้ดีแค่ไหน?"],
  "quiz.q4_opt1": ["I find it difficult to connect requirements with code and tests.", "ฉันพบว่าเป็นเรื่องยากที่จะเชื่อมโยงข้อกำหนดกับโค้ดและการทดสอบ"],
  "quiz.q4_opt2": ["I can somewhat trace artifacts but sometimes get lost in complex systems.", "ฉันพอที่จะติดตามอาร์ติแฟกต์ได้บ้าง แต่บางครั้งก็หลงทางในระบบที่ซับซ้อน"],
  "quiz.q4_opt3": ["I can trace logs, metrics, or artifacts back to their source without getting lost.", "ฉันสามารถติดตามบันทึก มาตรวัด หรืออาร์ติแฟกต์กลับไปยังแหล่งที่มาได้โดยไม่หลงทาง"],
  "quiz.q5": ["How comfortable are you writing technical incident memos?", "คุณรู้สึกสบายใจแค่ไหนในการเขียนบันทึกเหตุการณ์ทางเทคนิค?"],
  "quiz.q5_opt1": ["I have never written a technical incident report.", "ฉันไม่เคยเขียนรายงานเหตุการณ์ทางเทคนิค"],
  "quiz.q5_opt2": ["I can write a report but it's often unstructured or too detailed.", "ฉันสามารถเขียนรายงานได้ แต่มักจะไม่มีโครงสร้างหรือมีรายละเอียดมากเกินไป"],
  "quiz.q5_opt3": ["I can write a crisp 1-page technical memo outlining an incident, root cause, and next steps.", "ฉันสามารถเขียนบันทึกช่วยจำทางเทคนิค 1 หน้าที่ชัดเจนซึ่งสรุปเหตุการณ์ สาเหตุที่แท้จริง และขั้นตอนถัดไปได้"],
  "quiz.q6": ["How well do you understand Responsible AI practices?", "คุณเข้าใจแนวทางปฏิบัติเกี่ยวกับ AI อย่างรับผิดชอบดีเพียงใด?"],
  "quiz.q6_opt1": ["I am unfamiliar with designing features for fairness and avoiding bias.", "ฉันไม่คุ้นเคยกับการออกแบบคุณสมบัติเพื่อความยุติธรรมและหลีกเลี่ยงอคติ"],
  "quiz.q6_opt2": ["I have a basic understanding but lack practical experience evaluating AI bias.", "ฉันมีความเข้าใจพื้นฐานแต่ขาดประสบการณ์จริงในการประเมินอคติของ AI"],
  "quiz.q6_opt3": ["I understand how to design and evaluate features to avoid bias and ensure fairness.", "ฉันเข้าใจวิธีการออกแบบและประเมินคุณสมบัติเพื่อหลีกเลี่ยงอคติและรับประกันความยุติธรรม"],
  "profileModal.almost": ["Almost there, ", "เกือบเสร็จแล้ว, "],
  "profileModal.desc": ["Complete your profile to personalize your training dashboard. We use this data to tailor your simulations and pair you with relevant mentors.", "กรอกโปรไฟล์ของคุณเพื่อปรับแต่งแดชบอร์ดการฝึกอบรมของคุณ เราใช้ข้อมูลนี้เพื่อปรับแต่งการจำลองของคุณและจับคู่คุณกับเมนเทอร์ที่เหมาะสม"],
  "profileModal.step1": ["Academic Background", "ประวัติการศึกษา"],
  "profileModal.step2": ["Career Ambitions", "ความทะเยอทะยานในอาชีพ"],
  "profileModal.step3": ["Skills Assessment", "การประเมินทักษะ"],
  "profileModal.details": ["Profile Details", "รายละเอียดโปรไฟล์"],
  "profileModal.major": ["Major / Degree Focus", "วิชาเอก / สาขาที่ศึกษา"],
  "profileModal.majorPh": ["e.g. Computer Science", "เช่น วิทยาการคอมพิวเตอร์"],
  "profileModal.education": ["Education Level", "ระดับการศึกษา"],
  "profileModal.bachelor": ["Bachelor's (Final year)", "ปริญญาตรี (ปีสุดท้าย)"],
  "profileModal.bootcamp": ["Bootcamp Graduate", "สำเร็จการศึกษาจาก Bootcamp"],
  "profileModal.industry": ["Target Industry", "อุตสาหกรรมเป้าหมาย"],
  "profileModal.industryPh": ["e.g. Fintech", "เช่น Fintech"],
  "profileModal.occupation": ["Occupation Goal", "เป้าหมายอาชีพ"],
  "profileModal.occupationPh": ["e.g. Backend Engineer", "เช่น วิศวกร Backend"],
  "profileModal.career": ["Career Goal Description", "รายละเอียดเป้าหมายอาชีพ"],
  "profileModal.careerPh": ["e.g. Land a backend role at a Series B+ startup", "เช่น หางาน Backend ในสตาร์ทอัพ Series B+"],
  "profileModal.strengths": ["Key Strengths (comma separated)", "จุดแข็งที่สำคัญ (คั่นด้วยจุลภาค)"],
  "profileModal.strengthsPh": ["e.g. System design, Python", "เช่น การออกแบบระบบ, Python"],
  "profileModal.develop": ["Areas to Develop (comma separated)", "พื้นที่ที่ต้องพัฒนา (คั่นด้วยจุลภาค)"],
  "profileModal.developPh": ["e.g. Cloud architecture, CI/CD", "เช่น สถาปัตยกรรมคลาวด์, CI/CD"],
  "profileModal.complete": ["Complete Profile", "เสร็จสิ้นโปรไฟล์"],
  "profileModal.error": ["Failed to update profile.", "ไม่สามารถอัปเดตโปรไฟล์ได้"]
};

for (const [key, [enStr, thStr]] of Object.entries(newKeys)) {
  en[key] = enStr;
  th[key] = thStr;
}

fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
fs.writeFileSync(thPath, JSON.stringify(th, null, 2));

// Update AiSkillQuizModal
let aiQuiz = fs.readFileSync('./src/screen/Student/AiSkillQuizModal.jsx', 'utf8');
aiQuiz = aiQuiz.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';");
aiQuiz = aiQuiz.replace(/export default function AiSkillQuizModal\((.*?)\) \{/, "export default function AiSkillQuizModal($1) {\n  const { t } = useLanguage();");
const aiRep = [
  ["<h2 className=\"quiz-modal-title\" style={{ textAlign: 'center' }}>Generating your personalized {occupationGoal} assessment...</h2>", "<h2 className=\"quiz-modal-title\" style={{ textAlign: 'center' }}>{t('aiquiz.generating').replace('...', '')} {occupationGoal} {t('aiquiz.generating').split(' ')[2] || ''}...</h2>"],
  ["<p style={{ color: '#8892b0', marginTop: '10px' }}>Our AI is designing 50 questions to test your core skills. This may take a minute...</p>", "<p style={{ color: '#8892b0', marginTop: '10px' }}>{t('aiquiz.generatingDesc')}</p>"],
  ["<h2 className=\"quiz-modal-title\" style={{ color: '#ff6b6b' }}>Error</h2>", "<h2 className=\"quiz-modal-title\" style={{ color: '#ff6b6b' }}>{t('aiquiz.error')}</h2>"],
  [">Close</button>", ">{t('aiquiz.close')}</button>"],
  ["<h2 className=\"quiz-modal-title\">AI Occupation Simulator Quiz</h2>", "<h2 className=\"quiz-modal-title\">{t('aiquiz.title')}</h2>"],
  ["<span className=\"quiz-progress-text\">QUESTION {currentStep} OF {totalSteps}</span>", "<span className=\"quiz-progress-text\">{t('aiquiz.questionOf')}{currentStep}{t('aiquiz.of')}{totalSteps}</span>"],
  ["<span className=\"quiz-progress-text\">{answeredCount}/{totalSteps} answered</span>", "<span className=\"quiz-progress-text\">{answeredCount}/{totalSteps}{t('aiquiz.answered')}</span>"],
  ["Previous\n          </button>", "{t('aiquiz.previous')}\n          </button>"],
  ["{isSubmitting ? 'Scoring...' : currentStep === totalSteps ? 'Finish Assessment →' : 'Next →'}", "{isSubmitting ? t('aiquiz.scoring') : currentStep === totalSteps ? t('aiquiz.finish') : t('aiquiz.next')}"]
];
for (const [from, to] of aiRep) aiQuiz = aiQuiz.replace(from, to);

// Hack for fixing interpolation logic
aiQuiz = aiQuiz.replace(
  /<h2 className="quiz-modal-title" style=\{\{ textAlign: 'center' \}\}>.*<\/h2>/,
  `<h2 className="quiz-modal-title" style={{ textAlign: 'center' }}>{t('aiquiz.generating')}</h2>`
);
fs.writeFileSync('./src/screen/Student/AiSkillQuizModal.jsx', aiQuiz);

// Update SkillAssessmentQuizModal
let skillQuiz = fs.readFileSync('./src/screen/Student/SkillAssessmentQuizModal.jsx', 'utf8');
skillQuiz = skillQuiz.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useLanguage } from '../../contexts/LanguageContext';");
skillQuiz = skillQuiz.replace(/export default function SkillAssessmentQuizModal\((.*?)\) \{/, "export default function SkillAssessmentQuizModal($1) {\n  const { t } = useLanguage();");

skillQuiz = skillQuiz.replace(
  /const QUIZ_QUESTIONS = \[\s*\{\s*id: 'processMap'[\s\S]*?\}\s*\];/g,
  `const getQuizQuestions = (t) => [
  { id: 'processMap', question: t('quiz.q1'), options: [t('quiz.q1_opt1'), t('quiz.q1_opt2'), t('quiz.q1_opt3')] },
  { id: 'safetyRisk', question: t('quiz.q2'), options: [t('quiz.q2_opt1'), t('quiz.q2_opt2'), t('quiz.q2_opt3')] },
  { id: 'rca', question: t('quiz.q3'), options: [t('quiz.q3_opt1'), t('quiz.q3_opt2'), t('quiz.q3_opt3')] },
  { id: 'traceability', question: t('quiz.q4'), options: [t('quiz.q4_opt1'), t('quiz.q4_opt2'), t('quiz.q4_opt3')] },
  { id: 'memo', question: t('quiz.q5'), options: [t('quiz.q5_opt1'), t('quiz.q5_opt2'), t('quiz.q5_opt3')] },
  { id: 'responsibleAi', question: t('quiz.q6'), options: [t('quiz.q6_opt1'), t('quiz.q6_opt2'), t('quiz.q6_opt3')] }
];`
);

skillQuiz = skillQuiz.replace("const totalSteps = QUIZ_QUESTIONS.length;", "const QUIZ_QUESTIONS = getQuizQuestions(t);\n  const totalSteps = QUIZ_QUESTIONS.length;");

const skillRep = [
  ["<h2 className=\"quiz-modal-title\">Initial Skill Gap Assessment</h2>", "<h2 className=\"quiz-modal-title\">{t('quiz.title')}</h2>"],
  ["<span className=\"quiz-progress-text\">QUESTION {currentStep} OF {totalSteps}</span>", "<span className=\"quiz-progress-text\">{t('aiquiz.questionOf')}{currentStep}{t('aiquiz.of')}{totalSteps}</span>"],
  ["<span className=\"quiz-progress-text\">{answeredCount}/{totalSteps} answered</span>", "<span className=\"quiz-progress-text\">{answeredCount}/{totalSteps}{t('aiquiz.answered')}</span>"],
  ["Previous\n          </button>", "{t('aiquiz.previous')}\n          </button>"],
  ["{isSubmitting ? 'Saving...' : currentStep === totalSteps ? 'Finish & View Profile →' : 'Next →'}", "{isSubmitting ? t('quiz.saving') : currentStep === totalSteps ? t('quiz.finishProfile') : t('aiquiz.next')}"]
];
for (const [from, to] of skillRep) skillQuiz = skillQuiz.replace(from, to);

fs.writeFileSync('./src/screen/Student/SkillAssessmentQuizModal.jsx', skillQuiz);


// Update ProfileCompletionModal
let profMod = fs.readFileSync('./src/components/ProfileCompletionModal.jsx', 'utf8');
profMod = profMod.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useLanguage } from '../contexts/LanguageContext';");
profMod = profMod.replace(/export default function ProfileCompletionModal\((.*?)\) \{/, "export default function ProfileCompletionModal($1) {\n  const { t } = useLanguage();");
const profRep = [
  ["<h2>Almost there, {user?.fullname?.split(' ')[0] || 'Student'}!</h2>", "<h2>{t('profileModal.almost')}{user?.fullname?.split(' ')[0] || 'Student'}!</h2>"],
  ["Complete your profile to personalize your training dashboard. \n            We use this data to tailor your simulations and pair you with relevant mentors.", "{t('profileModal.desc')}"],
  ["<span>Academic Background</span>", "<span>{t('profileModal.step1')}</span>"],
  ["<span>Career Ambitions</span>", "<span>{t('profileModal.step2')}</span>"],
  ["<span>Skills Assessment</span>", "<span>{t('profileModal.step3')}</span>"],
  ["<h3>Profile Details</h3>", "<h3>{t('profileModal.details')}</h3>"],
  ["<label>Major / Degree Focus</label>", "<label>{t('profileModal.major')}</label>"],
  ["placeholder=\"e.g. Computer Science\"", "placeholder={t('profileModal.majorPh')}"],
  ["<label>Education Level</label>", "<label>{t('profileModal.education')}</label>"],
  [">Bachelor's (Final year)</option>", ">{t('profileModal.bachelor')}</option>"],
  [">Bootcamp Graduate</option>", ">{t('profileModal.bootcamp')}</option>"],
  ["<label>Target Industry</label>", "<label>{t('profileModal.industry')}</label>"],
  ["placeholder=\"e.g. Fintech\"", "placeholder={t('profileModal.industryPh')}"],
  ["<label>Occupation Goal</label>", "<label>{t('profileModal.occupation')}</label>"],
  ["placeholder=\"e.g. Backend Engineer\"", "placeholder={t('profileModal.occupationPh')}"],
  ["<label>Career Goal Description</label>", "<label>{t('profileModal.career')}</label>"],
  ["placeholder=\"e.g. Land a backend role at a Series B+ startup\"", "placeholder={t('profileModal.careerPh')}"],
  ["<label>Key Strengths (comma separated)</label>", "<label>{t('profileModal.strengths')}</label>"],
  ["placeholder=\"e.g. System design, Python\"", "placeholder={t('profileModal.strengthsPh')}"],
  ["<label>Areas to Develop (comma separated)</label>", "<label>{t('profileModal.develop')}</label>"],
  ["placeholder=\"e.g. Cloud architecture, CI/CD\"", "placeholder={t('profileModal.developPh')}"],
  [") : 'Complete Profile'}", ") : t('profileModal.complete')}"],
  ["setError('Failed to update profile.');", "setError(t('profileModal.error'));"]
];
for (const [from, to] of profRep) profMod = profMod.replace(from, to);

fs.writeFileSync('./src/components/ProfileCompletionModal.jsx', profMod);
console.log('done');
