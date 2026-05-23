const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'frontend/src/screen/Student/StudentScreen.jsx');
let content = fs.readFileSync(file, 'utf8');

// The markers for each section
const sections = [
  {
    name: 'StudentDashboard',
    startTag: "{/* DASHBOARD TAB */}",
    endTag: "        {/* PROFILE TAB */}",
    props: "{ firstName, initials, fullName, targetTrack, major, educationLevel, occupationGoal, targetIndustry, setActiveTab, scenarios, handleOpenScenario }",
    componentOpen: "<div className=\"student-tab-panel dashboard-container-updated\">",
    tabCondition: "{activeTab === 'dashboard' && ("
  },
  {
    name: 'StudentProfile',
    startTag: "{/* PROFILE TAB */}",
    endTag: "        {/* SKILL GAP TAB */}",
    props: "{ initials, fullName, targetTrack, major, educationLevel, occupationGoal, targetIndustry, email, careerGoal, strengthsList, developAreasList }",
    componentOpen: "<div className=\"student-tab-panel profile-container\">",
    tabCondition: "{activeTab === 'profile' && ("
  },
  {
    name: 'StudentSkillGap',
    startTag: "{/* SKILL GAP TAB */}",
    endTag: "        {/* SCENARIO SIMULATOR TAB */}",
    props: "{ ratings, handleRate, handleResetRatings, calculateRadarPoints, overallReadiness, strengthsCount, gapsCount }",
    componentOpen: "<div className=\"student-tab-panel skillgap-container\">",
    tabCondition: "{activeTab === 'skillgap' && ("
  },
  {
    name: 'StudentScenarioSimulator',
    startTag: "{/* SCENARIO SIMULATOR TAB */}",
    endTag: "        {/* EVIDENCE PORTFOLIO TAB */}",
    props: "{ scenarios, activeScenario, handleOpenScenario, handleLaunchScenario, simCompleted, stepIndex, terminalLogs, chatMessages, inputVal, setInputVal, handleSendChat, choicesForStep }",
    componentOpen: "<div className=\"student-tab-panel simulator-container\">",
    tabCondition: "{activeTab === 'simulator' && ("
  },
  {
    name: 'StudentEvidencePortfolio',
    startTag: "{/* EVIDENCE PORTFOLIO TAB */}",
    endTag: "      </div>\n    </div>",
    props: "{ portfolioItems, handleSubmitPortfolio, onNavigate }",
    componentOpen: "<div className=\"student-tab-panel portfolio-container\">",
    tabCondition: "{activeTab === 'portfolio' && ("
  }
];

let imports = [];

for (const sec of sections) {
  const startIdx = content.indexOf(sec.startTag);
  const endIdx = content.indexOf(sec.endTag);
  
  if (startIdx === -1) {
    console.error(`Could not find start for ${sec.name}`);
    continue;
  }
  
  // For the last section, we just find the last </div></div>
  let extracted = '';
  if (sec.name === 'StudentEvidencePortfolio') {
    // Find the last </div></div> manually to be safe
    const lastPart = content.substring(startIdx);
    const endStr = "      </div>\n    </div>\n  );\n}";
    const actualEndIdx = content.lastIndexOf(endStr);
    extracted = content.substring(startIdx, actualEndIdx);
  } else {
    extracted = content.substring(startIdx, endIdx);
  }

  // Find the content inside the tab condition:
  // `{activeTab === 'xyz' && (` ... `)}`
  const conditionIdx = extracted.indexOf(sec.tabCondition);
  const startContentIdx = conditionIdx + sec.tabCondition.length;
  const lastParenIdx = extracted.lastIndexOf(')}');
  
  let componentBody = extracted.substring(startContentIdx, lastParenIdx).trim();

  const componentCode = `import React from 'react';

export default function ${sec.name}(${sec.props}) {
  return (
    ${componentBody}
  );
}
`;

  const outPath = path.join(__dirname, `frontend/src/screen/Student/${sec.name}.jsx`);
  fs.writeFileSync(outPath, componentCode);
  console.log(`Wrote ${outPath}`);

  imports.push(`import ${sec.name} from './${sec.name}';`);
  
  // Replace in original content
  const replacement = `${sec.startTag}
        {activeTab === '${sec.name.toLowerCase().replace('student', '').replace('skillgap', 'skillgap').replace('scenariosimulator', 'simulator').replace('evidenceportfolio', 'portfolio').replace('dashboard', 'dashboard').replace('profile', 'profile')}' && (
          <${sec.name} {...${sec.props.replace('{', '').replace('}', '').trim().split(', ').map(k => `${k}={${k}}`).join(' ')}} />
        )}
`;

  content = content.replace(extracted, replacement);
}

// Ensure the props mapping is correct for the replacement
// Wait, I did `...props` but spread is easier:
// `<StudentDashboard firstName={firstName} initials={initials} ... />`
// I handled it with `.map(k => \`\${k}={\${k}}\`)` which is `firstName={firstName} initials={initials} ...`

content = imports.join('\n') + '\n' + content;

fs.writeFileSync(file, content);
console.log('Updated StudentScreen.jsx');

