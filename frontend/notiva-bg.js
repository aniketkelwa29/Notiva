/* notiva-bg.js — Shared animated background + enhanced toast + modals + sidebar init */

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

/* ─── Inject Notification Styles ────────────────── */
(function injectStyles() {
  if (document.getElementById('n-notify-styles')) return;
  const s = document.createElement('style');
  s.id = 'n-notify-styles';
  s.textContent = `
    /* ── Toast Container ── */
    #toast-container {
      position:fixed; top:20px; right:20px; z-index:99999;
      display:flex; flex-direction:column; gap:10px;
      pointer-events:none; max-width:360px;
      width:calc(100% - 40px);
    }

    /* ── Toast Base ── */
    .n-toast {
      display:flex; align-items:flex-start; gap:12px;
      padding:14px 16px 18px; border-radius:16px;
      font-size:13.5px; font-weight:500;
      backdrop-filter:blur(28px); -webkit-backdrop-filter:blur(28px);
      pointer-events:all; cursor:pointer;
      box-shadow:0 16px 40px rgba(0,0,0,.55), 0 2px 8px rgba(0,0,0,.3);
      animation:nToastIn .45s cubic-bezier(.34,1.56,.64,1) both;
      position:relative; overflow:hidden; border:1px solid transparent;
      transition:transform .2s ease, box-shadow .2s ease, opacity .35s ease;
    }
    .n-toast:hover { transform:translateX(-4px) scale(1.015); }

    /* ── Toast Inner Parts ── */
    .n-toast-icon {
      width:34px; height:34px; border-radius:10px; flex-shrink:0;
      display:flex; align-items:center; justify-content:center;
      margin-top:1px;
    }
    .n-toast-body { flex:1; min-width:0; }
    .n-toast-title { font-size:12.5px; font-weight:800; margin-bottom:3px; letter-spacing:.01em; }
    .n-toast-msg   { font-size:13px; line-height:1.55; opacity:.9; }
    .n-toast-close {
      flex-shrink:0; background:none; border:none; cursor:pointer;
      color:inherit; opacity:.45; padding:3px; border-radius:6px;
      transition:opacity .2s, background .2s; display:flex; margin-top:-2px;
    }
    .n-toast-close:hover { opacity:1; background:rgba(255,255,255,.12); }

    /* ── Progress Bar ── */
    .n-toast-bar {
      position:absolute; bottom:0; left:0; height:3px;
      border-radius:0 0 16px 16px;
    }

    /* ── Toast Variants ── */
    .n-toast-success {
      background:linear-gradient(135deg, rgba(16,185,129,.13), rgba(5,150,105,.08));
      border-color:rgba(16,185,129,.28); color:#A7F3D0;
    }
    .n-toast-success .n-toast-icon { background:rgba(16,185,129,.2); color:#34D399; }
    .n-toast-success .n-toast-bar  { background:linear-gradient(90deg,#10B981,#34D399,#6EE7B7); }

    .n-toast-error {
      background:linear-gradient(135deg, rgba(239,68,68,.13), rgba(220,38,38,.08));
      border-color:rgba(239,68,68,.3); color:#FCA5A5;
    }
    .n-toast-error .n-toast-icon { background:rgba(239,68,68,.2); color:#F87171; }
    .n-toast-error .n-toast-bar  { background:linear-gradient(90deg,#EF4444,#F87171,#FCA5A5); }

    .n-toast-info {
      background:linear-gradient(135deg, rgba(99,102,241,.13), rgba(79,70,229,.08));
      border-color:rgba(99,102,241,.3); color:#C7D2FE;
    }
    .n-toast-info .n-toast-icon { background:rgba(99,102,241,.2); color:#818CF8; }
    .n-toast-info .n-toast-bar  { background:linear-gradient(90deg,#6366F1,#818CF8,#C7D2FE); }

    .n-toast-warning {
      background:linear-gradient(135deg, rgba(245,158,11,.13), rgba(217,119,6,.08));
      border-color:rgba(245,158,11,.3); color:#FDE68A;
    }
    .n-toast-warning .n-toast-icon { background:rgba(245,158,11,.2); color:#FBBF24; }
    .n-toast-warning .n-toast-bar  { background:linear-gradient(90deg,#F59E0B,#FBBF24,#FDE68A); }

    /* ── Toast Animations ── */
    @keyframes nToastIn {
      from { opacity:0; transform:translateX(60px) scale(.88); }
      to   { opacity:1; transform:translateX(0) scale(1); }
    }
    @keyframes nToastBarShrink {
      from { width:100%; }
      to   { width:0%; }
    }

    /* ── Modal Backdrop ── */
    .n-modal-bg {
      position:fixed; inset:0; z-index:100000;
      background:rgba(0,0,0,.75); backdrop-filter:blur(16px); -webkit-backdrop-filter:blur(16px);
      display:flex; align-items:center; justify-content:center; padding:16px;
      animation:nBgIn .22s ease both;
    }
    @keyframes nBgIn { from{opacity:0} to{opacity:1} }

    /* ── Error Modal ── */
    .n-modal {
      width:100%; max-width:400px;
      animation:nModalPop .5s cubic-bezier(.34,1.56,.64,1) both;
    }
    @keyframes nModalPop {
      from { opacity:0; transform:scale(.78) translateY(28px); }
      to   { opacity:1; transform:scale(1) translateY(0); }
    }
    .n-err-ring {
      width:76px; height:76px; border-radius:50%;
      background:radial-gradient(circle, rgba(239,68,68,.18) 0%, rgba(239,68,68,.06) 100%);
      border:2px solid rgba(239,68,68,.4);
      display:flex; align-items:center; justify-content:center;
      margin:0 auto 24px;
      animation:nErrPulse 2.2s ease-in-out infinite;
    }
    @keyframes nErrPulse {
      0%,100% { box-shadow:0 0 0 0 rgba(239,68,68,.4), 0 0 24px rgba(239,68,68,.15); }
      50%      { box-shadow:0 0 0 14px rgba(239,68,68,0), 0 0 40px rgba(239,68,68,.25); }
    }
    .n-modal-action-btn {
      width:100%; padding:15px; border-radius:14px;
      background:linear-gradient(135deg,#6366F1,#4F46E5,#4338CA);
      color:#fff; font-weight:700; font-size:14.5px; border:none; cursor:pointer;
      box-shadow:0 0 28px rgba(99,102,241,.45); font-family:inherit;
      transition:all .25s; letter-spacing:.025em;
      position:relative; overflow:hidden; display:flex; align-items:center; justify-content:center; gap:8px;
    }
    .n-modal-action-btn::before {
      content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);
      transition:left .55s;
    }
    .n-modal-action-btn:hover::before { left:150%; }
    .n-modal-action-btn:hover { transform:translateY(-2px); box-shadow:0 0 40px rgba(99,102,241,.6); }
    .n-modal-action-btn:active { transform:translateY(0) scale(.97); }

    /* ── Welcome Modal ── */
    .n-welcome-modal {
      width:100%; max-width:430px;
      animation:nWelcomePop .7s cubic-bezier(.34,1.56,.64,1) .05s both;
      text-align:center; position:relative;
    }
    @keyframes nWelcomePop {
      from { opacity:0; transform:scale(.72) translateY(40px); }
      to   { opacity:1; transform:scale(1) translateY(0); }
    }
    .n-welcome-confetti {
      position:absolute; inset:0; pointer-events:none; overflow:hidden; border-radius:28px;
    }
    .n-confetti-dot {
      position:absolute; width:7px; height:7px; border-radius:2px;
      animation:nConfettiFall linear forwards;
    }
    @keyframes nConfettiFall {
      0%   { transform:translateY(-20px) rotate(0deg); opacity:1; }
      80%  { opacity:1; }
      100% { transform:translateY(320px) rotate(840deg); opacity:0; }
    }
    .n-welcome-avatar {
      width:86px; height:86px; border-radius:50%;
      background:linear-gradient(135deg,#818CF8,#6366F1,#4338CA);
      display:flex; align-items:center; justify-content:center;
      margin:0 auto 22px;
      animation:nAvatarPulse 2.8s ease-in-out infinite, nAvatarIn .65s cubic-bezier(.34,1.56,.64,1) .4s both;
    }
    @keyframes nAvatarIn {
      from { transform:scale(0) rotate(-20deg); opacity:0; }
      to   { transform:scale(1) rotate(0deg); opacity:1; }
    }
    @keyframes nAvatarPulse {
      0%,100% { box-shadow:0 0 0 0 rgba(99,102,241,.5), 0 0 32px rgba(99,102,241,.25); }
      50%      { box-shadow:0 0 0 18px rgba(99,102,241,0), 0 0 48px rgba(99,102,241,.35); }
    }
    .n-welcome-close {
      width:100%; padding:15px; border-radius:14px;
      background:linear-gradient(135deg,#6366F1,#4F46E5,#4338CA);
      color:#fff; font-weight:700; font-size:14.5px; border:none; cursor:pointer;
      box-shadow:0 0 28px rgba(99,102,241,.45); font-family:inherit;
      transition:all .25s; position:relative; overflow:hidden;
      display:flex; align-items:center; justify-content:center; gap:8px;
    }
    .n-welcome-close::before {
      content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent);
      transition:left .55s;
    }
    .n-welcome-close:hover::before { left:150%; }
    .n-welcome-close:hover { transform:translateY(-2px); box-shadow:0 0 40px rgba(99,102,241,.6); }
    .n-welcome-close:active { transform:translateY(0) scale(.97); }
  `;
  document.head.appendChild(s);
})();

