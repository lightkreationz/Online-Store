const products = [
  {id:1,name:"NovaBook Air 14 Laptop",category:"Laptops",price:685000,oldPrice:760000,rating:4.8,reviews:126,badge:"TOP PICK",image:"https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=700&q=80"},
  {id:2,name:"AeroSound Wireless Headphones",category:"Audio",price:48500,oldPrice:62000,rating:4.7,reviews:89,badge:"POPULAR",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=80"},
  {id:3,name:"Pulse Smart Watch Series",category:"Wearables",price:72500,oldPrice:89000,rating:4.6,reviews:74,badge:"NEW FIND",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80"},
  {id:4,name:"SonicPods Wireless Earbuds",category:"Audio",price:28500,oldPrice:35000,rating:4.5,reviews:203,badge:"BESTSELLER",image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=700&q=80"},
  {id:5,name:"Creator Pro Laptop 15",category:"Laptops",price:1125000,oldPrice:1240000,rating:4.9,reviews:58,badge:"PRO CHOICE",image:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=700&q=80"},
  {id:6,name:"Orbit X Smartphone",category:"Phones",price:385000,oldPrice:420000,rating:4.6,reviews:97,badge:"TRENDING",image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=700&q=80"},
  {id:7,name:"Arc Wireless Charging Pad",category:"Accessories",price:18500,oldPrice:24000,rating:4.4,reviews:63,badge:"SMART PICK",image:"https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=700&q=80"},
  {id:8,name:"HomeGlow Smart Speaker",category:"Smart Home",price:42000,oldPrice:51000,rating:4.5,reviews:42,badge:"NEW FIND",image:"https://images.unsplash.com/photo-1589003077984-894e133d abab?auto=format&fit=crop&w=700&q=80".replace(" ","")},
  {id:9,name:"Flex Mechanical Keyboard",category:"Accessories",price:39500,oldPrice:47000,rating:4.7,reviews:111,badge:"DESK UPGRADE",image:"https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=700&q=80"},
  {id:10,name:"Studio 4K Webcam",category:"Accessories",price:56500,oldPrice:68000,rating:4.6,reviews:37,badge:"WORK READY",image:"https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=700&q=80"},
  {id:11,name:"Pocket Bluetooth Speaker",category:"Audio",price:22500,oldPrice:29500,rating:4.5,reviews:81,badge:"COMPACT",image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=700&q=80"},
  {id:12,name:"Everyday Android Phone",category:"Phones",price:198000,oldPrice:225000,rating:4.4,reviews:68,badge:"GREAT FIND",image:"https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=700&q=80"}
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const money = (amount) => new Intl.NumberFormat("en-NG", {style:"currency", currency:"NGN", maximumFractionDigits:0}).format(amount);
let cart = [];
let activeCategory = "All";
let searchTerm = "";
let sortMode = "featured";
const savedItems = new Set();

function renderProducts() {
  let visible = products.filter(p => (activeCategory === "All" || p.category === activeCategory) &&
    (p.name.toLowerCase().includes(searchTerm) || p.category.toLowerCase().includes(searchTerm)));
  if (sortMode === "price-low") visible.sort((a,b)=>a.price-b.price);
  if (sortMode === "price-high") visible.sort((a,b)=>b.price-a.price);
  if (sortMode === "rating") visible.sort((a,b)=>b.rating-a.rating);
  $("#productGrid").innerHTML = visible.map(p => `
    <article class="product-card">
      <div class="product-image-wrap">
        <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='https://placehold.co/600x450/f1f1ec/17201d?text=Lightkreation'">
        <span class="product-badge">${p.badge}</span>
        <button class="wishlist-btn ${savedItems.has(p.id)?"saved":""}" data-wishlist="${p.id}" aria-label="Save ${p.name}">${savedItems.has(p.id)?"♥":"♡"}</button>
      </div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <div class="product-rating">★ ${p.rating.toFixed(1)} <span>(${p.reviews} reviews)</span></div>
        <div class="product-price-row"><strong class="product-price">${money(p.price)}</strong><span class="old-price">${money(p.oldPrice)}</span></div>
        <button class="add-cart-btn" data-add="${p.id}">＋ Add to cart</button>
      </div>
    </article>`).join("");
  $("#emptyState").classList.toggle("hidden", visible.length !== 0);
  $("#productGrid").classList.toggle("hidden", visible.length === 0);
}
function setCategory(category) {
  activeCategory = category;
  $$(".nav-category").forEach(b => b.classList.toggle("active", b.dataset.category === category));
  $$(".filter-pill").forEach(b => b.classList.toggle("selected", b.dataset.category === category));
  renderProducts();
}
function addToCart(id) {
  const found = cart.find(item => item.id === id);
  if (found) found.quantity += 1;
  else cart.push({id, quantity:1});
  updateCart();
  const product = products.find(p=>p.id===id);
  showToast(`${product.name} added to your cart.`);
}
function updateCart() {
  const count = cart.reduce((sum,item)=>sum+item.quantity,0);
  const subtotal = cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.quantity,0);
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `(${count})`;
  $("#cartSubtotal").textContent = money(subtotal);
  $("#cartEmpty").classList.toggle("hidden", cart.length !== 0);
  $("#cartSummary").classList.toggle("hidden", cart.length === 0);
  $("#cartItems").innerHTML = cart.map(item => {
    const p = products.find(product=>product.id===item.id);
    return `<div class="cart-line"><img src="${p.image}" alt="${p.name}" onerror="this.src='https://placehold.co/100x100/f1f1ec/17201d?text=LK'"><div><div class="cart-line-name">${p.name}</div><div class="cart-line-price">${money(p.price*item.quantity)}</div><div class="quantity-control"><button data-quantity="${p.id}" data-change="-1" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button data-quantity="${p.id}" data-change="1" aria-label="Increase quantity">+</button></div></div><button class="remove-item" data-remove="${p.id}">Remove</button></div>`;
  }).join("");
  renderCheckoutOrder();
}
function renderCheckoutOrder() {
  const subtotal = cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.quantity,0);
  $("#checkoutItems").innerHTML = cart.map(item => {
    const p = products.find(product=>product.id===item.id);
    return `<div class="checkout-order-line"><img src="${p.image}" alt=""><div><strong>${p.name}</strong><small>Qty: ${item.quantity}</small></div><b>${money(p.price*item.quantity)}</b></div>`;
  }).join("");
  $("#checkoutSubtotal").textContent = money(subtotal);
}
function openCart() {
  $("#overlay").classList.remove("hidden");
  $("#cartDrawer").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden","false");
  document.body.style.overflow="hidden";
}
function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden","true");
  if ($("#checkoutModal").classList.contains("hidden") && $("#messageModal").classList.contains("hidden")) {
    $("#overlay").classList.add("hidden");
    document.body.style.overflow="";
  }
}
function openCheckout() {
  if (!cart.length) return;
  closeCart();
  $("#overlay").classList.remove("hidden");
  $("#checkoutModal").classList.remove("hidden");
  document.body.style.overflow="hidden";
}
function closeCheckout() {
  $("#checkoutModal").classList.add("hidden");
  $("#overlay").classList.add("hidden");
  document.body.style.overflow="";
}
function showMessage(title, text, icon="✓") {
  $("#messageTitle").textContent=title;
  $("#messageText").textContent=text;
  $("#messageIcon").textContent=icon;
  $("#messageModal").classList.remove("hidden");
  $("#overlay").classList.remove("hidden");
  document.body.style.overflow="hidden";
}
function closeMessage() {
  $("#messageModal").classList.add("hidden");
  $("#overlay").classList.add("hidden");
  document.body.style.overflow="";
}
function showToast(message) {
  let toast = $("#toast");
  if (!toast) {
    toast=document.createElement("div");
    toast.id="toast";
    toast.style.cssText="position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:#17201d;color:#fff;padding:13px 18px;border-radius:9px;z-index:50;font-size:11px;box-shadow:0 10px 30px #0002;max-width:90%;text-align:center";
    document.body.appendChild(toast);
  }
  toast.textContent=message;
  toast.style.opacity="1";
  clearTimeout(window.toastTimeout);
  window.toastTimeout=setTimeout(()=>toast.style.opacity="0",2400);
}

$("#productGrid").addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const wishlist = event.target.closest("[data-wishlist]");
  if (add) addToCart(Number(add.dataset.add));
  if (wishlist) {
    const id=Number(wishlist.dataset.wishlist);
    savedItems.has(id) ? savedItems.delete(id) : savedItems.add(id);
    renderProducts();
  }
});
document.addEventListener("click", event => {
  const categoryButton = event.target.closest("[data-category]");
  if (categoryButton && (categoryButton.classList.contains("nav-category") || categoryButton.classList.contains("filter-pill"))) {
    setCategory(categoryButton.dataset.category);
  }
  const addCategory = event.target.closest("[data-shop-category]");
  if (addCategory) {
    setCategory(addCategory.dataset.shopCategory);
    $("#shopSection").scrollIntoView({behavior:"smooth"});
  }
  const qtyButton = event.target.closest("[data-quantity]");
  if (qtyButton) {
    const item=cart.find(i=>i.id===Number(qtyButton.dataset.quantity));
    if (item) {
      item.quantity+=Number(qtyButton.dataset.change);
      if (item.quantity<=0) cart=cart.filter(i=>i.id!==item.id);
      updateCart();
    }
  }
  const removeButton = event.target.closest("[data-remove]");
  if (removeButton) {
    cart=cart.filter(i=>i.id!==Number(removeButton.dataset.remove));
    updateCart();
  }
});
$("#searchForm").addEventListener("submit", event => {
  event.preventDefault();
  searchTerm=$("#searchInput").value.trim().toLowerCase();
  renderProducts();
  $("#shopSection").scrollIntoView({behavior:"smooth"});
});
$("#searchInput").addEventListener("input", event => {
  searchTerm=event.target.value.trim().toLowerCase();
  renderProducts();
});
$("#sortSelect").addEventListener("change", event => {sortMode=event.target.value;renderProducts();});
$("#clearFiltersButton").addEventListener("click",()=>{searchTerm="";$("#searchInput").value="";setCategory("All");});
$("#shopNowButton").addEventListener("click",()=>$("#shopSection").scrollIntoView({behavior:"smooth"}));
$("#openCartButton").addEventListener("click",openCart);
$("#closeCartButton").addEventListener("click",closeCart);
$("#continueShoppingButton").addEventListener("click",closeCart);
$("#keepShoppingButton").addEventListener("click",closeCart);
$("#checkoutButton").addEventListener("click",openCheckout);
$("#closeCheckoutButton").addEventListener("click",closeCheckout);
$("#closeMessageButton").addEventListener("click",closeMessage);
$("#messageOkButton").addEventListener("click",closeMessage);
$("#overlay").addEventListener("click",()=>{closeCart();closeCheckout();closeMessage();});
document.addEventListener("keydown",event=>{if(event.key==="Escape"){closeCart();closeCheckout();closeMessage();}});

$("#checkoutForm").addEventListener("submit",event=>{
  event.preventDefault();
  if (!cart.length) return;
  const formData = new FormData(event.currentTarget);
  const customer = `${formData.get("firstName")} ${formData.get("lastName")}`;
  const subtotal=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.quantity,0);
  // DEMO ONLY: no payment is taken, no order is stored and no paid status is issued.
  closeCheckout();
  showMessage("Demo order reviewed",`Thanks, ${customer}. Your sample order total is ${money(subtotal)}. No payment was taken and no order was placed. Connect a payment gateway and backend to accept real orders.`);
});
$("#newsletterForm").addEventListener("submit",event=>{
  event.preventDefault();
  const email=$("#newsletterEmail").value.trim();
  showMessage("You're on the list!",`Thanks for your interest. Newsletter signup is a demo only; ${email} has not been sent to a mailing list.`);
  event.currentTarget.reset();
});
$("#accountButton").addEventListener("click",()=>showMessage("Customer account","Account registration and sign-in are not connected yet. Add a secure authentication service before launching."));
$("#footerHelp").addEventListener("click",event=>{event.preventDefault();showMessage("Help & support","Add your real customer support email, phone number and delivery/returns policy before launch.");});
$("#footerPolicy").addEventListener("click",event=>{event.preventDefault();showMessage("Privacy & payments","Publish a privacy policy and terms of sale. Real payment processing must be handled by a trusted gateway and a secure backend.");});
$("#year").textContent=new Date().getFullYear();
renderProducts();
updateCart();
