/**
 * Shop page logic
 */
import { getAllProducts, getProductsByCategory, searchProducts } from '../services/products.js';
import { renderProductCard, showToast } from '../ui/components.js';
import state from '../state.js';

const productGrid = document.getElementById('product-grid');
const categoryLinks = document.querySelectorAll('#category-filters a');
const searchInput = document.getElementById('search-input');

let currentCategory = 'all';

/**
 * Initialize shop page
 */
const initShop = async () => {
    // Get category from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    if (catParam) {
        currentCategory = catParam;
        updateActiveCategoryLink(catParam);
    }

    loadProducts();

    // Set up listeners
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const cat = link.getAttribute('data-cat');
            currentCategory = cat;
            updateActiveCategoryLink(cat);
            loadProducts();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', debounce(async (e) => {
            const term = e.target.value;
            if (term.length > 2) {
                const results = await searchProducts(term);
                renderProducts(results);
            } else if (term.length === 0) {
                loadProducts();
            }
        }, 500));
    }

    // Delegate "Add to Cart" clicks
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = e.target.getAttribute('data-id');
            const products = state.get().products;
            const product = products.find(p => p.id === productId);
            if (product) {
                state.addToCart(product);
                showToast(`Added ${product.name} to cart`, 'success');
            }
        }
    });
};

const loadProducts = async () => {
    productGrid.innerHTML = '<p class="loading-text" style="text-align: center; grid-column: 1/-1; opacity: 0.5; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem;">Refining collection...</p>';

    try {
        let products;
        if (currentCategory === 'all') {
            products = await getAllProducts();
        } else {
            products = await getProductsByCategory(currentCategory);
        }

        state.setProducts(products);
        renderProducts(products);
    } catch (error) {
        productGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: red;">Failed to load collection.</p>';
    }
};

const renderProducts = (products) => {
    if (products.length === 0) {
        productGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <symbol>✧</symbol>
                <p>The collection is currently being curated.<br>Please check back shortly.</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = products.map(p => {
        // Ensure image exists or show placeholder
        const productWithImg = {
            ...p,
            images: p.images && p.images.length > 0 ? p.images : ['https://via.placeholder.com/400x500?text=Luxury+Item']
        };
        return renderProductCard(productWithImg);
    }).join('');
};

const updateActiveCategoryLink = (cat) => {
    categoryLinks.forEach(link => {
        if (link.getAttribute('data-cat') === cat) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
};

// Utilities
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

document.addEventListener('DOMContentLoaded', initShop);
