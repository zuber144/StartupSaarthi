/**
 * Startup Saarthi AI — Centralized API Client
 * Handles all backend communication with auth token management.
 */

const API_BASE = 'http://localhost:8000/api/v1';

// ------------------------------------------------------------------ //
//  Token Management
// ------------------------------------------------------------------ //

function getToken() {
  return localStorage.getItem('saarthi_token');
}

function setToken(token) {
  localStorage.setItem('saarthi_token', token);
}

function removeToken() {
  localStorage.removeItem('saarthi_token');
  localStorage.removeItem('saarthi_user');
}

function getUser() {
  const user = localStorage.getItem('saarthi_user');
  return user ? JSON.parse(user) : null;
}

function setUser(user) {
  localStorage.setItem('saarthi_user', JSON.stringify(user));
}

// ------------------------------------------------------------------ //
//  Base Request Helper
// ------------------------------------------------------------------ //

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle 401 — token expired
    if (response.status === 401) {
      removeToken();
      window.dispatchEvent(new Event('auth:logout'));
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `Request failed: ${response.status}`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Cannot connect to server. Is the backend running?');
    }
    throw error;
  }
}

// ------------------------------------------------------------------ //
//  Auth API
// ------------------------------------------------------------------ //

export const authAPI = {
  async signup(fullName, email, password, role = 'founder') {
    const data = await request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        full_name: fullName,
        email,
        password,
        role,
      }),
    });
    return data;
  },

  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.access_token) {
      setToken(data.access_token);
      setUser(data.user);
    }
    return data;
  },

  logout() {
    removeToken();
  },

  isLoggedIn() {
    return !!getToken();
  },

  getCurrentUser() {
    return getUser();
  },
};

// ------------------------------------------------------------------ //
//  Startups API
// ------------------------------------------------------------------ //

export const startupsAPI = {
  async create(startupData) {
    return request('/startups/', {
      method: 'POST',
      body: JSON.stringify(startupData),
    });
  },

  async list() {
    return request('/startups/');
  },

  async get(startupId) {
    return request(`/startups/${startupId}`);
  },

  async update(startupId, data) {
    return request(`/startups/${startupId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(startupId) {
    return request(`/startups/${startupId}`, {
      method: 'DELETE',
    });
  },
};

// ------------------------------------------------------------------ //
//  Schemes API
// ------------------------------------------------------------------ //

export const schemesAPI = {
  async list(query = '') {
    const params = query ? `?query=${encodeURIComponent(query)}` : '';
    return request(`/schemes/${params}`);
  },

  async get(schemeId) {
    return request(`/schemes/${schemeId}`);
  },

  async refresh() {
    return request('/schemes/refresh', { method: 'POST' });
  },

  async seed() {
    return request('/schemes/seed', { method: 'POST' });
  },
};

// ------------------------------------------------------------------ //
//  AI API — Multi-Agent Orchestration
// ------------------------------------------------------------------ //

export const aiAPI = {
  async analyze(startupId, userInput = '') {
    return request('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify({
        startup_id: startupId,
        user_input: userInput,
      }),
    });
  },

  async discoverSchemes(startupId) {
    return request('/ai/discover-schemes', {
      method: 'POST',
      body: JSON.stringify({ startup_id: startupId }),
    });
  },

  async getStrategy(startupId) {
    return request('/ai/strategy', {
      method: 'POST',
      body: JSON.stringify({ startup_id: startupId }),
    });
  },

  async generateDocuments(startupId) {
    return request('/ai/documents', {
      method: 'POST',
      body: JSON.stringify({ startup_id: startupId }),
    });
  },

  async monitor(startupId) {
    return request('/ai/monitor', {
      method: 'POST',
      body: JSON.stringify({ startup_id: startupId }),
    });
  },

  async getResults(startupId, agentType = null) {
    const params = agentType ? `?agent_type=${agentType}` : '';
    return request(`/ai/results/${startupId}${params}`);
  },
};

// ------------------------------------------------------------------ //
//  Applications API
// ------------------------------------------------------------------ //

export const applicationsAPI = {
  async create(startupId, schemeId) {
    return request('/applications/', {
      method: 'POST',
      body: JSON.stringify({
        startup_id: startupId,
        scheme_id: schemeId,
      }),
    });
  },

  async list(startupId) {
    return request(`/applications/${startupId}`);
  },

  async updateStatus(applicationId, status, approvalProbability = null) {
    return request(`/applications/${applicationId}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
        approval_probability: approvalProbability,
      }),
    });
  },
};

// ------------------------------------------------------------------ //
//  Notifications API
// ------------------------------------------------------------------ //

export const notificationsAPI = {
  async list(unreadOnly = false) {
    const params = unreadOnly ? '?unread_only=true' : '';
    return request(`/notifications/${params}`);
  },

  async markRead(notificationId) {
    return request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  async markAllRead() {
    return request('/notifications/read-all', {
      method: 'PUT',
    });
  },
};

// ------------------------------------------------------------------ //
//  Default Export
// ------------------------------------------------------------------ //

const api = {
  auth: authAPI,
  startups: startupsAPI,
  schemes: schemesAPI,
  ai: aiAPI,
  applications: applicationsAPI,
  notifications: notificationsAPI,
};

export default api;
