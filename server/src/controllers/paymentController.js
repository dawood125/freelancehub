const stripe = require('../config/stripe');
const Order = require('../models/Order');
const Gig = require('../models/Gig');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const populateOrder = (query) => {
  return query
    .populate('buyer', 'name username avatar email')
    .populate('seller', 'name username avatar email')
    .populate('gig', 'title slug images packages');
};

// ─── CREATE PAYMENT INTENT ───
// Creates an order + Stripe PaymentIntent in one call
// POST /api/payments/create-intent
const createPaymentIntent = catchAsync(async (req, res, next) => {
  const { gigId, packageType } = req.body;
  const buyerId = req.user._id;

  // ── Validation ──
  if (!gigId || !packageType) {
    return next(new AppError('Please provide gigId and packageType', 400));
  }

  if (!['basic', 'standard', 'premium'].includes(packageType)) {
    return next(new AppError('Invalid package type', 400));
  }

  const gig = await Gig.findById(gigId);
  if (!gig) return next(new AppError('Gig not found', 404));
  if (gig.status !== 'active') return next(new AppError('This gig is not currently available', 400));
  if (gig.seller.toString() === buyerId.toString()) {
    return next(new AppError('You cannot order your own gig', 400));
  }

  const selectedPackage = gig.packages[packageType];
  if (!selectedPackage) return next(new AppError('Selected package not found', 400));
  if (packageType !== 'basic' && !selectedPackage.isActive) {
    return next(new AppError('Selected package is not available', 400));
  }

  // ── Calculate pricing ──
  const subtotal = selectedPackage.price;
  const serviceFee = Math.round(subtotal * 0.10 * 100) / 100;
  const total = Math.round((subtotal + serviceFee) * 100) / 100;
  const sellerEarning = Math.round((subtotal - serviceFee) * 100) / 100;

  const expectedDeliveryAt = new Date();
  expectedDeliveryAt.setDate(expectedDeliveryAt.getDate() + selectedPackage.deliveryDays);

  // ── Create order with pending_payment status ──
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
    revisions: { allowed: selectedPackage.revisions, used: 0 },
    timeline: { createdAt: new Date(), expectedDeliveryAt },
    status: 'pending_payment',
    payment: { status: 'pending' }
  });

  // ── Create Stripe PaymentIntent ──
  const amountInCents = Math.round(total * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    metadata: {
      orderId: order._id.toString(),
      orderNumber: order.orderNumber,
      gigId: gigId.toString(),
      buyerId: buyerId.toString(),
      sellerId: gig.seller.toString(),
      packageType
    },
    description: `FreelanceHub Order ${order.orderNumber} — ${gig.title} (${packageType})`
  });

  // ── Save PaymentIntent ID on order ──
  order.payment.stripePaymentIntentId = paymentIntent.id;
  await order.save();

  // ── Return order + clientSecret ──
  const populatedOrder = await populateOrder(Order.findById(order._id));

  res.status(201).json({
    success: true,
    message: 'Payment intent created. Complete payment to confirm order.',
    data: {
      order: populatedOrder,
      clientSecret: paymentIntent.client_secret
    }
  });
});

// ─── GET PAYMENT STATUS ───
// GET /api/payments/:orderId/status
const getPaymentStatus = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) return next(new AppError('Order not found', 404));

  const userId = req.user._id.toString();
  if (order.buyer.toString() !== userId && order.seller.toString() !== userId) {
    return next(new AppError('Access denied', 403));
  }

  res.status(200).json({
    success: true,
    data: {
      orderId: order._id,
      orderNumber: order.orderNumber,
      orderStatus: order.status,
      paymentStatus: order.payment?.status || 'pending',
      paidAt: order.payment?.paidAt
    }
  });
});

// ─── STRIPE WEBHOOK ───
// POST /api/payments/webhook (called by Stripe, no auth middleware)
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  console.log(`📩 Stripe webhook received: ${event.type}`);

  // ── Handle payment_intent.succeeded ──
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    try {
      const order = await Order.findById(orderId);

      if (order && order.status === 'pending_payment') {
        order.status = 'pending_requirements';
        order.payment.status = 'succeeded';
        order.payment.paidAt = new Date();
        order.timeline.paidAt = new Date();
        await order.save();

        // Increment gig order count (was previously in createOrder)
        await Gig.findByIdAndUpdate(order.gig, {
          $inc: { 'stats.orders': 1 }
        });

        console.log(`✅ Order ${order.orderNumber} payment confirmed`);
      }
    } catch (err) {
      console.error('❌ Error processing payment_intent.succeeded:', err);
    }
  }

  // ── Handle payment_intent.payment_failed ──
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata.orderId;

    try {
      const order = await Order.findById(orderId);
      if (order) {
        order.payment.status = 'failed';
        await order.save();
        console.log(`❌ Order ${order.orderNumber} payment failed`);
      }
    } catch (err) {
      console.error('❌ Error processing payment_intent.payment_failed:', err);
    }
  }

  // Acknowledge receipt to Stripe
  res.json({ received: true });
};

module.exports = {
  createPaymentIntent,
  getPaymentStatus,
  handleWebhook
};