// Central API client utility with resilient backend check and fallbacks
let isBackendOnline = false;

// Check backend server health check endpoint on startup
export const checkHealth = async () => {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
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
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Invalid credentials');
    }
    return await res.json();
  },

  register: async (role, fullName, username, email, password, target_track, target_industry) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, fullName, username, email, password, target_track, target_industry })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to create account');
    }
    return await res.json();
  },

  updateProfile: async (userId, profileData) => {
    const res = await fetch(`/api/auth/profile/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to update profile');
    }
    return await res.json();
  },

  // 2. Candidates Catalog
  getCandidates: async () => {
    const res = await fetch('/api/candidates');
    if (!res.ok) throw new Error('Failed to fetch candidates');
    return await res.json();
  },

  getCandidate: async (id) => {
    const res = await fetch(`/api/candidates/${id}`);
    if (!res.ok) throw new Error('Candidate not found');
    return await res.json();
  },

  // 3. Student Self-Competency Ratings
  getStudentRatings: async (studentId) => {
    const res = await fetch(`/api/student/ratings/${studentId}`);
    if (!res.ok) throw new Error('Failed to fetch ratings');
    return await res.json();
  },

  saveStudentRatings: async (studentId, ratings) => {
    const res = await fetch('/api/student/ratings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, ...ratings })
    });
    if (!res.ok) throw new Error('Failed to save ratings');
    return await res.json();
  },

  // 4. Submissions API
  getSubmissions: async () => {
    const res = await fetch('/api/submissions');
    if (!res.ok) throw new Error('Failed to fetch submissions');
    return await res.json();
  },

  addSubmission: async (student, type, artifact) => {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student, type, artifact })
    });
    if (!res.ok) throw new Error('Failed to add submission');
    return await res.json();
  },

  reviewSubmission: async (id, status, feedback) => {
    const res = await fetch('/api/submissions/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status, feedback })
    });
    if (!res.ok) throw new Error('Failed to review submission');
    return await res.json();
  },

  // 5. Mentor Highlights
  getMentorHighlights: async () => {
    const res = await fetch('/api/mentor/highlights');
    if (!res.ok) throw new Error('Failed to fetch highlights');
    return await res.json();
  },

  saveMentorHighlight: async (studentId, highlightComment) => {
    const res = await fetch('/api/mentor/highlights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, highlightComment })
    });
    if (!res.ok) throw new Error('Failed to save highlight');
    return await res.json();
  },

  // 6. Migrated Data
  getScenarios: async () => {
    const res = await fetch('/api/scenarios');
    if (!res.ok) throw new Error('Failed to fetch scenarios');
    return await res.json();
  },

  getPortfolio: async () => {
    const res = await fetch('/api/portfolio');
    if (!res.ok) throw new Error('Failed to fetch portfolio');
    return await res.json();
  },

  getMentorStudents: async () => {
    const res = await fetch('/api/mentor/students');
    if (!res.ok) throw new Error('Failed to fetch mentor students');
    return await res.json();
  }
};
