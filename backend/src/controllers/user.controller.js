const userService = require('../services/user.service');
const ApiResponse = require('../utils/apiResponse');

/**
 * Fetches a user's public profile by ID.
 * Input: req.params.id (userId)
 * Output: 200 with user object
 */
async function getUser(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);
    ApiResponse.success(res, 200, 'User fetched', { user });
  } catch (error) {
    next(error);
  }
}

/**
 * Updates the authenticated user's profile.
 * Input: req.body (profile fields), req.user._id
 * Output: 200 with updated user object
 */
async function updateProfile(req, res, next) {
  try {
    const user = await userService.updateProfile(req.user._id, req.body);
    ApiResponse.success(res, 200, 'Profile updated', { user });
  } catch (error) {
    next(error);
  }
}

module.exports = { getUser, updateProfile };
