// ============================================================
// TECH BRASIL — SCRIPT PRINCIPAL (Completo e Integrado ao Firebase)
// ============================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Lista dinâmica vinda do Firebase
let products = [];
let currentProducts = [];

let cart = JSON.parse(
    localStorage.getItem("techBrasilCart") || "[]"
);

// ============================================================
// ELEMENTOS AUXILIARES
// ============================================================

const $ = (selector) => document.querySelector(selector);  const $$ = (selector) => [
    ...document.querySelectorAll(selector)
];

// ============================================================
// FORMATAÇÃO DE VALORES
// ============================================================

const money = (value) =>
    Number(value || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

// ============================================================
// CATEGORIAS
// ============================================================

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

// ============================================================
// PROTEÇÃO DE TEXTO INSERIDO NO HTML
// ============================================================

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
// CARREGAMENTO DOS PRODUTOS DO FIREBASE EM TEMPO REAL
// ============================================================

onSnapshot(collection(db, "products"), (snapshot) => {
    products = [];
    snapshot.forEach((docSnap) => {
        const p = docSnap.data();
        products.push({
            id: docSnap.id, // ID único do Firestore
            name: p.name || p.nome || p.titulo || "Produto",
            category: p.category || p.categoria || "accessories",
            badge: p.badge || "Destaque",
            price: Number(p.price || p.preco || 0),
            oldPrice: p.oldPrice ? Number(p.oldPrice) : null,
            image: p.image || p.imagem || "",
            description: p.description || p.descricao || "Sem descrição disponível."
        });
    });

    currentProducts = [...products];
    renderFeatured();
    renderAllProducts();
    updateCartUI();
});

// ============================================================
// CRIAÇÃO DOS CARDS DE PRODUTOS
// ============================================================

function productCard(product) {
    return `
        <article class="product-card" data-id="${product.id}">

            <div class="product-image" style="background-image: url('${escapeHTML(product.image)}'); background-size: cover; background-position: center; height: 180px; border-radius: 8px 8px 0 0; background-color: #1f302a;">

                <span class="product-badge">
                    ${escapeHTML(product.badge)}
                </span>

            </div>

            <div class="product-info" style="padding: 1rem;">

                <span class="product-category" style="font-size: 0.8rem; color: #9aa8a2;">
                    ${escapeHTML(categoryNames[product.category] || "Acessórios")}
                </span>

                <h3 class="product-name" style="font-size: 1rem; margin: 0.4rem 0; color: #fff;">
                    ${escapeHTML(product.name)}
                </h3>

                <div class="product-price" style="margin-bottom: 1rem;">
                    <strong class="price" style="color: #00ff66; font-size: 1.1rem;">
                        ${money(product.price)}
                    </strong>
                </div>

                <div class="product-actions" style="display: flex; gap: 8px;">

                    <button
                        class="add-cart btn btn-primary"
                        data-add="${product.id}"
                        style="flex: 1; padding: 0.5rem; cursor: pointer;"
                    >
                        Comprar
                    </button>

                    <button
                        class="quick-view btn btn-secondary"
                        data-view="${product.id}"
                        style="padding: 0.5rem 0.8rem; cursor: pointer;"
                        aria-label="Ver detalhes"
                    >
                        ↗
                    </button>

                </div>

            </div>

        </article>
    `;
}

// ============================================================
// EXIBIÇÃO DOS PRODUTOS
// ============================================================

function renderProducts(list, targetId) {
    const target = document.getElementById(targetId);

    if (!target) return;

    target.innerHTML = list
        .map(productCard)
        .join("");

    bindProductButtons();
}

// ============================================================
// EVENTOS DOS BOTÕES DOS PRODUTOS
// ============================================================

function bindProductButtons() {

    $$("[data-add]").forEach(button => {          button.addEventListener("click", () => {              addToCart(button.dataset.add);          });      });      $$
("[data-view]").forEach(button => {

        button.addEventListener("click", () => {

            openProductModal(button.dataset.view);

        });

    });

}

// ============================================================
// PRODUTOS EM DESTAQUE
// ============================================================

function renderFeatured() {

    renderProducts(
        products.slice(0, 4),
        "featuredProducts"
    );

}

// ============================================================
// PESQUISA, FILTROS E ORDENAÇÃO
// ============================================================

function renderAllProducts() {

    const searchInput = $("#searchInput");
    const categoryFilter = $("#categoryFilter");
    const sortFilter = $("#sortFilter");

    if (!searchInput || !categoryFilter || !sortFilter) return;

    const searchTerm = searchInput.value.trim().toLowerCase();
    const category = categoryFilter.value;
    const sort = sortFilter.value;

    let list = products.filter(product => {

        const matchesSearch =
            !searchTerm ||
            product.name.toLowerCase().includes(searchTerm) ||
            (categoryNames[product.category] && categoryNames[product.category].toLowerCase().includes(searchTerm));

        const matchesCategory =
            category === "all" ||
            product.category === category;

        return matchesSearch && matchesCategory;

    });

    if (sort === "price-low") {
        list.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
        list.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
        list.sort((a, b) =>
            a.name.localeCompare(b.name, "pt-BR")
        );
    }

    currentProducts = list;

    renderProducts(list, "allProducts");

    const emptyState = $("#emptyState");
    if (emptyState) emptyState.hidden = list.length !== 0;

    const resultText = $("#productResultText");
    if (resultText) {
        resultText.textContent =
            `${list.length} ${
                list.length === 1
                    ? "produto encontrado"
                    : "produtos encontrados"
            }.`;
    }

}

// ============================================================
// ADICIONAR PRODUTO AO CARRINHO
// ============================================================

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    const existing = cart.find(
        item => item.id === productId
    );

    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({
            id: productId,
            quantity: 1
        });

    }

    saveCart();

    updateCartUI();

    showToast(
        `${product.name} foi adicionado ao carrinho.`
    );

}

