"use strict";

/* =========================================================
   TECH BRASIL
   JavaScript principal da loja
   ========================================================= */

/* =========================================================
   PRODUTOS
   ========================================================= */

const products = [
    {
        id: 1,
        name: "RTX 4070 12GB",
        category: "gpu",
        price: 3299.90,
        oldPrice: 3599.90,
        installment: "12x de R$ 316,66",
        art: "RTX 4070",
        badge: "Destaque"
    },
    {
        id: 2,
        name: "Ryzen 5 5600",
        category: "cpu",
        price: 749.90,
        oldPrice: 849.90,
        installment: "12x de R$ 72,33",
        art: "RYZEN 5",
        badge: "Oferta"
    },
    {
        id: 3,
        name: "B550 Gaming",
        category: "motherboard",
        price: 1099.90,
        oldPrice: 1199.90,
        installment: "12x de R$ 106,33",
        art: "B550",
        badge: "Destaque"
    },
    {
        id: 4,
        name: "RAM 16GB DDR4",
        category: "ram",
        price: 399.90,
        oldPrice: 449.90,
        installment: "12x de R$ 38,66",
        art: "16GB",
        badge: "Oferta"
    },
    {
        id: 5,
        name: "SSD NVMe 1TB",
        category: "storage",
        price: 449.90,
        oldPrice: 499.90,
        installment: "12x de R$ 43,49",
        art: "1TB",
        badge: "Oferta"
    },
    {
        id: 6,
        name: "PC Gamer Tech Brasil Ryzen 5",
        category: "pc",
        price: 3899.90,
        oldPrice: 4299.90,
        installment: "12x de R$ 377,32",
        art: "PC GAMER",
        badge: "Destaque"
    },
    {
        id: 7,
        name: "Fonte 650W",
        category: "accessories",
        price: 389.90,
        oldPrice: 449.90,
        installment: "12x de R$ 37,77",
        art: "650W",
        badge: "Oferta"
    },
    {
        id: 8,
        name: "Headset Gamer 7.1",
        category: "peripherals",
        price: 249.90,
        oldPrice: 299.90,
        installment: "12x de R$ 24,20",
        art: "7.1",
        badge: "Oferta"
    },
    {
        id: 9,
        name: "RX 7600 8GB",
        category: "gpu",
        price: 1999.90,
        oldPrice: 2199.90,
        installment: "12x de R$ 193,66",
        art: "RX 7600",
        badge: "Destaque"
    },
    {
        id: 10,
        name: "Intel Core i5",
        category: "cpu",
        price: 1199.90,
        oldPrice: 1299.90,
        installment: "12x de R$ 116,16",
        art: "CORE i5",
        badge: "Oferta"
    },
    {
        id: 11,
        name: "RAM 32GB DDR5",
        category: "ram",
        price: 799.90,
        oldPrice: 899.90,
        installment: "12x de R$ 77,49",
        art: "32GB",
        badge: "Destaque"
    },
    {
        id: 12,
        name: "SSD NVMe 2TB",
        category: "storage",
        price: 799.90,
        oldPrice: 899.90,
        installment: "12x de R$ 77,49",
        art: "2TB",
        badge: "Oferta"
    }
];

/* =========================================================
   CONFIGURAÇÕES
   ========================================================= */

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

/* =========================================================
   ESTADO
   ========================================================= */

let currentProducts = [...products];
let cart = [];

/* =========================================================
   LOCAL STORAGE
   ========================================================= */

function loadCart() {
    try {
        const savedCart = localStorage.getItem("techBrasilCart");

        if (!savedCart) {
            cart = [];
            return;
        }

        const parsedCart = JSON.parse(savedCart);

        cart = Array.isArray(parsedCart)
            ? parsedCart
            : [];

    } catch (error) {
        console.warn("Não foi possível carregar o carrinho:", error);
        cart = [];
    }
}

function saveCart() {
    try {
        localStorage.setItem(
            "techBrasilCart",
            JSON.stringify(cart)
        );
    } catch (error) {
        console.warn("Não foi possível salvar o carrinho:", error);
    }
}

