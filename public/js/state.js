/**
 * Central state management for Ceetha Luxe
 */

const STATE_KEY = 'ceetha_luxe_state';

// Global Configuration
export const CONFIG = {
    ALLOW_CHANGE_THEME: true, // Controls visibility of the toggle button
    DEFAULT_THEME: 'dark' // 'light' or 'dark'
};

const initialState = {
    user: null,
    cart: [],
    products: [],
    categories: [],
    notifications: [],
    isLoading: false,
    theme: CONFIG.DEFAULT_THEME
};

class State {
    constructor() {
        this.state = { ...initialState };
        this.listeners = [];
        this.loadFromStorage();
    }

    // Get current state
    get() {
        return this.state;
    }

    // Update state and notify listeners
    set(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
        this.saveToStorage();
    }

    // Subscribe to state changes
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    // Notify all listeners
    notify() {
        this.listeners.forEach(callback => callback(this.state));
    }

    // Persistence
    saveToStorage() {
        try {
            const dataToSave = {
                cart: this.state.cart
                // We don't save user/products to storage usually for security/freshness
            };
            localStorage.setItem(STATE_KEY, JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Error saving state to storage:', error);
        }
    }

    loadFromStorage() {
        try {
            const savedData = localStorage.getItem(STATE_KEY);
            if (savedData) {
                const parsed = JSON.parse(savedData);
                this.state = { ...this.state, ...parsed };
            }
        } catch (error) {
            console.error('Error loading state from storage:', error);
        }
    }

    // Helper to update specific fields
    setUser(user) { this.set({ user }); }
    setLoading(isLoading) { this.set({ isLoading }); }
    setProducts(products) { this.set({ products }); }

    // Cart Actions
    addToCart(product, quantity = 1) {
        const cart = [...this.state.cart];
        const index = cart.findIndex(item => item.id === product.id);
        if (index > -1) {
            cart[index].quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }
        this.set({ cart });
    }

    removeFromCart(productId) {
        const cart = this.state.cart.filter(item => item.id !== productId);
        this.set({ cart });
    }

    clearCart() {
        this.set({ cart: [] });
    }

    toggleTheme() {
        const currentTheme = this.state.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.set({ theme: newTheme });
    }
}

const state = new State();
export default state;
