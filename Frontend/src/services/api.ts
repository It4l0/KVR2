import axios from 'axios';

// Prefer env var, fallback to Nginx proxy path inside the container
// In Docker, the frontend is served by Nginx and proxies /api -> backend:3000
// So using a relative path avoids CORS and works across environments
const baseURL = import.meta?.env?.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Prefer using AxiosHeaders.set if available to satisfy typing
    const headers: any = config.headers ?? {};
    if (typeof headers.set === 'function') {
      headers.set('Authorization', `Bearer ${token}`);
      config.headers = headers;
    } else {
      headers.Authorization = `Bearer ${token}`;
      config.headers = headers;
    }
  }
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      // optional: avoid infinite loop if already on login
      try { localStorage.removeItem('token'); } catch {}
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
