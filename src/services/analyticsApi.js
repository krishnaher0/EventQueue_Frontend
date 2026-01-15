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

export const analyticsAPI = {
  // Get admin overview analytics
  getAdminOverview: async (period = '30') => {
    const response = await fetch(`${API_BASE_URL}/analytics/admin/overview?period=${period}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Get event analytics
  getEventAnalytics: async (period = '30') => {
    const response = await fetch(`${API_BASE_URL}/analytics/admin/events?period=${period}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Get order analytics
  getOrderAnalytics: async (period = '30') => {
    const response = await fetch(`${API_BASE_URL}/analytics/admin/orders?period=${period}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },
};
