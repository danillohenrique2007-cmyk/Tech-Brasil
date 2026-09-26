console.log("TECH BRASIL - SCRIPT CARREGADO");
// ============================================================
// TECH BRASIL — SCRIPT PRINCIPAL
// Catálogo, pesquisa, filtros, carrinho e detalhes dos produtos
// ============================================================

const products = [
    {
        id: 1,
        name: "Placa de Vídeo RTX 4070 12GB",
        category: "gpu",
        badge: "Mais vendido",
        price: 3299.90,
        oldPrice: 3699.90,
        rating: 4.9,
        reviews: 126,
        art: "RTX 4070",
        description: "Placa de vídeo de alto desempenho para jogos em alta resolução, criação de conteúdo e aplicações gráficas."
    },
    {
        id: 2,
        name: "Processador AMD Ryzen 5 5600",
        category: "cpu",
        badge: "Oferta",
        price: 749.90,
        oldPrice: 899.90,
        rating: 4.8,
        reviews: 94,
        art: "RYZEN 5",
        description: "Processador de 6 núcleos e 12 threads para gaming, estudos, trabalho e uso diário."
    },
    {
        id: 3,
        name: "Placa-Mãe B550 Gaming",
        category: "motherboard",
        badge: "Destaque",
        price: 1099.90,
        oldPrice: null,
        rating: 4.8,
        reviews: 76,
        art: "B550",
        description: "Placa-mãe AM4 com recursos para gaming e upgrades, oferecendo conectividade e estabilidade."
    },
    {
        id: 4,
        name: "Memória RAM 16GB DDR4 3200MHz",
        category: "ram",
        badge: "Oferta",
        price: 399.90,
        oldPrice: 459.90,
        rating: 4.9,
        reviews: 143,
        art: "16GB",
        description: "Memória de 16GB para melhorar multitarefa, jogos e produtividade."
    },
    {
        id: 5,
        name: "SSD NVMe M.2 1TB",
        category: "storage",
        badge: "Mais vendido",
        price: 449.90,
        oldPrice: 599.90,
        rating: 4.9,
        reviews: 187,
        art: "1TB",
        description: "Armazenamento NVMe de alta velocidade para sistema operacional, jogos e arquivos."
    },
    {
        id: 6,
        name: "PC Gamer Tech Brasil Ryzen 5",
        category: "pc",
        badge: "Lançamento",
        price: 3899.90,
        oldPrice: 4299.90,
        rating: 4.8,
        reviews: 52,
        art: "PC GAMER",
        description: "Computador montado para gaming e produtividade, com componentes selecionados para equilíbrio de desempenho."
    },
    {
        id: 7,
        name: "Fonte 650W 80 Plus Bronze",
        category: "accessories",
        badge: "Destaque",
        price: 389.90,
        oldPrice: null,
        rating: 4.7,
        reviews: 88,
        art: "650W",
        description: "Fonte de alimentação de 650W para configurações de médio e alto desempenho."
    },
    {
        id: 8,
        name: "Headset Gamer Surround 7.1",
        category: "peripherals",
        badge: "Oferta",
        price: 249.90,
        oldPrice: 299.90,
        rating: 4.7,
        reviews: 61,
        art: "7.1",
        description: "Headset confortável com áudio imersivo para jogos, chamadas e entretenimento."
    },
    {
        id: 9,
        name: "Placa de Vídeo RX 7600 8GB",
        category: "gpu",
        badge: "Oferta",
        price: 1999.90,
        oldPrice: 2299.90,
        rating: 4.8,
        reviews: 73,
        art: "RX 7600",
        description: "GPU para gaming em Full HD com ótimo equilíbrio entre desempenho e recursos gráficos."
    },
    {
        id: 10,
        name: "Processador Intel Core i5",
        category: "cpu",
        badge: "Destaque",
        price: 1199.90,
        oldPrice: null,
        rating: 4.8,
        reviews: 57,
        art: "CORE i5",
        description: "Processador Intel para computadores de alto desempenho em jogos e produtividade."
    },
    {
        id: 11,
        name: "Memória RAM 32GB DDR5",
        category: "ram",
        badge: "Novo",
        price: 799.90,
        oldPrice: 899.90,
        rating: 4.9,
        reviews: 41,
        art: "32GB",
        description: "Kit de memória DDR5 de 32GB para máquinas modernas e aplicações exigentes."
    },
    {
        id: 12,
        name: "SSD NVMe M.2 2TB",
        category: "storage",
        badge: "Oferta",
        price: 799.90,
        oldPrice: 949.90,
        rating: 4.9,
        reviews: 92,
        art: "2TB",
        description: "2TB de armazenamento rápido para uma biblioteca maior de jogos e arquivos."
    }
];

