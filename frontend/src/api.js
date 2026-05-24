// Central API client utility with resilient backend check and fallbacks
let isBackendOnline = false;

// Helper to safely parse JSON from response without throwing 'Unexpected end of JSON input'
const safeParseJson = async (res) => {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.warn('[API CLIENT] Safe JSON parse failed. Returning fallback object.', error);
    return { error: text || 'Invalid JSON response from server' };
  }
};

// Check backend server health check endpoint on startup
export const checkHealth = async () => {
  try {
    const res = await fetch('/api/health');
    const data = await safeParseJson(res);
    isBackendOnline = (data && data.status === 'OK');
    console.log(`[API CLIENT] Connected to SQLite Express Backend: ${isBackendOnline ? 'ONLINE' : 'OFFLINE'}`);
  } catch (error) {
    isBackendOnline = false;
    console.warn('[API CLIENT] Backend server offline or unreachable.');
  }
  return isBackendOnline;
};

// Run checkHealth immediately
checkHealth();

export const api = {
  isOnline: () => isBackendOnline,

  // 1. Auth Clients
  login: async (username, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await safeParseJson(res);
    if (!res.ok) {
      throw new Error(data.error || 'Invalid credentials');
    }
    return data;
  },

  register: async (role, fullName, username, email, password, target_track, target_industry) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, fullName, username, email, password, target_track, target_industry })
    });
    const data = await safeParseJson(res);
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create account');
    }
    return data;
  },

  updateProfile: async (userId, profileData) => {
    const res = await fetch(`/api/auth/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    const data = await safeParseJson(res);
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update profile');
    }
    return data;
  },

  changePassword: async (userId, currentPassword, newPassword) => {
    const res = await fetch(`/api/auth/password/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await safeParseJson(res);
    if (!res.ok) {
      throw new Error(data.error || 'Failed to change password');
    }
    return data;
  },

  // 2. Candidates Catalog
  getCandidates: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/candidates?${query}`);
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to fetch candidates');
    return data;
  },

  getCandidate: async (id) => {
    const res = await fetch(`/api/candidates/${id}`);
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Candidate not found');
    return data;
  },

  // 3. Student Self-Competency Ratings
  getStudentRatings: async (studentId) => {
    const res = await fetch(`/api/student/ratings/${studentId}`);
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to fetch ratings');
    return data;
  },

  saveStudentRatings: async (studentId, ratings) => {
    const res = await fetch('/api/student/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, ...ratings })
    });
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to save ratings');
    return data;
  },

  // 4. Submissions API
  getSubmissions: async () => {
    const res = await fetch('/api/submissions');
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to fetch submissions');
    return data;
  },

  addSubmission: async (student, type, artifact) => {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student, type, artifact })
    });
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to add submission');
    return data;
  },

  reviewSubmission: async (id, status, feedback) => {
    const res = await fetch('/api/submissions/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, feedback })
    });
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to review submission');
    return data;
  },

  // 5. Mentor Highlights
  getMentorHighlights: async () => {
    const res = await fetch('/api/mentor/highlights');
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to fetch highlights');
    return data;
  },

  // 6. Admin API
  getAdminDashboardData: async () => {
    const res = await fetch('/api/admin/dashboard');
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to fetch admin data');
    return data;
  },

  getMentorHighlights: async () => {
    const res = await fetch('/api/mentor/highlights');
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to fetch highlights');
    return data;
  },

  addAdminUser: async (userData) => {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to add user');
    return data;
  },

  updateUserStatus: async (userId, newStatus) => {
    const res = await fetch(`/api/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to update status');
    return data;
  },

  updateAdminUser: async (userId, updateData) => {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to update user');
    return data;
  },

  saveMentorHighlight: async (studentId, highlightComment) => {
    const res = await fetch('/api/mentor/highlights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, highlightComment })
    });
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to save highlight');
    return data;
  },

  // 4. Scenarios
  getScenarios: async () => {
    const res = await fetch('/api/scenarios');
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to fetch scenarios');
    return data;
  },

  regenerateScenarios: async () => {
    const res = await fetch('/api/scenarios/regenerate', {
      method: 'POST'
    });
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to regenerate scenarios');
    return data;
  },

  updateScenario: async (id, title, desc, quiz) => {
    const res = await fetch(`/api/scenarios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, desc, quiz })
    });
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to update scenario');
    return data;
  },

  generateScenarioContent: async (id) => {
    const res = await fetch(`/api/scenarios/${id}/generate`, {
      method: 'POST'
    });
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to generate scenario content');
    return data;
  },

  chatWithScenario: async (scenarioId, scenarioTitle, message, chatHistory) => {
    const res = await fetch('/api/scenario/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioId, scenarioTitle, message, chatHistory })
    });
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to simulate step');
    return data;
  },

  // 9. Extra Endpoints

  getPortfolio: async () => {
    const res = await fetch('/api/portfolio');
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to fetch portfolio');
    return data;
  },

  getMentorStudents: async () => {
    const res = await fetch('/api/mentor/students');
    const data = await safeParseJson(res);
    if (!res.ok) throw new Error(data.error || 'Failed to fetch mentor students');
    return data;
  }
};
