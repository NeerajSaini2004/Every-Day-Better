import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const path = window.location.pathname || '';
      const authPaths = ['/login', '/register', '/forgot-password', '/reset-password'];

      // Avoid hard-redirect loops when already on an auth-related page
      const isAuthPage = authPaths.some((p) => path === p || path.startsWith(`${p}/`));
      if (!isAuthPage) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
