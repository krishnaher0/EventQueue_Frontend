// src/services/payments.service.js
import { apiFetch, getAuthHeader } from './apiClient';

export const paymentsAPI = {
  initiateEventPayment: (eventId, payload) =>
    apiFetch(`/payments/event/${eventId}/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(payload),
    }),

  verifyEventPayment: (data) =>
    apiFetch('/payments/event/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data }),
    }),

  verifyKhaltiPayment: (pidx, type) =>
    apiFetch('/payments/khalti/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pidx, type }),
    }),

  getMyPayments: (params = {}) =>
    apiFetch(`/payments/my?${new URLSearchParams(params)}`, {
      headers: getAuthHeader(),
    }),
};
