const { Router } = require('express');
const { z } = require('zod');
const authController = require('../controllers/auth.controller');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { authLimiter } = require('../middlewares/rateLimiter');

const router = Router();

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  campus: z.string().optional().default(''),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// POST /api/auth/register — Register a new user
router.post('/register', authLimiter, validate(registerSchema), authController.register);

// POST /api/auth/login — Login with email and password
router.post('/login', authLimiter, validate(loginSchema), authController.login);

// GET /api/auth/me — Get authenticated user's profile
router.get('/me', authenticate, authController.getMe);

module.exports = router;
