import api from './api';

const messageService = {
  getOrCreateConversation: async (orderId) => {
    const response = await api.post(`/messages/orders/${orderId}/conversation`);
    return response.data;
  },

  getConversations: async () => {
    const response = await api.get('/messages/conversations');
    return response.data;
  },

  getMessages: async (conversationId, params = {}) => {
    const response = await api.get(`/messages/conversations/${conversationId}/messages`, { params });
    return response.data;
  },

  sendMessage: async (conversationId, content) => {
    const response = await api.post(`/messages/conversations/${conversationId}/messages`, { content });
    return response.data;
  },

  markAsRead: async (conversationId) => {
    const response = await api.post(`/messages/conversations/${conversationId}/read`);
    return response.data;
  }
};

export default messageService;
