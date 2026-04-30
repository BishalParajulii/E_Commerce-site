(function() {
const storageKey = "orders-ui-token";
const cartKey = "shoplane-cart";
const wishlistKey = "shoplane-wishlist";
const freeShippingThreshold = 500;

const colorMap = {
    Black: "#0A0A0A",
    Obsidian: "#0A0A0A",
    Ivory: "#F5F0E8",
    Gold: "#D4A853",
    Sage: "#7A8069",
    Clay: "#A8684A",
    Silver: "#BFC2C4",
    Amber: "#B77B3A",
};

const fallbackProducts = [
    {
        id: "luxe-1",
        brand: "TimeCraft",
        name: "Everyday Analog Watch",
        category: "Accessories",
        price: 420,
        originalPrice: 520,
        rating: 4.9,
        reviews: 128,
        badge: "Bestseller",
        stock: 3,
        sku: "SL-AX104",
        colors: ["Obsidian", "Gold"],
        sizes: [{ label: "OS", inStock: true }],
        description: "A durable everyday watch with a clean face, stainless case, and comfortable strap.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=82",
        hoverImage: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=82",
        gallery: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&w=1200&q=84",
        ],
        created_at: "2026-04-18T12:00:00Z",
    },
    {
        id: "luxe-2",
        brand: "SoundPro",
        name: "Wireless Over-Ear Headphones",
        category: "Tech",
        price: 360,
        originalPrice: 440,
        rating: 4.8,
        reviews: 94,
        badge: "New",
        stock: 8,
        sku: "SL-AW228",
        colors: ["Black", "Silver"],
        sizes: [{ label: "OS", inStock: true }],
        description: "Wireless headphones with cushioned ear cups, clear sound, and long battery life.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=82",
        hoverImage: "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=900&q=82",
        gallery: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1200&q=84",
        ],
        created_at: "2026-04-22T12:00:00Z",
    },
    {
        id: "luxe-3",
        brand: "StepLite",
        name: "Lightweight Running Shoes",
        category: "Footwear",
        price: 240,
        originalPrice: 310,
        rating: 4.7,
        reviews: 211,
        badge: "Sale",
        stock: 11,
        sku: "SL-LF511",
        colors: ["Ivory", "Black"],
        sizes: [
            { label: "S", inStock: true },
            { label: "M", inStock: true },
            { label: "L", inStock: false },
        ],
        description: "Comfortable running shoes with lightweight support for daily walking and workouts.",
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=82",
        hoverImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=900&q=82",
        gallery: [
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=84",
        ],
        created_at: "2026-03-28T12:00:00Z",
    },
    {
        id: "luxe-4",
        brand: "GlowLab",
        name: "Skin Care Starter Set",
        category: "Beauty",
        price: 188,
        originalPrice: 228,
        rating: 4.9,
        reviews: 77,
        badge: "New",
        stock: 5,
        sku: "SL-MV031",
        colors: ["Ivory", "Gold"],
        sizes: [{ label: "OS", inStock: true }],
        description: "A simple skin care set with cleanser, serum, and moisturizer for daily use.",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=82",
        hoverImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=82",
        gallery: [
            "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&w=1200&q=84",
        ],
        created_at: "2026-04-11T12:00:00Z",
    },
    {
        id: "luxe-5",
        brand: "DailyWear",
        name: "All-Weather Travel Coat",
        category: "Apparel",
        price: 680,
        originalPrice: 820,
        rating: 4.8,
        reviews: 63,
        badge: "Low Stock",
        stock: 2,
        sku: "SL-AN882",
        colors: ["Sage", "Black"],
        sizes: [
            { label: "XS", inStock: true },
            { label: "S", inStock: true },
            { label: "M", inStock: false },
            { label: "L", inStock: true },
        ],
        description: "A lightweight coat for travel, commuting, and changing weather.",
        image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=900&q=82",
        hoverImage: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=900&q=82",
        gallery: [
            "https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=84",
        ],
        created_at: "2026-02-20T12:00:00Z",
    },
    {
        id: "luxe-6",
        brand: "CarryCo",
        name: "Daily Carry Tote Bag",
        category: "Accessories",
        price: 540,
        originalPrice: 640,
        rating: 4.9,
        reviews: 142,
        badge: "Bestseller",
        stock: 6,
        sku: "SL-MV714",
        colors: ["Clay", "Black"],
        sizes: [{ label: "OS", inStock: true }],
        description: "A roomy tote bag for work, errands, and daily essentials.",
        image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=82",
        hoverImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=82",
        gallery: [
            "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=84",
        ],
        created_at: "2026-04-02T12:00:00Z",
    },
    {
        id: "luxe-7",
        brand: "FotoMax",
        name: "Compact Mirrorless Camera",
        category: "Tech",
        price: 890,
        originalPrice: 980,
        rating: 4.6,
        reviews: 41,
        badge: "New",
        stock: 4,
        sku: "SL-AW901",
        colors: ["Silver", "Black"],
        sizes: [{ label: "OS", inStock: true }],
        description: "A compact camera body for travel photos, content creation, and everyday shooting.",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=82",
        hoverImage: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=900&q=82",
        gallery: [
            "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=1200&q=84",
        ],
        created_at: "2026-04-25T12:00:00Z",
    },
    {
        id: "luxe-8",
        brand: "StyleLine",
        name: "Satin Midi Dress",
        category: "Apparel",
        price: 320,
        originalPrice: 390,
        rating: 4.8,
        reviews: 58,
        badge: "Sale",
        stock: 7,
        sku: "SL-LF320",
        colors: ["Ivory", "Sage"],
        sizes: [
            { label: "XS", inStock: true },
            { label: "S", inStock: true },
            { label: "M", inStock: true },
            { label: "L", inStock: false },
        ],
        description: "A satin midi dress with a simple fit for dinners, events, and everyday styling.",
        image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=82",
        hoverImage: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=82",
        gallery: [
            "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=84",
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=84",
        ],
        created_at: "2026-03-15T12:00:00Z",
    },
];

