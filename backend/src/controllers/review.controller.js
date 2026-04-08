const reviewService = require('../services/review.service');
const ApiResponse = require('../utils/apiResponse');

/**
 * Creates a review for a completed rental.
 * Input: req.body { rentalId, rating, comment }, req.user._id
 * Output: 201 with review object
 */
async function createReview(req, res, next) {
  try {
    const review = await reviewService.createReview(req.body, req.user._id.toString());
    ApiResponse.success(res, 201, 'Review created', { review });
  } catch (error) {
    next(error);
  }
}

/**
 * Fetches all reviews for a specific user.
 * Input: req.params.userId
 * Output: 200 with reviews array
 */
async function getUserReviews(req, res, next) {
  try {
    const reviews = await reviewService.getReviewsForUser(req.params.userId);
    ApiResponse.success(res, 200, 'Reviews fetched', { reviews });
  } catch (error) {
    next(error);
  }
}

/**
 * Fetches all reviews for a specific rental.
 * Input: req.params.rentalId
 * Output: 200 with reviews array
 */
async function getRentalReviews(req, res, next) {
  try {
    const reviews = await reviewService.getReviewsForRental(req.params.rentalId);
    ApiResponse.success(res, 200, 'Rental reviews fetched', { reviews });
  } catch (error) {
    next(error);
  }
}

module.exports = { createReview, getUserReviews, getRentalReviews };
