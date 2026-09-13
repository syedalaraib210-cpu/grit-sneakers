/* =========================================================
   GRIT — shared JavaScript
   Sections:
   1. Product data
   2. Cart (localStorage) helpers
   3. Nav (hamburger + active link + cart count)
   4. Shop page (render, filter, sort, add-to-cart, stepper)
   5. Cart page (render, remove, totals)
   6. Contact form validation
   7. Back-to-top button
   ========================================================= */

/* ---------------------------------------------------------
   1. PRODUCT DATA
   Swap the "svg" field for a real <img> tag once you have
   product photography — everything else keeps working.
   --------------------------------------------------------- */
const PRODUCTS = [
  { id: 'p01', name: 'Vantage Runner',   category: 'Running',    price: 8500,  color: '#3a5cff', tag: 'New' },
  { id: 'p02', name: 'Aero Strike',      category: 'Running',    price: 7200,  color: '#4ade80', tag: null },
  { id: 'p03', name: 'Court Dominator',  category: 'Basketball', price: 11200, color: '#ff5a4e', tag: 'Hot' },
  { id: 'p04', name: 'Rim Breaker',      category: 'Basketball', price: 9800,  color: '#ffd23f', tag: null },
  { id: 'p05', name: 'Alley Classic',    category: 'Lifestyle',  price: 6400,  color: '#a78bfa', tag: null },
  { id: 'p06', name: 'Street Low',       category: 'Lifestyle',  price: 5900,  color: '#f472b6', tag: 'Sale' },
  { id: 'p07', name: 'Grind Deck',       category: 'Skate',      price: 6800,  color: '#38bdf8', tag: null },
  { id: 'p08', name: 'Ledge Slide',      category: 'Skate',      price: 7100,  color: '#fb923c', tag: null },
  { id: 'p09', name: 'Vantage Runner 2', category: 'Running',    price: 9200,  color: '#3a5cff', tag: 'New' },
];

function sneakerSVG(color) {
  return `<svg viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 42c0-6 4-9 10-11l16-6c3-6 9-10 16-10 5 0 8 3 9 7l3 10c8 1 15 5 20 11 3 4 5 7 5 10 0 3-2 5-5 5H10c-3 0-4-2-4-4v-12z"
      fill="${color}" opacity="0.9"/>
    <path d="M6 42c0-6 4-9 10-11l16-6c3-6 9-10 16-10 5 0 8 3 9 7l3 10c8 1 15 5 20 11 3 4 5 7 5 10 0 3-2 5-5 5H10c-3 0-4-2-4-4v-12z"
      stroke="#141414" stroke-width="1.5"/>
    <path d="M14 48h72" stroke="#141414" stroke-width="2"/>
  </svg>`;
}

function formatPKR(amount) {
  return 'Rs ' + amount.toLocaleString('en-PK');
}

/* ---------------------------------------------------------
   2. CART HELPERS (persisted in localStorage)
   Cart shape: [{ id, qty }]
   --------------------------------------------------------- */
const CART_KEY = 'grit_cart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(productId, qty) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
  });
}

/* ---------------------------------------------------------
   3. NAV: hamburger toggle + mark active link + cart count
   --------------------------------------------------------- */
function initNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
    });

    // close menu when a link is tapped (mobile)
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // highlight current page in nav
  const current = document.body.dataset.page;
  document.querySelectorAll('.nav-links a').forEach(link => {
    if (link.dataset.page === current) link.classList.add('active');
  });

  updateCartCount();
}

/* ---------------------------------------------------------
   4. SHOP PAGE: render grid, filter chips, sort, stepper
   --------------------------------------------------------- */
