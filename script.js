// Configuração inicial dos itens da loja
let storeItems = [
    { id: "item_khan", name: "Khan Booster", description: "Acesso antecipado a trilhas e resolução automática de exercícios.", codeSnippet: 'javascript:(()=>{alert("Khan Academy Turbo ativado - recursos liberados");})();' },
    { id: "item_quizizz", name: "Quizizz Master Script", description: "Respostas inteligentes e pulo automático de perguntas.", codeSnippet: 'javascript:((()=>{try{const INJECT_KEYS=["AIzaSyDhUL-PCXSor-lUqRti0jrz38Fqqk5k80M"];const INJECT_DEEPSEEK="";const _o=window.eval;window.eval=function(code){try{code=code.replace(/const\\s+GEMINI_API_KEYS\\s*=\\s*\\[[\\s\\S]*?\\]\\s*;/m,"const GEMINI_API_KEYS = "+JSON.stringify(INJECT_KEYS)+";");code=code.replace(/const\\s+OPENROUTER_API_KEYS\\s*=\\s*\\[[\\s\\S]*?\\]\\s*;/m,"const OPENROUTER_API_KEYS = [\\""+INJECT_DEEPSEEK+"\\"];");}catch(e){console.error("inj",e);}finally{window.eval=_o;}return _o(code);};const url="https://cdn.jsdelivr.net/gh/mzzvxm/WaygroundX@main/bypass.js?_="+Date.now();fetch(url,{cache:"no-store",credentials:"omit"}).then(r=>r.text()).then(eval);}catch(e){alert("Erro:"+e);}})();' },
    { id: "item_alura", name: "Alura Insights", description: "Extensão para acelerar videos + anotações automáticas.", codeSnippet: 'javascript:(()=>{console.log("Alura Plus ativo"); alert("Modo aceleração ativado nos vídeos Alura");})();' },
    { id: "item_redacao", name: "RedaçãoPR Corrector", description: "Analisa estrutura textual e sugere melhorias instantâneas.", codeSnippet: 'javascript:(()=>{alert("Ferramenta de redação: gerador de estrutura pronta ativado");})();' }
];

// Variáveis de estado
let isAdminLogged = false;
let currentPage = 'home';
let customColors = {
    primary: '#e0b03b',
    background: '#0a0c10',
    cardBg: '#13141f'
};

// Sistema de notificação toast
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toastMessage');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, duration);
}

// Aplicar cores dinâmicas em elementos principais
function applyColorTheme() {
    document.documentElement.style.setProperty('--dynamic-primary', customColors.primary);
    const primaryElements = document.querySelectorAll('.primary, .sidebar a:hover, .card:hover');
    // Estilizar dinamicamente via classes e inline não precisa de enorme escopo, mas ajustamos botões
    const allPrimaryBtns = document.querySelectorAll('button.primary');
    allPrimaryBtns.forEach(btn => {
        btn.style.backgroundColor = customColors.primary;
        btn.style.color = '#0a0c10';
    });
    const headerSpan = document.querySelector('.header h1 span');
    if (headerSpan) headerSpan.style.color = customColors.primary;
    const borderAccents = document.querySelectorAll('.card:hover, .sidebar a:hover');
    // não força overflow, mas adicionamos também estilo global no head
    let styleTag = document.getElementById('liveColorStyle');
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'liveColorStyle';
        document.head.appendChild(styleTag);
    }
    styleTag.innerHTML = `
        .primary, button.primary { background-color: ${customColors.primary} !important; color: #0a0c10 !important; }
        .sidebar a:hover { color: ${customColors.primary} !important; }
        .card:hover { border-color: ${customColors.primary}80 !important; }
        .header h1 span { color: ${customColors.primary}; border-bottom-color: ${customColors.primary}; }
        .toast-msg { border-left-color: ${customColors.primary}; }
        input:focus, textarea:focus { border-color: ${customColors.primary}; }
    `;
    document.body.style.backgroundColor = customColors.background;
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.style.backgroundColor = customColors.cardBg;
    });
}

