import { API_BASE_URL, getAuthHeader, handleResponse } from './utils.js';

export const organizerAPI = {
  submitRequest: async (requestData) => {
    const response = await fetch(`${API_BASE_URL}/organizer/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(requestData),
    });
    return handleResponse(response);
  },

  getMyRequest: async () => {
    const response = await fetch(`${API_BASE_URL}/organizer/my-request`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  getAllRequests: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/organizer/requests?${queryString}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  getPendingCount: async () => {
    const response = await fetch(`${API_BASE_URL}/organizer/requests/pending-count`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  approveRequest: async (requestId, adminNotes) => {
    const response = await fetch(`${API_BASE_URL}/organizer/requests/${requestId}/approve`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ adminNotes }),
    });
    return handleResponse(response);
  },

  rejectRequest: async (requestId, adminNotes) => {
    const response = await fetch(`${API_BASE_URL}/organizer/requests/${requestId}/reject`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ adminNotes }),
    });
    return handleResponse(response);
  },
};