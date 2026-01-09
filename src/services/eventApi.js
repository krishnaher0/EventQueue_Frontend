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

export const eventsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/events?${queryString}`);
    return handleResponse(response);
  },

  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/events/featured`);
    return handleResponse(response);
  },

  getTrending: async () => {
    const response = await fetch(`${API_BASE_URL}/events/trending`);
    return handleResponse(response);
  },

  getCategoryCounts: async () => {
    const response = await fetch(`${API_BASE_URL}/events/categories/counts`);
    return handleResponse(response);
  },

  getByCategory: async (category) => {
    const response = await fetch(`${API_BASE_URL}/events/category/${encodeURIComponent(category)}`);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`);
    return handleResponse(response);
  },

  create: async (eventData) => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: eventData, // FormData for file upload
    });
    return handleResponse(response);
  },

  update: async (id, eventData) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
      body: eventData,
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  book: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}/book`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Organizer routes
  getMyEvents: async () => {
    const response = await fetch(`${API_BASE_URL}/events/my-events`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  getOrganizerStats: async () => {
    const response = await fetch(`${API_BASE_URL}/events/organizer/stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  getOrganizerBookings: async () => {
    const response = await fetch(`${API_BASE_URL}/events/organizer/bookings`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Admin routes
  getAllEventsAdmin: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/events/admin/all?${queryString}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  getAdminStats: async () => {
    const response = await fetch(`${API_BASE_URL}/events/admin/stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  getAllUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/events/admin/users?${queryString}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  updateUserRole: async (userId, role) => {
    const response = await fetch(`${API_BASE_URL}/events/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ role }),
    });
    return handleResponse(response);
  },

  approveEvent: async (id) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}/approve`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  rejectEvent: async (id, reason) => {
    const response = await fetch(`${API_BASE_URL}/events/${id}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ reason }),
    });
    return handleResponse(response);
  },
};