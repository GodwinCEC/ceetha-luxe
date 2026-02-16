/**
 * UI Components and helper functions
 */

export const showToast = (message, type = 'info') => {
    // Check if container exists
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'luxury-toast';
    toast.style.cssText = `
        background: var(--color-surface);
        color: var(--color-text);
        padding: 15px 25px;
        border-radius: var(--radius-sm);
        border-left: 4px solid var(--color-gold);
        box-shadow: var(--shadow-soft);
        font-size: 0.9rem;
        letter-spacing: 1px;
        transform: translateX(120%);
        transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
        backdrop-filter: var(--glass-blur);
    `;

    toast.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px;">
            <span style="color: var(--color-gold)">${type === 'success' ? '✓' : 'ℹ'}</span>
            <span>${message}</span>
        </div>
    `;

    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
        toast.style.transform = 'translateX(0)';
    });

    // Remove after 3s
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
        setTimeout(() => toast.remove(), 600);
    }, 3000);
};

export const showLoader = (show = true) => {
    let loader = document.getElementById('global-loader');
    if (!loader && show) {
        loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.style.cssText = `
            position: fixed;
            inset: 0;
            background: var(--color-bg);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        `;
        loader.innerHTML = `<div class="loader-spinner" style="width: 40px; height: 40px; border: 2px solid var(--color-border); border-top-color: var(--color-gold); border-radius: 50%; animation: spin 1s linear infinite;"></div>`;
        document.body.appendChild(loader);
    }

    if (loader) {
        loader.style.display = show ? 'flex' : 'none';
        loader.style.opacity = show ? '1' : '0';
        loader.style.transition = 'opacity 0.5s ease';
    }
};

export const renderProductCard = (product) => {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.images[0]}" alt="${product.name}" loading="lazy">
                <div class="product-badge">NEW</div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="price">GH₵${product.price}</p>
                <div style="margin-top: 15px;">
                    <button class="luxury-button outline add-to-cart" data-id="${product.id}" style="width: 100%;">Add to Cart</button>
                </div>
            </div>
        </div>
    `;
};
