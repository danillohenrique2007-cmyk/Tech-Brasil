// ============================================================
// TECH BRASIL — SCRIPT PRINCIPAL (Integrado ao Firebase)
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, onSnapshot, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBsY-JGdy2D6eq2gCfKB_OAj3F1MlfS6Ks",
    authDomain: "tech-brasil-1b89c.firebaseapp.com",
    projectId: "tech-brasil-1b89c",
    storageBucket: "tech-brasil-1b89c.firebasestorage.app",
    messagingSenderId: "420995386502",
    appId: "1:420995386502:web:cf0989265d9f4260c95507"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Armazena os produtos vindos do Firebase em tempo real
let products = [];
let currentProducts = [];

let cart = JSON.parse(localStorage.getItem("techBrasilCart") || "[]");

const $ = (selector) => document.querySelector(selector); const $$ = (selector) => [...document.querySelectorAll(selector)];

const money = (value) =>
    Number(value || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

const categoryNames = {
    pc: "PCs Montados",
    gpu: "Placas de Vídeo",
    cpu: "Processadores",
    motherboard: "Placas-Mãe",
    ram: "Memórias RAM",
    storage: "Armazenamento",
    peripherals: "Periféricos",
    accessories: "Acessórios"
};

function escapeHTML(value) {
    return String(value || "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[char]));
}

// ============================================================
// CARREGAR PRODUTOS DO FIREBASE EM TEMPO REAL
// ============================================================

onSnapshot(collection(db, "products"), (snapshot) => {
    products = [];
    snapshot.forEach((docSnap) => {
        const p = docSnap.data();
        products.push({
            id: docSnap.id, // ID do documento do Firebase
            name: p.name || p.nome || p.titulo || "Produto",
            category: p.category || p.categoria || "accessories",
            badge: p.badge || "Destaque",
            price: Number(p.price || p.preco || 0),
            oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
            image: p.image || p.imagem || "",
            description: p.description || p.descricao || "Sem descrição."
        });
    });

    currentProducts = [...products];
    renderFeatured();
    renderAllProducts();
    updateCartUI();
});

// ============================================================
// CRIAÇÃO DOS CARDS
// ============================================================

function productCard(product) {
    return `
        <article class="product-card" data-id="${product.id}">
            <div class="product-image" style="background-image: url('${escapeHTML(product.image)}'); background-size: cover; background-position: center; height: 180px; border-radius: 8px 8px 0 0; background-color: #1f302a;">
                <span class="product-badge">${escapeHTML(product.badge)}</span>
            </div>
            <div class="product-info" style="padding: 1rem;">
                <span class="product-category" style="font-size: 0.8rem; color: #9aa8a2;">${escapeHTML(categoryNames[product.category] || "Acessórios")}</span>
                <h3 class="product-name" style="font-size: 1rem; margin: 0.4rem 0; color: #fff;">${escapeHTML(product.name)}</h3>
                <div class="product-price" style="margin-bottom: 1rem;">
                    <strong class="price" style="color: #00ff66; font-size: 1.1rem;">${money(product.price)}</strong>
                </div>
                <div class="product-actions" style="display: flex; gap: 8px;">
                    <button class="add-cart btn btn-primary" data-add="${product.id}" style="flex: 1; padding: 0.5rem; cursor: pointer;">Comprar</button>
                    <button class="quick-view btn btn-secondary" data-view="${product.id}" style="padding: 0.5rem 0.8rem; cursor: pointer;" aria-label="Ver detalhes">↗</button>
                </div>
            </div>
        </article>
    `;
}

function renderProducts(list, targetId) {
    const target = document.getElementById(targetId);
    if (!target) return;
    target.innerHTML = list.map(productCard).join("");
    bindProductButtons();
}

function bindProductButtons() {
    $$("[data-add]").forEach(button => {         button.addEventListener("click", () => {             addToCart(button.dataset.add);         });     });      $$
("[data-view]").forEach(button => {
        button.addEventListener("click", () => {
            openProductModal(button.dataset.view);
        });
    });
}

function renderFeatured() {
    renderProducts(products.slice(0, 4), "featuredProducts");
}

function renderAllProducts() {
    const searchTerm = $("#searchInput").value.trim().toLowerCase();
    const category = $("#categoryFilter").value;
    const sort = $("#sortFilter").value;

    let list = products.filter(product => {
        const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = category === "all" || product.category === category;
        return matchesSearch && matchesCategory;
    });

    if (sort === "price-low") list.sort((a, b) => a.price - b.price);
    if (sort === "price-high") list.sort((a, b) => b.price - a.price);
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

    currentProducts = list;
    renderProducts(list, "allProducts");

    const emptyState = $("#emptyState");
    if (emptyState) emptyState.hidden = list.length !== 0;

    const resultText = $("#productResultText");
    if (resultText) {
        resultText.textContent = `${list.length} ${list.length === 1 ? "produto encontrado" : "produtos encontrados"}.`;
    }
}

// ============================================================
// GERENCIAMENTO DO CARRINHO
// ============================================================

function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`${product.name} foi adicionado ao carrinho.`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

function changeQuantity(productId, amount) {
    const item = cart.find(cartItem => cartItem.id === productId);
    if (!item) return;

    item.quantity += amount;
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem("techBrasilCart", JSON.stringify(cart));
}

function cartTotals() {
    let quantity = 0;
    let total = 0;

    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        quantity += item.quantity;
        total += product.price * item.quantity;
    });

    return { quantity, total };
}

