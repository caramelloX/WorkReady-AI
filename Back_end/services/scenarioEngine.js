// Dynamic AI SRE Coach & Staging Pod Simulator engine


const modelName = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

function buildLearnerContext(generationContext = {}) {
  const learnerProfiles = Array.isArray(generationContext.learnerProfiles)
    ? generationContext.learnerProfiles
    : [];

  const trackSummary = learnerProfiles.reduce((summary, learner) => {
    const track = learner.target_track || learner.occupation_goal || learner.major || 'General';
    if (!summary[track]) {
      summary[track] = {
        track,
        count: 0,
        industries: new Set(),
        goals: new Set(),
        majors: new Set()
      };
    }

    summary[track].count += 1;
    if (learner.target_industry) summary[track].industries.add(learner.target_industry);
    if (learner.occupation_goal) summary[track].goals.add(learner.occupation_goal);
    if (learner.major) summary[track].majors.add(learner.major);
    return summary;
  }, {});

  return {
    requestedTrack: generationContext.track || 'Use learner profiles',
    requestedIndustry: generationContext.industry || 'Use learner profiles',
    learnerProfiles: learnerProfiles.slice(0, 20),
    trackSummary: Object.values(trackSummary).map(item => ({
      track: item.track,
      count: item.count,
      industries: Array.from(item.industries),
      goals: Array.from(item.goals),
      majors: Array.from(item.majors)
    }))
  };
}

export function runScenarioFallback(scenarioId, message, chatHistory) {
  return {
    terminalLogs: [
      `$ ${message}`,
      '[WARN] Groq API Key is missing or invalid in backend .env file.',
      '[INFO] Please configure GROQ_API_KEY in Back_end/.env to activate the dynamic AI SRE simulation.'
    ],
    coachReply: 'I can see your action, but the live AI coach is not connected yet. Please configure GROQ_API_KEY in Back_end/.env and restart the server. Until then, treat this as a guided dry run and focus on explaining your reasoning step by step.',
    choices: [],
    completed: false
  };
}

