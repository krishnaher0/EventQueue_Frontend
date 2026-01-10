import { API_BASE_URL, getAuthHeader, handleResponse } from './utils';

export const blogAPI = {
  // Get all blogs
  getBlogs: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/blogs?${queryParams}`);
    return handleResponse(response);
  },

  // Get single blog by slug
  getBlog: async (slug) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${slug}`);
    return handleResponse(response);
  },

  // Get my blogs
  getMyBlogs: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/blogs/my/blogs?${queryParams}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Create blog
  createBlog: async (blogData) => {
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: blogData,
    });
    return handleResponse(response);
  },

  // Update blog
  updateBlog: async (id, blogData) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: blogData,
    });
    return handleResponse(response);
  },

  // Delete blog
  deleteBlog: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Toggle like
  toggleLike: async (id) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}/like`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Add comment
  addComment: async (id, content) => {
    const response = await fetch(`${API_BASE_URL}/blogs/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ content }),
    });
    return handleResponse(response);
  },
};
