// ========== PARTICLES SYSTEM ==========
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 60;

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
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
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

// ========== LOGIN SYSTEM ==========
const FIXED_USERNAME = "Dev";
const FIXED_PASSWORD = "86271415";

const loginOverlay = document.getElementById('loginOverlay');
const mainMenu = document.getElementById('mainMenu');
const loginForm = document.getElementById('loginForm');

function showToast(message, type = 'info') {
    const toast = document.getElementById('toastNotification');
    toast.innerHTML = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUser').value.trim();
    const password = document.getElementById('loginPass').value;
    
    if (username === FIXED_USERNAME && password === FIXED_PASSWORD) {
        loginOverlay.style.display = 'none';
        mainMenu.style.display = 'flex';
        
        // Update user displays
        const userInitials = username.substring(0, 2).toUpperCase();
        document.getElementById('userBadge').textContent = userInitials;
        document.getElementById('userNameDisplay').textContent = username;
        document.getElementById('welcomeUserSpan').textContent = username;
        document.getElementById('settingsUsername').textContent = username;
        
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('username', username);
        
        showToast('✅ Login successful! Welcome back.', 'success');
    } else {
        showToast('❌ Invalid credentials. Try: Dev / 86271415', 'error');
        document.getElementById('loginPass').value = '';
    }
});

// Check session
if (sessionStorage.getItem('loggedIn') === 'true') {
    loginOverlay.style.display = 'none';
    mainMenu.style.display = 'flex';
    const username = sessionStorage.getItem('username') || 'Dev';
    const userInitials = username.substring(0, 2).toUpperCase();
    document.getElementById('userBadge').textContent = userInitials;
    document.getElementById('userNameDisplay').textContent = username;
    document.getElementById('welcomeUserSpan').textContent = username;
    document.getElementById('settingsUsername').textContent = username;
}

// ========== SOCIAL BUTTONS ==========
document.getElementById('discordLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://discord.gg/kaliuscripted', '_blank');
});

document.getElementById('youtubeLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://youtube.com/@kaliuscripted', '_blank');
});

// ========== TAB SWITCHING ==========
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update active panel
        document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        document.getElementById(`${tabId}Tab`).classList.add('active');
    });
});

// ========== LOGOUT ==========
function logout() {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('username');
    mainMenu.style.display = 'none';
    loginOverlay.style.display = 'flex';
    document.getElementById('loginUser').value = '';
    document.getElementById('loginPass').value = '';
    showToast('👋 Logged out successfully', 'info');
}

document.getElementById('logoutMainBtn')?.addEventListener('click', logout);
document.querySelector('.logout-icon')?.addEventListener('click', logout);

// ========== CONSOLE FUNCTIONS ==========
const consoleOutput = document.getElementById('consoleOutputArea');
const consoleInput = document.getElementById('consoleInputArea');

function addConsoleLine(message, type = 'output') {
    const line = document.createElement('div');
    line.className = 'console-line';
    const color = type === 'error' ? '#ef4444' : type === 'success' ? '#4ade80' : '#a78bfa';
    line.style.color = color;
    line.innerHTML = `> ${message}`;
    consoleOutput.appendChild(line);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Execute script
document.getElementById('executeScriptBtn')?.addEventListener('click', () => {
    const script = consoleInput.value;
    let outputBuffer = [];
    
    // Override console.log
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = (...args) => {
        const message = args.map(arg => {
            if (typeof arg === 'object') return JSON.stringify(arg, null, 2);
            return String(arg);
        }).join(' ');
        outputBuffer.push(message);
        originalLog.apply(console, args);
    };
    
    console.error = (...args) => {
        const message = args.map(arg => String(arg)).join(' ');
        outputBuffer.push(`ERROR: ${message}`);
        originalError.apply(console, args);
    };
    
    try {
        const func = new Function(script);
        func();
        
        if (outputBuffer.length > 0) {
            outputBuffer.forEach(msg => addConsoleLine(msg, 'success'));
        } else {
            addConsoleLine('Script executed successfully (no output)', 'success');
        }
    } catch (error) {
        addConsoleLine(`Error: ${error.message}`, 'error');
    }
    
    console.log = originalLog;
    console.error = originalError;
});

// Clear console
document.getElementById('clearConsoleBtn')?.addEventListener('click', () => {
    consoleOutput.innerHTML = '<div class="console-line">> Console cleared</div>';
});

// Initial console message
addConsoleLine('Kaliuscripted Console v2.0 ready');
addConsoleLine('Type JavaScript code and click Execute');

// ========== RUN SCRIPTS FROM LIBRARY ==========
document.querySelectorAll('.run-script-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const script = btn.dataset.script;
        if (script) {
            try {
                const func = new Function(script);
                func();
                showToast('✅ Script executed successfully!', 'success');
                
                // Switch to console tab to show output
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                document.querySelector('.tab-btn[data-tab="console"]').classList.add('active');
                document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                document.getElementById('consoleTab').classList.add('active');
                
                addConsoleLine(`Executed: ${btn.closest('.script-item')?.querySelector('h4')?.textContent || 'Script'}`, 'success');
            } catch (error) {
                showToast(`❌ Error: ${error.message}`, 'error');
                addConsoleLine(`Error: ${error.message}`, 'error');
            }
        }
    });
});

// ========== SETTINGS TOGGLES ==========
// Theme toggle
document.getElementById('themeToggle')?.addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.style.background = '#1a1a2e';
        showToast('🌙 Dark theme applied', 'info');
    } else {
        document.body.style.background = '#0a0a0f';
        showToast('☀️ Light theme applied', 'info');
    }
    localStorage.setItem('themeDark', e.target.checked);
});

// Load theme preference
const savedTheme = localStorage.getItem('themeDark') === 'true';
if (savedTheme && document.getElementById('themeToggle')) {
    document.getElementById('themeToggle').checked = true;
    document.body.style.background = '#1a1a2e';
}

// Notifications toggle
document.getElementById('notifToggle')?.addEventListener('change', (e) => {
    localStorage.setItem('notificationsEnabled', e.target.checked);
    showToast(e.target.checked ? '🔔 Notifications enabled' : '🔕 Notifications disabled', 'info');
});

// Auto-execute toggle
document.getElementById('autoExecToggle')?.addEventListener('change', (e) => {
    localStorage.setItem('autoExecute', e.target.checked);
    showToast(e.target.checked ? '⚡ Auto-execute enabled' : '⚡ Auto-execute disabled', 'info');
});

// ========== OPEN CONSOLE FROM HOME TAB ==========
window.addEventListener('openConsole', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.tab-btn[data-tab="console"]').classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('consoleTab').classList.add('active');
});

// ========== ABOUT SOCIAL LINKS ==========
document.querySelectorAll('.about-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href !== '#') {
            window.open(href, '_blank');
        } else {
            showToast('Link coming soon!', 'info');
        }
    });
});

console.log('✅ Kaliuscripted IMGUI Menu loaded');
