/* reminder.js — Notiva Reminder System */

/* ── Inject Reminder Styles ── */
(function () {
  if (document.getElementById('n-reminder-styles')) return;
  const s = document.createElement('style');
  s.id = 'n-reminder-styles';
  s.textContent = `
    /* Bell Button */
    .reminder-btn {
      position:relative; display:flex; align-items:center; justify-content:center;
      width:38px; height:38px; border-radius:10px; border:none; cursor:pointer;
      background:rgba(245,158,11,.1); color:#FBBF24;
      transition:all .25s; flex-shrink:0;
    }
    .reminder-btn:hover { background:rgba(245,158,11,.22); transform:scale(1.08); box-shadow:0 0 18px rgba(245,158,11,.35); }
    .reminder-btn.has-reminder { background:rgba(245,158,11,.2); box-shadow:0 0 14px rgba(245,158,11,.4); animation:rBellRing 3s ease-in-out infinite; }
    .reminder-badge {
      position:absolute; top:-4px; right:-4px;
      width:10px; height:10px; border-radius:50%;
      background:#F59E0B; border:2px solid var(--bg,#080C18);
      animation:rBadgePulse 2s ease-in-out infinite;
    }
    @keyframes rBellRing {
      0%,85%,100% { transform:rotate(0deg); }
      88% { transform:rotate(-12deg); }
      92% { transform:rotate(12deg); }
      96% { transform:rotate(-8deg); }
    }
    @keyframes rBadgePulse {
      0%,100% { transform:scale(1); opacity:1; }
      50% { transform:scale(1.4); opacity:.7; }
    }

    /* Modal */
    .r-overlay {
      position:fixed; inset:0; z-index:100001;
      background:rgba(0,0,0,.78); backdrop-filter:blur(16px);
      display:flex; align-items:center; justify-content:center; padding:16px;
      animation:rBgIn .22s ease both;
    } 
    @keyframes rBgIn { from{opacity:0} to{opacity:1} }
    .r-modal {
      width:100%; max-width:460px;
      background:rgba(13,18,38,.92);
      border:1px solid rgba(245,158,11,.2);
      border-radius:26px; padding:36px 30px;
      box-shadow:0 0 60px rgba(245,158,11,.12), 0 24px 60px rgba(0,0,0,.6);
      animation:rModalIn .5s cubic-bezier(.34,1.56,.64,1) both;
    }
    @keyframes rModalIn {
      from { opacity:0; transform:scale(.78) translateY(30px); }
      to   { opacity:1; transform:scale(1) translateY(0); }
    }
    .r-header {
      display:flex; align-items:center; gap:14px; margin-bottom:28px;
    }
    .r-icon-ring {
      width:52px; height:52px; border-radius:16px; flex-shrink:0;
      background:linear-gradient(135deg,rgba(245,158,11,.25),rgba(217,119,6,.15));
      border:1px solid rgba(245,158,11,.35);
      display:flex; align-items:center; justify-content:center;
      box-shadow:0 0 24px rgba(245,158,11,.2);
      animation:rBellRing 3s ease-in-out infinite;
    }
    .r-section-label {
      font-size:10px; font-weight:700; letter-spacing:.18em;
      text-transform:uppercase; color:rgba(245,158,11,.7);
      margin-bottom:8px; margin-left:2px;
    }
    .r-datetime-input {
      width:100%; padding:13px 16px; border-radius:13px;
      background:rgba(8,12,24,.6); border:1px solid rgba(245,158,11,.2);
      color:#fff; font-size:14px; font-family:inherit; outline:none;
      transition:all .25s; cursor:pointer;
    }
    .r-datetime-input:focus { border-color:rgba(245,158,11,.55); box-shadow:0 0 0 3px rgba(245,158,11,.1); }
    .r-datetime-input::-webkit-calendar-picker-indicator { filter:invert(1) sepia(1) saturate(3) hue-rotate(5deg); cursor:pointer; opacity:.7; }
    .r-note-preview {
      padding:12px 14px; border-radius:12px;
      background:rgba(245,158,11,.06); border:1px solid rgba(245,158,11,.14);
      font-size:13px; color:#94A3B8; line-height:1.5;
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
      margin-bottom:20px;
    }
    .r-note-preview strong { color:#FDE68A; font-weight:700; }
    .r-set-btn {
      width:100%; padding:14px; border-radius:13px;
      background:linear-gradient(135deg,#F59E0B,#D97706);
      color:#fff; font-weight:700; font-size:14.5px; border:none; cursor:pointer;
      box-shadow:0 0 24px rgba(245,158,11,.35); font-family:inherit;
      transition:all .25s; display:flex; align-items:center; justify-content:center; gap:8px;
      position:relative; overflow:hidden;
    }
    .r-set-btn::before {
      content:''; position:absolute; top:0; left:-100%; width:60%; height:100%;
      background:linear-gradient(90deg,transparent,rgba(255,255,255,.2),transparent);
      transition:left .5s;
    }
    .r-set-btn:hover::before { left:150%; }
    .r-set-btn:hover { transform:translateY(-2px); box-shadow:0 0 36px rgba(245,158,11,.55); }
    .r-set-btn:active { transform:translateY(0) scale(.97); }
    .r-clear-btn {
      width:100%; padding:11px; border-radius:13px; margin-top:10px;
      background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.2);
      color:#FCA5A5; font-weight:600; font-size:13.5px; cursor:pointer;
      font-family:inherit; transition:all .2s;
      display:flex; align-items:center; justify-content:center; gap:6px;
    }
    .r-clear-btn:hover { background:rgba(239,68,68,.16); }
    .r-email-preview-btn {
      width:100%; padding:11px; border-radius:13px; margin-top:10px;
      background:rgba(99,102,241,.08); border:1px solid rgba(99,102,241,.2);
      color:#a5b4fc; font-weight:600; font-size:13.5px; cursor:pointer;
      font-family:inherit; transition:all .2s;
      display:flex; align-items:center; justify-content:center; gap:6px;
    }
    .r-email-preview-btn:hover { background:rgba(99,102,241,.16); }
    .r-active-chip {
      display:inline-flex; align-items:center; gap:6px;
      font-size:11.5px; font-weight:700; color:#FBBF24;
      background:rgba(245,158,11,.12); border:1px solid rgba(245,158,11,.25);
      border-radius:999px; padding:5px 12px; margin-bottom:20px;
    }

    /* Alert overlay */
    .r-alert-overlay {
      position:fixed; inset:0; z-index:200000;
      background:rgba(0,0,0,.82); backdrop-filter:blur(20px);
      display:flex; align-items:center; justify-content:center; padding:16px;
      animation:rBgIn .3s ease both;
    }
    .r-alert-box {
      width:100%; max-width:420px; border-radius:26px;
      background:rgba(13,18,38,.95);
      border:1px solid rgba(245,158,11,.4);
      box-shadow:0 0 80px rgba(245,158,11,.25), 0 24px 60px rgba(0,0,0,.7);
      padding:40px 30px; text-align:center;
      animation:rAlertPop .6s cubic-bezier(.34,1.56,.64,1) both;
    }
    @keyframes rAlertPop {
      from { opacity:0; transform:scale(.7) translateY(40px); }
      to   { opacity:1; transform:scale(1) translateY(0); }
    }
    .r-alert-ring {
      width:80px; height:80px; border-radius:50%;
      background:radial-gradient(circle,rgba(245,158,11,.22),rgba(245,158,11,.06));
      border:2px solid rgba(245,158,11,.5);
      display:flex; align-items:center; justify-content:center;
      margin:0 auto 22px;
      animation:rAlertRing 0.6s ease-in-out infinite alternate;
    }
    @keyframes rAlertRing {
      from { box-shadow:0 0 0 0 rgba(245,158,11,.5); }
      to   { box-shadow:0 0 0 20px rgba(245,158,11,0); }
    }
    .r-dismiss-btn {
      width:100%; padding:14px; border-radius:13px; margin-top:24px;
      background:linear-gradient(135deg,#F59E0B,#D97706);
      color:#fff; font-weight:700; font-size:14.5px; border:none; cursor:pointer;
      box-shadow:0 0 24px rgba(245,158,11,.4); font-family:inherit;
      transition:all .25s;
    }
    .r-dismiss-btn:hover { transform:translateY(-2px); box-shadow:0 0 36px rgba(245,158,11,.6); }

    /* Email preview */
    .r-email-modal {
      width:100%; max-width:520px; border-radius:22px;
      background:rgba(13,18,38,.96);
      border:1px solid rgba(99,102,241,.25);
      box-shadow:0 24px 60px rgba(0,0,0,.6);
      overflow:hidden;
      animation:rModalIn .5s cubic-bezier(.34,1.56,.64,1) both;
    }
    .r-email-header {
      background:linear-gradient(135deg,#6366F1,#4338CA);
      padding:28px 28px 22px; text-align:center;
    }
    .r-email-body { padding:28px; }
    .r-email-field {
      font-size:11.5px; color:#4B5563; margin-bottom:4px;
      display:flex; gap:8px;
    }
    .r-email-field strong { color:#6B7280; min-width:40px; }
    .r-email-separator { height:1px; background:rgba(255,255,255,.06); margin:16px 0; }
  `;
  document.head.appendChild(s);
})();

