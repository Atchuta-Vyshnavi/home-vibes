const dishInfo = {
  "Chocolate Milkshake": {
    desc: "Super Thick Shake Tasty Feel", thumb: "thumbnails/chocolatemilkshake.jpg",
    ingredients: [
      {name:"Full Cream Milk",        unit:"ml",      qty:200,  costPerUnit:0.06},
      {name:"Chocolate Ice Cream",    unit:"scoops",  qty:3,    costPerUnit:15},
      {name:"Cocoa Powder",           unit:"tbsp",    qty:2,    costPerUnit:8},
      {name:"Sugar",                  unit:"tbsp",    qty:1,    costPerUnit:3},
      {name:"Whipped Cream",          unit:"tbsp",    qty:2,    costPerUnit:6},
      {name:"Chocolate Sauce",        unit:"tbsp",    qty:1,    costPerUnit:10}
    ]
  },
  "Chicken Biryani": {
    desc: "Restaurant Biryani At Home", thumb: "thumbnails/chickenbiryani.jpg",
    ingredients: [
      {name:"Basmati Rice",           unit:"cups",    qty:2,    costPerUnit:30},
      {name:"Chicken",                unit:"g",       qty:400,  costPerUnit:0.22},
      {name:"Onion",                  unit:"medium",  qty:2,    costPerUnit:8},
      {name:"Curd / Yogurt",          unit:"tbsp",    qty:4,    costPerUnit:4},
      {name:"Biryani Masala",         unit:"tbsp",    qty:2,    costPerUnit:5},
      {name:"Ghee",                   unit:"tbsp",    qty:2,    costPerUnit:12},
      {name:"Fresh Mint Leaves",      unit:"handful", qty:1,    costPerUnit:5},
      {name:"Saffron",                unit:"pinch",   qty:1,    costPerUnit:16}
    ]
  },
  "Chicken Manchuriya": {
    desc: "Fresh Chicken Manchuriya", thumb: "thumbnails/chickenmanchuriya.jpg",
    ingredients: [
      {name:"Boneless Chicken",       unit:"g",       qty:150,  costPerUnit:0.50},
      {name:"Cornflour",              unit:"tbsp",    qty:4,    costPerUnit:3},
      {name:"Soy Sauce",              unit:"tbsp",    qty:2,    costPerUnit:4},
      {name:"Garlic+garlic",                 unit:"tbsp",  qty:4,    costPerUnit:2},
      {name:"Green Chilli",           unit:"pieces",  qty:2,    costPerUnit:2},
      {name:"Spring Onion",           unit:"stalks",  qty:3,    costPerUnit:4},
      {name:"Tomato Ketchup",         unit:"tbsp",    qty:2,    costPerUnit:5},
      {name:"Cooking Oil",            unit:"Cups",    qty:1,    costPerUnit:20}
    ]
  },
  "Egg Fried Rice": {
    desc: "Tasty And Full Of Protein", thumb: "thumbnails/eggfriedrice.jpg",
    ingredients: [
      {name:"Basmati Rice",           unit:"cups",    qty:2,    costPerUnit:15},
      {name:"Eggs",                   unit:"pieces",  qty:3,    costPerUnit:7},
      {name:"Carrot",                 unit:"medium",  qty:1,    costPerUnit:8},
      {name:"Spring Onion",           unit:"stalks",  qty:2,    costPerUnit:4},
      {name:"Soy Sauce",              unit:"tbsp",    qty:2,    costPerUnit:5},
      {name:"Cooking Oil",            unit:"tbsp",    qty:2,    costPerUnit:4},
      {name:"Black Pepper Powder",    unit:"tsp",     qty:1,  costPerUnit:4.25},
      {name:"Salt",                   unit:"tsp",     qty:0.75,  costPerUnit:1}
    ]
  },
  "Fried Veg Momos": {
    desc: "Yummy Fried Momos", thumb: "thumbnails/friedmomos.jpg",
    ingredients: [
      {name:"All-Purpose Flour (Maida)", unit:"cups", qty:2,    costPerUnit:12},
      {name:"Cabbage",                unit:"cups",    qty:1,    costPerUnit:8},
      {name:"Carrot",                 unit:"medium",  qty:1,    costPerUnit:8},
      {name:"Onion",                  unit:"medium",  qty:1,    costPerUnit:8},
      {name:"Garlic",                 unit:"cloves",  qty:3,    costPerUnit:2},
      {name:"Soy Sauce",              unit:"tbsp",    qty:1,    costPerUnit:5},
      {name:"Cooking Oil",            unit:"cups",    qty:1,    costPerUnit:20},
      {name:"Salt",                   unit:"tsp",     qty:1,    costPerUnit:1}
    ]
  },
  "Paneer Butter Masala": {
    desc: "Try With Your Own And See", thumb: "thumbnails/pannerbuttermasala.jpg",
    ingredients: [
      {name:"Paneer",                 unit:"g",       qty:125,  costPerUnit:0.44},
      {name:"Tomatoes",               unit:"medium",  qty:3,    costPerUnit:5},
      {name:"Butter",                 unit:"tbsp",    qty:2,    costPerUnit:10},
      {name:"Fresh Cream",            unit:"tbsp",    qty:2,    costPerUnit:8},
      {name:"Onion",                  unit:"medium",  qty:1,    costPerUnit:8},
      {name:"Garam Masala",           unit:"tsp",     qty:1,    costPerUnit:4},
      {name:"Kashmiri Chilli Powder", unit:"tsp",     qty:1,    costPerUnit:4},
      {name:"Cashews",                unit:"pieces",  qty:10,   costPerUnit:3}
    ]
  },
  "Paneer Tikka": {
    desc: "Healthy Paneer Tikka", thumb: "thumbnails/pannertikka.jpg",
    ingredients: [
      {name:"Paneer",                 unit:"g",       qty:150,  costPerUnit:0.44},
      {name:"Curd / Yogurt",          unit:"tbsp",    qty:4,    costPerUnit:4},
      {name:"Capsicum / Bell Pepper", unit:"medium",  qty:1,    costPerUnit:15},
      {name:"Onion",                  unit:"medium",  qty:2,    costPerUnit:8},
      {name:"Tandoori / Tikka Masala",unit:"tbsp",    qty:2,    costPerUnit:8},
      {name:"Lemon Juice",            unit:"tbsp",    qty:1,    costPerUnit:2},
      {name:"Cooking Oil",            unit:"tbsp",    qty:5,    costPerUnit:4},
      {name:"Chaat Masala",           unit:"tsp",     qty:1,  costPerUnit:4}
    ]
  },
  "Cheese Pizza": {
    desc: "Overloaded Extra Cheese", thumb: "thumbnails/chesesepizza.jpg",
    ingredients: [
      {name:"Pizza Base / Dough",     unit:"g",       qty:300,  costPerUnit:0.15},
      {name:"Mozzarella Cheese",      unit:"g",       qty:100,  costPerUnit:0.8},
      {name:"Pizza & Pasta Sauce",    unit:"tbsp",    qty:4,    costPerUnit:8},
      {name:"Cheddar Cheese",         unit:"g",       qty:50,   costPerUnit:0.9},
      {name:"Dried Oregano",          unit:"tsp",     qty:1,    costPerUnit:4},
      {name:"Chilli Flakes",          unit:"tsp",     qty:1,  costPerUnit:3},
      {name:"Olive Oil",              unit:"tbsp",    qty:1,    costPerUnit:10}
    ]
  },
  "Street Maggie": {
    desc: "Ready In 2 Minutes", thumb: "thumbnails/strretmaggie.jpg",
    ingredients: [
      {name:"Maggi Noodles",          unit:"packets", qty:2,    costPerUnit:14},
      {name:"Butter",                 unit:"tbsp",    qty:1,    costPerUnit:10},
      {name:"Onion",                  unit:"small",   qty:1,    costPerUnit:5},
      {name:"Tomato",                 unit:"small",   qty:1,    costPerUnit:6},
      {name:"Green Chilli",           unit:"pieces",  qty:1,    costPerUnit:2},
      {name:"Chaat Masala",           unit:"tsp",     qty:0.5,  costPerUnit:4}
    ]
  },
  "Veg Noodles": {
    desc: "Delicious Noodles", thumb: "thumbnails/vegnoodles.jpg",
    ingredients: [
      {name:"Hakka Noodles",          unit:"g",       qty:200,  costPerUnit:0.12},
      {name:"Cabbage",                unit:"cups",    qty:1,    costPerUnit:10},
      {name:"Carrot",                 unit:"medium",  qty:1,    costPerUnit:8},
      {name:"Capsicum / Bell Pepper", unit:"medium",  qty:1,    costPerUnit:20},
      {name:"Spring Onion",           unit:"stalks",  qty:2,    costPerUnit:4},
      {name:"Soy Sauce",              unit:"tbsp",    qty:2,    costPerUnit:5},
      {name:"Vinegar",                unit:"tsp",     qty:1,    costPerUnit:2},
      {name:"Cooking Oil",            unit:"tbsp",    qty:2,    costPerUnit:4}
    ]
  },
  "Tandoori Roti": {
    desc: "Street Style Roti At Home", thumb: "thumbnails/tandooriroti.jpg",
    ingredients: [
      {name:"Wheat Flour (Atta)",     unit:"cups",    qty:2,    costPerUnit:10.25},
      {name:"Salt",                   unit:"tsp",     qty:0.5,  costPerUnit:1},
      {name:"Butter",                 unit:"tbsp",    qty:2,    costPerUnit:10},
      {name:"Curd / Yogurt",          unit:"tbsp",    qty:1,    costPerUnit:4}
    ]
  }
};

