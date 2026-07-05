import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

const authService = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      if (response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
      }
      return response.data.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error.response?.data?.message || error.message || 'Registration failed';
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data.data?.token) {
        localStorage.setItem('token', response.data.data.token);
      }
      return response.data.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`, {}, getAuthHeader());
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('token');
    }
  },

  getMe: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, getAuthHeader());
      return response.data.data;
    } catch (error) {
      console.error('Get user error:', error);
      throw error.response?.data?.message || error.message || 'Failed to get user';
    }
  },

  updateProfile: async (profileData) => {
    try {
      const response = await axios.put(
        `${API_URL}/auth/profile`,
        profileData,
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error.response?.data?.message || error.message || 'Failed to update profile';
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await axios.put(
        `${API_URL}/auth/change-password`,
        passwordData,
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error.response?.data?.message || error.message || 'Failed to change password';
    }
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