/* ─── Toast System ─────────────────────────────── */
const _toastMeta = {
  success: { icon: 'check_circle',   title: 'Success'  },
  error:   { icon: 'cancel',         title: 'Error'    },
  info:    { icon: 'info',           title: 'Info'     },
  warning: { icon: 'warning_amber',  title: 'Warning'  }
};

function showToast(message, type = 'success', customTitle) {
  let tc = document.getElementById('toast-container');
  if (!tc) {
    tc = document.createElement('div');
    tc.id = 'toast-container';
    document.body.appendChild(tc);
  }

  // Cap stacked toasts to 4
  const all = tc.querySelectorAll('.n-toast');
  if (all.length >= 4) _dismissToast(all[0]);

  const meta = _toastMeta[type] || _toastMeta.info;
  const dur  = type === 'error' ? 5000 : type === 'warning' ? 4500 : 3500;
  const title = customTitle || meta.title;

  const t = document.createElement('div');
  t.className = `n-toast n-toast-${type}`;
  t.innerHTML = `
    <div class="n-toast-icon">
      <span class="material-symbols-outlined" style="font-size:19px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">${meta.icon}</span>
    </div>
    <div class="n-toast-body">
      <div class="n-toast-title">${title}</div>
      <div class="n-toast-msg">${message}</div>
    </div>
    <button class="n-toast-close" aria-label="Dismiss">
      <span class="material-symbols-outlined" style="font-size:16px">close</span>
    </button>
    <div class="n-toast-bar" style="animation:nToastBarShrink ${dur}ms linear forwards;"></div>
  `;

  t.querySelector('.n-toast-close').addEventListener('click', (e) => { e.stopPropagation(); _dismissToast(t); });
  t.addEventListener('click', () => _dismissToast(t));
  tc.appendChild(t);

  t._autoTimer = setTimeout(() => _dismissToast(t), dur);
  return t;
}

