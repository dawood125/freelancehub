const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  orderNumber: {
    type: String,
    unique: true
  },

  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: [true, 'Order must belong to a gig']
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Order must have a seller']
  },

  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Order must have a buyer']
  },

  package: {
    type: {
      type: String,
      enum: ['basic', 'standard', 'premium'],
      required: true
    },
    name: String,
    description: String,
    price: {
      type: Number,
      required: true
    },
    deliveryDays: {
      type: Number,
      required: true
    },
    revisions: Number,
    features: [String]
  },

  pricing: {
    subtotal: { type: Number, required: true },
    serviceFee: { type: Number, required: true },
    total: { type: Number, required: true },
    sellerEarning: { type: Number, required: true }
  },

 
  payment: {
    idempotencyKey: {
      type: String,
      trim: true
    },
    stripePaymentIntentId: String,
    method: { type: String, default: 'card' },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date,
    refundId: String,
    refundedAt: Date,
    refundAmount: Number
  },

  requirements: [{
    question: String,
    answer: String
  }],

  requirementsSubmitted: {
    type: Boolean,
    default: false
  },

  
  status: {
    type: String,
    enum: [
      'pending_payment',
      'pending_requirements',
      'in_progress',
      'delivered',
      'revision_requested',
      'completed',
      'cancelled'
    ],
    default: 'pending_payment'
  },

  timeline: {
    createdAt: { type: Date, default: Date.now },
    paidAt: Date,
    requirementsAt: Date,
    startedAt: Date,
    expectedDeliveryAt: Date,
    deliveredAt: Date,
    completedAt: Date,
    cancelledAt: Date
  },

  deliveries: [{
    message: {
      type: String,
      required: true
    },
    files: [{
      url: String,
      publicId: String,
      filename: String
    }],
    deliveredAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'revision_requested'],
      default: 'pending'
    },
    revisionNote: String
  }],

  revisions: {
    allowed: Number,
    used: {
      type: Number,
      default: 0
    }
  },

  cancellation: {
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected']
    },
    requestedAt: Date,
    resolvedAt: Date
  },

  autoCompleteAt: Date,
  buyerNote: String,
  sellerNote: String

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


orderSchema.index({ orderNumber: 1 });
orderSchema.index({ seller: 1, status: 1 });
orderSchema.index({ buyer: 1, status: 1 });
orderSchema.index({ gig: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'payment.stripePaymentIntentId': 1 });
orderSchema.index({ 'payment.idempotencyKey': 1 }, { unique: true, sparse: true });

orderSchema.virtual('isLate').get(function () {
  if (this.status === 'completed' || this.status === 'cancelled') {
    return false;
  }
  return this.timeline.expectedDeliveryAt && new Date() > this.timeline.expectedDeliveryAt;
});

orderSchema.virtual('daysRemaining').get(function () {
  if (!this.timeline.expectedDeliveryAt) return null;
  const now = new Date();
  const deadline = this.timeline.expectedDeliveryAt;
  const diff = deadline - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

orderSchema.pre('save', async function (next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const dateStr = date.getFullYear().toString().slice(-2) +
      String(date.getMonth() + 1).padStart(2, '0') +
      String(date.getDate()).padStart(2, '0');

    const count = await mongoose.model('Order').countDocuments();
    const orderNum = String(count + 1).padStart(6, '0');
    this.orderNumber = `FH-${dateStr}-${orderNum}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);