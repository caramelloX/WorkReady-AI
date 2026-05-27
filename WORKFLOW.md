# WorkReady-AI — System Workflow

## Roles

| Role | หน้าที่หลัก |
|---|---|
| **Student** | ฝึก scenario, สร้าง portfolio, chat กับ mentor |
| **Mentor** | ให้คะแนน student, review submissions, chat |
| **Admin** | จัดการ users, scenarios, ดู dashboard |
| **Employer** | ค้นหา student candidates เพื่อ recruit |

---

## Authentication Flow

```
Landing
  ├── Register → กรอก role / ข้อมูล / password → เข้าระบบ
  │     └── Student (ครั้งแรก) → ProfileCompletionModal → StudentScreen
  └── Login → ตรวจ username + password
        ├── Student   → StudentScreen
        ├── Mentor    → MentorScreen
        ├── Admin     → AdminScreen
        └── Employer  → EmployerScreen

Session: เก็บใน localStorage['currentUser']
Logout:  ล้าง localStorage → กลับ Landing
```

---

## Student Workflow

```
StudentScreen
  ├── Dashboard
  │     ├── Readiness Meter (คะแนนรวม weighted)
  │     ├── Skill Matrix (6 dimensions)
  │     └── Skill Gap summary
  │
  ├── Scenario Simulator
  │     ├── เลือก Scenario จาก library
  │     ├── อ่าน Briefing / Objectives
  │     ├── พิมพ์คำสั่ง → POST /api/scenario/chat
  │     │     └── Groq AI ตอบกลับ: terminal logs + coaching feedback + choices
  │     └── วนซ้ำจนกว่า completed = true
  │
  ├── Evidence Portfolio
  │     ├── อัปโหลด artifact → POST /api/submissions
  │     ├── Mentor review → status: Pending / Reviewed / Needs Revision
  │     └── คะแนน portfolio อัปเดตอัตโนมัติ
  │
  ├── Profile
  │     └── แก้ไขข้อมูลส่วนตัว, career goal, strengths
  │
  └── Settings
        └── เปลี่ยน password / ภาษา / theme
```

---

## Mentor Workflow

```
MentorScreen
  ├── Dashboard
  │     └── รายชื่อ students พร้อม risk level / readiness / last active
  │
  ├── Student Detail (คลิก student)
  │     ├── Rating Panel → ให้คะแนน 6 dimensions (high/medium/low)
  │     │     └── POST /api/student/ratings
  │     ├── Submission Panel → review artifacts
  │     │     └── POST /api/submissions/review {status, feedback}
  │     └── Highlight Editor → เขียน comment ส่วนตัว
  │           └── POST /api/mentor/highlights
  │
  └── Chat
        └── Real-time messaging กับ student (Socket.IO)
```

---

## Admin Workflow

```
AdminScreen
  ├── Dashboard
  │     └── stats: total students / mentors / scenarios / system health
  │
  ├── Users Tab
  │     ├── ดู user ทั้งหมด (Students, Mentors, Admins)
  │     ├── Add user → POST /api/admin/users
  │     ├── Edit user → PUT /api/admin/users/:id
  │     └── Suspend/Activate → PATCH /api/admin/users/:id/status
  │
  ├── Students Tab
  │     └── ดูรายชื่อ students + score / risk / last active
  │
  ├── Mentors Tab
  │     └── ดูรายชื่อ mentors + organization / mentees / rating
  │
  ├── Scenario Manager
  │     ├── ดู / สร้าง / ลบ scenario
  │     └── Regenerate with AI → POST /api/scenarios/regenerate
  │           └── Groq สร้าง scenarios ใหม่จาก learner profiles
  │
  └── Modules / Submissions
        └── ดู submissions ที่ pending review
```

---

## Employer Workflow

```
EmployerScreen
  ├── Talent Search
  │     ├── Filter: ชื่อ / domain / experience level / skills
  │     └── GET /api/candidates?q=...&domain=...
  │
  └── Candidate Detail Panel
        └── profile, education, strengths, skills, portfolio, mentor reviews
```

---

## Skill Assessment System

**6 Dimensions (weighted)**

| Dimension | Weight | วัดอะไร |
|---|---|---|
| Process Map | 25% | requirements → design → deploy |
| Traceability | 20% | เอกสาร / audit trail |
| Safety Risk | 20% | risk identification |
| RCA | 15% | root cause analysis |
| Memo | 15% | technical writing |
| Responsible AI | 5% | ethical AI usage |

**คะแนน:** High = 100 / Medium = 50 / Low = 10

```
Readiness Score = Σ (dimension_score × weight)
```

แหล่งคะแนน:
- Student self-rating (SkillAssessmentQuizModal)
- Mentor rating (RatingPanel)
- AI-generated quiz (50 ข้อ ตาม occupation goal)

---

## Real-time Chat Flow

