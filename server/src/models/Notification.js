const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  actor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  type: {
    type: String,
    enum: [
      'order_created',
      'payment_succeeded',
      'payment_failed',
      'order_delivered',
      'order_completed',
      'order_cancelled',
      'revision_requested',
      'message_received',
      'review_received',
      'review_response',
      'system'
    ],
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
  },

  body: {
    type: String,
    required: true,
    trim: true,
    maxlength: 280
  },

  link: {
    type: String,
    trim: true,
    default: ''
  },

  entityType: {
    type: String,
    trim: true,
    default: ''
  },

  entityId: {
    type: mongoose.Schema.Types.ObjectId
  },

  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },

  readAt: {
    type: Date,
    default: null
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

notificationSchema.index({ recipient: 1, readAt: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ entityType: 1, entityId: 1 });

notificationSchema.virtual('isRead').get(function () {
  return Boolean(this.readAt);
});

module.exports = mongoose.model('Notification', notificationSchema);