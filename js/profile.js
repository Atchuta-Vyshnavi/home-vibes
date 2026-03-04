// ── State ──
// Always read the currently logged-in user's signup data as the source of truth
const _signupUser = JSON.parse(localStorage.getItem('user') || 'null');
let profile = JSON.parse(localStorage.getItem('hv_profile') || 'null') || {
  name:  (_signupUser && _signupUser.name)  || '',
  email: (_signupUser && _signupUser.email) || '',
  dob:   (_signupUser && _signupUser.dob)   || '',
  city:  '',
  phone: ''
};
// If cached profile belongs to a different user (email mismatch), reset it
if (_signupUser && profile.email && profile.email !== _signupUser.email) {
  profile = {
    name:  _signupUser.name  || '',
    email: _signupUser.email || '',
    dob:   _signupUser.dob   || '',
    city:  '',
    phone: ''
  };
  localStorage.removeItem('hv_profile');
}
let addresses = JSON.parse(localStorage.getItem('hv_addresses') || '[]');
let prefs = JSON.parse(localStorage.getItem('hv_prefs') || '["Non-Vegetarian"]');

function getUserKey() {
  const email = localStorage.getItem('currentUserEmail') || '';
  return email.replace(/[^a-z0-9]/g, '_');
}

function saveState() {
  localStorage.setItem('hv_profile',   JSON.stringify(profile));
  localStorage.setItem('hv_addresses', JSON.stringify(addresses));
  localStorage.setItem('hv_prefs',     JSON.stringify(prefs));
  // Also persist to per-user keys so data survives logout/login cycles
  const k = getUserKey();
  if (k) {
    localStorage.setItem(`hv_profile_${k}`,   JSON.stringify(profile));
    localStorage.setItem(`hv_addresses_${k}`, JSON.stringify(addresses));
    localStorage.setItem(`hv_prefs_${k}`,     JSON.stringify(prefs));
  }
}

// ── Render Profile ──
function renderProfile() {
  const { name, email, dob, city, phone } = profile;
  const initial = (name || '?')[0].toUpperCase();

  document.getElementById('avatarCircle').textContent = initial;
  document.getElementById('bannerName').textContent   = name || '—';
  document.getElementById('bannerEmail').textContent  = email || '—';
  document.getElementById('fieldName').textContent    = name || '—';
  document.getElementById('fieldEmail').textContent   = email || '—';

  // DOB display
  if (dob) {
    const d = new Date(dob + 'T00:00:00');
    document.getElementById('fieldDob').textContent = d.toLocaleDateString('en-IN', {day:'2-digit',month:'long',year:'numeric'});
    document.getElementById('fieldDob').classList.remove('muted');
  } else {
    document.getElementById('fieldDob').textContent = 'Not set';
    document.getElementById('fieldDob').classList.add('muted');
  }

  const setField = (id, val) => {
    const el = document.getElementById(id);
    if (val) { el.textContent = val; el.classList.remove('muted'); }
    else      { el.textContent = 'Not set'; el.classList.add('muted'); }
  };
  setField('fieldCity', city);
  setField('fieldPhone', phone);

  renderAddresses();
  renderPrefs();
  renderStats();
    renderOrders();
}

