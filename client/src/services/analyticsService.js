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

const analyticsService = {
  getFollowersAnalytics: async (days = 30) => {
    try {
      const response = await axios.get(
        `${API_URL}/analytics/followers?days=${days}`,
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching followers analytics:', error);
      throw error.response?.data?.message || error.message || 'Failed to fetch analytics';
    }
  },

  getLikesAnalytics: async (days = 30) => {
    try {
      const response = await axios.get(
        `${API_URL}/analytics/likes?days=${days}`,
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching likes analytics:', error);
      throw error.response?.data?.message || error.message || 'Failed to fetch analytics';
    }
  },

  getCommentsAnalytics: async (days = 30) => {
    try {
      const response = await axios.get(
        `${API_URL}/analytics/comments?days=${days}`,
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching comments analytics:', error);
      throw error.response?.data?.message || error.message || 'Failed to fetch analytics';
    }
  },

  getEngagementAnalytics: async (days = 30) => {
    try {
      const response = await axios.get(
        `${API_URL}/analytics/engagement?days=${days}`,
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching engagement analytics:', error);
      throw error.response?.data?.message || error.message || 'Failed to fetch analytics';
    }
  },

  getPlatformComparison: async (days = 30) => {
    try {
      const response = await axios.get(
        `${API_URL}/analytics/platforms?days=${days}`,
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching platform comparison:', error);
      throw error.response?.data?.message || error.message || 'Failed to fetch analytics';
    }
  }
};

export default analyticsService;
