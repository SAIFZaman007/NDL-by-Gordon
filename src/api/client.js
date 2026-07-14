import axios from 'axios';

// Same variable name and fallback pattern as the original App.jsx.
export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

export const AUTH_STORAGE_KEY = 'gordonit_auth';

// A single configured axios instance used by every page. Any endpoint that
// needs an Authorization header gets it automatically here, so individual
// pages never have to wire that up by hand.
const apiClient = axios.create({ baseURL: API_BASE });

apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (raw) {
    try {
      const { token } = JSON.parse(raw);
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Malformed storage — ignore and proceed unauthenticated.
    }
  }
  return config;
});

export default apiClient;
