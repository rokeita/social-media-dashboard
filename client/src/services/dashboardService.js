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

const dashboardService = {
  getSummary: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/dashboard/summary`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  },

  getCards: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/dashboard/cards`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw error;
    }
  },

  getOverview: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/dashboard/overview`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching overview:', error);
      throw error;
    }
  }
};

export default dashboardService;