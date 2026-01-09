import { API_BASE_URL, getAuthHeader, handleResponse } from './utils.js';

export const ordersAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/orders?${queryString}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  getMyOrders: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/orders/my?${queryString}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  create: async (orderData) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(orderData),
    });
    return handleResponse(response);
  },

  updateStatus: async (id, status) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },

  cancel: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/cancel`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Admin routes
  getAllAdmin: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/orders/admin/all?${queryString}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/orders/stats`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },
};