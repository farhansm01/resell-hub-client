# ReSell Hub 🛍️

**A modern second-hand marketplace platform where users can buy and sell pre-owned products safely and efficiently.**

---

## 🌐 Live URL

🔗 [https://resell-hub-client-xi.vercel.app](https://resell-hub-client-xi.vercel.app)

---

## 📁 Repositories

- **Client:** [https://github.com/farhansm01/resell-hub-client](https://github.com/farhansm01/resell-hub-client)
- **Server:** [https://github.com/farhansm01/resell-hub-server](https://github.com/farhansm01/resell-hub-server)

---

## 🎯 Project Purpose

ReSell Hub is an online marketplace that connects buyers and sellers of pre-owned products. The platform helps reduce waste, promote sustainable consumption, and create opportunities for users to earn money from items they no longer need — while helping buyers find quality products at affordable prices.

---

## ✨ Key Features

### 🔐 Authentication
- Email & password registration and login
- Role-based registration — choose Buyer or Seller on signup
- Secure session management with BetterAuth
- Protected private routes and role-based access control
- JWT token verification on private APIs

### 🏠 Home Page
- Dynamic Hero Banner with CTA and statistics
- Featured Products — latest approved listings from database
- Popular Categories — dynamic category cards with product counts
- Marketplace Statistics — total products, sellers, buyers, completed orders
- Success Stories — buyer and seller testimonials
- Sustainability Impact section
- Trusted Sellers Showcase
- Framer Motion animations throughout

### 🛒 Marketplace
- All Products page with search, filter, sort, and pagination
- Advanced filtering — price range, condition, category
- Product Details page with full product info, seller details, and reviews
- Add to Wishlist functionality
- Category browsing — browse by category with product counts

### 💳 Payment System
- Stripe Payment Gateway integration
- Checkout page with order summary and delivery information form
- Secure Stripe hosted checkout
- Payment Success page with transaction details
- Payment history for buyers

### 👤 Buyer Dashboard
- Overview with total orders, wishlist count, recent purchases
- My Orders — view, track, and cancel orders
- Wishlist management
- Payment History with transaction records
- Write a Review for purchased products
- Profile management

### 🏪 Seller Dashboard
- Overview with total products, sales, revenue, pending orders
- Add Product with imgbb image upload
- My Products — view, edit, delete listings
- Manage Orders — accept, reject, update delivery status
- Sales Analytics with Recharts charts

### 🛡️ Admin Dashboard
- Overview with platform-wide statistics
- Manage Users — view, search, block/unblock, delete
- Manage Products — approve, reject, delete listings
- Manage Orders — monitor and override order statuses
- Manage Payments — view all transactions, filter by status
- Platform Analytics with Recharts charts

### 🌟 Optional Features
- **Recently Viewed Products** — tracks last 4 viewed products per user
- **Advanced Product Filtering** — price range, condition, category filters

---

## 🗂️ Pages

### Public Pages
- Home
- All Products
- Product Details
- Categories
- About Us
- Contact Us
- Login
- Register

### Private Pages
- Buyer Dashboard (Overview, My Orders, Wishlist, Payment History, Write a Review, Profile)
- Seller Dashboard (Overview, Add Product, My Products, Manage Orders, Analytics)
- Admin Dashboard (Overview, Manage Users, Manage Products, Manage Orders, Manage Payments, Analytics)
- Checkout
- Payment Success

---

## 🧰 NPM Packages Used

### Client
| Package | Purpose |
|---|---|
| `next` | React framework (App Router) |
| `react` | UI library |
| `tailwindcss` | Utility-first CSS |
| `@heroui/react` | UI component library |
| `@gravity-ui/icons` | Icon library |
| `framer-motion` | Animations |
| `recharts` | Charts and analytics |
| `react-toastify` | Toast notifications |
| `better-auth` | Authentication |
| `@stripe/stripe-js` | Stripe client-side |
| `stripe` | Stripe server-side (Next.js API routes) |

### Server
| Package | Purpose |
|---|---|
| `express` | Node.js web framework |
| `mongodb` | MongoDB driver |
| `cors` | Cross-origin resource sharing |
| `dotenv` | Environment variables |
| `stripe` | Stripe payment processing |
| `better-auth` | Authentication |
| `nodemon` | Development auto-restart |

---

## 🔒 Security

- Environment variables for all sensitive keys (MongoDB URI, BetterAuth secret, Stripe keys)
- JWT token verification on private API endpoints
- Role-based authorization (buyer / seller / admin)
- Admin account created manually — not accessible via registration
- Stripe handles all payment data securely

---

## 🚀 Deployment

- **Client:** Vercel
- **Server:** Vercel (serverless)
- **Database:** MongoDB Atlas
- **Image Hosting:** imgbb
- **Payments:** Stripe

---

## 🎨 Color Palette

| Role | Hex |
|---|---|
| Primary | `#F97316` |
| Primary Dark | `#C2410C` |
| Secondary | `#3B5BDB` |
| Background | `#FAFAF9` |
| Text Primary | `#1C1917` |
| Text Secondary | `#78716C` |
| Success | `#16A34A` |
| Error | `#DC2626` |

---

## 👨‍💻 Developer

**Farhan Sadique Mohee**
- AIUB — Computer Science & Engineering
- Full Stack Developer (MERN Stack)
