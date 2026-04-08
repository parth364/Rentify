/**
 * Application-wide constants.
 * Centralizes magic strings and config values.
 */
const ITEM_CATEGORIES = [
  'textbooks',
  'electronics',
  'bikes',
  'cameras',
  'furniture',
  'clothing',
  'sports',
  'instruments',
  'other',
];

const ITEM_CONDITIONS = ['new', 'like-new', 'good', 'fair', 'poor'];

const RENTAL_STATUSES = ['pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'];

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  MAX_LIMIT: 50,
};

module.exports = {
  ITEM_CATEGORIES,
  ITEM_CONDITIONS,
  RENTAL_STATUSES,
  PAGINATION,
};