export async function generateScenariosWithAI(apiKey, generationContext = {}) {
  try {
    if (!apiKey) {
      throw new Error('Missing API Key');
    }

    const learnerContext = buildLearnerContext(generationContext);

    const systemInstruction = `You are a curriculum designer for a work-readiness training platform.
Generate a JSON object containing exactly ${generationContext.count || 6} realistic, industry-grounded training scenarios.

Design the scenarios from the learner goals below. Separate the scenarios by job track, field, related discipline, and target industry. Use realistic tasks, incidents, tools, constraints, stakeholders, and success criteria that someone in that role would face at work.

Learner goal context:
${JSON.stringify(learnerContext, null, 2)}

The output MUST be a JSON object with a single key "scenarios" containing the array of scenarios.
Each scenario MUST strictly match this JSON schema:
{
  "id": "A unique identifier like S-201, S-202, etc.",
  "title": "A short, descriptive, professional title of the production incident",
  "desc": "Category, difficulty, and estimated time (e.g. 'Backend · Intermediate · 30 min' or 'Infra · Advanced · 45 min')",
  "difficulty": "Available",
  "category": "The exact job track or related field, e.g. Backend, Frontend, Data Engineering, QA, Cybersecurity, Cloud / DevOps, Product Analytics",
  "tags": ["Difficulty such as Beginner/Intermediate/Advanced", "Target industry", "Occupation goal"],
  "estimatedTime": "25 min",
  "briefing": "A practical workplace briefing tied to the learner goal and industry",
  "objectives": [
    "Specific job-ready behavior to practice",
    "Another concrete behavior"
  ],
  "evaluationCriteria": [
    "How a mentor should judge the learner's work",
    "Another assessment criterion"
  ],
  "initialLogs": [
    "Line 1 of initial server or application logs showing the error",
    "Line 2 of logs..."
  ],
  "initialChat": [
    {
      "sender": "coach",
      "text": "The welcoming message from the SRE Coach explaining the incident context and asking the student what their first move is."
    }
  ]
}

Rules:
- Cover the most common learner tracks first. If there are no learner profiles, cover Backend, Frontend, Data Engineering, Cloud / DevOps, QA, and Cybersecurity.
- Do not make every scenario an SRE outage. Include role-appropriate work such as debugging, testing, data quality, UX defects, release readiness, security triage, stakeholder communication, or analytics validation.
- Make category and tags useful for filtering in Scenario Manager.
- Keep "difficulty" as "Available" for compatibility; put learner difficulty in tags[0].
- Prefer practical industry context over generic classroom exercises.
Return ONLY valid JSON.`;

    const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemInstruction }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error('Empty response from Groq API');
    }

    let parsed = JSON.parse(text.trim());
    // Extract array from {"scenarios": [...]} wrapper
    if (parsed.scenarios && Array.isArray(parsed.scenarios)) {
      return parsed.scenarios;
    } else if (Array.isArray(parsed)) {
      return parsed;
    }
    
    throw new Error('Response is not a JSON array of scenarios');
  } catch (err) {
    console.error('[GENERATE SCENARIOS] Groq failed, using fallback scenarios...', err);
    // Return standard fallback scenarios
    return [
      {
        id: 'S-101',
        category: 'Backend',
        tags: ['Intermediate', 'E-commerce / Retail', 'Software Engineer'],
        estimatedTime: '25 min',
        briefing: 'A retail checkout service starts returning intermittent HTTP 500s during a campaign. The learner must inspect traces, dependency health, and recent deploys before proposing a safe fix.',
        objectives: [
          'Identify the failing endpoint and affected dependency',
          'Separate symptoms from root cause',
          'Propose a safe rollback or patch plan'
        ],
        evaluationCriteria: [
          'Uses logs and metrics before changing production',
          'Explains risk to customer checkout flow',
          'Communicates a clear permanent fix'
        ],
        title: 'Production API Returning 500s — Checkout Service',
        desc: 'Backend · Intermediate · 25 min',
        difficulty: 'Available',
        initialLogs: [
          '$ tail -f /var/log/checkout-service.log',
          '[ERR] 500 Internal Server Error: Pool Exhausted',
        ],
        initialChat: [
          { sender: 'coach', text: 'Welcome to S-101. The checkout service is returning 500s. Where should we look first?' }
        ]
      },
      {
        id: 'S-102',
        category: 'Data Engineering',
        tags: ['Advanced', 'Analytics / SaaS', 'Data Engineer'],
        estimatedTime: '40 min',
        briefing: 'A reporting dashboard used by business teams times out after a new analytics query ships. The learner must diagnose pool saturation, query shape, and safe mitigation.',
        objectives: [
          'Inspect pool metrics and slow query evidence',
          'Find the query or code path causing connection saturation',
          'Recommend an index, query rewrite, or worker isolation plan'
        ],
        evaluationCriteria: [
          'Avoids blindly restarting the database',
          'Uses production-safe database diagnostics',
          'Connects the technical fix to reporting reliability'
        ],
        title: 'Database Connection Pool Exhausted at 2 AM',
        desc: 'Infra · Advanced · 40 min',
        difficulty: 'Available',
        initialLogs: [
          '$ systemctl status postgresql',
          '[ERR] Connection pool exhausted! Max pool size 100 reached.'
        ],
        initialChat: [
          { sender: 'coach', text: 'Welcome to S-102. It\'s 2 AM and the database connection pool is completely exhausted. What is our first course of action to diagnose this?' }
        ]
      },
      {
        id: 'S-104',
        category: 'Backend',
        tags: ['Intermediate', 'Logistics / Operations', 'Backend Engineer'],
        estimatedTime: '30 min',
        briefing: 'A background worker that processes logistics events is repeatedly crashing with out-of-memory errors. The learner must investigate heap growth and design a durable fix.',
        objectives: [
          'Confirm whether the issue is leak, volume, or configuration',
          'Inspect worker memory evidence safely',
          'Recommend a permanent code or queue-processing fix'
        ],
        evaluationCriteria: [
          'Uses evidence before scaling resources',
          'Explains memory retention clearly',
          'Balances short-term mitigation with long-term repair'
        ],
        title: 'Memory Leak in Node.js Worker',
        desc: 'Backend · Intermediate · 30 min',
        difficulty: 'Available',
        initialLogs: [
          '$ pm2 status',
          '[ERR] FATAL ERROR: JavaScript heap out of memory'
        ],
        initialChat: [
          { sender: 'coach', text: 'Welcome to S-104. The background worker is continuously crashing due to Out of Memory (OOM) exceptions. Let\'s investigate.' }
        ]
      }
    ];
  }
}

