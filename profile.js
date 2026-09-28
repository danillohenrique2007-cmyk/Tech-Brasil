import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const money = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        // Se não estiver logado, redireciona para a página principal / login
        window.location.href = "index.html";
        return;
    }

    document.getElementById("profileUserEmail").textContent = user.email;

    // Carregar dados extras do perfil do usuário no Firestore (se houver)
    try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
            const data = userSnap.data();
            document.getElementById("updateName").value = data.name || "";
            document.getElementById("updatePhone").value = data.phone || "";
        }
    } catch (e) {
        console.error("Erro ao carregar dados do usuário:", e);
    }

    // Carregar os pedidos do usuário baseados no e-mail
    loadClientOrders(user.email);
});

// Função para buscar e renderizar os pedidos do cliente
async function loadClientOrders(email) {
    const container = document.getElementById("ordersListContainer");
    try {
        const q = query(collection(db, "orders"), where("clientEmail", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            container.innerHTML = `<p style="color: #9aa8a2; font-size: 0.9rem;">Você ainda não realizou nenhum pedido.</p>`;
            return;
        }

        let ordersHtml = "";
        querySnapshot.forEach((docSnap) => {
            const order = docSnap.data();
            const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString("pt-BR", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Data recente";
            
            let itemsText = order.items ? order.items.map(i => `${i.quantity}x ${i.name}`).join(", ") : "Itens do pedido";

            ordersHtml += `
                <div class="order-card">
                    <div class="order-header">
                        <span style="color: #9aa8a2; font-size: 0.85rem;"><i class="fa-regular fa-calendar"></i> ${dateStr}</span>
                        <span class="badge-status">${order.status || "Processando"}</span>
                    </div>
                    <p style="font-size: 0.95rem; font-weight: 500; margin-bottom: 0.5rem; color: #fff;">${itemsText}</p>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem;">
                        <span style="color: #9aa8a2;">Total: <strong style="color: #00ff66;">${money(order.totalAmount)}</strong></span>
                        <span style="color: #9aa8a2; font-size: 0.8rem; text-transform: uppercase;">Pagamento: ${order.paymentMethod || 'Pix'}</span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = ordersHtml;

    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        container.innerHTML = `<p style="color: #ff4d4d; font-size: 0.9rem;">Erro ao carregar seus pedidos.</p>`;
    }
}

// Salvar atualizações do perfil
const updateProfileForm = document.getElementById("updateProfileForm");
if (updateProfileForm) {
    updateProfileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const user = auth.currentUser;
        if (!user) return;

        const name = document.getElementById("updateName").value;
        const phone = document.getElementById("updatePhone").value;

        try {
            const userDocRef = doc(db, "users", user.uid);
            await setDoc(userDocRef, { name, phone, email: user.email }, { merge: true });
            alert("Perfil atualizado com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            alert("Erro ao atualizar o perfil. Tente novamente.");
        }
    });
}

// Botão de Logout
const btnLogout = document.getElementById("btnLogout");
if (btnLogout) {
    btnLogout.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.href = "index.html";
        } catch (error) {
            console.error("Erro ao sair:", error);
        }
    });
}
