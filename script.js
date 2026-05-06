import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getDatabase, ref, set, get, child, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Configuração do Firebase (usando seus dados)
const firebaseConfig = {
    apiKey: "AIzaSyDEFAULT_USE_YOUR_API_KEY", // <-- VOCÊ PRECISA PEGAR A API KEY PÚBLICA
    authDomain: "kaliuscripted.firebaseapp.com",
    databaseURL: "https://kaliuscripted-default-rtdb.firebaseio.com",
    projectId: "kaliuscripted",
    storageBucket: "kaliuscripted.firebasestorage.app",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID", // <-- complete
    appId: "SEU_APP_ID" // <-- complete
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

let currentUser = null;

// Elementos DOM
const loginOverlay = document.getElementById('loginOverlay');
const registerOverlay = document.getElementById('registerOverlay');
const mainApp = document.getElementById('mainApp');

// Função para mostrar notificações estilo toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div style="background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'}; 
                    color: white; padding: 12px 20px; border-radius: 8px; 
                    position: fixed; bottom: 20px; right: 20px; z-index: 10000;
                    animation: slideIn 0.3s ease;">
            ${message}
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Login
document.getElementById('doLoginBtn')?.addEventListener('click', async () => {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('Preencha todos os campos', 'error');
        return;
    }
    
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        showToast('Login realizado com sucesso!', 'success');
    } catch (error) {
        showToast('Erro: ' + error.message, 'error');
    }
});

// Mostrar registro
document.getElementById('showRegisterBtn')?.addEventListener('click', () => {
    loginOverlay.style.display = 'none';
    registerOverlay.style.display = 'flex';
});

// Fechar registro
document.getElementById('closeRegister')?.addEventListener('click', () => {
    registerOverlay.style.display = 'none';
    loginOverlay.style.display = 'flex';
});

document.getElementById('backToLoginBtn')?.addEventListener('click', () => {
    registerOverlay.style.display = 'none';
    loginOverlay.style.display = 'flex';
});

// Registrar
document.getElementById('doRegisterBtn')?.addEventListener('click', async () => {
    const name = document.getElementById('regName').value;
    const nick = document.getElementById('regNick').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    if (!name || !email || !password) {
        showToast('Preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Senha deve ter no mínimo 6 caracteres', 'error');
        return;
    }
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: name });
        
        // Salvar no Realtime Database
        await set(ref(database, `users/${userCredential.user.uid}`), {
            name: name,
            nick: nick || email.split('@')[0],
            email: email,
            createdAt: new Date().toISOString()
        });
        
        showToast('Conta criada com sucesso!', 'success');
        registerOverlay.style.display = 'none';
    } catch (error) {
        showToast('Erro: ' + error.message, 'error');
    }
});

// Monitorar estado do usuário
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        
        // Carregar nick do database
        const snapshot = await get(child(ref(database), `users/${user.uid}`));
        let userNick = user.email.split('@')[0];
        let userName = user.displayName || user.email.split('@')[0];
        
        if (snapshot.exists()) {
            userNick = snapshot.val().nick || userNick;
            userName = snapshot.val().name || userName;
        }
        
        // Atualizar UI
        const initials = userName.substring(0, 2).toUpperCase();
        document.querySelectorAll('#userInitialsHeader, #userInitialsSide').forEach(el => {
            if (el) el.textContent = initials;
        });
        document.getElementById('welcomeUserName').textContent = userName;
        document.getElementById('userNameHeader').textContent = userName.split(' ')[0];
        document.getElementById('userNameSide').textContent = userName;
        document.getElementById('userNickSide').textContent = `@${userNick}`;
        
        // Mostrar app principal
        loginOverlay.style.display = 'none';
        registerOverlay.style.display = 'none';
        mainApp.style.display = 'block';
        
    } else {
        currentUser = null;
        mainApp.style.display = 'none';
        loginOverlay.style.display = 'flex';
        registerOverlay.style.display = 'none';
    }
});

// Logout
document.getElementById('logoutMainBtn')?.addEventListener('click', async () => {
    await signOut(auth);
    showToast('Logout realizado', 'info');
});

// Sidebar controls
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const overlay = document.getElementById('overlay');

menuToggle?.addEventListener('click', () => {
    sidebar.classList.add('open');
    overlay.classList.add('active');
});

closeSidebar?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
});

overlay?.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
});

// Navegação entre páginas
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active-page'));
        document.getElementById(`${page}Page`).classList.add('active-page');
        
        // Fechar sidebar em mobile
        if (window.innerWidth < 768) {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        }
    });
});

// Console Scripts
const scriptsModalBtn = document.getElementById('scriptsModalBtn');
const consoleModal = document.getElementById('consoleModal');
const consoleClose = document.querySelector('.console-close');

scriptsModalBtn?.addEventListener('click', () => {
    consoleModal.style.display = 'flex';
});

consoleClose?.addEventListener('click', () => {
    consoleModal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === consoleModal) {
        consoleModal.style.display = 'none';
    }
});

// Salvar script
document.getElementById('saveConsoleScript')?.addEventListener('click', async () => {
    if (!currentUser) return;
    const script = document.getElementById('consoleInput').value;
    
    try {
        await set(ref(database, `scripts/${currentUser.uid}/lastScript`), {
            script: script,
            updatedAt: new Date().toISOString()
        });
        showToast('Script salvo no Firebase!', 'success');
    } catch (error) {
        showToast('Erro ao salvar', 'error');
    }
});

// Executar script
document.getElementById('runConsoleScript')?.addEventListener('click', () => {
    const script = document.getElementById('consoleInput').value;
    const output = document.getElementById('consoleOutput');
    
    // Salvar console original
    const originalLog = console.log;
    let outputText = '';
    
    console.log = (...args) => {
        outputText += args.map(arg => String(arg)).join(' ') + '\n';
        originalLog.apply(console, args);
    };
    
    try {
        const func = new Function(script);
        func();
        output.innerHTML = `<span style="color:#0f0">▶ Executado com sucesso</span>\n${outputText || 'Sem saída'}`;
    } catch (error) {
        output.innerHTML = `<span style="color:#f00">❌ Erro: ${error.message}</span>`;
    }
    
    console.log = originalLog;
});

// Carregar script salvo
if (currentUser) {
    const snapshot = await get(child(ref(database), `scripts/${currentUser.uid}/lastScript`));
    if (snapshot.exists()) {
        document.getElementById('consoleInput').value = snapshot.val().script || '';
    }
}

console.log('✅ Site Kaliuscripted carregado - Modo macOS');
