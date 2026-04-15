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

const normalizeIdempotencyKey = (value) => {
  if (!value) return '';
  return String(value).trim().replace(/\s+/g, '').slice(0, 120);
};

// ─── CREATE PAYMENT INTENT ───
// Creates an order + Stripe PaymentIntent in one call
// POST /api/payments/create-intent
const createPaymentIntent = catchAsync(async (req, res, next) => {
  const { gigId, packageType } = req.body;
  const buyerId = req.user._id;
  const idempotencyKey = normalizeIdempotencyKey(req.headers['x-idempotency-key']);

  if (!idempotencyKey) {
    return next(new AppError('Missing x-idempotency-key header for checkout request', 400));
  }

  const existingOrder = await Order.findOne({
    buyer: buyerId,
    'payment.idempotencyKey': idempotencyKey
  });

  if (existingOrder) {
    if (!existingOrder.payment?.stripePaymentIntentId) {
      return next(new AppError('An existing checkout attempt is incomplete. Please refresh and try again.', 409));
    }

    const existingIntent = await stripe.paymentIntents.retrieve(existingOrder.payment.stripePaymentIntentId);
    const populatedExistingOrder = await populateOrder(Order.findById(existingOrder._id));

    return res.status(200).json({
      success: true,
      message: existingOrder.payment?.status === 'succeeded'
        ? 'Payment is already completed for this checkout attempt.'
        : 'Reusing existing payment intent for this checkout attempt.',
      data: {
        order: populatedExistingOrder,
        clientSecret: existingIntent.client_secret,
        reused: true,
        alreadyPaid: existingOrder.payment?.status === 'succeeded'
      }
    });
  }

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
  let order;
  try {
    order = await Order.create({
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
      payment: {
        status: 'pending',
        idempotencyKey
      }
    });
  } catch (err) {
    if (err?.code === 11000 && err?.keyPattern?.['payment.idempotencyKey']) {
      const concurrentOrder = await Order.findOne({
        buyer: buyerId,
        'payment.idempotencyKey': idempotencyKey
      });

      if (concurrentOrder?.payment?.stripePaymentIntentId) {
        const concurrentIntent = await stripe.paymentIntents.retrieve(concurrentOrder.payment.stripePaymentIntentId);
        const populatedConcurrentOrder = await populateOrder(Order.findById(concurrentOrder._id));

        return res.status(200).json({
          success: true,
          message: 'Reusing existing payment intent for this checkout attempt.',
          data: {
            order: populatedConcurrentOrder,
            clientSecret: concurrentIntent.client_secret,
            reused: true
          }
        });
      }

      return next(new AppError('Checkout is already being processed. Please try again in a moment.', 409));
    }

    throw err;
  }

  // ── Create Stripe PaymentIntent ──
  const amountInCents = Math.round(total * 100);

  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.create({
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
      description: `FreelanceHub Order ${order.orderNumber} - ${gig.title} (${packageType})`
    }, {
      idempotencyKey: `fh_checkout_${idempotencyKey}`.slice(0, 255)
    });

    // ── Save PaymentIntent ID on order ──
    order.payment.stripePaymentIntentId = paymentIntent.id;
    await order.save();
  } catch (err) {
    order.payment.status = 'failed';
    await order.save();
    throw err;
  }

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
      paidAt: order.payment?.paidAt,
      refundedAt: order.payment?.refundedAt,
      refundId: order.payment?.refundId
    }
  });
});

// ─── STRIPE WEBHOOK ───
// POST /api/payments/webhook (called by Stripe, no auth middleware)
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('❌ STRIPE_WEBHOOK_SECRET is not configured');
    return res.status(500).json({ error: 'Webhook is not configured' });
  }

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
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      console.warn('⚠️ payment_intent.succeeded without orderId metadata');
      return res.json({ received: true });
    }

    try {
      const paidAt = new Date();

      // Transition happens only once from pending_payment -> pending_requirements.
      // This keeps webhook handling idempotent under retries.
      const transitionedOrder = await Order.findOneAndUpdate(
        {
          _id: orderId,
          status: 'pending_payment',
          'payment.stripePaymentIntentId': paymentIntent.id
        },
        {
          $set: {
            status: 'pending_requirements',
            'payment.status': 'succeeded',
            'payment.paidAt': paidAt,
            'timeline.paidAt': paidAt
          }
        },
        { new: true }
      );

      if (transitionedOrder) {
        await Gig.findByIdAndUpdate(transitionedOrder.gig, {
          $inc: { 'stats.orders': 1 }
        });

        console.log(`✅ Order ${transitionedOrder.orderNumber} payment confirmed`);
      } else {
        const syncResult = await Order.updateOne(
          {
            _id: orderId,
            'payment.stripePaymentIntentId': paymentIntent.id,
            'payment.status': { $ne: 'succeeded' }
          },
          {
            $set: {
              'payment.status': 'succeeded',
              'payment.paidAt': paidAt,
              'timeline.paidAt': paidAt
            }
          }
        );

        if (syncResult.modifiedCount > 0) {
          console.log(`ℹ️ Payment synced without status transition for order ${orderId}`);
        } else {
          console.log(`ℹ️ Ignored duplicate or mismatched succeeded event for order ${orderId}`);
        }
      }
    } catch (err) {
      console.error('❌ Error processing payment_intent.succeeded:', err);
    }
  }

  // ── Handle payment_intent.payment_failed ──
  if (event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object;
    const orderId = paymentIntent.metadata?.orderId;

    if (!orderId) {
      console.warn('⚠️ payment_intent.payment_failed without orderId metadata');
      return res.json({ received: true });
    }

    try {
      const failedResult = await Order.updateOne(
        {
          _id: orderId,
          status: 'pending_payment',
          'payment.stripePaymentIntentId': paymentIntent.id,
          'payment.status': { $ne: 'succeeded' }
        },
        {
          $set: {
            'payment.status': 'failed'
          }
        }
      );

      if (failedResult.modifiedCount > 0) {
        console.log(`❌ Order ${orderId} payment failed`);
      } else {
        console.log(`ℹ️ Ignored payment_failed event for order ${orderId} due to status mismatch`);
      }
    } catch (err) {
      console.error('❌ Error processing payment_intent.payment_failed:', err);
    }
  }

  // ── Handle charge.refunded ──
  if (event.type === 'charge.refunded') {
    const charge = event.data.object;
    const paymentIntentId = charge.payment_intent;

    if (!paymentIntentId) {
      console.warn('⚠️ charge.refunded without payment_intent reference');
      return res.json({ received: true });
    }

    try {
      const refundedAt = new Date();
      const refundAmount = typeof charge.amount_refunded === 'number'
        ? Math.round((charge.amount_refunded / 100) * 100) / 100
        : undefined;

      const syncRefundResult = await Order.updateOne(
        {
          'payment.stripePaymentIntentId': paymentIntentId,
          'payment.status': { $ne: 'refunded' }
        },
        {
          $set: {
            'payment.status': 'refunded',
            'payment.refundedAt': refundedAt,
            'payment.refundAmount': refundAmount
          }
        }
      );

      if (syncRefundResult.modifiedCount > 0) {
        console.log(`↩️ Payment ${paymentIntentId} marked as refunded`);
      } else {
        console.log(`ℹ️ Ignored duplicate or unmatched refund event for payment intent ${paymentIntentId}`);
      }
    } catch (err) {
      console.error('❌ Error processing charge.refunded:', err);
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