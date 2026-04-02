const Review = require('../models/Review');
const Order = require('../models/Order');
const Gig = require('../models/Gig');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const recalculateGigRatings = async (gigId) => {
  const stats = await Review.aggregate([
    { $match: { gig: gigId, isPublic: true } },
    {
      $group: {
        _id: '$gig',
        averageRating: { $avg: '$rating.overall' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await Gig.findByIdAndUpdate(gigId, {
      'ratings.average': Math.round(stats[0].averageRating * 10) / 10,
      'ratings.count': stats[0].count
    });
  } else {
    await Gig.findByIdAndUpdate(gigId, {
      'ratings.average': 0,
      'ratings.count': 0
    });
  }
};

const recalculateSellerRatings = async (sellerId) => {
  const stats = await Review.aggregate([
    { $match: { seller: sellerId, isPublic: true } },
    {
      $group: {
        _id: '$seller',
        averageRating: { $avg: '$rating.overall' },
        count: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await User.findByIdAndUpdate(sellerId, {
      'freelancerProfile.averageRating': Math.round(stats[0].averageRating * 10) / 10,
      'freelancerProfile.totalReviews': stats[0].count
    });
  }
};


const createReview = catchAsync(async (req, res, next) => {
  const { orderId, rating, comment } = req.body;
  const reviewerId = req.user._id;

  if (!orderId || !rating?.overall || !comment) {
    return next(new AppError('Please provide orderId, rating (overall), and comment', 400));
  }

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.buyer.toString() !== reviewerId.toString()) {
    return next(new AppError('Only the buyer can leave a review', 403));
  }

  if (order.status !== 'completed') {
    return next(new AppError('You can only review completed orders', 400));
  }

  const existingReview = await Review.findOne({ order: orderId });
  if (existingReview) {
    return next(new AppError('You have already reviewed this order', 400));
  }

  const ratingFields = ['overall', 'communication', 'serviceAsDescribed', 'recommendation'];
  for (const field of ratingFields) {
    if (rating[field] !== undefined) {
      const val = Number(rating[field]);
      if (isNaN(val) || val < 1 || val > 5) {
        return next(new AppError(`${field} rating must be between 1 and 5`, 400));
      }
    }
  }

  const review = await Review.create({
    order: order._id,
    gig: order.gig,
    reviewer: reviewerId,
    seller: order.seller,
    rating: {
      overall: rating.overall,
      communication: rating.communication || rating.overall,
      serviceAsDescribed: rating.serviceAsDescribed || rating.overall,
      recommendation: rating.recommendation || rating.overall
    },
    comment: comment.trim()
  });

  await recalculateGigRatings(order.gig);
  await recalculateSellerRatings(order.seller);

  const populatedReview = await Review.findById(review._id)
    .populate('reviewer', 'name username avatar')
    .populate('gig', 'title slug');

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully!',
    data: { review: populatedReview }
  });
});

const getGigReviews = catchAsync(async (req, res) => {
  const { gigId } = req.params;
  const { page = 1, limit = 10, sort = 'newest' } = req.query;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  let sortOption = { createdAt: -1 }; // newest
  if (sort === 'oldest') sortOption = { createdAt: 1 };
  if (sort === 'highest') sortOption = { 'rating.overall': -1, createdAt: -1 };
  if (sort === 'lowest') sortOption = { 'rating.overall': 1, createdAt: -1 };

  const [reviews, total, ratingBreakdown] = await Promise.all([
    Review.find({ gig: gigId, isPublic: true })
      .populate('reviewer', 'name username avatar location')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit)),

    Review.countDocuments({ gig: gigId, isPublic: true }),

    Review.aggregate([
      { $match: { gig: new (require('mongoose').Types.ObjectId)(gigId), isPublic: true } },
      {
        $group: {
          _id: '$rating.overall',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ])
  ]);

  // Build breakdown object
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  ratingBreakdown.forEach(r => {
    breakdown[r._id] = r.count;
  });

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: {
      reviews,
      breakdown
    }
  });
});


const getOrderReview = catchAsync(async (req, res) => {
  const review = await Review.findOne({ order: req.params.orderId })
    .populate('reviewer', 'name username avatar')
    .populate('seller', 'name username avatar');

  res.status(200).json({
    success: true,
    data: { review } 
  });
});


const respondToReview = catchAsync(async (req, res, next) => {
  const { content } = req.body;

  if (!content || !content.trim()) {
    return next(new AppError('Please provide a response', 400));
  }

  const review = await Review.findById(req.params.reviewId);
  if (!review) {
    return next(new AppError('Review not found', 404));
  }


  if (review.seller.toString() !== req.user._id.toString()) {
    return next(new AppError('Only the seller can respond to this review', 403));
  }

  if (review.response?.content) {
    return next(new AppError('You have already responded to this review', 400));
  }

  review.response = {
    content: content.trim(),
    respondedAt: new Date()
  };
  await review.save();

  const populatedReview = await Review.findById(review._id)
    .populate('reviewer', 'name username avatar')
    .populate('seller', 'name username avatar');

  res.status(200).json({
    success: true,
    message: 'Response submitted!',
    data: { review: populatedReview }
  });
});


const getSellerReviews = catchAsync(async (req, res) => {
  const { sellerId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [reviews, total] = await Promise.all([
    Review.find({ seller: sellerId, isPublic: true })
      .populate('reviewer', 'name username avatar location')
      .populate('gig', 'title slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Review.countDocuments({ seller: sellerId, isPublic: true })
  ]);

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: { reviews }
  });
});

module.exports = {
  createReview,
  getGigReviews,
  getOrderReview,
  respondToReview,
  getSellerReviews
};