function _dismissToast(t) {
  if (!t || t._gone) return;
  t._gone = true;
  clearTimeout(t._autoTimer);
  t.style.opacity = '0';
  t.style.transform = 'translateX(60px) scale(.85)';
  t.style.pointerEvents = 'none';
  setTimeout(() => t.remove(), 370);
}

// Legacy alias
function dismissToast(t) { _dismissToast(t); }

/* ─── Shared Modal Close ───────────────────────── */
function _closeModal(el) {
  if (!el) return;
  el.style.transition = 'opacity .28s ease';
  el.style.opacity = '0';
  setTimeout(() => el && el.remove(), 290);
}

/* ─── Login Error Modal ────────────────────────── */
function showLoginError(msg) {
  const existing = document.getElementById('n-error-modal');
  if (existing) _closeModal(existing);

  const overlay = document.createElement('div');
  overlay.id = 'n-error-modal';
  overlay.className = 'n-modal-bg';
  overlay.innerHTML = `
    <div class="n-modal glass" style="border-radius:26px;padding:42px 32px;text-align:center;">
      <div class="n-err-ring">
        <span class="material-symbols-outlined"
          style="color:#F87171;font-size:36px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24"
          >lock_open</span>
      </div>
      <h3 style="font-size:23px;font-weight:900;color:#fff;margin-bottom:10px;letter-spacing:-.035em;">Login Failed</h3>
      <p style="color:#94A3B8;font-size:14px;line-height:1.75;margin-bottom:30px;">${msg || 'Invalid username or password.<br>Please check your credentials and try again.'}</p>
      <button class="n-modal-action-btn" id="n-err-try-btn">
        <span class="material-symbols-outlined" style="font-size:18px">refresh</span>
        Try Again
      </button>
      <p style="font-size:11px;color:#374151;margin-top:14px;letter-spacing:.05em;">Press Esc or tap outside to dismiss</p>
    </div>`;

  overlay.querySelector('#n-err-try-btn').addEventListener('click', () => _closeModal(overlay));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) _closeModal(overlay); });
  document.body.appendChild(overlay);

  const escFn = (e) => {
    if (e.key === 'Escape') { _closeModal(overlay); document.removeEventListener('keydown', escFn); }
  };
  document.addEventListener('keydown', escFn);
}

