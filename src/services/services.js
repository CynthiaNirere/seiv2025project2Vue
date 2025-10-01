<<<<<<< HEAD
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

// Request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.baseURL + config.url);
    console.log('Request data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.data);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('Response error:', error.response.status);
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
      console.error('Make sure your backend is running on http://localhost:3000');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

=======
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api", // Change this to your backend API URL
  headers: {
    "Content-Type": "application/json",
  },
});

>>>>>>> 569c5b8 (added edit page)
export default apiClient;