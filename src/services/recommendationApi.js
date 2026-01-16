const API_BASE_URL = 'http://localhost:3000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw data;
  }
  return data;
};

export const recommendationAPI = {
  // Get recommended events (personalized if logged in, trending if not)
  getRecommendedEvents: async (limit = 6) => {
    const response = await fetch(`${API_BASE_URL}/recommendations/events?limit=${limit}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Get user's recommendation insights (requires login)
  getUserInsights: async () => {
    const response = await fetch(`${API_BASE_URL}/recommendations/insights`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },
};
