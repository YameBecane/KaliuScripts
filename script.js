// ========== PARTICLES SYSTEM ==========
const canvas = document.getElementById('particlesCanvas');
const ctx = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 80;

class Particle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
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
        ctx.fillStyle = `rgba(0, 255, 255, ${this.opacity})`;
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

// ========== LOGIN SYSTEM (FIXED CREDENTIALS) ==========
const FIXED_USERNAME = "Dev";
const FIXED_PASSWORD = "86271415";

const loginScreen = document.getElementById('loginScreen');
const mainApp = document.getElementById('mainApp');
const loginForm = document.getElementById('loginForm');
const welcomeUserSpan = document.getElementById('welcomeUser');
const userInitialsBadge = document.getElementById('userInitialsBadge');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (username === FIXED_USERNAME && password === FIXED_PASSWORD) {
        // Login successful
        loginScreen.style.display = 'none';
        mainApp.style.display = 'block';
        
        // Update user info
        welcomeUserSpan.textContent = username;
        const initials = username.substring(0, 2).toUpperCase();
        userInitialsBadge.textContent = initials;
        
        // Store session
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('username', username);
        
        // Small animation effect
        document.body.style.background = '#050505';
    } else {
        // Error effect
        const inputs = document.querySelectorAll('.input-field');
        inputs.forEach(input => {
            input.style.borderColor = '#ff4444';
            input.style.boxShadow = '0 0 10px rgba(255, 68, 68, 0.3)';
        });
        
        setTimeout(() => {
            inputs.forEach(input => {
                input.style.borderColor = 'rgba(0, 255, 255, 0.2)';
                input.style.boxShadow = 'none';
            });
        }, 1000);
        
        // Clear password
        document.getElementById('password').value = '';
    }
});

// Check if already logged in
if (sessionStorage.getItem('loggedIn') === 'true') {
    loginScreen.style.display = 'none';
    mainApp.style.display = 'block';
    const username = sessionStorage.getItem('username') || 'Dev';
    welcomeUserSpan.textContent = username;
    userInitialsBadge.textContent = username.substring(0, 2).toUpperCase();
}

// ========== SOCIAL BUTTONS ==========
document.getElementById('discordBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://discord.gg/kaliuscripted', '_blank');
});

document.getElementById('youtubeBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('https://youtube.com/@kaliuscripted', '_blank');
});

// ========== SIDEBAR CONTROLS ==========
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

// ========== PAGE NAVIGATION ==========
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        
        document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
        link.classList.add('active');
        
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`${page}Page`).classList.add('active');
        
        // Close sidebar on mobile
        if (window.innerWidth < 768) {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        }
    });
});

// ========== LOGOUT ==========
document.getElementById('logoutBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('username');
    mainApp.style.display = 'none';
    loginScreen.style.display = 'flex';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
});

// ========== CONSOLE MODAL ==========
const scriptsConsoleBtn = document.getElementById('scriptsConsoleBtn');
const consoleModal = document.getElementById('consoleModal');
const consoleClose = document.querySelector('.console-close');

scriptsConsoleBtn?.addEventListener('click', () => {
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

// ========== SCRIPT EXECUTION ==========
const runScriptBtn = document.getElementById('runScriptBtn');
const saveScriptBtn = document.getElementById('saveScriptBtn');
const clearConsoleBtn = document.getElementById('clearConsoleBtn');
const consoleInput = document.getElementById('consoleInput');
const consoleOutput = document.getElementById('consoleOutput');

runScriptBtn?.addEventListener('click', () => {
    const script = consoleInput.value;
    let outputText = '';
    
    // Override console.log temporarily
    const originalLog = console.log;
    console.log = (...args) => {
        outputText += args.map(arg => {
            if (typeof arg === 'object') return JSON.stringify(arg, null, 2);
            return String(arg);
        }).join(' ') + '\n';
        originalLog.apply(console, args);
    };
    
    try {
        const func = new Function(script);
        func();
        consoleOutput.innerHTML = `<span style="color:#0f0">✓ Script executed successfully</span>\n${outputText || 'No output'}`;
    } catch (error) {
        consoleOutput.innerHTML = `<span style="color:#f00">✗ Error: ${error.message}</span>`;
    }
    
    console.log = originalLog;
});

saveScriptBtn?.addEventListener('click', () => {
    const script = consoleInput.value;
    localStorage.setItem('savedScript', script);
    consoleOutput.innerHTML = '<span style="color:#0f0">✓ Script saved to localStorage!</span>';
    
    setTimeout(() => {
        if (consoleOutput.innerHTML.includes('saved')) {
            setTimeout(() => {
                if (consoleOutput.innerHTML.includes('saved')) {
                    consoleOutput.innerHTML = '';
                }
            }, 2000);
        }
    }, 2000);
});

clearConsoleBtn?.addEventListener('click', () => {
    consoleInput.value = '';
    consoleOutput.innerHTML = '';
});

// Load saved script
const savedScript = localStorage.getItem('savedScript');
if (savedScript && consoleInput) {
    consoleInput.value = savedScript;
}

// ========== ADDITIONAL UI FEATURES ==========
// Open console from dashboard button
document.querySelectorAll('.open-console').forEach(btn => {
    btn.addEventListener('click', () => {
        consoleModal.style.display = 'flex';
    });
});

// Navigate to cheats
document.querySelectorAll('.nav-cheats').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
        document.querySelector('.nav-link[data-page="cheats"]').classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById('cheatsPage').classList.add('active');
        
        if (window.innerWidth < 768) {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        }
    });
});

// Cheat activation buttons
document.querySelectorAll('.cheat-activate').forEach(btn => {
    btn.addEventListener('click', () => {
        const cheatName = btn.closest('.cheat-item')?.querySelector('h4')?.textContent || 'Cheat';
        consoleOutput.innerHTML = `<span style="color:#0f0">✓ ${cheatName} activated successfully!</span>`;
        setTimeout(() => {
            if (consoleOutput.innerHTML.includes('activated')) {
                consoleOutput.innerHTML = '';
            }
        }, 3000);
    });
});

console.log('✅ Kaliuscripted loaded - Cyberpunk theme active');
