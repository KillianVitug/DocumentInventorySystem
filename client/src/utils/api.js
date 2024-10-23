import axios from 'axios';

// Axios instance with credentials
const apiWithCredentials = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Base URL from environment variable
  withCredentials: true,                      // Send cookies with requests
});

// Axios instance without credentials
const apiWithoutCredentials = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Base URL from environment variable
  withCredentials: false,                     // Do not send cookies
  credentials: 'same-origin',
});

// Export both instances
export { apiWithCredentials, apiWithoutCredentials };
