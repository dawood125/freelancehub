const AppError = require('../src/utils/AppError');

jest.mock('../src/config/stripe', () => ({
  paymentIntents: {
    retrieve: jest.fn(),
    create: jest.fn()
  },
  webhooks: {
    constructEvent: jest.fn()
  }
}));

jest.mock('../src/models/Order', () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findOneAndUpdate: jest.fn(),
  updateOne: jest.fn()
}));

jest.mock('../src/models/Gig', () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn()
}));

const stripe = require('../src/config/stripe');
const Order = require('../src/models/Order');
const Gig = require('../src/models/Gig');
const {
  createPaymentIntent,
  handleWebhook
} = require('../src/controllers/paymentController');

const makePopulatedQuery = (value) => {
  const query = {
    populate: jest.fn()
  };

  query.populate.mockReturnValue(query);
  query.then = (resolve, reject) => Promise.resolve(value).then(resolve, reject);

  return query;
};

const runHandler = (handler, req) => {
  return new Promise((resolve) => {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((payload) => resolve({ type: 'json', payload, res }))
    };

    const next = jest.fn((err) => resolve({ type: 'next', err, res, next }));

    try {
      handler(req, res, next);
    } catch (err) {
      resolve({ type: 'next', err, res, next });
    }
  });
};

describe('paymentController hardening', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_secret';
  });

  test('createPaymentIntent rejects missing idempotency key', async () => {
    const result = await runHandler(createPaymentIntent, {
      body: { gigId: 'gig_1', packageType: 'basic' },
      headers: {},
      user: { _id: 'buyer_1' }
    });

    expect(result.type).toBe('next');
    expect(result.err).toBeInstanceOf(AppError);
    expect(result.err.statusCode).toBe(400);
    expect(result.err.message).toMatch(/x-idempotency-key/i);
  });

  test('createPaymentIntent reuses existing intent for same idempotency key', async () => {
    const existingOrder = {
      _id: 'order_1',
      buyer: 'buyer_1',
      payment: {
        stripePaymentIntentId: 'pi_existing',
        status: 'pending'
      }
    };

    Order.findOne.mockResolvedValue(existingOrder);
    Order.findById.mockReturnValue(makePopulatedQuery({ _id: 'order_1', orderNumber: 'FH-TEST-0001' }));
    stripe.paymentIntents.retrieve.mockResolvedValue({ client_secret: 'cs_test_123' });

    const result = await runHandler(createPaymentIntent, {
      body: { gigId: 'gig_1', packageType: 'basic' },
      headers: { 'x-idempotency-key': 'attempt-abc' },
      user: { _id: 'buyer_1' }
    });

    expect(result.type).toBe('json');
    expect(result.res.status).toHaveBeenCalledWith(200);
    expect(result.payload.success).toBe(true);
    expect(result.payload.data.reused).toBe(true);
    expect(result.payload.data.clientSecret).toBe('cs_test_123');
    expect(stripe.paymentIntents.retrieve).toHaveBeenCalledWith('pi_existing');
  });

  test('handleWebhook transitions pending_payment once and increments stats', async () => {
    stripe.webhooks.constructEvent.mockReturnValue({
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_1',
          metadata: { orderId: 'order_1' }
        }
      }
    });

    Order.findOneAndUpdate.mockResolvedValue({
      _id: 'order_1',
      orderNumber: 'FH-TEST-0001',
      gig: 'gig_1'
    });

    const req = {
      headers: { 'stripe-signature': 'sig_123' },
      body: Buffer.from('{}')
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await handleWebhook(req, res);

    expect(Order.findOneAndUpdate).toHaveBeenCalled();
    expect(Gig.findByIdAndUpdate).toHaveBeenCalledWith('gig_1', { $inc: { 'stats.orders': 1 } });
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });

  test('handleWebhook retry does not re-increment stats', async () => {
    stripe.webhooks.constructEvent.mockReturnValue({
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_1',
          metadata: { orderId: 'order_1' }
        }
      }
    });

    Order.findOneAndUpdate.mockResolvedValue(null);
    Order.updateOne.mockResolvedValue({ modifiedCount: 0 });

    const req = {
      headers: { 'stripe-signature': 'sig_123' },
      body: Buffer.from('{}')
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await handleWebhook(req, res);

    expect(Order.updateOne).toHaveBeenCalled();
    expect(Gig.findByIdAndUpdate).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });

  test('handleWebhook charge.refunded syncs local refund status and amount', async () => {
    stripe.webhooks.constructEvent.mockReturnValue({
      type: 'charge.refunded',
      data: {
        object: {
          payment_intent: 'pi_ref_1',
          amount_refunded: 1050
        }
      }
    });

    Order.updateOne.mockResolvedValue({ modifiedCount: 1 });

    const req = {
      headers: { 'stripe-signature': 'sig_123' },
      body: Buffer.from('{}')
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await handleWebhook(req, res);

    expect(Order.updateOne).toHaveBeenCalledWith(
      {
        'payment.stripePaymentIntentId': 'pi_ref_1',
        'payment.status': { $ne: 'refunded' }
      },
      {
        $set: expect.objectContaining({
          'payment.status': 'refunded',
          'payment.refundAmount': 10.5
        })
      }
    );
    expect(res.json).toHaveBeenCalledWith({ received: true });
  });
});
