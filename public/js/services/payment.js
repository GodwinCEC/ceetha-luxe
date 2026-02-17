/**
 * Paystack Payment Service for Ceetha Luxe
 */

// Paystack Public Key - Replace with your real key in production
const PAYSTACK_PUBLIC_KEY = 'pk_test_ebdc2b31636b90e2012e156c1e43db0a3f4bbf13';

/**
 * Initialize Paystack Payment
 */
export const initializePayment = (order, callback) => {
    // Simulate payment processing with a visual "barrier"
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.85)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.color = '#d4af37';
    overlay.style.fontFamily = "'Playfair Display', serif";

    overlay.innerHTML = `
        <div style="margin-bottom: 20px; font-size: 3rem;">💳</div>
        <h2 style="margin-bottom: 10px; letter-spacing: 2px;">PROCESSING SECURE PAYMENT</h2>
        <p style="opacity: 0.7;">Please wait while we confirm your transaction...</p>
        <div class="loader" style="margin-top: 30px; width: 40px; height: 40px; border: 3px solid rgba(212, 175, 55, 0.3); border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite;"></div>
    `;

    document.body.appendChild(overlay);

    // Simulate network delay
    setTimeout(() => {
        document.body.removeChild(overlay);

        // Return success
        callback({
            success: true,
            reference: 'SIM_' + Math.floor(Math.random() * 1000000000)
        });
    }, 3000);

    // Original Paystack code commented out for reference/future use
    /*
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
    */
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
