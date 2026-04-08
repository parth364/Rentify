const { Router } = require('express');
const { z } = require('zod');
const userController = require('../controllers/user.controller');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = Router();

// Validation schema for profile updates
const updateProfileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  bio: z.string().max(300).optional(),
  campus: z.string().max(100).optional(),
  phone: z.string().max(20).optional(),
  avatar: z.string().url().optional(),
});

// GET /api/users/:id — Get a user's public profile
router.get('/:id', userController.getUser);

// PUT /api/users/profile — Update authenticated user's profile
router.put('/profile', authenticate, validate(updateProfileSchema), userController.updateProfile);

module.exports = router;
