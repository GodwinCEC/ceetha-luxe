import state, { CONFIG } from './state.js';
import { initAuth } from './services/auth.js';

// Initialize the app
const init = async () => {
    console.log('Ceetha Luxe Phase 0.5 Initialized');

    // Apply initial theme
    const { theme } = state.get();
    document.documentElement.setAttribute('data-theme', theme);

    // Initialize Auth listener
    initAuth();

    // Set up state listeners
    state.subscribe((newState) => {
        updateCartBadge(newState.cart);
        updateAuthUI(newState.user);
        document.documentElement.setAttribute('data-theme', newState.theme);
    });

    // Initial UI updates
    updateCartBadge(state.get().cart);
    updateAuthUI(state.get().user);

    // Global UI setup
    setupThemeToggle();
    handleStickyHeader();
    setupMobileMenu();
    initRevealOnScroll();
};

const initRevealOnScroll = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

const setupMobileMenu = () => {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('nav-menu');
    if (!btn || !menu) return;

    btn.onclick = () => {
        menu.classList.toggle('nav-active');
        btn.classList.toggle('active'); // Future: For cross-icon animation
    };

    // Close menu when clicking links
    menu.querySelectorAll('a').forEach(link => {
        link.onclick = (e) => {
            if (link.id !== 'auth-link') {
                menu.classList.remove('nav-active');
            }
        };
    });
};

const setupThemeToggle = () => {
    if (!CONFIG.ALLOW_CHANGE_THEME) return;

    // Prevent duplicate toggle buttons
    if (document.getElementById('theme-toggle')) return;

    const btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.className = 'theme-toggle-btn';
    btn.innerHTML = state.get().theme === 'light' ? '🌙' : '☀️';
    btn.onclick = () => {
        state.toggleTheme();
        btn.innerHTML = state.get().theme === 'light' ? '🌙' : '☀️';
    };
    document.body.appendChild(btn);
};

const handleStickyHeader = () => {
    const header = document.querySelector('header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
};

const updateCartBadge = (cart) => {
    const badge = document.getElementById('cart-count');
    if (badge) {
        const count = cart.reduce((total, item) => total + item.quantity, 0);
        badge.textContent = count;
    }
};

const updateAuthUI = (user) => {
    const authLink = document.getElementById('auth-link');
    if (authLink) {
        if (user) {
            authLink.textContent = 'Logout';
            authLink.href = '#';
            authLink.onclick = async (e) => {
                e.preventDefault();
                const { logout } = await import('./services/auth.js');
                await logout();
            };
        } else {
            authLink.textContent = 'Login';
            authLink.href = 'login.html';
            authLink.onclick = null;
        }
    }
};

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', init);
