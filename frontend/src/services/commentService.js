import api from './api';

const commentService = {

  getComments: async (postId, params = {}) => {
    const response = await api.get(`/posts/${postId}/comments`, { params });
    return response.data;
  },

  createComment: async (postId, commentData) => {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  },

  updateComment: async (commentId, commentData) => {
    const response = await api.put(`/comments/${commentId}`, commentData);
    return response.data;
  },

  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response.data;
  },

  approveComment: async (commentId, isApproved) => {
    const response = await api.put(`/comments/${commentId}/approve`, { isApproved });
    return response.data;
  }
};

export default commentService;
