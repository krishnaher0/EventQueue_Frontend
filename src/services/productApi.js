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

export const productsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/products?${queryString}`);
    return handleResponse(response);
  },

  getFeatured: async () => {
    const response = await fetch(`${API_BASE_URL}/products/featured`);
    return handleResponse(response);
  },

  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    return handleResponse(response);
  },

  // Admin routes
  getAllAdmin: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/products/admin/all?${queryString}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  create: async (productData) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: productData, // FormData
    });
    return handleResponse(response);
  },

  update: async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
      body: productData,
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  toggleStatus: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/toggle-status`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  toggleFeatured: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}/toggle-featured`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },
};