/* =========================================================
   SELETORES
   ========================================================= */

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return Array.from(document.querySelectorAll(selector));
}

/* =========================================================
   EVENTOS SEGUROS
   ========================================================= */

function addEvent(selector, eventName, handler) {
    const element = $(selector);

    if (!element) {
        return;
    }

    element.addEventListener(eventName, handler);
}

/* =========================================================
   UTILITÁRIOS
   ========================================================= */

function money(value) {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL"
    }).format(value);
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function artClass(category) {
    return `product-art product-art-${category}`;
}

/* =========================================================
   PRODUTO
   ========================================================= */

function getProductById(productId) {
    return products.find(
        product => product.id === Number(productId)
    );
}

function productCard(product) {
    return `
        <article class="product-card" data-product-id="${product.id}">

            <div class="product-image-area">

                ${
                    product.badge
                        ? `<span class="product-badge">${escapeHTML(product.badge)}</span>`
                        : ""
                }

                <div class="${artClass(product.category)}">
                    <span>${escapeHTML(product.art)}</span>
                </div>

            </div>

            <div class="product-info">

                <span class="product-category">
                    ${escapeHTML(categoryNames[product.category] || "Produto")}
                </span>

                <h3 class="product-name">
                    ${escapeHTML(product.name)}
                </h3>

                <div class="product-rating">
                    <span class="rating-stars" aria-label="5 estrelas">
                        5/5
                    </span>
                </div>

                <div class="product-price">

                    ${
                        product.oldPrice
                            ? `<span class="product-old-price">${money(product.oldPrice)}</span>`
                            : ""
                    }

                    <strong>${money(product.price)}</strong>

                </div>

                <p class="product-installment">
                    ${escapeHTML(product.installment)}
                </p>

                <div class="product-actions">

                    <button
                        type="button"
                        class="btn btn-secondary btn-view-product"
                        data-product-id="${product.id}">
                        Ver produto
                    </button>

                    <button
                        type="button"
                        class="btn btn-primary btn-add-cart"
                        data-product-id="${product.id}">
                        Adicionar
                    </button>

                </div>

            </div>

        </article>
    `;
}

/* =========================================================
   RENDERIZAÇÃO DOS PRODUTOS
   ========================================================= */

function renderProducts(list, containerSelector) {
    const container = $(containerSelector);

    if (!container) {
        return;
    }

    if (!Array.isArray(list) || list.length === 0) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = list
        .map(product => productCard(product))
        .join("");
}

/* =========================================================
   PRODUTOS EM DESTAQUE
   ========================================================= */

function renderFeatured() {
    const featuredContainer = $("#featuredProducts");

    if (!featuredContainer) {
        return;
    }

    const featured = products.filter(
        product => product.badge === "Destaque"
    );

    renderProducts(featured, "#featuredProducts");

    bindProductButtons(featuredContainer);
}

/* =========================================================
   FILTROS
   ========================================================= */

function getFilteredProducts() {
    const searchInput = $("#searchInput");
    const categoryFilter = $("#categoryFilter");
    const sortFilter = $("#sortFilter");

    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const selectedCategory = categoryFilter
        ? categoryFilter.value
        : "all";

    const selectedSort = sortFilter
        ? sortFilter.value
        : "featured";

    let filtered = [...products];

    /* Busca */

    if (searchTerm) {
        filtered = filtered.filter(product => {
            const productName = product.name.toLowerCase();

            const categoryName = (
                categoryNames[product.category] || ""
            ).toLowerCase();

            const art = product.art.toLowerCase();

            return (
                productName.includes(searchTerm) ||
                categoryName.includes(searchTerm) ||
                art.includes(searchTerm)
            );
        });
    }

    /* Categoria */

    if (
        selectedCategory &&
        selectedCategory !== "all"
    ) {
        filtered = filtered.filter(
            product => product.category === selectedCategory
        );
    }

    /* Ordenação */

    switch (selectedSort) {

        case "price-low":
            filtered.sort(
                (a, b) => a.price - b.price
            );
            break;

        case "price-high":
            filtered.sort(
                (a, b) => b.price - a.price
            );
            break;

        case "name":
            filtered.sort(
                (a, b) =>
                    a.name.localeCompare(
                        b.name,
                        "pt-BR"
                    )
            );
            break;

        case "featured":
        default:
            filtered.sort((a, b) => {

                if (
                    a.badge === "Destaque" &&
                    b.badge !== "Destaque"
                ) {
                    return -1;
                }

                if (
                    a.badge !== "Destaque" &&
                    b.badge === "Destaque"
                ) {
                    return 1;
                }

                return a.id - b.id;
            });

            break;
    }

    return filtered;
}