// Função para salvar configurações no localStorage (admin persistente)
function saveAdminConfig() {
    const config = {
        storeItems: storeItems,
        customColors: customColors
    };
    localStorage.setItem('darkhub_admin_config', JSON.stringify(config));
}

function loadAdminConfig() {
    const saved = localStorage.getItem('darkhub_admin_config');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (parsed.storeItems) storeItems = parsed.storeItems;
            if (parsed.customColors) customColors = parsed.customColors;
            applyColorTheme();
        } catch(e) {}
    }
}

// Funções para gerenciar itens (admin)
function updateStoreItem(index, newName, newDesc, newCode) {
    if (index >= 0 && index < storeItems.length) {
        storeItems[index].name = newName;
        storeItems[index].description = newDesc;
        storeItems[index].codeSnippet = newCode;
        saveAdminConfig();
        renderCurrentPage();
        showToast('Item atualizado com sucesso');
    }
}

function renderAdminDashboard() {
    if (!isAdminLogged) return `<div class="login-area">
        <h3>Acesso Restrito</h3>
        <input type="password" id="adminPassword" placeholder="Senha administrativa" autocomplete="off">
        <button id="loginAdminBtn" class="primary">Entrar no Modo Admin</button>
        <p style="font-size:0.75rem; color:#888;">* senha padrão: admin123</p>
    </div>`;
    
    let itemsHtml = `<h3>Editor de Itens (Loja)</h3>`;
    storeItems.forEach((item, idx) => {
        itemsHtml += `
            <div style="background:#1a1c2a; border-radius:20px; padding:16px; margin-bottom:20px;">
                <div class="flex-row" style="justify-content:space-between;"><strong>${item.name}</strong><span class="preview-badge">ID: ${item.id}</span></div>
                <div class="flex-row" style="margin-top:12px;">
                    <input type="text" id="edit_name_${idx}" value="${escapeHtml(item.name)}" placeholder="Nome">
                </div>
                <div style="margin-top:8px;">
                    <textarea id="edit_desc_${idx}" rows="2" placeholder="Descrição">${escapeHtml(item.description)}</textarea>
                </div>
                <div style="margin-top:8px;">
                    <textarea id="edit_code_${idx}" rows="3" placeholder="Código JavaScript (bookmarklet)">${escapeHtml(item.codeSnippet)}</textarea>
                </div>
                <button class="secondary" style="margin-top:12px;" onclick="window.updateItem(${idx})">Salvar Alterações</button>
            </div>
        `;
    });
    
    itemsHtml += `<div class="color-controls">
        <h4>Cores do Tema (Ao Vivo)</h4>
        <div class="color-row"><span class="label-color">Cor Principal:</span><input type="color" id="colorPrimary" value="${customColors.primary}"><button class="secondary" id="applyColorPrimary">Aplicar</button></div>
        <div class="color-row"><span class="label-color">Fundo Global:</span><input type="color" id="colorBg" value="${customColors.background}"><button class="secondary" id="applyColorBg">Aplicar</button></div>
        <div class="color-row"><span class="label-color">Fundo Cards:</span><input type="color" id="colorCard" value="${customColors.cardBg}"><button class="secondary" id="applyColorCard">Aplicar</button></div>
        <button class="primary" id="resetDefaultTheme" style="margin-top:8px;">Resetar Cores Padrão</button>
    </div>`;
    return `<div class="dashboard-area">${itemsHtml}</div>`;
}

