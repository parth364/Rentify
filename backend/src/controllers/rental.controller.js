const rentalService = require('../services/rental.service');
const ApiResponse = require('../utils/apiResponse');

/**
 * Creates a new rental request.
 * Input: req.body { itemId, startDate, endDate, message }, req.user._id
 * Output: 201 with rental object
 */
async function createRental(req, res, next) {
  try {
    const rental = await rentalService.createRental(req.body, req.user._id.toString());
    ApiResponse.success(res, 201, 'Rental request created', { rental });
  } catch (error) {
    next(error);
  }
}

/**
 * Fetches all rentals made by the authenticated user.
 * Input: req.user._id
 * Output: 200 with rentals array
 */
async function getMyRentals(req, res, next) {
  try {
    const rentals = await rentalService.getMyRentals(req.user._id);
    ApiResponse.success(res, 200, 'Your rentals fetched', { rentals });
  } catch (error) {
    next(error);
  }
}

/**
 * Fetches all rental requests received by the authenticated user (as owner).
 * Input: req.user._id
 * Output: 200 with rentals array
 */
async function getReceivedRequests(req, res, next) {
  try {
    const rentals = await rentalService.getReceivedRequests(req.user._id);
    ApiResponse.success(res, 200, 'Received requests fetched', { rentals });
  } catch (error) {
    next(error);
  }
}

/**
 * Updates the status of a rental (approve, reject, cancel, complete).
 * Input: req.params.id (rentalId), req.body.status, req.user._id
 * Output: 200 with updated rental
 */
async function updateStatus(req, res, next) {
  try {
    const rental = await rentalService.updateRentalStatus(
      req.params.id,
      req.body.status,
      req.user._id.toString()
    );
    ApiResponse.success(res, 200, `Rental ${req.body.status}`, { rental });
  } catch (error) {
    next(error);
  }
}

/**
 * Fetches a single rental by ID.
 * Input: req.params.id, req.user._id
 * Output: 200 with rental object
 */
async function getRental(req, res, next) {
  try {
    const rental = await rentalService.getRentalById(req.params.id, req.user._id.toString());
    ApiResponse.success(res, 200, 'Rental fetched', { rental });
  } catch (error) {
    next(error);
  }
}

module.exports = { createRental, getMyRentals, getReceivedRequests, updateStatus, getRental };
