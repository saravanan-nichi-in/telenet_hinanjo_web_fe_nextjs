import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL, // Replace with your API base URL
});

// Request interceptor
api.interceptors.request.use((config) => {
  const admin = localStorage.getItem('admin');
  const staff = localStorage.getItem('staff');
  const hqStaff = localStorage.getItem('hq-staff');
  let authToken;
  if (window.location.pathname.startsWith('/admin')) {
    authToken = JSON.parse(admin)
  } else if (window.location.pathname.startsWith('/hq-staff')) {
    authToken = JSON.parse(hqStaff)
  } else {
    authToken = JSON.parse(staff)
  }
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locale = localStorage.getItem('locale');
  // Add the authentication token to the request headers
  config.headers['x-localization'] = locale;
  config.headers['timezone'] = userTimeZone;
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken.token}`;
  }
  return config;
}, (error) => {
  // Handle request error
  console.error(error);
  // eslint-disable-next-line no-undef
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use((response) => {
  // Handle successful response
  return response;
}, (error) => {
  // Handle response error
  if (error?.response?.status == 401 || error?.response?.status == 403) {
    if (window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('admin');
      window.location.href = '/admin/login';
    } else if (window.location.pathname.startsWith('/hq-staff')) {
      localStorage.removeItem('hq-staff');
      window.location.href = '/hq-staff/login';
    } else if (window.location.pathname.startsWith('/staff')) {
      localStorage.removeItem('staff');
      window.location.href = '/user/list';
    }
  }
  return Promise.reject(error);
});

export default api;