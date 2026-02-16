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
        },
        {
            name: "Onyx Eclipse Watch",
            category: "fashion",
            price: 15600.00,
            stock: 2,
            description: "A timeless masterpiece with obsidian highlights.",
            images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Velvet Midnight Sofa",
            category: "equipment",
            price: 8900.00,
            stock: 4,
            description: "Plush velvet comfort for the modern living space.",
            images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Pure Essence Parfum",
            category: "beauty",
            price: 1200.00,
            stock: 15,
            description: "A scent that lingers in the memory of those you meet.",
            images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Quantum Soundbar Pro",
            category: "electronics",
            price: 2400.00,
            stock: 10,
            description: "Immersive audio experience for your luxury cinematic nights.",
            images: ["https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Artisan Leather Tote",
            category: "fashion",
            price: 3100.00,
            stock: 6,
            description: "Hand-crafted from the finest Italian leather.",
            images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Diamond Infused Cream",
            category: "beauty",
            price: 1850.00,
            stock: 20,
            description: "The ultimate skin rejuvenation treatment.",
            images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Crystal Decanter Set",
            category: "equipment",
            price: 1500.00,
            stock: 10,
            description: "Serve your finest spirits in style.",
            images: ["https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Nebula VR Headset",
            category: "electronics",
            price: 4200.00,
            stock: 5,
            description: "Venture into worlds beyond your imagination.",
            images: ["https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Cashmere Lounge Set",
            category: "fashion",
            price: 2200.00,
            stock: 12,
            description: "Unrivaled softness for your quiet moments.",
            images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Golden Hour Highlight",
            category: "beauty",
            price: 550.00,
            stock: 30,
            description: "Capture the perfect glow at any time of day.",
            images: ["https://images.unsplash.com/photo-1522338228045-9b6c2159879f?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Imperial Espresso Machine",
            category: "equipment",
            price: 7800.00,
            stock: 3,
            description: "The peak of morning perfection.",
            images: ["https://images.unsplash.com/photo-1510972527921-ce03766a1cf1?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Titanium Laptop Studio",
            category: "electronics",
            price: 15000.00,
            stock: 5,
            description: "Unprecedented power in a sleek, metal chassis.",
            images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Midnight Suede Boots",
            category: "fashion",
            price: 4200.00,
            stock: 8,
            description: "Elegance with every step you take.",
            images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Platinum Face Roller",
            category: "beauty",
            price: 900.00,
            stock: 15,
            description: "Enhance your daily ritual with cooling platinum.",
            images: ["https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80"]
        },
        {
            name: "Vintage Film Camera",
            category: "electronics",
            price: 5500.00,
            stock: 2,
            description: "Capture the world through a classic lens.",
            images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"]
        }
    ];

    console.log("Seeding luxury vault...");
    for (const p of products) {
        await saveProduct(p);
    }
    console.log("Seeding complete.");
};
