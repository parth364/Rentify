import api from './api';

/**
 * Item service — handles item CRUD and search/filter queries.
 */
export const itemService = {
  getItems: (params = '') => api.get(`/items${params ? '?' + params : ''}`),
  getItem: (id) => api.get(`/items/${id}`),
  getMyItems: () => api.get('/items/mine'),
  createItem: (data) => api.post('/items', data),
  updateItem: (id, data) => api.put(`/items/${id}`, data),
  deleteItem: (id) => api.delete(`/items/${id}`),
};
