const loadDataBtn = document.getElementById("loadDataBtn");
const refreshProductsBtn = document.getElementById("refreshProductsBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const orderForm = document.getElementById("orderForm");
const productsGrid = document.getElementById("productsGrid");
const cartItems = document.getElementById("cartItems");
const cartSummary = document.getElementById("cartSummary");
const cartSubtotal = document.getElementById("cartSubtotal");
const cartCheckoutTotal = document.getElementById("cartCheckoutTotal");
const myOrdersList = document.getElementById("myOrdersList");
const sellerOrdersList = document.getElementById("sellerOrdersList");
const statusMessage = document.getElementById("statusMessage");
const productSearch = document.getElementById("productSearch");
const searchBtn = document.getElementById("searchBtn");
const roleBadge = document.getElementById("roleBadge");
const accountName = document.getElementById("accountName");
const deliveryLine = document.getElementById("deliveryLine");

const storageKey = "orders-ui-token";
const userKey = "orders-ui-user";
const cart = new Map();
const statusChoices = ["pending", "processing", "shipping", "delivered"];
let allProducts = [];

function setMessage(message, kind = "success") {
    if (!statusMessage) {
        return;
    }

    statusMessage.textContent = message;
    statusMessage.className = `status-message ${kind}`;
}

function getToken() {
    return (localStorage.getItem(storageKey) || "").trim();
}

function getUser() {
    try {
        return JSON.parse(localStorage.getItem(userKey) || "null");
    } catch (error) {
        return null;
    }
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function formatError(payload) {
    if (!payload || typeof payload !== "object") {
        return "Request failed.";
    }

    return Object.entries(payload)
        .map(([key, value]) => {
            const normalized = Array.isArray(value) ? value.join(", ") : value;
            return key === "detail" ? normalized : `${key}: ${normalized}`;
        })
        .join(" | ");
}

async function apiFetch(url, options = {}) {
    const token = getToken();
    const headers = {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(formatError(payload) || response.statusText || "Request failed.");
    }

    if (response.status === 204) {
        return null;
    }

    return response.json().catch(() => null);
}

function currency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(amount || 0));
}

function getProductImage(product) {
    return (
        product.image ||
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 220'%3E%3Crect width='300' height='220' fill='%23f3f3f3'/%3E%3Ctext x='50%25' y='50%25' fill='%23666666' font-size='26' font-family='Arial' text-anchor='middle' dominant-baseline='middle'%3EProduct%3C/text%3E%3C/svg%3E"
    );
}

function syncHeaderUser() {
    const user = getUser();
    if (accountName) {
        accountName.textContent = user?.username || "Guest";
    }
    if (roleBadge) {
        roleBadge.textContent = user?.role ? user.role.toUpperCase() : "BROWSE";
    }
    if (deliveryLine) {
        deliveryLine.textContent = user
            ? `Signed in as ${user.username}`
            : "Login to place orders and update seller status";
    }
}