const dom = {
    productSearch: document.getElementById("productSearch"),
    sortSelect: document.getElementById("sortSelect"),
    resetFiltersBtn: document.getElementById("resetFiltersBtn"),
    productsGrid: document.getElementById("productsGrid"),
    resultsMeta: document.getElementById("resultsMeta"),
    activeFilters: document.getElementById("activeFilters"),
    statusMessage: document.getElementById("statusMessage"),
    priceRange: document.getElementById("priceRange"),
    priceRangeValue: document.getElementById("priceRangeValue"),
    mobileMenu: document.getElementById("mobileMenu"),
    mobileMenuOpen: document.getElementById("mobileMenuOpen"),
    mobileMenuClose: document.getElementById("mobileMenuClose"),
    cartOpenBtn: document.getElementById("cartOpenBtn"),
    cartCloseBtn: document.getElementById("cartCloseBtn"),
    cartDrawer: document.getElementById("cartDrawer"),
    drawerScrim: document.getElementById("drawerScrim"),
    cartCount: document.getElementById("cartCount"),
    cartItems: document.getElementById("cartItems"),
    cartSubtotal: document.getElementById("cartSubtotal"),
    cartShipping: document.getElementById("cartShipping"),
    checkoutBtn: document.getElementById("checkoutBtn"),
    shippingProgress: document.getElementById("shippingProgress"),
    shippingProgressText: document.getElementById("shippingProgressText"),
    recommendationList: document.getElementById("recommendationList"),
    mainProductImage: document.getElementById("mainProductImage"),
    thumbnailRail: document.getElementById("thumbnailRail"),
    detailCrumb: document.getElementById("detailCrumb"),
    detailBrand: document.getElementById("detailBrand"),
    detailTitle: document.getElementById("detailTitle"),
    detailSku: document.getElementById("detailSku"),
    detailRating: document.getElementById("detailRating"),
    detailPrice: document.getElementById("detailPrice"),
    detailOriginalPrice: document.getElementById("detailOriginalPrice"),
    detailSavings: document.getElementById("detailSavings"),
    detailDescription: document.getElementById("detailDescription"),
    detailColors: document.getElementById("detailColors"),
    detailSizes: document.getElementById("detailSizes"),
    selectedColor: document.getElementById("selectedColor"),
    selectedSize: document.getElementById("selectedSize"),
    stockUrgency: document.getElementById("stockUrgency"),
    quantityValue: document.getElementById("quantityValue"),
    qtyMinus: document.getElementById("qtyMinus"),
    qtyPlus: document.getElementById("qtyPlus"),
    addToCartBtn: document.getElementById("addToCartBtn"),
    buyNowBtn: document.getElementById("buyNowBtn"),
    detailWishlistBtn: document.getElementById("detailWishlistBtn"),
    shareBtn: document.getElementById("shareBtn"),
    accordionDescription: document.getElementById("accordionDescription"),
    stickyAddBar: document.getElementById("stickyAddBar"),
    stickyAddBtn: document.getElementById("stickyAddBtn"),
    stickyProductName: document.getElementById("stickyProductName"),
    stickyProductPrice: document.getElementById("stickyProductPrice"),
    checkoutItems: document.getElementById("checkoutItems"),
    checkoutSubtotal: document.getElementById("checkoutSubtotal"),
    checkoutShipping: document.getElementById("checkoutShipping"),
    checkoutTotal: document.getElementById("checkoutTotal"),
    cardNumber: document.getElementById("cardNumber"),
    cardExpiry: document.getElementById("cardExpiry"),
};

