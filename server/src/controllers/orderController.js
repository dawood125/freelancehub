const Order = require('../models/Order');
const Gig = require('../models/Gig');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const populateOrder = (query) => {
  return query
    .populate('buyer', 'name username avatar email')
    .populate('seller', 'name username avatar email')
    .populate('gig', 'title slug images packages');
};

// ─── CREATE ORDER (now starts as pending_payment) ───
const createOrder = catchAsync(async (req, res, next) => {
  const { gigId, packageType } = req.body;
  const buyerId = req.user._id;

  if (!gigId || !packageType) {
    return next(new AppError('Please provide gigId and packageType', 400));
  }

  if (!['basic', 'standard', 'premium'].includes(packageType)) {
    return next(new AppError('Invalid package type. Must be basic, standard, or premium', 400));
  }

  const gig = await Gig.findById(gigId);
  if (!gig) {
    return next(new AppError('Gig not found', 404));
  }

  if (gig.status !== 'active') {
    return next(new AppError('This gig is not currently available', 400));
  }

  if (gig.seller.toString() === buyerId.toString()) {
    return next(new AppError('You cannot order your own gig', 400));
  }

  const selectedPackage = gig.packages[packageType];
  if (!selectedPackage) {
    return next(new AppError('Selected package not found', 400));
  }

  if (packageType !== 'basic' && !selectedPackage.isActive) {
    return next(new AppError('Selected package is not available', 400));
  }

  const subtotal = selectedPackage.price;
  const serviceFee = Math.round(subtotal * 0.10 * 100) / 100;
  const total = Math.round((subtotal + serviceFee) * 100) / 100;
  const sellerEarning = Math.round((subtotal - serviceFee) * 100) / 100;

  const expectedDeliveryAt = new Date();
  expectedDeliveryAt.setDate(expectedDeliveryAt.getDate() + selectedPackage.deliveryDays);

  const order = await Order.create({
    gig: gig._id,
    seller: gig.seller,
    buyer: buyerId,
    package: {
      type: packageType,
      name: selectedPackage.name || packageType,
      description: selectedPackage.description,
      price: selectedPackage.price,
      deliveryDays: selectedPackage.deliveryDays,
      revisions: selectedPackage.revisions,
      features: selectedPackage.features
    },
    pricing: { subtotal, serviceFee, total, sellerEarning },
    revisions: {
      allowed: selectedPackage.revisions,
      used: 0
    },
    timeline: {
      createdAt: new Date(),
      expectedDeliveryAt
    },
    // ★ Changed: starts as pending_payment (was pending_requirements)
    status: 'pending_payment'
  });

  // ★ Removed: gig.stats.orders increment (now happens after payment in webhook)

  const populatedOrder = await populateOrder(Order.findById(order._id));

  res.status(201).json({
    success: true,
    message: 'Order created! Please complete payment.',
    data: { order: populatedOrder }
  });
});

// ─── GET MY ORDERS ───
const getMyOrders = catchAsync(async (req, res) => {
  const userId = req.user._id;
  const { role, status, page = 1, limit = 10 } = req.query;
  const query = {};

  if (role === 'buyer') {
    query.buyer = userId;
  } else if (role === 'seller') {
    query.seller = userId;
  } else {
    query.$or = [{ buyer: userId }, { seller: userId }];
  }

  if (status) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [orders, total] = await Promise.all([
    populateOrder(
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
    ),
    Order.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: { orders }
  });
});

// ─── GET SINGLE ORDER ───
const getOrder = catchAsync(async (req, res, next) => {
  const order = await populateOrder(Order.findById(req.params.id));
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  const userId = req.user._id.toString();
  if (order.buyer._id.toString() !== userId && order.seller._id.toString() !== userId) {
    return next(new AppError('You do not have access to this order', 403));
  }

  res.status(200).json({
    success: true,
    data: { order }
  });
});

// ─── SUBMIT REQUIREMENTS ───
const submitRequirements = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));
  if (order.buyer.toString() !== req.user._id.toString()) {
    return next(new AppError('Only the buyer can submit requirements', 403));
  }
  if (order.status !== 'pending_requirements') {
    return next(new AppError('Requirements can only be submitted for paid orders awaiting requirements', 400));
  }

  order.requirements = req.body.requirements || [];
  order.requirementsSubmitted = true;
  order.status = 'in_progress';
  order.timeline.requirementsAt = new Date();
  order.timeline.startedAt = new Date();

  const expectedDeliveryAt = new Date();
  expectedDeliveryAt.setDate(expectedDeliveryAt.getDate() + order.package.deliveryDays);
  order.timeline.expectedDeliveryAt = expectedDeliveryAt;

  await order.save();
  const populatedOrder = await populateOrder(Order.findById(order._id));

  res.status(200).json({
    success: true,
    message: 'Requirements submitted! The seller will start working on your order.',
    data: { order: populatedOrder }
  });
});

