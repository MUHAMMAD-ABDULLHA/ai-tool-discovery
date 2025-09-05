// src/hooks/useAuth.js

import { useState } from 'react';
import axios from '../api/axios';
import useAuthStore from '../store/AuthStore';

const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login, logout, user } = useAuthStore();

  const handleLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/auth/login', credentials);
      const { token, refreshToken, user } = response.data;
      login(token, refreshToken, user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/auth/register', userData);
      const { token, refreshToken, user } = response.data;
      login(token, refreshToken, user);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
    } catch (err) {
      console.error('Logout failed on server:', err);
    } finally {
      logout();
    }
  };

  return {
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};

export default Auth;