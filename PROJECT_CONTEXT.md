# FreelanceHub Stripe Module Context Pack

Prepared on: March 30, 2026
Audience: AI assistant implementing Stripe payments in existing codebase

## Direct Answers to Your 3 Questions

### Q1: Recommended next task = Stripe payments?
Yes, agreed.

Reason:
- Orders are implemented end-to-end but have no payment enforcement.
- This is the highest business-critical gap and should be built before chat/reviews.

### Q2: Fix known bugs while building payments, or separately?
Fix them in the same implementation cycle (recommended).

Execution approach:
- Phase 0 (quick fixes):
  - Fix gigs route ordering issue.
  - Replace hardcoded frontend API URL with env-driven value.
- Phase 1+: Stripe module implementation.

This keeps the payment rollout stable and avoids avoidable integration bugs.

### Q3: Frontend state management pattern?
Current frontend uses direct service calls from components.

Observed state approach:
- No Redux setup found.
- No Zustand store found.
- No centralized Context-based global state architecture for API domain logic.
- Components/pages call services (axios-based) directly.

## Requested Files (Priority 1)

### server/src/models/Order.js
```js
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
      'pending_requirements',  
      'in_progress',           
      'delivered',             
      'revision_requested',    
      'completed',             
      'cancelled'              
    ],
    default: 'pending_requirements'
  },

  timeline: {
    createdAt: { type: Date, default: Date.now },
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
```

### server/src/controllers/orderController.js
```js
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

    pricing: {
      subtotal,
      serviceFee,
      total,
      sellerEarning
    },

    revisions: {
      allowed: selectedPackage.revisions,
      used: 0
    },

    timeline: {
      createdAt: new Date(),
      expectedDeliveryAt
    },

    status: 'pending_requirements'
  });

  gig.stats.orders += 1;
  await gig.save({ validateBeforeSave: false });
  const populatedOrder = await populateOrder(Order.findById(order._id));

  res.status(201).json({
    success: true,
    message: 'Order created successfully!',
    data: { order: populatedOrder }
  });
});


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



const submitRequirements = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.buyer.toString() !== req.user._id.toString()) {
    return next(new AppError('Only the buyer can submit requirements', 403));
  }

  if (order.status !== 'pending_requirements') {
    return next(new AppError('Requirements have already been submitted', 400));
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


const deliverOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.seller.toString() !== req.user._id.toString()) {
    return next(new AppError('Only the seller can deliver this order', 403));
  }

  if (!['in_progress', 'revision_requested'].includes(order.status)) {
    return next(new AppError(`Cannot deliver order with status: ${order.status}`, 400));
  }

  const { message } = req.body;

  if (!message) {
    return next(new AppError('Please provide a delivery message', 400));
  }

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


const requestRevision = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

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

  if (!note) {
    return next(new AppError('Please provide a revision note explaining what needs to change', 400));
  }

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



const acceptDelivery = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

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

const cancelOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  const userId = req.user._id.toString();

  if (order.buyer.toString() !== userId && order.seller.toString() !== userId) {
    return next(new AppError('You do not have access to this order', 403));
  }

  if (['completed', 'cancelled'].includes(order.status)) {
    return next(new AppError(`Cannot cancel an order that is ${order.status}`, 400));
  }

  const { reason } = req.body;

  if (!reason) {
    return next(new AppError('Please provide a reason for cancellation', 400));
  }


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

  await Gig.findByIdAndUpdate(order.gig, {
    $inc: { 'stats.cancelledOrders': 1 }
  });

  const populatedOrder = await populateOrder(Order.findById(order._id));

  res.status(200).json({
    success: true,
    message: 'Order cancelled.',
    data: { order: populatedOrder }
  });
});



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
```

### server/src/routes/orderRoutes.js
```js
const express = require('express');
const orderController = require('../controllers/orderController');
const router = express.Router();
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/', orderController.createOrder);
router.get('/', orderController.getMyOrders);
router.get('/stats', orderController.getOrderStats);
router.get('/:id', orderController.getOrder);

router.put('/:id/requirements', orderController.submitRequirements);
router.post('/:id/deliver', orderController.deliverOrder);
router.post('/:id/revision', orderController.requestRevision);
router.post('/:id/accept', orderController.acceptDelivery);
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router;
```

### server/src/app.js
```js
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const gigRoutes = require('./routes/gigRoutes');
const orderRoutes = require('./routes/orderRoutes');

const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 FreelanceHub API is running!',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});


app.use(errorHandler);

module.exports = app;
```

### server/package.json
```json
{
  "name": "freelancehub-server",
  "version": "1.0.0",
  "description": "FreelanceHub API Server",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": [],
  "author": "Dawood Ahmed",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^3.0.3",
    "cloudinary": "^2.9.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "express": "^4.21.2",
    "jsonwebtoken": "^9.0.3",
    "mongoose": "^8.12.1",
    "multer": "^2.1.1",
    "nodemailer": "^8.0.1",
    "validator": "^13.15.26"
  },
  "devDependencies": {
    "nodemon": "^3.1.9"
  }
}
```

