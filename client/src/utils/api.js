import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (credentials) => {
    // credentials: { email, password }
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    // userData: { name, email, password }
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

// Designs API
export const designsAPI = {
  getAll: async () => {
    const response = await api.get('/designs');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/designs/${id}`);
    return response.data;
  },
  create: async (formData) => {
    const response = await api.post('/designs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  update: async (id, formData) => {
    const response = await api.put(`/designs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/designs/${id}`);
    return response.data;
  },
};

export default api;










