const { Rental, Item, Conversation } = require('../models');
const ApiError = require('../utils/apiError');

/**
 * Creates a new rental request.
 * Validates that the renter is not the owner and the item is available.
 * Also creates an associated conversation for the rental.
 * Input: { itemId, startDate, endDate, message }, renterId (string)
 * Output: populated rental object
 */
async function createRental({ itemId, startDate, endDate, message }, renterId) {
  const item = await Item.findById(itemId);
  if (!item) {
    throw ApiError.notFound('Item not found');
  }
  if (!item.isAvailable) {
    throw ApiError.badRequest('Item is not available for rent');
  }
  if (item.owner.toString() === renterId) {
    throw ApiError.badRequest('You cannot rent your own item');
  }

  // Calculate total price based on number of days
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (end <= start) {
    throw ApiError.badRequest('End date must be after start date');
  }
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const totalPrice = days * item.pricePerDay;

  const rental = await Rental.create({
    item: itemId,
    renter: renterId,
    owner: item.owner,
    startDate: start,
    endDate: end,
    totalPrice,
    message: message || '',
  });

  // Create a conversation linked to this rental
  await Conversation.create({
    rental: rental._id,
    participants: [renterId, item.owner.toString()],
  });

  return rental.populate([
    { path: 'item', select: 'title images pricePerDay' },
    { path: 'renter', select: 'name email avatar' },
    { path: 'owner', select: 'name email avatar' },
  ]);
}

/**
 * Fetches all rentals where the user is the renter.
 * Input: userId (string)
 * Output: array of populated rental objects
 */
async function getMyRentals(userId) {
  return Rental.find({ renter: userId })
    .populate('item', 'title images pricePerDay category')
    .populate('owner', 'name email avatar')
    .sort({ createdAt: -1 });
}

/**
 * Fetches all rental requests received by the item owner.
 * Input: userId (string)
 * Output: array of populated rental objects
 */
async function getReceivedRequests(userId) {
  return Rental.find({ owner: userId })
    .populate('item', 'title images pricePerDay category')
    .populate('renter', 'name email avatar')
    .sort({ createdAt: -1 });
}

/**
 * Updates the status of a rental request.
 * Only the owner can approve/reject; either party can cancel.
 * Input: rentalId (string), status (string), userId (string)
 * Output: updated rental object
 */
async function updateRentalStatus(rentalId, status, userId) {
  const rental = await Rental.findById(rentalId);
  if (!rental) {
    throw ApiError.notFound('Rental not found');
  }

  const isOwner = rental.owner.toString() === userId;
  const isRenter = rental.renter.toString() === userId;

  if (!isOwner && !isRenter) {
    throw ApiError.forbidden('You are not part of this rental');
  }

  // Only owner can approve or reject
  if (['approved', 'rejected'].includes(status) && !isOwner) {
    throw ApiError.forbidden('Only the item owner can approve or reject');
  }

  // Only allow cancellation by either party
  if (status === 'cancelled' && !isOwner && !isRenter) {
    throw ApiError.forbidden('You cannot cancel this rental');
  }

  // Validate status transitions
  const validTransitions = {
    pending: ['approved', 'rejected', 'cancelled'],
    approved: ['active', 'cancelled'],
    active: ['completed', 'cancelled'],
  };

  if (!validTransitions[rental.status]?.includes(status)) {
    throw ApiError.badRequest(`Cannot change status from '${rental.status}' to '${status}'`);
  }

  rental.status = status;
  await rental.save();

  return rental.populate([
    { path: 'item', select: 'title images pricePerDay' },
    { path: 'renter', select: 'name email avatar' },
    { path: 'owner', select: 'name email avatar' },
  ]);
}

/**
 * Fetches a single rental by ID with full details.
 * Input: rentalId (string), userId (string)
 * Output: populated rental object
 */
async function getRentalById(rentalId, userId) {
  const rental = await Rental.findById(rentalId)
    .populate('item', 'title images pricePerDay category description')
    .populate('renter', 'name email avatar campus')
    .populate('owner', 'name email avatar campus');

  if (!rental) {
    throw ApiError.notFound('Rental not found');
  }

  const isOwner = rental.owner._id.toString() === userId;
  const isRenter = rental.renter._id.toString() === userId;

  if (!isOwner && !isRenter) {
    throw ApiError.forbidden('You are not part of this rental');
  }

  return rental;
}

module.exports = {
  createRental,
  getMyRentals,
  getReceivedRequests,
  updateRentalStatus,
  getRentalById,
};
