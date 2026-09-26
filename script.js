"use strict";

/* =========================================================
   TECH BRASIL
   SCRIPT PRINCIPAL
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
   CARRINHO
   ========================================================= */

let cart = [];

try {
    const savedCart = localStorage.getItem("techBrasilCart");

    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
} catch (error) {
    cart = [];
}


/* =========================================================
   CATEGORIAS
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
   FUNÇÕES AUXILIARES
   ========================================================= */

function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

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
   PRODUTOS
   ========================================================= */

function productCard(product) {

    return `
        <article class="product-card">

            <div class="product-image-area">

                ${
                    product.badge
                        ? `<span class="product-badge">
                            ${escapeHTML(product.badge)}
                           </span>`
                        : ""
                }

                <div class="${artClass(product.category)}">
                    <span>
                        ${escapeHTML(product.art)}
                    </span>
                </div>

            </div>

            <div class="product-info">

                <span class="product-category">
                    ${escapeHTML(
                        categoryNames[product.category] || "Produto"
                    )}
                </span>

                <h3 class="product-name">
                    ${escapeHTML(product.name)}
                </h3>

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

                <div class="product-price">

                    <strong>
                        ${money(product.price)}
                    </strong>

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
   RENDERIZAR PRODUTOS
   ========================================================= */

function renderProducts(productsList, containerSelector) {

    const container = $(containerSelector);

    if (!container) {
        return;
    }

    container.innerHTML = productsList
        .map(product => productCard(product))
        .join("");

    bindProductButtons(container);
}


/* =========================================================
   PRODUTOS EM DESTAQUE
   ========================================================= */

function renderFeatured() {

    const container = $("#featuredProducts");

    if (!container) {
        return;
    }

    const featured = products.filter(
        product => product.badge === "Destaque"
    );

    renderProducts(
        featured,
        "#featuredProducts"
    );
}


/* =========================================================
   TODOS OS PRODUTOS
   ========================================================= */

function renderAllProducts() {

    const container = $("#allProducts");

    if (!container) {
        return;
    }

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

    let filteredProducts = [...products];


    /* BUSCA */

    if (searchTerm) {

        filteredProducts = filteredProducts.filter(product => {

            const name =
                product.name.toLowerCase();

            const category =
                (
                    categoryNames[product.category] || ""
                ).toLowerCase();

            const art =
                product.art.toLowerCase();

            return (
                name.includes(searchTerm) ||
                category.includes(searchTerm) ||
                art.includes(searchTerm)
            );
        });
    }


    /* CATEGORIA */

    if (
        selectedCategory &&
        selectedCategory !== "all"
    ) {

        filteredProducts =
            filteredProducts.filter(
                product =>
                    product.category === selectedCategory
            );
    }


    /* ORDENAÇÃO */

    if (selectedSort === "price-low") {

        filteredProducts.sort(
            (a, b) => a.price - b.price
        );

    } else if (selectedSort === "price-high") {

        filteredProducts.sort(
            (a, b) => b.price - a.price
        );

    } else if (selectedSort === "name") {

        filteredProducts.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name,
                    "pt-BR"
                )
        );

    } else {

        filteredProducts.sort((a, b) => {

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
    }


    /* RENDER */

    renderProducts(
        filteredProducts,
        "#allProducts"
    );


    /* ESTADO VAZIO */

    const emptyState =
        $("#emptyState");

    if (emptyState) {

        emptyState.hidden =
            filteredProducts.length !== 0;
    }


    /* CONTADOR */

    const resultText =
        $("#productResultText");

    if (resultText) {

        if (filteredProducts.length === 0) {

            resultText.textContent =
                "Nenhum produto encontrado.";

        } else {

            resultText.textContent =
                `${filteredProducts.length} produtos encontrados.`;
        }
    }
}


/* =========================================================
   BOTÕES DOS PRODUTOS
   ========================================================= */

function bindProductButtons(container) {

    const addButtons =
        container.querySelectorAll(
            ".btn-add-cart"
        );

    addButtons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const productId =
                    Number(
                        this.dataset.productId
                    );

                addToCart(productId);
            }
        );
    });


    const viewButtons =
        container.querySelectorAll(
            ".btn-view-product"
        );

    viewButtons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const productId =
                    Number(
                        this.dataset.productId
                    );

                openProductModal(productId);
            }
        );
    });
}


/* =========================================================
   LOCAL STORAGE DO CARRINHO
   ========================================================= */

function saveCart() {

    localStorage.setItem(
        "techBrasilCart",
        JSON.stringify(cart)
    );
}


/* =========================================================
   ADICIONAR AO CARRINHO
   ========================================================= */

function addToCart(productId) {

    const product =
        products.find(
            item => item.id === productId
        );

    if (!product) {
        return;
    }

    const existingItem =
        cart.find(
            item => item.id === productId
        );

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            id: productId,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();

    showToast(
        "Produto adicionado ao carrinho."
    );

    openCart();
}


/* =========================================================
   REMOVER DO CARRINHO
   ========================================================= */

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart();
    updateCartUI();
}


/* =========================================================
   ALTERAR QUANTIDADE
   ========================================================= */

function changeQuantity(
    productId,
    change
) {

    const item =
        cart.find(
            cartItem =>
                cartItem.id === productId
        );

    if (!item) {
        return;
    }

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    updateCartUI();
}


/* =========================================================
   TOTAL DO CARRINHO
   ========================================================= */

function cartTotals() {

    let quantity = 0;
    let total = 0;

    cart.forEach(item => {

        const product =
            products.find(
                productItem =>
                    productItem.id === item.id
            );

        if (!product) {
            return;
        }

        quantity += item.quantity;

        total +=
            product.price *
            item.quantity;
    });

    return {
        quantity,
        total
    };
}


/* =========================================================
   ATUALIZAR CARRINHO
   ========================================================= */

function updateCartUI() {

    const cartItems =
        $("#cartItems");

    const cartEmpty =
        $("#cartEmpty");

    const cartTotal =
        $("#cartTotal");

    const cartCount =
        $("#cartCount");

    const totals =
        cartTotals();


    /* CONTADOR */

    if (cartCount) {

        cartCount.textContent =
            totals.quantity;
    }


    /* TOTAL */

    if (cartTotal) {

        cartTotal.textContent =
            money(totals.total);
    }


    /* CARRINHO VAZIO */

    if (cart.length === 0) {

        if (cartItems) {
            cartItems.innerHTML = "";
        }

        if (cartEmpty) {
            cartEmpty.hidden = false;
        }

        return;
    }


    if (cartEmpty) {
        cartEmpty.hidden = true;
    }


    if (!cartItems) {
        return;
    }


    cartItems.innerHTML =
        cart.map(item => {

            const product =
                products.find(
                    productItem =>
                        productItem.id === item.id
                );

            if (!product) {
                return "";
            }

            const subtotal =
                product.price *
                item.quantity;

            return `
                <div class="cart-item">

                    <div
                        class="${artClass(product.category)} cart-item-image"
                    >
                        <span>
                            ${escapeHTML(product.art)}
                        </span>
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
                                data-product-id="${product.id}">
                                -
                            </button>

                            <span>
                                ${item.quantity}
                            </span>

                            <button
                                type="button"
                                class="cart-quantity-btn"
                                data-cart-action="increase"
                                data-product-id="${product.id}">
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
        }).join("");


    bindCartButtons(cartItems);
}