/* =========================================================
   TODOS OS PRODUTOS
   ========================================================= */

function renderAllProducts() {
    const productsContainer = $("#allProducts");

    if (!productsContainer) {
        console.warn(
            "Elemento #allProducts não encontrado no HTML."
        );

        return;
    }

    const filtered = getFilteredProducts();

    currentProducts = filtered;

    renderProducts(
        filtered,
        "#allProducts"
    );

    bindProductButtons(productsContainer);

    const emptyState = $("#emptyState");

    if (emptyState) {
        emptyState.hidden = filtered.length !== 0;
    }

    const resultText = $("#productResultText");

    if (resultText) {

        if (filtered.length === 0) {
            resultText.textContent =
                "Nenhum produto encontrado.";
        } else if (filtered.length === 1) {
            resultText.textContent =
                "1 produto encontrado.";
        } else {
            resultText.textContent =
                `${filtered.length} produtos encontrados.`;
        }
    }
}

/* =========================================================
   BOTÕES DOS PRODUTOS
   ========================================================= */

function bindProductButtons(container) {
    if (!container) {
        return;
    }

    const addButtons = container.querySelectorAll(
        ".btn-add-cart"
    );

    addButtons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const productId =
                    Number(this.dataset.productId);

                addToCart(productId);
            }
        );

    });

    const viewButtons = container.querySelectorAll(
        ".btn-view-product"
    );

    viewButtons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const productId =
                    Number(this.dataset.productId);

                openProductModal(productId);
            }
        );

    });
}

/* =========================================================
   CARRINHO
   ========================================================= */

