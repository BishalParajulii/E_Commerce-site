const loadProductsBtn = document.getElementById("loadProductsBtn");
const searchBtn = document.getElementById("searchBtn");
const productSearch = document.getElementById("productSearch");
const sortSelect = document.getElementById("sortSelect");
const ownerFilter = document.getElementById("ownerFilter");
const applyFiltersBtn = document.getElementById("applyFiltersBtn");
const resetFiltersBtn = document.getElementById("resetFiltersBtn");
const productsGrid = document.getElementById("productsGrid");
const resultsMeta = document.getElementById("resultsMeta");
const statusMessage = document.getElementById("statusMessage");
const accountName = document.getElementById("accountName");

const storageKey = "orders-ui-token";
const userKey = "orders-ui-user";
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

function getProductImage(product) {
    return (
        product.image ||
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 220'%3E%3Crect width='300' height='220' fill='%23f3f3f3'/%3E%3Ctext x='50%25' y='50%25' fill='%23666666' font-size='26' font-family='Arial' text-anchor='middle' dominant-baseline='middle'%3EProduct%3C/text%3E%3C/svg%3E"
    );
}

async function apiFetch(url) {
    const token = getToken();
    const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        const detail = Object.entries(payload)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join(" | ");
        throw new Error(detail || "Request failed.");
    }

    return payload;
}

function currency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(amount || 0));
}

function filteredProducts() {
    const query = (productSearch?.value || "").trim().toLowerCase();
    const seller = (ownerFilter?.value || "").trim().toLowerCase();
    const sort = sortSelect?.value || "";

    let products = [...allProducts].filter((product) => {
        const haystack = [
            product.name,
            product.description,
            product.owner,
            product.category,
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const sellerName = (product.owner || "").toLowerCase();
        return (!query || haystack.includes(query)) && (!seller || sellerName.includes(seller));
    });

    if (sort === "price-low") {
        products.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-high") {
        products.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "latest") {
        products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return products;
}

function renderProducts(products) {
    if (!productsGrid) {
        return;
    }

    if (resultsMeta) {
        resultsMeta.textContent = `${products.length} result${products.length === 1 ? "" : "s"}`;
    }

    if (!products.length) {
        productsGrid.innerHTML = '<p class="empty-state">No products match the current filters.</p>';
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
                        <div class="stock-row">
                            <span>${Number(product.stock || 0) > 0 ? "In Stock" : "Out of Stock"}</span>
                            <span>${product.stock ?? 0} available</span>
                        </div>
                    </div>
                </article>
            `
        )
        .join("");
}

function applyFilters() {
    renderProducts(filteredProducts());
}

function syncUser() {
    const user = getUser();
    if (accountName) {
        accountName.textContent = user?.username || "Guest";
    }
}

async function loadProducts() {
    try {
        setMessage("Loading products...");
        allProducts = await apiFetch("/products/");
        applyFilters();
        setMessage("Products loaded.");
    } catch (error) {
        setMessage(error.message, "error");
        if (productsGrid) {
            productsGrid.innerHTML = '<p class="empty-state">Login is required before products can be shown.</p>';
        }
    }
}

loadProductsBtn?.addEventListener("click", loadProducts);
searchBtn?.addEventListener("click", applyFilters);
applyFiltersBtn?.addEventListener("click", applyFilters);
productSearch?.addEventListener("input", applyFilters);
ownerFilter?.addEventListener("input", applyFilters);
sortSelect?.addEventListener("change", applyFilters);

resetFiltersBtn?.addEventListener("click", () => {
    if (productSearch) {
        productSearch.value = "";
    }
    if (ownerFilter) {
        ownerFilter.value = "";
    }
    if (sortSelect) {
        sortSelect.value = "";
    }
    applyFilters();
});

syncUser();

if (getToken()) {
    loadProducts();
}
