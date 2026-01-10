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

export const venuesAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/venues?${queryString}`);
    return handleResponse(response);
  },

  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/venues/featured`);
    return handleResponse(response);
  },

  getTypes: async () => {
    const response = await fetch(`${API_BASE_URL}/venues/types`);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`);
    return handleResponse(response);
  },

  checkAvailability: async (id, startDate, endDate) => {
    const response = await fetch(
      `${API_BASE_URL}/venues/${id}/availability?startDate=${startDate}&endDate=${endDate}`
    );
    return handleResponse(response);
  },

  book: async (id, bookingData) => {
    const response = await fetch(`${API_BASE_URL}/venues/${id}/book`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(bookingData),
    });
    return handleResponse(response);
  },

  getMyBookings: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/venues/bookings/my?${queryString}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Admin routes
  getAllAdmin: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/venues/admin/all?${queryString}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  getAllBookingsAdmin: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/venues/admin/bookings?${queryString}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  create: async (venueData) => {
    const response = await fetch(`${API_BASE_URL}/venues`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: venueData, // FormData
    });
    return handleResponse(response);
  },

  update: async (id, venueData) => {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
      body: venueData,
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/venues/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  approve: async (id) => {
    const response = await fetch(`${API_BASE_URL}/venues/${id}/approve`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  toggleStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/venues/${id}/toggle-status`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  toggleFeatured: async (id) => {
    const response = await fetch(`${API_BASE_URL}/venues/${id}/toggle-featured`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  updateBookingStatus: async (bookingId, status, adminNotes) => {
    const response = await fetch(`${API_BASE_URL}/venues/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status, adminNotes }),
    });
    return handleResponse(response);
  },
};