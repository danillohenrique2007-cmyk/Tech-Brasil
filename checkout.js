import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

let cart = JSON.parse(localStorage.getItem("techBrasilCart") || "[]");
let productsData = [];

const money = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

async function initCheckout() {
    // Buscar produtos do Firestore para garantir preços atualizados
    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        querySnapshot.forEach((docSnap) => {
            const p = docSnap.data();
            productsData.push({
                id: docSnap.id,
                name: p.name || p.nome || "Produto",
                price: Number(p.price || p.preco || 0),
                image: p.image || p.imagem || ""
            });
        });
    } catch (e) {
        console.error("Erro ao carregar produtos:", e);
    }

    renderCheckoutSummary();
}

function renderCheckoutSummary() {
    const container = document.getElementById("checkoutItemsList");
    const totalEl = document.getElementById("checkoutTotal");
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = "<p style='color: #9aa8a2;'>Seu carrinho está vazio.</p>";
        if (totalEl) totalEl.textContent = money(0);
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        const product = productsData.find(p => p.id === item.id) || { name: "Produto", price: 0 };
        const subtotal = product.price * item.quantity;
        total += subtotal;

        return `
            <div class="order-summary-item">
                <div>
                    <strong>${item.quantity}x ${product.name}</strong>
                </div>
                <span>${money(subtotal)}</span>
            </div>
        `;
    }).join("");

    if (totalEl) totalEl.textContent = money(total);
}

// Preencher e-mail automaticamente se o usuário estiver logado
onAuthStateChanged(auth, (user) => {
    if (user && user.email) {
        const emailInput = document.getElementById("email");
        if (emailInput && !emailInput.value) emailInput.value = user.email;
    }
});

// Processar Envio do Formulário de Pedido
const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
    checkoutForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            alert("Seu carrinho está vazio!");
            return;
        }

        const fullName = document.getElementById("fullName").value;
        const email = document.getElementById("email").value;
        const phone = document.getElementById("phone").value;
        const cep = document.getElementById("cep").value;
        const city = document.getElementById("city").value;
        const address = document.getElementById("address").value;
        const paymentMethod = document.getElementById("paymentMethod").value;

        let totalOrderValue = 0;
        const itemsWithDetails = cart.map(item => {
            const product = productsData.find(p => p.id === item.id) || { name: "Produto", price: 0 };
            totalOrderValue += product.price * item.quantity;
            return {
                productId: item.id,
                name: product.name,
                quantity: item.quantity,
                unitPrice: product.price,
                totalPrice: product.price * item.quantity
            };
        });

        const newOrder = {
            clientName: fullName,
            clientEmail: email,
            clientPhone: phone,
            shippingAddress: { cep, city, address },
            paymentMethod: paymentMethod,
            items: itemsWithDetails,
            totalAmount: totalOrderValue,
            status: "Pendente",
            createdAt: new Date().toISOString()
        };

        try {
            // Salvar na coleção "orders" do Firestore
            await addDoc(collection(db, "orders"), newOrder);
            
            // Limpar o carrinho
            localStorage.removeItem("techBrasilCart");
            
            alert("Pedido realizado com sucesso! Obrigado por comprar na Tech Brasil.");
            window.location.href = "index.html";
        } catch (error) {
            console.error("Erro ao salvar pedido:", error);
            alert("Ocorreu um erro ao processar seu pedido. Tente novamente.");
        }
    });
}

initCheckout();
