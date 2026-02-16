/**
 * Checkout page logic
 */
import state from '../state.js';
import { createOrder, getDeliveryRates } from '../services/orders.js';
import { showToast } from '../ui/components.js';

const checkoutForm = document.getElementById('checkout-form');
const citySelect = document.getElementById('city');
const paymentOptions = document.querySelectorAll('.payment-option');
const paymentMethodInput = document.getElementById('paymentMethod');

// Summary elements
const summaryItemsList = document.getElementById('summary-items-list');
const subtotalEl = document.getElementById('summary-subtotal');
const deliveryEl = document.getElementById('summary-delivery');
const totalEl = document.getElementById('summary-total');

let deliveryFee = 0;
let cartSubtotal = 0;

/**
 * Initialize checkout page
 */
const initCheckout = async () => {
    const cart = state.get().cart;
    if (cart.length === 0) {
        showToast('Your cart is empty', 'info');
        window.location.href = 'shop.html';
        return;
    }

    renderSummary(cart);
    setupEvents();

    // Future: Load real delivery rates from Firestore
    // const rates = await getDeliveryRates();
    // populateCityOptions(rates);
};

const renderSummary = (cart) => {
    summaryItemsList.innerHTML = cart.map(item => `
        <div class="summary-item" style="opacity: 0.6;">
            <span>${item.name} x ${item.quantity}</span>
            <span>GH₵${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    updateTotals();
};

const updateTotals = () => {
    subtotalEl.textContent = `GH₵${cartSubtotal.toFixed(2)}`;
    deliveryEl.textContent = `GH₵${deliveryFee.toFixed(2)}`;
    totalEl.textContent = `GH₵${(cartSubtotal + deliveryFee).toFixed(2)}`;
};

const setupEvents = () => {
    // City change logic
    citySelect.addEventListener('change', (e) => {
        // Simple mock logic for now
        const selectedCity = e.target.value;
        const fees = {
            'Accra': 30,
            'Kumasi': 50,
            'Tema': 40,
            'Other': 100
        };
        deliveryFee = fees[selectedCity] || 0;
        updateTotals();
    });

    // Payment method selection
    paymentOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            paymentOptions.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            paymentMethodInput.value = opt.getAttribute('data-method');
        });
    });

    // Form submission
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            customer: {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value
            },
            items: state.get().cart,
            subtotal: cartSubtotal,
            deliveryFee: deliveryFee,
            total: cartSubtotal + deliveryFee,
            paymentMethod: paymentMethodInput.value,
            paymentStatus: paymentMethodInput.value === 'paystack' ? 'pending' : 'cod_pending'
        };

        try {
            showToast('Processing your order...', 'info');
            const orderId = await createOrder(formData);

            // Success logic
            state.clearCart();
            showToast('Order placed successfully!', 'success');

            // Redirect to success page or handling payment
            if (formData.paymentMethod === 'paystack') {
                // Future: Trigger Paystack popup
                window.location.href = `payment.html?orderId=${orderId}`;
            } else {
                window.location.href = `order-success.html?orderId=${orderId}`;
            }
        } catch (error) {
            showToast('Failed to create order. Please try again.', 'error');
        }
    });
};

document.addEventListener('DOMContentLoaded', initCheckout);
