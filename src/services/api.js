import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    console.log('Request URL:', config.url);
    console.log('Token present:', !!token);
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization header set:', `Bearer ${token}`);
    }
    return config;
  });
API.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', {
      endpoint: error.config.url,
      method: error.config.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message
    });
    throw error;
  }
);

export default API;
