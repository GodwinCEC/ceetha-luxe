/**
 * Product Details page logic
 */
import { getProductById } from '../services/products.js';
import { showToast } from '../ui/components.js';
import state from '../state.js';

const productContent = document.getElementById('product-content');

let currentProduct = null;
let selectedQuantity = 1;

/**
 * Initialize product page
 */
const initProduct = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'shop.html';
        return;
    }

    try {
        currentProduct = await getProductById(productId);
        if (!currentProduct) {
            productContent.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">Product not found.</p>';
            return;
        }
        renderProduct(currentProduct);
    } catch (error) {
        productContent.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: red;">Failed to load product details.</p>';
    }
};

const renderProduct = (product) => {
    const images = product.images && product.images.length > 0 ? product.images : ['https://via.placeholder.com/600x800?text=Luxury+Item'];
    const isOutOfStock = product.stock <= 0;

    productContent.innerHTML = `
        <div class="product-gallery">
            <div class="main-image">
                <img src="${images[0]}" alt="${product.name}" id="main-product-img">
            </div>
            <div class="thumbnails">
                ${images.map((img, i) => `
                    <div class="thumbnail ${i === 0 ? 'active' : ''}" data-src="${img}">
                        <img src="${img}" alt="${product.name} thumb">
                    </div>
                `).join('')}
            </div>
        </div>
        <div class="product-info-panel">
            <div class="product-category">${product.category}</div>
            <h1 class="font-elegant">${product.name}</h1>
            <div class="product-price">GH₵${product.price}</div>
            
            <div class="stock-badge ${isOutOfStock ? 'out' : ''}">
                ${isOutOfStock ? 'Out of Stock' : `${product.stock} items available`}
            </div>

            <div class="product-description">
                ${product.description || 'Experience the pinnacle of luxury with this curated item from Ceetha Luxe. Designed for those who appreciate the finer things in life.'}
            </div>

            <div class="purchase-options">
                ${!isOutOfStock ? `
                    <div class="quantity-selector">
                        <span>Quantity</span>
                        <div class="qty-controls">
                            <button class="qty-btn" id="qty-minus">-</button>
                            <span class="qty-value" id="qty-val">1</span>
                            <button class="qty-btn" id="qty-plus">+</button>
                        </div>
                    </div>
                    <button class="luxury-button" id="add-to-cart-btn">Add to Cart</button>
                ` : `
                    <button class="luxury-button outline" disabled>Out of Stock</button>
                `}
            </div>
        </div>
    `;

    // Add interactions
    setupInteractions();
};

const setupInteractions = () => {
    // Thumbnail switching
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImg = document.getElementById('main-product-img');

    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            mainImg.src = thumb.getAttribute('data-src');
        });
    });

    // Quantity controls
    const minusBtn = document.getElementById('qty-minus');
    const plusBtn = document.getElementById('qty-plus');
    const qtyVal = document.getElementById('qty-val');

    if (minusBtn && plusBtn) {
        minusBtn.addEventListener('click', () => {
            if (selectedQuantity > 1) {
                selectedQuantity--;
                qtyVal.textContent = selectedQuantity;
            }
        });

        plusBtn.addEventListener('click', () => {
            if (selectedQuantity < currentProduct.stock) {
                selectedQuantity++;
                qtyVal.textContent = selectedQuantity;
            } else {
                showToast('Maximum stock reached', 'info');
            }
        });
    }

    // Add to cart
    const addBtn = document.getElementById('add-to-cart-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            state.addToCart(currentProduct, selectedQuantity);
            showToast(`Added ${selectedQuantity} ${currentProduct.name} to cart`, 'success');
        });
    }
};

document.addEventListener('DOMContentLoaded', initProduct);
