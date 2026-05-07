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
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.2;
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

window.showNotification = function(title, message, type = 'info', duration = 4000) {
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
    document.getElementById('settingsUsername').textContent = username;
    
    setTimeout(() => {
        window.showNotification('Welcome Back', `Hello ${username}, ready to execute scripts?`, 'success', 3000);
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
    
    // Console
    const consoleOutput = document.getElementById('consoleOutput');
    const consoleInput = document.getElementById('consoleInput');
    
    function addConsoleLine(message, type = 'output') {
        if (!consoleOutput) return;
        const line = document.createElement('div');
        line.style.color = type === 'error' ? '#ef4444' : type === 'success' ? '#4ade80' : '#a78bfa';
        line.innerHTML = `> ${message}`;
        consoleOutput.appendChild(line);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
    
    document.getElementById('executeBtn')?.addEventListener('click', () => {
        const script = consoleInput.value;
        let outputBuffer = [];
        const originalLog = console.log;
        const originalError = console.error;
        
        console.log = (...args) => {
            const message = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
            outputBuffer.push(message);
            originalLog.apply(console, args);
        };
        console.error = (...args) => {
            outputBuffer.push(`ERROR: ${args.map(String).join(' ')}`);
            originalError.apply(console, args);
        };
        
        try {
            new Function(script)();
            if (outputBuffer.length) outputBuffer.forEach(msg => addConsoleLine(msg, 'success'));
            else addConsoleLine('Script executed successfully (no output)', 'success');
            window.showNotification('Script Executed', 'Your script ran successfully!', 'success', 2000);
        } catch (error) {
            addConsoleLine(`Error: ${error.message}`, 'error');
            window.showNotification('Script Error', error.message, 'error', 3000);
        }
        
        console.log = originalLog;
        console.error = originalError;
    });
    
    document.getElementById('clearConsoleBtn')?.addEventListener('click', () => {
        if (consoleOutput) consoleOutput.innerHTML = '<div>> Console cleared</div>';
    });
    
    // Run scripts from library
    document.querySelectorAll('.run-script').forEach(btn => {
        btn.addEventListener('click', () => {
            const script = btn.dataset.script;
            if (script) {
                try {
                    new Function(script)();
                    document.querySelector('.nav-item[data-page="console"]').click();
                    addConsoleLine(`Executed: ${btn.closest('.script-card')?.querySelector('h4')?.textContent || 'Script'}`, 'success');
                } catch (error) {
                    window.showNotification('Execution Error', error.message, 'error');
                }
            }
        });
    });
    
    document.getElementById('openConsoleFromHome')?.addEventListener('click', () => {
        document.querySelector('.nav-item[data-page="console"]').click();
    });
    
    document.getElementById('refreshBtn')?.addEventListener('click', () => {
        window.showNotification('Refreshed', 'Page content updated', 'info', 1500);
    });
    
    // Settings
    const darkModeToggle = document.getElementById('darkModeToggle');
    const notifToggle = document.getElementById('notifToggle');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('change', (e) => {
            document.body.style.background = e.target.checked ? '#1a1a2e' : '#0a0a0f';
            localStorage.setItem('darkMode', e.target.checked);
        });
        darkModeToggle.checked = localStorage.getItem('darkMode') === 'true';
        if (darkModeToggle.checked) document.body.style.background = '#1a1a2e';
    }
    
    if (notifToggle) {
        notifToggle.addEventListener('change', (e) => {
            localStorage.setItem('notificationsEnabled', e.target.checked);
        });
        notifToggle.checked = localStorage.getItem('notificationsEnabled') !== 'false';
    }
    
    document.getElementById('aboutDiscord')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://discord.gg/kaliuscripted', '_blank');
    });
    document.getElementById('aboutYoutube')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://youtube.com/@kaliuscripted', '_blank');
    });
}

console.log('✅ Kaliuscripted loaded');
