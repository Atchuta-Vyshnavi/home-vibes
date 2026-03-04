function renderCart() {
  const items = JSON.parse(localStorage.getItem('cart') || '[]');
  const list  = document.getElementById('cartList');
  const count = document.getElementById('itemCount');
  list.innerHTML = '';

  if (items.length === 0) {
    count.textContent = '';
    list.innerHTML = `
      <div class="empty-state">
        <svg width="52" height="52" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <p>Your cart is empty</p>
        <button class="empty-browse" onclick="goHome()">
          Browse Menu →
        </button>
      </div>`;
    document.getElementById('summaryBody').innerHTML =
      `<p style="font-size:13px;color:var(--stone);text-align:center;padding:8px 0">No items yet</p>`;
    return;
  }

  let subtotal = 0;
  let totalQty = 0;
  items.forEach((it, i) => {
    const lineTotal = (it.price * it.qty);
    subtotal += lineTotal;
    totalQty += it.qty;
    list.innerHTML += `
      <div class="cart-item">
        <img src="${it.img}" alt="${it.title}">
        <div class="cart-details">
          <h4>${it.title}</h4>
          <div class="item-price">₹${lineTotal.toFixed(2)} <span style="font-weight:400;color:var(--stone);">(₹${it.price} × ${it.qty})</span></div>
        </div>
        <div class="cart-item-right">
          <div class="qty-controls">
            <button class="qty-btn" onclick="updateQty(${i}, -1)">−</button>
            <span class="qty-num">${it.qty}</span>
            <button class="qty-btn" onclick="updateQty(${i}, 1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeItem(${i})">
            <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        </div>
      </div>`;
  });

  count.textContent = `· ${totalQty} item${totalQty !== 1 ? 's' : ''}`;

  // Summary
  // const delivery = subtotal > 0 ? 40 : 0;
  // document.getElementById('summaryBody').innerHTML = `
  //   <div class="summary-row">
  //     <span>Subtotal</span>
  //     <span class="s-val">₹${subtotal.toFixed(2)}</span>
  //   </div>
  //   <div class="summary-row">
  //     <span>Delivery</span>
  //     <span class="s-val">₹${delivery.toFixed(2)}</span>
  //   </div>
  //   <div class="summary-divider"></div>
  //   <div class="summary-total">
  //     <span>Total</span>
  //     <span>₹${(subtotal + delivery).toFixed(2)}</span>
  //   </div>`;
  const itemRows = items.map(it => `
    <div class="summary-row">
      <span style="max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${it.title} <span style="color:#BBB;font-size:11px;">×${it.qty}</span></span>
      <span class="s-val">₹${(it.price * it.qty).toFixed(2)}</span>
    </div>`).join('');

  document.getElementById('summaryBody').innerHTML = `
    ${itemRows}
    <div class="summary-divider"></div>
    <div class="summary-total">
      <span>Total</span>
      <span>₹${subtotal.toFixed(2)}</span>
    </div>`;
}

function updateQty(i, change) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart[i].qty += change;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function removeItem(i) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.splice(i, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

// function checkout() {
//   const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//   if (cart.length === 0) { showToast('Your cart is empty!'); return; }
//   showToast('✓ Order placed successfully!');
//   localStorage.removeItem('cart');
//   setTimeout(() => { renderCart(); }, 1200);
// }
function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (cart.length === 0) { showToast('🛒 Your cart is empty!'); return; }
  localStorage.setItem('hv_checkoutSource', 'cart');
  window.location.href = 'payment.html';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function goHome() { window.location.href = 'home.html'; }

window.onload = renderCart;