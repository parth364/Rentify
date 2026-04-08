const jwt = require('jsonwebtoken');
const { User } = require('../models');
const ApiError = require('../utils/apiError');

/**
 * Generates a JWT token for a given user ID.
 * Input: userId (ObjectId string)
 * Output: signed JWT token string
 */
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

/**
 * Registers a new user account.
 * Checks for duplicate email, creates user, returns user + token.
 * Input: { name, email, password, campus }
 * Output: { user, token }
 */
async function register({ name, email, password, campus }) {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw ApiError.conflict('Email already registered');
  }

  const user = await User.create({ name, email, password, campus });
  const token = generateToken(user._id);

  return { user, token };
}

/**
 * Authenticates a user with email and password.
 * Returns user object and JWT token on success.
 * Input: { email, password }
 * Output: { user, token }
 */
async function login({ email, password }) {
  // Must explicitly select password since it's excluded by default
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = generateToken(user._id);

  // Remove password from response
  user.password = undefined;

  return { user, token };
}

/**
 * Returns the current authenticated user's profile.
 * Input: userId (ObjectId string)
 * Output: user object
 */
async function getMe(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  return user;
}

module.exports = { register, login, getMe, generateToken };
