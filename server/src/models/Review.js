const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({

  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Review must belong to an order'],
    unique: true // one review per order
  },

  gig: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: [true, 'Review must belong to a gig']
  },

  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must have a reviewer']
  },

  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must reference a seller']
  },

  // ─── RATINGS ───
  rating: {
    overall: {
      type: Number,
      required: [true, 'Overall rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    communication: {
      type: Number,
      min: 1,
      max: 5
    },
    serviceAsDescribed: {
      type: Number,
      min: 1,
      max: 5
    },
    recommendation: {
      type: Number,
      min: 1,
      max: 5
    }
  },

  // ─── COMMENT ───
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    trim: true,
    minlength: [10, 'Review must be at least 10 characters'],
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },

  // ─── SELLER RESPONSE ───
  response: {
    content: {
      type: String,
      trim: true,
      maxlength: [500, 'Response cannot exceed 500 characters']
    },
    respondedAt: Date
  },

  isPublic: {
    type: Boolean,
    default: true
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ─── INDEXES ───
reviewSchema.index({ order: 1 }, { unique: true });
reviewSchema.index({ gig: 1, createdAt: -1 });
reviewSchema.index({ seller: 1 });
reviewSchema.index({ reviewer: 1 });

module.exports = mongoose.model('Review', reviewSchema);