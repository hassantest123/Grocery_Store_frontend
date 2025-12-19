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
      // Clear token and redirect to login
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
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      window.location.href = '/MyAccountSignIn';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