export async function runScenarioAI(scenarioId, scenarioTitle, message, chatHistory, apiKey, scenarioContext = {}) {
  try {
    const formattedHistory = chatHistory
      .slice(-10)
      .map(h => `${h.sender === 'coach' ? 'AI Coach' : 'Student'}: ${h.text || h.message || ''}`)
      .join('\n');

    const contextBlock = JSON.stringify({
      category: scenarioContext.category,
      difficulty: scenarioContext.difficulty,
      tags: scenarioContext.tags,
      briefing: scenarioContext.briefing,
      objectives: scenarioContext.objectives,
      evaluationCriteria: scenarioContext.evaluationCriteria,
      initialLogs: scenarioContext.initialLogs
    }, null, 2);

    const systemInstruction = `You are the staging container pod Linux shell emulator and expert SRE Coach for an interactive training sandbox game.
The active scenario is: ${scenarioId} (${scenarioTitle}).
Scenario context:
${contextBlock}

Your behavior:
- Be human-first: coach the learner with calm, practical feedback before judging. Acknowledge the student's intent, explain what their action reveals, and ask for the next reasoning step.
- Stay anchored to the scenario context, briefing, objectives, evaluation criteria, and initial logs. Do not invent a totally different incident.
- Students can interact by choosing one of the suggested buttons, or typing free-form queries/commands in the input box.
- Act as the real Linux server shell, printing authentic output under "terminalLogs". Ensure standard Unix command prompts are outputted, like:
  "$ command"
  "output lines..."
  Followed by error tracebacks or success prints if appropriate.
- Act as the expert SRE mentor coach, explaining why the action succeeded or failed, teaching them deep SRE concepts (pool connections, Sequential Scans, concurrent indices, memory heap retention paths) under "coachReply".
- Offer 2-3 new, logical, highly realistic troubleshooting actions under "choices" that help the student progress.
- Once the student has diagnosed and deployed a correct and permanent fix for the root cause of the issue, set "completed" to true and return no further choices (choices: []). If they took a temporary restart/scaling bandaid, explain why it's a bandaid, reset connections, keep completed: false.
- If the student jumps straight to a risky production action, slow them down and suggest a safer observation or rollback plan first.

You MUST respond strictly with a valid JSON object matching the following structure:
{
  "terminalLogs": [
    "line 1 of shell print (e.g. '$ command')",
    "line 2..."
  ],
  "coachReply": "Your SRE coaching message...",
  "choices": [
    { "text": "Strategic next choice A" },
    { "text": "Strategic next choice B" }
  ],
  "completed": false
}

Return ONLY this JSON object.`;

    const userPrompt = `
Scenario: ${scenarioId} - ${scenarioTitle}
Prior Chat History:
${formattedHistory}

Student Action/Input: "${message}"

Generate the JSON response representing the emulator shell and SRE coach response.`;

    const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn('[GROQ API] Response not ok. Status:', response.status, 'Error:', errText);
      return {
        terminalLogs: [
          `[ERR] Groq API call failed with status ${response.status}`,
          `[INFO] Active Model: ${modelName}`,
          `[DEBUG] Error details: ${errText.substring(0, 250)}`
        ],
        coachReply: `I encountered an error communicating with the Groq API (${response.status}). Please check your API key validity and if the model "${modelName}" is supported.`,
        choices: [],
        completed: false
      };
    }

    const data = await response.json();
    const candidateText = data?.choices?.[0]?.message?.content;
    
    if (!candidateText) {
      console.warn('[GROQ API] Empty content returned.');
      return {
        terminalLogs: [
          `[ERR] Groq API returned empty content.`,
          `[INFO] Please try submitting your SRE action again.`
        ],
        coachReply: `I received an empty response from the simulation engine. Let's try re-running the diagnostic command.`,
        choices: [],
        completed: false
      };
    }

    try {
      const parsed = JSON.parse(candidateText.trim());
      if (parsed && Array.isArray(parsed.terminalLogs) && typeof parsed.coachReply === 'string') {
        return parsed;
      }
      throw new Error('JSON structure does not match contract');
    } catch (parseErr) {
      console.warn('[GROQ API] Failed parsing Groq response JSON:', parseErr);
      return {
        terminalLogs: [
          `[ERR] Failed parsing simulation engine JSON payload.`,
          `[DEBUG] Raw response: ${candidateText.substring(0, 300)}`
        ],
        coachReply: `I got a formatting error from the simulation system. Let's retry that last SRE strategy again.`,
        choices: [],
        completed: false
      };
    }

  } catch (err) {
    console.error('[GROQ API] Call failed:', err);
    return {
      terminalLogs: [
        `[ERR] Groq API request connection failed: ${err.message}`,
        `[INFO] Please verify your network connection and server settings.`
      ],
      coachReply: `I couldn't establish a connection to the AI simulation servers: ${err.message}. Please try again shortly.`,
      choices: [],
      completed: false
    };
  }
}

