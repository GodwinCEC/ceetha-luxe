/**
 * Admin Dashboard logic
 */
import { isAdmin, logout } from '../services/auth.js';
import { getAllOrders, getAllProducts, updateOrderStatus, saveProduct, uploadProductImage, deleteProduct, seedTestData } from '../services/admin.js';
import state from '../state.js';
import { showToast } from '../ui/components.js';

// Redirect non-admins
const checkAuth = () => {
    state.subscribe((newState) => {
        if (newState.user && !isAdmin(newState.user)) {
            window.location.href = '../index.html';
        } else if (!newState.user && !localStorage.getItem('ceetha_luxe_state')) {
            // Basic check - we really want to wait for firebase auth change
        }
    });
};

/**
 * View Management
 */
const views = {
    dashboard: document.getElementById('view-dashboard'),
    orders: null, // To be implemented
    products: null // To be implemented
};

const initDashboard = async () => {
    checkAuth();
    loadOverviewData();
    setupNav();

    document.getElementById('admin-logout').onclick = async (e) => {
        e.preventDefault();
        await logout();
        window.location.href = '../login.html';
    };

    const seedBtn = document.getElementById('seed-data-btn');
    if (seedBtn) {
        seedBtn.onclick = async (e) => {
            e.preventDefault();
            if (confirm("This will add premium placeholder items to your store. Proceed?")) {
                showToast("Seeding luxury vault...", "info");
                await seedTestData();
                showToast("Seeding complete!", "success");
                window.location.reload();
            }
        };
    }
};

const setupNav = () => {
    const navLinks = document.querySelectorAll('.admin-nav a[data-view]');
    navLinks.forEach(link => {
        link.onclick = (e) => {
            e.preventDefault();
            const viewKey = link.getAttribute('data-view');
            switchToView(viewKey);

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        };
    });
};

const switchToView = (key) => {
    // Hide all views
    document.querySelectorAll('.admin-view').forEach(v => v.style.display = 'none');

    // Show selected view or render it
    if (key === 'dashboard') {
        views.dashboard.style.display = 'block';
        loadOverviewData();
    } else if (key === 'orders') {
        renderOrdersView();
    } else if (key === 'products') {
        renderProductsView();
    }
};

/**
 * Overview View
 */
const loadOverviewData = async () => {
    try {
        const orders = await getAllOrders();
        const products = await getAllProducts();

        // Stats
        const revenue = orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0);
        const lowStock = products.filter(p => p.stock < 5).length;

        document.getElementById('stat-revenue').textContent = `GH₵${revenue.toFixed(2)}`;
        document.getElementById('stat-orders').textContent = orders.length;
        document.getElementById('stat-stock-alert').textContent = lowStock;

        // Recent Orders Table
        const recent = orders.slice(0, 5);
        const tableBody = document.querySelector('#recent-orders-table tbody');
        tableBody.innerHTML = recent.map(o => `
            <tr>
                <td>${o.id.substring(0, 8)}...</td>
                <td>${o.customer.firstName} ${o.customer.lastName}</td>
                <td>GH₵${o.total.toFixed(2)}</td>
                <td><span class="status-badge status-${o.paymentStatus === 'paid' ? 'paid' : 'pending'}">${o.paymentStatus}</span></td>
                <td><button class="luxury-button outline" style="padding: 2px 10px; font-size: 0.7rem;">View</button></td>
            </tr>
        `).join('');

    } catch (error) {
        showToast("Failed to load dashboard data", 'error');
    }
};

/**
 * Products View (Quick Implementation)
 */