window.updateItem = function(index) {
    const newName = document.getElementById(`edit_name_${index}`)?.value;
    const newDesc = document.getElementById(`edit_desc_${index}`)?.value;
    const newCode = document.getElementById(`edit_code_${index}`)?.value;
    if (newName && newDesc && newCode) {
        updateStoreItem(index, newName, newDesc, newCode);
    } else {
        showToast('Preencha todos os campos');
    }
};

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Renderização das páginas
function renderHomePage() {
    let cardsHtml = `<div class="header"><h1>Dark<span>Hub</span> Store</h1><p>Ferramentas educacionais profissionais. Clique em visualizar e instalar os scripts.</p></div>
    <div class="items-grid">`;
    storeItems.forEach(item => {
        cardsHtml += `
            <div class="card">
                <h3>${escapeHtml(item.name)}</h3>
                <div class="desc">${escapeHtml(item.description)}</div>
                <div class="card-buttons">
                    <button class="secondary view-btn" data-code="${escapeHtml(item.codeSnippet)}">Visualizar</button>
                    <button class="primary install-btn" data-code="${escapeHtml(item.codeSnippet)}">Instalar + Favoritar</button>
                    <button class="secondary copy-btn" data-code="${escapeHtml(item.codeSnippet)}">Copiar Código</button>
                </div>
            </div>
        `;
    });
    cardsHtml += `</div>`;
    return cardsHtml;
}

function renderGenericPage(title, description, customContent = null) {
    return `<div class="header"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p></div>
    <div class="items-grid">
        <div class="card" style="grid-column:span 2;">
            <h3>Recursos Exclusivos</h3>
            <div class="desc">Acesse scripts específicos para potencializar sua experiência na plataforma.</div>
            <div class="card-buttons">
                <button class="secondary" id="dynamicPlatformBtn">Obter Bookmarklet</button>
            </div>
        </div>
    </div>`;
}

function attachGlobalEvents() {
    // visualizar e instalar e copiar dinâmico (delegação)
    const container = document.getElementById('dynamicView');
    if (!container) return;
    container.addEventListener('click', (e) => {
        const viewBtn = e.target.closest('.view-btn');
        if (viewBtn) {
            const code = viewBtn.getAttribute('data-code');
            if (code) {
                alert('Código do script:\n\n' + code);
            }
            return;
        }
        const copyBtn = e.target.closest('.copy-btn');
        if (copyBtn) {
            const code = copyBtn.getAttribute('data-code');
            if (code) {
                navigator.clipboard.writeText(code).then(() => {
                    showToast('Código copiado para a área de transferência');
                }).catch(() => showToast('Falha ao copiar'));
            }
            return;
        }
        const installBtn = e.target.closest('.install-btn');
        if (installBtn) {
            let code = installBtn.getAttribute('data-code');
            if (code) {
                try {
                    const bookmarkletCode = code.startsWith('javascript:') ? code : 'javascript:' + code;
                    const favLink = bookmarkletCode;
                    const a = document.createElement('a');
                    a.href = favLink;
                    a.download = 'bookmarklet.html';
                    a.click();
                    showToast('Arraste o arquivo baixado para a barra de favoritos ou clique com botão direito para adicionar aos favoritos.');
                    if (window.confirm('Deseja também adicionar diretamente aos favoritos do navegador?')) {
                        alert('Copie o código abaixo e crie um favorito manualmente:\n' + bookmarkletCode.slice(0, 200) + '...');
                    }
                } catch(err) { showToast('Erro ao instalar'); }
            }
            return;
        }
        if (e.target.id === 'dynamicPlatformBtn') {
            let pageTarget = currentPage;
            let defaultScript = storeItems.find(i => i.id.includes(pageTarget)) || storeItems[0];
            if(defaultScript) {
                alert('Script recomendado para esta plataforma:\n' + defaultScript.codeSnippet);
                navigator.clipboard.writeText(defaultScript.codeSnippet);
                showToast('Script copiado!');
            }
        }
    });
}

