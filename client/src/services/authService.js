import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authService = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data || error.message;
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data || error.message;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;