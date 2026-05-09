// app.js - Vanilla JS Logic for Notiva App

// State Management
const NotivaState = {
  get user() { return JSON.parse(localStorage.getItem('notiva_auth_user')) || { name: 'User', email: 'user@notiva.io' }; },
  set user(v) {
    if (v) localStorage.setItem('notiva_auth_user', JSON.stringify(v));
    else localStorage.removeItem('notiva_auth_user');
  }
};

// Auth Guard — used by dashboard/notes/edit/add pages
function requireAuth() {
  if (typeof api !== 'undefined' && !api.getToken()) {
    window.location.href = 'index.html';
  }
}

function handleLogout() {
  if (typeof api !== 'undefined') api.removeToken();
  NotivaState.user = null;
  window.location.href = 'index.html';
}

// Fallback toast (notiva-bg.js overrides this with the nicer version when loaded)
function showToast(message, type = 'success') {
  // If notiva-bg.js is loaded, its showToast will be used instead (defined after this file).
  // This is a minimal fallback.
  let tc = document.getElementById('toast-container');
  if (!tc) { tc = document.createElement('div'); tc.id = 'toast-container'; document.body.appendChild(tc); }
  const t = document.createElement('div');
  t.style.cssText = 'display:flex;align-items:center;gap:8px;padding:12px 18px;border-radius:12px;font-size:13.5px;font-weight:500;backdrop-filter:blur(20px);box-shadow:0 10px 32px rgba(0,0,0,.45);margin-bottom:8px;max-width:340px;animation:toastSlide .35s ease both;font-family:Inter,sans-serif;';
  t.style.background = type === 'success' ? 'rgba(16,185,129,.14)' : 'rgba(239,68,68,.14)';
  t.style.border = type === 'success' ? '1px solid rgba(16,185,129,.28)' : '1px solid rgba(239,68,68,.28)';
  t.style.color = type === 'success' ? '#6EE7B7' : '#FCA5A5';
  t.innerHTML = message;
  tc.appendChild(t);
  setTimeout(() => { t.style.opacity='0'; t.style.transform='translateX(30px)'; t.style.transition='.3s ease'; setTimeout(()=>t.remove(),300); }, 3200);
}

// Legacy sidebar support (older pages used initSidebarNavigation)
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-overlay');
  if (sidebar) sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open');
}

function initSidebarNavigation() {
  const overlay = document.getElementById('mobile-overlay');
  if (overlay) overlay.addEventListener('click', toggleSidebar);
  const btn = document.getElementById('menu-btn');
  if (btn) btn.addEventListener('click', toggleSidebar);
  const closeBtn = document.getElementById('sidebar-close');
  if (closeBtn) closeBtn.addEventListener('click', toggleSidebar);
  document.querySelectorAll('.btn-logout').forEach(b => b.addEventListener('click', handleLogout));
}
