import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically attach Bearer token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('opportunity_os_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Auth APIs
export async function loginApi(email, password) {
  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function registerApi(data) {
  const res = await api.post('/auth/register', data);
  return res.data;
}

export async function fetchMeApi() {
  const res = await api.get('/auth/me');
  return res.data;
}

// Student Profile
export async function fetchStudentProfile() {
  const res = await api.get('/student/profile');
  return res.data;
}

export async function updateStudentProfileApi(data) {
  const res = await api.put('/student/profile', data);
  return res.data;
}

// Opportunities
export async function fetchRecommendedOpportunities() {
  const res = await api.get('/opportunities/recommended');
  return res.data;
}

export async function fetchDiscoverOpportunities(params = {}) {
  const res = await api.get('/opportunities/discover', { params });
  return res.data;
}

export async function fetchOpportunityById(id) {
  const res = await api.get(`/opportunities/${id}`);
  return res.data;
}

// Applications
export async function fetchApplications() {
  const res = await api.get('/applications');
  return res.data;
}

export async function updateApplicationStatusApi(opportunityId, status, notes = '') {
  const res = await api.post('/applications/status', { opportunityId, status, notes });
  return res.data;
}

// Preparation Plans
export async function generatePreparationPlanApi(opportunityId) {
  const res = await api.post('/preparation/generate', { opportunityId });
  return res.data;
}

export async function togglePreparationTaskApi(taskId, isCompleted) {
  const res = await api.post(`/preparation/task/${taskId}/toggle`, { isCompleted });
  return res.data;
}

export async function fetchPreparationPlans() {
  const res = await api.get('/preparation/plans');
  return res.data;
}

// AI Assistant
export async function askOpportunityAIApi(opportunityId, prompt) {
  const res = await api.post('/ai/ask', { opportunityId, prompt });
  return res.data;
}

// Admin APIs
export async function fetchAdminOpportunitiesApi() {
  const res = await api.get('/admin/opportunities');
  return res.data;
}

export async function createOpportunityAdminApi(data) {
  const res = await api.post('/admin/opportunities', data);
  return res.data;
}

export async function updateOpportunityAdminApi(id, data) {
  const res = await api.put(`/admin/opportunities/${id}`, data);
  return res.data;
}

export async function deleteOpportunityAdminApi(id) {
  const res = await api.delete(`/admin/opportunities/${id}`);
  return res.data;
}
