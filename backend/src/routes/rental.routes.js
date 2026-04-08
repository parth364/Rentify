const { Router } = require('express');
const { z } = require('zod');
const rentalController = require('../controllers/rental.controller');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = Router();

// Validation schemas
const createRentalSchema = z.object({
  itemId: z.string().min(1, 'Item ID is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  message: z.string().max(500).optional().default(''),
});

const updateStatusSchema = z.object({
  status: z.enum(['approved', 'rejected', 'active', 'completed', 'cancelled'], {
    message: 'Invalid status',
  }),
});

// All rental routes require authentication
router.use(authenticate);

// POST /api/rentals — Create a rental request
router.post('/', validate(createRentalSchema), rentalController.createRental);

// GET /api/rentals/mine — Get rentals where user is the renter
router.get('/mine', rentalController.getMyRentals);

// GET /api/rentals/received — Get rental requests received as owner
router.get('/received', rentalController.getReceivedRequests);

// GET /api/rentals/:id — Get a single rental
router.get('/:id', rentalController.getRental);

// PATCH /api/rentals/:id/status — Update rental status
router.patch('/:id/status', validate(updateStatusSchema), rentalController.updateStatus);

module.exports = router;
