import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL, // Replace with your API base URL
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
  config.headers['x-localization'] = locale;
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken.token}`;
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
