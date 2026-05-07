// Particles System
const canvas = document.getElementById('particlesCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 50;

    class Particle {
        constructor() {
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.speedY = (Math.random() - 0.5) * 0.15;
            this.opacity = Math.random() * 0.3 + 0.1;
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

// Notification System
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

// Drag and Drop Install Guide
let dragTimeout;
function showDragGuide(scriptName) {
    const guide = document.getElementById('dragGuide');
    const dragContent = guide.querySelector('.drag-content');
    dragContent.innerHTML = `<i class="fas fa-star"></i><p>Drag "${scriptName}" to bookmarks bar</p>`;
    guide.style.display = 'flex';
    
    if (dragTimeout) clearTimeout(dragTimeout);
    dragTimeout = setTimeout(() => {
        guide.style.display = 'none';
    }, 4000);
}

// Copy to Clipboard
async function copyToClipboard(text, scriptName) {
    try {
        await navigator.clipboard.writeText(text);
        window.showNotification('Copied!', `${scriptName} code copied to clipboard`, 'success', 2000);
    } catch (err) {
        window.showNotification('Error', 'Failed to copy', 'error', 2000);
    }
}

// Install Button Handler (Drag simulation - shows guide)
function handleInstall(scriptName, code) {
    showDragGuide(scriptName);
    // Also copy to clipboard as fallback
    copyToClipboard(code, scriptName);
}

// LOGIN PAGE
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
            window.showNotification('Login Successful', `Welcome back, ${username}!`, 'success');
            setTimeout(() => { window.location.href = 'home.html'; }, 500);
        } else {
            window.showNotification('Login Failed', 'Invalid credentials. Try: Dev / 86271415', 'error');
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

// HOME PAGE
if (window.location.pathname.includes('home.html')) {
    if (sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'login.html';
    }
    
    const username = sessionStorage.getItem('username') || 'Dev';
    const userInitials = username.substring(0, 2).toUpperCase();
    
    document.getElementById('userAvatar').textContent = userInitials;
    document.getElementById('userNameDisplay').textContent = username;
    document.getElementById('welcomeName').textContent = username;
    
    setTimeout(() => {
        window.showNotification('Welcome Back', `Hello ${username}, explore our script library`, 'success', 3000);
    }, 500);
    
    // Sidebar
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
    
    // Tab switching
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const page = item.dataset.page;
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(`${page}Page`).classList.add('active');
            if (window.innerWidth < 768) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
            }
        });
    });
    
    // Logout
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('username');
        window.showNotification('Logged Out', 'You have been logged out', 'info');
        setTimeout(() => { window.location.href = 'login.html'; }, 500);
    });
    
    // Scripts Data
    const scripts = {
        'autofarm-master': { name: 'Auto Farm Master', code: "load('autofarm-master')" },
        'antiban-shield': { name: 'Anti-Ban Shield', code: "load('antiban-shield')" },
        'speedboost-pro': { name: 'Speed Boost Pro', code: "load('speedboost-pro')" },
        'esp-viewer': { name: 'ESP Viewer', code: "load('esp-viewer')" },
        'resource-tracker': { name: 'Resource Tracker', code: "load('resource-tracker')" }
    };
    
    // Featured Script Install
    const featuredInstallBtn = document.querySelector('.install-btn');
    const featuredCopyBtn = document.querySelector('.copy-btn');
    
    if (featuredInstallBtn) {
        featuredInstallBtn.addEventListener('click', () => {
            handleInstall('Auto Farm Master', "load('autofarm-master')");
        });
    }
    
    if (featuredCopyBtn) {
        featuredCopyBtn.addEventListener('click', () => {
            copyToClipboard("load('autofarm-master')", 'Auto Farm Master');
        });
    }
    
    // Small Scripts Buttons
    document.querySelectorAll('.install-small').forEach(btn => {
        btn.addEventListener('click', () => {
            const scriptKey = btn.dataset.script;
            const script = scripts[scriptKey];
            if (script) {
                handleInstall(script.name, script.code);
            }
        });
    });
    
    document.querySelectorAll('.copy-small').forEach(btn => {
        btn.addEventListener('click', () => {
            const scriptKey = btn.dataset.script;
            const script = scripts[scriptKey];
            if (script) {
                copyToClipboard(script.code, script.name);
            }
        });
    });
}

console.log('✅ Kaliuscripted v2.0 - No scroll, educational scripts library');