let allProducts = fallbackProducts.map((product) => ({ ...product }));
let cart = loadJson(cartKey, []);
let wishlist = new Set(loadJson(wishlistKey, []));
let currentProduct = allProducts[0];
let quantity = 1;
let selectedColor = currentProduct.colors[0];
let selectedSize = firstAvailableSize(currentProduct);
let selectedColors = new Set();
let selectedSizes = new Set();
let revealObserver = null;

function loadJson(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || "null");
        return value ?? fallback;
    } catch (error) {
        return fallback;
    }
}

function saveJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function getToken() {
    return (localStorage.getItem(storageKey) || "").trim();
}

function setMessage(message, kind = "success") {
    if (!dom.statusMessage) {
        return;
    }
    dom.statusMessage.textContent = message;
    dom.statusMessage.className = `status-message ${kind}`;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function escapeSelectorValue(value) {
    return String(value ?? "").replaceAll("\\", "\\\\").replaceAll('"', '\\"');
}

function currency(amount) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));
}

function percentOff(price, originalPrice) {
    if (!originalPrice || Number(originalPrice) <= Number(price)) {
        return 0;
    }
    return Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100);
}

function imageUrl(value) {
    if (!value) {
        return fallbackProducts[0].image;
    }
    if (String(value).startsWith("http") || String(value).startsWith("/") || String(value).startsWith("data:")) {
        return value;
    }
    return `/media/${value}`;
}

