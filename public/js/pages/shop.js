/**
 * Shop page logic
 */
import { getAllProducts, getProductsByCategory, searchProducts } from '../services/products.js';
import { renderProductCard, showToast } from '../ui/components.js';
import state from '../state.js';

const productGrid = document.getElementById('product-grid');
const categoryLinks = document.querySelectorAll('#category-list li');
const priceFilters = document.querySelectorAll('#price-filters li');
const searchInput = document.getElementById('search-bar');
const filterToggle = document.getElementById('filter-toggle');
const sidebar = document.querySelector('.filters-sidebar');

let currentCategory = 'all';
let currentPriceRange = { min: 0, max: Infinity };
let searchTerm = '';

/**
 * Initialize shop page
 */
const initShop = async () => {
    // Mobile filter toggle
    if (filterToggle && sidebar) {
        filterToggle.addEventListener('click', () => {
            sidebar.classList.toggle('show');
            filterToggle.textContent = sidebar.classList.contains('show') ? 'Close' : 'Filters';
        });
    }
    // Get category from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat') || urlParams.get('category');
    if (catParam) {
        currentCategory = catParam;
        updateActiveCategoryLink(catParam);
    }

    loadProducts();

    // Set up category listeners
    categoryLinks.forEach(link => {
        link.addEventListener('click', () => {
            const cat = link.getAttribute('data-category');
            currentCategory = cat;
            updateActiveCategoryLink(cat);
            loadProducts();
        });
    });

    // Set up price filter listeners
    priceFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const min = parseInt(filter.getAttribute('data-min'));
            const maxStr = filter.getAttribute('data-max');
            const max = maxStr === 'high' ? Infinity : parseInt(maxStr);

            currentPriceRange = { min, max };

            // Update UI
            priceFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');

            loadProducts();
        });
    });

    // Set up search
    if (searchInput) {
        searchInput.addEventListener('input', debounce(async (e) => {
            searchTerm = e.target.value.toLowerCase();
            loadProducts();
        }, 500));
    }

    // Event delegation for product grid interactions
    productGrid.addEventListener('click', (e) => {
        // Handle "Add to Cart" button clicks
        const addToCartBtn = e.target.closest('.add-to-cart');
        if (addToCartBtn) {
            e.stopPropagation(); // Prevent card click
            const productId = addToCartBtn.getAttribute('data-id');
            const products = state.get().products;
            const product = products.find(p => p.id === productId);
            if (product) {
                state.addToCart(product);
                showToast(`Added ${product.name} to cart`, 'success');
            }
            return;
        }

        // Handle product card clicks (navigate to product detail)
        const productCard = e.target.closest('.product-card');
        if (productCard) {
            const productId = productCard.getAttribute('data-product-id');
            if (productId) {
                window.location.href = `product.html?id=${productId}`;
            }
        }
    });
};

/**
 * Load and filter products
 */
const loadProducts = async () => {
    productGrid.innerHTML = '<p class="loading-text" style="text-align: center; grid-column: 1/-1; opacity: 0.5; letter-spacing: 2px; text-transform: uppercase; font-size: 0.8rem;">Refining collection...</p>';

    try {
        let products;

        // 1. Fetch products
        if (currentCategory === 'all') {
            products = await getAllProducts();
        } else {
            products = await getProductsByCategory(currentCategory);
        }

        // 2. Apply search filter
        if (searchTerm.length > 0) {
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchTerm) ||
                (p.description && p.description.toLowerCase().includes(searchTerm))
            );
        }

        // 3. Apply price filter
        products = products.filter(p =>
            p.price >= currentPriceRange.min &&
            p.price <= currentPriceRange.max
        );

        state.setProducts(products);
        renderProducts(products);
    } catch (error) {
        console.error("Shop load error:", error);
        productGrid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: red;">Failed to load collection.</p>';
    }
};

const renderProducts = (products) => {
    if (products.length === 0) {
        productGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 100px 0; opacity: 0.5;">
                <div style="font-size: 3rem; margin-bottom: 20px;">✧</div>
                <p>No items match your current selection.<br>Please refine your filters.</p>
            </div>
        `;
        return;
    }

    productGrid.innerHTML = products.map(p => {
        const productWithImg = {
            ...p,
            images: p.images && p.images.length > 0 ? p.images : ['https://via.placeholder.com/400x500?text=Luxury+Item']
        };
        return renderProductCard(productWithImg);
    }).join('');
};

const updateActiveCategoryLink = (cat) => {
    categoryLinks.forEach(link => {
        if (link.getAttribute('data-category') === cat) {
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