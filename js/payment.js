let currentMethod = 'card';
let subtotal = 0;
let total = 0;

// ── CHECKOUT SOURCE ──
// Determines whether payment is for a direct "Proceed" from playe.html (buyNow)
// or from the cart. Using hv_checkoutSource survives page navigation (unlike window vars).
function getCheckoutCart() {
  const source = localStorage.getItem('hv_checkoutSource');
  if (source === 'buyNow') {
    return { items: JSON.parse(localStorage.getItem('hv_buyNow') || '[]'), source: 'buyNow' };
  }
  return { items: JSON.parse(localStorage.getItem('cart') || '[]'), source: 'cart' };
}

// ── LOAD CART ──
function loadSummary() {
  const { items: cart } = getCheckoutCart();
  const container = document.getElementById('summaryItems');

  if (cart.length === 0) {
    container.innerHTML = `<p style="font-size:13px;color:var(--stone);text-align:center;padding:20px 0">No items in cart</p>`;
    document.getElementById('itemCountText').textContent = '0 items';
    return;
  }

  subtotal = 0;
  let totalQty = 0;
  container.innerHTML = cart.map(item => {
    const lineTotal = item.price * item.qty;
    subtotal += lineTotal;
    totalQty += item.qty;
    return `
      <div class="summary-item">
        <img src="${item.img}" alt="${item.title}">
        <div class="si-info">
          <h5>${item.title}</h5>
          <span>Qty: ${item.qty}</span>
        </div>
        <div class="si-price">₹${lineTotal.toFixed(2)}</div>
      </div>`;
  }).join('');

  document.getElementById('itemCountText').textContent = `${totalQty} item${totalQty !== 1 ? 's' : ''} in your order`;
  updateTotal();
}

function updateTotal() {
  const delivery = 20;
  const cod = currentMethod === 'cod' ? 10 : 0;
  total = subtotal + delivery + cod;
  document.getElementById('subtotalVal').textContent = subtotal.toFixed(2);
  document.getElementById('totalVal').textContent = total.toFixed(2);
  document.getElementById('payBtn').querySelector('#payBtnText').textContent =
    currentMethod === 'cod' ? `Confirm Order — ₹${total.toFixed(2)}` : `Pay ₹${total.toFixed(2)}`;
  document.getElementById('successAmount').textContent = `₹${total.toFixed(2)}`;
  document.getElementById('codFeeRow').style.display = currentMethod === 'cod' ? 'flex' : 'none';
}

