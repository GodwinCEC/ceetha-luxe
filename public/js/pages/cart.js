/**
 * Cart page logic
 */
import state from '../state.js';

const cartList = document.getElementById('cart-list');
const cartSummaryPanel = document.getElementById('cart-summary-panel');
const subtotalEl = document.getElementById('subtotal');
const totalEl = document.getElementById('grand-total');

/**
 * Initialize cart page
 */
const initCart = () => {
    renderCart();

    // Subscribe to state changes to re-render
    state.subscribe(() => {
        renderCart();
    });
};

const renderCart = () => {
    const cart = state.get().cart;

    if (cart.length === 0) {
        cartList.innerHTML = `
            <div class="empty-cart-msg">
                <p style="font-size: 1.2rem; margin-bottom: var(--space-md); opacity: 0.6;">Your cart is currently empty.</p>
                <a href="shop.html" class="luxury-button">Browse Collection</a>
            </div>
        `;
        cartSummaryPanel.style.display = 'none';
        return;
    }

    cartSummaryPanel.style.display = 'block';

    // Render list
    cartList.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-img">
                <img src="${item.images && item.images[0] ? item.images[0] : 'https://via.placeholder.com/100x100?text=Item'}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p class="cart-item-price">GH₵${item.price}</p>
            </div>
            <div class="cart-qty-controls">
                <button class="cart-qty-btn decrease" data-id="${item.id}">-</button>
                <span class="cart-qty-val">${item.quantity}</span>
                <button class="cart-qty-btn increase" data-id="${item.id}">+</button>
            </div>
            <button class="remove-btn" data-id="${item.id}">Remove</button>
        </div>
    `).join('');

    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    subtotalEl.textContent = `GH₵${subtotal.toFixed(2)}`;
    totalEl.textContent = `GH₵${subtotal.toFixed(2)}`;

    setupEvents();
};

const setupEvents = () => {
    // Increase quantity
    document.querySelectorAll('.increase').forEach(btn => {
        btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            const cart = [...state.get().cart];
            const item = cart.find(i => i.id === id);
            if (item) {
                // Future: Check stock here
                item.quantity++;
                state.set({ cart });
            }
        };
    });

    // Decrease quantity
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            const cart = [...state.get().cart];
            const item = cart.find(i => i.id === id);
            if (item && item.quantity > 1) {
                item.quantity--;
                state.set({ cart });
            }
        };
    });

    // Remove item
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.onclick = () => {
            const id = btn.getAttribute('data-id');
            state.removeFromCart(id);
        };
    });
};

document.addEventListener('DOMContentLoaded', initCart);