function addToCart(productId) {

    const product = getProductById(productId);

    if (!product) {
        return;
    }

    const existingItem = cart.find(
        item => Number(item.id) === product.id
    );

    if (existingItem) {
        existingItem.quantity =
            Number(existingItem.quantity || 0) + 1;
    } else {
        cart.push({
            id: product.id,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showToast("Produto adicionado ao carrinho.");

    openCart();
}

function removeFromCart(productId) {

    cart = cart.filter(
        item => Number(item.id) !== Number(productId)
    );

    saveCart();
    updateCartUI();
}

function changeQuantity(productId, change) {

    const item = cart.find(
        cartItem =>
            Number(cartItem.id) === Number(productId)
    );

    if (!item) {
        return;
    }

    item.quantity =
        Number(item.quantity || 0) + Number(change);

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    updateCartUI();
}

/* =========================================================
   TOTAIS DO CARRINHO
   ========================================================= */

function cartTotals() {

    let quantity = 0;
    let total = 0;

    cart.forEach(item => {

        const product = getProductById(item.id);

        if (!product) {
            return;
        }

        const itemQuantity =
            Number(item.quantity || 0);

        quantity += itemQuantity;
        total += product.price * itemQuantity;
    });

    return {
        quantity,
        total
    };
}

/* =========================================================
   INTERFACE DO CARRINHO
   ========================================================= */

function updateCartUI() {

    const cartItemsContainer = $("#cartItems");
    const cartEmpty = $("#cartEmpty");
    const cartTotal = $("#cartTotal");
    const cartCount = $("#cartCount");
    const checkoutButton = $("#checkoutButton");

    const totals = cartTotals();

    /* Contador */

    if (cartCount) {
        cartCount.textContent = totals.quantity;
    }

    /* Total */

    if (cartTotal) {
        cartTotal.textContent =
            money(totals.total);
    }

    /* Botão finalizar */

    if (checkoutButton) {
        checkoutButton.disabled =
            cart.length === 0;
    }

    /* Carrinho vazio */

    if (cart.length === 0) {

        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = "";
        }

        if (cartEmpty) {
            cartEmpty.hidden = false;
        }

        return;
    }

    if (cartEmpty) {
        cartEmpty.hidden = true;
    }

    if (!cartItemsContainer) {
        return;
    }

    cartItemsContainer.innerHTML = cart
        .map(item => {

            const product =
                getProductById(item.id);

            if (!product) {
                return "";
            }

            const quantity =
                Number(item.quantity || 1);

            const subtotal =
                product.price * quantity;

            return `
                <div class="cart-item">

                    <div class="${artClass(product.category)} cart-item-image">
                        <span>${escapeHTML(product.art)}</span>
                    </div>

                    <div class="cart-item-info">

                        <h4>
                            ${escapeHTML(product.name)}
                        </h4>

                        <span>
                            ${money(product.price)}
                        </span>

                        <div class="cart-item-controls">

                            <button
                                type="button"
                                class="cart-quantity-btn"
                                data-cart-action="decrease"
                                data-product-id="${product.id}"
                                aria-label="Diminuir quantidade">
                                -
                            </button>

                            <span>
                                ${quantity}
                            </span>

                            <button
                                type="button"
                                class="cart-quantity-btn"
                                data-cart-action="increase"
                                data-product-id="${product.id}"
                                aria-label="Aumentar quantidade">
                                +
                            </button>

                        </div>

                        <strong>
                            ${money(subtotal)}
                        </strong>

                        <button
                            type="button"
                            class="cart-remove"
                            data-cart-action="remove"
                            data-product-id="${product.id}">
                            Remover
                        </button>

                    </div>

                </div>
            `;
        })
        .join("");

    bindCartButtons(cartItemsContainer);
}

/* =========================================================
   BOTÕES DO CARRINHO
   ========================================================= */

function bindCartButtons(container) {

    if (!container) {
        return;
    }

    const buttons = container.querySelectorAll(
        "[data-cart-action]"
    );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const action =
                    this.dataset.cartAction;

                const productId =
                    Number(this.dataset.productId);

                if (action === "increase") {
                    changeQuantity(productId, 1);
                }

                if (action === "decrease") {
                    changeQuantity(productId, -1);
                }

                if (action === "remove") {
                    removeFromCart(productId);
                }
            }
        );
    });
}

/* =========================================================
   ABRIR CARRINHO
   ========================================================= */

function openCart() {

    const cartDrawer = $("#cartDrawer");
    const overlay = $("#overlay");

    if (!cartDrawer) {
        return;
    }

    cartDrawer.classList.add("active");

    if (overlay) {
        overlay.classList.add("active");
    }

    document.body.classList.add("drawer-open");
}

/* =========================================================
   FECHAR CARRINHO
   ========================================================= */

function closeCart() {

    const cartDrawer = $("#cartDrawer");
    const overlay = $("#overlay");

    if (cartDrawer) {
        cartDrawer.classList.remove("active");
    }

    if (overlay) {
        overlay.classList.remove("active");
    }

    document.body.classList.remove("drawer-open");
}

/* =========================================================
   MODAL DE PRODUTO
   ========================================================= */

