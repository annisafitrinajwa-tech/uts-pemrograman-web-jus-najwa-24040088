console.log("JS Loaded ✅");

/* ==========================
    ELEMENTS
========================== */
const navbarNav = document.querySelector('.navbar-nav');
const hamburger = document.querySelector('#hamburger-menu');

const searchForm = document.querySelector('#search-form');
const searchBtn = document.querySelector('#search-button');
const searchBox = document.querySelector('#search-box');

const cartPanel = document.querySelector('#cart');
const cartBtn = document.querySelector('#shopping-cart-button');

const cartItems = document.querySelector('#cart-items');
const totalPrice = document.querySelector('#total-price');
const checkoutBtn = document.querySelector('#checkout-btn');

const badgeTop = document.querySelector('#cart-count');
const badgeBottom = document.querySelector('#badge-bottom');
const totalBottom = document.querySelector('#total-bottom');

let cart = []; // {name, price, qty}

/* ==========================
    FORMAT RUPIAH
========================== */
const rupiah = (n) =>
  new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
  }).format(n);

/* ==========================
    NAVBAR
========================== */
hamburger.addEventListener("click", () => {
  navbarNav.classList.toggle("active");
});

/* ==========================
    SEARCH
========================== */
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchForm.classList.toggle("active");
  if (searchForm.classList.contains("active")) searchBox.focus();
});

searchBox.addEventListener("input", () => {
  const q = searchBox.value.toLowerCase();
  document.querySelectorAll(".menu-card").forEach((card) => {
    const name = card.dataset.name.toLowerCase();
    card.style.display = name.includes(q) ? "" : "none";
  });
});

/* ==========================
    CART PANEL TOGGLE
========================== */
cartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  cartPanel.classList.toggle("active");
});

/* ==========================
    CLOSE OUTSIDE CLICK
========================== */
document.addEventListener("click", (e) => {
  if (!navbarNav.contains(e.target) && !hamburger.contains(e.target))
    navbarNav.classList.remove("active");

  if (!searchForm.contains(e.target) && !searchBtn.contains(e.target))
    searchForm.classList.remove("active");

  if (!cartPanel.contains(e.target) && !cartBtn.contains(e.target))
    cartPanel.classList.remove("active");
});

/* ==========================
    QTY BUTTON (+/-)
========================== */
document.addEventListener("click", (e) => {
  const minus = e.target.closest(".qty-minus");
  const plus = e.target.closest(".qty-plus");

  if (minus) {
    const input = minus.parentElement.querySelector(".qty");
    let val = parseInt(input.value) || 1;
    if (val > 1) input.value = val - 1;
  }

  if (plus) {
    const input = plus.parentElement.querySelector(".qty");
    let val = parseInt(input.value) || 1;
    input.value = val + 1;
  }
});

/* ==========================
    ADD TO CART
========================== */
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-cart");
  if (!btn) return;

  const card = btn.closest("[data-name][data-price]");
  const name = card.dataset.name;
  const price = parseInt(card.dataset.price);

  const qtyInput = card.querySelector(".qty");
  const qty = Math.max(1, parseInt(qtyInput?.value || "1"));

  const exist = cart.find((p) => p.name === name);

  if (exist) {
    exist.qty += qty;
  } else {
    cart.push({ name, price, qty });
  }

  renderCart();
});

/* ==========================
    RENDER CART
========================== */
function renderCart() {
  cartItems.innerHTML = "";

  if (cart.length === 0) {
  cartItems.innerHTML = `
    <div class="item" style="padding:8px; text-align:center;">
      Keranjang kosong
    </div>
  `;
  updateBadges();
  return;
}

  cart.forEach((item, i) => {
    const el = document.createElement("div");
    el.className = "item";

    el.innerHTML = `
      <div class="name">${item.name}</div>
      <div class="price">${rupiah(item.price)}</div>
      <div class="qtywrap">
        <button class="qtybtn" data-i="${i}" data-act="dec">-</button>
        <span>${item.qty}</span>
        <button class="qtybtn" data-i="${i}" data-act="inc">+</button>
        <button class="remove" data-i="${i}">&times;</button>
      </div>
    `;

    cartItems.appendChild(el);
  });

  updateBadges();
}

/* ==========================
    HANDLE QTY IN CART
========================== */
cartItems.addEventListener("click", (e) => {
  const btn = e.target.closest(".qtybtn, .remove");
  if (!btn) return;

  const i = parseInt(btn.dataset.i);
  const act = btn.dataset.act;

  if (btn.classList.contains("remove")) {
    cart.splice(i, 1);
  } else if (act === "dec") {
    cart[i].qty--;
    if (cart[i].qty <= 0) cart.splice(i, 1);
  } else if (act === "inc") {
    cart[i].qty++;
  }

  renderCart();
});

/* ==========================
    BADGE & TOTAL
========================== */
function updateBadges() {
  let qty = 0;
  let tot = 0;

  cart.forEach((item) => {
    qty += item.qty;
    tot += item.price * item.qty;
  });

  badgeTop.textContent = qty;
  badgeBottom.textContent = qty;
  totalPrice.textContent = rupiah(tot);
  totalBottom.textContent = rupiah(tot);
}

/* ==========================
    CHECKOUT DEMO
========================== */
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return alert("Keranjang masih kosong.");
  alert("Checkout berhasil ✅ (simulasi)");
});

/* ==========================
    INIT
========================== */
renderCart();