# 🏗 Ceetha Luxe | Comprehensive System Architecture & Developer Guide

## 📜 1. Executive Summary

Ceetha Luxe is a high-performance, premium e-commerce platform built as a **Boutique-Scale Modular Monolith**. Unlike generic Shopify clones, Ceetha Luxe is engineered for maximum visual control and minimal technical debt, utilizing a pure "Service-Component" architecture that leverages modern browser capabilities without the overhead of heavy virtual DOM frameworks.

---

## 📐 2. Architectural Design Patterns

### 2.1. The "Single Source of Truth" Pattern (Reactive State)

We implement a proprietary `State` management system in `public/js/state.js`.

- **Pattern:** Observable State Pattern.
- **Implementation:** The `State` class maintains a private `state` object and an array of `listeners`.
- **Reactivity:** Any UI component can subscribe to specific state changes (e.g., `cart` or `user`). When `state.set()` is called, it triggers a broadcast to all subscribers.
- **Persistence:** High-priority state (Cart, Theme) is mirrored to `localStorage` using a broadcast-on-write strategy.

### 2.2. The Service-Controller-View (SCV) Pattern

- **Services (`/js/services/`):** Pure logic. These modules interact with Firebase, Paystack, and external APIs. They return data or trigger side effects but never touch the DOM.
- **Controllers (`/js/pages/`):** Event-driven logic. These modules translate DOM events (clicks, scrolls) into Service calls and handle page-specific business logic.
- **Views (HTML/UI):** Static markers. The HTML structure is a skeleton that holds placeholders for the **UI Component Generator** (`/js/ui/components.js`).

---

## 💾 3. Data Schema & Models (Firestore)

### 3.1. `products` Collection

Each document represents a luxury SKU.

```json
{
  "name": "string",
  "category": "fashion | beauty | electronics | equipment",
  "price": "number",
  "stock": "number",
  "description": "text (markdown support-ready)",
  "images": ["url_string"],
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### 3.2. `orders` Collection

Tracks the lifecycle of a purchase.

```json
{
  "customerId": "string (uid)",
  "customer": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string"
  },
  "items": [
    {
      "productId": "id",
      "name": "string",
      "price": "number",
      "quantity": "number"
    }
  ],
  "total": "number",
  "deliveryFee": "number",
  "paymentMethod": "paystack | cod",
  "paymentStatus": "pending | paid | failed",
  "orderStatus": "pending | processing | shipped | delivered | cancelled",
  "createdAt": "timestamp"
}
```

---

## ⚡ 4. Critical Process Lifecycles

### 4.1. Sequential Auth Lifecycle

1.  **Initialize:** `initAuth()` in `auth.js` sets up the `onAuthStateChanged` listener.
2.  **Detection:** If a user is detected, `state.setUser()` is called.
3.  **UI Update:** Every page (via `app.js`) listens for `user` changes and toggles Login/Logout/Admin buttons instantly.
4.  **Admin Check:** High-privilege pages verify the `admin` custom claim (or role field) before rendering.

### 4.2. Atomic Transactional Checkout

To prevent over-selling during high-volume periods, the checkout follows a strict sequence:

1.  **Selection:** User builds cart in local `State`.
2.  **Order Prep:** `checkout.js` creates an order with `pending` status.
3.  **Payment Hijack:** If `paystack` is chosen, the system waits for the `onSuccess` callback.
4.  **Inventory Locking:** Upon successful payment, the `orders.js` service calls `deductStock()`.
5.  **Validation:** Firestore `runTransaction` (planned for Phase 1.0) or atomic `increment` ensures the stock is only deducted if available.

---

## � 5. Modular CSS & Design Tokens

Ceetha Luxe uses a **Layered Token Architecture** in `public/css/main.css`:

| Token Category   | Usage Examples                                                |
| :--------------- | :------------------------------------------------------------ |
| **Brand Colors** | `--color-gold`, `--color-bg`, `--color-surface`               |
| **Spacing**      | `--space-sm (1rem)`, `--space-xl (4rem)`                      |
| **Elevations**   | `--shadow-soft`, `--glass-blur (12px)`                        |
| **Themes**       | Managed via `[data-theme="light/dark"]` attributes on `:root` |

### Adaptive Theme Logic

Theme switching is handled globally in `app.js`. By using `document.documentElement.setAttribute('data-theme', newState.theme)`, the entire application undergoes a semantic color swap (e.g., `--color-bg` moves from `#0a0a0a` to `#fafafa`).

---

## 🛡 6. Security & Performance

### 6.1. Security Architecture

- **Firebase Auth:** Handles secure JWT-based identity management.
- **REST Protection:** The Admin Dashboard is guarded by `checkAuth()` in `admin-dashboard.js`, which redirects non-admin users before any data is fetched.
- **Frontend Masking:** Secret keys (like Paystack Public) are restricted to authorized origins.

### 6.2. Performance Optimization

- **Mime Filtering:** Every CSS and JS file is served with correct MIME types to prevent parser blocking.
- **Asset Orchestration:** Page-specific styles (e.g., `cart.css`) are only loaded when needed, keeping the `index` bundle lean.
- **CDI (Component Data Injection):** Real-time data is injected into HTML templates at the last possible millisecond to ensure 100% data freshness.

---

## 🛠 7. Technical Workflow Guide

### How to Extend the System

#### Creating a New Feature Row on Index:

1.  **Define Model:** Ensure your product or item follows the existing schema.
2.  **Service:** Add a fetcher in `products.js`.
3.  **Component:** Add a generator function in `js/ui/components.js` (e.g., `renderPromoRow`).
4.  **Controller:** Trigger the render in `app.js` or a specific page controller.

---

## 📈 8. Advanced Roadmap

- **Phase 1.1:** Implementation of **Firestore Cloud Functions** for server-side Paystack Webhook verification.
- **Phase 1.2:** **PWA Support** for offline cart management and luxury notifications.
- **Phase 1.3:** **Admin Analytics Engine** with Chart.js integration for revenue visualizing.

---

_This architecture ensures that Ceetha Luxe remains a premium, scalable, and developer-friendly environment._
