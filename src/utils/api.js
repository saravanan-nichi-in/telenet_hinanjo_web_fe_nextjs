import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const PRODUCTION_HOST = process.env.NEXT_PUBLIC_PRODUCTION_HOST;

// Create an Axios instance
const api = axios.create({
  baseURL: API_URL, // Replace with your API base URL
});

let is511ToastDisplayed = false; // Variable to track whether the 511 toast has been displayed

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
  const getCookieValueByKey = (key) => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Check if the cookie starts with the specified key
      if (cookie.startsWith(key + '=')) {
        return cookie.substring(key.length + 1);
      }
    }
    return '';
  };
  const myCookieValue = getCookieValueByKey('idToken');

  // Add the authentication token to the request headers
  config.headers['x-localization'] = locale;
  config.headers['timezone'] = userTimeZone;
  if (authToken) {
    config.headers['Authorization'] = `Bearer ${authToken.token}`;
  }
  if (myCookieValue) {
    config.headers['idToken'] = myCookieValue;
  } else {
    config.headers['idToken'] = "";
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
  if (error?.response && error?.response?.status == 511 || error?.response?.status == 401 || error?.response?.status == 403) {
    if (process.env.NODE_ENV !== 'production') {
      if (!is511ToastDisplayed && window.location.pathname.startsWith('/admin/stockpile/summary')) {
        toast.error(error?.response?.data?.message, {
          position: "top-right",
        });
        is511ToastDisplayed = true; // Set the flag to true after displaying the toast
      }
      if (error?.response?.status == 401 || error?.response?.status == 403) {
        if (window.location.pathname.startsWith('/admin')) {
          localStorage.removeItem('admin');
          // window.location.href = '/admin/login';
        } else if (window.location.pathname.startsWith('/hq-staff')) {
          localStorage.removeItem('hq-staff');
          window.location.href = '/hq-staff/login';
        } else {
          let redirectPath = localStorage.getItem('redirect');
          if (window.location.pathname.startsWith('/staff/event-staff/')) {
            localStorage.removeItem('staff');
            setTimeout(function () {
              window.location.href = redirectPath;
            }, 4000);
          } else {
            localStorage.removeItem('staff');
            setTimeout(function () {
              window.location.href = redirectPath;
            }, 4000);
          }
          localStorage.removeItem('redirect');
        }
      }
    } else {
      if (error?.response?.status == 511) {
        if (!is511ToastDisplayed && window.location.pathname.startsWith('/admin/stockpile/summary')) {
          const locale = localStorage.getItem('locale');
          const confirmation = window.confirm(
            locale === 'ja' ? 'ログイン後、一定の時間が経過したため、再ログインをしてください。' : 'Session expired, please log in again.'
          );
          if (confirmation) {
            window.location.href = PRODUCTION_HOST;
          }
          is511ToastDisplayed = true; // Set the flag to true after displaying the toast
        }
      } else {
        if (!is511ToastDisplayed && window.location.pathname.startsWith('/admin/stockpile/summary')) {
          toast.error(error?.response?.data?.message, {
            position: "top-right",
          });
          is511ToastDisplayed = true; // Set the flag to true after displaying the toast
        }
        if (window.location.pathname.startsWith('/admin')) {
          localStorage.removeItem('admin');
        } else if (window.location.pathname.startsWith('/hq-staff')) {
          localStorage.removeItem('hq-staff');
        } else {
          localStorage.removeItem('staff');
        }
        setTimeout(function () {
          window.location.href = PRODUCTION_HOST;
        }, 4000);
      }
    }
  }
  return Promise.reject(error);
});

export default api;