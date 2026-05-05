import { create } from 'zustand';

// Simple helper to safely parse JSON
const safeJsonParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    return null;
  }
};

const useAuthStore = create((set) => ({
  user: safeJsonParse(localStorage.getItem('user')),
  token: localStorage.getItem('token'),
  
  login: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
  },
  
  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
  
  updateUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    set({ user });
  }
}));

export default useAuthStore;
