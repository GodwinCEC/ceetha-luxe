/**
 * Admin service for management operations
 */
import {
    collection,
    getDocs,
    doc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { db, storage } from "./firebase.js";

const ORDERS_COLLECTION = "orders";
const PRODUCTS_COLLECTION = "products";

/**
 * Fetch all orders for admin
 */
export const getAllOrders = async () => {
    try {
        const q = query(collection(db, ORDERS_COLLECTION), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
};

/**
 * Fetch all products for admin
 */
export const getAllProducts = async () => {
    try {
        const q = query(collection(db, PRODUCTS_COLLECTION), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (orderId, status) => {
    try {
        const orderRef = doc(db, ORDERS_COLLECTION, orderId);
        await updateDoc(orderRef, {
            orderStatus: status,
            updatedAt: serverTimestamp()
        });
    } catch (error) {
        console.error(`Error updating order ${orderId}:`, error);
        throw error;
    }
};

/**
 * Product Management
 */
export const saveProduct = async (productData, id = null) => {
    try {
        const data = {
            ...productData,
            updatedAt: serverTimestamp()
        };

        if (id) {
            const productRef = doc(db, PRODUCTS_COLLECTION, id);
            await updateDoc(productRef, data);
            return id;
        } else {
            data.createdAt = serverTimestamp();
            const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), data);
            return docRef.id;
        }
    } catch (error) {
        console.error("Error saving product:", error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};

/**
 * Image Upload
 */
export const uploadProductImage = async (file) => {
    try {
        const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        return await getDownloadURL(snapshot.ref);
    } catch (error) {
        console.error("Image upload failed:", error);
        throw error;
    }
};

/**
 * Seed Test Data
 */
export const seedTestData = async () => {
    const products = [
        {
            name: "Lumière Gold Chandelier",
            category: "equipment",
            price: 4500.00,
            stock: 5,
            description: "An exquisite gold-plated chandelier for elite interiors.",
            images: ["https://images.unsplash.com/photo-1543248939-ff40856f65d4?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Silk Enigma Evening Gown",
            category: "fashion",
            price: 2800.00,
            stock: 8,
            description: "Hand-stitched silk gown from the 2026 Parisian collection.",
            images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Ethereal Glow Serum",
            category: "beauty",
            price: 750.00,
            stock: 25,
            description: "Advanced hydration formula for a timeless complexion.",
            images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Aura Noise-Canceling Headphones",
            category: "electronics",
            price: 1200.00,
            stock: 12,
            description: "Pure sound meets premium leather design.",
            images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Zenith Precision Mixer",
            category: "equipment",
            price: 3200.00,
            stock: 3,
            description: "Professional grade equipment for high-end bakeries.",
            images: ["https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80"]
        }
    ];

    console.log("Seeding started...");
    for (const p of products) {
        await saveProduct(p);
    }
    console.log("Seeding complete.");
};
