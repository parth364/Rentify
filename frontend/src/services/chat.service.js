import api from './api';

/**
 * Chat service — handles conversations and messages.
 */
export const chatService = {
  getConversations: () => api.get('/chat'),
  getMessages: (conversationId) => api.get(`/chat/${conversationId}`),
  sendMessage: (conversationId, content) => api.post(`/chat/${conversationId}`, { content }),
  getUnreadCount: () => api.get('/chat/unread'),
};
