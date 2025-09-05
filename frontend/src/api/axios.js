// src/api/axios.js

import axios from 'axios';
import useAuthStore from '../store/AuthStore';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Adjust if your backend URL is different
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
instance.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { refreshToken, setToken } = useAuthStore.getState();

    // Check if error is 401 and not a refresh token request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`${instance.defaults.baseURL}/refresh`, {
          refreshToken,
        });
        setToken(res.data.token);
        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${res.data.token}`;
        return instance(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., redirect to login)
        console.error('Unable to refresh token:', refreshError);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default instance;