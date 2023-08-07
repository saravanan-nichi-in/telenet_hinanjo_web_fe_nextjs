import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://119.82.96.68:8000/api', // Replace with your API base URL
});

// Request interceptor
api.interceptors.request.use((config) => {
  // Retrieve the authentication token from wherever it's stored (e.g., localStorage, cookies, etc.)
  const adminPath = window.location.pathname.startsWith('/admin');
  const staffPath = window.location.pathname.startsWith('/staff');
  const admin = localStorage.getItem('admin');
  const staff = localStorage.getItem('staff');
  const authToken = adminPath ? JSON.parse(admin) : staffPath ? JSON.parse(staff) : ""
  const locale = localStorage.getItem('locale');

  // Add the authentication token to the request headers
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken.token}`;
    config.headers['x-localization'] = locale;
  }

  return config;
}, (error) => {
  // Handle request error
  console.log(error);
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
    // window.location.href = '/';
  }

  // eslint-disable-next-line no-undef
  return Promise.reject(error);
});

export default api;
