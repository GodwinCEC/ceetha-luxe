/**
 * Paystack Payment Service for Ceetha Luxe
 */

// Paystack Public Key - Replace with your real key in production
const PAYSTACK_PUBLIC_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

/**
 * Initialize Paystack Payment
 */
export const initializePayment = (order, callback) => {
    const handler = PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: order.customer.email,
        amount: order.total * 100, // Paystack works in pesewas/kobo
        currency: 'GHS',
        metadata: {
            orderId: order.id,
            custom_fields: [
                {
                    display_name: "Customer Phone",
                    variable_name: "customer_phone",
                    value: order.customer.phone
                }
            ]
        },
        callback: function (response) {
            // Payment successful
            callback({ success: true, reference: response.reference });
        },
        onClose: function () {
            // User closed the window
            callback({ success: false, reason: 'user_cancelled' });
        }
    });

    handler.openIframe();
};

/**
 * Verify payment status via backend
 * In Phase 0.5, we rely on the webhook, but we also check status manually if needed.
 */
export const verifyPayment = async (reference) => {
    // Phase 0.5 uses a Cloud Function to securely verify the payment
    try {
        const response = await fetch(`https://your-region-ceetha-luxe.cloudfunctions.net/verifyPaystackPayment?reference=${reference}`);
        return await response.json();
    } catch (error) {
        console.error("Verification error:", error);
        return { success: false, error: "Network error" };
    }
};
