const fs = require('fs');
const file = 'src/screen/Employer/EmployerScreen.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add activeTab state
if (!content.includes('const [activeTab, setActiveTab] = useState(')) {
    content = content.replace("const [searchQuery, setSearchQuery] = useState('');", "const [activeTab, setActiveTab] = useState('dashboard');\n  const [searchQuery, setSearchQuery] = useState('');");
}

// 2. Add import
if (!content.includes('import StudentSettings')) {
    content = content.replace("import { Briefcase, Search, LogOut, LayoutDashboard } from 'lucide-react';", "import { Briefcase, Search, LogOut, LayoutDashboard } from 'lucide-react';\nimport StudentSettings from '../Student/StudentSettings';");
}

// 3. Add Settings button
const dropdownMenuStart = `              <div className="employer-profile-dropdown-menu">`;
const settingsButton = `                <button className="dropdown-item" onClick={() => { setShowProfileDropdown(false); setActiveTab('settings'); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="dropdown-item-icon">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  {t('sidebar.settings') || 'Settings'}
                </button>`;

if (!content.includes("setActiveTab('settings')") && content.includes(dropdownMenuStart)) {
    content = content.replace(dropdownMenuStart, `${dropdownMenuStart}\n${settingsButton}`);
}

// 4. Wrap main content and add settings rendering
// The main content is inside `<div className="employer-main-panel">`
const mainPanelStart = `      <div className="employer-main-panel">`;
if (content.includes(mainPanelStart) && !content.includes("{activeTab === 'dashboard' && (")) {
    // Replace main panel start with activeTab condition
    content = content.replace(mainPanelStart, `${mainPanelStart}\n        {activeTab === 'dashboard' && (<>`);
    
    // Replace the end of the return statement
    const endBlock = `      </div>
    </div>
  );
}`;
    const newEndBlock = `        </>)}
        
        {activeTab === 'settings' && (
          <StudentSettings currentUser={{ role: 'employer', fullname: 'Guest Recruiter' }} />
        )}
      </div>
    </div>
  );
}`;
    content = content.replace(endBlock, newEndBlock);
}

// 5. Allow switching back to dashboard from sidebar
const searchBtn = `          <button className="employer-nav-btn active">`;
const newSearchBtn = `          <button className={\`employer-nav-btn \${activeTab === 'dashboard' ? 'active' : ''}\`} onClick={() => setActiveTab('dashboard')}>`;
if (content.includes(searchBtn)) {
    content = content.replace(searchBtn, newSearchBtn);
}

fs.writeFileSync(file, content);
console.log('Updated EmployerScreen.jsx');
