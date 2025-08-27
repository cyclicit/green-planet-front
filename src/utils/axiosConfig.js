import axios from 'axios';
import API_BASE_URL from '../config/api';

// Configure axios defaults
axios.defaults.baseURL = API_BASE_URL;

// Add request interceptor
axios.interceptors.request.use(
  (config) => {
    console.log('Making API request to:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axios;