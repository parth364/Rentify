const chatService = require('../services/chat.service');
const ApiResponse = require('../utils/apiResponse');

/**
 * Fetches all conversations for the authenticated user.
 * Input: req.user._id
 * Output: 200 with conversations array
 */
async function getConversations(req, res, next) {
  try {
    const conversations = await chatService.getConversations(req.user._id);
    ApiResponse.success(res, 200, 'Conversations fetched', { conversations });
  } catch (error) {
    next(error);
  }
}

/**
 * Fetches all messages in a conversation.
 * Input: req.params.conversationId, req.user._id
 * Output: 200 with messages array
 */
async function getMessages(req, res, next) {
  try {
    const messages = await chatService.getMessages(req.params.conversationId, req.user._id.toString());
    ApiResponse.success(res, 200, 'Messages fetched', { messages });
  } catch (error) {
    next(error);
  }
}

/**
 * Sends a message in a conversation.
 * Input: req.params.conversationId, req.user._id, req.body.content
 * Output: 201 with message object
 */
async function sendMessage(req, res, next) {
  try {
    const message = await chatService.sendMessage(
      req.params.conversationId,
      req.user._id.toString(),
      req.body.content
    );
    ApiResponse.success(res, 201, 'Message sent', { message });
  } catch (error) {
    next(error);
  }
}

/**
 * Gets unread message count for the authenticated user.
 * Input: req.user._id
 * Output: 200 with unread count
 */
async function getUnreadCount(req, res, next) {
  try {
    const count = await chatService.getUnreadCount(req.user._id);
    ApiResponse.success(res, 200, 'Unread count fetched', { count });
  } catch (error) {
    next(error);
  }
}

module.exports = { getConversations, getMessages, sendMessage, getUnreadCount };