/* ─── Welcome Modal ────────────────────────────── */
function showWelcomeModal(username) {
  if (document.getElementById('n-welcome-modal')) return;

  const overlay = document.createElement('div');
  overlay.id = 'n-welcome-modal';
  overlay.className = 'n-modal-bg';

  const firstName = (username || 'there').split(' ')[0];
  const confettiColors = ['#6366F1','#818CF8','#10B981','#F59E0B','#EC4899','#14B8A6','#EF4444','#FBBF24','#38BDF8'];
  const dots = Array.from({length: 30}, (_, i) => {
    const c    = confettiColors[i % confettiColors.length];
    const left = (Math.random() * 92 + 2).toFixed(1);
    const del  = (Math.random() * 1.4).toFixed(2);
    const dur  = (1.1 + Math.random() * 1.4).toFixed(2);
    const size = (5 + Math.random() * 5).toFixed(0);
    return `<div class="n-confetti-dot" style="left:${left}%;width:${size}px;height:${size}px;background:${c};animation-duration:${dur}s;animation-delay:${del}s;"></div>`;
  }).join('');

  overlay.innerHTML = `
    <div class="n-welcome-modal glass" style="border-radius:28px;padding:46px 32px;">
      <div class="n-welcome-confetti">${dots}</div>
      <div class="n-welcome-avatar">
        <span class="material-symbols-outlined"
          style="font-size:40px;color:#fff;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24"
          >waving_hand</span>
      </div>
      <h2 style="font-size:28px;font-weight:900;color:#fff;letter-spacing:-.045em;margin-bottom:12px;">
        Hey, <span style="background:linear-gradient(135deg,#818CF8,#6366F1);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${firstName}!</span>
      </h2>
      <p style="color:#94A3B8;font-size:14.5px;line-height:1.75;margin-bottom:10px;">
        Welcome back to your workspace 🚀
      </p>
      <p style="color:#6366F1;font-size:13px;font-weight:600;letter-spacing:.04em;margin-bottom:32px;">
        ✨ Ready to capture some great ideas?
      </p>
      <button class="n-welcome-close" id="n-welcome-close-btn">
        <span class="material-symbols-outlined" style="font-size:18px">rocket_launch</span>
        Let's Go!
      </button>
    </div>`;

  overlay.querySelector('#n-welcome-close-btn').addEventListener('click', () => _closeModal(overlay));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) _closeModal(overlay); });
  document.body.appendChild(overlay);

  const escFn = (e) => {
    if (e.key === 'Escape') { _closeModal(overlay); document.removeEventListener('keydown', escFn); }
  };
  document.addEventListener('keydown', escFn);
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
