const { Item } = require('../models');
const ApiError = require('../utils/apiError');
const { PAGINATION } = require('../utils/constants');

/**
 * Creates a new item listing.
 * Input: itemData (object with title, description, category, etc.), ownerId (string)
 * Output: created item object
 */
async function createItem(itemData, ownerId) {
  const item = await Item.create({ ...itemData, owner: ownerId });
  return item.populate('owner', 'name email avatar campus rating');
}

/**
 * Fetches a paginated, filterable list of items.
 * Supports search, category filter, condition filter, and sorting.
 * Input: query params { page, limit, search, category, condition, sort }
 * Output: { items, pagination }
 */
async function getItems(query) {
  const page = parseInt(query.page) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT);
  const skip = (page - 1) * limit;

  // Build filter object
  const filter = { isAvailable: true };

  if (query.category) {
    filter.category = query.category;
  }
  if (query.condition) {
    filter.condition = query.condition;
  }
  if (query.search) {
    filter.$text = { $search: query.search };
  }

  // Sort options
  let sort = { createdAt: -1 }; // Default: newest first
  if (query.sort === 'price_asc') sort = { pricePerDay: 1 };
  if (query.sort === 'price_desc') sort = { pricePerDay: -1 };
  if (query.sort === 'oldest') sort = { createdAt: 1 };

  const [items, total] = await Promise.all([
    Item.find(filter)
      .populate('owner', 'name email avatar campus rating')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Item.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Fetches a single item by its ID with owner details.
 * Input: itemId (string)
 * Output: item object with populated owner
 */
async function getItemById(itemId) {
  const item = await Item.findById(itemId).populate('owner', 'name email avatar campus rating totalReviews');
  if (!item) {
    throw ApiError.notFound('Item not found');
  }
  return item;
}

/**
 * Updates an item listing. Only the owner can update.
 * Input: itemId (string), updateData (object), userId (string)
 * Output: updated item object
 */
async function updateItem(itemId, updateData, userId) {
  const item = await Item.findById(itemId);
  if (!item) {
    throw ApiError.notFound('Item not found');
  }
  if (item.owner.toString() !== userId) {
    throw ApiError.forbidden('You can only edit your own items');
  }

  Object.assign(item, updateData);
  await item.save();
  return item.populate('owner', 'name email avatar campus rating');
}

/**
 * Deletes an item listing. Only the owner can delete.
 * Input: itemId (string), userId (string)
 * Output: deleted item object
 */
async function deleteItem(itemId, userId) {
  const item = await Item.findById(itemId);
  if (!item) {
    throw ApiError.notFound('Item not found');
  }
  if (item.owner.toString() !== userId) {
    throw ApiError.forbidden('You can only delete your own items');
  }

  await Item.findByIdAndDelete(itemId);
  return item;
}

/**
 * Fetches all items owned by a specific user.
 * Input: userId (string)
 * Output: array of items
 */
async function getItemsByUser(userId) {
  return Item.find({ owner: userId })
    .populate('owner', 'name email avatar campus rating')
    .sort({ createdAt: -1 });
}

module.exports = { createItem, getItems, getItemById, updateItem, deleteItem, getItemsByUser };
