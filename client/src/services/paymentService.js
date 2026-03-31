import api from './api';

const paymentService = {

  createPaymentIntent: async ({ gigId, packageType }) => {
    const response = await api.post('/payments/create-intent', { gigId, packageType });
    return response.data;
  },

  getPaymentStatus: async (orderId) => {
    const response = await api.get(`/payments/${orderId}/status`);
    return response.data;
  },

};

export default paymentService;