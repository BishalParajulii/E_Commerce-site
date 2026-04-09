const tokenInput = document.getElementById("tokenInput");
const saveTokenBtn = document.getElementById("saveTokenBtn");
const loadDataBtn = document.getElementById("loadDataBtn");
const refreshProductsBtn = document.getElementById("refreshProductsBtn");
const clearCartBtn = document.getElementById("clearCartBtn");
const orderForm = document.getElementById("orderForm");
const productsGrid = document.getElementById("productsGrid");
const cartItems = document.getElementById("cartItems");
const cartSummary = document.getElementById("cartSummary");
const myOrdersList = document.getElementById("myOrdersList");
const sellerOrdersList = document.getElementById("sellerOrdersList");
const statusMessage = document.getElementById("statusMessage");
const productSearch = document.getElementById("productSearch");
const searchBtn = document.getElementById("searchBtn");

const storageKey = "orders-ui-token";
const cart = new Map();
const statusChoices = ["pending", "processing", "shipping", "delivered"];
let allProducts = [];

tokenInput.value = localStorage.getItem(storageKey) || "";

function setMessage(message, kind = "success") {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${kind}`;
}

function getToken() {
    return tokenInput.value.trim();
}

async function apiFetch(url, options = {}) {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });
    if (!response.ok) {
        let detail = "Request failed.";
        try {
            const data = await response.json();
            detail = JSON.stringify(data);
        } catch (error) {
            detail = response.statusText || detail;
        }
        throw new Error(detail);
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

function currency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(amount || 0));
}

function getProductInitial(name) {
    return (name || "?").trim().charAt(0).toUpperCase();
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

function renderProducts(products) {
    if (!products.length) {
        productsGrid.innerHTML = '<p class="empty-state">No products match your search.</p>';
        return;
    }

    productsGrid.innerHTML = products
        .map(
            (product) => `
                <article class="product-card">
                    <div class="product-visual">${getProductInitial(product.name)}</div>
                    <div class="product-body">
                        <div>
                            <h3>${product.name}</h3>
                            <p class="product-meta">${product.category || "Uncategorized"} | Seller: ${product.owner}</p>
                        </div>
                        <div class="price-line">${currency(product.price)}</div>
                        <div class="product-top">
                            <span class="pill">Free style listing</span>
                            <span class="product-meta">Stock: ${product.stock ?? "-"}</span>
                        </div>
                        <p class="product-meta">${product.description || "No description available."}</p>
                        <div class="inline-actions">
                            <button type="button" data-product-id="${product.id}" data-product-name="${product.name}">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </article>
            `
        )
        .join("");

    productsGrid.querySelectorAll("[data-product-id]").forEach((button) => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.productId);
            const name = button.dataset.productName;
            const existing = cart.get(id);
            cart.set(id, { product: id, name, quantity: existing ? existing.quantity + 1 : 1 });
            renderCart();
            setMessage(`${name} added to the cart.`);
        });
    });
}

function renderCart() {
    const items = Array.from(cart.values());
    const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);
    cartSummary.textContent = `${totalUnits} item${totalUnits === 1 ? "" : "s"} selected`;

    if (!items.length) {
        cartItems.innerHTML = '<p class="empty-state">Add products from the left to build your order.</p>';
        return;
    }

    cartItems.innerHTML = items
        .map(
            (item) => `
                <div class="cart-row">
                    <div>
                        <strong>${item.name}</strong>
                        <p class="meta-line">Product ID: ${item.product}</p>
                    </div>
                    <div class="inline-actions">
                        <input type="number" min="1" value="${item.quantity}" data-qty-id="${item.product}">
                        <button type="button" class="ghost-btn" data-remove-id="${item.product}">Remove</button>
                    </div>
                </div>
            `
        )
        .join("");

    cartItems.querySelectorAll("[data-qty-id]").forEach((input) => {
        input.addEventListener("input", () => {
            const productId = Number(input.dataset.qtyId);
            const quantity = Math.max(1, Number(input.value || 1));
            const current = cart.get(productId);
            if (current) {
                cart.set(productId, { ...current, quantity });
            }
            cartSummary.textContent = `${Array.from(cart.values()).reduce((sum, item) => sum + item.quantity, 0)} items selected`;
        });
    });

    cartItems.querySelectorAll("[data-remove-id]").forEach((button) => {
        button.addEventListener("click", () => {
            cart.delete(Number(button.dataset.removeId));
            renderCart();
        });
    });
}

function renderOrders(target, orders, sellerMode = false) {
    if (!orders.length) {
        target.innerHTML = '<p class="empty-state">Nothing to show yet.</p>';
        return;
    }

    target.innerHTML = orders
        .map((order) => {
            const itemsMarkup = (order.order_items || [])
                .map(
                    (item) => `
                        <li>
                            ${item.product_name} x ${item.quantity} | ${currency(item.price)}
                            ${item.seller_username ? ` | Seller: ${item.seller_username}` : ""}
                        </li>
                    `
                )
                .join("");

            const updateControls = sellerMode
                ? `
                    <div class="inline-actions">
                        <select data-status-select="${order.id}">
                            ${statusChoices
                                .map(
                                    (choice) => `
                                        <option value="${choice}" ${choice === order.status ? "selected" : ""}>
                                            ${choice}
                                        </option>
                                    `
                                )
                                .join("")}
                        </select>
                        <button type="button" data-status-btn="${order.id}" class="ghost-btn">Update</button>
                    </div>
                `
                : "";

            return `
                <article class="order-card">
                    <div class="order-top">
                        <div>
                            <h3>Order #${order.id}</h3>
                            <p class="order-meta">Customer: ${order.user} | ${new Date(order.created_at).toLocaleString()}</p>
                        </div>
                        <span class="pill">${order.status}</span>
                    </div>
                    <p><strong>Total:</strong> ${currency(order.total_price)}</p>
                    <ol class="order-items">${itemsMarkup}</ol>
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
        setMessage("Data refreshed.");
    } catch (error) {
        setMessage(error.message, "error");
    }
}

function runSearch() {
    renderProducts(filterProducts());
}

saveTokenBtn.addEventListener("click", () => {
    localStorage.setItem(storageKey, getToken());
    setMessage("Token saved in this browser.");
});

loadDataBtn.addEventListener("click", loadAllData);
refreshProductsBtn.addEventListener("click", async () => {
    try {
        await loadProducts();
        setMessage("Products reloaded.");
    } catch (error) {
        setMessage(error.message, "error");
    }
});

searchBtn.addEventListener("click", runSearch);
productSearch.addEventListener("input", runSearch);

clearCartBtn.addEventListener("click", () => {
    cart.clear();
    renderCart();
    setMessage("Order draft cleared.");
});

orderForm.addEventListener("submit", async (event) => {
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
        setMessage("Order created successfully.");
        await loadOrders();
    } catch (error) {
        setMessage(error.message, "error");
    }
});

renderCart();
