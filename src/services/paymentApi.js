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

export const paymentsAPI = {
  // Event payment
  initiateEventPayment: async (eventId, ticketType, quantity, paymentMethod = 'esewa') => {
    const response = await fetch(`${API_BASE_URL}/payments/event/${eventId}/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ ticketType, quantity, paymentMethod }),
    });
    return handleResponse(response);
  },

  verifyEventPayment: async (data) => {
    const response = await fetch(`${API_BASE_URL}/payments/event/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    return handleResponse(response);
  },

  completePendingEventPayment: async () => {
    const response = await fetch(`${API_BASE_URL}/payments/event/complete-pending`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Order payment
  initiateOrderPayment: async (items, shippingAddress, paymentMethod = 'esewa') => {
    const response = await fetch(`${API_BASE_URL}/payments/order/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ items, shippingAddress, paymentMethod }),
    });
    return handleResponse(response);
  },

  verifyOrderPayment: async (data) => {
    const response = await fetch(`${API_BASE_URL}/payments/order/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    return handleResponse(response);
  },

  // Venue payment
  initiateVenuePayment: async (bookingId, paymentMethod = 'esewa') => {
    const response = await fetch(`${API_BASE_URL}/payments/venue/${bookingId}/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ paymentMethod }),
    });
    return handleResponse(response);
  },

  verifyVenuePayment: async (data) => {
    const response = await fetch(`${API_BASE_URL}/payments/venue/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    });
    return handleResponse(response);
  },

  completePendingVenuePayment: async () => {
    const response = await fetch(`${API_BASE_URL}/payments/venue/complete-pending`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  completePendingOrderPayment: async () => {
    const response = await fetch(`${API_BASE_URL}/payments/order/complete-pending`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Khalti verification
  verifyKhaltiPayment: async (pidx, type) => {
    const response = await fetch(`${API_BASE_URL}/payments/khalti/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pidx, type }),
    });
    return handleResponse(response);
  },

  // User's payment history
  getMyPayments: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/payments/my?${queryString}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Admin routes
  getAllAdmin: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/payments/admin/all?${queryString}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },
};