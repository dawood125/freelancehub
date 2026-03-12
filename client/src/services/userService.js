import api from './api';

const userService = {
  getMyProfile: async () => {
    const response = await api.get('/users/me');
    return response.data;
  },


  updateProfile: async (data) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.post('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAvatar: async () => {
    const response = await api.delete('/users/me/avatar');
    return response.data;
  },

  getPublicProfile: async (username) => {
    const response = await api.get(`/users/${username}`);
    return response.data;
  },
};

export default userService;