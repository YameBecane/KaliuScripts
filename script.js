// ===== FIREBASE CONFIGURAÇÃO =====
// Substitua pelos dados do seu projeto Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_PROJETO.firebaseapp.com",
    projectId: "SEU_PROJETO_ID",
    storageBucket: "SEU_PROJETO.appspot.com",
    messagingSenderId: "SEU_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializar Firebase (opcional - só se você quiser usar autenticação real)
// Se não quiser usar Firebase ainda, comente estas linhas
/*
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
*/

// ===== SIMULAÇÃO DE USUÁRIO (enquanto não conecta Firebase) =====
// Dados mockados - depois substitua pelos dados reais do Firebase
let currentUser = {
    isLogged: false,
    name: "",
    nick: "",
    email: ""
};

// Função para atualizar o viewer de login com iniciais
function updateLoginViewer() {
    const userInitialsSpan = document.getElementById('userInitials');
    const userNameSpan = document.getElementById('userName');
    const userNickSpan = document.getElementById('userNick');
    
    if (currentUser.isLogged && currentUser.name) {
        // Pega as duas primeiras letras do nome
        let initials = currentUser.name.substring(0, 2).toUpperCase();
        if (initials.length < 2 && currentUser.nick) {
            initials = currentUser.nick.substring(0, 2).toUpperCase();
        }
        userInitialsSpan.textContent = initials;
        userNameSpan.textContent = currentUser.name;
        userNickSpan.textContent = `(${currentUser.nick || "sem apelido"})`;
        
        // Opcional: mudar cor do avatar baseado no usuário
        document.querySelector('.avatar').style.backgroundColor = getColorFromName(currentUser.name);
    } else {
        userInitialsSpan.textContent = "??";
        userNameSpan.textContent = "Visitante";
        userNickSpan.textContent = "(não logado)";
        document.querySelector('.avatar').style.backgroundColor = "#3a6ea5";
    }
}

// Função auxiliar para cor do avatar (baseada no nome)
function getColorFromName(name) {
    const colors = ["#3a6ea5", "#6c5ce7", "#e84393", "#00cec9", "#fdcb6e", "#e17055"];
    let hash = 0;
    for(let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

// ===== FUNÇÕES DE LOGIN SIMULADO (para teste) =====
// Você pode remover depois e usar o Firebase Auth real
function simulateLogin() {
    currentUser = {
        isLogged: true,
        name: "João Silva",
        nick: "jsilva",
        email: "joao@email.com"
    };
    updateLoginViewer();
    
    // Salvar no localStorage como exemplo
    localStorage.setItem('userData', JSON.stringify(currentUser));
}

function simulateLogout() {
    currentUser = {
        isLogged: false,
        name: "",
        nick: "",
        email: ""
    };
    updateLoginViewer();
    localStorage.removeItem('userData');
}

// Verificar se já tem usuário salvo no localStorage
function loadStoredUser() {
    const stored = localStorage.getItem('userData');
    if(stored) {
        try {
            currentUser = JSON.parse(stored);
            updateLoginViewer();
        } catch(e) {}
    }
}

// ===== CONTROLE DA SIDEBAR =====
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const closeSidebar = document.getElementById('closeSidebar');
const overlay = document.getElementById('overlay');

function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('active');
}

function closeSidebarFunc() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
}

menuToggle.addEventListener('click', openSidebar);
closeSidebar.addEventListener('click', closeSidebarFunc);
overlay.addEventListener('click', closeSidebarFunc);

// Fechar sidebar ao clicar em link (opcional)
document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', closeSidebarFunc);
});

// ===== MODAL SCRIPTS =====
const scriptsBtn = document.getElementById('scriptsBtn');
const scriptsModal = document.getElementById('scriptsModal');
const modalClose = document.querySelector('.modal-close');

function openScriptsModal() {
    scriptsModal.style.display = 'flex';
}

function closeScriptsModal() {
    scriptsModal.style.display = 'none';
}

scriptsBtn.addEventListener('click', openScriptsModal);
modalClose.addEventListener('click', closeScriptsModal);
// Fechar modal clicando fora
window.addEventListener('click', (e) => {
    if(e.target === scriptsModal) {
        closeScriptsModal();
    }
});

// Salvar script (exemplo)
document.querySelector('.save-script-btn')?.addEventListener('click', () => {
    const scriptText = document.querySelector('#scriptsModal textarea').value;
    if(scriptText.trim()) {
        localStorage.setItem('userScript', scriptText);
        alert('Script salvo localmente!');
    } else {
        alert('Digite algo no script.');
    }
});

// Carregar script salvo se existir
const savedScript = localStorage.getItem('userScript');
if(savedScript && document.querySelector('#scriptsModal textarea')) {
    document.querySelector('#scriptsModal textarea').value = savedScript;
}

// ===== INICIALIZAÇÃO =====
// Carregar dados do usuário
loadStoredUser();

// Se quiser testar o login, descomente a linha abaixo (apenas para teste)
// setTimeout(simulateLogin, 1000); // Simula login após 1s

// Exemplo de como integrar com Firebase Auth (quando estiver pronto)
/*
onAuthStateChanged(auth, (user) => {
    if(user) {
        currentUser = {
            isLogged: true,
            name: user.displayName || user.email?.split('@')[0] || "Usuário",
            nick: user.email?.split('@')[0] || "",
            email: user.email
        };
        updateLoginViewer();
    } else {
        currentUser.isLogged = false;
        updateLoginViewer();
    }
});
*/

console.log("Site inicializado com sidebar, tema Darker, viewer de login e modal Scripts");
