import { API_BASE_URL, getAuthHeader, handleResponse } from './utils';

export const communityAPI = {
  // Get all communities
  getCommunities: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/communities?${queryParams}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Get single community
  getCommunity: async (slug) => {
    const response = await fetch(`${API_BASE_URL}/communities/${slug}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Get my communities
  getMyCommunities: async () => {
    const response = await fetch(`${API_BASE_URL}/communities/my/communities`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Create community
  createCommunity: async (communityData) => {
    const response = await fetch(`${API_BASE_URL}/communities`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: communityData,
    });
    return handleResponse(response);
  },

  // Update community
  updateCommunity: async (id, communityData) => {
    const response = await fetch(`${API_BASE_URL}/communities/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: communityData,
    });
    return handleResponse(response);
  },

  // Join community
  joinCommunity: async (id) => {
    const response = await fetch(`${API_BASE_URL}/communities/${id}/join`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Leave community
  leaveCommunity: async (id) => {
    const response = await fetch(`${API_BASE_URL}/communities/${id}/leave`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Create post
  createPost: async (id, postData) => {
    const response = await fetch(`${API_BASE_URL}/communities/${id}/posts`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: postData,
    });
    return handleResponse(response);
  },

  // Toggle post like
  togglePostLike: async (communityId, postId) => {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/posts/${postId}/like`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  // Add post comment
  addPostComment: async (communityId, postId, content) => {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ content }),
    });
    return handleResponse(response);
  },

  // Group Chat APIs
  getGroupChat: async (communityId) => {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/chat`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  getChatMessages: async (communityId, page = 1, limit = 50) => {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/chat/messages?page=${page}&limit=${limit}`, {
      headers: { ...getAuthHeader() },
    });
    return handleResponse(response);
  },

  sendMessage: async (communityId, content) => {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/chat/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ content }),
    });
    return handleResponse(response);
  },

  addReaction: async (communityId, messageId, emoji) => {
    const response = await fetch(`${API_BASE_URL}/communities/${communityId}/chat/messages/${messageId}/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ emoji }),
    });
    return handleResponse(response);
  },
};