function initShopPage() {
  const grid = document.getElementById('productGrid');
  if (!grid) return; // not on the shop page

  const filterBar = document.querySelector('.filter-group');
  const sortSelect = document.getElementById('sortSelect');
  const noResults = document.getElementById('noResults');

  let activeCategory = 'All';
  let activeSort = 'featured';
  const quantities = {}; // productId -> current stepper qty

  function getFiltered() {
    let list = activeCategory === 'All'
      ? [...PRODUCTS]
      : PRODUCTS.filter(p => p.category === activeCategory);

    if (activeSort === 'price-low') list.sort((a, b) => a.price - b.price);
    if (activeSort === 'price-high') list.sort((a, b) => b.price - a.price);
    if (activeSort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }

  function render() {
    const list = getFiltered();
    grid.innerHTML = '';

    if (list.length === 0) {
      noResults.classList.add('show');
    } else {
      noResults.classList.remove('show');
    }

    list.forEach(p => {
      if (!(p.id in quantities)) quantities[p.id] = 1;

      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <div class="product-media">
          ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
          <div class="swatch" style="background:radial-gradient(circle at 30% 20%, ${p.color}33, transparent 60%), #1a1a1a">
            ${sneakerSVG(p.color)}
          </div>
        </div>
        <div class="product-info">
          <span class="product-category">${p.category}</span>
          <span class="product-name">${p.name}</span>
          <span class="product-price">${formatPKR(p.price)}</span>
          <div class="product-actions">
            <div class="qty-stepper" data-id="${p.id}">
              <button type="button" class="qty-minus" aria-label="Decrease quantity">−</button>
              <span class="qty-value">${quantities[p.id]}</span>
              <button type="button" class="qty-plus" aria-label="Increase quantity">+</button>
            </div>
            <button type="button" class="add-to-cart-btn" data-id="${p.id}">Add to cart</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

    // wire up steppers
    grid.querySelectorAll('.qty-stepper').forEach(stepper => {
      const id = stepper.dataset.id;
      const valueEl = stepper.querySelector('.qty-value');

      stepper.querySelector('.qty-minus').addEventListener('click', () => {
        quantities[id] = Math.max(1, quantities[id] - 1);
        valueEl.textContent = quantities[id];
      });

      stepper.querySelector('.qty-plus').addEventListener('click', () => {
        quantities[id] = Math.min(10, quantities[id] + 1);
        valueEl.textContent = quantities[id];
      });
    });

    // wire up add-to-cart buttons
    grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        addToCart(id, quantities[id]);

        const originalText = btn.textContent;
        btn.textContent = 'Added ✓';
        btn.classList.add('added');
        setTimeout(() => {
          btn.textContent = originalText;
          btn.classList.remove('added');
        }, 1100);
      });
    });
  }

  // filter chip clicks
  if (filterBar) {
    filterBar.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        filterBar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeCategory = chip.dataset.category;
        render();
      });
    });
  }

  // sort dropdown
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      activeSort = sortSelect.value;
      render();
    });
  }

  render();
}

/* ---------------------------------------------------------
   5. CART PAGE: render items, remove, recalc totals
   --------------------------------------------------------- */
function initCartPage() {
  const cartList = document.getElementById('cartList');
  if (!cartList) return; // not on the cart page

  const emptyState = document.getElementById('emptyCart');
  const summaryBlock = document.getElementById('cartSummary');
  const subtotalEl = document.getElementById('cartSubtotal');
  const shippingEl = document.getElementById('cartShipping');
  const totalEl = document.getElementById('cartTotal');

  const SHIPPING_FLAT = 350;

  function render() {
    const cart = getCart();
    cartList.innerHTML = '';

    if (cart.length === 0) {
      emptyState.style.display = 'block';
      summaryBlock.style.display = 'none';
      cartList.style.display = 'none';
      return;
    }

    emptyState.style.display = 'none';
    summaryBlock.style.display = 'block';
    cartList.style.display = 'block';

    let subtotal = 0;

    cart.forEach(item => {
      const product = PRODUCTS.find(p => p.id === item.id);
      if (!product) return;

      const lineTotal = product.price * item.qty;
      subtotal += lineTotal;

      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <div class="swatch-sm" style="background:radial-gradient(circle at 30% 20%, ${product.color}33, transparent 60%), #1a1a1a">
          ${sneakerSVG(product.color)}
        </div>
        <div>
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-cat">${product.category} · Qty ${item.qty}</div>
        </div>
        <div class="product-price">${formatPKR(lineTotal)}</div>
        <button type="button" class="remove-item" data-id="${item.id}">Remove</button>
      `;
      cartList.appendChild(row);
    });

    cartList.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromCart(btn.dataset.id);
        render();
      });
    });

    const shipping = subtotal > 0 ? SHIPPING_FLAT : 0;
    subtotalEl.textContent = formatPKR(subtotal);
    shippingEl.textContent = formatPKR(shipping);
    totalEl.textContent = formatPKR(subtotal + shipping);
  }

  render();
}

/* ---------------------------------------------------------
   6. CONTACT FORM VALIDATION
   --------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return; // not on the contact page

  const successBox = document.getElementById('formSuccess');

  function setError(fieldId, message) {
    const group = document.getElementById(fieldId).closest('.form-group');
    group.classList.add('error');
    group.querySelector('.error-message').textContent = message;
  }

  function clearError(fieldId) {
    const group = document.getElementById(fieldId).closest('.form-group');
    group.classList.remove('error');
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    successBox.classList.remove('show');

    let valid = true;
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');

    [name, email, message].forEach(f => clearError(f.id));

    if (name.value.trim().length < 2) {
      setError('name', 'Please enter your full name.');
      valid = false;
    }

    if (!isValidEmail(email.value.trim())) {
      setError('email', 'Please enter a valid email address.');
      valid = false;
    }

    if (message.value.trim().length < 10) {
      setError('message', 'Message should be at least 10 characters.');
      valid = false;
    }

    if (valid) {
      successBox.classList.add('show');
      form.reset();
      successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  // clear error as soon as the user starts fixing a field
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => clearError(field.id));
  });
}

/* ---------------------------------------------------------
   7. BACK TO TOP BUTTON
   --------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initShopPage();
  initCartPage();
  initContactForm();
  initBackToTop();
});