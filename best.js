document.addEventListener("DOMContentLoaded", () => {

  function loadProducts(url, selector, containerId) {
    fetch(url)
      .then(res => res.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const grid = doc.querySelector(".products-grid");
        if (!grid) return;

        const products = grid.querySelectorAll(selector);
        const container = document.getElementById(containerId);

        products.forEach(p => container.appendChild(p.cloneNode(true)));
        if (!products.length) container.closest("section").style.display = "none";
      });
  }

  // ========== ماستر بوكس ==========
  loadProducts("semioriginal.html", ".product-card.semi-card.best-seller", "best-semi");

  // ========== محاكاة رجالي ==========
 loadProducts("men.html", ".product-card.men-section.best-seller", "best-men");

  // ========== محاكاة حريمي ==========
  loadProducts("women.html", ".product-card.women-card.best-seller", "best-women");

  // ========== Unisex ==========
  loadProducts("Unisex.html", ".product-card.best-seller", "best-unisex");

});
// ---------- ADD TO CART (delegation + أحجام) ----------
document.addEventListener("click", (e) => {
  // ===== زرار إضافة للسلة =====
  if (e.target.classList.contains("add-to-cart-btn")) {
    const card = e.target.closest(".product-card");
    if (!card) return;

    const productName = card.querySelector("h3").textContent;
    const img = card.querySelector("img").src;

    // ===== الأسعار حسب الحجم =====
    let price = 0;
    let size = "One Size";

    const sizeContainer = card.querySelector(".sizes-container");
    if (sizeContainer) {
      const activeSize = sizeContainer.querySelector(".size-option.active");
      if (!activeSize) {
        alert("اختر الحجم أولاً");
        return; // ما تضيفش للسلة
      }
      size = activeSize.textContent;
      price = parseFloat(activeSize.dataset.price);
    } else {
      const priceEl = card.querySelector(".price");
      price = parseFloat(priceEl.textContent.replace(" ج.م","")) || 0;
    }

    // إضافة المنتج للسلة
    addToCart({ name: productName, price: price, img: img, size: size });
  }

  // ===== اختيار الحجم =====
  if (e.target.classList.contains("size-option")) {
    const container = e.target.closest(".sizes-container");
    if (!container) return;
    // إزالة التفعيل من باقي الأحجام
    container.querySelectorAll(".size-option").forEach(btn => btn.classList.remove("active"));
    e.target.classList.add("active");
    // تحديث السعر الظاهر
    const priceEl = container.closest(".product-info").querySelector(".price");
    priceEl.textContent = e.target.dataset.price + " ج.م";
  }
});