```
Student / Mentor เปิด Chat
  → socket.emit('join', userId)          ← เข้า room ส่วนตัว
  → socket.emit('send_message', {...})   ← ส่งข้อความ
  → MongoDB บันทึก Message
  → socket.emit('receive_message', ...) ← ส่งให้ทั้ง sender + receiver
  → GET /api/chat/history/:u1/:u2       ← โหลดประวัติ
  → PUT /api/chat/read/:sender/:receiver ← mark as read
```

---

## Scenario Simulation Loop

```
Student เลือก Scenario
  → GET /api/scenarios
  → แสดง briefing + initial terminal logs + initial chat

Student พิมพ์ action
  → POST /api/scenario/chat
     { scenarioId, message, chatHistory }
  → Backend → Groq API
  → Response:
     { terminalLogs: [...], coachReply: "...", choices: [...], completed: bool }
  → แสดง terminal output + coaching + choice buttons

วนซ้ำจนกว่า completed = true
```

---

## ไฟล์ JS/JSX ใน Frontend

**Entry Point**

| ไฟล์ | หน้าที่ |
|---|---|
| `src/main.jsx` | จุดเริ่มต้นของ React app — mount `<App>` ลง DOM |
| `src/App.jsx` | root component — wrap Contexts ทั้งหมด, ตัดสินใจแสดง screen ตาม role ใน localStorage |
| `src/api.js` | centralized fetch functions ทั้งหมด — ทุก screen เรียก API ผ่านไฟล์นี้ |

**Contexts (global state)**

| ไฟล์ | หน้าที่ |
|---|---|
| `src/contexts/LanguageContext.jsx` | เก็บภาษาปัจจุบัน (EN/TH) + ฟังก์ชัน `t()` สำหรับ translation |
| `src/contexts/ThemeContext.jsx` | เก็บ theme (light/dark) + toggle function |
| `src/context/UserContext.jsx` | เก็บข้อมูล user ที่ login อยู่ (ซ้ำกับ localStorage แต่ใช้ใน React tree) |

**Screens — Landing / Auth**

| ไฟล์ | หน้าที่ |
|---|---|
| `src/screen/LandingScreen.jsx` | หน้าแรก — brand hero, feature cards, ปุ่ม Login / Register |
| `src/screen/LoginScreen.jsx` | ฟอร์ม login, quick-login (saved accounts), redirect ตาม role |
| `src/screen/RegisterScreen.jsx` | ฟอร์มสมัคร — เลือก role, กรอกข้อมูล, target track/industry |

**Screens — Student**

| ไฟล์ | หน้าที่ |
|---|---|
| `src/screen/Student/StudentScreen.jsx` | shell ของ student — sidebar navigation, render tab ที่เลือก |
| `src/screen/Student/StudentDashboard.jsx` | dashboard — readiness meter, skill matrix, skill gap summary |
| `src/screen/Student/StudentScenarioSimulator.jsx` | scenario library + AI chat loop (terminal + coaching) |
| `src/screen/Student/StudentEvidencePortfolio.jsx` | แสดง artifacts, ส่ง submission, ดู mentor feedback |
| `src/screen/Student/StudentProfile.jsx` | ดู/แก้ไข profile: ชื่อ, education, career goal, strengths |
| `src/screen/Student/StudentSettings.jsx` | เปลี่ยน password, เลือกภาษา, toggle theme |
| `src/screen/Student/StudentSkillGap.jsx` | skill matrix แบบ visual พร้อม weighted score breakdown |
| `src/screen/Student/SkillAssessmentQuizModal.jsx` | modal self-assessment quiz (6 dimensions, high/medium/low) |
| `src/screen/Student/AiSkillQuizModal.jsx` | modal AI-generated quiz 50 ข้อ ตาม occupation goal |
| `src/screen/Student/AiSkillQuizModal_backup.jsx` | backup ของ AiSkillQuizModal (ไม่ได้ใช้งาน) |
| `src/screen/Student/QuizModal.jsx` | base quiz modal component ที่ใช้ร่วมกัน |

**Screens — Mentor / Admin / Employer**

| ไฟล์ | หน้าที่ |
|---|---|
| `src/screen/Mentor/MentorScreen.jsx` | ทั้งหมดของ mentor — student roster, rating panel, submission review, highlight editor |
| `src/screen/Admin/AdminScreen.jsx` | ทั้งหมดของ admin — dashboard, user management, scenario manager |
| `src/screen/Employer/EmployerScreen.jsx` | talent search — filter candidates, candidate detail panel |

**Components**

| ไฟล์ | หน้าที่ |
|---|---|
| `src/components/ProfileCompletionModal.jsx` | modal กรอกข้อมูลเพิ่มเติมสำหรับ student ครั้งแรกที่ login |
| `src/components/Chat/ChatWidget.jsx` | chat UI แบบ floating widget — Socket.IO messaging ระหว่าง student กับ mentor |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Lucide Icons, Socket.IO client, SweetAlert2 |
| Backend | Express.js, MongoDB (Mongoose), Socket.IO server |
| AI | Groq API (scenario generation + coaching) |
| Auth | bcryptjs password hashing, fake JWT (localStorage) |
| i18n | English / Thai (LanguageContext) |
| Port | Backend :5000, Frontend :5173 |