// ─── DELIVER ORDER ───
const deliverOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));
  if (order.seller.toString() !== req.user._id.toString()) {
    return next(new AppError('Only the seller can deliver this order', 403));
  }
  if (!['in_progress', 'revision_requested'].includes(order.status)) {
    return next(new AppError(`Cannot deliver order with status: ${order.status}`, 400));
  }

  const { message } = req.body;
  if (!message) return next(new AppError('Please provide a delivery message', 400));

  order.deliveries.push({
    message,
    files: [],
    deliveredAt: new Date(),
    status: 'pending'
  });

  order.status = 'delivered';
  order.timeline.deliveredAt = new Date();

  const autoCompleteDate = new Date();
  autoCompleteDate.setDate(autoCompleteDate.getDate() + 3);
  order.autoCompleteAt = autoCompleteDate;

  await order.save();
  const populatedOrder = await populateOrder(Order.findById(order._id));

  res.status(200).json({
    success: true,
    message: 'Order delivered! Waiting for buyer to review.',
    data: { order: populatedOrder }
  });
});

// ─── REQUEST REVISION ───
const requestRevision = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));
  if (order.buyer.toString() !== req.user._id.toString()) {
    return next(new AppError('Only the buyer can request a revision', 403));
  }
  if (order.status !== 'delivered') {
    return next(new AppError('Can only request revision on delivered orders', 400));
  }
  if (order.revisions.allowed !== -1 && order.revisions.used >= order.revisions.allowed) {
    return next(new AppError('You have used all available revisions for this order', 400));
  }

  const { note } = req.body;
  if (!note) return next(new AppError('Please provide a revision note explaining what needs to change', 400));

  const latestDelivery = order.deliveries[order.deliveries.length - 1];
  if (latestDelivery) {
    latestDelivery.status = 'revision_requested';
    latestDelivery.revisionNote = note;
  }

  order.status = 'revision_requested';
  order.revisions.used += 1;
  order.autoCompleteAt = undefined;

  await order.save();
  const populatedOrder = await populateOrder(Order.findById(order._id));

  res.status(200).json({
    success: true,
    message: 'Revision requested. The seller will update the delivery.',
    data: { order: populatedOrder }
  });
});

// ─── ACCEPT DELIVERY ───
const acceptDelivery = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));
  if (order.buyer.toString() !== req.user._id.toString()) {
    return next(new AppError('Only the buyer can accept the delivery', 403));
  }
  if (order.status !== 'delivered') {
    return next(new AppError('Can only accept delivered orders', 400));
  }

  const latestDelivery = order.deliveries[order.deliveries.length - 1];
  if (latestDelivery) {
    latestDelivery.status = 'accepted';
  }

  order.status = 'completed';
  order.timeline.completedAt = new Date();
  order.autoCompleteAt = undefined;

  await order.save();

  await Gig.findByIdAndUpdate(order.gig, {
    $inc: { 'stats.completedOrders': 1 }
  });

  await User.findByIdAndUpdate(order.seller, {
    $inc: {
      'freelancerProfile.completedOrders': 1,
      'freelancerProfile.totalEarnings': order.pricing.sellerEarning
    }
  });

  const populatedOrder = await populateOrder(Order.findById(order._id));

  res.status(200).json({
    success: true,
    message: 'Order completed! Thank you for your business. 🎉',
    data: { order: populatedOrder }
  });
});

// ─── CANCEL ORDER ───
const cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));

  const userId = req.user._id.toString();
  if (order.buyer.toString() !== userId && order.seller.toString() !== userId) {
    return next(new AppError('You do not have access to this order', 403));
  }
  if (['completed', 'cancelled'].includes(order.status)) {
    return next(new AppError(`Cannot cancel an order that is ${order.status}`, 400));
  }

  const { reason } = req.body;
  if (!reason) return next(new AppError('Please provide a reason for cancellation', 400));

  order.status = 'cancelled';
  order.timeline.cancelledAt = new Date();
  order.autoCompleteAt = undefined;
  order.cancellation = {
    requestedBy: req.user._id,
    reason,
    status: 'approved',
    requestedAt: new Date(),
    resolvedAt: new Date()
  };

  await order.save();

  // ★ Only track cancellation stat if order was paid (not just pending_payment)
  if (order.payment?.status === 'succeeded') {
    await Gig.findByIdAndUpdate(order.gig, {
      $inc: { 'stats.cancelledOrders': 1 }
    });

    // TODO: Trigger Stripe refund here for paid orders
    // await stripe.refunds.create({ payment_intent: order.payment.stripePaymentIntentId });
  }

  const populatedOrder = await populateOrder(Order.findById(order._id));

  res.status(200).json({
    success: true,
    message: 'Order cancelled.',
    data: { order: populatedOrder }
  });
});

// ─── ORDER STATS ───
const getOrderStats = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const [buyerStats, sellerStats] = await Promise.all([
    Order.aggregate([
      { $match: { buyer: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalSpent: { $sum: '$pricing.total' }
        }
      }
    ]),
    Order.aggregate([
      { $match: { seller: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalEarned: { $sum: '$pricing.sellerEarning' }
        }
      }
    ])
  ]);

  const formatStats = (stats) => {
    const result = {
      total: 0,
      pending_payment: 0,
      pending_requirements: 0,
      in_progress: 0,
      delivered: 0,
      revision_requested: 0,
      completed: 0,
      cancelled: 0,
      totalAmount: 0
    };
    stats.forEach(s => {
      result[s._id] = s.count;
      result.total += s.count;
      result.totalAmount += s.totalSpent || s.totalEarned || 0;
    });
    return result;
  };

  res.status(200).json({
    success: true,
    data: {
      asBuyer: formatStats(buyerStats),
      asSeller: formatStats(sellerStats)
    }
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  submitRequirements,
  deliverOrder,
  requestRevision,
  acceptDelivery,
  cancelOrder,
  getOrderStats
};