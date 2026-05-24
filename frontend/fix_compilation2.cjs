const fs = require('fs');

let file = 'src/screen/Employer/EmployerScreen.jsx';
let content = fs.readFileSync(file, 'utf8');

const target1 = `      {/* 5. Candidate Detail Panel (Slide-out Modal) */}`;
if (content.includes(target1) && !content.includes(`</div>)}\n\n      {/* 5. Candidate Detail Panel`)) {
    // We just need to insert `</div>)}` before this block if it's not already closed.
    // Wait, let's just make sure we close the `activeTab === 'dashboard'` wrapper.
    content = content.replace(target1, `</div>)}\n\n      ${target1}`);
    fs.writeFileSync(file, content);
    console.log('Fixed EmployerScreen.jsx');
}

file = 'src/screen/Student/SkillAssessmentQuizModal.jsx';
content = fs.readFileSync(file, 'utf8');
const target2 = /const QUIZ_QUESTIONS = getQuizQuestions\(t\);\s*/g;
const matches = content.match(target2);
if (matches && matches.length > 1) {
    let first = true;
    content = content.replace(target2, (m) => {
        if (first) { first = false; return m; }
        return '';
    });
    fs.writeFileSync(file, content);
    console.log('Fixed SkillAssessmentQuizModal.jsx');
}
