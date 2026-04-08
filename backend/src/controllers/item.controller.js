const itemService = require('../services/item.service');
const ApiResponse = require('../utils/apiResponse');

/**
 * Creates a new item listing.
 * Input: req.body (item data), req.user._id (owner)
 * Output: 201 with created item
 */
async function createItem(req, res, next) {
  try {
    const item = await itemService.createItem(req.body, req.user._id);
    ApiResponse.success(res, 201, 'Item created', { item });
  } catch (error) {
    next(error);
  }
}

/**
 * Fetches a paginated list of items with optional filters.
 * Input: req.query { page, limit, search, category, condition, sort }
 * Output: 200 with items array and pagination metadata
 */
async function getItems(req, res, next) {
  try {
    const { items, pagination } = await itemService.getItems(req.query);
    ApiResponse.paginated(res, 200, 'Items fetched', items, pagination);
  } catch (error) {
    next(error);
  }
}

/**
 * Fetches a single item by ID.
 * Input: req.params.id (itemId)
 * Output: 200 with item object
 */
async function getItem(req, res, next) {
  try {
    const item = await itemService.getItemById(req.params.id);
    ApiResponse.success(res, 200, 'Item fetched', { item });
  } catch (error) {
    next(error);
  }
}

/**
 * Updates an existing item listing.
 * Input: req.params.id, req.body (update data), req.user._id
 * Output: 200 with updated item
 */
async function updateItem(req, res, next) {
  try {
    const item = await itemService.updateItem(req.params.id, req.body, req.user._id.toString());
    ApiResponse.success(res, 200, 'Item updated', { item });
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes an item listing.
 * Input: req.params.id, req.user._id
 * Output: 200 with success message
 */
async function deleteItem(req, res, next) {
  try {
    await itemService.deleteItem(req.params.id, req.user._id.toString());
    ApiResponse.success(res, 200, 'Item deleted');
  } catch (error) {
    next(error);
  }
}

/**
 * Fetches all items belonging to the authenticated user.
 * Input: req.user._id
 * Output: 200 with items array
 */
async function getMyItems(req, res, next) {
  try {
    const items = await itemService.getItemsByUser(req.user._id);
    ApiResponse.success(res, 200, 'Your items fetched', { items });
  } catch (error) {
    next(error);
  }
}

module.exports = { createItem, getItems, getItem, updateItem, deleteItem, getMyItems };