function openProductModal(productId) {

    const product = getProductById(productId);

    if (!product) {
        return;
    }

    const modal = $("#productModal");
    const modalContent = $("#modalContent");
    const overlay = $("#overlay");

    if (!modal || !modalContent) {
        return;
    }

    modalContent.innerHTML = `
        <div class="product-modal-image">

            <div class="${artClass(product.category)}">
                <span>${escapeHTML(product.art)}</span>
            </div>

        </div>

        <div class="product-modal-info">

            <span class="product-category">
                ${escapeHTML(
                    categoryNames[product.category] || "Produto"
                )}
            </span>

            <h2>
                ${escapeHTML(product.name)}
            </h2>

            <div class="product-rating">
                <span class="rating-stars">
                    5/5
                </span>
            </div>

            ${
                product.oldPrice
                    ? `
                        <span class="product-old-price">
                            ${money(product.oldPrice)}
                        </span>
                    `
                    : ""
            }

            <div class="modal-price">
                ${money(product.price)}
            </div>

            <p class="product-installment">
                ${escapeHTML(product.installment)}
            </p>

            <div class="modal-category">
                Categoria:
                <strong>
                    ${escapeHTML(
                        categoryNames[product.category] || "Produto"
                    )}
                </strong>
            </div>

            <button
                type="button"
                class="btn btn-primary btn-modal-add"
                data-product-id="${product.id}">
                Adicionar ao carrinho
            </button>

        </div>
    `;

    modal.classList.add("active");

    if (overlay) {
        overlay.classList.add("active");
    }

    const modalAddButton =
        modalContent.querySelector(
            ".btn-modal-add"
        );

    if (modalAddButton) {

        modalAddButton.addEventListener(
            "click",
            function () {

                addToCart(
                    Number(this.dataset.productId)
                );

                closeProductModal();
            }
        );
    }
}

/* =========================================================
   FECHAR MODAL
   ========================================================= */

function closeProductModal() {

    const modal = $("#productModal");

    if (modal) {
        modal.classList.remove("active");
    }

    closeOverlayIfUnused();
}

/* =========================================================
   OVERLAY
   ========================================================= */

function closeOverlayIfUnused() {

    const overlay = $("#overlay");
    const cartDrawer = $("#cartDrawer");
    const productModal = $("#productModal");

    if (!overlay) {
        return;
    }

    const cartOpen =
        cartDrawer &&
        cartDrawer.classList.contains("active");

    const modalOpen =
        productModal &&
        productModal.classList.contains("active");

    if (!cartOpen && !modalOpen) {
        overlay.classList.remove("active");
        document.body.classList.remove("drawer-open");
    }
}

function handleOverlayClick() {

    const cartDrawer = $("#cartDrawer");
    const productModal = $("#productModal");

    if (
        cartDrawer &&
        cartDrawer.classList.contains("active")
    ) {
        closeCart();
    }

    if (
        productModal &&
        productModal.classList.contains("active")
    ) {
        closeProductModal();
    }

    closeOverlayIfUnused();
}

/* =========================================================
   TOAST
   ========================================================= */

let toastTimeout = null;

function showToast(message) {

    const toast = $("#toast");

    if (!toast) {
        return;
    }

    toast.textContent = message;
    toast.classList.add("active");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
        toast.classList.remove("active");
    }, 2500);
}

/* =========================================================
   FILTRO POR CATEGORIA
   ========================================================= */

