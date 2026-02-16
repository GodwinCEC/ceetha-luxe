/**
 * Authentication service for Ceetha Luxe
 */
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { auth, db } from "./firebase.js";
import state from "../state.js";

/**
 * Register a new user
 */
export const register = async (email, password, userData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const newUserDoc = {
            uid: user.uid,
            email: user.email,
            role: 'customer',
            createdAt: serverTimestamp(),
            ...userData
        };

        // Save to Firestore
        await setDoc(doc(db, "users", user.uid), newUserDoc);

        state.setUser(newUserDoc);
        return newUserDoc;
    } catch (error) {
        console.error("Registration failed:", error);
        throw error;
    }
};

/**
 * Login user with email and password
 */
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Fetch additional user data/claims from Firestore if needed
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};

        const fullUser = {
            uid: user.uid,
            email: user.email,
            ...userData
        };

        state.setUser(fullUser);
        return fullUser;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

/**
 * Logout current user
 */
export const logout = async () => {
    try {
        await signOut(auth);
        state.setUser(null);
    } catch (error) {
        console.error("Logout failed:", error);
        throw error;
    }
};

/**
 * Listen for auth state changes
 */
export const initAuth = () => {
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            // User is signed in
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};

            state.setUser({
                uid: user.uid,
                email: user.email,
                ...userData
            });
        } else {
            // User is signed out
            state.setUser(null);
        }
    });
};

/**
 * Check if user has admin privileges
 */
export const isAdmin = (user) => {
    return user && (user.role === 'admin' || user.isAdmin === true);
};