const params = new URLSearchParams(window.location.search);
let src   = params.get("src");
let title = params.get("title");
let dish  = null;
let currentQtys = [];

document.getElementById("videoPlayer").src = src || "";

if (title && dishInfo[title]) {
  dish = dishInfo[title];
  loadDish();
}

function loadDish() {
  document.getElementById("videoTitle").textContent = title;
  document.getElementById("videoDesc").textContent = dish.desc;
  currentQtys = dish.ingredients.map(i => i.qty);
  renderIngredients();
}
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const totalItems = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
  const badge = document.getElementById('cartCount');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'inline' : 'none';
  }
}

function renderIngredients() {
  const list = document.getElementById('ingredientsList');
  list.innerHTML = dish.ingredients.map((ing, idx) => {
    const rowCost = (currentQtys[idx] * ing.costPerUnit).toFixed(2);
    return `
      <div class="ingredient-row">
        <span class="ing-name">${ing.name}</span>
        <span class="ing-unit">${ing.unit}</span>
        <div class="qty-control">
          <button class="qty-btn" onclick="changeIngQty(${idx},-1)">−</button>
          <span class="qty-val" id="iqty-${idx}">${formatQty(currentQtys[idx])}</span>
          <button class="qty-btn" onclick="changeIngQty(${idx},1)">+</button>
        </div>
        <span class="ing-cost" id="icost-${idx}">₹${rowCost}</span>
      </div>`;
  }).join('');
  renderCostSummary();
}

