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
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error.response?.data?.message || error.message || 'Failed to fetch summary';
    }
  },

  getCards: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/dashboard/cards`,
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw error.response?.data?.message || error.message || 'Failed to fetch cards';
    }
  },

  getOverview: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/dashboard/overview`,
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching overview:', error);
      throw error.response?.data?.message || error.message || 'Failed to fetch overview';
    }
  },

  getStats: async (startDate, endDate) => {
    try {
      const response = await axios.get(
        `${API_URL}/dashboard/stats?startDate=${startDate}&endDate=${endDate}`,
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error.response?.data?.message || error.message || 'Failed to fetch stats';
    }
  },

  getEngagement: async (days = 30) => {
    try {
      const response = await axios.get(
        `${API_URL}/dashboard/engagement?days=${days}`,
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching engagement:', error);
      throw error.response?.data?.message || error.message || 'Failed to fetch engagement';
    }
  }
};

export default dashboardService;
