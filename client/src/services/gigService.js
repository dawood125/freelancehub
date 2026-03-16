import api from './api';

const gigService = {
  getAllGigs: async (params = {}) => {
    const response = await api.get('/gigs', { params });
    return response.data;
  },

  getGig: async (id) => {
    const response = await api.get(`/gigs/${id}`);
    return response.data;
  },

  getMyGigs: async () => {
    const response = await api.get('/gigs/user/me');
    return response.data;
  },

  createGig: async (data) => {
    const response = await api.post('/gigs', data);
    return response.data;
  },

  updateGig: async (id, data) => {
    const response = await api.put(`/gigs/${id}`, data);
    return response.data;
  },

  deleteGig: async (id) => {
    const response = await api.delete(`/gigs/${id}`);
    return response.data;
  },

  uploadImages: async (id, files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    const response = await api.post(`/gigs/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },


  deleteImage: async (gigId, imageId) => {
    const response = await api.delete(`/gigs/${gigId}/images/${imageId}`);
    return response.data;
  },
};

export default gigService;