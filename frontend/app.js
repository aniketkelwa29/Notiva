// app.js - Vanilla JS Logic for Notiva App


// State Management
const NotivaState = {
  get user() { return JSON.parse(localStorage.getItem('notiva_auth_user')) || { name: 'User', email: 'user@notiva.io' }; },
  set user(v) { 
    if(v) localStorage.setItem('notiva_auth_user', JSON.stringify(v)); 
    else localStorage.removeItem('notiva_auth_user');
  }
};

// Simple Router / Guard
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

// Toast System
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container') || (function() {
    const div = document.createElement('div');
    div.id = 'toast-container';
    div.className = 'fixed bottom-4 right-4 z-50 flex flex-col gap-2';
    document.body.appendChild(div);
    return div;
  })();

  const toast = document.createElement('div');
  const bg = type === 'success' ? 'bg-[#1E293B] border-l-4 border-[#6366F1]' : 'bg-[#1E293B] border-l-4 border-red-500';
  toast.className = `toast-enter ${bg} text-[#E2E8F0] shadow-lg rounded p-4 flex items-center min-w-[250px]`;
  toast.innerHTML = `<span class="material-symbols-outlined mr-2">${type === 'success' ? 'check_circle' : 'error'}</span> ${message}`;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Sidebar Toggle Logic
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('mobile-overlay');
  if (sidebar && overlay) {
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
  }
}

// Global Inject Sidebar
function initSidebarNavigation() {
  const overlay = document.getElementById('mobile-overlay');
  if (overlay) overlay.onclick = toggleSidebar;

  const toggleBtn = document.getElementById('menu-btn');
  if (toggleBtn) toggleBtn.onclick = toggleSidebar;

  const logoutBtns = document.querySelectorAll('.btn-logout');
  logoutBtns.forEach(b => b.onclick = handleLogout);

  // Mark active link
  const path = window.location.pathname.split('/').pop();
  document.querySelectorAll('#sidebar nav a').forEach(link => {
    if (path && link.getAttribute('href').includes(path)) {
      link.classList.add('bg-[#6366F1]', 'bg-opacity-10', 'text-[#6366F1]');
      link.classList.remove('text-[#94A3B8]');
    }
  });
}
