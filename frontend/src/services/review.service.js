import api from './api';

/**
 * Review service — handles review creation and queries.
 */
export const reviewService = {
  createReview: (data) => api.post('/reviews', data),
  getUserReviews: (userId) => api.get(`/reviews/user/${userId}`),
  getRentalReviews: (rentalId) => api.get(`/reviews/rental/${rentalId}`),
};
