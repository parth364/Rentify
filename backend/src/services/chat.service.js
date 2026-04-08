const { Conversation, Message } = require('../models');
const ApiError = require('../utils/apiError');

/**
 * Fetches all conversations for a given user, sorted by last message time.
 * Input: userId (string)
 * Output: array of populated conversation objects
 */
async function getConversations(userId) {
  return Conversation.find({ participants: userId })
    .populate('participants', 'name email avatar')
    .populate('rental', 'status')
    .sort({ lastMessageAt: -1 });
}

/**
 * Fetches all messages in a conversation.
 * Verifies the user is a participant before returning messages.
 * Also marks unread messages from the other party as read.
 * Input: conversationId (string), userId (string)
 * Output: array of message objects
 */
async function getMessages(conversationId, userId) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw ApiError.notFound('Conversation not found');
  }

  const isParticipant = conversation.participants.some((p) => p.toString() === userId);
  if (!isParticipant) {
    throw ApiError.forbidden('You are not part of this conversation');
  }

  // Mark unread messages from other users as read
  await Message.updateMany(
    { conversation: conversationId, sender: { $ne: userId }, isRead: false },
    { isRead: true }
  );

  return Message.find({ conversation: conversationId })
    .populate('sender', 'name avatar')
    .sort({ createdAt: 1 });
}

/**
 * Sends a new message in a conversation.
 * Validates that the sender is a participant.
 * Updates the conversation's lastMessage and lastMessageAt fields.
 * Input: conversationId (string), senderId (string), content (string)
 * Output: populated message object
 */
async function sendMessage(conversationId, senderId, content) {
  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    throw ApiError.notFound('Conversation not found');
  }

  const isParticipant = conversation.participants.some((p) => p.toString() === senderId);
  if (!isParticipant) {
    throw ApiError.forbidden('You are not part of this conversation');
  }

  const message = await Message.create({
    conversation: conversationId,
    sender: senderId,
    content,
  });

  // Update conversation with latest message info
  conversation.lastMessage = content.substring(0, 100);
  conversation.lastMessageAt = new Date();
  await conversation.save();

  return message.populate('sender', 'name avatar');
}

/**
 * Gets the count of unread messages for a user across all conversations.
 * Input: userId (string)
 * Output: number of unread messages
 */
async function getUnreadCount(userId) {
  const conversations = await Conversation.find({ participants: userId });
  const conversationIds = conversations.map((c) => c._id);

  const count = await Message.countDocuments({
    conversation: { $in: conversationIds },
    sender: { $ne: userId },
    isRead: false,
  });

  return count;
}

module.exports = { getConversations, getMessages, sendMessage, getUnreadCount };
