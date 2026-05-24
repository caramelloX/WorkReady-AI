const fs = require('fs');
const path = require('path');

// 1. Update App.jsx
const appFile = 'src/App.jsx';
let appContent = fs.readFileSync(appFile, 'utf8');

appContent = appContent.replace(
  `    if (screen === 'landing' || screen === 'login') {\n      localStorage.removeItem('currentUser'); // Clear session on logout`,
  `    if (screen === 'logout') {\n      localStorage.removeItem('currentUser'); // Clear session on logout`
);

appContent = appContent.replace(
  `      sessionStorage.removeItem('adminActiveTab');\n    }\n    setCurrentScreen(screen);`,
  `      sessionStorage.removeItem('adminActiveTab');\n      setCurrentScreen('landing');\n      return;\n    }\n    setCurrentScreen(screen);`
);

fs.writeFileSync(appFile, appContent);
console.log('Updated App.jsx');

// 2. Update all dashboards' logout buttons
const files = [
  'src/screen/Student/StudentScreen.jsx',
  'src/screen/Mentor/MentorScreen.jsx',
  'src/screen/Employer/EmployerScreen.jsx',
  'src/screen/Admin/AdminScreen.jsx'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // We want to replace `onClick={() => onNavigate('landing')}` with `onClick={() => onNavigate('logout')}` ONLY for logout buttons.
    // The logout buttons usually have className containing "logout".
    // For example: `<button className="dropdown-item logout" onClick={() => onNavigate('landing')}>`
    
    // We can use a regex to find buttons with "logout" class and change the onNavigate.
    content = content.replace(/className="[^"]*logout[^"]*"\s*onClick=\{\(\)\s*=>\s*onNavigate\('landing'\)\}/g, (match) => {
      return match.replace("'landing'", "'logout'");
    });

    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
