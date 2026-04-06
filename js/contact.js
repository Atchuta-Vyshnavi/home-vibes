// ── FAQ ──
function toggleFaq(el) {
  const wasOpen = el.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!wasOpen) el.classList.add('open');
}

// ── CHIPS ──
function selectChip(btn, id) {
  document.getElementById(id).querySelectorAll('.chip').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
}

// ── SEND ──
async function sendMsg() {
  const name  = document.getElementById('cName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const msg   = document.getElementById('cMsg').value.trim();
  if (!name || !email) { showToast('Please fill in your name and email.'); return; }

  const topic  = document.querySelector('#topicChips .chip.selected')?.textContent || 'General';
  const rating = document.querySelector('#ratingChips .chip.selected')?.textContent || null;
  const time   = new Date().toLocaleString('en-IN', {
    day:'2-digit', month:'short', year:'numeric',
    hour:'2-digit', minute:'2-digit', hour12:true
  });

  // ── Save to localStorage (always works, even if DB fails) ──
  const messages = JSON.parse(localStorage.getItem('hv_messages') || '[]');
  messages.unshift({ name, email, msg, topic, rating, time });
  localStorage.setItem('hv_messages', JSON.stringify(messages));

  // ── Also save to database ──
  try {
    const res = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, topic, message: msg, rating: rating || '' })
    });
    const data = await res.json();
    if (data.success) {
      console.log('✅ Contact message saved to DB');
    } else {
      console.warn('⚠️ DB save failed:', data.message);
    }
  } catch (err) {
    // DB save failed silently — form still works normally
    console.warn('⚠️ Could not save to DB:', err.message);
  }

  document.getElementById('formArea').style.display = 'none';
  document.getElementById('successArea').style.display = 'block';
}

// ── PIN ──
const ADMIN_PIN = '1234';
function openPin() {
  document.getElementById('pinOverlay').classList.add('show');
  document.getElementById('pinInput').value = '';
  document.getElementById('pinErr').style.display = 'none';
  setTimeout(() => document.getElementById('pinInput').focus(), 100);
}
function closePin() { document.getElementById('pinOverlay').classList.remove('show'); }
function checkPin() {
  if (document.getElementById('pinInput').value === ADMIN_PIN) { closePin(); showInbox(); }
  else {
    document.getElementById('pinErr').style.display = 'block';
    document.getElementById('pinInput').value = '';
  }
}
document.getElementById('pinInput').addEventListener('keydown', e => { if (e.key === 'Enter') checkPin(); });
document.getElementById('pinOverlay').addEventListener('click', e => {
  if (e.target === document.getElementById('pinOverlay')) closePin();
});

// ── INBOX ──
function showInbox() {
  const box = document.getElementById('adminBox');
  box.style.display = 'block';
  box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  renderInbox();
}
function renderInbox() {
  const messages = JSON.parse(localStorage.getItem('hv_messages') || '[]');
  document.getElementById('msgCount').textContent = messages.length;
  const list = document.getElementById('inboxList');
  if (!messages.length) {
    list.innerHTML = `<div class="inbox-empty"><span>📭</span><p>No messages yet!</p></div>`;
    return;
  }
  list.innerHTML = messages.map((m, i) => `
    <div class="msg-card">
      <button class="mc-del" onclick="deleteMsg(${i})">✕</button>
      <div class="mc-top">
        <span class="mc-name">${esc(m.name)}</span>
        <span class="mc-time">${esc(m.time)}</span>
      </div>
      <div class="mc-email">${esc(m.email)}</div>
      <span class="mc-tag">${esc(m.topic)}</span>
      ${m.rating ? `<div class="mc-rating">Rating: ${esc(m.rating)}</div>` : ''}
      <div class="mc-msg">${esc(m.msg) || '<em style="color:#BBB">No message written</em>'}</div>
      <div class="mc-actions">
        <a class="reply-btn" href="mailto:${esc(m.email)}?subject=Re: ${esc(m.topic)} — HomeVibes&body=Hi ${esc(m.name)},%0A%0AThanks for reaching out!">✉️ Reply</a>
      </div>
    </div>`).join('');
}
function deleteMsg(i) {
  const messages = JSON.parse(localStorage.getItem('hv_messages') || '[]');
  messages.splice(i, 1);
  localStorage.setItem('hv_messages', JSON.stringify(messages));
  renderInbox();
}
function clearAll() {
  if (confirm('Clear all messages? This cannot be undone.')) {
    localStorage.removeItem('hv_messages');
    renderInbox();
  }
}
function esc(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}