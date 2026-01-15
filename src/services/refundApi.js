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

export const refundAPI = {
  // Request a refund
  requestRefund: async (eventId, attendeeEntryId, reason, bankDetails = {}) => {
    const response = await fetch(`${API_BASE_URL}/refunds/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ eventId, attendeeEntryId, reason, bankDetails }),
    });
    return handleResponse(response);
  },

  // Get my refund requests
  getMyRefunds: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/refunds/my?${queryString}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Admin: Get all refund requests
  getAllRefunds: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/refunds/admin/all?${queryString}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Admin: Get refund stats
  getRefundStats: async () => {
    const response = await fetch(`${API_BASE_URL}/refunds/admin/stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Admin: Approve refund
  approveRefund: async (refundId, adminNotes, refundMethod) => {
    const response = await fetch(`${API_BASE_URL}/refunds/${refundId}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ adminNotes, refundMethod }),
    });
    return handleResponse(response);
  },

  // Admin: Reject refund
  rejectRefund: async (refundId, adminNotes) => {
    const response = await fetch(`${API_BASE_URL}/refunds/${refundId}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ adminNotes }),
    });
    return handleResponse(response);
  },

  // Admin: Mark refund as processed
  processRefund: async (refundId, transactionId, adminNotes) => {
    const response = await fetch(`${API_BASE_URL}/refunds/${refundId}/process`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ transactionId, adminNotes }),
    });
    return handleResponse(response);
  },
};
