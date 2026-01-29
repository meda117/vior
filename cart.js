// ============================
// CART SYSTEM JS (GENERAL & PRODUCT PAGE)
// ============================

// ---------- ELEMENTS ----------
const cartOverlay = document.getElementById("cart-overlay");
const cartSlider = document.getElementById("cart-slider");
const cartIcon = document.querySelector(".cart-container");
const cartCountEl = document.getElementById("cart-count");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalPriceEl = document.getElementById("cart-total-price");
const discountCodeInput = document.getElementById("discount-code");
const applyDiscountBtn = document.getElementById("apply-discount");
const discountMsg = document.getElementById("discount-msg");
const freeShippingEl = document.getElementById("free-shipping");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout-btn");
const orderForm = document.getElementById("order-form");
const sendOrderBtn = document.getElementById("send-order");
const formErrorEl = document.getElementById("form-error");

const orderFields = {
  name: document.getElementById("order-name"),
  city: document.getElementById("order-city"),
  area: document.getElementById("order-area"),
  landmark: document.getElementById("order-landmark"),
  phone: document.getElementById("order-phone"),
  phone2: document.getElementById("order-phone2"),
};

// ---------- CART DATA ----------
let cart = JSON.parse(localStorage.getItem("cart")) || [];
let cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
cartCountEl.textContent = cartCount;
let discountApplied = false;
let discountValue = 0;

// ---------- UTILITIES ----------
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ---------- OPEN/CLOSE SLIDER ----------
function openCartSlider() {
  cartSlider.classList.add("active");
  cartOverlay.style.display = "block";
}

function closeCartSlider() {
  cartSlider.classList.remove("active");
  cartOverlay.style.display = "none";
}

if(cartIcon) cartIcon.addEventListener("click", openCartSlider);
if(cartOverlay) cartOverlay.addEventListener("click", closeCartSlider);
const closeCartBtn = document.getElementById("close-cart");
if(closeCartBtn) closeCartBtn.addEventListener("click", closeCartSlider);

// ---------- ADD TO CART ----------
function addToCart(product) {
  // أي إضافة جديدة تظل عادية
  cart.push({...product, quantity:1, isGift:false});
  cartCount++;
  cartCountEl.textContent = cartCount;
  saveCart();
  updateCartUI();
  openCartSlider();
}

