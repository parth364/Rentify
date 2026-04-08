import api from './api';

/**
 * Auth service — handles register, login, and profile fetching.
 */
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};
