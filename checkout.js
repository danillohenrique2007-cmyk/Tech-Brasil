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
let selectedPaymentMethod = "pix";

const money = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Função auxiliar para exibir o modal de sucesso profissional
function showSuccessModal(paymentType) {
    const pixModal = document.getElementById("pixModal");
    if (pixModal) pixModal.style.display = "none"; // Fecha o modal do Pix se estiver aberto

    const successModal = document.getElementById("successModal");
    const successText = document.getElementById("successModalText");

    if (paymentType === "pix") {
        successText.innerHTML = `Pagamento via <strong>Pix</strong> confirmado com sucesso! O comprovante e os detalhes foram enviados para o seu e-mail.`;
    } else if (paymentType === "credit") {
        successText.innerHTML = `Pagamento via <strong>Cartão de Crédito</strong> aprovado com sucesso! Acompanhe o envio pelo seu painel.`;
    } else {
        successText.innerHTML = `Pedido registrado com sucesso via <strong>Boleto Bancário</strong>! O boleto foi gerado e enviado para o seu e-mail.`;
    }

    successModal.style.display = "flex";

    document.getElementById("btnBackToHome").onclick = () => {
        localStorage.removeItem("techBrasilCart");
        window.location.href = "index.html";
    };
}

// Gerenciamento dos Cards de Pagamento
const paymentCards = document.querySelectorAll(".payment-card");
const dynamicContainer = document.getElementById("dynamicPaymentContainer");

paymentCards.forEach(card => {
    card.addEventListener("click", () => {
        paymentCards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
        selectedPaymentMethod = card.dataset.method;

        if (selectedPaymentMethod === "pix") {
            dynamicContainer.innerHTML = `
                <p style="color: #00ff66; font-size: 0.9rem; margin: 0;"><i class="fa-solid fa-bolt"></i> Aprovação imediata via Pix com QR Code.</p>
            `;
        } else if (selectedPaymentMethod === "credit") {
            dynamicContainer.innerHTML = `
                <div style="margin-bottom: 0.8rem;">
                    <label style="display:block; color:#9aa8a2; font-size:0.85rem; margin-bottom:0.3rem;">Número do Cartão</label>
                    <input type="text" id="cardNumber" placeholder="0000 0000 0000 0000" required style="width:100%; padding:0.6rem; background:#0a0d0f; border:1px solid #1f302a; border-radius:6px; color:#fff;">
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div>
                        <label style="display:block; color:#9aa8a2; font-size:0.85rem; margin-bottom:0.3rem;">Validade (MM/AA)</label>
                        <input type="text" id="cardExpiry" placeholder="MM/AA" required style="width:100%; padding:0.6rem; background:#0a0d0f; border:1px solid #1f302a; border-radius:6px; color:#fff;">
                    </div>
                    <div>
                        <label style="display:block; color:#9aa8a2; font-size:0.85rem; margin-bottom:0.3rem;">CVV</label>
                        <input type="text" id="cardCvv" placeholder="123" required style="width:100%; padding:0.6rem; background:#0a0d0f; border:1px solid #1f302a; border-radius:6px; color:#fff;">
                    </div>
                </div>
            `;
        } else if (selectedPaymentMethod === "boleto") {
            dynamicContainer.innerHTML = `
                <p style="color: #ffcc00; font-size: 0.9rem; margin: 0;"><i class="fa-solid fa-file-invoice"></i> O boleto será gerado após a finalização e enviado ao seu e-mail (Vencimento em 2 dias úteis).</p>
            `;
        }
    });
});

async function initCheckout() {
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

onAuthStateChanged(auth, (user) => {
    if (user && user.email) {
        const emailInput = document.getElementById("email");
        if (emailInput && !emailInput.value) emailInput.value = user.email;
    }
});

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
            paymentMethod: selectedPaymentMethod,
            items: itemsWithDetails,
            totalAmount: totalOrderValue,
            status: selectedPaymentMethod === "pix" ? "Aguardando Pix" : (selectedPaymentMethod === "credit" ? "Pago com Cartão" : "Aguardando Boleto"),
            createdAt: new Date().toISOString()
        };

        try {
            await addDoc(collection(db, "orders"), newOrder);

            if (selectedPaymentMethod === "pix") {
                const pixModal = document.getElementById("pixModal");
                const qrCodeImg = document.getElementById("pixQRCodeImg");
                
                const qrText = `TechBrasil-Pix-R$${totalOrderValue}-${email}`;
                qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrText)}`;
                
                pixModal.style.display = "flex";
                
                // Quando clicar que já pagou o Pix, abre a tela de sucesso profissional
                document.getElementById("btnFinishPix").onclick = () => {
                    showSuccessModal("pix");
                };
            } else {
                // Para Cartão ou Boleto, exibe direto o modal de sucesso profissional
                showSuccessModal(selectedPaymentMethod);
            }

        } catch (error) {
            console.error("Erro ao salvar pedido:", error);
            alert("Ocorreu um erro ao processar seu pedido. Tente novamente.");
        }
    });
}

initCheckout();
