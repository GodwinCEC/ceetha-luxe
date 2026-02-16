/**
 * Product service for Ceetha Luxe
 */
import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    where,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "./firebase.js";

const PRODUCTS_COLLECTION = "products";

/**
 * Fetch all products
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
 * Fetch products by category
 */
export const getProductsByCategory = async (category) => {
    try {
        const q = query(
            collection(db, PRODUCTS_COLLECTION),
            where("category", "==", category),
            orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`Error fetching products for category ${category}:`, error);
        throw error;
    }
};

/**
 * Fetch a single product by ID
 */
export const getProductById = async (id) => {
    try {
        const docRef = doc(db, PRODUCTS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error(`Error fetching product ${id}:`, error);
        throw error;
    }
};

/**
 * Search products by name (Simple client-side or basic startsWith)
 */
export const searchProducts = async (term) => {
    try {
        // Firestore doesn't support full-text search easily without Algolia.
        // For Phase 0.5, we fetch all and filter or use basic startAt/endAt.
        const all = await getAllProducts();
        return all.filter(p => p.name.toLowerCase().includes(term.toLowerCase()));
    } catch (error) {
        console.error("Error searching products:", error);
        throw error;
    }
};
