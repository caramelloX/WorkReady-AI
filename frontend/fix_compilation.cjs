const fs = require('fs');

// 1. Fix EmployerScreen.jsx
const empFile = 'src/screen/Employer/EmployerScreen.jsx';
let empContent = fs.readFileSync(empFile, 'utf8');

// The activeTab dashboard block started, but where did it end?
// The syntax error is because `{activeTab === 'dashboard' && (<>` is NOT closed before `{/* 5. Candidate Detail Panel` or whatever.
// Let's just remove the `<>` and `</>` wrapper, and use a `<div>`.
if (empContent.includes("{activeTab === 'dashboard' && (<>")) {
    empContent = empContent.replace("{activeTab === 'dashboard' && (<>", "{activeTab === 'dashboard' && (<div>");
    // Find the end and replace `</>)}` with `</div>)}` or simply close it right before `{/* 5. Candidate Detail Panel`
    // Actually wait, earlier I tried to add `</>)}` at the end, but it didn't match `endBlock`.
    // Let's close it right before `{isPanelOpen && (` -- wait, I didn't find `isPanelOpen && (` earlier.
    
    // Instead of complex manipulation, let's just restore EmployerScreen.jsx and do it right.
}

// Better yet, let's fix ProfileCompletionModal.jsx and SkillAssessmentQuizModal.jsx first
const filesToFix = [
  'src/components/ProfileCompletionModal.jsx',
  'src/screen/Student/SkillAssessmentQuizModal.jsx',
  'src/screen/Student/AiSkillQuizModal.jsx' // just in case
];

for (const file of filesToFix) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove duplicate imports
    const importRegex = /import { useLanguage } from ['"](\.\.\/)*contexts\/LanguageContext['"];\s*/g;
    const importMatches = content.match(importRegex);
    if (importMatches && importMatches.length > 1) {
       // keep one
       let first = true;
       content = content.replace(importRegex, (match) => {
           if (first) { first = false; return match; }
           return '';
       });
    }

    // Remove duplicate `const { t } = useLanguage();`
    const tRegex = /const { t } = useLanguage\(\);\s*/g;
    const tMatches = content.match(tRegex);
    if (tMatches && tMatches.length > 1) {
       // keep one
       let first = true;
       content = content.replace(tRegex, (match) => {
           if (first) { first = false; return match; }
           return '';
       });
    }

    fs.writeFileSync(file, content);
  }
}

// For EmployerScreen, let's just manually fix the closing tag.
const empMatch = `        {/* 5. Candidate Detail Panel (Slide-out Modal) */}`;
if (empContent.includes(empMatch)) {
    if (!empContent.includes('</div>)}\n        {/* 5. Candidate Detail Panel')) {
        empContent = empContent.replace(empMatch, `</div>)}\n        ${empMatch}`);
    }
}
fs.writeFileSync(empFile, empContent);
console.log('Fixed compile errors');
