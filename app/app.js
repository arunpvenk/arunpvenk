const products = [
  { id: 1, name: 'Basmati Rice 25kg', category: 'Grains', price: 52.0 },
  { id: 2, name: 'Sunflower Oil 15L', category: 'Oils', price: 37.5 },
  { id: 3, name: 'Onions 10kg', category: 'Vegetables', price: 12.8 },
  { id: 4, name: 'Tomato Paste 5kg', category: 'Sauces', price: 18.4 },
  { id: 5, name: 'Chicken Breast 8kg', category: 'Protein', price: 62.0 },
  { id: 6, name: 'Cheddar Cheese 4kg', category: 'Dairy', price: 34.1 },
];

const loginView = document.getElementById('loginView');
const dashboardView = document.getElementById('dashboardView');
const loginForm = document.getElementById('loginForm');
const productGrid = document.getElementById('productGrid');
const cartItems = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const placeOrderBtn = document.getElementById('placeOrderBtn');
const orderMessage = document.getElementById('orderMessage');
const orderTableBody = document.getElementById('orderTableBody');
const logoutBtn = document.getElementById('logoutBtn');
const demoRestaurantBtn = document.getElementById('demoRestaurantBtn');
const demoVendorBtn = document.getElementById('demoVendorBtn');

let state = {
  user: null,
  cart: [],
  orders: [],
};

const currency = (value) => `$${value.toFixed(2)}`;

function saveState() {
  localStorage.setItem('vendorGrocerState', JSON.stringify(state));
}

function loadState() {
  const saved = localStorage.getItem('vendorGrocerState');
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    state = {
      user: parsed.user ?? null,
      cart: parsed.cart ?? [],
      orders: parsed.orders ?? [],
    };
  } catch {
    state = { user: null, cart: [], orders: [] };
  }
}

function setView() {
  const loggedIn = Boolean(state.user);
  loginView.classList.toggle('active', !loggedIn);
  dashboardView.classList.toggle('active', loggedIn);

  if (loggedIn) {
    document.getElementById('userName').textContent = state.user.email;
    document.getElementById('userRole').textContent = `${state.user.role.toUpperCase()} account`;
    renderProducts();
    renderCart();
    renderOrders();
  }
}

function renderProducts() {
  productGrid.innerHTML = '';
  for (const product of products) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <h4>${product.name}</h4>
      <p>${product.category}</p>
      <p class="price">${currency(product.price)}</p>
      <div class="qty-row">
        <input type="number" min="1" value="1" id="qty-${product.id}" />
        <button data-id="${product.id}">Add</button>
      </div>
    `;

    card.querySelector('button').addEventListener('click', () => {
      const qtyInput = card.querySelector(`#qty-${product.id}`);
      const quantity = Number(qtyInput.value);
      addToCart(product.id, Number.isNaN(quantity) || quantity < 1 ? 1 : quantity);
      qtyInput.value = 1;
    });

    productGrid.appendChild(card);
  }
}

function addToCart(productId, quantity) {
  const item = state.cart.find((x) => x.productId === productId);
  if (item) {
    item.quantity += quantity;
  } else {
    state.cart.push({ productId, quantity });
  }

  orderMessage.textContent = '';
  saveState();
  renderCart();
}

function removeFromCart(productId) {
  state.cart = state.cart.filter((item) => item.productId !== productId);
  saveState();
  renderCart();
}

function renderCart() {
  cartItems.innerHTML = '';

  if (!state.cart.length) {
    cartItems.innerHTML = '<li>Cart is empty.</li>';
    subtotalEl.textContent = currency(0);
    return;
  }

  const subtotal = state.cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + product.price * item.quantity;
  }, 0);

  for (const item of state.cart) {
    const product = products.find((p) => p.id === item.productId);
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${product.name} x${item.quantity}</span>
      <span>
        ${currency(product.price * item.quantity)}
        <button data-remove="${product.id}" class="ghost">✕</button>
      </span>
    `;
    li.querySelector('button').addEventListener('click', () => removeFromCart(product.id));
    cartItems.appendChild(li);
  }

  subtotalEl.textContent = currency(subtotal);
}

function placeOrder() {
  if (!state.cart.length) {
    orderMessage.style.color = 'var(--danger)';
    orderMessage.textContent = 'Please add items to cart before placing an order.';
    return;
  }

  const total = state.cart.reduce((sum, item) => {
    const product = products.find((p) => p.id === item.productId);
    return sum + product.price * item.quantity;
  }, 0);

  const order = {
    id: `ORD-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    date: new Date().toLocaleString(),
    items: state.cart.map((item) => {
      const p = products.find((prod) => prod.id === item.productId);
      return `${p.name} (${item.quantity})`;
    }),
    status: 'Pending Fulfillment',
    total,
  };

  state.orders.unshift(order);
  state.cart = [];
  orderMessage.style.color = 'var(--success)';
  orderMessage.textContent = `Order ${order.id} submitted successfully.`;
  saveState();
  renderCart();
  renderOrders();
}


function loginAsDemo(role) {
  state.user = {
    email: role === 'restaurant' ? 'demo.restaurant@vendorgrocer.app' : 'demo.vendor@vendorgrocer.app',
    role,
  };

  if (!state.orders.length) {
    state.orders = [
      {
        id: 'ORD-DEMO01',
        date: new Date().toLocaleString(),
        items: ['Basmati Rice 25kg (2)', 'Sunflower Oil 15L (1)'],
        status: 'Delivered',
        total: 141.5,
      },
    ];
  }

  saveState();
  setView();
}

function renderOrders() {
  orderTableBody.innerHTML = '';

  if (!state.orders.length) {
    orderTableBody.innerHTML = '<tr><td colspan="5">No orders yet.</td></tr>';
    return;
  }

  for (const order of state.orders) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${order.id}</td>
      <td>${order.date}</td>
      <td>${order.items.join(', ')}</td>
      <td><span class="status">${order.status}</span></td>
      <td>${currency(order.total)}</td>
    `;
    orderTableBody.appendChild(row);
  }
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  state.user = {
    email: document.getElementById('email').value,
    role: document.getElementById('role').value,
  };
  saveState();
  setView();
});

logoutBtn.addEventListener('click', () => {
  state.user = null;
  state.cart = [];
  saveState();
  setView();
});

placeOrderBtn.addEventListener('click', placeOrder);
demoRestaurantBtn.addEventListener('click', () => loginAsDemo('restaurant'));
demoVendorBtn.addEventListener('click', () => loginAsDemo('vendor'));

loadState();
setView();
