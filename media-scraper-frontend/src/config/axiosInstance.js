// src/axiosInstance.js

import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001', 
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Allow all origins or specify the domain if needed
  },
  withCredentials: true, 
});



export const setAuthToken = (token) => {
    if (token) {

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
