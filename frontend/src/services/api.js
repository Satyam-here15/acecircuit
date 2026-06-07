import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
};

export const interviewAPI = {
  startSession: (data) => api.post('/api/interview/start', data),
  submitAnswer: (data) => api.post('/api/interview/submit', data),
  getSessions: () => api.get('/api/interview/sessions'),
  getSessionDetails: (id) => api.get(`/api/interview/sessions/${id}`),
  getLeaderboard: () => api.get('/api/interview/leaderboard'),
};

export const userAPI = {
  getProfile: () => api.get('/api/user/profile'),
  updateProfile: (data) => api.put('/api/user/profile', data),
};

export default api;