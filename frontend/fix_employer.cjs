const fs = require('fs');

let file = 'src/screen/Employer/EmployerScreen.jsx';
let content = fs.readFileSync(file, 'utf8');

// Fix 1: Remove the random `</div>)}` and empty lines if possible
content = content.replace(/<\/div>\)\}\n\n/g, '');

// Fix 2: Change `{activeTab === 'dashboard' && (<div>` to `<>`
content = content.replace("{activeTab === 'dashboard' && (<div>", "{activeTab === 'dashboard' && (<>");

// Fix 3: Insert `</>)}` and `StudentSettings` right before `</div>` that closes `employer-main-panel`
// The `employer-main-panel` is closed right after `</main>`.
const mainClose = `        </main>\n      </div>`;
const newMainClose = `        </main>\n        </>)}\n        {activeTab === 'settings' && (\n          <StudentSettings currentUser={{ role: 'employer', fullname: 'Guest Recruiter' }} />\n        )}\n      </div>`;
if (content.includes(mainClose) && !content.includes('<StudentSettings')) {
    content = content.replace(mainClose, newMainClose);
}

fs.writeFileSync(file, content);
console.log('Fixed EmployerScreen.jsx completely');