function formatQty(val) {
  return Number.isInteger(val) ? val : parseFloat(val.toFixed(2));
}

function getStep(val, unit) {
  // For gram/ml units, use larger steps at higher quantities
  const bigUnit = ['g','ml'].includes(unit.toLowerCase());
  if (bigUnit) {
    if (val >= 500) return 100;
    if (val >= 100) return 50;
    if (val >= 20)  return 10;
    return 5;
  }
  // For count/spoon/cup units
  if (val >= 20) return 5;
  if (val >= 10) return 2;
  if (val >= 2)  return 1;
  return 0.25;
}

function changeIngQty(idx, delta) {
  const unit = dish.ingredients[idx].unit;
  const step = getStep(currentQtys[idx], unit);
  currentQtys[idx] = Math.max(0, parseFloat((currentQtys[idx] + delta * step).toFixed(2)));
  document.getElementById(`iqty-${idx}`).textContent = formatQty(currentQtys[idx]);
  document.getElementById(`icost-${idx}`).textContent = `₹${(currentQtys[idx] * dish.ingredients[idx].costPerUnit).toFixed(2)}`;
  renderCostSummary();
}

function renderCostSummary() {
  let rows = '';
  let total = 0;
  dish.ingredients.forEach((ing, idx) => {
    const cost = currentQtys[idx] * ing.costPerUnit;
    if (cost > 0) {
      total += cost;
      rows += `<div class="cost-row">
        <span class="cost-name">${ing.name} <span class="cost-sub">${formatQty(currentQtys[idx])} ${ing.unit}</span></span>
        <span>₹${cost.toFixed(2)}</span>
      </div>`;
    }
  });
  const empty = `<div class="cost-row"><span style="color:#CCC">All quantities set to 0</span><span>₹0.00</span></div>`;
  document.getElementById('costSummary').innerHTML = `
    ${rows || empty}
    <div class="total-divider"></div>
    <div class="total-row">
      <span>Total Estimated Cost</span>
      <span>₹${total.toFixed(2)}</span>
    </div>`;
  document.getElementById('totalBadge').textContent = `₹${total.toFixed(2)}`;
}