## Requested Files (Priority 2)

### client/src/services/api.js
```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



api.interceptors.response.use(
 
  (response) => response,

  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

### client/src/services/orderService.js
```js
import api from './api';

const orderService = {
  
  createOrder: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  getMyOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  submitRequirements: async (id, requirements) => {
    const response = await api.put(`/orders/${id}/requirements`, { requirements });
    return response.data;
  },

  deliverOrder: async (id, message) => {
    const response = await api.post(`/orders/${id}/deliver`, { message });
    return response.data;
  },

  requestRevision: async (id, note) => {
    const response = await api.post(`/orders/${id}/revision`, { note });
    return response.data;
  },

  acceptDelivery: async (id) => {
    const response = await api.post(`/orders/${id}/accept`);
    return response.data;
  },

  cancelOrder: async (id, reason) => {
    const response = await api.post(`/orders/${id}/cancel`, { reason });
    return response.data;
  },

  getOrderStats: async () => {
    const response = await api.get('/orders/stats');
    return response.data;
  },
};

export default orderService;
```

### client/src/App.jsx
```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layout
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

// Pages
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import ProfilePage from "./pages/profile/ProfilePage";
import GigsPage from "./pages/gigs/GigsPage";
import GigDetailPage from "./pages/gigs/GigDetailPage";
import CreateGigPage from "./pages/gigs/CreateGigPage";
import OrdersPage from "./pages/orders/OrdersPage";
import OrderDetailPage from "./pages/orders/OrderDetailPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#f1f5f9",
              borderRadius: "12px",
              padding: "16px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#22c55e", secondary: "#ffffff" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#ffffff" },
            },
          }}
        />

        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route
              path="/reset-password/:token"
              element={<ResetPasswordPage />}
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/gigs" element={<GigsPage />} />
            <Route path="/gigs/:id" element={<GigDetailPage />} />
            <Route path="/create-gig" element={<CreateGigPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/:id" element={<OrderDetailPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
```

### server/src/middleware/auth.js
```js
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const { verifyToken } = require('../utils/jwt');

const protect = catchAsync(async (req, res, next) => {

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in. Please login to access this resource.', 401));
  }

  let decoded;

  try {
    decoded = verifyToken(token);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Your session has expired. Please login again.', 401));
    }
    return next(new AppError('Invalid token. Please login again.', 401));
  }

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  if (currentUser.status !== 'active') {
    return next(new AppError('Your account has been suspended.', 403));
  }

  req.user = currentUser;
  next();
});

module.exports = { protect };
```

## Requested Files (Priority 3)

### server/src/models/Gig.js
```js
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
```

### server/src/models/User.js
```js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    username: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],

      match: [
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers, and underscores",
      ],
    },

    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Please provide a valid email",
      },
    },

    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    avatar: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },

    title: {
      type: String,
      maxlength: [100, "Title cannot exceed 100 characters"],
      default: "",
    },

    bio: {
      type: String,
      maxlength: [1000, "Bio cannot exceed 1000 characters"],
      default: "",
    },

    roles: {
      type: [String],
      enum: ["freelancer", "client", "admin"],
      default: ["client"],
    },

    currentRole: {
      type: String,
      enum: ["freelancer", "client"],
      default: "client",
    },

    freelancerProfile: {
      skills: [
        {
          type: String,
          trim: true,
        },
      ],

      languages: [
        {
          language: String,
          proficiency: {
            type: String,
            enum: ["basic", "conversational", "fluent", "native"],
          },
        },
      ],

      level: {
        type: String,
        enum: ["new", "level-1", "level-2", "top-rated"],
        default: "new",
      },

      totalEarnings: { type: Number, default: 0 },
      completedOrders: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 },
    },

    location: {
      country: { type: String, default: "" },
      city: { type: String, default: "" },
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationOTP: {
      type: String,
      select: false,
    },

    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    status: {
      type: String,
      enum: ["active", "suspended", "banned"],
      default: "active",
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
```

### server/src/utils/AppError.js
```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
```

### server/src/utils/catchAsync.js
```js
const catchAsync = (fn) => {
  
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = catchAsync;
```

## Additional Notes for Payment Implementation

- Current server dependency list does not include stripe package yet.
- Current order schema has no payment fields (intent id, paid status, transaction id, webhook event refs).
- Current order flow allows progression without payment checks.
- Frontend API base URL is currently hardcoded.

## Instruction to Proceed

Please proceed with Stripe integration using current code style and include quick bug fixes in same cycle:
1. Fix gig route ordering conflict.
2. Move frontend API base URL to env variable.
3. Implement Stripe backend + webhook + guarded order lifecycle.
4. Add frontend checkout flow and payment service.
