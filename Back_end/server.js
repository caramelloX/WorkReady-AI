import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';

import User from './models/User.js';
import Candidate from './models/Candidate.js';
import Scenario from './models/Scenario.js';
import PortfolioItem from './models/PortfolioItem.js';
import MentorStudent from './models/MentorStudent.js';
import Submission from './models/Submission.js';
import StudentRating from './models/StudentRating.js';
import MentorHighlight from './models/MentorHighlight.js';
import { runScenarioFallback, runScenarioAI, generateScenariosWithAI } from './scenarioEngine.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize DB on startup
connectDB();

// 1. Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 2. Auth Endpoints
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password }, '-_id -__v -password -createdAt -updatedAt').lean();
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ success: true, token: 'fake-jwt-token-123', user });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  console.log('\n[DEBUG] Registration request received! Data payload:', req.body);
  const { role, fullName, username, email, password, target_track, target_industry } = req.body;
  try {
    const existing = await User.findOne({ username });
    if (existing) {
      console.log(`[DEBUG] Registration rejected: Username '${username}' is already taken.`);
      return res.status(400).json({ error: 'Username already exists' });
    }
    const id = 'usr-' + Math.floor(Math.random() * 10000);
    const newUser = await User.create({ id, username, password, role, fullname: fullName, email, target_track, target_industry });
    console.log('[DEBUG] User successfully saved to MongoDB:', newUser);
    
    res.json({ 
      success: true,
      token: 'fake-jwt-token-123', 
      user: { id, username, role, fullname: fullName, email, target_track, target_industry } 
    });
  } catch (err) {
    console.error('[DEBUG] Registration database error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

app.put('/api/auth/profile/:id', async (req, res) => {
  const { major, education_level, career_goal, occupation_goal, strengths, develop_areas, target_industry } = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: req.params.id },
      { 
        major, 
        education_level, 
        career_goal, 
        occupation_goal,
        strengths, 
        develop_areas, 
        target_industry,
        profile_completed: true 
      },
      { new: true, select: '-_id -__v -password -createdAt -updatedAt' }
    ).lean();
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error('[DEBUG] Profile update error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// 3. Candidates Endpoints
app.get('/api/candidates', async (req, res) => {
  try {
    const rows = await Candidate.find({}, '-_id -__v').lean();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.get('/api/candidates/:id', async (req, res) => {
  try {
    const cand = await Candidate.findOne({ id: req.params.id }, '-_id -__v').lean();
    if (!cand) return res.status(404).json({ error: 'Not found' });
    res.json(cand);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// 4. Scenarios
app.get('/api/scenarios', async (req, res) => {
  try {
    let rows = await Scenario.find({}, '-_id -__v').lean();
    
    // If no scenarios exist, generate them dynamically using Gemini!
    if (rows.length === 0) {
      const apiKey = process.env.GROQ_API_KEY;
      const hasApiKey = !!(apiKey && apiKey.trim().length > 0 && !apiKey.startsWith('#'));
      
      console.log('[SCENARIOS] No scenarios found. Generating new ones using AI...');
      const generated = await generateScenariosWithAI(hasApiKey ? apiKey : null);
      
      // Save to MongoDB
      await Scenario.insertMany(generated);
      rows = await Scenario.find({}, '-_id -__v').lean();
    }
    
    res.json(rows);
  } catch (err) {
    console.error('[SCENARIOS] Fetch/generation error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/scenarios/regenerate', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  const hasApiKey = !!(apiKey && apiKey.trim().length > 0 && !apiKey.startsWith('#'));
  
  try {
    console.log('[SCENARIOS] Regenerating scenarios with AI...');
    const generated = await generateScenariosWithAI(hasApiKey ? apiKey : null);
    
    // Clear and insert
    await Scenario.deleteMany({});
    await Scenario.insertMany(generated);
    
    const rows = await Scenario.find({}, '-_id -__v').lean();
    res.json({ success: true, scenarios: rows });
  } catch (err) {
    console.error('[SCENARIOS] Regeneration error:', err);
    res.status(500).json({ error: 'Failed to regenerate scenarios', details: err.message });
  }
});

app.post('/api/scenario/chat', async (req, res) => {
  const { scenarioId, scenarioTitle, message, chatHistory } = req.body;
  const apiKey = process.env.GROQ_API_KEY;
  const hasApiKey = !!(apiKey && apiKey.trim().length > 0 && !apiKey.startsWith('#'));

  try {
    let result;
    if (hasApiKey) {
      console.log(`[SCENARIO CHAT] AI API Key found. Routing SRE action for scenario ${scenarioId} using Groq AI...`);
      result = await runScenarioAI(scenarioId, scenarioTitle, message, chatHistory || [], apiKey);
    } else {
      console.log(`[SCENARIO CHAT] No AI API Key in .env. Falling back to dynamic mock engine for scenario ${scenarioId}...`);
      result = runScenarioFallback(scenarioId, message, chatHistory || []);
    }
    
    res.json({
      success: true,
      hasApiKey,
      ...result
    });
  } catch (err) {
    console.error('[SCENARIO CHAT] Server error running simulation:', err);
    res.status(500).json({ error: 'Failed to run SRE simulation stage', details: err.message });
  }
});

// 5. Portfolio
app.get('/api/portfolio', async (req, res) => {
  try {
    const rows = await PortfolioItem.find({}, '-_id -__v').lean();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// 6. Mentor Students
app.get('/api/mentor/students', async (req, res) => {
  try {
    const rows = await MentorStudent.find({}, '-_id -__v').lean();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// 7. Submissions
app.get('/api/submissions', async (req, res) => {
  try {
    const rows = await Submission.find({}, '-_id -__v').sort({ _id: -1 }).lean();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/submissions', async (req, res) => {
  const { student, type, artifact } = req.body;
  try {
    const id = 'sub-' + Math.floor(Math.random() * 10000);
    const date = 'Today';
    const status = 'Pending';
    const feedback = '';
    await Submission.create({ id, student, type, artifact, date, status, feedback });
    res.json({ success: true, submission: { id, student, type, artifact, date, status, feedback } });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/submissions/review', async (req, res) => {
  const { id, status, feedback } = req.body;
  try {
    await Submission.updateOne({ id }, { status, feedback });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// 7.5. Mentor Highlights
app.get('/api/mentor/highlights', async (req, res) => {
  try {
    const list = await MentorHighlight.find({}).lean();
    const highlights = {};
    list.forEach(item => {
      highlights[item.student_id] = item.highlight_comment;
    });
    res.json(highlights);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/mentor/highlights', async (req, res) => {
  const { studentId, highlightComment } = req.body;
  try {
    const existing = await MentorHighlight.findOne({ student_id: studentId });
    if (existing) {
      await MentorHighlight.updateOne({ student_id: studentId }, { highlight_comment: highlightComment });
    } else {
      await MentorHighlight.create({ student_id: studentId, highlight_comment: highlightComment });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// 8. Ratings
app.get('/api/student/ratings/:studentId', async (req, res) => {
  try {
    const rating = await StudentRating.findOne({ student_id: req.params.studentId }, '-_id -__v').lean();
    if (!rating) {
      return res.json({ processMap: 'medium', safetyRisk: 'medium', rca: 'medium', traceability: 'medium', memo: 'medium', responsibleAi: 'medium' });
    }
    res.json(rating);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/student/ratings', async (req, res) => {
  const { studentId, processMap, safetyRisk, rca, traceability, memo, responsibleAi } = req.body;
  try {
    const existing = await StudentRating.findOne({ student_id: studentId });
    if (existing) {
      await StudentRating.updateOne({ student_id: studentId }, { processMap, safetyRisk, rca, traceability, memo, responsibleAi });
    } else {
      await StudentRating.create({ student_id: studentId, processMap, safetyRisk, rca, traceability, memo, responsibleAi });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
