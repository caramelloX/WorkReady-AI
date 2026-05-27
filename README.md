# WorkReady AI

WorkReady AI is an AI-powered training platform designed to bridge the gap between academic learning and industry expectations for engineering and manufacturing roles.

## Project Description

The platform provides realistic, interactive factory scenarios where students can practice essential skills such as process mapping, risk identification, root cause analysis (RCA), and technical communication. 

Key features include:
- **Student Dashboard & Portfolio:** Track readiness scores and review completed artifacts.
- **Scenario Simulator:** A 5-station interactive workspace with an integrated AI Coach.
- **Mentor Review:** A dedicated interface for industry mentors to review and score student portfolios.
- **Mentor Matching:** An Admin dashboard that intelligently suggests student-mentor pairings based on career track, skill gaps, industry background, and capacity.

## Tech Stack

- **Frontend:** React, Vite, Vanilla CSS
- **State Management:** React state & LocalStorage (Mock data for MVP)

## How to Install & Run

1. Clone the repository.
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Demo Flow

The application is configured with mock data for demonstration purposes. We recommend the following flow:

1. **Open Landing Page:** Select "Student" role.
2. **Student Dashboard:** View the readiness score and assigned scenario.
3. **Continue Scenario:** Walk through the 5 stations in the Scenario Simulator. Notice the AI Coach interactions.
4. **Evidence Portfolio:** After the scenario, view the 5 generated outputs in the portfolio.
5. **Submit to Mentor:** Click the submit button to request a review.
6. **Switch to Mentor:** Return to the Landing Page and select "Mentor" (e.g., Somchai P.).
7. **Mentor Dashboard & Review:** Navigate to the "Review" tab, score the student's submission using the rubric, and submit feedback.
8. **Switch to Admin:** Return to the Landing Page and select "Admin".
9. **Mentor Matching Dashboard:** Navigate to the "Mentor Matching" tab in the sidebar. Select a pending student (e.g., Anan J.) to see the recommended mentor match based on the algorithm, and confirm the assignment.

## Demo Users / Roles

The system uses pre-populated demo data:
- **Student:** Anan Jaidee (QA Track), Mali Khumphon (Maintenance Track)
- **Mentor:** Somchai Panya (QA Engineer), Narin Thong (Maintenance Supervisor)
- **Admin:** System Administrator

## Responsible AI Principles

WorkReady AI incorporates AI responsibly:
- **AI is a coach, not a decision maker:** The AI provides guidance and challenges assumptions, but the student must formulate the final answers.
- **Human-in-the-loop:** Every AI suggestion requires explicit human action (Accept, Revise, Reject) and reasoning.
- **Support, not Hiring:** Readiness and match scores are support tools for learning feedback. Final assignments and hiring decisions must be confirmed by humans.

## Known Limitations (MVP)

- Data persistence relies on `localStorage` or hardcoded mock data. A backend database is required for production.
- Mentor Matching is a suggestion engine only; live email notifications and calendar integrations are not yet implemented.
- Exporting the portfolio to PDF is a placeholder.

## Next Improvements

- **Phase 6:** Backend Integration (Node.js/Express + PostgreSQL).
- **Phase 7:** Real-time AI processing using Groq/Llama3 instead of mock responses.
- **Phase 8:** Advanced analytics for Admin reporting.
