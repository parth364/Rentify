const { Router } = require('express');

const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const itemRoutes = require('./item.routes');
const rentalRoutes = require('./rental.routes');
const chatRoutes = require('./chat.routes');
const reviewRoutes = require('./review.routes');

/**
 * Mounts all route modules under /api prefix.
 * Each module handles its own sub-routing.
 */
const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/items', itemRoutes);
router.use('/rentals', rentalRoutes);
router.use('/chat', chatRoutes);
router.use('/reviews', reviewRoutes);

module.exports = router;
