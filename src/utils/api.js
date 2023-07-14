import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://api.example.com', // Replace with your API base URL
});

// Request interceptor
api.interceptors.request.use((config) => {
  // Retrieve the authentication token from wherever it's stored (e.g., localStorage, cookies, etc.)
  const authToken = localStorage.getItem('authToken');
  
  // Add the authentication token to the request headers
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return config;
}, (error) => {
  // Handle request error
  
  // eslint-disable-next-line no-undef
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use((response) => {
  // Handle successful response
  return response;
}, (error) => {
  // Handle error response
  if (error.response.status === 401) {
    // Handle unauthorized access (e.g., redirect to login page)
    window.location.href = '/login';
  }
  
  // eslint-disable-next-line no-undef
  return Promise.reject(error);
});

export default api;