function renderStats() {
  const stats = JSON.parse(localStorage.getItem('hv_stats') || '{"orders":0,"spent":0}');
  document.getElementById('statOrders').textContent = stats.orders;
  document.getElementById('statSpent').textContent  = '₹' + stats.spent.toFixed(2);
}
function renderOrders() {
  const history = JSON.parse(localStorage.getItem('orderHistory') || '[]');
  const empty   = document.getElementById('orderEmpty');
  const list    = document.getElementById('orderList');
  if (history.length === 0) {
    empty.style.display = 'block';
    list.innerHTML = '';
    return;
  }
  empty.style.display = 'none';
  list.innerHTML = history.map(o => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--soft);">
      <img src="${o.img}" style="width:48px;height:48px;border-radius:9px;object-fit:cover;flex-shrink:0;">
      <div style="flex:1;min-width:0;">
        <div style="font-size:14px;font-weight:600;color:var(--charcoal);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${o.title}</div>
        <div style="font-size:12px;color:var(--stone);">Qty: ${o.qty} &nbsp;·&nbsp; ${o.date}</div>
      </div>
      <div style="font-size:14px;font-weight:700;color:var(--coral);flex-shrink:0;">₹${o.total}</div>
    </div>`).join('');
}
// ── Addresses ──
function renderAddresses() {
  const list = document.getElementById('addrList');
  if (addresses.length === 0) {
    list.innerHTML = `
      <div class="address-empty" id="addrEmpty">
        <div class="addr-icon">📍</div>
        <p>No addresses saved yet.<br>Add one so we know where to deliver your ingredients!</p>
      </div>`;
    return;
  }
  list.innerHTML = addresses.map((a, i) => `
    <div class="addr-card">
      <div class="addr-card-icon">${a.icon || '📍'}</div>
      <div class="addr-card-text">
        <h5>${a.label}${a.isDefault ? ' <span style="font-size:10px;font-weight:600;color:var(--coral);background:rgba(232,97,74,0.1);padding:2px 7px;border-radius:50px;">Default</span>' : ''}</h5>
        <p>${a.fullAddr}${a.city ? ', ' + a.city : ''}${a.pin ? ' - ' + a.pin : ''}${a.landmark ? ' (Near ' + a.landmark + ')' : ''}</p>
        ${a.phone ? `<p style="font-size:11px;margin-top:2px;color:var(--stone);">📞 ${a.phone}</p>` : ''}
      </div>
      <button class="addr-card-del" onclick="deleteAddress(${i})">
        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14H6L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4h6v2"/>
        </svg>
      </button>
    </div>`).join('');
}

function deleteAddress(i) {
  addresses.splice(i, 1);
  saveState();
  renderAddresses();
  showToast('Address removed');
}

// ── Inline Address Form ──
let addrFormOpen = false;
function toggleAddrForm() {
  addrFormOpen = !addrFormOpen;
  const wrap = document.getElementById('addrFormWrap');
  const btn  = document.getElementById('toggleAddrFormBtn');
  wrap.style.display = addrFormOpen ? 'block' : 'none';
  btn.textContent    = addrFormOpen ? '✕ Close' : '+ Add Address';
  if (addrFormOpen) {
    // reset form
    document.getElementById('afFullAddr').value = '';
    document.getElementById('afCity').value = '';
    document.getElementById('afPin').value = '';
    document.getElementById('afLandmark').value = '';
    document.getElementById('afPhone').value = '';
    document.getElementById('afDefault').checked = false;
    document.getElementById('addrTypeVal').value = 'Home';
    document.querySelectorAll('.addr-type-btn').forEach((b,i) => b.classList.toggle('active', i===0));
  }
}

function selectAddrType(btn, icon, label) {
  document.querySelectorAll('.addr-type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('addrTypeVal').value = label;
}

function saveInlineAddress() {
  const fullAddr = document.getElementById('afFullAddr').value.trim();
  if (!fullAddr) { showToast('Please enter your full address'); return; }
  const label    = document.getElementById('addrTypeVal').value;
  const city     = document.getElementById('afCity').value.trim();
  const pin      = document.getElementById('afPin').value.trim();
  const landmark = document.getElementById('afLandmark').value.trim();
  const phone    = document.getElementById('afPhone').value.trim();
  const isDefault= document.getElementById('afDefault').checked;
  const icons    = { Home: '🏠', Work: '🏢', Other: '📍' };

  if (isDefault) addresses.forEach(a => a.isDefault = false);

  addresses.push({ label, icon: icons[label] || '📍', fullAddr, city, pin, landmark, phone, isDefault });
  saveState();
  renderAddresses();
  toggleAddrForm();
  showToast('✓ Address saved!');
}

// ── Preferences ──
function renderPrefs() {
  document.querySelectorAll('.pref-btn').forEach(btn => {
    const label = btn.textContent.trim();
    btn.classList.toggle('selected', prefs.includes(label));
  });
}

function togglePref(btn) {
  const label = btn.textContent.trim();
  if (prefs.includes(label)) prefs = prefs.filter(p => p !== label);
  else prefs.push(label);
  btn.classList.toggle('selected');
  saveState();
}

// ── Edit Modal ──
function openEdit() {
  document.getElementById('editName').value  = profile.name;
  document.getElementById('editEmail').value = profile.email;
  document.getElementById('editDob').value   = profile.dob;
  document.getElementById('editCity').value  = profile.city;
  document.getElementById('editPhone').value = profile.phone;
  document.getElementById('editModal').classList.add('open');
}
function closeEdit() {
  document.getElementById('editModal').classList.remove('open');
}
function saveProfile() {
  profile.name  = document.getElementById('editName').value.trim()  || profile.name;
  profile.email = document.getElementById('editEmail').value.trim() || profile.email;
  profile.dob   = document.getElementById('editDob').value   || profile.dob;
  profile.city  = document.getElementById('editCity').value.trim();
  profile.phone = document.getElementById('editPhone').value.trim();
  saveState();
  renderProfile();
  closeEdit();
  showToast('✓ Profile updated!');
}

// ── Logout ──
function handleLogout() {
  // Clear all session and cart data on logout
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('cart');
  localStorage.removeItem('order');
  localStorage.removeItem('paymentMethod');
  localStorage.removeItem('hv_profile');
  localStorage.removeItem('hv_addresses');
  localStorage.removeItem('hv_prefs');
  localStorage.removeItem('hv_stats');
  localStorage.removeItem('orderHistory');
  showToast('Signing out…');
  setTimeout(() => window.location.href = 'index.html', 1200);
}

// ── Toast ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── Close modal on overlay click ──
document.getElementById('editModal').addEventListener('click', function(e) {
  if (e.target === this) closeEdit();
});

// ── Init ──
renderProfile();