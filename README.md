<div align="center">
  
# 🚀 FreelanceHub

### A Professional Freelance Marketplace Platform

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)
[![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)](https://stripe.com/)

A full-featured freelance marketplace where clients find talented freelancers, place orders, communicate in real-time, and process payments securely — built with the MERN stack.

[Live Demo (Coming Soon)](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## 📑 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Contact](#-contact)

---

## 📖 About The Project

FreelanceHub is a comprehensive freelance marketplace platform inspired by Fiverr and Upwork. It connects freelancers with clients, enabling them to collaborate on projects with secure payments, real-time communication, and a robust order management system.

### How It Works

┌──────────────┐ ┌──────────────┐ ┌─────────────┐
│ │ │ │ │ │
│ FREELANCERS │◄───────►│ FREELANCEHUB│◄───────►│ CLIENTS │
│ │ │ │ │ │
└──────────────┘ └──────────────┘ └─────────────┘
│ │ │
▼ ▼ ▼
• Create gigs • Secure payments • Browse gigs
• Deliver work • Real-time chat • Place orders
• Get paid • Escrow system • Review work

### Business Model

| Step | Description                          | Amount     |
| ---- | ------------------------------------ | ---------- |
| 1    | Client pays for a gig                | $100.00    |
| 2    | Stripe processing fee (2.9% + $0.30) | -$3.20     |
| 3    | Platform fee (10%)                   | -$10.00    |
| 4    | **Freelancer receives**              | **$86.80** |

---

## ✨ Key Features

### 🔐 Authentication & Security

- Email/Password registration with validation
- JWT-based authentication with secure token management
- Google & GitHub OAuth integration
- Email verification with OTP
- Password reset via email
- Two-Factor Authentication (2FA)
- Account lockout after failed attempts

### 👤 User Management

- Dual roles: Users can be both Freelancer and Client
- Role switching with separate dashboards
- Profile management with avatar upload
- Skills, languages, and portfolio showcase
- Freelancer levels (New → Level 1 → Level 2 → Top Rated)

### 📦 Gig System

- Create gigs with multiple pricing packages (Basic/Standard/Premium)
- Image gallery with up to 5 images
- Categories and subcategories
- Tags, FAQs, and requirements collection
- Draft saving and publish/unpublish toggle

### 🔍 Search & Discovery

- Full-text search across titles, descriptions, and tags
- Advanced filters (price, delivery time, rating, seller level)
- Multiple sorting options
- Pagination support

### 🛒 Order Management

- Complete order lifecycle (Pending → In Progress → Delivered → Completed)
- Requirements submission
- Delivery with file attachments
- Revision requests with tracking
- Order cancellation and dispute resolution
- Auto-complete after 3 days

### 💳 Payment System

- Stripe integration for secure payments
- Escrow system (funds held until delivery accepted)
- Freelancer wallet with withdrawal support
- 14-day clearing period for fraud protection
- Complete transaction history

### 💬 Real-time Messaging

- Real-time chat powered by Socket.io
- File sharing in conversations
- Typing indicators
- Online/Offline status
- Message history with pagination

### ⭐ Reviews & Ratings

- Star rating system (1-5)
- Detailed reviews with multiple criteria
- Seller response to reviews
- Rating breakdown and averages

### 🔔 Notifications

- Real-time in-app notifications
- Email notifications for important events
- Customizable notification preferences

### 📊 Dashboards

- **Freelancer Dashboard**: Earnings, orders, performance metrics
- **Client Dashboard**: Spending overview, active orders
- **Admin Dashboard**: Platform statistics, user management, disputes

---

## 🛠 Tech Stack

### Frontend

| Technology                | Purpose                      |
| ------------------------- | ---------------------------- |
| React 19                  | UI library                   |
| Vite                      | Build tool & dev server      |
| Tailwind CSS              | Utility-first styling        |
| Redux Toolkit (RTK Query) | State management & API calls |
| React Router v7           | Client-side routing          |
| Socket.io Client          | Real-time communication      |
| Axios                     | HTTP requests                |
| React Hot Toast           | Toast notifications          |
| React Icons               | Icon library                 |

### Backend

| Technology         | Purpose                 |
| ------------------ | ----------------------- |
| Node.js            | Runtime environment     |
| Express.js         | Web framework           |
| MongoDB + Mongoose | Database & ODM          |
| Socket.io          | Real-time communication |
| JWT                | Authentication tokens   |
| bcryptjs           | Password hashing        |
| Stripe             | Payment processing      |
| Cloudinary         | Image/file storage      |
| SendGrid           | Email service           |
| node-cron          | Background jobs         |

---

## 🏗 Architecture

┌─────────────────────────────────────────────────────────────────────┐
│ CLIENTS │
│ Web App (React) / Admin Panel (React) │
└─────────────────────────────┬───────────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────────────┐
│ API SERVER │
│ Node.js + Express.js │
│ ┌──────────┬───────────┬────────────┬──────────────────┐ │
│ │ Auth │ Gigs │ Orders │ Payments │ │
│ │ Module │ Module │ Module │ Module │ │
│ └──────────┴───────────┴────────────┴──────────────────┘ │
└───────────┬──────────────┬──────────────┬───────────────────────────┘
│ │ │
▼ ▼ ▼
┌───────────┐ ┌───────────┐ ┌───────────┐
│ MongoDB │ │ Socket.io │ │ Stripe │
│ (Atlas) │ │ (Chat) │ │(Payments) │
└───────────┘ └───────────┘ └───────────┘

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **MongoDB Atlas** account ([Sign up](https://www.mongodb.com/atlas))
- **Git** ([Download](https://git-scm.com/))


## 📦 Installation Guide

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/dawood125/freelancehub
cd freelancehub
```

---

### 2️⃣ Install Dependencies

#### Install Root Dependencies

```bash
npm install
```

#### Install Server Dependencies

```bash
cd server
npm install
```

#### Install Client Dependencies

```bash
cd ../client
npm install
```

---

### 3️⃣ Setup Environment Variables

Inside the `server` folder, create a `.env` file:

```bash
cp .env.example .env
```

Now update the `.env` file with your credentials:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
```

---

### 4️⃣ Run the Application

From the **root folder**, run:

```bash
npm run dev
```

---

## 🌐 Application URLs

| Service | URL |
|----------|------|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api/health |

---

# 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

---

## 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/auth/me` | Get current user profile | ✅ |
| POST | `/auth/verify-email` | Verify email with OTP | ❌ |
| POST | `/auth/forgot-password` | Request password reset | ❌ |
| POST | `/auth/reset-password/:token` | Reset password | ❌ |

---

## 👤 User Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/users/me` | Get my profile | ✅ |
| PUT | `/users/me` | Update my profile | ✅ |
| GET | `/users/:username` | Get user by username | ❌ |

---

## 💼 Gig Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/gigs` | Get all gigs (with filters) | ❌ |
| GET | `/gigs/:id` | Get gig by ID | ❌ |
| POST | `/gigs` | Create new gig | ✅ |
| PUT | `/gigs/:id` | Update gig | ✅ |
| DELETE | `/gigs/:id` | Delete gig | ✅ |

---

## 🛒 Order Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/orders` | Get my orders | ✅ |
| POST | `/orders` | Create order | ✅ |
| POST | `/orders/:id/deliver` | Submit delivery | ✅ |
| POST | `/orders/:id/accept` | Accept delivery | ✅ |

> 📌 Full API documentation will be added as endpoints are completed.

---

# 📁 Project Structure

```
freelancehub/
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service functions
│   │   ├── context/        # React contexts
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Root component
│   │   └── main.jsx        # Entry point
│   └── package.json
│
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── config/         # Database & service configs
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Auth & error handling
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   ├── sockets/        # Socket.io handlers
│   │   └── app.js          # Express app setup
│   ├── server.js           # Server entry point
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json            # Root scripts
```

---

# 🖼 Screenshots

🚧 Screenshots will be added as the UI is developed.

- Home Page – Coming Soon  
- Gig Listing – Coming Soon  
- Gig Detail – Coming Soon  
- Dashboard – Coming Soon  
- Chat – Coming Soon  
- Checkout – Coming Soon  

---

# 🗺 Roadmap

- [x] Project setup & architecture  
- [x] Database schemas (User model)  
- [x] Authentication (JWT)  
- [ ] Email verification (OTP)  
- [ ] OAuth (Google & GitHub)  
- [ ] User profile management  
- [ ] Gig CRUD operations  
- [ ] Search & filters  
- [ ] Order management system  
- [ ] Stripe payment integration  
- [ ] Real-time chat (Socket.io)  
- [ ] Review & rating system  
- [ ] Notification system  
- [ ] Freelancer dashboard  
- [ ] Client dashboard  
- [ ] Admin panel  
- [ ] 2FA authentication  
- [ ] Deployment  

---

# 🤝 Contributing

Contributions are welcome!

1. Fork the repository  
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add AmazingFeature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature"
   ```
5. Open a Pull Request  

---

# 📞 Contact

**Dawood Ahmed**

- GitHub : https://github.com/dawood125
- LinkedIn : www.linkedin.com/in/dawood-ahmed-8953b63a2 

---

<div align="center">

⭐ **Star this repository if you found it helpful!**  
Made with ❤️ by Dawood Ahmed

</div>