export async function generateOccupationQuiz(apiKey, occupationGoal) {
  try {
    if (!apiKey) {
      throw new Error('Missing API Key for Quiz Generation');
    }

    const systemInstruction = `You are an expert technical interviewer and SRE manager.
Generate a JSON object containing a 50-question technical quiz tailored for a candidate aiming to become a "${occupationGoal || 'Software Engineer'}".
The quiz MUST evaluate proficiency across these 6 core skills:
1. "System Design"
2. "Cloud & DevOps (AWS/Docker)"
3. "Git & Code Review"
4. "Data Structures & Algorithms"
5. "Secure Coding (OWASP)"
6. "Technical Writing"

The output MUST be a valid JSON object with a single key "questions" containing an array of 50 objects.
Each object in the array MUST strictly match this JSON schema:
{
  "skill": "One of the 6 core skills listed above",
  "question": "A challenging, scenario-based multiple-choice question",
  "options": [
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4"
  ],
  "correctIndex": 0 // The integer index (0-3) of the correct option
}

Ensure the questions are highly relevant to ${occupationGoal || 'Software Engineer'}, practically grounded, and evenly distributed among the 6 skills.
Return ONLY valid JSON.`;

    const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: 'system', content: systemInstruction }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API returned status ${response.status}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error('Empty response from Groq API');
    }

    let parsed = JSON.parse(text.trim());
    if (parsed.questions && Array.isArray(parsed.questions)) {
      return parsed.questions;
    } else if (Array.isArray(parsed)) {
      return parsed;
    }
    
    throw new Error('Response is not a valid JSON array of questions');
  } catch (err) {
    console.error('[GENERATE QUIZ] Groq failed, using fallback...', err);
    // Return a small fallback set if AI fails
    return [
      {
        skill: "System Design",
        question: "You are designing a high-throughput URL shortener. Which database characteristic is most critical for the reads?",
        options: ["Strong ACID compliance", "High read availability and low latency", "Complex join performance", "Graph relationship traversal"],
        correctIndex: 1
      },
      {
        skill: "Cloud & DevOps (AWS/Docker)",
        question: "A Docker container keeps crashing with OOMKilled. What is the first step to diagnose this?",
        options: ["Increase the instance CPU", "Check docker stats and memory limits", "Rebuild the image with Alpine", "Switch to Kubernetes"],
        correctIndex: 1
      }
    ];
  }
}
