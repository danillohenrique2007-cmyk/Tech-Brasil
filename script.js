"use strict";

/* =========================================================
   TECH BRASIL
   SISTEMA PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       PRODUTOS
    ====================================================== */

    const products = [

        {
            id: 1,
            name: "Placa de Vídeo RTX 4070 12GB",
            category: "gpu",
            price: 3299.90,
            description: "Alto desempenho para jogos em alta resolução e aplicações pesadas.",
            badge: "Destaque",
            art: "RTX 4070"
        },

        {
            id: 2,
            name: "AMD Ryzen 5 5600",
            category: "cpu",
            price: 749.90,
            description: "Processador de 6 núcleos e 12 threads para setups gamer.",
            badge: "Popular",
            art: "RYZEN 5"
        },

        {
            id: 3,
            name: "Placa-Mãe B550 Gaming",
            category: "motherboard",
            price: 1099.90,
            description: "Placa-mãe preparada para processadores Ryzen e upgrades.",
            badge: "",
            art: "B550"
        },

        {
            id: 4,
            name: "Memória RAM 16GB DDR4",
            category: "ram",
            price: 399.90,
            description: "Memória de alta performance para jogos e multitarefas.",
            badge: "Oferta",
            art: "16GB"
        },

        {
            id: 5,
            name: "SSD NVMe 1TB",
            category: "storage",
            price: 449.90,
            description: "Armazenamento rápido para sistema, jogos e arquivos.",
            badge: "Destaque",
            art: "1TB"
        },

        {
            id: 6,
            name: "PC Gamer Tech Brasil Ryzen 5",
            category: "pc",
            price: 3899.90,
            description: "Computador completo desenvolvido para jogos e produtividade.",
            badge: "PC Gamer",
            art: "PC GAMER"
        },

        {
            id: 7,
            name: "Fonte Gamer 650W",
            category: "accessories",
            price: 389.90,
            description: "Fonte de 650W para alimentar seu setup com segurança.",
            badge: "",
            art: "650W"
        },

        {
            id: 8,
            name: "Headset Gamer 7.1",
            category: "peripherals",
            price: 249.90,
            description: "Som surround para uma experiência imersiva durante os jogos.",
            badge: "Popular",
            art: "7.1"
        },

        {
            id: 9,
            name: "Placa de Vídeo RX 7600 8GB",
            category: "gpu",
            price: 1999.90,
            description: "Excelente desempenho para jogos em Full HD.",
            badge: "",
            art: "RX 7600"
        },

        {
            id: 10,
            name: "Intel Core i5",
            category: "cpu",
            price: 1199.90,
            description: "Processador Intel para computadores gamer e profissionais.",
            badge: "Novo",
            art: "CORE i5"
        },

        {
            id: 11,
            name: "Memória RAM 32GB DDR5",
            category: "ram",
            price: 799.90,
            description: "Grande capacidade e velocidade para sistemas modernos.",
            badge: "Novo",
            art: "32GB"
        },

        {
            id: 12,
            name: "SSD NVMe 2TB",
            category: "storage",
            price: 799.90,
            description: "2TB de armazenamento de alta velocidade para seu computador.",
            badge: "Destaque",
            art: "2TB"
        }

    ];

    /* =====================================================
       CATEGORIAS
    ====================================================== */

    const categoryNames = {
        all: "Todos",
        pc: "PCs Montados",
        gpu: "Placas de Vídeo",
        cpu: "Processadores",
        motherboard: "Placas-Mãe",
        ram: "Memórias RAM",
        storage: "Armazenamento",
        peripherals: "Periféricos",
        accessories: "Acessórios"
    };

    /* =====================================================
       ELEMENTOS
    ====================================================== */

    const featuredProducts = document.getElementById("featuredProducts");
    const allProducts = document.getElementById("allProducts");
    const emptyState = document.getElementById("emptyState");
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");
    const clearFiltersButton = document.getElementById("clearFilters");
    const cartButton = document.getElementById("cartButton");
    const closeCartButton = document.getElementById("closeCart");
    const cartDrawer = document.getElementById("cartDrawer");
    const cartItems = document.getElementById("cartItems");
    const cartEmpty = document.getElementById("cartEmpty");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.getElementById("cartCount");
    const continueShopping = document.getElementById("continueShopping");
    const checkoutButton = document.getElementById("checkoutButton");
    const overlay = document.getElementById("overlay");
    const productModal = document.getElementById("productModal");
    const closeProductModal = document.getElementById("closeProductModal");
    const modalContent = document.getElementById("modalContent");
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");
    const newsletterForm = document.getElementById("newsletterForm");
    const newsletterEmail = document.getElementById("newsletterEmail");
    const accountButton = document.getElementById("accountButton");
    const mobileMenuButton = document.getElementById("mobileMenuButton");
    const categoryNav = document.getElementById("categoryNav");
    const currentYear = document.getElementById("currentYear");

    /* =====================================================
       ESTADO
    ====================================================== */

    let currentCategory = "all";
    let currentSearch = "";
    let currentSort = "default";
    let toastTimeout;
    let cart = loadCart();

    /* =====================================================
       FORMATAÇÃO DE PREÇO
    ====================================================== */

    function formatPrice(value) {
        return new Intl.NumberFormat(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        ).format(value);
    }

    /* =====================================================
       LOCAL STORAGE
    ====================================================== */

    function loadCart() {
        try {
            const savedCart = localStorage.getItem("techBrasilCart");
            if (!savedCart) return [];
            const parsed = JSON.parse(savedCart);
            if (!Array.isArray(parsed)) return [];
            return parsed;
        } catch (error) {
            console.warn("Não foi possível carregar o carrinho.", error);
            return [];
        }
    }

    function saveCart() {
        try {
            localStorage.setItem("techBrasilCart", JSON.stringify(cart));
        } catch (error) {
            console.warn("Não foi possível salvar o carrinho.", error);
        }
    }

    /* =====================================================
       CLASSE VISUAL DO PRODUTO
    ====================================================== */

    function getArtClass(category) {
        const classes = {
            gpu: "art-gpu",
            cpu: "art-cpu",
            motherboard: "art-motherboard",
            ram: "art-ram",
            storage: "art-storage",
            pc: "art-pc",
            peripherals: "art-peripherals",
            accessories: "art-accessories"
        };
        return classes[category] || "";
    }

    /* =====================================================
       CARD DO PRODUTO
    ====================================================== */

    function productCard(product) {
        const artClass = getArtClass(product.category);
        let badgeHTML = "";

        if (product.badge) {
            let badgeClass = "";
            if (product.badge === "Novo") badgeClass = "new";
            if (product.badge === "Oferta" || product.badge === "Destaque") badgeClass = "hot";

            badgeHTML = `
                <span class="product-badge ${badgeClass}">
                    ${product.badge}
                </span>
            `;
        }

        return `
            <article class="product-card" data-product-id="${product.id}">
                <div class="product-art-wrapper">
                    ${badgeHTML}
                    <div class="product-art ${artClass}">
                        <span>${product.art}</span>
                    </div>
                </div>
                <div class="product-info">
                    <span class="product-category">${categoryNames[product.category]}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-bottom">
                        <div class="product-price">
                            <small>À vista</small>
                            <strong>${formatPrice(product.price)}</strong>
                        </div>
                        <div class="product-actions">
                            <button type="button" class="product-action quick-view" data-id="${product.id}" aria-label="Ver detalhes" title="Ver detalhes">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"></path>
                                    <circle cx="12" cy="12" r="2.5"></circle>
                                </svg>
                            </button>
                            <button type="button" class="product-action primary add-cart" data-id="${product.id}" aria-label="Adicionar ao carrinho" title="Adicionar ao carrinho">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 8H7"></path>
                                    <circle cx="10" cy="20" r="1.5"></circle>
                                    <circle cx="18" cy="20" r="1.5"></circle>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    /* =====================================================
       RENDERIZAR PRODUTOS
    ====================================================== */

    function renderProducts(container, items) {
        if (!container) return;
        container.innerHTML = "";
        if (!items.length) return;
        container.innerHTML = items.map(productCard).join("");
    }

    /* =====================================================
       FILTRAR E ORDENAR
    ====================================================== */

    function getFilteredProducts() {
        let filtered = [...products];

        if (currentCategory !== "all") {
            filtered = filtered.filter(product => product.category === currentCategory);
        }

        if (currentSearch.trim()) {
            const search = currentSearch.trim().toLowerCase();
            filtered = filtered.filter(product => {
                const content = `${product.name} ${product.description} ${categoryNames[product.category]}`.toLowerCase();
                return content.includes(search);
            });
        }

        switch (currentSort) {
            case "price-low":
                filtered.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                filtered.sort((a, b) => b.price - a.price);
                break;
            case "name":
                filtered.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
                break;
            default:
                break;
        }

        return filtered;
    }

    function renderFeatured() {
        const featured = products.slice(0, 4);
        renderProducts(featuredProducts, featured);
    }

    function renderAllProducts() {
        const filtered = getFilteredProducts();
        renderProducts(allProducts, filtered);
        if (emptyState) {
            emptyState.hidden = filtered.length !== 0;
        }
        bindProductButtons();
    }

    function bindProductButtons() {
        document.querySelectorAll(".add-cart").forEach(button => {
            button.addEventListener("click", () => {
                addToCart(Number(button.dataset.id));
            });
        });

        document.querySelectorAll(".quick-view").forEach(button => {
            button.addEventListener("click", () => {
                openProductModal(Number(button.dataset.id));
            });
        });
    }

    /* =====================================================
       CARRINHO DE COMPRAS
    ====================================================== */

    function addToCart(id) {
        const product = products.find(item => item.id === id);
        if (!product) return;

        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ id: product.id, quantity: 1 });
        }

        saveCart();
        updateCartUI();
        showToast(`${product.name} foi adicionado ao carrinho.`);
    }

    function removeFromCart(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartUI();
    }

    function changeQuantity(id, amount) {
        const item = cart.find(product => product.id === id);
        if (!item) return;

        item.quantity += amount;
        if (item.quantity <= 0) {
            removeFromCart(id);
            return;
        }

        saveCart();
        updateCartUI();
    }

    function cartTotals() {
        let total = 0;
        let quantity = 0;

        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return;
            total += product.price * item.quantity;
            quantity += item.quantity;
        });

        return { total, quantity };
    }

    function updateCartUI() {
        if (!cartItems) return;
        const totals = cartTotals();

        if (cartCount) cartCount.textContent = totals.quantity;
        if (cartTotal) cartTotal.textContent = formatPrice(totals.total);

        if (!cart.length) {
            cartItems.innerHTML = "";
            if (cartEmpty) cartEmpty.style.display = "flex";
            if (cartDrawer) cartDrawer.classList.remove("has-items");
            return;
        }

        if (cartEmpty) cartEmpty.style.display = "none";

        cartItems.innerHTML = cart.map(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return "";

            return `
                <div class="cart-item" data-cart-id="${product.id}">
                    <div class="cart-item-art">${product.art}</div>
                    <div class="cart-item-info">
                        <h4>${product.name}</h4>
                        <strong>${formatPrice(product.price)}</strong>
                        <div class="cart-quantity">
                            <button type="button" class="quantity-minus" data-id="${product.id}">−</button>
                            <span>${item.quantity}</span>
                            <button type="button" class="quantity-plus" data-id="${product.id}">+</button>
                        </div>
                    </div>
                    <button type="button" class="remove-item" data-id="${product.id}" aria-label="Remover produto">×</button>
                </div>
            `;
        }).join("");

        bindCartButtons();
    }

    function bindCartButtons() {
        document.querySelectorAll(".quantity-minus").forEach(btn => {
            btn.addEventListener("click", () => changeQuantity(Number(btn.dataset.id), -1));
        });
        document.querySelectorAll(".quantity-plus").forEach(btn => {
            btn.addEventListener("click", () => changeQuantity(Number(btn.dataset.id), 1));
        });
        document.querySelectorAll(".remove-item").forEach(btn => {
            btn.addEventListener("click", () => removeFromCart(Number(btn.dataset.id)));
        });
    }

    function openCart() {
        if (!cartDrawer) return;
        cartDrawer.classList.add("open");
        cartDrawer.setAttribute("aria-hidden", "false");
        overlay?.classList.add("active");
        document.body.classList.add("no-scroll");
    }

    function closeCart() {
        if (!cartDrawer) return;
        cartDrawer.classList.remove("open");
        cartDrawer.setAttribute("aria-hidden", "true");
        closeOverlayIfUnused();
    }

    /* =====================================================
       MODAL
    ====================================================== */

    function openProductModal(id) {
        const product = products.find(item => item.id === id);
        if (!product || !productModal) return;

        const artClass = getArtClass(product.category);

        modalContent.innerHTML = `
            <div class="modal-product-visual">
                <div class="product-art ${artClass}">
                    <span>${product.art}</span>
                </div>
            </div>
            <div class="modal-product-info">
                <span class="product-category">${categoryNames[product.category]}</span>
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <div class="modal-price">${formatPrice(product.price)}</div>
                <button type="button" class="btn btn-primary modal-add-cart" data-id="${product.id}">
                    Adicionar ao carrinho
                </button>
            </div>
        `;

        productModal.classList.add("open");
        productModal.setAttribute("aria-hidden", "false");
        overlay?.classList.add("active");
        document.body.classList.add("no-scroll");

        const modalAddButton = document.querySelector(".modal-add-cart");
        modalAddButton?.addEventListener("click", () => {
            addToCart(Number(modalAddButton.dataset.id));
            closeProductModalWindow();
        });
    }

    function closeProductModalWindow() {
        if (!productModal) return;
        productModal.classList.remove("open");
        productModal.setAttribute("aria-hidden", "true");
        closeOverlayIfUnused();
    }

    function closeOverlayIfUnused() {
        const cartOpen = cartDrawer?.classList.contains("open");
        const modalOpen = productModal?.classList.contains("open");

        if (!cartOpen && !modalOpen) {
            overlay?.classList.remove("active");
            document.body.classList.remove("no-scroll");
        }
    }

    /* =====================================================
       TOAST
    ====================================================== */

    function showToast(message) {
        if (!toast || !toastMessage) return;
        toastMessage.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    /* =====================================================
       NEWSLETTER & EVENT LISTENERS GERAIS
    ====================================================== */

    function handleNewsletter(event) {
        event.preventDefault();
        const email = newsletterEmail?.value.trim();
        if (!email) return;
        showToast("Obrigado por se inscrever na Tech Brasil!");
        if (newsletterEmail) newsletterEmail.value = "";
    }

    newsletterForm?.addEventListener("submit", handleNewsletter);
    cartButton?.addEventListener("click", openCart);
    closeCartButton?.addEventListener("click", closeCart);
    continueShopping?.addEventListener("click", closeCart);
    overlay?.addEventListener("click", () => {
        closeCart();
        closeProductModalWindow();
    });

    closeProductModal?.addEventListener("click", closeProductModalWindow);

    searchForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        currentSearch = searchInput?.value || "";
        renderAllProducts();
    });

    searchInput?.addEventListener("input", (e) => {
        currentSearch = e.target.value;
        renderAllProducts();
    });

    categoryFilter?.addEventListener("change", (e) => {
        selectCategory(e.target.value);
    });

    sortFilter?.addEventListener("change", (e) => {
        currentSort = e.target.value;
        renderAllProducts();
    });

    clearFiltersButton?.addEventListener("click", () => {
        currentCategory = "all";
        currentSearch = "";
        currentSort = "default";
        if (searchInput) searchInput.value = "";
        if (categoryFilter) categoryFilter.value = "all";
        if (sortFilter) sortFilter.value = "default";
        renderAllProducts();
    });

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Inicialização
    renderFeatured();
    renderAllProducts();
    updateCartUI();
});
