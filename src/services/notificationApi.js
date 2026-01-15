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

export const notificationAPI = {
  // Get all notifications
  getNotifications: async (limit = 20, skip = 0, unreadOnly = false) => {
    const response = await fetch(
      `${API_BASE_URL}/notifications?limit=${limit}&skip=${skip}&unreadOnly=${unreadOnly}`,
      {
        headers: { ...getAuthHeader() },
      }
    );
    return handleResponse(response);
  },

  // Get unread count
  getUnreadCount: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Mark all as read
  markAllAsRead: async () => {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Delete notification
  delete: async (notificationId) => {
    const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },
};
