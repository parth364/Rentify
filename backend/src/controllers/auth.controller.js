const authService = require('../services/auth.service');
const ApiResponse = require('../utils/apiResponse');

/**
 * Handles user registration.
 * Input: req.body { name, email, password, campus }
 * Output: 201 with { user, token }
 */
async function register(req, res, next) {
  try {
    const { user, token } = await authService.register(req.body);
    ApiResponse.success(res, 201, 'Registration successful', { user, token });
  } catch (error) {
    next(error);
  }
}

/**
 * Handles user login.
 * Input: req.body { email, password }
 * Output: 200 with { user, token }
 */
async function login(req, res, next) {
  try {
    const { user, token } = await authService.login(req.body);
    ApiResponse.success(res, 200, 'Login successful', { user, token });
  } catch (error) {
    next(error);
  }
}

/**
 * Returns the currently authenticated user's profile.
 * Input: req.user (set by auth middleware)
 * Output: 200 with user object
 */
async function getMe(req, res, next) {
  try {
    const user = await authService.getMe(req.user._id);
    ApiResponse.success(res, 200, 'Profile fetched', { user });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, getMe };