function updateCartUI() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  // ===== التحقق من الهدايا =====
  const gifts = cart.filter(item => item.isGift);

  // عشان تنزل هدية → لازم يكون في 3 أصناف مختلفة بنفس الحجم
  const groupedBySize = {};
  cart.forEach(item => {
    const key = item.size || "One Size";
    if(!groupedBySize[key]) groupedBySize[key] = [];
    groupedBySize[key].push(item);
  });

  let giftAssigned = false;
  for(const size in groupedBySize){
    if(groupedBySize[size].length >= 3 && gifts.length === 0){
      // العنصر الثالث يصبح هدية
      groupedBySize[size][2].isGift = true;
      groupedBySize[size][2].quantity = 1;
      giftAssigned = true;
      break;
    }
  }

  // لو مفيش أصناف كافية للهدايا → إزالة أي هدية موجودة
  if(!giftAssigned){
    cart.forEach(item => {
      if(item.isGift) item.isGift = false;
    });
  }

  cart.forEach((item,index) => {
    const itemEl = document.createElement("div");
    itemEl.className = "cart-item";

    let displayName = item.name;
    if(item.size && item.size.trim() !== ""){
      displayName += ` (${item.size})`;
    } else {
      displayName += " (One Size)";
    }

    const itemPrice = item.isGift ? 0 : item.price;

    itemEl.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${displayName}</h4>
        <span>السعر: ${itemPrice} ج.م</span>

        <div class="quantity-controls">
          <button class="decrease">-</button>
          <span>${item.quantity}</span>
          <button class="increase" ${item.isGift ? "disabled" : ""}>+</button>
        </div>

        <button class="delete-item">حذف</button>
      </div>
      ${item.isGift ? '<div class="gift-badge">🎁 مجاناً</div>' : ''}
    `;

    cartItemsContainer.appendChild(itemEl);

    total += itemPrice * item.quantity;

    // ===== زيادة الكمية =====
    if(!item.isGift){
      itemEl.querySelector(".increase").addEventListener("click", () => {
        item.quantity++;
        cartCount++;
        cartCountEl.textContent = cartCount;
        saveCart();
        updateCartUI();
      });
    }

    // ===== تقليل الكمية =====
    itemEl.querySelector(".decrease").addEventListener("click", () => {
      if(item.quantity > 1){
        item.quantity--;
        cartCount--;
        cartCountEl.textContent = cartCount;
        saveCart();
        updateCartUI();
      }
    });

    // ===== حذف الصنف =====
    itemEl.querySelector(".delete-item").addEventListener("click", () => {
      cartCount -= item.quantity;
      cartCountEl.textContent = cartCount;
      cart.splice(index, 1);
      saveCart();
      updateCartUI();
    });
  });

  // ===== تطبيق الخصم =====
  if(discountApplied) total -= (total * discountValue / 100);

  cartTotalPriceEl.textContent = total + " ج.م";

  // ===== التوصيل =====
  freeShippingEl.style.display = total > 0 ? "block" : "none";

  saveCart();
}

// ---------- CLEAR CART ----------
if(clearCartBtn) clearCartBtn.addEventListener("click", () => {
  if(confirm("هل تريد إفراغ السلة؟")){
    cart=[];
    cartCount=0;
    cartCountEl.textContent=0;
    saveCart();
    updateCartUI();
  }
});

// ---------- APPLY DISCOUNT ----------
if(applyDiscountBtn) applyDiscountBtn.addEventListener("click", () => {
  const code = discountCodeInput.value.trim();
  if(code === "DISCOUNT10") {
    discountApplied = true;
    discountValue = 10;
    discountMsg.textContent = "تم تطبيق الخصم 10%";
    discountMsg.className = "discount-success";
    updateCartUI();
  } else {
    discountApplied = false;
    discountValue = 0;
    discountMsg.textContent = "كود غير صالح";
    discountMsg.className = "discount-fail";
    updateCartUI();
  }
});

// ---------- CHECKOUT FORM ----------
if(checkoutBtn) checkoutBtn.addEventListener("click", () => {
  if(cart.length === 0) {
    alert("السلة فارغة!");
    return;
  }
  orderForm.classList.add("active");
  orderForm.scrollIntoView({behavior:"smooth"});
});

// ---------- SEND ORDER TO WHATSAPP ----------
if(sendOrderBtn) sendOrderBtn.addEventListener("click", () => {
  let valid = true;
  formErrorEl.textContent = "";
  Object.keys(orderFields).forEach(key => {
    const input = orderFields[key];
    input.classList.remove("error");
    if(key !== "phone2" && input.value.trim() === ""){
      valid = false;
      input.classList.add("error");
      formErrorEl.textContent = "برجاء إدخال الحقول المطلوبة باللون الأحمر!";
    }
  });
  if(!valid) return;

  let msg = `طلب جديد من موقعك:\n\n`;
  cart.forEach((item,index) => {
    let price = (index === 2 && cart.length >= 3) ? 0 : item.price;
    msg += `- ${item.name} ${item.size || ""} × ${item.quantity} = ${price*item.quantity} ج.م\n`;
    if(index===2 && cart.length>=3) msg += "(هدية مجاناً 🎁)\n";
  });
  msg += `\nالإجمالي: ${cartTotalPriceEl.textContent}\n\n`;
  msg += `الاسم: ${orderFields.name.value}\n`;
  msg += `المحافظة: ${orderFields.city.value}\n`;
  msg += `الحي: ${orderFields.area.value}\n`;
  msg += `علامة مميزة: ${orderFields.landmark.value}\n`;
  msg += `رقم الهاتف: ${orderFields.phone.value}\n`;
  if(orderFields.phone2.value.trim() !== "") msg += `رقم إضافي: ${orderFields.phone2.value}\n`;

  const phone = "201020924857";
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,"_blank");
});
// إضافة المنتجات من غير أحجام (One Size)
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    if (!card) return;

    const productName = card.querySelector("h3").textContent;
    const img = card.querySelector("img").src;
    const price = parseFloat(card.querySelector(".price").textContent.replace(" ج.م","").trim());

    const sizeOptions = card.querySelectorAll(".size-option");

    // فقط المنتجات اللي من غير أحجام
    if (sizeOptions.length === 0) {
      const size = "One Size"; // الحجم الافتراضي
      addToCart({ name: productName, price: price, img: img, size: size });
    }
  });
});

// ============================
// إعادة تحميل السلة عند فتح أي صفحة
// ============================
document.addEventListener("DOMContentLoaded", () => {
  // لو cart.js موجود
  if (typeof updateCartUI === "function") {
    updateCartUI();
  }
});