function getTotal() {
  return parseFloat(dish.ingredients.reduce((sum, ing, idx) => sum + currentQtys[idx] * ing.costPerUnit, 0).toFixed(2));
}

/*function addToCart() {
  if (!dish) return;
  const total = getTotal();
  const snapshot = dish.ingredients.map((ing, idx) => ({
    name: ing.name, qty: formatQty(currentQtys[idx]), unit: ing.unit,
    cost: parseFloat((currentQtys[idx] * ing.costPerUnit).toFixed(2))
  })).filter(i => i.qty > 0);

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(i => i.title === title);
  if (existing) {
    existing.qty++;
    existing.ingredientTotal = total;
    existing.ingredients = snapshot;
  } else {
    cart.push({ title, thumb: dish.thumb, ingredientTotal: total, ingredients: snapshot, qty: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  showToast(`✓ ${title} added to cart — ₹${total}`);
}*/

function addToCart() {
  if (!dish) return;
  const total = getTotal();
  const snapshot = dish.ingredients.map((ing, idx) => ({
    name: ing.name, qty: formatQty(currentQtys[idx]), unit: ing.unit,
    cost: parseFloat((currentQtys[idx] * ing.costPerUnit).toFixed(2))
  })).filter(i => i.qty > 0);

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const existing = cart.find(i => i.title === title);
  if (existing) {
    existing.qty++;
    existing.price = total;          // ← was: ingredientTotal
    existing.ingredientTotal = total;
    existing.ingredients = snapshot;
    existing.img = dish.thumb;       // ← ensure img is always set
  } else {
    cart.push({
      title,
      thumb: dish.thumb,
      img: dish.thumb,               // ← add img field (same as buyNow uses)
      price: total,                  // ← add price field
      ingredientTotal: total,
      ingredients: snapshot,
      qty: 1
    });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  showToast(`✓ ${title} added to cart — ₹${total}`);
  updateCartBadge();
}
function buyNow() {
  if (!dish) return;
  const total = getTotal();
  const snapshot = dish.ingredients.map((ing, idx) => ({
    name: ing.name, qty: formatQty(currentQtys[idx]), unit: ing.unit,
    cost: parseFloat((currentQtys[idx] * ing.costPerUnit).toFixed(2))
  })).filter(i => i.qty > 0);
  // Save to separate buyNow key — does NOT touch the cart
  localStorage.setItem('hv_buyNow', JSON.stringify([{ title, img: dish.thumb, price: total, qty: 1, ingredients: snapshot }]));
  localStorage.setItem('hv_checkoutSource', 'buyNow');
  window.location.href = 'payment.html';
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}
updateCartBadge();
function goHome() { window.location.href = 'home.html'; }
function goCart() { window.location.href = 'cart.html'; }