// ============================================================
// REMOVER PRODUTO DO CARRINHO
// ============================================================

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();

    updateCartUI();

}

// ============================================================
// ALTERAR QUANTIDADE
// ============================================================

function changeQuantity(productId, amount) {

    const item = cart.find(
        cartItem => cartItem.id === productId
    );

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

        removeFromCart(productId);

    } else {

        saveCart();

        updateCartUI();

    }

}

// ============================================================
// SALVAR CARRINHO NO NAVEGADOR
// ============================================================

function saveCart() {

    localStorage.setItem(
        "techBrasilCart",
        JSON.stringify(cart)
    );

}

// ============================================================
// CALCULAR QUANTIDADE E TOTAL
// ============================================================

function cartTotals() {

    let quantity = 0;
    let total = 0;

    cart.forEach(item => {

        const product = products.find(
            productItem => productItem.id === item.id
        );

        if (!product) return;

        quantity += item.quantity;

        total += product.price * item.quantity;

    });

    return {
        quantity,
        total
    };

}

// ============================================================
// ATUALIZAR INTERFACE DO CARRINHO
// ============================================================

function updateCartUI() {

    const { quantity, total } = cartTotals();

    const cartCount = $("#cartCount");
    const cartTotal = $("#cartTotal");

    if (cartCount) cartCount.textContent = quantity;
    if (cartTotal) cartTotal.textContent = money(total);

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

        const product = products.find(
            productItem => productItem.id === item.id
        );

        if (!product) return "";

        return `
            <div class="cart-item" style="display: flex; gap: 10px; align-items: center; margin-bottom: 1rem; border-bottom: 1px solid #1f302a; padding-bottom: 1rem;">

                <div style="width: 50px; height: 50px; background-image: url('${product.image}'); background-size: cover; border-radius: 6px; background-color: #1f302a;"></div>

                <div style="flex: 1;">

                    <strong style="color: #fff; font-size: 0.9rem;">
                        ${escapeHTML(product.name)}
                    </strong>

                    <small style="display: block; color: #00ff66;">
                        ${money(product.price)} cada
                    </small>

                    <div class="qty-controls" style="display: flex; gap: 8px; align-items: center; margin-top: 5px;">

                        <button
                            data-minus="${product.id}"
                            aria-label="Diminuir quantidade"
                            style="background: #1f302a; color: #fff; border: none; padding: 2px 8px; cursor: pointer; border-radius: 4px;"
                        >
                            −
                        </button>

                        <span style="color: #fff;">${item.quantity}</span>

                        <button
                            data-plus="${product.id}"
                            aria-label="Aumentar quantidade"
                            style="background: #1f302a; color: #fff; border: none; padding: 2px 8px; cursor: pointer; border-radius: 4px;"
                        >
                            +
                        </button>

                        <button
                            class="remove-item"
                            data-remove="${product.id}"
                            style="background: transparent; color: #ff4d4d; border: none; cursor: pointer; font-size: 0.8rem; margin-left: auto;"
                        >
                            Remover
                        </button>

                    </div>

                </div>

                <strong style="color: #fff;">
                    ${money(product.price * item.quantity)}
                </strong>

            </div>
        `;

    }).join("");

    $$("[data-minus]").forEach(button => {

        button.addEventListener("click", () => {

            changeQuantity(
                button.dataset.minus,
                -1
            );

        });

    });

    $$("[data-plus]").forEach(button => {          button.addEventListener("click", () => {              changeQuantity(                 button.dataset.plus,                 1             );          });      });      $$
