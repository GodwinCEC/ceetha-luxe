/**
 * Order and Delivery service for Ceetha Luxe
 */
import {
    collection,
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    runTransaction,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase.js";

const ORDERS_COLLECTION = "orders";
const DELIVERY_RATES_COLLECTION = "deliveryRates";

/**
 * Fetch delivery rates for all cities
 */
export const getDeliveryRates = async () => {
    try {
        const snapshot = await getDocs(collection(db, DELIVERY_RATES_COLLECTION));
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching delivery rates:", error);
        throw error;
    }
};

/**
 * Create a new order
 */
export const createOrder = async (orderData) => {
    try {
        const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
            ...orderData,
            status: 'pending',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};

/**
 * Update order status and payment details
 */
export const updateOrder = async (orderId, updates) => {
    try {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);
        await updateDoc(orderRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error(`Error updating order ${orderId}:`, error);
        throw error;
    }
};

/**
 * Deduct stock from products (Atomic transaction)
 */
export const deductStock = async (items) => {
    try {
        await runTransaction(db, async (transaction) => {
            for (const item of items) {
                const productRef = doc(db, "products", item.id);
                const productSnap = await transaction.get(productRef);

                if (!productSnap.exists()) {
                    throw new Error(`Product ${item.id} does not exist!`);
                }

                const currentStock = productSnap.data().stock || 0;
                if (currentStock < item.quantity) {
                    throw new Error(`Insufficient stock for ${item.name}`);
                }

                transaction.update(productRef, {
                    stock: currentStock - item.quantity
                });
            }
        });
    } catch (error) {
        console.error("Stock deduction failed:", error);
        throw error;
    }
};
