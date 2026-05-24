const fs = require('fs');
const file = 'src/screen/Admin/AdminScreen.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add import
if (!content.includes('import StudentSettings')) {
    content = content.replace("import { api } from '../../api.js';", "import { api } from '../../api.js';\nimport StudentSettings from '../Student/StudentSettings';");
}

// 2. Add Settings button to dropdown menu
const dropdownMenuStart = `              <div className="admin-profile-dropdown-menu">`;
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

// 3. Render StudentSettings
const mainPanelEnd = `      </div>

      {/* Editing Modal */}`;
const settingsRender = `        {activeTab === 'settings' && (
          <StudentSettings currentUser={{ role: 'admin', fullname: 'System Admin' }} />
        )}
`;
if (!content.includes('<StudentSettings') && content.includes(mainPanelEnd)) {
    content = content.replace(mainPanelEnd, `${settingsRender}\n${mainPanelEnd}`);
}

fs.writeFileSync(file, content);
console.log('Updated AdminScreen.jsx');
