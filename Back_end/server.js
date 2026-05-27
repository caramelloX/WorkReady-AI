import dotenv from 'dotenv';
dotenv.config({ override: true, quiet: true });
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import bcrypt from 'bcryptjs';

import User from './models/User.js';
import Candidate from './models/Candidate.js';
import Scenario from './models/Scenario.js';
import PortfolioItem from './models/PortfolioItem.js';
import MentorStudent from './models/MentorStudent.js';
import Submission from './models/Submission.js';
import StudentRating from './models/StudentRating.js';
import MentorHighlight from './models/MentorHighlight.js';
import { runScenarioFallback, runScenarioAI, generateScenariosWithAI } from './services/scenarioEngine.js';
import { SYSTEM_PROMPT, buildUserMessage, validatePayload } from './services/aiMentorSystemPrompt.js';
import http from 'http';
import { Server } from 'socket.io';
import chatRoutes from './routes/chat.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Initialize DB on startup
connectDB();

app.use('/api/chat', chatRoutes);

// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // When a user logs in, they can join a room with their own userId
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`[Socket.IO] User ${userId} joined their personal room.`);
  });

  socket.on('send_message', async (data) => {
    try {
      // data: { senderId, receiverId, content }
      const Message = (await import('./models/Message.js')).default;
      const newMessage = await Message.create({
        senderId: data.senderId,
        receiverId: data.receiverId,
        content: data.content,
        isRead: false
      });
      
      // Emit to receiver's room
      io.to(data.receiverId).emit('receive_message', newMessage);
      // Emit back to sender as well (for multi-device sync)
      io.to(data.senderId).emit('receive_message', newMessage);
      
    } catch (err) {
      console.error('[Socket.IO] Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// 1. Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/health/groq', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.json({ status: 'offline', reason: 'GROQ_API_KEY not configured' });
  }
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 1,
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (response.ok) {
      return res.json({ status: 'operational' });
    }
    const err = await response.text();
    return res.json({ status: 'degraded', reason: `HTTP ${response.status}: ${err.slice(0, 100)}` });
  } catch (err) {
    return res.json({ status: 'offline', reason: err.message });
  }
});

