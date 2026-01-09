import axios from 'axios';

const API_BASE = process.env.VITE_API_URL || 'http://localhost:5000/api/events';

export const eventsAPI = {
  getAllAdmin: () => axios.get(`${API_BASE}/admin`),
  create: (data) => axios.post(`${API_BASE}/admin`, data),
  update: (id, data) => axios.put(`${API_BASE}/admin/${id}`, data),
  delete: (id) => axios.delete(`${API_BASE}/admin/${id}`),
};
