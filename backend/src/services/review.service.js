const { Review, Rental } = require('../models');
const userService = require('./user.service');
const ApiError = require('../utils/apiError');

/**
 * Creates a review for a completed rental.
 * Validates that the rental is completed and the reviewer is a participant.
 * Prevents duplicate reviews per user per rental.
 * Input: { rentalId, rating, comment }, reviewerId (string)
 * Output: populated review object
 */
async function createReview({ rentalId, rating, comment }, reviewerId) {
  const rental = await Rental.findById(rentalId);
  if (!rental) {
    throw ApiError.notFound('Rental not found');
  }

  if (rental.status !== 'completed') {
    throw ApiError.badRequest('Can only review completed rentals');
  }

  const isOwner = rental.owner.toString() === reviewerId;
  const isRenter = rental.renter.toString() === reviewerId;

  if (!isOwner && !isRenter) {
    throw ApiError.forbidden('You are not part of this rental');
  }

  // Determine who is being reviewed
  const revieweeId = isOwner ? rental.renter.toString() : rental.owner.toString();

  // Check for existing review
  const existingReview = await Review.findOne({ rental: rentalId, reviewer: reviewerId });
  if (existingReview) {
    throw ApiError.conflict('You have already reviewed this rental');
  }

  const review = await Review.create({
    rental: rentalId,
    reviewer: reviewerId,
    reviewee: revieweeId,
    rating,
    comment: comment || '',
  });

  // Update the reviewee's average rating
  await userService.updateUserRating(revieweeId, rating);

  return review.populate([
    { path: 'reviewer', select: 'name avatar' },
    { path: 'reviewee', select: 'name avatar' },
  ]);
}

/**
 * Fetches all reviews received by a specific user.
 * Input: userId (string)
 * Output: array of populated review objects
 */
async function getReviewsForUser(userId) {
  return Review.find({ reviewee: userId })
    .populate('reviewer', 'name avatar')
    .populate('rental', 'item')
    .sort({ createdAt: -1 });
}

/**
 * Fetches all reviews for a specific rental.
 * Input: rentalId (string)
 * Output: array of populated review objects
 */
async function getReviewsForRental(rentalId) {
  return Review.find({ rental: rentalId })
    .populate('reviewer', 'name avatar')
    .populate('reviewee', 'name avatar')
    .sort({ createdAt: -1 });
}

module.exports = { createReview, getReviewsForUser, getReviewsForRental };
