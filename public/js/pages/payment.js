/**
 * Payment page logic
 */
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../services/firebase.js";
import { initializePayment } from "../services/payment.js";
import { updateOrder, deductStock } from "../services/orders.js";
import { showToast } from "../ui/components.js";

const orderDetailsDiv = document.getElementById('order-details');
const orderLoadingDiv = document.getElementById('order-loading');
const payBtn = document.getElementById('pay-now-btn');

let currentOrder = null;

const initPaymentPage = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    if (!orderId) {
        window.location.href = 'shop.html';
        return;
    }

    try {
        const orderSnap = await getDoc(doc(db, "orders", orderId));
        if (!orderSnap.exists()) {
            throw new Error("Order not found");
        }

        currentOrder = { id: orderSnap.id, ...orderSnap.data() };
        renderOrderDetails(currentOrder);
    } catch (error) {
        orderLoadingDiv.textContent = "Failed to load order. Please contact support.";
        showToast(error.message, 'error');
    }
};

const renderOrderDetails = (order) => {
    document.getElementById('display-order-id').textContent = order.id;
    document.getElementById('display-customer').textContent = `${order.customer.firstName} ${order.customer.lastName}`;
    document.getElementById('display-total').textContent = `GH₵${order.total.toFixed(2)}`;

    orderLoadingDiv.style.display = 'none';
    orderDetailsDiv.style.display = 'block';

    payBtn.onclick = () => startPayment();
};

const startPayment = () => {
    initializePayment(currentOrder, async (response) => {
        if (response.success) {
            showToast('Payment successful! Finalizing your order...', 'success');

            try {
                // 1. Deduct Stock
                await deductStock(currentOrder.items);

                // 2. Update Order Status
                await updateOrder(currentOrder.id, {
                    paymentStatus: 'paid',
                    paystackRef: response.reference,
                    orderStatus: 'processing'
                });

                // 3. Redirect to success
                window.location.href = `order-success.html?orderId=${currentOrder.id}`;
            } catch (error) {
                console.error("Post-payment error:", error);
                showToast("Payment was successful but we couldn't update your order. Our team will contact you.", "warning");
            }
        } else if (response.reason === 'user_cancelled') {
            showToast('Payment cancelled.', 'info');
        } else {
            showToast('Payment failed. Please try again.', 'error');
        }
    });
};

document.addEventListener('DOMContentLoaded', initPaymentPage);