// 2. Auth Endpoints
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }, '-_id -__v -createdAt -updatedAt').lean();
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status === 'Suspended') {
      return res.status(403).json({ error: 'Account suspended. Please contact support.' });
    }
    let isMatch = false;
    if (user.password && user.password.startsWith('$2')) {
      isMatch = bcrypt.compareSync(password, user.password);
    } else {
      // Fallback for old plain-text passwords
      isMatch = (password === user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    delete user.password;
    
    // Update the last activity timestamp so the admin dashboard shows them as 'Active'
    await User.updateOne({ username }, { $set: { updatedAt: new Date() } });
    
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
    
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    
    const id = 'usr-' + Math.floor(Math.random() * 10000);
    const newUser = await User.create({ id, username, password: hashedPassword, role, fullname: fullName, email, target_track, target_industry });
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
  const { 
    fullname, username, email, phone, location, bio, avatar_base64,
    major, education_level, career_goal, occupation_goal, strengths, develop_areas, target_industry 
  } = req.body;
  
  try {
    const updateFields = {
      profile_completed: true
    };
    if (fullname !== undefined) updateFields.fullname = fullname;
    if (username !== undefined) updateFields.username = username;
    if (email !== undefined) updateFields.email = email;
    if (phone !== undefined) updateFields.phone = phone;
    if (location !== undefined) updateFields.location = location;
    if (bio !== undefined) updateFields.bio = bio;
    if (avatar_base64 !== undefined) updateFields.avatar_base64 = avatar_base64;
    
    if (major !== undefined) updateFields.major = major;
    if (education_level !== undefined) updateFields.education_level = education_level;
    if (career_goal !== undefined) updateFields.career_goal = career_goal;
    if (occupation_goal !== undefined) updateFields.occupation_goal = occupation_goal;
    if (strengths !== undefined) updateFields.strengths = strengths;
    if (develop_areas !== undefined) updateFields.develop_areas = develop_areas;
    if (target_industry !== undefined) updateFields.target_industry = target_industry;
    // Mentor-specific fields
    const { organization, expertise, experience_years, linkedin } = req.body;
    if (organization !== undefined) updateFields.organization = organization;
    if (expertise !== undefined) updateFields.expertise = expertise;
    if (experience_years !== undefined) updateFields.experience_years = experience_years;
    if (linkedin !== undefined) updateFields.linkedin = linkedin;

    const updatedUser = await User.findOneAndUpdate(
      { id: req.params.id },
      { $set: updateFields },
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

// Password change endpoint
app.put('/api/auth/password/:id', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let isMatch = false;
    if (user.password && user.password.startsWith('$2')) {
      isMatch = bcrypt.compareSync(currentPassword, user.password);
    } else {
      isMatch = (currentPassword === user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect current password' });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);
    
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error('[DEBUG] Password change error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// 3. Candidates Endpoints
app.get('/api/candidates', async (req, res) => {
  const { q, domain, experience } = req.query;
  try {
    const query = { role: 'student' };
    
    if (q) {
      query.$or = [
        { fullname: new RegExp(q, 'i') },
        { target_track: new RegExp(q, 'i') },
        { strengths: new RegExp(q, 'i') }
      ];
    }
    if (domain && domain !== 'All tracks') {
      query.target_track = new RegExp(domain, 'i');
    }

    const students = await User.find(query).lean();
    
    const candidates = students.map(s => ({
      id: s.id,
      name: s.fullname || s.username || 'Unknown Student',
      avatar: (s.fullname || s.username || 'U').substring(0, 2).toUpperCase(),
      avatar_base64: s.avatar_base64,
      university: s.major || s.education_level || 'Unknown University',
      location: 'Remote',
      role: s.target_track || 'Software Engineer',
      score: Math.floor(Math.random() * 20) + 80,
      skills: (s.strengths && Array.isArray(s.strengths) && s.strengths.length > 0) ? s.strengths : ['React', 'Node.js', 'Python'],
      status: 'Available',
      availability: 'Immediate',
      scenarios: Math.floor(Math.random() * 15) + 5,
      rcaRating: (Math.random() * 1 + 4).toFixed(1), // 4.0 to 5.0
      evidence: Math.floor(Math.random() * 20) + 10,
      email: s.email || 'student@example.com',
      phone: '+1 (555) 012-3456',
      linkedin: 'linkedin.com/in/student',
      website: 'github.com/student',
      summary: s.career_goal || 'A highly motivated individual looking to build scalable and reliable systems.',
      education: {
        university: s.major || 'State University',
        degree: s.education_level || "Bachelor's Degree",
        year: 'Class of 2024'
      },
      processMap: [
        'Requirements Analysis',
        'System Design',
        'Implementation',
        'Testing & QA',
        'Deployment'
      ],
      reliabilityGuardrails: [
        'Automated CI/CD pipelines',
        'Comprehensive unit testing (90%+ coverage)',
        'Strict type checking and error boundary logging'
      ],
      rca: {
        title: 'High Latency in Auth Service',
        rating: 4.8,
        cause: 'Unoptimized database query without indexes',
        fix: 'Added composite indexes and Redis caching layer'
      },
      memo: {
        title: 'Migration to Microservices architecture',
        summary: 'Detailed technical plan outlining the decomposition of our monolithic backend into domain-specific microservices.',
        link: '#'
      },
      aiUsage: {
        tools: ['GitHub Copilot', 'ChatGPT', 'Claude'],
        bullets: [
          'Used Copilot for boilerplate code generation',
          'Leveraged Claude for architectural brainstorming and review'
        ]
      },
      experience: [
        {
          title: 'Software Engineering Intern',
          company: 'Tech Corp',
          dates: 'Summer 2023',
          bullets: [
            'Developed RESTful APIs using Node.js and Express',
            'Reduced query latency by 30% through index optimization'
          ]
        }
      ],
      mentorReviews: [
        {
          project: 'E-commerce API Refactor',
          rating: 4.9,
          description: 'Excellent understanding of system design and clean code principles. The implementation was robust and well-tested.',
          reviewer: 'Senior Staff Engineer'
        }
      ],
      certifications: ['AWS Certified Developer', 'WorkReady AI Certified']
    }));

    res.json(candidates);
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

app.get('/api/users/mentors', async (req, res) => {
  try {
    const mentors = await User.find({ role: 'mentor' }, 'id username fullname avatar_base64').lean();
    res.json(mentors);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// 4. Scenarios
app.get('/api/scenarios', async (req, res) => {
  try {
    const rows = await Scenario.find({}, '-_id -__v').lean();
    res.json(rows);
  } catch (err) {
    console.error('[SCENARIOS] Fetch/generation error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/scenarios', async (req, res) => {
  try {
    const {
      id,
      title,
      desc,
      difficulty,
      category,
      tags,
      estimatedTime,
      briefing,
      objectives,
      evaluationCriteria
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Scenario title is required' });
    }

    const scenarioIds = await Scenario.find({ id: /^S-\d+$/ }, 'id -_id').lean();
    const latestNumber = scenarioIds.reduce((max, scenario) => {
      const numericId = Number(scenario.id.replace('S-', ''));
      return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
    }, 100);
    const scenarioId = id && id.trim() ? id.trim() : `S-${latestNumber + 1}`;

    const existing = await Scenario.findOne({ id: scenarioId }).lean();
    if (existing) {
      return res.status(409).json({ error: 'Scenario ID already exists' });
    }

    const scenario = await Scenario.create({
      id: scenarioId,
      title: title.trim(),
      desc: desc?.trim() || `${category || 'General'} · ${difficulty || 'Available'}`,
      difficulty: difficulty || 'Available',
      category: category || 'General',
      tags: Array.isArray(tags) ? tags : String(tags || '').split(',').map(tag => tag.trim()).filter(Boolean),
      estimatedTime: estimatedTime || '25 min',
      briefing: briefing || 'Scenario briefing will be added by an admin.',
      objectives: Array.isArray(objectives) ? objectives : String(objectives || '').split('\n').map(item => item.trim()).filter(Boolean),
      evaluationCriteria: Array.isArray(evaluationCriteria) ? evaluationCriteria : String(evaluationCriteria || '').split('\n').map(item => item.trim()).filter(Boolean),
      quiz: [],
      initialLogs: [],
      initialChat: []
    });

    res.status(201).json(scenario.toObject());
  } catch (err) {
    console.error('[SCENARIOS] Create error:', err);
    res.status(500).json({ error: 'Failed to create scenario' });
  }
});

app.delete('/api/scenarios/:id', async (req, res) => {
  try {
    const result = await Scenario.deleteOne({ id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('[SCENARIOS] Delete error:', err);
    res.status(500).json({ error: 'Failed to delete scenario' });
  }
});

app.post('/api/scenarios/regenerate', async (req, res) => {
  const apiKey = process.env.GROQ_API_KEY;
  const hasApiKey = !!(apiKey && apiKey.trim().length > 0 && !apiKey.startsWith('#'));
  
  try {
    const {
      track = '',
      industry = '',
      count = 6,
      useLearnerProfiles = true
    } = req.body || {};

    const learnerProfiles = useLearnerProfiles
      ? await User.find({ role: { $regex: /^student$/i } }, 'id target_track target_industry occupation_goal major education_level career_goal strengths develop_areas -_id').lean()
      : [];

    console.log('[SCENARIOS] Regenerating scenarios with AI using learner goals...');
    const generated = await generateScenariosWithAI(hasApiKey ? apiKey : null, {
      track,
      industry,
      count,
      learnerProfiles
    });

    const normalizedScenarios = generated.map((scenario, index) => {
      const difficultyTag = scenario.tags?.[0] || scenario.difficultyLevel || 'Intermediate';
      const category = scenario.category || scenario.industry || track || 'General';
      const targetIndustry = scenario.tags?.[1] || industry || 'Technology';
      const occupationGoal = scenario.tags?.[2] || scenario.occupationGoal || category;

      return {
        ...scenario,
        id: scenario.id || `S-${201 + index}`,
        title: scenario.title || `${category} workplace scenario`,
        desc: scenario.desc || `${category} · ${difficultyTag} · ${scenario.estimatedTime || '30 min'}`,
        difficulty: 'Available',
        category,
        tags: [difficultyTag, targetIndustry, occupationGoal],
        estimatedTime: scenario.estimatedTime || '30 min',
        briefing: scenario.briefing || `Practice a realistic ${category} task in the ${targetIndustry} industry.`,
        objectives: Array.isArray(scenario.objectives) && scenario.objectives.length > 0
          ? scenario.objectives
          : ['Diagnose the work context', 'Choose a safe next action', 'Explain the tradeoffs clearly'],
        evaluationCriteria: Array.isArray(scenario.evaluationCriteria) && scenario.evaluationCriteria.length > 0
          ? scenario.evaluationCriteria
          : ['Uses evidence before acting', 'Communicates clearly', 'Produces a job-ready recommendation'],
        initialLogs: Array.isArray(scenario.initialLogs) ? scenario.initialLogs : [],
        initialChat: Array.isArray(scenario.initialChat) ? scenario.initialChat : []
      };
    });
    
    // Clear and insert
    await Scenario.deleteMany({});
    await Scenario.insertMany(normalizedScenarios);
    
    const rows = await Scenario.find({}, '-_id -__v').lean();
    res.json({ success: true, scenarios: rows, learnerProfilesUsed: learnerProfiles.length });
  } catch (err) {
    console.error('[SCENARIOS] Regeneration error:', err);
    res.status(500).json({ error: 'Failed to regenerate scenarios', details: err.message });
  }
});

app.post('/api/scenario/chat', async (req, res) => {
  const { scenarioId, scenarioTitle, message, chatHistory, scenarioContext } = req.body;
  const apiKey = process.env.GROQ_API_KEY;
  const hasApiKey = !!(apiKey && apiKey.trim().length > 0 && !apiKey.startsWith('#'));

  try {
    let result;
    if (hasApiKey) {
      console.log(`[SCENARIO CHAT] AI API Key found. Routing SRE action for scenario ${scenarioId} using Groq AI...`);
      result = await runScenarioAI(scenarioId, scenarioTitle, message, chatHistory || [], apiKey, scenarioContext);
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

app.post('/api/generate-quiz', async (req, res) => {
  const { occupationGoal } = req.body;
  // Simple fallback implementation to fix the 404
  const mockQuiz = {
    success: true,
    questions: [
      {
        skill: "System Design",
        question: `How would you design a scalable architecture for a ${occupationGoal || 'Software Engineer'}?`,
        options: ["Microservices", "Monolith", "Serverless", "All of the above"],
        correctIndex: 3
      },
      {
        skill: "Cloud & DevOps (AWS/Docker)",
        question: "Which AWS service is best for container orchestration?",
        options: ["EC2", "S3", "EKS", "RDS"],
        correctIndex: 2
      },
      {
        skill: "Git & Code Review",
        question: "What is the best way to resolve a merge conflict?",
        options: ["Force push", "Delete branch", "Manually edit conflicting files", "Ignore it"],
        correctIndex: 2
      },
      {
        skill: "Data Structures & Algorithms",
        question: "What is the time complexity of binary search?",
        options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        correctIndex: 2
      },
      {
        skill: "Secure Coding (OWASP)",
        question: "How do you prevent SQL Injection?",
        options: ["Use parameterized queries", "Regex filtering", "Client-side validation", "Disable database"],
        correctIndex: 0
      }
    ]
  };
  res.json(mockQuiz);
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

// Assign student to mentor
app.put('/api/mentor/assign', async (req, res) => {
  const { student_id, mentor_id } = req.body;
  try {
    await User.updateOne({ id: student_id, role: 'student' }, { $set: { mentor_id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Remove student from mentor
app.put('/api/mentor/unassign', async (req, res) => {
  const { student_id } = req.body;
  try {
    await User.updateOne({ id: student_id, role: 'student' }, { $set: { mentor_id: null } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all students (for assignment picker, unfiltered)
app.get('/api/mentor/all-students', async (req, res) => {
  try {
    const users = await User.find({ role: 'student' }, 'id fullname username avatar_base64 mentor_id target_industry').lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// 6. Mentor Students
app.get('/api/mentor/students', async (req, res) => {
  const { mentor_id } = req.query;
  try {
    const query = { role: 'student' };
    if (mentor_id) query.mentor_id = mentor_id;
    const users = await User.find(query).lean();
    const allRatings = await StudentRating.find({}).lean();
    
    const mappedStudents = users.map(u => {
      const rating = allRatings.find(r => r.student_id === u.id);
      let score = 0;
      if (rating) {
         const getScore = (val) => val === 'high' ? 100 : val === 'medium' ? 50 : val === 'low' ? 10 : 0;
         const vals = [rating.processMap, rating.safetyRisk, rating.rca, rating.traceability, rating.memo, rating.responsibleAi];
         const sum = vals.reduce((acc, val) => acc + getScore(val), 0);
         score = Math.round(sum / 6);
      }
      
      let risk = 'High';
      if (score >= 80) risk = 'Low';
      else if (score >= 50) risk = 'Medium';

      let lastActive = 'Never logged in';
      if (u.updatedAt) {
        const diffMs = new Date() - new Date(u.updatedAt);
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor(diffMs / (1000 * 60));
        
        if (diffMins < 1) lastActive = 'Just now';
        else if (diffHours < 1) lastActive = `${diffMins} mins ago`;
        else if (diffDays < 1) lastActive = `${diffHours} hours ago`;
        else lastActive = `${diffDays} days ago`;
      }

      const completedScenariosCount = u.scenarios_completed || 0;
      const totalScenariosCount = 5; // We can assume 5 as a base if not tracking dynamically
      const completedScenariosStr = `${completedScenariosCount}/${totalScenariosCount}`;

      return {
        id: u.id,
        name: u.fullname || u.username,
        avatar_base64: u.avatar_base64,
        email: u.email,
        phone: u.phone,
        bio: u.bio,
        major: u.major,
        careerGoal: u.career_goal,
        strengths: u.strengths || [],
        developAreas: u.develop_areas || [],
        readiness: score, 
        scenarios: completedScenariosStr, 
        risk: risk,
        lastActive,
        targetIndustry: u.target_industry || 'Not specified',
        level: u.education_level || 'Not specified',
        evidence: score > 0 ? [{ name: 'Assessment Result', points: score }] : [],
        ratings: rating || {
          processMap: 'none',
          safetyRisk: 'none',
          rca: 'none',
          traceability: 'none',
          memo: 'none',
          responsibleAi: 'none'
        }
      };
    });

    res.json(mappedStudents);
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
  const { id, status, feedback, score } = req.body;
  try {
    const update = { status, feedback };
    if (score !== undefined) update.score = score;
    await Submission.updateOne({ id }, update);
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

// 9. Admin Endpoints
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    const users = await User.find({}, '-password -_id -__v').lean();
    const scenarios = await Scenario.find({}, '-_id -__v').lean();
    const allRatings = await StudentRating.find({}).lean();
    const allSubmissions = await Submission.find({}).lean();

    const mappedUsers = users.map(u => {
      let isInactive = false;
      let lastActivity = 'Never logged in';
      
      if (u.updatedAt) {
        const diffMs = new Date() - new Date(u.updatedAt);
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor(diffMs / (1000 * 60));
        
        if (diffMins < 1) lastActivity = 'Just now';
        else if (diffHours < 1) lastActivity = `${diffMins} mins ago`;
        else if (diffDays < 1) lastActivity = `${diffHours} hours ago`;
        else lastActivity = `${diffDays} days ago`;
        
        if (lastActivity !== 'Just now') {
          isInactive = true;
        }
      }
      
      let finalStatus = 'Active';
      if (u.status === 'Suspended') {
        finalStatus = 'Suspended';
      } else if (isInactive) {
        finalStatus = 'Inactive';
      }
      
      return {
        ...u,
        id: u.id,
        name: u.fullname || u.username,
        email: u.email || `${u.username}@example.com`,
        role: u.role === 'admin' ? 'Admin' : u.role === 'mentor' ? 'Mentor' : 'Student',
        status: finalStatus,
        lastActivity
      };
    });

    const ratingsMap = {};
    allRatings.forEach(r => ratingsMap[r.student_id] = r);
    
    const submissionsMap = {};
    allSubmissions.forEach(s => {
      if (!submissionsMap[s.student]) submissionsMap[s.student] = [];
      submissionsMap[s.student].push(s);
    });

    const mappedStudents = users.filter(u => u.role?.toLowerCase() === 'student').map(u => {
      const rating = ratingsMap[u.id];
      const studentSubmissions = submissionsMap[u.id] || [];
      
      let score = 0;
      if (rating) {
         const getScore = (val) => val === 'high' ? 100 : val === 'medium' ? 50 : val === 'low' ? 10 : 0;
         const weights = {
            processMap: 0.25,
            safetyRisk: 0.20,
            rca: 0.15,
            traceability: 0.20,
            memo: 0.15,
            responsibleAi: 0.05
         };
         let totalScore = 0;
         Object.keys(weights).forEach(key => {
            totalScore += getScore(rating[key]) * weights[key];
         });
         score = Math.round(totalScore);
      }
      let risk = 'High';
      if (score >= 80) risk = 'Low';
      else if (score >= 50) risk = 'Medium';
      let lastActive = 'Never logged in';
      
      if (u.updatedAt) {
        const diffMs = new Date() - new Date(u.updatedAt);
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMins = Math.floor(diffMs / (1000 * 60));
        
        if (diffMins < 1) lastActive = 'Just now';
        else if (diffHours < 1) lastActive = `${diffMins} mins ago`;
        else if (diffDays < 1) lastActive = `${diffHours} hours ago`;
        else lastActive = `${diffDays} days ago`;
      }
      
      return {
        ...u,
        id: u.id,
        name: u.fullname || u.username,
        score,
        scenarios: studentSubmissions.length,
        risk,
        lastActive
      };
    });
    
    const mappedMentors = users.filter(u => u.role?.toLowerCase() === 'mentor').map(u => ({
      ...u,
      id: u.id,
      name: u.fullname || u.username,
      students: 0,
      reviews: 0,
      rating: 5.0
    }));

    res.json({
      users: mappedUsers,
      students: mappedStudents,
      mentors: mappedMentors,
      scenarios,
      stats: {
        totalStudents: mappedStudents.length,
        totalMentors: mappedMentors.length,
        totalScenarios: scenarios.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/admin/users', async (req, res) => {
  const { fullname, email, username, password, role } = req.body;
  try {
    const id = 'usr-' + Math.floor(Math.random() * 10000);
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const newUser = await User.create({ id, username, password: hashedPassword, role: role.toLowerCase(), fullname, email });
    res.json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.patch('/api/admin/users/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await User.updateOne({ id: req.params.id }, { status });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/admin/users/:id', async (req, res) => {
  try {
    const updateData = { ...req.body };
    delete updateData.id;
    delete updateData._id;
    delete updateData.password;
    
    if (typeof updateData.strengths === 'string') {
      updateData.strengths = updateData.strengths.split(',').map(s => s.trim()).filter(s => s);
    }
    if (typeof updateData.develop_areas === 'string') {
      updateData.develop_areas = updateData.develop_areas.split(',').map(s => s.trim()).filter(s => s);
    }

    const updatedUser = await User.findOneAndUpdate({ id: req.params.id }, updateData, { new: true });
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});
app.delete('/api/auth/user/:id', async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await User.deleteOne({ id: req.params.id });
    await StudentRating.deleteMany({ student_id: req.params.id });
    await Submission.deleteMany({ student: req.params.id });
    await MentorHighlight.deleteMany({ student_id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    console.error('[DEBUG] Delete account error:', err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

// 10. AI Mentor Assistant
app.post('/api/ai/mentor-assistant', async (req, res) => {
  const { taskType, ...payload } = req.body || {};

  if (!taskType) {
    return res.status(400).json({ error: 'taskType is required' });
  }

  const { valid, missingFields } = validatePayload(taskType, payload);
  if (!valid) {
    return res.status(400).json({
      status: 'missing_data',
      missingFields,
      message: 'Cannot complete this AI task because required data is missing.',
    });
  }

  const apiKey = process.env.GROQ_API_KEY;
  const hasApiKey = !!(apiKey && apiKey.trim().length > 0 && !apiKey.startsWith('#'));
  if (!hasApiKey) {
    return res.status(503).json({ error: 'AI service not configured. GROQ_API_KEY missing in .env.' });
  }

  try {
    const userMessage = buildUserMessage(taskType, payload);

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user',   content: userMessage },
        ],
        max_tokens: 4096,
        temperature: 0.2,
      }),
      signal: AbortSignal.timeout(30000),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error(`[AI MENTOR] Groq error HTTP ${groqRes.status}:`, errText.slice(0, 200));
      return res.status(502).json({ error: `AI service error (HTTP ${groqRes.status})` });
    }

    const groqData = await groqRes.json();
    const raw = groqData.choices?.[0]?.message?.content || '';

    let result;
    try {
      result = JSON.parse(raw);
    } catch {
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        console.error('[AI MENTOR] Non-JSON response:', raw.slice(0, 300));
        return res.status(502).json({ error: 'AI returned non-JSON response', raw: raw.slice(0, 200) });
      }
    }

    res.json({ success: true, taskType, result });
  } catch (err) {
    console.error('[AI MENTOR] Unexpected error:', err.message);
    res.status(500).json({ error: 'AI service error', details: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
