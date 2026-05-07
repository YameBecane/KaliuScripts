// PARTICLES
const canvas = document.getElementById('particlesCanvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];

    function initParticles() {
        particles = [];
        for (let i = 0; i < 40; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 2 + 0.5,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.2,
                opacity: Math.random() * 0.3 + 0.05
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity})`;
            ctx.fill();
        });
        requestAnimationFrame(animate);
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

// TOAST FUNCTION
function showToast(message, type = 'info') {
    const container = document.getElementById('toast');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// COPY FUNCTION
async function copyToClipboard(text, name) {
    try {
        await navigator.clipboard.writeText(text);
        showToast(`${name} code copied to clipboard!`, 'success');
    } catch (err) {
        showToast('Failed to copy', 'error');
    }
}

// LOGIN
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        
        if (username === 'Dev' && password === '86271415') {
            sessionStorage.setItem('loggedIn', 'true');
            sessionStorage.setItem('username', username);
            showToast('Login successful! Redirecting...', 'success');
            setTimeout(() => { window.location.href = 'home.html'; }, 800);
        } else {
            showToast('Invalid credentials. Try: Dev / 86271415', 'error');
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

// AUTH CHECK
if (window.location.pathname.includes('home.html') || window.location.pathname.includes('library.html')) {
    if (sessionStorage.getItem('loggedIn') !== 'true') {
        window.location.href = 'login.html';
    }
    
    const username = sessionStorage.getItem('username') || 'Dev';
    const initials = username.substring(0, 2).toUpperCase();
    
    document.querySelectorAll('#headerAvatar, #sidebarAvatar').forEach(el => {
        if (el) el.textContent = initials;
    });
    document.querySelectorAll('#sidebarName').forEach(el => {
        if (el) el.textContent = username;
    });
    document.getElementById('welcomeUser')?.textContent = username;
    
    // SIDEBAR
    const menuBtn = document.getElementById('menuBtn');
    const sidebar = document.getElementById('sidebar');
    const closeBtn = document.getElementById('closeSidebarBtn');
    const overlay = document.getElementById('overlay');
    
    if (menuBtn) {
        menuBtn.onclick = () => {
            sidebar.classList.add('open');
            overlay.classList.add('active');
        };
    }
    if (closeBtn) {
        closeBtn.onclick = () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        };
    }
    if (overlay) {
        overlay.onclick = () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        };
    }
    
    // LOGOUT
    document.getElementById('logoutHeaderBtn')?.addEventListener('click', () => {
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('username');
        showToast('Logged out successfully', 'info');
        setTimeout(() => { window.location.href = 'login.html'; }, 500);
    });
    
    // INSTALL & COPY BUTTONS
    document.querySelectorAll('.btn-install:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.dataset.code;
            const name = btn.dataset.name;
            if (code && name) {
                copyToClipboard(code, name);
                showToast(`Install guide: Drag to bookmarks or use copied code`, 'info');
            }
        });
    });
    
    document.querySelectorAll('.btn-copy:not(.disabled)').forEach(btn => {
        btn.addEventListener('click', () => {
            const code = btn.dataset.code;
            const name = btn.dataset.name;
            if (code && name) {
                copyToClipboard(code, name);
            }
        });
    });
    
    showToast(`Welcome back, ${username}!`, 'success');
}

console.log('✅ Kaliuscripted loaded');
