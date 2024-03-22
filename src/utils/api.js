import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL, // Replace with your API base URL
});

// Request interceptor
api.interceptors.request.use((config) => {
  const admin = localStorage.getItem('admin');
  const staff = localStorage.getItem('staff');
  let authToken;
  if (window.location.pathname.startsWith('/admin')) {
    authToken = JSON.parse(admin)
  } else {
    authToken = JSON.parse(staff)
  }
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locale = localStorage.getItem('locale');
  config.headers['x-localization'] = locale;
  config.headers['timezone'] = userTimeZone;
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken.token}`;
  }
  return config;
}, (error) => {
  console.error(error);
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error?.response?.status === 401 || error?.response?.status === 403) {
    if (window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('admin');
      window.location.href = '/admin/login';
    } else {
      let redirectPath = localStorage.getItem('redirect');
      if (window.location.pathname.startsWith('/staff/event-staff/')) {
        localStorage.removeItem('staff');
        setTimeout(function () {
          window.location.href = redirectPath;
        }, 4000);
      } else if (window.location.pathname.startsWith('/staff/login')) {
        console.log('do nothing');
      } else {
        localStorage.removeItem('staff');
        setTimeout(function () {
          window.location.href = redirectPath;
        }, 4000);
      }
      localStorage.removeItem('redirect');
    }
    toast.error(error.response.data.message, {
      position: "top-right",
    });
    return
  }
  // eslint-disable-next-line no-undef
  return Promise.reject(error);
});

export default api;
