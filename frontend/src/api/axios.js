import axios from 'axios';

// Dynamic API base URL - works for both localhost and production
const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  const port = window.location.port;
  
  console.log('🔍 Detecting environment:', { hostname, port });
  
  // Development: localhost or 127.0.0.1
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('✅ Using localhost backend');
    return 'http://13.233.164.201:8000/api';
  }
  
  // Production: If accessing via IP address, use same IP for backend
  if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
    // Use the same IP but port 8000 for backend
    const backendUrl = `http://${hostname}:8000/api`;
    console.log('✅ Using same-IP backend:', backendUrl);
    return backendUrl;
  }
  
  // Production with domain: use environment variable or relative path
  console.log('✅ Using environment/relative backend');
  return import.meta.env.VITE_API_BASE_URL_HTTP || '/api';
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