function filterProducts() {
    const query = (productSearch?.value || "").trim().toLowerCase();
    if (!query) {
        return allProducts;
    }

    return allProducts.filter((product) => {
        const haystack = [
            product.name,
            product.description,
            product.owner,
            product.category,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return haystack.includes(query);
    });
}

function addToCart(productId) {
    const product = allProducts.find((entry) => entry.id === productId);
    if (!product) {
        return;
    }

    const existing = cart.get(productId);
    const nextQuantity = Math.min((existing?.quantity || 0) + 1, Number(product.stock || 0) || 1);
    cart.set(productId, {
        product: product.id,
        name: product.name,
        price: Number(product.price || 0),
        seller: product.owner,
        stock: Number(product.stock || 0),
        quantity: nextQuantity,
    });
    renderCart();
    setMessage(`${product.name} added to cart.`);
}

function renderProducts(products) {
    if (!productsGrid) {
        return;
    }

    if (!products.length) {
        productsGrid.innerHTML = '<p class="empty-state">No products match your search.</p>';
        return;
    }

    productsGrid.innerHTML = products
        .map(
            (product) => `
                <article class="product-card">
                    <div class="product-image-wrap">
                        <img src="${escapeHtml(getProductImage(product))}" alt="${escapeHtml(product.name)}">
                    </div>
                    <div class="product-body">
                        <a href="#" class="product-title">${escapeHtml(product.name)}</a>
                        <div class="product-rating">★★★★☆ <span>${escapeHtml(product.category || "General")}</span></div>
                        <div class="product-price">${currency(product.price)}</div>
                        <p class="product-meta">Sold by ${escapeHtml(product.owner || "Marketplace seller")}</p>
                        <p class="product-description">${escapeHtml(product.description || "No description available.")}</p>
                        <div class="product-footer">
                            <span class="stock-line">${Number(product.stock || 0) > 0 ? `In stock: ${product.stock}` : "Out of stock"}</span>
                            <button type="button" data-product-id="${product.id}" ${Number(product.stock || 0) < 1 ? "disabled" : ""}>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </article>
            `
        )
        .join("");

    productsGrid.querySelectorAll("[data-product-id]").forEach((button) => {
        button.addEventListener("click", () => addToCart(Number(button.dataset.productId)));
    });
}

function updateCartTotals() {
    const items = Array.from(cart.values());
    const units = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cartSummary) {
        cartSummary.textContent = `${units} item${units === 1 ? "" : "s"}`;
    }
    if (cartSubtotal) {
        cartSubtotal.textContent = currency(subtotal);
    }
    if (cartCheckoutTotal) {
        cartCheckoutTotal.textContent = currency(subtotal);
    }
}

function renderCart() {
    if (!cartItems) {
        return;
    }

    const items = Array.from(cart.values());
    updateCartTotals();

    if (!items.length) {
        cartItems.innerHTML = '<p class="empty-state">Your cart is empty. Add a few products to place an order.</p>';
        return;
    }

    cartItems.innerHTML = items
        .map(
            (item) => `
                <div class="cart-row">
                    <div class="cart-copy">
                        <strong>${escapeHtml(item.name)}</strong>
                        <p>Seller: ${escapeHtml(item.seller || "Marketplace seller")}</p>
                        <p>${currency(item.price)} each</p>
                    </div>
                    <div class="cart-controls">
                        <input type="number" min="1" max="${item.stock || 1}" value="${item.quantity}" data-qty-id="${item.product}">
                        <span class="line-total">${currency(item.price * item.quantity)}</span>
                        <button type="button" class="ghost-btn" data-remove-id="${item.product}">Delete</button>
                    </div>
                </div>
            `
        )
        .join("");

    cartItems.querySelectorAll("[data-qty-id]").forEach((input) => {
        input.addEventListener("input", () => {
            const productId = Number(input.dataset.qtyId);
            const current = cart.get(productId);
            if (!current) {
                return;
            }

            const quantity = Math.min(
                Math.max(1, Number(input.value || 1)),
                Math.max(1, current.stock || 1)
            );
            cart.set(productId, { ...current, quantity });
            renderCart();
        });
    });

    cartItems.querySelectorAll("[data-remove-id]").forEach((button) => {
        button.addEventListener("click", () => {
            cart.delete(Number(button.dataset.removeId));
            renderCart();
        });
    });
}

function getVisibleOrderItems(order, sellerMode = false) {
    if (!sellerMode) {
        return order.order_items || [];
    }

    const user = getUser();
    return (order.order_items || []).filter((item) => item.seller_id === user?.id);
}