("[data-remove]").forEach(button => {

        button.addEventListener("click", () => {

            removeFromCart(
                button.dataset.remove
            );

        });

    });

}

// ============================================================
// ABRIR E FECHAR CARRINHO
// ============================================================

function openCart() {

    const cartDrawer = $("#cartDrawer");
    const overlay = $("#overlay");

    if (cartDrawer) {
        cartDrawer.classList.add("active");
        cartDrawer.setAttribute("aria-hidden", "false");
    }

    if (overlay) overlay.classList.add("active");

    document.body.classList.add("no-scroll");

}

function closeCart() {

    const cartDrawer = $("#cartDrawer");

    if (cartDrawer) {
        cartDrawer.classList.remove("active");
        cartDrawer.setAttribute("aria-hidden", "true");
    }

    closeOverlayIfUnused();

}

// ============================================================
// CONTROLE DO FUNDO ESCURO
// ============================================================

function closeOverlayIfUnused() {

    const productModal = $("#productModal");
    const cartDrawer = $("#cartDrawer");
    const overlay = $("#overlay");

    const modalOpen = productModal && productModal.classList.contains("active");
    const cartOpen = cartDrawer && cartDrawer.classList.contains("active");

    if (!modalOpen && !cartOpen && overlay) {

        overlay.classList.remove("active");

        document.body.classList.remove("no-scroll");

    }

}

// ============================================================
// ABRIR DETALHES DO PRODUTO (MODAL)
// ============================================================

function openProductModal(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    const modalContent = $("#modalContent");
    if (modalContent) {
        modalContent.innerHTML = `
            <div class="modal-product">

                <div class="modal-product-image" style="background-image: url('${product.image}'); background-size: cover; height: 220px; border-radius: 8px; background-color: #1f302a;"></div>

                <div class="modal-product-info" style="margin-top: 1rem;">

                    <span class="section-kicker">
                        ${escapeHTML(categoryNames[product.category] || "Acessórios")}
                    </span>

                    <h2 style="color: #fff; margin: 0.5rem 0;">
                        ${escapeHTML(product.name)}
                    </h2>

                    <p style="color: #9aa8a2; margin-bottom: 1rem;">
                        ${escapeHTML(product.description)}
                    </p>

                    <div class="modal-price" style="color: #00ff66; font-size: 1.4rem; font-weight: bold; margin-bottom: 1rem;">
                        ${money(product.price)}
                    </div>

                    <button
                        class="btn btn-primary"
                        id="modalAddButton"
                        style="width: 100%; padding: 0.75rem; cursor: pointer;"
                    >
                        Adicionar ao carrinho
                    </button>

                </div>

            </div>
        `;
    }

    const modalAddButton = $("#modalAddButton");
    if (modalAddButton) {
        modalAddButton.addEventListener(
            "click",
            () => {
                addToCart(product.id);
                closeProductModal();
                openCart();
            }
        );
    }

    const productModal = $("#productModal");
    const overlay = $("#overlay");

    if (productModal) {
        productModal.classList.add("active");
        productModal.setAttribute("aria-hidden", "false");
    }

    if (overlay) overlay.classList.add("active");

    document.body.classList.add("no-scroll");

}

// ============================================================
// FECHAR DETALHES DO PRODUTO
// ============================================================