function selectCategory(category) {

    const categoryFilter = $("#categoryFilter");

    if (categoryFilter) {
        categoryFilter.value = category;
    }

    renderAllProducts();

    const productsSection =
        $("#produtos");

    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

/* =========================================================
   LIMPAR FILTROS
   ========================================================= */

function clearFilters() {

    const searchInput = $("#searchInput");
    const categoryFilter = $("#categoryFilter");
    const sortFilter = $("#sortFilter");

    if (searchInput) {
        searchInput.value = "";
    }

    if (categoryFilter) {
        categoryFilter.value = "all";
    }

    if (sortFilter) {
        sortFilter.value = "featured";
    }

    renderAllProducts();
}

/* =========================================================
   PESQUISA
   ========================================================= */

function handleSearch(event) {

    event.preventDefault();

    renderAllProducts();

    const productsSection =
        $("#produtos");

    if (productsSection) {
        productsSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

/* =========================================================
   NEWSLETTER
   ========================================================= */

function handleNewsletter(event) {

    event.preventDefault();

    const emailInput = $("#newsletterEmail");

    if (!emailInput) {
        return;
    }

    const email = emailInput.value.trim();

    if (!email) {
        showToast("Digite seu e-mail.");
        return;
    }

    showToast(
        "Cadastro realizado com sucesso."
    );

    emailInput.value = "";
}

/* =========================================================
   CHECKOUT
   ========================================================= */

function handleCheckout() {

    if (cart.length === 0) {
        showToast(
            "Seu carrinho está vazio."
        );

        return;
    }

    showToast(
        "Checkout será disponibilizado em breve."
    );
}

/* =========================================================
   CONTA
   ========================================================= */

function handleAccount() {

    showToast(
        "Área da conta será disponibilizada em breve."
    );
}

/* =========================================================
   MENU MOBILE
   ========================================================= */

function toggleMobileMenu() {

    const categoryNav = $("#categoryNav");

    if (!categoryNav) {
        return;
    }

    categoryNav.classList.toggle("active");
}

/* =========================================================
   EVENTOS DE CATEGORIA
   ========================================================= */

function bindCategoryEvents() {

    $$("[data-category]").forEach(element => {

        element.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const category =
                    this.dataset.category;

                if (!category) {
                    return;
                }

                selectCategory(category);
            }
        );
    });

    $$("[data-category-link]").forEach(element => {

        element.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const category =
                    this.dataset.categoryLink;

                if (!category) {
                    return;
                }

                selectCategory(category);
            }
        );
    });
}

/* =========================================================
   TECLA ESC
   ========================================================= */

function bindEscapeKey() {

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key !== "Escape") {
                return;
            }

            const cartDrawer = $("#cartDrawer");
            const productModal = $("#productModal");

            if (
                cartDrawer &&
                cartDrawer.classList.contains("active")
            ) {
                closeCart();
            }

            if (
                productModal &&
                productModal.classList.contains("active")
            ) {
                closeProductModal();
            }

            closeOverlayIfUnused();
        }
    );
}

/* =========================================================
   EVENTOS PRINCIPAIS
   ========================================================= */

function bindEvents() {

    addEvent(
        "#searchForm",
        "submit",
        handleSearch
    );

    addEvent(
        "#searchInput",
        "input",
        renderAllProducts
    );

    addEvent(
        "#categoryFilter",
        "change",
        renderAllProducts
    );

    addEvent(
        "#sortFilter",
        "change",
        renderAllProducts
    );

    addEvent(
        "#cartButton",
        "click",
        openCart
    );

    addEvent(
        "#closeCart",
        "click",
        closeCart
    );

    addEvent(
        "#closeProductModal",
        "click",
        closeProductModal
    );

    addEvent(
        "#overlay",
        "click",
        handleOverlayClick
    );

    addEvent(
        "#checkoutButton",
        "click",
        handleCheckout
    );

    addEvent(
        "#clearFilters",
        "click",
        clearFilters
    );

    addEvent(
        "#accountButton",
        "click",
        handleAccount
    );

    addEvent(
        "#newsletterForm",
        "submit",
        handleNewsletter
    );

    addEvent(
        "#mobileMenuButton",
        "click",
        toggleMobileMenu
    );

    bindCategoryEvents();
    bindEscapeKey();
}

/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function initTechBrasil() {

    console.info(
        "Tech Brasil: JavaScript carregado."
    );

    loadCart();

    const currentYear = $("#currentYear");

    if (currentYear) {
        currentYear.textContent =
            new Date().getFullYear();
    }

    bindEvents();

    renderFeatured();

    renderAllProducts();

    updateCartUI();

    console.info(
        "Tech Brasil: produtos carregados:",
        products.length
    );
}

/* =========================================================
   GARANTE QUE O HTML ESTEJA CARREGADO
   ========================================================= */

if (document.readyState === "loading") {

    document.addEventListener(
        "DOMContentLoaded",
        initTechBrasil
    );

} else {

    initTechBrasil();

}
