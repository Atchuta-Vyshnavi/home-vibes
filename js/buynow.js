const order = JSON.parse(localStorage.getItem('order') || '[]');
const paymentMethod = localStorage.getItem('paymentMethod') || 'card';
const deliveryBase = 20;
const codFee = paymentMethod === 'cod' ? 10 : 0;
const deliveryTotal = deliveryBase + codFee;

if (order.length) {
  let subtotal = 0;
  const itemsHTML = order.map(item => {
    const lineTotal = item.price * item.qty;
    subtotal += lineTotal;
    return `
      <div class="dish-row">
        <img src="${item.img}" alt="${item.title}" style="width:40px;height:40px;border-radius:7px;object-fit:cover;flex-shrink:0;box-shadow:0 2px 6px rgba(0,0,0,0.12);">
        <div class="dish-info" style="flex:1;min-width:0;">
          <h3 style="font-size:13px;font-weight:600;color:var(--charcoal);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.title}</h3>
          <span style="font-size:11px;color:var(--stone);">Qty: ${item.qty} &nbsp;·&nbsp; <span style="color:var(--coral);font-weight:600;">₹${lineTotal.toFixed(2)}</span></span>
        </div>
      </div>`;
  }).join('');

  document.getElementById('itemsList').innerHTML = itemsHTML;
  document.getElementById('dishSubtotal').textContent = subtotal.toFixed(2);

  // Show COD row if applicable
  if (paymentMethod === 'cod') {
    document.getElementById('codFeeRow').style.display = 'flex';
    document.getElementById('codFeeDiv').style.display = 'block';
  }

  document.getElementById('dishTotal').textContent = (subtotal + deliveryTotal).toFixed(2);
} else {
  document.body.innerHTML = "<h2 style='color:rgba(255,255,255,0.6);text-align:center;font-family:DM Sans,sans-serif;padding:40px;'>No order found.</h2>";
}

function goHome() {
  const card = document.getElementById('card');
  card.style.animation = 'fadeOut 0.5s cubic-bezier(0.4,0,0.2,1) forwards';
  setTimeout(() => window.location.href = 'home.html', 500);
}

let timeLeft = 5;
const timerEl = document.getElementById('timer');
const countdown = setInterval(() => {
  timeLeft--;
  timerEl.textContent = timeLeft;
  if (timeLeft <= 0) { clearInterval(countdown); goHome(); }
}, 1000);