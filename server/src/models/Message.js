const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    minlength: [1, 'Message cannot be empty'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },

  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }]

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

messageSchema.index({ conversation: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ 'readBy.user': 1 });

module.exports = mongoose.model('Message', messageSchema);
