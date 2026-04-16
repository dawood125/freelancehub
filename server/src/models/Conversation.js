const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    unique: true
  },

  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],

  unreadCounts: {
    type: Map,
    of: Number,
    default: {}
  },

  totalMessages: {
    type: Number,
    default: 0
  },

  lastMessage: {
    text: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: Date
  },

  lastMessageAt: {
    type: Date,
    default: Date.now
  },

  status: {
    type: String,
    enum: ['active', 'archived'],
    default: 'active'
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

conversationSchema.index({ order: 1 }, { unique: true });
conversationSchema.index({ participants: 1, lastMessageAt: -1 });
conversationSchema.index({ lastMessageAt: -1 });

conversationSchema.pre('validate', function (next) {
  if (!Array.isArray(this.participants)) {
    return next();
  }

  const uniqueParticipants = [...new Set(this.participants.map((id) => id.toString()))];
  this.participants = uniqueParticipants;

  next();
});

module.exports = mongoose.model('Conversation', conversationSchema);
