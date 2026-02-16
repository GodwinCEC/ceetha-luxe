# 💎 Ceetha Luxe | Premium E-Commerce Experience

Ceetha Luxe is a high-end, bespoke e-commerce platform designed for curating the pinnacle of global luxury in equipment, fashion, and beauty. Built with a focus on **Visual Excellence**, **Modular Architecture**, and **Seamless User Experience**, it provides a launch-ready engine for a sophisticated digital boutique.

---

## ✨ Key Features

### 🎨 Luxury Design System

- **Prestige UI:** A bespoke aesthetic using a Black, Gold, and White palette.
- **Adaptive Theme Engine:** Toggle between **Deep Onyx (Dark)** and **Classic Light** modes with a floating controls for instant visual switching.
- **Glassmorphism:** Modern translucent effects applied to headers, cards, and modal elements.
- **Micro-Animations:** Fluid fade-ins, hover transitions, and scroll effects for a buttery-smooth feel.

### 🛒 E-Commerce Engine

- **Dynamic Shop Grid:** High-performance product listing with real-time filtering (Category, Price Range) and instant search.
- **Luxury Product Presentation:** Immersive details page with high-res galleries, stock awareness, and aesthetic descriptions.
- **State-Persistent Cart:** A robust shopping cart that persists across page navigations and sessions.
- **Multi-Step Checkout:** A premium, streamlined checkout flow with dynamic delivery fee calculations based on region.
- **Integrated Payments:** Support for secure online payments via Paystack and Cash on Delivery (COD).

### 🛡️ Admin Dashboard

- **Secure Access:** Restricted management portal for verified admin accounts.
- **Product CRUD:** Complete interface for adding, editing, and deleting luxury inventory with image upload support to Firebase Storage.
- **Order Fulfillment:** Real-time tracking of order statuses (Pending, Processing, Shipped, Delivered).
- **Business Intelligence:** At-a-glance revenue metrics and inventory health monitoring.
- **Seed Data Utility:** One-click seeding of premium placeholder data for testing and demonstration.

---

## 🛠 Tech Stack

- **Frontend:** Vanilla HTML5, Advanced CSS3 (Modular CSS architecture), Modern JavaScript (ES6+).
- **Backend-as-a-Service:** Firebase (Firestore, Authentication, Storage, Hosting).
- **State Management:** Custom reactive state store (`state.js`) with LocalStorage persistence.
- **Payment Gateway:** Paystack Integration.

---

## 📂 Architecture Overview

```text
public/
├── css/             # Modular CSS System
│   ├── main.css     # Global variables & Theme system
│   ├── index.css    # Page-specific styles
│   └── ...          # (shop, product, cart, checkout, admin, login)
├── js/
│   ├── services/    # Business logic (Firebase, Auth, Products, Orders, Admin)
│   ├── ui/          # Reusable UI components
│   ├── pages/       # Page-specific logic & Event handlers
│   ├── state.js     # Global Reactive State Manager
│   └── app.js       # Global Application Entry Point
├── admin/           # Secured Admin Portal
└── assets/          # Static images & branding
```

---

## 🚀 Getting Started

### Prerequisites

- A Firebase Project (Firestore, Auth, Storage enabled).
- Paystack Public Key for payments.

### Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GodwinCEC/ceetha-luxe.git
   ```
2. **Configure Firebase:**
   Update `public/js/services/firebase.js` with your project credentials.
3. **Set Theme Options:**
   Modify `ALLOW_CHANGE_THEME` in `public/js/state.js` to control visibility of the theme toggle.
4. **Deploy:**
   Upload the `public` directory to your hosting provider or use Firebase Hosting.

---

## 🧪 Testing & Seeding

To quickly populate the store for demo purposes:

1. Log in to the [Admin Dashboard](admin/index.html).
2. Click the **🧪 Seed Data** button in the sidebar.
3. This will instantly curate 5 premium placeholder products into your Firestore database.

---

## 👨‍💻 Credits

Built with precision and passion by **[Godwin Mawulikplim](https://godwinmawuli.com)**.

---

_© 2026 Ceetha Luxe. Curating Luxury Excellence._