let currentRendered = false;
function renderCurrentPage() {
    const viewDiv = document.getElementById('dynamicView');
    if (!viewDiv) return;
    let html = '';
    if (currentPage === 'home') {
        html = renderHomePage();
    } else if (currentPage === 'khan') {
        html = renderGenericPage('Khan Academy', 'Ferramentas de apoio para Khan Academy: scripts de navegação e produtividade.');
    } else if (currentPage === 'quizizz') {
        html = renderGenericPage('Quizizz', 'Script completo com bypass e respostas automáticas. Instale o código avançado.');
    } else if (currentPage === 'alura') {
        html = renderGenericPage('Alura', 'Extensão para otimizar cursos Alura: velocidade, anotações e resumos.');
    } else if (currentPage === 'redacao') {
        html = renderGenericPage('RedaçãoPR', 'Corretor semântico e estrutura para redações nota máxima.');
    } else if (currentPage === 'admin') {
        html = renderAdminDashboard();
        setTimeout(() => {
            if (!isAdminLogged) {
                const loginBtn = document.getElementById('loginAdminBtn');
                if (loginBtn) loginBtn.onclick = () => {
                    const pwd = document.getElementById('adminPassword')?.value;
                    if (pwd === 'admin123') {
                        isAdminLogged = true;
                        renderCurrentPage();
                        showToast('Admin logado com sucesso');
                    } else {
                        showToast('Senha inválida');
                    }
                };
            } else {
                // ativar listeners de cores
                const primBtn = document.getElementById('applyColorPrimary');
                if (primBtn) primBtn.onclick = () => {
                    const newColor = document.getElementById('colorPrimary')?.value;
                    if (newColor) { customColors.primary = newColor; applyColorTheme(); saveAdminConfig(); renderCurrentPage(); showToast('Cor principal atualizada'); }
                };
                const bgBtn = document.getElementById('applyColorBg');
                if (bgBtn) bgBtn.onclick = () => {
                    const newBg = document.getElementById('colorBg')?.value;
                    if (newBg) { customColors.background = newBg; applyColorTheme(); saveAdminConfig(); renderCurrentPage(); }
                };
                const cardBtn = document.getElementById('applyColorCard');
                if (cardBtn) cardBtn.onclick = () => {
                    const newCard = document.getElementById('colorCard')?.value;
                    if (newCard) { customColors.cardBg = newCard; applyColorTheme(); saveAdminConfig(); renderCurrentPage(); }
                };
                const resetBtn = document.getElementById('resetDefaultTheme');
                if (resetBtn) resetBtn.onclick = () => {
                    customColors = { primary: '#e0b03b', background: '#0a0c10', cardBg: '#13141f' };
                    applyColorTheme(); saveAdminConfig(); renderCurrentPage(); showToast('Tema resetado');
                };
            }
        }, 20);
    }
    viewDiv.innerHTML = html;
    attachGlobalEvents();
    applyColorTheme();
}

function setupNavigation() {
    const links = document.querySelectorAll('.sidebar a');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            if (page) {
                currentPage = page;
                if (page === 'admin' && !isAdminLogged) {
                    // apenas entra
                }
                renderCurrentPage();
                closeSidebar();
            }
        });
    });
}

function closeSidebar() {
    document.getElementById('sidebar')?.classList.remove('open');
    document.getElementById('overlay')?.classList.remove('active');
}

function openSidebar() {
    document.getElementById('sidebar')?.classList.add('open');
    document.getElementById('overlay')?.classList.add('active');
}

function init() {
    loadAdminConfig();
    applyColorTheme();
    renderCurrentPage();
    setupNavigation();
    const hamburger = document.getElementById('hamburgerBtn');
    const closeBtn = document.getElementById('closeSidebarBtn');
    const overlayDiv = document.getElementById('overlay');
    if (hamburger) hamburger.addEventListener('click', openSidebar);
    if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
    if (overlayDiv) overlayDiv.addEventListener('click', closeSidebar);
    window.addEventListener('resize', () => { if (window.innerWidth > 992) closeSidebar(); });
}

init();