import axios from 'axios';
import { BASE_URL } from './BaseUri';

/**
 * Main Axios Instance for API calls
 * This instance includes authentication headers automatically
 */
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

/**
 * Axios Instance for File Uploads
 * Use this for file upload operations with progress tracking
 */
export const axiosInstanceFile = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 60000, // 60 seconds timeout for file uploads
});

/**
 * Request Interceptor - Add JWT Token to requests
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Request Interceptor for File Uploads - Add JWT Token
 */
axiosInstanceFile.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('File upload request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Handle common errors
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response && error.response.status === 401) {
      // Skip auto-logout for certain endpoints - let the component handle it
      const requestUrl = error.config?.url || '';
      const requestMethod = error.config?.method?.toLowerCase() || '';
      
      // Skip auto-redirect for:
      // 1. Rating endpoints - let component handle the error
      // 2. Order creation endpoint - allows guest checkout without login
      if (requestUrl.includes('/rate') || 
          (requestUrl.includes('/api/v1/orders') && requestMethod === 'post')) {
        // Don't auto-logout for these endpoints, let component handle the error
        return Promise.reject(error);
      }
      
      // For other endpoints, clear token and redirect to login
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      window.location.href = '/MyAccountSignIn';
    }
    
    // Handle 403 Forbidden
    if (error.response && error.response.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor for File Uploads
 */
axiosInstanceFile.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Skip auto-redirect for order creation (guest checkout)
      const requestUrl = error.config?.url || '';
      const requestMethod = error.config?.method?.toLowerCase() || '';
      
      if (requestUrl.includes('/api/v1/orders') && requestMethod === 'post') {
        // Don't auto-redirect for order creation, let component handle the error
        return Promise.reject(error);
      }
      
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      window.location.href = '/MyAccountSignIn';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

