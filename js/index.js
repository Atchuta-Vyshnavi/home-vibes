const headings = {
  login:  { title: 'Welcome back',   sub: 'Sign in to your HomeVibes account' },
  signup: { title: 'Create account', sub: 'Join HomeVibes and start cooking' }
};

function showTab(tab, btn) {
  document.querySelectorAll('form').forEach(f => f.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tab).classList.add('active');
  btn.classList.add('active');
  document.querySelector('.form-title').textContent = headings[tab].title;
  document.querySelector('.form-sub').textContent   = headings[tab].sub;
}

async function registerUser(e) {
  e.preventDefault();
  const body = {
    fullName: document.getElementById('signupName').value.trim(),
    dob:      document.getElementById('signupDob').value,
    email:    document.getElementById('signupEmail').value.trim().toLowerCase(),
    password: document.getElementById('signupPassword').value
  };
  const res  = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json();
  showToast(data.success ? '✓ Account created! Please log in.' : '✗ ' + data.message);
  if (data.success) {
    document.getElementById('signup').reset();
    document.querySelector('.tab-btn').click();
  }
}

async function loginUser(e) {
  e.preventDefault();
  const email    = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  const res = await fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();

  if (data.success) {
    // ── Save user data so profile.js can populate the profile automatically ──
    const user = data.user || {};

    // Normalise field names — backends may return fullName or name
    const userData = {
      name:  user.fullName || user.name || '',
      email: user.email    || email,
      dob:   user.dob      || ''
    };

    // Primary key profile.js reads on load
    localStorage.setItem('user', JSON.stringify(userData));

    // Session flags
    localStorage.setItem('loggedIn',         'true');
    localStorage.setItem('currentUserEmail', userData.email);

    // Restore any previously saved per-user profile/addresses/prefs
    const k = userData.email.replace(/[^a-z0-9]/g, '_');
    const savedProfile   = localStorage.getItem(`hv_profile_${k}`);
    const savedAddresses = localStorage.getItem(`hv_addresses_${k}`);
    const savedPrefs     = localStorage.getItem(`hv_prefs_${k}`);

    if (savedProfile)   localStorage.setItem('hv_profile',   savedProfile);
    else                localStorage.removeItem('hv_profile'); // let profile.js build fresh from 'user'
    if (savedAddresses) localStorage.setItem('hv_addresses', savedAddresses);
    if (savedPrefs)     localStorage.setItem('hv_prefs',     savedPrefs);

    showToast('✓ Logged in! Redirecting…');
    setTimeout(() => window.location.href = 'home.html', 1000);
  } else {
    showToast('✗ ' + data.message);
  }
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}