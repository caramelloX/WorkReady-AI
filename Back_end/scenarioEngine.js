// Dynamic AI SRE Coach & Staging Pod Simulator engine


const modelName = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

export function runScenarioFallback(scenarioId, message, chatHistory) {
  return {
    terminalLogs: [
      `$ ${message}`,
      '[WARN] Groq API Key is missing or invalid in backend .env file.',
      '[INFO] Please configure GROQ_API_KEY in Back_end/.env to activate the dynamic AI SRE simulation.'
    ],
    coachReply: 'To interact with this scenario, please configure your GROQ_API_KEY in the backend `.env` file and restart the server. This will enable high-fidelity AI-driven simulation and coaching.',
    choices: [],
    completed: false
  };
}

export async function generateScenariosWithAI(apiKey) {
  try {
    if (!apiKey) {
      throw new Error('Missing API Key');
    }

    const systemInstruction = `You are a curriculum designer for a highly advanced software engineering and SRE training platform.
Generate a JSON object containing exactly 3 highly realistic and diverse software engineering, SRE, DevOps, or system security production incident scenarios.

The output MUST be a JSON object with a single key "scenarios" containing the array of scenarios.
Each scenario MUST strictly match this JSON schema:
{
  "id": "A unique identifier like S-201, S-202, etc.",
  "title": "A short, descriptive, professional title of the production incident",
  "desc": "Category, difficulty, and estimated time (e.g. 'Backend · Intermediate · 30 min' or 'Infra · Advanced · 45 min')",
  "difficulty": "Available",
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

Ensure the scenarios cover different areas (e.g., database pool exhaustion, memory leak, high CPU spike, SSL/TLS cert expiry, bad deployment rollbacks, microservice connection timeouts, or IAM permission blocks).
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

export async function runScenarioAI(scenarioId, scenarioTitle, message, chatHistory, apiKey) {
  try {
    const formattedHistory = chatHistory
      .slice(-10)
      .map(h => `${h.sender === 'coach' ? 'AI Coach' : 'Student'}: ${h.text || h.message || ''}`)
      .join('\n');

    const systemInstruction = `You are the staging container pod Linux shell emulator and expert SRE Coach for an interactive training sandbox game.
The active scenario is: ${scenarioId} (${scenarioTitle}).

Your behavior:
- Students can interact by choosing one of the suggested buttons, or typing free-form queries/commands in the input box.
- Act as the real Linux server shell, printing authentic output under "terminalLogs". Ensure standard Unix command prompts are outputted, like:
  "$ command"
  "output lines..."
  Followed by error tracebacks or success prints if appropriate.
- Act as the expert SRE mentor coach, explaining why the action succeeded or failed, teaching them deep SRE concepts (pool connections, Sequential Scans, concurrent indices, memory heap retention paths) under "coachReply".
- Offer 2-3 new, logical, highly realistic troubleshooting actions under "choices" that help the student progress.
- Once the student has diagnosed and deployed a correct and permanent fix for the root cause of the issue, set "completed" to true and return no further choices (choices: []). If they took a temporary restart/scaling bandaid, explain why it's a bandaid, reset connections, keep completed: false.

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
