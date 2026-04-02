import api from './api';

const reviewService = {

  createReview: async (data) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  getGigReviews: async (gigId, params = {}) => {
    const response = await api.get(`/reviews/gig/${gigId}`, { params });
    return response.data;
  },

  getOrderReview: async (orderId) => {
    const response = await api.get(`/reviews/order/${orderId}`);
    return response.data;
  },

  respondToReview: async (reviewId, content) => {
    const response = await api.post(`/reviews/${reviewId}/response`, { content });
    return response.data;
  },

  getSellerReviews: async (sellerId, params = {}) => {
    const response = await api.get(`/reviews/seller/${sellerId}`, { params });
    return response.data;
  },

};

export default reviewService;