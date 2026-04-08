const { User } = require('../models');
const ApiError = require('../utils/apiError');

/**
 * Fetches a user profile by ID.
 * Input: userId (ObjectId string)
 * Output: user object (public profile)
 */
async function getUserById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user;
}

/**
 * Updates the authenticated user's profile fields.
 * Only allows updating safe fields (name, bio, campus, phone, avatar).
 * Input: userId (string), updateData (object with allowed fields)
 * Output: updated user object
 */
async function updateProfile(userId, updateData) {
  const allowedFields = ['name', 'bio', 'campus', 'phone', 'avatar'];
  const filteredData = {};

  for (const field of allowedFields) {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  }

  const user = await User.findByIdAndUpdate(userId, filteredData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return user;
}

/**
 * Updates a user's average rating and total review count.
 * Called internally after a new review is created.
 * Input: userId (string), newRating (number)
 * Output: updated user object
 */
async function updateUserRating(userId, newRating) {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  const totalRatingPoints = user.rating * user.totalReviews + newRating;
  user.totalReviews += 1;
  user.rating = Math.round((totalRatingPoints / user.totalReviews) * 10) / 10;

  await user.save();
  return user;
}

module.exports = { getUserById, updateProfile, updateUserRating };
