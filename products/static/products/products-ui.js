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

const storageKey = "orders-ui-token";
let allProducts = [];

function setMessage(message, kind = "success") {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${kind}`;
}

function getToken() {
    return (localStorage.getItem(storageKey) || "").trim();
}

async function apiFetch(url) {
    const token = getToken();
    const response = await fetch(url, {
        headers: {
            Authorization: token ? `Bearer ${token}` : "",
        },
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(JSON.stringify(payload || { detail: "Request failed." }));
    }

    return payload;
}

function currency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(Number(amount || 0));
}

function productInitial(name) {
    return (name || "?").trim().charAt(0).toUpperCase();
}

function filteredProducts() {
    const query = (productSearch.value || "").trim().toLowerCase();
    const seller = (ownerFilter.value || "").trim().toLowerCase();
    const sort = sortSelect.value;

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
    resultsMeta.textContent = `${products.length} product${products.length === 1 ? "" : "s"} loaded`;

    if (!products.length) {
        productsGrid.innerHTML = '<p class="empty-state">No products match the current filters.</p>';
        return;
    }

    productsGrid.innerHTML = products
        .map(
            (product) => `
                <article class="product-card">
                    <div class="product-visual">${productInitial(product.name)}</div>
                    <div class="product-body">
                        <div>
                            <h3>${product.name}</h3>
                            <p class="product-meta">${product.category || "Uncategorized"} | Seller: ${product.owner}</p>
                        </div>
                        <div class="price-line">${currency(product.price)}</div>
                        <div class="pill">Stock: ${product.stock ?? "-"}</div>
                        <p class="product-meta">${product.description || "No description available."}</p>
                    </div>
                </article>
            `
        )
        .join("");
}

function applyFilters() {
    renderProducts(filteredProducts());
}

async function loadProducts() {
    try {
        setMessage("Loading products...");
        allProducts = await apiFetch("/products/");
        applyFilters();
        setMessage("Products loaded.");
    } catch (error) {
        setMessage(error.message, "error");
        productsGrid.innerHTML = '<p class="empty-state">Login is required before products can be shown.</p>';
    }
}

loadProductsBtn.addEventListener("click", loadProducts);
searchBtn.addEventListener("click", applyFilters);
applyFiltersBtn.addEventListener("click", applyFilters);
productSearch.addEventListener("input", applyFilters);

resetFiltersBtn.addEventListener("click", () => {
    productSearch.value = "";
    ownerFilter.value = "";
    sortSelect.value = "";
    applyFilters();
});

if (getToken()) {
    loadProducts();
}
