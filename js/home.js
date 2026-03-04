function openVideo(src, title) {
  window.location.href = `playe.html?src=${encodeURIComponent(src)}&title=${encodeURIComponent(title)}`;
}

function toggleCart() {
  document.getElementById('sidecart').classList.toggle('open');
  document.getElementById('overlay').classList.toggle('active');
  renderCart();
}

function addToCart(title, price, img, e) {
  e.stopPropagation();
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const item = cart.find(i => i.title === title);
  if (item) item.qty++;
  else cart.push({ title, price, img, qty: 1 });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCount();
  // Flash button feedback
  const btn = e.currentTarget;
  btn.style.background = 'var(--coral)';
  btn.textContent = '✓ Added';
  setTimeout(() => {
    btn.style.background = '';
    btn.innerHTML = `<svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Add`;
  }, 900);
}

function updateQty(index, change) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (!cart[index]) return;
  cart[index].qty += change;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const items = JSON.parse(localStorage.getItem('cart') || '[]');
  const container = document.getElementById('cartItems');
  let total = 0, totalQty = 0;

  if (items.length === 0) {
    // container.innerHTML = `<div class="cart-empty">
    //   <svg width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
    //     <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
    //     <path d="M16 10a4 4 0 0 1-8 0"/>
    //   </svg>
    //   <p>Your cart is empty</p>
    // </div>`;
    container.innerHTML = `<div class="cart-empty">
  <span class="empty-icon">🛒</span>
  <h4>Your cart is empty!</h4>
  <p>Looks like you haven't added<br>anything yet. Go pick something<br>delicious! 🍽️</p>
</div>`;
  } else {
    container.innerHTML = items.map((it, i) => {
      total += it.price * it.qty;
      totalQty += it.qty;
      return `<div class="cart-item">
        <img src="${it.img}" alt="${it.title}">
        <div class="cart-details">
          <h4>${it.title}</h4>
          <div class="item-price">₹${(it.price * it.qty).toFixed(2)}</div>
          <div class="qty-row">
            <button class="qty-btn" onclick="updateQty(${i},-1)">−</button>
            <span class="qty-num">${it.qty}</span>
            <button class="qty-btn" onclick="updateQty(${i},1)">+</button>
          </div>
        </div>
        <button class="remove-btn" onclick="removeItem(${i})">
          <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
            <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
          </svg>
        </button>
      </div>`;
    }).join('');
  }

  document.getElementById('cartTotal').textContent = '₹' + total.toFixed(2);
  updateCount();
  // const delivery = total > 0 ? 40 : 0;
  // document.getElementById('cartSubtotal').textContent = '₹' + total.toFixed(2);
  // document.getElementById('cartDelivery').textContent = '₹' + delivery.toFixed(2);
  // document.getElementById('cartTotal').textContent = '₹' + (total + delivery).toFixed(2);
  // updateCount();
}

// function updateCount() {
//   const items = JSON.parse(localStorage.getItem('cart') || '[]');
//   const n = items.reduce((s, i) => s + i.qty, 0);
//   document.getElementById('cartCount').textContent = n;
// }
function updateCount() {
  const items = JSON.parse(localStorage.getItem('cart') || '[]');
  const n = items.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = n;
}
/*function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (cart.length === 0) { alert('Your cart is empty!'); return; }*/
//   function checkout() {
//   const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//   if (cart.length === 0) { showCartEmptyMsg(); return; }
//  // alert('Thank you for your order! (Demo)');
//   localStorage.removeItem('cart');
//   renderCart();
//   toggleCart();
// }
function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (cart.length === 0) { showCartEmptyMsg(); return; }
  
  // Close sidecart with animation first
  document.getElementById('sidecart').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');
  
  // Navigate after animation completes
  setTimeout(() => {
    window.location.href = 'payment.html';
  }, 350);
  
     renderCart();
     toggleCart();
}
function showCartEmptyMsg() {
  const existing = document.getElementById('cartEmptyMsg');
  if (existing) return;

  const msg = document.createElement('div');
  msg.id = 'cartEmptyMsg';
  msg.innerHTML = '🛒 Cart is empty — add some items first!';
  msg.style.cssText = `
    position: absolute;
    bottom: 90px;
    left: 50%;
    transform: translateX(-50%) translateY(10px);
    background: var(--charcoal);
    color: white;
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    z-index: 9999;
    box-shadow: 0 4px 16px rgba(0,0,0,0.25);
  `;

  document.getElementById('sidecart').appendChild(msg);

  // Trigger transition
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      msg.style.opacity = '1';
      msg.style.transform = 'translateX(-50%) translateY(0)';
    });
  });

  setTimeout(() => {
    msg.style.opacity = '0';
    msg.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => msg.remove(), 300);
  }, 2500);
}
function filterDishes() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('.gallery .card');
  let visible = 0;
  cards.forEach(card => {
    const name = card.querySelector('h3').textContent.toLowerCase();
    const show = name.includes(q);
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  document.getElementById('dishCount').textContent = visible + ' dish' + (visible !== 1 ? 'es' : '') + ' available';
}

window.onload = updateCount;