// ── SWITCH METHOD ──
function switchMethod(method, el) {
  currentMethod = method;
  document.querySelectorAll('.method-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.payment-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`panel-${method}`).classList.add('active');
  updateTotal();
}

// ── UPI SELECT ──
function selectUpi(el) {
  document.querySelectorAll('.upi-app').forEach(u => u.classList.remove('selected'));
  el.classList.add('selected');
}

// ── BANK SELECT ──
function selectBank(el) {
  document.querySelectorAll('.bank-item').forEach(b => b.classList.remove('selected'));
  el.classList.add('selected');
}

// ── CARD FORMATTING ──
function formatCard(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = v.replace(/(.{4})/g, '$1 ').trim();
  const first = v[0];
  document.getElementById('visaIcon').className = 'card-icon' + (first === '4' ? ' active-visa' : '');
  document.getElementById('mcIcon').className   = 'card-icon' + (first === '5' ? ' active-mc' : '');
}

function formatExpiry(input) {
  let v = input.value.replace(/\D/g, '').substring(0, 4);
  if (v.length >= 2) v = v.substring(0, 2) + ' / ' + v.substring(2);
  input.value = v;
}

// ── VALIDATE ──
function validate() {
  const fname   = document.getElementById('fname').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const email   = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const city    = document.getElementById('city').value.trim();
  const pin     = document.getElementById('pin').value.trim();
  const state   = document.getElementById('state').value;

  if (!fname)    { showToast('⚠️ Please enter your name'); return false; }
  if (!phone || phone.length < 10) { showToast('⚠️ Enter a valid phone number'); return false; }
  if (!email || !email.includes('@')) { showToast('⚠️ Enter a valid email'); return false; }
  if (!address)  { showToast('⚠️ Please enter your address'); return false; }
  if (!city)     { showToast('⚠️ Please enter your city'); return false; }
  if (!pin || pin.length < 6) { showToast('⚠️ Enter a valid 6-digit PIN code'); return false; }
  if (!state)    { showToast('⚠️ Please select your state'); return false; }

  if (currentMethod === 'card') {
    const num = document.getElementById('cardNum').value.replace(/\s/g,'');
    const exp = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value;
    const name = document.getElementById('cardName').value.trim();
    if (!name)         { showToast('⚠️ Enter name on card'); return false; }
    if (num.length < 16) { showToast('⚠️ Enter valid 16-digit card number'); return false; }
    if (!exp || exp.length < 7) { showToast('⚠️ Enter valid expiry date'); return false; }
    if (!cvv || cvv.length < 3) { showToast('⚠️ Enter valid CVV'); return false; }
  }

  if (currentMethod === 'upi') {
    const upiId = document.getElementById('upiId').value.trim();
    const selected = document.querySelector('.upi-app.selected');
    if (!selected && !upiId) { showToast('⚠️ Select a UPI app or enter UPI ID'); return false; }
    if (upiId && !upiId.includes('@')) { showToast('⚠️ Enter a valid UPI ID (e.g. name@upi)'); return false; }
  }

  if (currentMethod === 'netbanking') {
    const selected = document.querySelector('.bank-item.selected');
    if (!selected) { showToast('⚠️ Please select your bank'); return false; }
  }

  return true;
}

// ── PROCESS PAYMENT ──
function processPayment() {
  if (!validate()) return;

  const btn     = document.getElementById('payBtn');
  const spinner = document.getElementById('spinner');
  const btnText = document.getElementById('payBtnText');

  btn.disabled = true;
  spinner.style.display = 'block';
  btnText.textContent = 'Processing…';

  setTimeout(() => {
    spinner.style.display = 'none';
    btn.disabled = false;
    btnText.textContent = `Pay ₹${total.toFixed(2)}`;

    // ── Update profile order stats ──
    const stats = JSON.parse(localStorage.getItem('hv_stats') || '{"orders":0,"spent":0}');
    stats.orders += 1;
    stats.spent  += total;
    localStorage.setItem('hv_stats', JSON.stringify(stats));
    // Persist per-user
    const _uk = (localStorage.getItem('currentUserEmail') || '').replace(/[^a-z0-9]/g, '_');
    if (_uk) localStorage.setItem(`hv_stats_${_uk}`, JSON.stringify(stats));

    // ── Save payment method so buynow.html can show correct delivery charge ──
    localStorage.setItem('paymentMethod', currentMethod);

    // ── Get the cart items that were actually ordered ──
    const { items: orderedCart, source } = getCheckoutCart();
    const delivery = 20 + (currentMethod === 'cod' ? 10 : 0);

    // ── Save order to history for profile page ──
    if (orderedCart.length > 0) {
      const history = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      const subtotalAmt = orderedCart.reduce((s, item) => s + item.price * item.qty, 0);
      history.unshift({
        img:   orderedCart[0].img,
        title: orderedCart.length > 1 ? `${orderedCart[0].title} +${orderedCart.length - 1} more` : orderedCart[0].title,
        qty:   orderedCart.reduce((s, item) => s + item.qty, 0),
        total: (subtotalAmt + delivery).toFixed(2),
        date:  new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'})
      });
      localStorage.setItem('orderHistory', JSON.stringify(history));
      if (_uk) localStorage.setItem(`hv_orderHistory_${_uk}`, JSON.stringify(history));
    }

    // ── Save snapshot for buynow.html confirmation page ──
    localStorage.setItem('order', JSON.stringify(orderedCart));

    // ── Clean up ONLY the source that was checked out ──
    if (source === 'buyNow') {
      localStorage.removeItem('hv_buyNow');
      localStorage.removeItem('hv_checkoutSource');
      // cart remains UNTOUCHED
    } else {
      localStorage.removeItem('cart');
      localStorage.removeItem('hv_checkoutSource');
    }

    document.getElementById('successOverlay').classList.add('show');
  }, 2200);
}

function goHome() {
  window.location.href = 'buynow.html';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

//window.onload = loadSummary;
function goBack() {
  const source = localStorage.getItem('hv_checkoutSource');
  if (source === 'buyNow') {
    history.back();
  } else {
    window.location.href = 'cart.html';
  }
}

window.onload = function() {
  // Set back button label based on source
  const source = localStorage.getItem('hv_checkoutSource');
  if (source === 'buyNow') {
    document.getElementById('backBtnLabel').textContent = '← Back';
  }
  loadSummary();
  prefillFromProfile();
};

function prefillFromProfile() {
  // Try saved addresses first, then fall back to profile
  const addresses = JSON.parse(localStorage.getItem('hv_addresses') || '[]');
  const profile   = JSON.parse(localStorage.getItem('hv_profile') || 'null');
  const signupUser = JSON.parse(localStorage.getItem('user') || 'null');

  // Get default address or first saved address
  const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];

  // Fill name from profile or signup
  const name = (profile && profile.name) || (signupUser && signupUser.name) || '';
  const email = (profile && profile.email) || (signupUser && signupUser.email) || '';
  const phone = (profile && profile.phone) || '';

  if (name) {
    const parts = name.trim().split(' ');
    document.getElementById('fname').value = parts[0] || '';
    document.getElementById('lname').value = parts.slice(1).join(' ') || '';
  }
  if (email) document.getElementById('email').value = email;
  if (phone) document.getElementById('phone').value = phone;

  // Fill address from saved addresses
  if (defaultAddr) {
    document.getElementById('address').value = defaultAddr.fullAddr || '';
    document.getElementById('city').value    = defaultAddr.city     || '';
    document.getElementById('pin').value     = defaultAddr.pin      || '';
    if (defaultAddr.phone && !phone) document.getElementById('phone').value = defaultAddr.phone;
    // Try to match state
    if (profile && profile.city) matchState(profile.city);
  } else if (profile && profile.city) {
    document.getElementById('city').value = profile.city;
  }

  // Show prefill banner if data was loaded
  if (name || defaultAddr) showPrefillBanner(defaultAddr);
}

function matchState(city) {
  const cityStateMap = {
    'chennai': 'Tamil Nadu', 'coimbatore': 'Tamil Nadu', 'madurai': 'Tamil Nadu',
    'mumbai': 'Maharashtra', 'pune': 'Maharashtra', 'nagpur': 'Maharashtra',
    'bangalore': 'Karnataka', 'bengaluru': 'Karnataka', 'mysuru': 'Karnataka',
    'delhi': 'Delhi', 'new delhi': 'Delhi',
    'hyderabad': 'Telangana', 'warangal': 'Telangana',
    'ahmedabad': 'Gujarat', 'surat': 'Gujarat',
    'kolkata': 'West Bengal',
    'lucknow': 'Uttar Pradesh', 'kanpur': 'Uttar Pradesh',
    'jaipur': 'Rajasthan', 'jodhpur': 'Rajasthan',
    'kochi': 'Kerala', 'thiruvananthapuram': 'Kerala',
    'chandigarh': 'Punjab', 'ludhiana': 'Punjab',
    'gurugram': 'Haryana', 'faridabad': 'Haryana'
  };
  const match = cityStateMap[city.toLowerCase()];
  if (match) {
    const select = document.getElementById('state');
    for (let opt of select.options) {
      if (opt.value === match) { select.value = match; break; }
    }
  }
}

function showPrefillBanner(addr) {
  // Insert banner above the delivery address form
  const stepCard = document.querySelector('.section-card');
  const banner = document.createElement('div');
  banner.id = 'prefillBanner';
  banner.style.cssText = `
    background: linear-gradient(135deg, rgba(39,174,96,0.08), rgba(39,174,96,0.04));
    border: 1.5px solid rgba(39,174,96,0.25);
    border-radius: 12px;
    padding: 12px 16px;
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    animation: fadeUp 0.4s ease both;
  `;
  banner.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;">
      <span style="font-size:18px;">✅</span>
      <div>
        <div style="font-size:13px;font-weight:700;color:#1a7a45;">Address prefilled from your profile</div>
        <div style="font-size:11.5px;color:var(--stone);margin-top:1px;">
          ${addr ? `Using: <strong>${addr.label || 'Saved'}</strong> address` : 'Using your profile info'}
        </div>
      </div>
    </div>
    <button onclick="clearPrefill()" style="
      background:none;border:1.5px solid rgba(39,174,96,0.3);
      color:#27ae60;padding:5px 12px;border-radius:8px;
      font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;
      cursor:pointer;white-space:nowrap;transition:all 0.2s;
    " onmouseover="this.style.background='rgba(39,174,96,0.1)'" 
       onmouseout="this.style.background='none'">
      ✏️ Edit
    </button>
  `;
  // Insert inside the first section-card after step-header
  const stepHeader = stepCard.querySelector('.step-header');
  stepHeader.insertAdjacentElement('afterend', banner);
}

function clearPrefill() {
  // Clear all address fields for manual entry
  ['fname','lname','phone','email','address','city','pin'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('state').value = '';
  const banner = document.getElementById('prefillBanner');
  if (banner) {
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(-8px)';
    banner.style.transition = 'all 0.3s ease';
    setTimeout(() => banner.remove(), 300);
  }
  // Focus first field
  document.getElementById('fname').focus();
  showToast('✏️ Fields cleared — enter your details');
}