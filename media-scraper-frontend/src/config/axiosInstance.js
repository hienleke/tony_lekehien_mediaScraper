// src/axiosInstance.js

import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001', // replace with your server base URL
});



export const setAuthToken = (token) => {
    if (token) {
      // If token is provided, set it in the Authorization header
      axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
    } else {
      // If no token, remove it from headers (useful for logging out)
      delete axiosInstance.defaults.headers['Authorization'];
    }
  };
  
  // Check for the token on initial load and set it
  const token = localStorage.getItem('jwt');
  if (token) {
    setAuthToken(token);  // Set token in the header
  }
export default axiosInstance;