// ============================================================
// ESTADO DO SITE
// ============================================================

let cart = JSON.parse(
    localStorage.getItem("techBrasilCart") || "[]"
);

let currentProducts = [...products];

// ============================================================
// ELEMENTOS AUXILIARES
// ============================================================

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => [
    ...document.querySelectorAll(selector)
];

// ============================================================
// FORMATAÇÃO DE VALORES
// ============================================================

const money = (value) =>
    value.toLocaleString("pt-BR", {
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
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[char]));
}

// ============================================================
// CLASSES VISUAIS DOS PRODUTOS
// ============================================================

function artClass(category) {
    return {
        gpu: "art-gpu",
        cpu: "art-cpu",
        motherboard: "art-board",
        ram: "art-ram",
        storage: "art-ssd",
        pc: "art-pc",
        peripherals: "art-peripheral",
        accessories: "art-accessory"
    }[category] || "";
}

// ============================================================
// CRIAÇÃO DOS CARDS DE PRODUTOS
// ============================================================

function productCard(product) {
    return `
        <article class="product-card">

            <div class="product-image">

                <span class="product-badge">
                    ${escapeHTML(product.badge)}
                </span>

                <div class="product-art ${artClass(product.category)}">
                    ${escapeHTML(product.art)}
                </div>

            </div>

            <div class="product-info">

                <span class="product-category">
                    ${escapeHTML(categoryNames[product.category])}
                </span>

                <h3 class="product-name">
                    ${escapeHTML(product.name)}
                </h3>

                <div class="rating">
                    ★★★★★
                    <span>(${product.reviews})</span>
                </div>

                <div class="product-price">

                    ${
                        product.oldPrice
                            ? `
                                <span class="old-price">
                                    ${money(product.oldPrice)}
                                </span>
                            `
                            : `
                                <span class="old-price">&nbsp;</span>
                            `
                    }

                    <strong class="price">
                        ${money(product.price)}
                    </strong>

                    <span class="installments">
                        ou em até 10x no cartão
                    </span>

                </div>

                <div class="product-actions">

                    <button
                        class="add-cart"
                        data-add="${product.id}"
                    >
                        Adicionar ao carrinho
                    </button>

                    <button
                        class="quick-view"
                        data-view="${product.id}"
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

    $$("[data-add]").forEach(button => {

        button.addEventListener("click", () => {

            addToCart(Number(button.dataset.add));

        });

    });

    $$("[data-view]").forEach(button => {

        button.addEventListener("click", () => {

            openProductModal(Number(button.dataset.view));

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

    const searchTerm = $("#searchInput")
        .value
        .trim()
        .toLowerCase();

    const category = $("#categoryFilter").value;

    const sort = $("#sortFilter").value;

    let list = products.filter(product => {

        const matchesSearch =
            !searchTerm ||
            product.name.toLowerCase().includes(searchTerm) ||
            categoryNames[product.category]
                .toLowerCase()
                .includes(searchTerm) ||
            product.art.toLowerCase().includes(searchTerm);

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

    $("#emptyState").hidden = list.length !== 0;

    $("#productResultText").textContent =
        `${list.length} ${
            list.length === 1
                ? "produto encontrado"
                : "produtos encontrados"
        }.`;

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

    $("#cartCount").textContent = quantity;

    $("#cartTotal").textContent = money(total);

    const container = $("#cartItems");

    const empty = $("#cartEmpty");

    if (!cart.length) {

        container.innerHTML = "";

        empty.style.display = "grid";

        return;

    }

    empty.style.display = "none";

    container.innerHTML = cart.map(item => {

        const product = products.find(
            productItem => productItem.id === item.id
        );

        if (!product) return "";

        return `
            <div class="cart-item">

                <div class="cart-item-art">
                    ${escapeHTML(product.art)}
                </div>

                <div>

                    <strong>
                        ${escapeHTML(product.name)}
                    </strong>

                    <small>
                        ${money(product.price)} cada
                    </small>

                    <div class="qty-controls">

                        <button
                            data-minus="${product.id}"
                            aria-label="Diminuir quantidade"
                        >
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button
                            data-plus="${product.id}"
                            aria-label="Aumentar quantidade"
                        >
                            +
                        </button>

                        <button
                            class="remove-item"
                            data-remove="${product.id}"
                        >
                            Remover
                        </button>

                    </div>

                </div>

                <strong>
                    ${money(product.price * item.quantity)}
                </strong>

            </div>
        `;

    }).join("");

    $$("[data-minus]").forEach(button => {

        button.addEventListener("click", () => {

            changeQuantity(
                Number(button.dataset.minus),
                -1
            );

        });

    });

    $$("[data-plus]").forEach(button => {

        button.addEventListener("click", () => {

            changeQuantity(
                Number(button.dataset.plus),
                1
            );

        });

    });

    $$("[data-remove]").forEach(button => {

        button.addEventListener("click", () => {

            removeFromCart(
                Number(button.dataset.remove)
            );

        });

    });

}

// ============================================================
// ABRIR E FECHAR CARRINHO
// ============================================================

function openCart() {

    $("#cartDrawer").classList.add("active");

    $("#cartDrawer").setAttribute(
        "aria-hidden",
        "false"
    );

    $("#overlay").classList.add("active");

    document.body.classList.add("no-scroll");

}

function closeCart() {

    $("#cartDrawer").classList.remove("active");

    $("#cartDrawer").setAttribute(
        "aria-hidden",
        "true"
    );

    closeOverlayIfUnused();

}

// ============================================================
// CONTROLE DO FUNDO ESCURO
// ============================================================

function closeOverlayIfUnused() {

    const modalOpen =
        $("#productModal").classList.contains("active");

    const cartOpen =
        $("#cartDrawer").classList.contains("active");

    if (!modalOpen && !cartOpen) {

        $("#overlay").classList.remove("active");

        document.body.classList.remove("no-scroll");

    }

}

// ============================================================
// ABRIR DETALHES DO PRODUTO
// ============================================================

function openProductModal(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    $("#modalContent").innerHTML = `
        <div class="modal-product">

            <div class="modal-product-image">

                <div class="product-art ${artClass(product.category)}">
                    ${escapeHTML(product.art)}
                </div>

            </div>

            <div class="modal-product-info">

                <span class="section-kicker">
                    ${escapeHTML(categoryNames[product.category])}
                </span>

                <h2>
                    ${escapeHTML(product.name)}
                </h2>

                <div class="rating">
                    ★★★★★
                    <span>
                        ${product.rating}/5
                        (${product.reviews} avaliações)
                    </span>
                </div>

                <p>
                    ${escapeHTML(product.description)}
                </p>

                ${
                    product.oldPrice
                        ? `
                            <span class="old-price">
                                ${money(product.oldPrice)}
                            </span>
                        `
                        : ""
                }

                <div class="modal-price">
                    ${money(product.price)}
                </div>

                <button
                    class="btn btn-primary"
                    id="modalAddButton"
                >
                    Adicionar ao carrinho
                </button>

            </div>

        </div>
    `;

    $("#modalAddButton").addEventListener(
        "click",
        () => {

            addToCart(product.id);

            closeProductModal();

            openCart();

        }
    );

    $("#productModal").classList.add("active");

    $("#productModal").setAttribute(
        "aria-hidden",
        "false"
    );

    $("#overlay").classList.add("active");

    document.body.classList.add("no-scroll");

}

// ============================================================
// FECHAR DETALHES DO PRODUTO
// ============================================================

function closeProductModal() {

    $("#productModal").classList.remove("active");

    $("#productModal").setAttribute(
        "aria-hidden",
        "true"
    );

    closeOverlayIfUnused();

}

// ============================================================
// NOTIFICAÇÕES
// ============================================================

function showToast(message) {

    const toast = $("#toast");

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

    $("#categoryFilter").value = category;

    renderAllProducts();

    document
        .getElementById("produtos")
        .scrollIntoView({
            behavior: "smooth"
        });

}

// ============================================================
// EVENTOS DA PESQUISA
// ============================================================

$("#searchForm").addEventListener(
    "submit",
    event => {

        event.preventDefault();

        renderAllProducts();

        document
            .getElementById("produtos")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);

$("#searchInput").addEventListener(
    "input",
    renderAllProducts
);

// ============================================================
// EVENTOS DOS FILTROS
// ============================================================

$("#categoryFilter").addEventListener(
    "change",
    renderAllProducts
);

$("#sortFilter").addEventListener(
    "change",
    renderAllProducts
);

// ============================================================
// CLIQUES NAS CATEGORIAS
// ============================================================

$$("[data-category]").forEach(button => {

    button.addEventListener("click", () => {

        scrollToProducts(button.dataset.category);

    });

});

$$("[data-category-link]").forEach(link => {

    link.addEventListener("click", event => {

        event.preventDefault();

        scrollToProducts(
            link.dataset.categoryLink
        );

    });

});

// ============================================================
// EVENTOS DO CARRINHO E DO MODAL
// ============================================================

$("#cartButton").addEventListener(
    "click",
    openCart
);

$("#closeCart").addEventListener(
    "click",
    closeCart
);

$("#closeProductModal").addEventListener(
    "click",
    closeProductModal
);

$("#overlay").addEventListener("click", () => {

    closeCart();

    closeProductModal();

});

// Fechar janelas com a tecla Escape
document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        closeCart();

        closeProductModal();

    }

});

// ============================================================
// FINALIZAÇÃO DO PEDIDO
// ============================================================

$("#checkoutButton").addEventListener(
    "click",
    () => {

        if (!cart.length) {

            showToast("Seu carrinho está vazio.");

            return;

        }

        showToast(
            "Checkout preparado. O pagamento será conectado na próxima etapa."
        );

    }
);

// ============================================================
// LIMPAR PESQUISA E FILTROS
// ============================================================

$("#clearFilters").addEventListener(
    "click",
    () => {

        $("#searchInput").value = "";

        $("#categoryFilter").value = "all";

        $("#sortFilter").value = "featured";

        renderAllProducts();

    }
);

// ============================================================
// MINHA CONTA
// ============================================================

$("#accountButton").addEventListener(
    "click",
    () => {

        showToast(
            "A área de conta será conectada na próxima etapa."
        );

    }
);

// ============================================================
// NEWSLETTER
// ============================================================

$("#newsletterForm").addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const email = $("#newsletterEmail")
            .value
            .trim();

        if (!email) return;

        $("#newsletterForm").reset();

        showToast(
            "Cadastro realizado. Obrigado por acompanhar a Tech Brasil!"
        );

    }
);

// ============================================================
// MENU MOBILE
// ============================================================

$("#mobileMenuButton").addEventListener(
    "click",
    () => {

        const nav = $("#categoryNav");

        const button = $("#mobileMenuButton");

        const isOpen =
            nav.classList.toggle("mobile-open");

        button.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    }
);

// ============================================================
// ANO AUTOMÁTICO NO RODAPÉ
// ============================================================

$("#currentYear").textContent =
    new Date().getFullYear();

// ============================================================
// INICIALIZAÇÃO
// ============================================================

renderFeatured();

renderAllProducts();

updateCartUI();
