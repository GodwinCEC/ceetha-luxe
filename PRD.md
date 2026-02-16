# Ceetha Luxe – Product Requirements Document
## Phase 0.5 (Launch Version)

---

# 1. Overview

Ceetha Luxe is a multi-category luxury online store selling fashion, beauty, electronics, salon equipment, and curated pre-order products.

Phase 0.5 objective:
Launch a premium, fully functional e-commerce store with online payment (Paystack) and Cash on Delivery, built with HTML, CSS, Vanilla JS, and Firebase.

---

# 2. Tech Stack

Frontend:
- HTML5
- CSS3
- Vanilla JavaScript (Modular)

Backend:
- Firebase Authentication
- Firestore
- Firebase Storage
- Firebase Hosting
- Firebase Cloud Functions

Payments:
- Paystack (Card + MoMo)

---

# 3. User Roles

## Customer
- Browse products
- Filter by category
- Add to cart
- Checkout
- Pay online (Paystack) or Cash on Delivery
- View order history
- Track order status

## Admin
- Secure login
- Add/Edit/Delete products
- Upload product images
- View orders
- Update order status
- Mark COD paid
- View revenue summary

---

# 4. Data Models

## products
- id
- name
- description
- category
- price
- discountPrice
- stock
- images[]
- isPreorder
- createdAt
- updatedAt

## orders
- orderId
- userId
- customerDetails {name, phone, email, address, city}
- items[]
- subtotal
- deliveryFee
- total
- paymentMethod (paystack | cod)
- paymentStatus (pending | paid | failed | cod)
- orderStatus (pending | processing | shipped | delivered | cancelled)
- paystackRef
- createdAt

## deliveryRates
- city
- fee

---

# 5. Core Features

- Authentication (Email/Password)
- Product management dashboard
- Cart system
- Checkout system
- Paystack payment integration
- COD option
- Inventory deduction after payment
- Basic revenue summary
- Mobile-first luxury UI

---

# 6. Security

- Admin role via custom claims
- Firestore security rules
- Payment verification via webhook
- HTTPS only
- No secret keys in frontend

---

# 7. Future Upgrade Path (Phase 1)

- Invoice PDF generation
- Advanced analytics dashboard
- Discount codes
- Email notifications
- Automated delivery tracking