/* ── Reminder Storage ── */
const ReminderStore = {
  key: 'notiva_reminders',
  getAll() { try { return JSON.parse(localStorage.getItem(this.key)) || {}; } catch { return {}; } },
  get(noteId) { return this.getAll()[noteId] || null; },
  set(noteId, data) {
    const all = this.getAll();
    all[noteId] = data;
    localStorage.setItem(this.key, JSON.stringify(all));
  },
  remove(noteId) {
    const all = this.getAll();
    delete all[noteId];
    localStorage.setItem(this.key, JSON.stringify(all));
  }
};

/* ── Bell Sound (Web Audio API) ── */
function playReminderSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.18);
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.18);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + i * 0.18 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.18 + 0.55);
      osc.start(ctx.currentTime + i * 0.18);
      osc.stop(ctx.currentTime + i * 0.18 + 0.6);
    });
  } catch (e) { }
}

/* ── Vibrate ── */
function vibrateAlert() {
  if ('vibrate' in navigator) navigator.vibrate([300, 100, 300, 100, 500]);
}

/* ── Show Reminder Alert ── */
function showReminderAlert(noteTitle, noteId) {
  playReminderSound();
  vibrateAlert();

  // Browser notification
  if (Notification.permission === 'granted') {
    new Notification('⏰ Notiva Reminder', {
      body: `Time to revisit: "${noteTitle}"`,
      icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%236366F1"/><text y=".9em" font-size="70" x="15">✨</text></svg>'
    });
  }

  const overlay = document.createElement('div');
  overlay.className = 'r-alert-overlay';
  overlay.innerHTML = `
    <div class="r-alert-box">
      <div class="r-alert-ring">
        <span class="material-symbols-outlined" style="font-size:38px;color:#FBBF24;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">notifications_active</span>
      </div>
      <div style="font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(245,158,11,.7);margin-bottom:10px;">⏰ Reminder</div>
      <h2 style="font-size:22px;font-weight:900;color:#fff;letter-spacing:-.03em;margin-bottom:10px;">Time to check your note!</h2>
      <p style="color:#94A3B8;font-size:14px;line-height:1.7;">
        You set a reminder for<br>
        <span style="color:#FDE68A;font-weight:700;">"${noteTitle}"</span>
      </p>
      <button class="r-dismiss-btn" onclick="this.closest('.r-alert-overlay').remove(); if(typeof ReminderStore!=='undefined') ReminderStore.remove('${noteId}');">
        <span style="display:flex;align-items:center;justify-content:center;gap:8px;">
          <span class="material-symbols-outlined" style="font-size:18px">check_circle</span>
          Got it!
        </span>
      </button>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

/* ── Check Due Reminders ── */
function checkReminders() {
  const all = ReminderStore.getAll();
  const now = Date.now();
  Object.entries(all).forEach(([noteId, r]) => {
    if (r.time <= now && !r.fired) {
      r.fired = true;
      ReminderStore.set(noteId, r);
      showReminderAlert(r.title, noteId);
    }
  });
}
// Check every 30 seconds
setInterval(checkReminders, 30000);
checkReminders();

/* ── Email Preview Modal ── */
function showEmailPreview(noteTitle, reminderTime, userEmail) {
  const dt = new Date(reminderTime);
  const formattedDate = dt.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const userName = (NotivaState?.user?.name || NotivaState?.user?.userName || 'there').split(' ')[0];
  const email = userEmail || NotivaState?.user?.email || 'your registered email';

  const existing = document.getElementById('r-email-preview-modal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'r-email-preview-modal';
  overlay.className = 'r-overlay';
  overlay.innerHTML = `
    <div class="r-email-modal">
      <div class="r-email-header">
        <div style="font-size:28px;margin-bottom:10px;">⏰</div>
        <div style="font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.6);margin-bottom:6px;">Email Preview</div>
        <h3 style="font-size:18px;font-weight:800;color:#fff;letter-spacing:-.02em;">This is how your reminder email will look</h3>
      </div>
      <div class="r-email-body">
        <div class="r-email-field"><strong>To:</strong> <span style="color:#94A3B8;">${email}</span></div>
        <div class="r-email-field"><strong>From:</strong> <span style="color:#94A3B8;">reminders@notiva.app</span></div>
        <div class="r-email-field"><strong>Sub:</strong> <span style="color:#94A3B8;">⏰ Your Notiva Reminder — ${noteTitle}</span></div>
        <div class="r-email-separator"></div>
        <div style="font-size:13px;color:#E2E8F0;line-height:1.85;">
          <p style="color:#94A3B8;font-size:12px;margin-bottom:14px;">Hi <strong style="color:#fff;">${userName}</strong>,</p>
          <p style="margin-bottom:12px;">This is your scheduled reminder from <strong style="color:#818CF8;">Notiva</strong>.</p>
          <div style="background:rgba(245,158,11,.1);border:1px solid rgba(245,158,11,.25);border-radius:12px;padding:14px 16px;margin-bottom:14px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(245,158,11,.8);margin-bottom:6px;">📌 Note</div>
            <div style="font-size:15px;font-weight:700;color:#FDE68A;">${noteTitle}</div>
          </div>
          <div style="background:rgba(99,102,241,.08);border:1px solid rgba(99,102,241,.18);border-radius:12px;padding:12px 16px;margin-bottom:16px;">
            <div style="font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(99,102,241,.7);margin-bottom:4px;">⏰ Reminder Time</div>
            <div style="font-size:14px;color:#C7D2FE;font-weight:600;">${formattedDate} at ${formattedTime}</div>
          </div>
          <p style="color:#64748B;font-size:12px;margin-bottom:0;">You're receiving this because you set a reminder in Notiva. Open the app to revisit your note.</p>
        </div>
        <div class="r-email-separator"></div>
        <button onclick="document.getElementById('r-email-preview-modal').remove()" style="width:100%;padding:12px;border-radius:12px;background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);color:#a5b4fc;font-weight:600;font-size:13.5px;cursor:pointer;font-family:inherit;transition:all .2s;" onmouseover="this.style.background='rgba(99,102,241,.2)'" onmouseout="this.style.background='rgba(99,102,241,.1)'">
          Close Preview
        </button>
      </div>
    </div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

/* ── Main: Open Reminder Modal ── */
function openReminderModal(noteId, noteTitle) {
  const existing = document.getElementById('r-modal-overlay');
  if (existing) existing.remove();

  const current = ReminderStore.get(noteId);
  const hasReminder = current && !current.fired;

  // Ensure browser notification permission
  if (Notification.permission === 'default') Notification.requestPermission();

  const minDT = new Date(Date.now() + 60000).toISOString().slice(0, 16);

  const overlay = document.createElement('div');
  overlay.id = 'r-modal-overlay';
  overlay.className = 'r-overlay';
  overlay.innerHTML = `
    <div class="r-modal">
      <div class="r-header">
        <div class="r-icon-ring">
          <span class="material-symbols-outlined" style="font-size:26px;color:#FBBF24;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">notifications_active</span>
        </div>
        <div>
          <div style="font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:rgba(245,158,11,.7);margin-bottom:4px;">Note Reminder</div>
          <h2 style="font-size:20px;font-weight:900;color:#fff;letter-spacing:-.03em;">Set a Reminder</h2>
        </div>
        <button onclick="document.getElementById('r-modal-overlay').remove()" style="margin-left:auto;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:9px;color:var(--muted,#94A3B8);cursor:pointer;padding:6px;display:flex;transition:all .2s;" onmouseover="this.style.background='rgba(255,255,255,.1)'" onmouseout="this.style.background='rgba(255,255,255,.05)'">
          <span class="material-symbols-outlined" style="font-size:18px">close</span>
        </button>
      </div>

      ${hasReminder ? `<div class="r-active-chip"><span class="material-symbols-outlined" style="font-size:14px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">alarm_on</span> Active: ${new Date(current.time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>` : ''}

      <div class="r-section-label">Note</div>
      <div class="r-note-preview"><strong>📝</strong> ${noteTitle || 'Untitled Note'}</div>

      <div class="r-section-label">Reminder Date & Time</div>
      <input type="datetime-local" id="r-datetime" class="r-datetime-input" min="${minDT}"
        value="${hasReminder ? new Date(current.time).toISOString().slice(0, 16) : ''}"
        style="margin-bottom:22px;">

      <button class="r-set-btn" id="r-set-btn">
        <span class="material-symbols-outlined" style="font-size:18px;font-variation-settings:'FILL' 1,'wght' 400,'GRAD' 0,'opsz' 24">alarm_add</span>
        ${hasReminder ? 'Update Reminder' : 'Set Reminder'}
      </button>

      <button class="r-email-preview-btn" id="r-email-btn">
        <span class="material-symbols-outlined" style="font-size:16px">mail_outline</span>
        Preview Email Notification
      </button>

      ${hasReminder ? `<button class="r-clear-btn" id="r-clear-btn">
        <span class="material-symbols-outlined" style="font-size:16px">alarm_off</span>
        Clear Reminder
      </button>` : ''}

      <p style="font-size:11px;color:#374151;text-align:center;margin-top:14px;letter-spacing:.04em;">You'll get an in-app alert + email at the set time</p>
    </div>`;

  // Set reminder
  overlay.querySelector('#r-set-btn').addEventListener('click', () => {
    const val = document.getElementById('r-datetime').value;
    if (!val) { showToast('Please pick a date and time.', 'warning', '⚠️ No Time Set'); return; }
    const ts = new Date(val).getTime();
    if (ts <= Date.now()) { showToast('Please choose a future time.', 'warning', '⚠️ Invalid Time'); return; }
    ReminderStore.set(noteId, { time: ts, title: noteTitle, fired: false });
    updateReminderBtn(noteId);
    overlay.remove();
    showToast(`Reminder set for ${new Date(ts).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`, 'success', '⏰ Reminder Set!');
  });

  // Email preview
  overlay.querySelector('#r-email-btn').addEventListener('click', () => {
    const val = document.getElementById('r-datetime').value;
    const ts = val ? new Date(val).getTime() : (hasReminder ? current.time : Date.now() + 3600000);
    showEmailPreview(noteTitle, ts);
  });

  // Clear
  const clearBtn = overlay.querySelector('#r-clear-btn');
  if (clearBtn) clearBtn.addEventListener('click', () => {
    ReminderStore.remove(noteId);
    updateReminderBtn(noteId);
    overlay.remove();
    showToast('Reminder cleared.', 'info', '🔕 Cleared');
  });

  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
  document.body.appendChild(overlay);
}

/* ── Update Bell Button State ── */
function updateReminderBtn(noteId) {
  const btn = document.getElementById('reminder-btn');
  if (!btn) return;
  const badge = btn.querySelector('.reminder-badge');
  const r = ReminderStore.get(noteId);
  const active = r && !r.fired;
  btn.classList.toggle('has-reminder', active);
  if (active && !badge) {
    const b = document.createElement('div');
    b.className = 'reminder-badge';
    btn.appendChild(b);
  } else if (!active && badge) {
    badge.remove();
  }
}

/* ── Create Reminder Button ── */
function createReminderButton(noteId, noteTitle) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.id = 'reminder-btn';
  btn.className = 'reminder-btn';
  btn.title = 'Set Reminder';
  btn.setAttribute('aria-label', 'Set reminder for this note');
  btn.innerHTML = `<span class="material-symbols-outlined" style="font-size:20px;font-variation-settings:'FILL' 0,'wght' 300,'GRAD' 0,'opsz' 24">alarm_add</span>`;
  btn.addEventListener('click', () => openReminderModal(noteId, noteTitle || document.getElementById('note-title')?.value?.trim() || 'Untitled Note'));
  // Sync title dynamically
  const titleEl = document.getElementById('note-title');
  if (titleEl) titleEl.addEventListener('input', () => { window._reminderNoteTitle = titleEl.value.trim(); });
  updateReminderBtn(noteId);
  return btn;
}
