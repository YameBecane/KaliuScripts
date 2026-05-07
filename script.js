// PARTICLES SYSTEM
const canvas = document.getElementById('particlesCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 40;

    class Particle {
        constructor() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.speedY = (Math.random() - 0.5) * 0.15;
            this.opacity = Math.random() * 0.25 + 0.05;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0) this.x = window.innerWidth;
            if (this.x > window.innerWidth) this.x = 0;
            if (this.y < 0) this.y = window.innerHeight;
            if (this.y > window.innerHeight) this.y = 0;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(167, 139, 250, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();
}

// NOTIFICATION SYSTEM
const notificationContainer = document.getElementById('notificationContainer');

window.showNotification = function(title, message, type = 'info', duration = 3000) {
    if (!notificationContainer) return;
    
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-header">
            <i class="fas ${icons[type] || icons.info}"></i>
            <span class="notification-title">${title}</span>
            <button class="notification-close">&times;</button>
        </div>
        <div class="notification-message">${message}</div>
        <div class="notification-progress"><div class="notification-progress-bar"></div></div>
    `;
    
    notificationContainer.appendChild(notification);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s forwards';
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
};

// COPY TO CLIPBOARD
async function copyToClipboard(text, scriptName) {
    try {
        await navigator.clipboard.writeText(text);
        window.showNotification('Copied!', `${scriptName} code copied to clipboard`, 'success', 2000);
    } catch (err) {
        window.showNotification('Error', 'Failed to copy', 'error', 2000);
    }
}

// DRAG GUIDE
let dragTimeout;
function showDragGuide(scriptName) {
    let guide = document.getElementById('dragGuide');
    if (!guide) {
        guide = document.createElement('div');
        guide.id = 'dragGuide';
        guide.className = 'drag-guide';
        guide.innerHTML = '<div class="drag-content"><i class="fas fa-star"></i><p></p></div>';
        document.body.appendChild(guide);
    }
    const dragContent = guide.querySelector('.drag-content p');
    dragContent.textContent = `Drag "${scriptName}" to bookmarks bar`;
    guide.style.display = 'flex';
    
    if (dragTimeout) clearTimeout(dragTimeout);
    dragTimeout = setTimeout(() => {
        guide.style.display = 'none';
    }, 4000);
}

function handleInstall(scriptName, code) {
    showDragGuide(scriptName);
    copyToClipboard(code, scriptName);
}

// LOGIN PAGE - CORRIGIDO
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    const FIXED_USERNAME = "Dev";
    const FIXED_PASSWORD = "86271415";
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (username === FIXED_USERNAME && password === FIXED_PASSWORD) {
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('username', username);
            window.showNotification('Login Successful', `Welcome back, ${username}!`, 'success', 2000);
            
            setTimeout(() => { 
                window.location.href = 'home.html'; 
            }, 600);
        } else {
            window.showNotification('Login Failed', 'Invalid credentials. Try: Dev / 86271415', 'error', 3000);
            document.getElementById('password').value = '';
        }
    });
    
    document.getElementById('discordBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://discord.gg/kaliuscripted', '_blank');
    });
    document.getElementById('youtubeBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://youtube.com/@kaliuscripted', '_blank');
    });
}

// VERIFICAÇÃO DE AUTENTICAÇÃO
if (window.location.pathname.includes('home.html') || window.location.pathname.includes('library.html')) {
    if (sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'login.html';
    }
    
    const username = sessionStorage.getItem('username') || 'Dev';
    const userInitials = username.substring(0, 2).toUpperCase();
    
    document.querySelectorAll('#userInitialsMini, #sidebarAvatarFooter').forEach(el => {
        if (el) el.textContent = userInitials;
    });
    document.querySelectorAll('#sidebarUsernameFooter').forEach(el => {
        if (el) el.textContent = username;
    });
    document.getElementById('welcomeName')?.textContent = username;
    
    // SIDEBAR
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
    
    // LOGOUT
    const logoutHandler = () => {
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('username');
        window.showNotification('Logged Out', 'You have been logged out successfully', 'info', 2000);
        setTimeout(() => { window.location.href = 'login.html'; }, 600);
    };
    
    document.getElementById('logoutMiniBtn')?.addEventListener('click', logoutHandler);
    
    // SCRIPTS DATA
    const scriptsData = {
        'quizizz': { name: 'Wayground Quizizz', code: "load('quizizz-automation')" },
        'khan': { name: 'Khan Academy Helper', code: "load('khan-academy-helper')" }
    };
    
    document.querySelectorAll('.btn-install:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', () => {
            const scriptKey = btn.dataset.script;
            if (scriptKey && scriptsData[scriptKey]) {
                handleInstall(scriptsData[scriptKey].name, scriptsData[scriptKey].code);
            }
        });
    });
    
    document.querySelectorAll('.btn-copy:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', () => {
            const scriptKey = btn.dataset.script;
            if (scriptKey && scriptsData[scriptKey]) {
                copyToClipboard(scriptsData[scriptKey].code, scriptsData[scriptKey].name);
            }
        });
    });
    
    setTimeout(() => {
        window.showNotification('Welcome Back', `Hello ${username}`, 'success', 2500);
    }, 800);
}

console.log('✅ Kaliuscripted v2.0 - Corrigido e funcionando');