function updateCartUI() {
    const { quantity, total } = cartTotals();
    const countEl = $("#cartCount");
    const totalEl = $("#cartTotal");
    if (countEl) countEl.textContent = quantity;
    if (totalEl) totalEl.textContent = money(total);

    const container = $("#cartItems");
    const empty = $("#cartEmpty");
    if (!container) return;

    if (!cart.length) {
        container.innerHTML = "";
        if (empty) empty.style.display = "grid";
        return;
    }

    if (empty) empty.style.display = "none";

    container.innerHTML = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return "";

        return `
            <div class="cart-item" style="display: flex; gap: 10px; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #1f302a; padding-bottom: 1rem;">
                <div style="width: 50px; height: 50px; background-image: url('${product.image}'); background-size: cover; border-radius: 6px;"></div>
                <div style="flex: 1;">
                    <strong style="color: #fff; font-size: 0.9rem;">${escapeHTML(product.name)}</strong>
                    <small style="display: block; color: #00ff66;">${money(product.price)} cada</small>
                    <div class="qty-controls" style="display: flex; gap: 8px; align-items: center; margin-top: 5px;">
                        <button data-minus="${product.id}" style="background: #1f302a; color: #fff; border: none; padding: 2px 8px; cursor: pointer; border-radius: 4px;">−</button>
                        <span style="color: #fff;">${item.quantity}</span>
                        <button data-plus="${product.id}" style="background: #1f302a; color: #fff; border: none; padding: 2px 8px; cursor: pointer; border-radius: 4px;">+</button>
                        <button class="remove-item" data-remove="${product.id}" style="background: transparent; color: #ff4d4d; border: none; cursor: pointer; font-size: 0.8rem; margin-left: auto;">Remover</button>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    $$("[data-minus]").forEach(btn => btn.addEventListener("click", () => changeQuantity(btn.dataset.minus, -1)));
    $$("[data-plus]").forEach(btn => btn.addEventListener("click", () => changeQuantity(btn.dataset.plus, 1)));     $$
("[data-remove]").forEach(btn => btn.addEventListener("click", () => removeFromCart(btn.dataset.remove)));
}

// ============================================================
// CONTROLES DE INTERFACE (MODAIS, CARRINHO, ETC)
// ============================================================

function openCart() {
    $("#cartDrawer").classList.add("active");
    $("#cartDrawer").setAttribute("aria-hidden", "false");
    $("#overlay").classList.add("active");
    document.body.classList.add("no-scroll");
}

function closeCart() {
    $("#cartDrawer").classList.remove("active");
    $("#cartDrawer").setAttribute("aria-hidden", "true");
    closeOverlayIfUnused();
}

function closeOverlayIfUnused() {
    const modalOpen = $("#productModal").classList.contains("active");
    const cartOpen = $("#cartDrawer").classList.contains("active");
    if (!modalOpen && !cartOpen) {
        $("#overlay").classList.remove("active");
        document.body.classList.remove("no-scroll");
    }
}

function openProductModal(productId) {
    const product = products.find(item => item.id === productId);
    if (!product) return;

    $("#modalContent").innerHTML = `
        <div class="modal-product">
            <div class="modal-product-image" style="background-image: url('${product.image}'); background-size: cover; height: 250px; border-radius: 8px;"></div>
            <div class="modal-product-info" style="margin-top: 1rem;">
                <h2>${escapeHTML(product.name)}</h2>
                <p style="color: #9aa8a2; margin: 0.5rem 0;">${escapeHTML(product.description)}</p>
                <div class="modal-price" style="color: #00ff66; font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">${money(product.price)}</div>
                <button class="btn btn-primary" id="modalAddButton" style="width: 100%; padding: 0.75rem; cursor: pointer;">Adicionar ao carrinho</button>
            </div>
        </div>
    `;

    $("#modalAddButton").addEventListener("click", () => {
        addToCart(product.id);
        closeProductModal();
        openCart();
    });

    $("#productModal").classList.add("active");
    $("#productModal").setAttribute("aria-hidden", "false");
    $("#overlay").classList.add("active");
    document.body.classList.add("no-scroll");
}

function closeProductModal() {
    $("#productModal").classList.remove("active");
    $("#productModal").setAttribute("aria-hidden", "true");
    closeOverlayIfUnused();
}

function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

function scrollToProducts(category = "all") {
    $("#categoryFilter").value = category;
    renderAllProducts();
    document.getElementById("produtos").scrollIntoView({ behavior: "smooth" });
}

// Event Listeners Globais
if ($("#searchForm")) {
    $("#searchForm").addEventListener("submit", (e) => { e.preventDefault(); renderAllProducts(); });
    $("#searchInput").addEventListener("input", renderAllProducts);
    $("#categoryFilter").addEventListener("change", renderAllProducts);
    $("#sortFilter").addEventListener("change", renderAllProducts);
}

$$("[data-category]").forEach(btn => btn.addEventListener("click", () => scrollToProducts(btn.dataset.category))); $$
("[data-category-link]").forEach(link => link.addEventListener("click", (e) => { e.preventDefault(); scrollToProducts(link.dataset.categoryLink); }));

if ($("#cartButton")) $("#cartButton").addEventListener("click", openCart);
if ($("#closeCart")) $("#closeCart").addEventListener("click", closeCart);
if ($("#closeProductModal")) $("#closeProductModal").addEventListener("click", closeProductModal);
if ($("#overlay")) $("#overlay").addEventListener("click", () => { closeCart(); closeProductModal(); });

document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeCart(); closeProductModal(); } });

// ============================================================
// BOTÃO DE FINALIZAR PEDIDO (DIRECIONA PARA O CHECKOUT)
// ============================================================

if ($("#checkoutButton")) {
    $("#checkoutButton").addEventListener("click", () => {
        if (!cart.length) {
            showToast("Seu carrinho está vazio.");
            return;
        }
        // Redireciona o usuário para a página de pagamento/checkout
        window.location.href = "checkout.html";
    });
}

if ($("#currentYear")) $("#currentYear").textContent = new Date().getFullYear();