const renderProductsView = async () => {
    const main = document.getElementById('admin-main');
    main.innerHTML = `
        <div class="admin-view" id="view-products" style="display:block;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: var(--space-lg);">
                <h2 class="font-elegant">Product Management</h2>
                <button class="luxury-button" id="open-add-product">Add New Product</button>
            </div>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="admin-products-list"></tbody>
            </table>
        </div>
    `;

    const products = await getAllProducts();
    const list = document.getElementById('admin-products-list');
    list.innerHTML = products.map(p => `
        <tr>
            <td><img src="${p.images?.[0] || ''}" width="40" height="40" style="object-fit:cover; border-radius:4px;"></td>
            <td>${p.name}</td>
            <td>${p.category}</td>
            <td>GH₵${p.price}</td>
            <td style="color: ${p.stock < 5 ? '#ff4d4d' : 'inherit'}">${p.stock}</td>
            <td>
                <button class="edit-btn" data-id="${p.id}" style="color:var(--color-gold); margin-right:10px;">Edit</button>
                <button class="delete-btn" data-id="${p.id}" style="color:#ff4d4d;">Delete</button>
            </td>
        </tr>
    `).join('');

    document.getElementById('open-add-product').onclick = () => {
        document.getElementById('modal-title').textContent = "Add New Product";
        document.getElementById('product-form').reset();
        document.getElementById('p-image-url').value = '';
        document.getElementById('product-modal').style.display = 'flex';
    };

    // Setup Edit/Delete listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = async () => {
            const id = btn.getAttribute('data-id');
            const products = await getAllProducts();
            const p = products.find(prod => prod.id === id);
            if (p) {
                document.getElementById('modal-title').textContent = "Edit Product";
                document.getElementById('p-name').value = p.name;
                document.getElementById('p-category').value = p.category;
                document.getElementById('p-price').value = p.price;
                document.getElementById('p-stock').value = p.stock;
                document.getElementById('p-desc').value = p.description || '';
                document.getElementById('p-image-url').value = p.images?.[0] || '';
                document.getElementById('product-modal').style.display = 'flex';
                document.getElementById('product-form').setAttribute('data-edit-id', id);
            }
        };
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = async () => {
            if (confirm("Are you sure you want to delete this product?")) {
                await deleteProduct(btn.getAttribute('data-id'));
                showToast("Product deleted", "success");
                renderProductsView();
            }
        };
    });
};

const renderOrdersView = async () => {
    const main = document.getElementById('admin-main');
    main.innerHTML = `
        <div class="admin-view" id="view-orders" style="display:block;">
            <h2 class="font-elegant" style="margin-bottom: var(--space-lg);">Order Management</h2>
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="admin-orders-list"></tbody>
            </table>
        </div>
    `;

    const orders = await getAllOrders();
    const list = document.getElementById('admin-orders-list');
    list.innerHTML = orders.map(o => `
        <tr>
            <td>${o.createdAt?.toDate().toLocaleDateString() || 'N/A'}</td>
            <td>${o.id.substring(0, 8)}</td>
            <td>${o.customer.firstName} ${o.customer.lastName}<br><small>${o.customer.phone}</small></td>
            <td>GH₵${o.total.toFixed(2)}</td>
            <td><span class="status-badge status-${o.paymentStatus === 'paid' ? 'paid' : 'pending'}">${o.paymentStatus}</span></td>
            <td>
                <select class="order-status-select" data-id="${o.id}">
                    <option value="pending" ${o.orderStatus === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="processing" ${o.orderStatus === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="shipped" ${o.orderStatus === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="delivered" ${o.orderStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="cancelled" ${o.orderStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
            <td><button class="luxury-button outline" style="padding: 2px 10px; font-size: 0.7rem;">Detail</button></td>
        </tr>
    `).join('');

    document.querySelectorAll('.order-status-select').forEach(sel => {
        sel.onchange = async () => {
            await updateOrderStatus(sel.getAttribute('data-id'), sel.value);
            showToast("Status updated", "success");
        };
    });
};

// Form Logic
const setupForms = () => {
    const productForm = document.getElementById('product-form');
    const productModal = document.getElementById('product-modal');
    const closeBtn = document.getElementById('close-modal');

    if (closeBtn) closeBtn.onclick = () => productModal.style.display = 'none';

    productForm.onsubmit = async (e) => {
        e.preventDefault();
        showToast("Saving product...", "info");

        let imageUrl = document.getElementById('p-image-url').value;
        const fileInput = document.getElementById('p-image');

        if (fileInput.files.length > 0) {
            imageUrl = await uploadProductImage(fileInput.files[0]);
        }

        const productData = {
            name: document.getElementById('p-name').value,
            category: document.getElementById('p-category').value,
            price: parseFloat(document.getElementById('p-price').value),
            stock: parseInt(document.getElementById('p-stock').value),
            description: document.getElementById('p-desc').value,
            images: [imageUrl]
        };

        const editId = productForm.getAttribute('data-edit-id');
        await saveProduct(productData, editId);

        showToast("Product saved successfully!", "success");
        productModal.style.display = 'none';
        productForm.removeAttribute('data-edit-id');
        renderProductsView();
    };
};

// Start
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
    setupForms();
});
