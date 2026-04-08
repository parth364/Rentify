const mongoose = require('mongoose');

/**
 * Conversation Schema — represents a chat thread linked to a rental.
 * Contains references to both participants and the associated rental.
 */
const conversationSchema = new mongoose.Schema(
  {
    rental: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rental',
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for quick lookups
conversationSchema.index({ participants: 1 });
conversationSchema.index({ rental: 1 });

module.exports = mongoose.model('Conversation', conversationSchema);
