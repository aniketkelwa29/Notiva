// api.js - Backend Connection Service for Notiva App

// const API_BASE_URL = 'http://localhost:8080'; // Updated to 8080 for backend
const API_BASE_URL = 'https://notiva-trsd.onrender.com'; // Updated to 8080 for backend


const api = {
  getToken: () => localStorage.getItem('notiva_auth_token'),
  setToken: (token) => localStorage.setItem('notiva_auth_token', token),
  removeToken: () => localStorage.removeItem('notiva_auth_token'),

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token && !endpoint.startsWith('/auth/login') && !endpoint.startsWith('/user/register')) {
      headers['Authorization'] = `Bearer ${token}`; // Adjust prefix if needed
    }

    const config = { ...options, headers };

    try {
      const response = await fetch(url, config);

      let data;
      // Many 204/NO_CONTENT or pure OK responses don't have json
      const text = await response.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch (err) {
        data = text; // Just fallback string
      }

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Invalid token
          if (typeof handleLogout === 'function') handleLogout();
        }
        throw new Error(data?.message || data || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API Error on ${endpoint}:`, error);
      throw error;
    }
  },

  get: (endpoint, options = {}) => api.request(endpoint, { ...options, method: 'GET' }),
  post: (endpoint, body, options = {}) => api.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body, options = {}) => api.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint, body, options = {}) => api.request(endpoint, { ...options, method: 'DELETE', body: body ? JSON.stringify(body) : null }),

  // ==========================
  // Backend Services
  // ==========================

  // Auth & User
  login: (userName, password) => api.post('/auth/login', { userName, password }),
  register: (userName, email, password) => api.post('/user/register', { userName, email, password }),
  getUser: () => api.get('/user'),
  updateUser: (userData) => api.put('/user', userData),
  deleteUser: () => api.delete('/user'),

  // Notes
  getNotes: () => api.get('/note'),
  createNote: (noteData) => api.post('/note/createNote', noteData),
  updateNote: (noteData) => api.put('/note', noteData),
  deleteNote: (id) => api.delete(`/note/${id}`) // Note: Ensure backend supports /note/{id} or adjust to backend spec
};
