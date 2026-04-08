import api from './api';

/**
 * Rental service — handles rental creation, status updates, and queries.
 */
export const rentalService = {
  createRental: (data) => api.post('/rentals', data),
  getMyRentals: () => api.get('/rentals/mine'),
  getReceivedRequests: () => api.get('/rentals/received'),
  getRental: (id) => api.get(`/rentals/${id}`),
  updateStatus: (id, status) => api.patch(`/rentals/${id}/status`, { status }),
};