/* =========================================================
   BOTÕES DO CARRINHO
   ========================================================= */

function bindCartButtons(container) {

    const buttons =
        container.querySelectorAll(
            "[data-cart-action]"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            function () {

                const action =
                    this.dataset.cartAction;

                const productId =
                    Number(
                        this.dataset.productId
                    );


                if (action === "increase") {

                    changeQuantity(
                        productId,
                        1
                    );
                }


                if (action === "decrease") {

                    changeQuantity(
                        productId,
                        -1
                    );
                }


                if (action === "remove") {

                    removeFromCart(
                        productId
                    );
                }
            }
        );
    });
}


/* =========================================================
   ABRIR CARRINHO
   ========================================================= */

function openCart() {

    const cartDrawer =
        $("#cartDrawer");

    const overlay =
        $("#overlay");

    if (cartDrawer) {

        cartDrawer.classList.add(
            "active"
        );
    }

    if (overlay) {

        overlay.classList.add(
            "active"
        );
    }

    document.body.classList.add(
        "drawer-open"
    );
}


/* =========================================================
   FECHAR CARRINHO
   ========================================================= */

function closeCart() {

    const cartDrawer =
        $("#cartDrawer");

    const overlay =
        $("#overlay");

    if (cartDrawer) {

        cartDrawer.classList.remove(
            "active"
        );
    }

    if (overlay) {

        overlay.classList.remove(
            "active"
        );
    }

    document.body.classList.remove(
        "drawer-open"
    );
}


