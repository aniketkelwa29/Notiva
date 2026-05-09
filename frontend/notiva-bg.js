/* notiva-bg.js — Shared animated background + toast + sidebar init */

/* ─── Particle Canvas ─────────────────────────── */
function initParticles(canvasId = 'n-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  class P {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W; this.y = Math.random() * H;
      this.r = Math.random() * 1.4 + 0.3;
      this.vx = (Math.random() - .5) * .22; this.vy = (Math.random() - .5) * .22;
      this.a = Math.random() * .38 + .05;
      this.c = Math.random() > .55 ? '139,92,246' : '99,102,241';
    }
    step() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset(); }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(${this.c},${this.a})`; ctx.fill(); }
  }

  const COUNT = Math.min(Math.floor(window.innerWidth * window.innerHeight / 11000), 90);
  for (let i = 0; i < COUNT; i++) particles.push(new P());

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99,102,241,${.055 * (1 - d / 110)})`;
          ctx.lineWidth = .5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.step(); p.draw(); });
    requestAnimationFrame(loop);
  })();
}

/* ─── Toast System ─────────────────────────────── */
function showToast(message, type = 'success') {
  let tc = document.getElementById('toast-container');
  if (!tc) {
    tc = document.createElement('div');
    tc.id = 'toast-container';
    document.body.appendChild(tc);
  }

  const icons = { success: 'check_circle', error: 'error', info: 'info' };
  const t = document.createElement('div');
  t.className = `n-toast n-toast-${type}`;
  t.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">${icons[type] || 'info'}</span><span>${message}</span>`;

  // Close on click
  t.addEventListener('click', () => dismissToast(t));
  tc.appendChild(t);
  setTimeout(() => dismissToast(t), type === 'error' ? 4500 : 3200);
}

function dismissToast(t) {
  t.style.opacity = '0'; t.style.transform = 'translateX(30px) scale(.94)';
  t.style.transition = '.3s ease'; setTimeout(() => t.remove(), 300);
}

/* ─── Login Error Modal ────────────────────────── */
function showLoginError(msg) {
  const existing = document.getElementById('n-error-modal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'n-error-modal';
  overlay.className = 'n-modal-bg';
  overlay.innerHTML = `
    <div class="n-modal glass" style="border-radius:20px;padding:36px 32px;text-align:center;max-width:380px;">
      <div style="width:60px;height:60px;border-radius:50%;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);
                  display:flex;align-items:center;justify-content:center;margin:0 auto 20px;
                  box-shadow:0 0 30px rgba(239,68,68,.15);">
        <span class="material-symbols-outlined" style="color:#FCA5A5;font-size:28px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">cancel</span>
      </div>
      <h3 style="font-size:20px;font-weight:800;color:#fff;margin-bottom:10px;letter-spacing:-.02em;">Login Failed</h3>
      <p style="color:#94A3B8;font-size:14px;line-height:1.6;margin-bottom:24px;">${msg || 'Invalid username or password. Please check your credentials and try again.'}</p>
      <button onclick="document.getElementById('n-error-modal').remove()"
        style="width:100%;padding:13px;border-radius:12px;background:linear-gradient(135deg,#6366F1,#4338CA);
               color:#fff;font-weight:700;font-size:14px;border:none;cursor:pointer;
               box-shadow:0 0 20px rgba(99,102,241,.3);font-family:inherit;transition:all .2s;"
        onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform=''">
        Try Again
      </button>
    </div>`;
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

/* ─── Sidebar ──────────────────────────────────── */
function initSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('mobile-overlay');
  const menuBtn  = document.getElementById('menu-btn');
  const closeBtn = document.getElementById('sidebar-close');

  function open()  { sidebar && sidebar.classList.add('open'); overlay && overlay.classList.add('open'); }
  function close() { sidebar && sidebar.classList.remove('open'); overlay && overlay.classList.remove('open'); }

  menuBtn  && menuBtn.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  overlay  && overlay.addEventListener('click', close);

  // Active link
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === page || href.split('/').pop() === page) {
      link.classList.add('active');
    }
  });

  // Logout buttons
  document.querySelectorAll('.btn-logout').forEach(b => b.addEventListener('click', () => {
    api.removeToken(); NotivaState.user = null; window.location.href = 'index.html';
  }));
}

/* ─── Auth Guard ───────────────────────────────── */
function requireAuth() {
  if (typeof api !== 'undefined' && !api.getToken()) {
    window.location.href = 'index.html';
  }
}

/* ─── Fill nav user info ────────────────────────── */
function fillNavUser() {
  const u = NotivaState.user || {};
  const name = u.name || u.userName || 'User';
  const el = (id) => document.getElementById(id);
  if (el('nav-name'))    el('nav-name').textContent    = name;
  if (el('nav-email'))   el('nav-email').textContent   = u.email || '';
  if (el('nav-initial')) el('nav-initial').textContent = name.charAt(0).toUpperCase();
  if (el('sidebar-user-name'))  el('sidebar-user-name').textContent  = name;
  if (el('sidebar-user-email')) el('sidebar-user-email').textContent = u.email || '';
  if (el('sidebar-avatar'))     el('sidebar-avatar').textContent     = name.charAt(0).toUpperCase();
}

/* ─── Sidebar open class (mobile slide-in) ─────── */
(function () {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width:1023px) {
      #sidebar { transform: translateX(-100%); }
      #sidebar.open { transform: translateX(0); }
    }
  `;
  document.head.appendChild(style);
})();
