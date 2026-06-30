<div align="center">

# 🚀 FreelanceHub

### A Production-Ready Full-Stack Freelance Marketplace Platform

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Now-brightgreen?style=for-the-badge)](http://51.20.75.172)
[![Node.js](https://img.shields.io/badge/Node.js-v20-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![AWS](https://img.shields.io/badge/AWS-EC2-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white)](https://aws.amazon.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)
[![Deployment](https://img.shields.io/badge/Deployment-CI%2FCD-success?style=for-the-badge&logo=github-actions)](https://github.com/features/actions)

**A Fiverr-inspired marketplace platform connecting freelancers with clients worldwide. Built with the MERN stack, deployed on AWS EC2 with automated CI/CD pipeline.**

[🌐 Live Demo](http://51.20.75.172) · [📖 Documentation](#-documentation) · [🐛 Report Bug](https://github.com/dawood125/freelancehub/issues) · [✨ Request Feature](https://github.com/dawood125/freelancehub/issues)

</div>

---

## 📋 Table of Contents

- [About The Project](#-about-the-project)
- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [AWS Deployment](#-aws-deployment)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 📖 About The Project

**FreelanceHub** is a full-stack freelance marketplace platform inspired by industry leaders like Fiverr, Upwork, and Freelancer.com. It provides a complete ecosystem where freelancers can showcase their skills and clients can find the perfect talent for their projects.

The platform handles the entire project lifecycle — from gig discovery and secure payments to real-time communication and order management — all wrapped in a modern, responsive UI.

### 🎯 What Makes This Project Special?

This isn't just another tutorial project. FreelanceHub demonstrates **production-grade full-stack development** with:

- ☁️ **Cloud-deployed on AWS EC2** (Ubuntu 26.04 LTS)
- 🔄 **Automated CI/CD pipeline** using GitHub Actions
- 🌐 **Nginx reverse proxy** for optimal performance
- 🛡️ **PM2 process management** for zero-downtime deployments
- 🗄️ **MongoDB Atlas** for scalable cloud database
- 🔐 **JWT authentication** with secure password hashing
- 💬 **Real-time features** powered by Socket.io
- 💳 **Stripe payment integration** for secure transactions
- 📧 **SendGrid email service** for notifications and verification

---

## 🌐 Live Demo

**🚀 The application is live and running on AWS EC2:**

**[http://51.20.75.172](http://51.20.75.172)**

| Service | Status | URL |
|---------|--------|-----|
| 🎨 Frontend (React) | ✅ Live | http://51.20.75.172 |
| 🔧 Backend API | ✅ Live | http://51.20.75.172/api |
| 🗄️ Database (MongoDB Atlas) | ✅ Connected | Cloud-hosted |
| 🚀 CI/CD Pipeline | ✅ Active | Auto-deploy on push |

---

## ✨ Key Features

### 🔐 Authentication & Security

- ✅ Email/Password registration with comprehensive validation
- ✅ JWT-based authentication with secure token management
- ✅ Email verification with OTP (One-Time Password)
- ✅ Password reset via secure email tokens
- ✅ bcryptjs password hashing (industry standard)
- ✅ Protected routes with middleware-based authorization
- ✅ Role-based access control (Freelancer/Client)

### 👤 User Management

- 👥 Dual role system: Users can be both Freelancer and Client
- 🎭 Role switching with separate dashboard experiences
- 🖼️ Profile management with Cloudinary avatar upload
- 💼 Freelancer profiles with skills, languages, and portfolio
- 🏆 Freelancer leveling system (New → Level 1 → Level 2 → Top Rated)
- 🔗 Public profile pages with shareable URLs

### 📦 Gig Management

- ✏️ Create gigs with multiple pricing packages (Basic / Standard / Premium)
- 🖼️ Image gallery with up to 5 images per gig
- 🏷️ Categories and subcategories with tagging
- ❓ FAQs and requirements collection
- 💾 Draft saving and publish/unpublish toggle
- 📊 Gig performance analytics (impressions, clicks, orders)

### 🔍 Search & Discovery

- 🔎 Full-text search across titles, descriptions, and tags
- 🎛️ Advanced filters (price range, delivery time, rating, seller level)
- 📈 Multiple sorting options (relevance, newest, price, rating)
- 📄 Pagination with configurable page sizes

### 🛒 Order Management

- 📋 Complete order lifecycle (Pending → In Progress → Delivered → Completed)
- 📝 Requirements submission and tracking
- 📦 Delivery with file attachments
- 🔄 Revision requests with tracking
- ❌ Order cancellation handling
- ⏰ Auto-complete after delivery period

### 💳 Payment System

- 💰 Stripe integration for secure payment processing
- 🔒 Escrow system (funds held until delivery accepted)
- 💼 Freelancer wallet with transaction history
- 🧾 Complete payment records and receipts
- 💸 Platform commission handling

### 💬 Real-time Messaging

- ⚡ Real-time chat powered by Socket.io
- 📎 File and image sharing in conversations
- ⌨️ Typing indicators
- 🟢 Online/Offline status indicators
- 📜 Message history with pagination
- 🔔 Unread message counters

### ⭐ Reviews & Ratings

- ⭐ 5-star rating system
- 📝 Detailed reviews with multiple criteria
- 💬 Seller response capability
- 📊 Rating breakdown and averages
- 🏅 Reputation building system

### 🔔 Notifications

- 🔔 Real-time in-app notifications
- 📧 Email notifications for important events
- 🎯 Customizable notification preferences
- 📱 Bell icon with unread count badge

### 📊 Dashboards & Analytics

- 💼 **Freelancer Dashboard**: Earnings, active orders, performance metrics
- 🛒 **Client Dashboard**: Spending overview, active projects
- 📈 Real-time statistics and charts
- 📊 Order history with filters

---

## 🛠️ Tech Stack

### 🎨 Frontend

| Technology | Purpose | Version |
|-----------|---------|---------|
| **React** | UI Library | v19 |
| **Vite** | Build tool & dev server | v7 |
| **Tailwind CSS** | Utility-first styling | v4 |
| **Zustand** | State management | v5 |
| **React Router** | Client-side routing | v7 |
| **Axios** | HTTP client | v1 |
| **Socket.io Client** | Real-time communication | v4 |
| **Stripe.js** | Payment processing | Latest |
| **Framer Motion** | Animations | v12 |
| **React Hot Toast** | Toast notifications | v2 |

### ⚙️ Backend

| Technology | Purpose | Version |
|-----------|---------|---------|
| **Node.js** | Runtime environment | v20 LTS |
| **Express.js** | Web framework | v4 |
| **MongoDB** | NoSQL database | Atlas (M0) |
| **Mongoose** | ODM for MongoDB | v8 |
| **Socket.io** | Real-time bidirectional communication | v4 |
| **JWT** | JSON Web Tokens for auth | v9 |
| **bcryptjs** | Password hashing | v3 |
| **Stripe** | Payment processing | v21 |
| **Cloudinary** | Cloud image storage | v2 |
| **SendGrid** | Email delivery service | v8 |
| **Multer** | File upload middleware | v2 |
| **Validator** | String validation/sanitization | v13 |

### ☁️ DevOps & Infrastructure

| Technology | Purpose |
|-----------|---------|
| **AWS EC2** | Cloud server (t2.micro, Free Tier) |
| **Ubuntu** | Server OS (26.04 LTS) |
| **Nginx** | Web server & reverse proxy |
| **PM2** | Process manager for Node.js |
| **GitHub Actions** | CI/CD automation |
| **MongoDB Atlas** | Cloud-hosted database |
| **NVM** | Node Version Manager |

---

## 🏗️ Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USERS                                │
│              (Web Browsers - Desktop/Mobile)                │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS Request
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   AWS EC2 INSTANCE                          │
│                    (Ubuntu 26.04)                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   NGINX (Port 80)                    │  │
│  │              Reverse Proxy & Web Server              │  │
│  └────────────┬─────────────────────┬───────────────────┘  │
│               │                     │                       │
│               │ /api/*              │ /*                    │
│               ▼                     ▼                       │
│  ┌─────────────────────┐  ┌─────────────────────────┐    │
│  │  NODE.JS (Port 5000)│  │   REACT BUILD (dist/)   │    │
│  │  PM2 Process Manager│  │   Static Files (HTML,   │    │
│  │  Express + Socket.io│  │   CSS, JS, Images)      │    │
│  └──────────┬──────────┘  └─────────────────────────┘    │
└─────────────┼──────────────────────────────────────────────┘
              │
              │ Mongoose ODM
              ▼
┌─────────────────────────────────────────────────────────────┐
│              MONGODB ATLAS (Cloud Database)                 │
│           Collections: Users, Gigs, Orders, etc.            │
└─────────────────────────────────────────────────────────────┘

External Services:
├── Stripe API (Payment Processing)
├── Cloudinary (Image Storage)
├── SendGrid (Email Service)
└── Socket.io (WebSocket Connections)
```

### Data Flow

1. **User Request** → Browser sends HTTP request to AWS EC2
2. **Nginx Receives** → Routes request based on URL pattern
3. **Static Files** → React app served from `client/dist/`
4. **API Requests** → Forwarded to Node.js on port 5000
5. **Business Logic** → Express handles routes, controllers
6. **Database** → Mongoose queries MongoDB Atlas
7. **Response** → JSON data sent back through Nginx
8. **Real-time** → Socket.io maintains WebSocket connections

---

## ☁️ AWS Deployment

This project is **fully deployed on AWS EC2** using industry best practices.

### Deployment Stack

- **Server**: AWS EC2 t2.micro (Free Tier eligible)
- **OS**: Ubuntu 26.04 LTS
- **Web Server**: Nginx (Reverse Proxy)
- **Process Manager**: PM2 (with auto-restart)
- **Database**: MongoDB Atlas (Cloud)
- **SSL**: Ready for Let's Encrypt integration

### Server Configuration

| Component | Port | Purpose |
|-----------|------|---------|
| Nginx | 80 | Public-facing web server |
| Node.js | 5000 | Backend API (internal) |
| SSH | 22 | Server access |
| MongoDB | 27017 | Database (Atlas cloud) |

### Nginx Reverse Proxy

```nginx
# API requests → Node.js backend
location /api/ {
    proxy_pass http://localhost:5000/api/;
}

# Socket.io for real-time features
location /socket.io/ {
    proxy_pass http://localhost:5000/socket.io/;
}

# Static files → React build
location / {
    root /home/ubuntu/freelancehub/client/dist;
    try_files $uri $uri/ /index.html;
}
```

### PM2 Process Management

```bash
# Start application
pm2 start server.js --name "freelancehub-api"

# Auto-restart on server reboot
pm2 startup
pm2 save

# Monitor
pm2 status
pm2 logs
```

---

## 🔄 CI/CD Pipeline

**Automated deployment** using GitHub Actions — every code push to `main` branch automatically deploys to AWS EC2.

### Pipeline Workflow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Developer   │───▶│   GitHub     │───▶│  GitHub      │
│  git push    │    │   Detects    │    │  Actions     │
└──────────────┘    │   Changes    │    │  Runner      │
                    └──────────────┘    └──────┬───────┘
                                               │
                                               │ Build & Test
                                               ▼
                    ┌──────────────┐    ┌──────────────┐
                    │  AWS EC2     │◀───│   SSH to     │
                    │  Updated     │    │   Server     │
                    └──────────────┘    └──────────────┘
```

### Automated Steps

1. ✅ **Code Checkout** — Latest code pulled from repository
2. ✅ **Dependency Installation** — `npm install` on server
3. ✅ **Frontend Build** — React production build
4. ✅ **File Sync** — New code copied to server
5. ✅ **PM2 Restart** — Application restarted with zero downtime
6. ✅ **Nginx Reload** — Web server picks up new static files
7. ✅ **Health Check** — Verify deployment succeeded

### Benefits

- ⚡ **Deploy in 2-3 minutes** (vs 10-15 minutes manual)
- 🛡️ **Zero human error** — Automated process
- 📊 **Full audit trail** — Every deployment logged
- 🔄 **Easy rollback** — Previous version always available

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB Atlas** account ([Sign up](https://www.mongodb.com/atlas))
- **Git** ([Download](https://git-scm.com/))
- **Cloudinary** account ([Sign up](https://cloudinary.com/))
- **Stripe** account ([Sign up](https://stripe.com/))
- **SendGrid** account ([Sign up](https://sendgrid.com/))

### 📦 Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/dawood125/freelancehub.git
cd freelancehub
```

#### 2️⃣ Install Dependencies

```bash
# Root dependencies
npm install

# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

#### 3️⃣ Environment Configuration

**Server `.env`** (in `server/` folder):

```bash
cp server/.env.example server/.env
```

Update `server/.env` with your credentials:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173

# Email (SendGrid)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
EMAIL_FROM=your_verified_email@domain.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**Client `.env`** (in `client/` folder):

```bash
cp client/.env.example client/.env
```

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

#### 4️⃣ Run the Application

**Development Mode** (runs both server and client concurrently):

```bash
# From root directory
npm run dev
```

**Or run separately:**

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### 🌐 Application URLs (Development)

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api          (Development)
http://51.20.75.172/api            (Production)
```

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Register new user | ❌ |
| `POST` | `/auth/login` | Login user | ❌ |
| `GET` | `/auth/me` | Get current user profile | ✅ |
| `POST` | `/auth/verify-email` | Verify email with OTP | ❌ |
| `POST` | `/auth/forgot-password` | Request password reset | ❌ |
| `POST` | `/auth/reset-password/:token` | Reset password | ❌ |

### 👤 User Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/users/me` | Get my profile | ✅ |
| `PUT` | `/users/me` | Update my profile | ✅ |
| `GET` | `/users/:username` | Get user by username | ❌ |

### 💼 Gig Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/gigs` | Get all gigs (with filters) | ❌ |
| `GET` | `/gigs/:id` | Get gig by ID | ❌ |
| `POST` | `/gigs` | Create new gig | ✅ |
| `PUT` | `/gigs/:id` | Update gig | ✅ |
| `DELETE` | `/gigs/:id` | Delete gig | ✅ |

### 🛒 Order Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/orders` | Get my orders | ✅ |
| `POST` | `/orders` | Create order | ✅ |
| `POST` | `/orders/:id/deliver` | Submit delivery | ✅ |
| `POST` | `/orders/:id/accept` | Accept delivery | ✅ |
| `POST` | `/orders/:id/revision` | Request revision | ✅ |
| `POST` | `/orders/:id/cancel` | Cancel order | ✅ |

### 💬 Message Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/messages/conversations` | Get all conversations | ✅ |
| `GET` | `/messages/:conversationId` | Get messages | ✅ |
| `POST` | `/messages` | Send message | ✅ |

> 📌 **Authentication**: Include JWT token in `Authorization: Bearer <token>` header

---

## 📁 Project Structure

```
freelancehub/
│
├── 📁 client/                          # React Frontend
│   ├── 📁 public/                      # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/              # Reusable UI components
│   │   │   ├── 📁 common/              # Buttons, Modals, etc.
│   │   │   ├── 📁 layout/              # Navbar, Footer, Sidebar
│   │   │   └── 📁 features/            # Feature-specific components
│   │   ├── 📁 pages/                   # Page-level components
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── GigsPage.jsx
│   │   │   ├── GigDetailPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── OrdersPage.jsx
│   │   │   ├── MessagesPage.jsx
│   │   │   └── ...
│   │   ├── 📁 services/                # API service layer
│   │   │   ├── authService.js
│   │   │   ├── gigService.js
│   │   │   ├── orderService.js
│   │   │   └── ...
│   │   ├── 📁 store/                   # Zustand state management
│   │   │   ├── authStore.js
│   │   │   └── ...
│   │   ├── 📁 hooks/                   # Custom React hooks
│   │   ├── 📁 utils/                   # Utility functions
│   │   ├── App.jsx                     # Root component
│   │   ├── main.jsx                    # Entry point
│   │   └── index.css                   # Global styles
│   ├── .env                            # Environment variables
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── 📁 server/                          # Node.js Backend
│   ├── 📁 src/
│   │   ├── 📁 config/                  # Configuration files
│   │   │   ├── db.js                   # MongoDB connection
│   │   │   ├── cloudinary.js
│   │   │   └── stripe.js
│   │   ├── 📁 controllers/             # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── gigController.js
│   │   │   ├── orderController.js
│   │   │   └── ...
│   │   ├── 📁 middleware/              # Custom middleware
│   │   │   ├── auth.js                 # JWT verification
│   │   │   ├── errorHandler.js
│   │   │   └── upload.js
│   │   ├── 📁 models/                  # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Gig.js
│   │   │   ├── Order.js
│   │   │   ├── Message.js
│   │   │   └── ...
│   │   ├── 📁 routes/                  # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── gigRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── ...
│   │   ├── 📁 services/                # Business logic
│   │   ├── 📁 utils/                   # Helper functions
│   │   ├── 📁 sockets/                 # Socket.io handlers
│   │   │   └── socketServer.js
│   │   └── app.js                      # Express app setup
│   ├── 📁 tests/                       # Test files
│   ├── .env                            # Environment variables
│   ├── .env.example
│   ├── server.js                       # Server entry point
│   └── package.json
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── deploy.yml                  # CI/CD pipeline
│
├── .gitignore                          # Git ignore rules
├── README.md                           # This file
├── package.json                        # Root package.json
└── LICENSE                             # License file
```

---

## 🗺️ Roadmap

### ✅ Completed Features

- [x] Project setup & architecture
- [x] Database schemas (User, Gig, Order, Message, Review)
- [x] JWT authentication with email verification
- [x] User profile management
- [x] Gig CRUD operations
- [x] Search & filters
- [x] Order management system
- [x] Stripe payment integration
- [x] Real-time chat (Socket.io)
- [x] Review & rating system
- [x] Notification system
- [x] Role-based dashboards
- [x] AWS EC2 deployment
- [x] Nginx reverse proxy
- [x] PM2 process management
- [x] CI/CD pipeline with GitHub Actions

### 🚧 In Progress

- [ ] Google & GitHub OAuth integration
- [ ] Two-Factor Authentication (2FA)
- [ ] Admin panel
- [ ] Advanced analytics dashboard
- [ ] Mobile responsive optimizations

### 🔮 Future Enhancements

- [ ] Progressive Web App (PWA)
- [ ] Push notifications
- [ ] Video chat integration
- [ ] AI-powered gig recommendations
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Docker containerization
- [ ] Kubernetes orchestration
- [ ] Domain name & SSL certificate
- [ ] CDN integration (CloudFront)

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

### How to Contribute

1. **Fork** the repository
2. **Create** your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push** to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** a Pull Request

### Code Style

- Follow existing code conventions
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

---

## 📄 License

Distributed under the **ISC License**. See [`LICENSE`](LICENSE) for more information.

---

## 📞 Contact

**Dawood Ahmed**

- 🌐 **Portfolio**: [Coming Soon]
- 💼 **LinkedIn**: [www.linkedin.com/in/dawood-ahmed-8953b63a2](https://www.linkedin.com/in/dawood-ahmed-8953b63a2)
- 🐙 **GitHub**: [@dawood125](https://github.com/dawood125)
- 📧 **Email**: dawood.bhatti8812@gmail.com
- 🌐 **Live Project**: [http://51.20.75.172](http://51.20.75.172)

---

## 🙏 Acknowledgments

- [React Documentation](https://react.dev/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Stripe API Reference](https://stripe.com/docs/api)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

**Made with ❤️ by [Dawood Ahmed](https://github.com/dawood125)**

[⬆ Back to Top](#-freelancehub)

</div>
