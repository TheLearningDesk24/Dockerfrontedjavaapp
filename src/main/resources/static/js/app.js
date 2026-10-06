let allProducts = [];
let cart = JSON.parse(localStorage.getItem("shopHubCart") || "[]");

const productsGrid = document.getElementById("productsGrid");
const dealProducts = document.getElementById("dealProducts");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

async function loadProducts() {
    try {
        const response = await fetch("/api/products");
        if (!response.ok) throw new Error("API request failed");
        allProducts = await response.json();
        renderDeals();
        renderProducts();
        updateCart();
    } catch (error) {
        productsGrid.innerHTML = "<p>Unable to load products. Please try again.</p>";
        console.error(error);
    }
}

function renderDeals() {
    renderInto(dealProducts, allProducts.slice(0, 4));
}

function renderProducts() {
    const query = searchInput.value.trim().toLowerCase();
    const category = categorySelect.value;

    let products = allProducts.filter(product => {
        const matchesSearch =
            !query ||
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query);

        const matchesCategory = category === "All" || product.category === category;
        return matchesSearch && matchesCategory;
    });

    switch (sortSelect.value) {
        case "price-low": products.sort((a, b) => a.price - b.price); break;
        case "price-high": products.sort((a, b) => b.price - a.price); break;
        case "name": products.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    document.getElementById("resultText").textContent =
        `${products.length} product${products.length === 1 ? "" : "s"} found`;

    renderInto(productsGrid, products);
}

function renderInto(container, products) {
    if (!products.length) {
        container.innerHTML = "<p>No products found.</p>";
        return;
    }

    container.innerHTML = products.map(product => `
        <article class="product-card">
            <div class="product-image">${productIcon(product.category)}</div>
            <div class="product-category">${escapeHtml(product.category)}</div>
            <h3>${escapeHtml(product.name)}</h3>
            <div class="rating">★★★★★ <span style="color:#667085">4.8</span></div>
            <p class="description">${escapeHtml(product.description)}</p>
            <div class="price">₹${product.price.toLocaleString("en-IN")}</div>
            <button class="add-button" onclick="addToCart(${product.id})">Add to Cart</button>
        </article>
    `).join("");
}

function productIcon(category) {
    if (category === "Electronics") return "💻";
    if (category === "Accessories") return "⌨️";
    if (category === "Home") return "🏠";
    return "📦";
}

function addToCart(id) {
    const product = allProducts.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(item => item.id === id);
    if (existing) existing.quantity++;
    else cart.push({...product, quantity: 1});

    saveCart();
    updateCart();
    showToast(`${product.name} added to cart`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCart();
}

function updateCart() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cartCount").textContent = count;

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.getElementById("cartTotal").textContent =
        `₹${total.toLocaleString("en-IN")}`;

    const items = document.getElementById("cartItems");

    if (!cart.length) {
        items.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    items.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">${productIcon(item.category)}</div>
            <div>
                <h4>${escapeHtml(item.name)}</h4>
                <small>Qty: ${item.quantity} · ₹${(item.price * item.quantity).toLocaleString("en-IN")}</small>
            </div>
            <button class="remove" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join("");
}

function saveCart() {
    localStorage.setItem("shopHubCart", JSON.stringify(cart));
}

function openCart() {
    cartPanel.classList.add("open");
    overlay.classList.add("show");
    cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
    cartPanel.classList.remove("open");
    overlay.classList.remove("show");
    cartPanel.setAttribute("aria-hidden", "true");
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1800);
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

document.getElementById("searchForm").addEventListener("submit", event => {
    event.preventDefault();
    renderProducts();
    document.getElementById("products").scrollIntoView({behavior: "smooth"});
});

searchInput.addEventListener("input", renderProducts);
categorySelect.addEventListener("change", renderProducts);
sortSelect.addEventListener("change", renderProducts);

document.querySelectorAll(".category-cards button").forEach(button => {
    button.addEventListener("click", () => {
        categorySelect.value = button.dataset.category;
        renderProducts();
        document.getElementById("products").scrollIntoView({behavior: "smooth"});
    });
});

document.getElementById("cartButton").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

loadProducts();