function closeProductModal() {

    const productModal = $("#productModal");

    if (productModal) {
        productModal.classList.remove("active");
        productModal.setAttribute("aria-hidden", "true");
    }

    closeOverlayIfUnused();

}

// ============================================================
// NOTIFICAÇÕES (TOAST)
// ============================================================

function showToast(message) {

    const toast = $("#toast");

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2800);

}

// ============================================================
// NAVEGAR PARA OS PRODUTOS COM FILTRO
// ============================================================

function scrollToProducts(category = "all") {

    const categoryFilter = $("#categoryFilter");
    const produtosSection = document.getElementById("produtos");

    if (categoryFilter) categoryFilter.value = category;

    renderAllProducts();

    if (produtosSection) {
        produtosSection.scrollIntoView({
            behavior: "smooth"
        });
    }

}

// ============================================================
// EVENTOS DA PESQUISA E FILTROS
// ============================================================

const searchForm = $("#searchForm");
if (searchForm) {
    searchForm.addEventListener("submit", event => {
        event.preventDefault();
        renderAllProducts();
        const produtosSection = document.getElementById("produtos");
        if (produtosSection) produtosSection.scrollIntoView({ behavior: "smooth" });
    });
}

const searchInput = $("#searchInput");
if (searchInput) searchInput.addEventListener("input", renderAllProducts);

const categoryFilter = $("#categoryFilter");
if (categoryFilter) categoryFilter.addEventListener("change", renderAllProducts);

const sortFilter = $("#sortFilter");
if (sortFilter) sortFilter.addEventListener("change", renderAllProducts);

// ============================================================
// CLIQUES NAS CATEGORIAS
// ============================================================

$$("[data-category]").forEach(button => {      button.addEventListener("click", () => {          scrollToProducts(button.dataset.category);      });  });  $$
("[data-category-link]").forEach(link => {

    link.addEventListener("click", event => {

        event.preventDefault();

        scrollToProducts(
            link.dataset.categoryLink
        );

    });

});

// ============================================================
// EVENTOS DO CARRINHO E MODAIS
// ============================================================

const cartButton = $("#cartButton");
if (cartButton) cartButton.addEventListener("click", openCart);

const closeCartBtn = $("#closeCart");
if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);

const closeProductModalBtn = $("#closeProductModal");
if (closeProductModalBtn) closeProductModalBtn.addEventListener("click", closeProductModal);

const overlay = $("#overlay");
if (overlay) {
    overlay.addEventListener("click", () => {
        closeCart();
        closeProductModal();
    });
}

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeCart();

        closeProductModal();

    }

});

// ============================================================
// FINALIZAÇÃO DO PEDIDO
// ============================================================

const checkoutButton = $("#checkoutButton");
if (checkoutButton) {
    checkoutButton.addEventListener(
        "click",
        () => {

            if (!cart.length) {

                showToast("Seu carrinho está vazio.");

                return;

            }

            // Redireciona para o checkout
            window.location.href = "checkout.html";

        }
    );
}

// ============================================================
// LIMPAR PESQUISA E FILTROS
// ============================================================

const clearFiltersBtn = $("#clearFilters");
if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener(
        "click",
        () => {

            if ($("#searchInput")) $("#searchInput").value = "";
            if ($("#categoryFilter")) $("#categoryFilter").value = "all";
            if ($("#sortFilter")) $("#sortFilter").value = "featured";

            renderAllProducts();

        }
    );
}

// ============================================================
// NEWSLETTER
// ============================================================

const newsletterForm = $("#newsletterForm");
if (newsletterForm) {
    newsletterForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const emailInput = $("#newsletterEmail");
            if (!emailInput) return;

            const email = emailInput.value.trim();

            if (!email) return;

            newsletterForm.reset();

            showToast(
                "Cadastro realizado. Obrigado por acompanhar a Tech Brasil!"
            );

        }
    );
}

// ============================================================
// MENU MOBILE
// ============================================================

const mobileMenuButton = $("#mobileMenuButton");
if (mobileMenuButton) {
    mobileMenuButton.addEventListener(
        "click",
        () => {

            const nav = $("#categoryNav");
            if (!nav) return;

            const isOpen =
                nav.classList.toggle("mobile-open");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );
}

// ============================================================
// ANO AUTOMÁTICO NO RODAPÉ
// ============================================================

const currentYearEl = $("#currentYear");
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}
