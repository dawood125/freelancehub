import api from './api';

const orderService = {
  
  createOrder: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getMyOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  submitRequirements: async (id, requirements) => {
    const response = await api.put(`/orders/${id}/requirements`, { requirements });
    return response.data;
  },

  deliverOrder: async (id, message) => {
    const response = await api.post(`/orders/${id}/deliver`, { message });
    return response.data;
  },

  requestRevision: async (id, note) => {
    const response = await api.post(`/orders/${id}/revision`, { note });
    return response.data;
  },

  acceptDelivery: async (id) => {
    const response = await api.post(`/orders/${id}/accept`);
    return response.data;
  },

  cancelOrder: async (id, reason) => {
    const response = await api.post(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  getOrderStats: async () => {
    const response = await api.get('/orders/stats');
    return response.data;
  },
};

export default orderService;