async function apiFetch(url) {
    const response = await fetch(url, {
        headers: getToken() ? { Authorization: `Bearer ${getToken()}` } : {},
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

function normalizeProduct(product, index) {
    const base = fallbackProducts[index % fallbackProducts.length];
    const price = Number(product.price ?? base.price);
    const stock = Number(product.stock ?? base.stock);
    const category = typeof product.category === "string" ? product.category : base.category;

    return {
        ...base,
        id: product.id ?? base.id,
        brand: product.owner || base.brand,
        name: product.name || base.name,
        category: category || base.category,
        price,
        originalPrice: product.originalPrice || Math.round(price * 1.18),
        stock,
        badge: stock <= 3 ? "Low Stock" : base.badge,
        sku: product.slug ? `SL-${String(product.slug).slice(0, 8).toUpperCase()}` : base.sku,
        description: product.description || base.description,
        image: imageUrl(product.image || base.image),
        hoverImage: imageUrl(product.hoverImage || base.hoverImage),
        gallery: base.gallery.map(imageUrl),
        created_at: product.created_at || base.created_at,
    };
}

function firstAvailableSize(product) {
    const sizes = product.sizes || [];
    const selected = sizes.find((size) => (typeof size === "string" ? true : size.inStock !== false));
    return typeof selected === "string" ? selected : selected?.label || "OS";
}

function getCheckedValues(name) {
    return [...document.querySelectorAll(`input[name="${name}"]:checked`)]
        .map((input) => input.value)
        .filter(Boolean);
}

function getFilters() {
    return {
        query: (dom.productSearch?.value || "").trim().toLowerCase(),
        categories: getCheckedValues("category"),
        brands: getCheckedValues("brand"),
        maxPrice: Number(dom.priceRange?.value || 900),
        colors: [...selectedColors],
        sizes: [...selectedSizes],
        minRating: Number(document.querySelector('input[name="rating"]:checked')?.value || 0),
        sort: dom.sortSelect?.value || "",
    };
}

function filteredProducts() {
    const filters = getFilters();

    const products = allProducts.filter((product) => {
        const haystack = [product.name, product.brand, product.category, product.description].join(" ").toLowerCase();
        const sizeLabels = (product.sizes || []).map((size) => (typeof size === "string" ? size : size.label));

        return (
            (!filters.query || haystack.includes(filters.query)) &&
            (!filters.categories.length || filters.categories.includes(product.category)) &&
            (!filters.brands.length || filters.brands.includes(product.brand)) &&
            Number(product.price) <= filters.maxPrice &&
            (!filters.colors.length || filters.colors.some((color) => product.colors.includes(color))) &&
            (!filters.sizes.length || filters.sizes.some((size) => sizeLabels.includes(size))) &&
            (!filters.minRating || Number(product.rating) >= filters.minRating)
        );
    });

    if (filters.sort === "price-low") {
        products.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (filters.sort === "price-high") {
        products.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (filters.sort === "newest") {
        products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (filters.sort === "rating") {
        products.sort((a, b) => Number(b.rating) - Number(a.rating));
    }

    return products;
}

function renderActiveFilters() {
    if (!dom.activeFilters) {
        return;
    }

    const filters = getFilters();
    const pills = [];

    if (filters.query) {
        pills.push({ type: "search", label: `Search: ${filters.query}` });
    }
    filters.categories.forEach((value) => pills.push({ type: "category", value, label: value }));
    filters.brands.forEach((value) => pills.push({ type: "brand", value, label: value }));
    filters.colors.forEach((value) => pills.push({ type: "color", value, label: value }));
    filters.sizes.forEach((value) => pills.push({ type: "size", value, label: value }));
    if (filters.maxPrice < Number(dom.priceRange?.max || 900)) {
        pills.push({ type: "price", label: `Under ${currency(filters.maxPrice)}` });
    }
    if (filters.minRating) {
        pills.push({ type: "rating", label: `${filters.minRating}+ stars` });
    }

    dom.activeFilters.innerHTML = pills
        .map(
            (pill) => `
                <span class="filter-pill">
                    ${escapeHtml(pill.label)}
                    <button type="button" aria-label="Remove ${escapeHtml(pill.label)}" data-filter-type="${escapeHtml(pill.type)}" data-filter-value="${escapeHtml(pill.value || "")}">×</button>
                </span>
            `
        )
        .join("");
}

function renderProducts(products) {
    if (!dom.productsGrid) {
        return;
    }

    if (dom.resultsMeta) {
        dom.resultsMeta.textContent = `Showing ${products.length} product${products.length === 1 ? "" : "s"}`;
    }

    renderActiveFilters();

    if (!products.length) {
        dom.productsGrid.innerHTML = '<p class="empty-state">No products match the current filters.</p>';
        return;
    }

    dom.productsGrid.innerHTML = products
        .map((product, index) => {
            const saved = wishlist.has(String(product.id));
            const discount = percentOff(product.price, product.originalPrice);
            return `
                <article class="product-card reveal-product" style="--reveal-index:${index}">
                    <div class="product-media">
                        <span class="product-badge">${escapeHtml(product.badge)}</span>
                        <button class="wishlist-toggle ${saved ? "active" : ""}" type="button" aria-label="Toggle wishlist" data-product-id="${escapeHtml(product.id)}">${saved ? "♥" : "♡"}</button>
                        <img class="primary-image" src="${escapeHtml(imageUrl(product.image))}" alt="${escapeHtml(product.name)}" loading="lazy">
                        <img class="secondary-image" src="${escapeHtml(imageUrl(product.hoverImage))}" alt="" loading="lazy" aria-hidden="true">
                        <button class="quick-add" type="button" data-product-id="${escapeHtml(product.id)}">Quick Add</button>
                    </div>
                    <div class="product-info">
                        <span class="brand-name">${escapeHtml(product.brand)}</span>
                        <button class="product-title" type="button" data-view-product="${escapeHtml(product.id)}">${escapeHtml(product.name)}</button>
                        <div class="rating-row">★★★★★ <span>${escapeHtml(product.rating)} (${escapeHtml(product.reviews)})</span></div>
                        <div class="price-row">
                            <strong>${currency(product.price)}</strong>
                            ${discount ? `<s>${currency(product.originalPrice)}</s>` : ""}
                        </div>
                        <div class="product-colors" aria-label="Available colors">
                            ${product.colors
                                .map((color) => `<span class="mini-swatch" style="--swatch:${escapeHtml(colorMap[color] || colorMap.Black)}" title="${escapeHtml(color)}"></span>`)
                                .join("")}
                        </div>
                    </div>
                </article>
            `;
        })
        .join("");

    bindProductImageLoading();
    observeProducts();
}

function applyFilters() {
    renderProducts(filteredProducts());
}

function resetFilters() {
    document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach((input) => {
        input.checked = false;
    });
    if (dom.productSearch) {
        dom.productSearch.value = "";
    }
    if (dom.sortSelect) {
        dom.sortSelect.value = "";
    }
    if (dom.priceRange) {
        dom.priceRange.value = dom.priceRange.max;
    }
    selectedColors.clear();
    selectedSizes.clear();
    document.querySelectorAll(".swatch-filter, .size-filter-group button").forEach((node) => node.classList.remove("active"));
    updatePriceRangeLabel();
    applyFilters();
}

function removeFilter(type, value) {
    if (type === "search" && dom.productSearch) {
        dom.productSearch.value = "";
    }
    if (type === "category" || type === "brand") {
        document.querySelectorAll(`input[name="${type}"]`).forEach((input) => {
            if (input.value === value) {
                input.checked = false;
            }
        });
    }
    if (type === "color") {
        selectedColors.delete(value);
        document.querySelector(`.swatch-filter[data-color="${escapeSelectorValue(value)}"]`)?.classList.remove("active");
    }
    if (type === "size") {
        selectedSizes.delete(value);
        document.querySelector(`.size-filter-group button[data-size="${escapeSelectorValue(value)}"]`)?.classList.remove("active");
    }
    if (type === "price" && dom.priceRange) {
        dom.priceRange.value = dom.priceRange.max;
        updatePriceRangeLabel();
    }
    if (type === "rating") {
        document.querySelectorAll('input[name="rating"]').forEach((input) => {
            input.checked = false;
        });
    }
    applyFilters();
}

function updatePriceRangeLabel() {
    if (dom.priceRangeValue && dom.priceRange) {
        dom.priceRangeValue.textContent = currency(dom.priceRange.value);
    }
}

function selectCategory(category) {
    document.querySelectorAll('input[name="category"]').forEach((input) => {
        input.checked = input.value === category;
    });
    applyFilters();
}

function findProduct(productId) {
    return allProducts.find((product) => String(product.id) === String(productId)) || fallbackProducts[0];
}

function renderDetail(product) {
    currentProduct = product;
    quantity = 1;
    selectedColor = product.colors[0] || "Obsidian";
    selectedSize = firstAvailableSize(product);
    const discount = percentOff(product.price, product.originalPrice);
    const gallery = [...new Set([product.image, product.hoverImage, ...(product.gallery || [])])].slice(0, 4);

    dom.detailCrumb.textContent = product.name;
    dom.detailBrand.textContent = product.brand;
    dom.detailTitle.textContent = product.name;
    dom.detailSku.textContent = product.sku;
    dom.detailRating.innerHTML = `★★★★★ <span>${escapeHtml(product.rating)} (${escapeHtml(product.reviews)} reviews)</span>`;
    dom.detailPrice.textContent = currency(product.price);
    dom.detailOriginalPrice.textContent = currency(product.originalPrice);
    dom.detailSavings.textContent = discount ? `Save ${discount}%` : "Member price";
    dom.detailDescription.textContent = product.description;
    dom.accordionDescription.textContent = product.description;
    dom.stockUrgency.textContent = Number(product.stock) <= 3 ? `Only ${product.stock} left in stock` : `${product.stock} available`;
    dom.quantityValue.textContent = String(quantity);
    dom.selectedColor.textContent = selectedColor;
    dom.selectedSize.textContent = selectedSize;
    dom.stickyProductName.textContent = product.name;
    dom.stickyProductPrice.textContent = currency(product.price);
    dom.mainProductImage.src = imageUrl(gallery[0]);
    dom.mainProductImage.alt = product.name;

    dom.thumbnailRail.innerHTML = gallery
        .map(
            (image, index) => `
                <button type="button" class="${index === 0 ? "active" : ""}" data-thumbnail="${escapeHtml(imageUrl(image))}" aria-label="View product image ${index + 1}">
                    <img src="${escapeHtml(imageUrl(image))}" alt="">
                </button>
            `
        )
        .join("");

    dom.detailColors.innerHTML = product.colors
        .map(
            (color, index) => `
                <button class="${index === 0 ? "active" : ""}" type="button" data-detail-color="${escapeHtml(color)}" style="--swatch:${escapeHtml(colorMap[color] || colorMap.Black)}" aria-label="${escapeHtml(color)}"></button>
            `
        )
        .join("");

    dom.detailSizes.innerHTML = (product.sizes || [{ label: "OS", inStock: true }])
        .map((size) => {
            const label = typeof size === "string" ? size : size.label;
            const inStock = typeof size === "string" ? true : size.inStock !== false;
            return `<button class="${label === selectedSize ? "active" : ""} ${inStock ? "" : "out"}" type="button" data-detail-size="${escapeHtml(label)}" ${inStock ? "" : "disabled"}>${escapeHtml(label)}</button>`;
        })
        .join("");

    dom.detailWishlistBtn.textContent = `${wishlist.has(String(product.id)) ? "♥" : "♡"} Wishlist`;
}

function addToCart(product = currentProduct, amount = quantity, open = true) {
    const color = selectedColor || product.colors[0] || "Obsidian";
    const size = selectedSize || firstAvailableSize(product);
    const key = `${product.id}-${color}-${size}`;
    const existing = cart.find((item) => item.key === key);

    if (existing) {
        existing.quantity += amount;
    } else {
        cart.push({
            key,
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: Number(product.price),
            image: imageUrl(product.image),
            color,
            size,
            quantity: amount,
        });
    }

    renderCart();
    saveJson(cartKey, cart);
    setMessage(`${product.name} added to cart.`);
    if (open) {
        openCart();
    }
}

function cartSubtotal() {
    return cart.reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);
}

function drawerShipping(subtotal) {
    if (!subtotal || subtotal >= freeShippingThreshold) {
        return 0;
    }
    return 18;
}

function checkoutShipping(subtotal) {
    if (!subtotal) {
        return 0;
    }
    const selected = document.querySelector('input[name="shipping"]:checked');
    return Number(selected?.value || 0);
}

function renderCart() {
    const subtotal = cartSubtotal();
    const shipping = drawerShipping(subtotal);
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const remaining = Math.max(freeShippingThreshold - subtotal, 0);
    const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);

    if (dom.cartCount) {
        dom.cartCount.textContent = String(count);
        dom.cartCount.classList.add("bump");
        window.setTimeout(() => dom.cartCount.classList.remove("bump"), 320);
    }

    if (dom.cartItems) {
        dom.cartItems.innerHTML = cart.length
            ? cart
                  .map(
                      (item) => `
                        <article class="cart-item">
                            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
                            <div>
                                <h3>${escapeHtml(item.name)}</h3>
                                <p>${escapeHtml(item.color)} · ${escapeHtml(item.size)}</p>
                                <div class="cart-item-actions">
                                    <div class="mini-stepper">
                                        <button type="button" data-cart-action="decrease" data-cart-key="${escapeHtml(item.key)}" aria-label="Decrease quantity">−</button>
                                        <span>${escapeHtml(item.quantity)}</span>
                                        <button type="button" data-cart-action="increase" data-cart-key="${escapeHtml(item.key)}" aria-label="Increase quantity">+</button>
                                    </div>
                                    <strong>${currency(item.price * item.quantity)}</strong>
                                    <button class="remove-item" type="button" data-cart-action="remove" data-cart-key="${escapeHtml(item.key)}">Remove</button>
                                </div>
                            </div>
                        </article>
                    `
                  )
                  .join("")
            : '<p class="empty-state">Your cart is ready for the first piece.</p>';
    }

    if (dom.cartSubtotal) {
        dom.cartSubtotal.textContent = currency(subtotal);
    }
    if (dom.cartShipping) {
        dom.cartShipping.textContent = shipping ? currency(shipping) : "Free";
    }
    if (dom.shippingProgress) {
        dom.shippingProgress.style.width = `${progress}%`;
    }
    if (dom.shippingProgressText) {
        dom.shippingProgressText.textContent = remaining ? `Add ${currency(remaining)} more for free shipping` : "Free shipping unlocked";
    }

    renderRecommendations();
    renderCheckoutSummary();
}

function renderRecommendations() {
    if (!dom.recommendationList) {
        return;
    }
    const cartIds = new Set(cart.map((item) => String(item.id)));
    const products = allProducts.filter((product) => !cartIds.has(String(product.id))).slice(0, 2);

    dom.recommendationList.innerHTML = products
        .map(
            (product) => `
                <article class="recommendation-card">
                    <img src="${escapeHtml(imageUrl(product.image))}" alt="${escapeHtml(product.name)}">
                    <div>
                        <h3>${escapeHtml(product.name)}</h3>
                        <p>${currency(product.price)}</p>
                    </div>
                    <button type="button" data-recommendation-id="${escapeHtml(product.id)}">Add</button>
                </article>
            `
        )
        .join("");
}

function renderCheckoutSummary() {
    const subtotal = cartSubtotal();
    const shipping = checkoutShipping(subtotal);

    if (dom.checkoutItems) {
        dom.checkoutItems.innerHTML = cart.length
            ? cart
                  .map(
                      (item) => `
                    <article class="checkout-item">
                        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
                        <div>
                            <h3>${escapeHtml(item.name)}</h3>
                            <p>${escapeHtml(item.quantity)} × ${currency(item.price)}</p>
                        </div>
                    </article>
                `
                  )
                  .join("")
            : '<p>Your bag is empty.</p>';
    }

    dom.checkoutSubtotal.textContent = currency(subtotal);
    dom.checkoutShipping.textContent = shipping ? currency(shipping) : "Free";
    dom.checkoutTotal.textContent = currency(subtotal + shipping);
}

function handleCartAction(action, key) {
    const item = cart.find((entry) => entry.key === key);
    if (!item) {
        return;
    }

    if (action === "increase") {
        item.quantity += 1;
    } else if (action === "decrease") {
        item.quantity -= 1;
        if (item.quantity <= 0) {
            cart = cart.filter((entry) => entry.key !== key);
        }
    } else if (action === "remove") {
        cart = cart.filter((entry) => entry.key !== key);
    }

    saveJson(cartKey, cart);
    renderCart();
}

function toggleWishlist(productId) {
    const id = String(productId);
    if (wishlist.has(id)) {
        wishlist.delete(id);
    } else {
        wishlist.add(id);
    }
    saveJson(wishlistKey, [...wishlist]);
    applyFilters();
    renderDetail(currentProduct);
}

function openCart() {
    dom.cartDrawer?.classList.add("open");
    dom.drawerScrim?.classList.add("open");
    document.body.classList.add("drawer-open");
    dom.cartDrawer?.setAttribute("aria-hidden", "false");
}

function closeCart() {
    dom.cartDrawer?.classList.remove("open");
    dom.drawerScrim?.classList.remove("open");
    document.body.classList.remove("drawer-open");
    dom.cartDrawer?.setAttribute("aria-hidden", "true");
}

function openMobileMenu() {
    dom.mobileMenu?.classList.add("open");
    document.body.classList.add("menu-open");
    dom.mobileMenu?.setAttribute("aria-hidden", "false");
}

function closeMobileMenu() {
    dom.mobileMenu?.classList.remove("open");
    document.body.classList.remove("menu-open");
    dom.mobileMenu?.setAttribute("aria-hidden", "true");
}

function setCheckoutStep(step) {
    document.querySelectorAll("[data-checkout-step]").forEach((button) => {
        button.classList.toggle("active", button.dataset.checkoutStep === String(step));
    });
    document.querySelectorAll("[data-step-panel]").forEach((panel) => {
        panel.classList.toggle("active", panel.dataset.stepPanel === String(step));
    });
}

function bindProductImageLoading() {
    document.querySelectorAll(".product-card .primary-image").forEach((image) => {
        const card = image.closest(".product-card");
        const markLoaded = () => card?.classList.add("image-loaded");
        if (image.complete) {
            markLoaded();
        } else {
            image.addEventListener("load", markLoaded, { once: true });
            image.addEventListener("error", markLoaded, { once: true });
        }
    });
}

function observeProducts() {
    const cards = document.querySelectorAll(".product-card");
    if (!("IntersectionObserver" in window)) {
        cards.forEach((card) => card.classList.add("is-visible"));
        return;
    }
    cards.forEach((card) => revealObserver?.observe(card));
}

function initRevealObserver() {
    if (!("IntersectionObserver" in window)) {
        document.querySelectorAll(".reveal").forEach((node) => node.classList.add("is-visible"));
        return;
    }

    revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.16 }
    );

    document.querySelectorAll(".reveal").forEach((node) => revealObserver.observe(node));
}

function bindMagneticButtons() {
    document.querySelectorAll(".magnetic").forEach((button) => {
        if (button.dataset.magneticBound) {
            return;
        }
        button.dataset.magneticBound = "true";
        button.addEventListener("mousemove", (event) => {
            const rect = button.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            button.style.transform = `translate(${x * 0.08}px, ${y * 0.14}px)`;
        });
        button.addEventListener("mouseleave", () => {
            button.style.transform = "";
        });
    });
}

function updateStickyBar() {
    if (!dom.stickyAddBar) {
        return;
    }
    const detail = document.getElementById("product-detail");
    const rect = detail?.getBoundingClientRect();
    const shouldShow = rect && rect.top < -120 && rect.bottom > 420;
    dom.stickyAddBar.classList.toggle("show", Boolean(shouldShow));
    dom.stickyAddBar.setAttribute("aria-hidden", shouldShow ? "false" : "true");
}

function formatPaymentFields() {
    dom.cardNumber?.addEventListener("input", () => {
        const digits = dom.cardNumber.value.replace(/\D/g, "").slice(0, 16);
        dom.cardNumber.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    });

    dom.cardExpiry?.addEventListener("input", () => {
        const digits = dom.cardExpiry.value.replace(/\D/g, "").slice(0, 4);
        dom.cardExpiry.value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    });
}

async function hydrateProductsFromApi() {
    renderProducts(allProducts);
    renderDetail(currentProduct);

    if (!getToken()) {
        setMessage("Showing sample products. Sign in to load protected inventory.");
        return;
    }

    try {
        setMessage("Loading products...");
        const payload = await apiFetch("/products/");
        const products = Array.isArray(payload) ? payload : payload.results || [];
        if (!products.length) {
            setMessage("Sample products are displayed.");
            return;
        }
        allProducts = products.map(normalizeProduct);
        currentProduct = allProducts[0];
        renderProducts(filteredProducts());
        renderDetail(currentProduct);
        setMessage("Products loaded.");
    } catch (error) {
        setMessage(`${error.message} Sample products remain available.`, "error");
    }
}

function bindEvents() {
    dom.productSearch?.addEventListener("input", applyFilters);
    dom.sortSelect?.addEventListener("change", applyFilters);
    dom.resetFiltersBtn?.addEventListener("click", resetFilters);
    dom.priceRange?.addEventListener("input", () => {
        updatePriceRangeLabel();
        applyFilters();
    });

    document.querySelectorAll('input[name="category"], input[name="brand"], input[name="rating"]').forEach((input) => {
        input.addEventListener("change", applyFilters);
    });

    document.querySelectorAll(".swatch-filter").forEach((button) => {
        button.addEventListener("click", () => {
            const color = button.dataset.color;
            if (selectedColors.has(color)) {
                selectedColors.delete(color);
                button.classList.remove("active");
            } else {
                selectedColors.add(color);
                button.classList.add("active");
            }
            applyFilters();
        });
    });

    document.querySelectorAll(".size-filter-group button").forEach((button) => {
        button.addEventListener("click", () => {
            const size = button.dataset.size;
            if (selectedSizes.has(size)) {
                selectedSizes.delete(size);
                button.classList.remove("active");
            } else {
                selectedSizes.add(size);
                button.classList.add("active");
            }
            applyFilters();
        });
    });

    dom.activeFilters?.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-filter-type]");
        if (button) {
            removeFilter(button.dataset.filterType, button.dataset.filterValue);
        }
    });

    document.querySelectorAll("[data-category-link]").forEach((link) => {
        link.addEventListener("click", () => selectCategory(link.dataset.categoryLink));
    });

    dom.productsGrid?.addEventListener("click", (event) => {
        const wishlistButton = event.target.closest(".wishlist-toggle");
        const addButton = event.target.closest(".quick-add");
        const viewButton = event.target.closest("[data-view-product]");

        if (wishlistButton) {
            toggleWishlist(wishlistButton.dataset.productId);
            return;
        }
        if (addButton) {
            const product = findProduct(addButton.dataset.productId);
            selectedColor = product.colors[0] || "Obsidian";
            selectedSize = firstAvailableSize(product);
            addToCart(product, 1);
            return;
        }
        if (viewButton) {
            const product = findProduct(viewButton.dataset.viewProduct);
            renderDetail(product);
            document.getElementById("product-detail")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });

    dom.thumbnailRail?.addEventListener("click", (event) => {
        const button = event.target.closest("button[data-thumbnail]");
        if (!button) {
            return;
        }
        dom.mainProductImage.src = button.dataset.thumbnail;
        dom.thumbnailRail.querySelectorAll("button").forEach((node) => node.classList.remove("active"));
        button.classList.add("active");
    });

    dom.detailColors?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-detail-color]");
        if (!button) {
            return;
        }
        selectedColor = button.dataset.detailColor;
        dom.selectedColor.textContent = selectedColor;
        dom.detailColors.querySelectorAll("button").forEach((node) => node.classList.remove("active"));
        button.classList.add("active");
    });

    dom.detailSizes?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-detail-size]");
        if (!button || button.disabled) {
            return;
        }
        selectedSize = button.dataset.detailSize;
        dom.selectedSize.textContent = selectedSize;
        dom.detailSizes.querySelectorAll("button").forEach((node) => node.classList.remove("active"));
        button.classList.add("active");
    });

    dom.qtyMinus?.addEventListener("click", () => {
        quantity = Math.max(1, quantity - 1);
        dom.quantityValue.textContent = String(quantity);
    });

    dom.qtyPlus?.addEventListener("click", () => {
        quantity += 1;
        dom.quantityValue.textContent = String(quantity);
    });

    dom.addToCartBtn?.addEventListener("click", () => addToCart());
    dom.stickyAddBtn?.addEventListener("click", () => addToCart());
    dom.buyNowBtn?.addEventListener("click", () => {
        addToCart(currentProduct, quantity, false);
        closeCart();
        document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth", block: "start" });
        setCheckoutStep(1);
    });

    dom.detailWishlistBtn?.addEventListener("click", () => toggleWishlist(currentProduct.id));

    dom.shareBtn?.addEventListener("click", async () => {
        const url = `${window.location.origin}${window.location.pathname}#product-detail`;
        try {
            await navigator.clipboard.writeText(url);
            setMessage("Product link copied.");
        } catch (error) {
            setMessage(url);
        }
    });

    dom.cartOpenBtn?.addEventListener("click", openCart);
    dom.cartCloseBtn?.addEventListener("click", closeCart);
    dom.drawerScrim?.addEventListener("click", closeCart);
    dom.checkoutBtn?.addEventListener("click", () => {
        closeCart();
        document.getElementById("checkout")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    dom.cartItems?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-cart-action]");
        if (button) {
            handleCartAction(button.dataset.cartAction, button.dataset.cartKey);
        }
    });

    dom.recommendationList?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-recommendation-id]");
        if (button) {
            addToCart(findProduct(button.dataset.recommendationId), 1);
        }
    });

    document.querySelectorAll("[data-checkout-step], [data-next-step]").forEach((button) => {
        button.addEventListener("click", () => {
            const next = button.dataset.checkoutStep || button.dataset.nextStep;
            setCheckoutStep(next);
        });
    });

    document.querySelectorAll('input[name="shipping"]').forEach((input) => {
        input.addEventListener("change", renderCheckoutSummary);
    });

    dom.mobileMenuOpen?.addEventListener("click", openMobileMenu);
    dom.mobileMenuClose?.addEventListener("click", closeMobileMenu);
    dom.mobileMenu?.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            closeMobileMenu();
        }
    });

    window.addEventListener("scroll", updateStickyBar, { passive: true });
    window.addEventListener("resize", updateStickyBar);
}

function init() {
    initRevealObserver();
    bindEvents();
    bindMagneticButtons();
    updatePriceRangeLabel();
    hydrateProductsFromApi();
    renderCart();
    formatPaymentFields();
    updateStickyBar();
}

init();
})();