/* =========================================================
   MODAL DO PRODUTO
   ========================================================= */

function openProductModal(productId) {

    const product =
        products.find(
            item => item.id === productId
        );

    if (!product) {
        return;
    }

    const modal =
        $("#productModal");

    const modalContent =
        $("#modalContent");

    const overlay =
        $("#overlay");

    if (!modal || !modalContent) {
        return;
    }


    modalContent.innerHTML = `

        <div class="product-modal-image">

            <div class="${artClass(product.category)}">

                <span>
                    ${escapeHTML(product.art)}
                </span>

            </div>

        </div>


        <div class="product-modal-info">

            <span class="product-category">
                ${escapeHTML(
                    categoryNames[product.category] ||
                    "Produto"
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
                        categoryNames[product.category] ||
                        "Produto"
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


    modal.classList.add(
        "active"
    );


    if (overlay) {

        overlay.classList.add(
            "active"
        );
    }


    const addButton =
        modalContent.querySelector(
            ".btn-modal-add"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            function () {

                addToCart(
                    Number(
                        this.dataset.productId
                    )
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

    const modal =
        $("#productModal");

    if (modal) {

        modal.classList.remove(
            "active"
        );
    }

    closeOverlayIfUnused();
}


/* =========================================================
   OVERLAY
   ========================================================= */

function closeOverlayIfUnused() {

    const overlay =
        $("#overlay");

    const cartDrawer =
        $("#cartDrawer");

    const modal =
        $("#productModal");


    const cartOpen =
        cartDrawer &&
        cartDrawer.classList.contains(
            "active"
        );

    const modalOpen =
        modal &&
        modal.classList.contains(
            "active"
        );


    if (
        !cartOpen &&
        !modalOpen &&
        overlay
    ) {

        overlay.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "drawer-open"
        );
    }
}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimeout;

function showToast(message) {

    const toast =
        $("#toast");

    if (!toast) {
        return;
    }

    toast.textContent =
        message;

    toast.classList.add(
        "active"
    );

    clearTimeout(
        toastTimeout
    );

    toastTimeout =
        setTimeout(
            () => {

                toast.classList.remove(
                    "active"
                );

            },
            2500
        );
}


/* =========================================================
   FILTROS
   ========================================================= */

function clearFilters() {

    const searchInput =
        $("#searchInput");

    const categoryFilter =
        $("#categoryFilter");

    const sortFilter =
        $("#sortFilter");


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
   CATEGORIA
   ========================================================= */

function selectCategory(category) {

    const categoryFilter =
        $("#categoryFilter");

    if (categoryFilter) {

        categoryFilter.value =
            category;
    }

    renderAllProducts();

    const productsSection =
        $("#produtos");

    if (productsSection) {

        productsSection.scrollIntoView({
            behavior: "smooth"
        });
    }
}


/* =========================================================
   NEWSLETTER
   ========================================================= */

function handleNewsletter(event) {

    event.preventDefault();

    const email =
        $("#newsletterEmail");

    if (!email) {
        return;
    }

    if (!email.value.trim()) {

        showToast(
            "Digite seu e-mail."
        );

        return;
    }

    showToast(
        "Cadastro realizado com sucesso."
    );

    email.value = "";
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

    const categoryNav =
        $("#categoryNav");

    if (!categoryNav) {
        return;
    }

    categoryNav.classList.toggle(
        "active"
    );
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* Ano */

        const currentYear =
            $("#currentYear");

        if (currentYear) {

            currentYear.textContent =
                new Date().getFullYear();
        }


        /* Produtos */

        renderFeatured();

        renderAllProducts();


        /* Carrinho */

        updateCartUI();


        /* Pesquisa */

        const searchForm =
            $("#searchForm");

        if (searchForm) {

            searchForm.addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();

                    renderAllProducts();

                    const productsSection =
                        $("#produtos");

                    if (productsSection) {

                        productsSection.scrollIntoView({
                            behavior: "smooth"
                        });
                    }
                }
            );
        }


        /* Pesquisa em tempo real */

        const searchInput =
            $("#searchInput");

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                renderAllProducts
            );
        }


        /* Categoria */

        const categoryFilter =
            $("#categoryFilter");

        if (categoryFilter) {

            categoryFilter.addEventListener(
                "change",
                renderAllProducts
            );
        }


        /* Ordenação */

        const sortFilter =
            $("#sortFilter");

        if (sortFilter) {

            sortFilter.addEventListener(
                "change",
                renderAllProducts
            );
        }


        /* Limpar filtros */

        const clearFiltersButton =
            $("#clearFilters");

        if (clearFiltersButton) {

            clearFiltersButton.addEventListener(
                "click",
                clearFilters
            );
        }


        /* Categorias do menu */

        $$("[data-category]").forEach(
            element => {

                element.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        selectCategory(
                            this.dataset.category
                        );
                    }
                );
            }
        );


        /* Categorias do rodapé */

        $$("[data-category-link]").forEach(
            element => {

                element.addEventListener(
                    "click",
                    function (event) {

                        event.preventDefault();

                        selectCategory(
                            this.dataset.categoryLink
                        );
                    }
                );
            }
        );


        /* Carrinho */

        const cartButton =
            $("#cartButton");

        if (cartButton) {

            cartButton.addEventListener(
                "click",
                openCart
            );
        }


        const closeCartButton =
            $("#closeCart");

        if (closeCartButton) {

            closeCartButton.addEventListener(
                "click",
                closeCart
            );
        }


        /* Modal */

        const closeModalButton =
            $("#closeProductModal");

        if (closeModalButton) {

            closeModalButton.addEventListener(
                "click",
                closeProductModal
            );
        }


        /* Overlay */

        const overlay =
            $("#overlay");

        if (overlay) {

            overlay.addEventListener(
                "click",
                function () {

                    closeCart();
                    closeProductModal();
                }
            );
        }


        /* Checkout */

        const checkoutButton =
            $("#checkoutButton");

        if (checkoutButton) {

            checkoutButton.addEventListener(
                "click",
                handleCheckout
            );
        }


        /* Conta */

        const accountButton =
            $("#accountButton");

        if (accountButton) {

            accountButton.addEventListener(
                "click",
                handleAccount
            );
        }


        /* Newsletter */

        const newsletterForm =
            $("#newsletterForm");

        if (newsletterForm) {

            newsletterForm.addEventListener(
                "submit",
                handleNewsletter
            );
        }


        /* Menu mobile */

        const mobileMenuButton =
            $("#mobileMenuButton");

        if (mobileMenuButton) {

            mobileMenuButton.addEventListener(
                "click",
                toggleMobileMenu
            );
        }


        /* Botões do estado vazio */

        $$("[data-clear-filters]").forEach(
            button => {

                button.addEventListener(
                    "click",
                    clearFilters
                );
            }
        );


        /* Tecla ESC */

        document.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Escape") {

                    closeCart();
                    closeProductModal();
                }
            }
        );

    }
);
