import axios from 'axios';

/**
 * Pre-configured Axios instance.
 * - Base URL from environment variable
 * - Automatically attaches JWT token to requests if available
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Request interceptor: attach auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nmf_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nmf_token');
      localStorage.removeItem('nmf_user');
    }
    return Promise.reject(error);
  }
);

export default api;