function renderOrders(target, orders, sellerMode = false) {
    if (!target) {
        return;
    }

    if (!orders.length) {
        target.innerHTML = '<p class="empty-state">Nothing to show yet.</p>';
        return;
    }

    target.innerHTML = orders
        .map((order) => {
            const visibleItems = getVisibleOrderItems(order, sellerMode);
            const itemsMarkup = visibleItems
                .map(
                    (item) => `
                        <li>
                            <span>${escapeHtml(item.product_name)} x ${item.quantity}</span>
                            <strong>${currency(item.price)}</strong>
                        </li>
                    `
                )
                .join("");

            const amountLabel = sellerMode ? "Seller total" : "Order total";
            const amountValue = sellerMode ? order.seller_total : order.total_price;
            const itemCount = sellerMode ? order.seller_item_count : visibleItems.reduce((sum, item) => sum + item.quantity, 0);

            const updateControls = sellerMode
                ? `
                    <div class="status-row">
                        <select data-status-select="${order.id}">
                            ${statusChoices
                                .map(
                                    (choice) => `
                                        <option value="${choice}" ${choice === order.status ? "selected" : ""}>${choice}</option>
                                    `
                                )
                                .join("")}
                        </select>
                        <button type="button" data-status-btn="${order.id}" class="ghost-btn">Update status</button>
                    </div>
                `
                : "";

            return `
                <article class="order-card">
                    <div class="order-header">
                        <div>
                            <p class="order-eyebrow">Order #${order.id}</p>
                            <h3>${sellerMode ? `Customer: ${escapeHtml(order.user)}` : "Placed successfully"}</h3>
                        </div>
                        <span class="status-pill">${escapeHtml(order.status)}</span>
                    </div>
                    <div class="order-summary-row">
                        <div>
                            <span class="label">Placed on</span>
                            <strong>${new Date(order.created_at).toLocaleString()}</strong>
                        </div>
                        <div>
                            <span class="label">Items</span>
                            <strong>${itemCount}</strong>
                        </div>
                        <div>
                            <span class="label">${amountLabel}</span>
                            <strong>${currency(amountValue)}</strong>
                        </div>
                    </div>
                    <ul class="order-items">${itemsMarkup || '<li><span>No matching items for this seller.</span><strong>-</strong></li>'}</ul>
                    ${updateControls}
                </article>
            `;
        })
        .join("");

    if (sellerMode) {
        target.querySelectorAll("[data-status-btn]").forEach((button) => {
            button.addEventListener("click", async () => {
                const orderId = Number(button.dataset.statusBtn);
                const select = target.querySelector(`[data-status-select="${orderId}"]`);
                try {
                    await apiFetch(`/orders/update/${orderId}/`, {
                        method: "PATCH",
                        body: JSON.stringify({ status: select.value }),
                    });
                    setMessage(`Order #${orderId} updated to ${select.value}.`);
                    await loadOrders();
                } catch (error) {
                    setMessage(error.message, "error");
                }
            });
        });
    }
}

async function loadProducts() {
    allProducts = await apiFetch("/products/");
    renderProducts(filterProducts());
}

async function loadOrders() {
    const [myOrders, sellerOrders] = await Promise.all([
        apiFetch("/orders/my-orders/"),
        apiFetch("/orders/seller-orders/"),
    ]);

    renderOrders(myOrdersList, myOrders);
    renderOrders(sellerOrdersList, sellerOrders, true);
}

async function loadAllData() {
    try {
        setMessage("Loading products and orders...");
        await Promise.all([loadProducts(), loadOrders()]);
        setMessage("Storefront refreshed.");
    } catch (error) {
        setMessage(error.message, "error");
    }
}

function runSearch() {
    renderProducts(filterProducts());
}

loadDataBtn?.addEventListener("click", loadAllData);
refreshProductsBtn?.addEventListener("click", async () => {
    try {
        await loadProducts();
        setMessage("Products reloaded.");
    } catch (error) {
        setMessage(error.message, "error");
    }
});

searchBtn?.addEventListener("click", runSearch);
productSearch?.addEventListener("input", runSearch);

clearCartBtn?.addEventListener("click", () => {
    cart.clear();
    renderCart();
    setMessage("Cart cleared.");
});

orderForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const items = Array.from(cart.values()).map(({ product, quantity }) => ({ product, quantity }));

    if (!items.length) {
        setMessage("Add at least one product before placing an order.", "error");
        return;
    }

    try {
        await apiFetch("/orders/create/", {
            method: "POST",
            body: JSON.stringify({ items }),
        });
        cart.clear();
        renderCart();
        await loadAllData();
        setMessage("Order placed successfully.");
    } catch (error) {
        setMessage(error.message, "error");
    }
});

syncHeaderUser();
renderCart();

if (getToken()) {
    loadAllData();
} else {
    setMessage("Login to load products, place orders, and manage seller updates.", "error");
}
