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

export const reviewsAPI = {
  getProductReviews: async (productId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}?${queryString}`);
    return handleResponse(response);
  },

  createReview: async (productId, reviewData) => {
    const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(reviewData),
    });
    return handleResponse(response);
  },

  updateReview: async (reviewId, reviewData) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(reviewData),
    });
    return handleResponse(response);
  },

  deleteReview: async (reviewId) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  getMyReviews: async () => {
    const response = await fetch(`${API_BASE_URL}/reviews/my`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  markHelpful: async (reviewId) => {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}/helpful`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },
};