import axios from 'axios';

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Full request URL:', `${config.baseURL}${config.url}`);
  console.log('Request method:', config.method);
  console.log('Request data:', config.data);
  console.log('Token present:', !!token);
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
response => response,
error => {
  console.error('API Error:', {
    url: error.config.url,
    method: error.config.method,
    status: error.response?.status,
    statusText: error.response?.statusText,
    data: error.response?.data,
    message: error.message
  });
  throw error;
}
);

export default API;
