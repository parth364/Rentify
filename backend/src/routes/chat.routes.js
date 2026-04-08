const { Router } = require('express');
const { z } = require('zod');
const chatController = require('../controllers/chat.controller');
const authenticate = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = Router();

// Validation schema for sending messages
const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(2000),
});

// All chat routes require authentication
router.use(authenticate);

// GET /api/chat — Get all conversations for the user
router.get('/', chatController.getConversations);

// GET /api/chat/unread — Get unread message count
router.get('/unread', chatController.getUnreadCount);

// GET /api/chat/:conversationId — Get messages in a conversation
router.get('/:conversationId', chatController.getMessages);

// POST /api/chat/:conversationId — Send a message
router.post('/:conversationId', validate(sendMessageSchema), chatController.sendMessage);

module.exports = router;
