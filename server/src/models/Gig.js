const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  title: {
    type: String,
    required: [true, 'Gig title is required'],
    trim: true,
    minlength: [10, 'Title must be at least 10 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },

  slug: {
    type: String,
    unique: true,
    lowercase: true
  },

  description: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [50, 'Description must be at least 50 characters'],
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },


  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },

  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],

  packages: {
    basic: {
      name: { type: String, default: 'Basic' },
      description: {
        type: String,
        required: [true, 'Basic package description is required'],
        maxlength: 500
      },
      price: {
        type: Number,
        required: [true, 'Basic package price is required'],
        min: [5, 'Minimum price is $5']
      },
      deliveryDays: {
        type: Number,
        required: [true, 'Delivery time is required'],
        min: [1, 'Minimum delivery is 1 day']
      },
      revisions: { type: Number, default: 1 },
      features: [String]
    },

    standard: {
      name: { type: String, default: 'Standard' },
      description: { type: String, maxlength: 500 },
      price: { type: Number, min: 5 },
      deliveryDays: { type: Number, min: 1 },
      revisions: { type: Number, default: 3 },
      features: [String],
      isActive: { type: Boolean, default: false }
    },

    premium: {
      name: { type: String, default: 'Premium' },
      description: { type: String, maxlength: 500 },
      price: { type: Number, min: 5 },
      deliveryDays: { type: Number, min: 1 },
      revisions: { type: Number, default: -1 },
      features: [String],
      isActive: { type: Boolean, default: false }
    }
  },

  images: [{
    url: { type: String, required: true },
    publicId: String,
    isPrimary: { type: Boolean, default: false }
  }],

  faqs: [{
    question: { type: String, maxlength: 200 },
    answer: { type: String, maxlength: 500 }
  }],

  requirements: [{
    question: { type: String, maxlength: 500 },
    required: { type: Boolean, default: true }
  }],

  stats: {
    impressions: { type: Number, default: 0 },
    clicks: { type: Number, default: 0 },
    orders: { type: Number, default: 0 },
    completedOrders: { type: Number, default: 0 },
    cancelledOrders: { type: Number, default: 0 }
  },

  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },

  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'deleted'],
    default: 'draft'
  }

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

gigSchema.index({ seller: 1 });
gigSchema.index({ category: 1 });
gigSchema.index({ subcategory: 1 });
gigSchema.index({ status: 1 });
gigSchema.index({ 'packages.basic.price': 1 });
gigSchema.index({ 'ratings.average': -1 });
gigSchema.index({ tags: 1 });
gigSchema.index({ createdAt: -1 });


gigSchema.index(
  { title: 'text', description: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, description: 1 } }
);

gigSchema.virtual('startingPrice').get(function () {
  return this.packages.basic.price;
});

gigSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'gig'
});

gigSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + this._id.toString().slice(-6);
  }

  if (this.tags && this.tags.length > 5) {
    this.tags = this.tags.slice(0, 5);
  }

  next();
});

module.exports = mongoose.model('Gig', gigSchema);