document.addEventListener("DOMContentLoaded", () => {

  function shuffle(arr) {
    return arr.sort(() => 0.5 - Math.random());
  }

  function loadProducts(url, selector, containerId, limit = 10) {
    fetch(url)
      .then(res => res.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const grid = doc.querySelector(".products-grid");
        if (!grid) return;

        let products = Array.from(grid.querySelectorAll(selector));

        // عشوائي
        products = shuffle(products).slice(0, limit);

        const container = document.getElementById(containerId);
        products.forEach(p => container.appendChild(p.cloneNode(true)));

        observeCards(container.querySelectorAll(".product-card"));
      });
  }

  /* ========= BEST SELLER فقط ========= */
  loadProducts("best.html", ".product-card", "home-best", 10);

  /* ========= باقي الأقسام (عشوائي) ========= */
  loadProducts("semioriginal.html", ".product-card", "home-semi", 10);
  loadProducts("men.html", ".product-card", "home-men", 10);
  loadProducts("women.html", ".product-card", "home-women", 10);
  loadProducts("Unisex.html", ".product-card", "home-unisex", 10);

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
document.addEventListener("DOMContentLoaded", () => {
  const shopBtn = document.getElementById("shopBtn");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay"); // نفس overlay الحالي
  const closeSidebar = document.getElementById("closeSidebar");

  if (!shopBtn || !sidebar || !overlay) return;

  // فتح السايدبار من زر تسوق الآن
  shopBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  });

  // غلق السايدبار عند الضغط على × أو الخلفية
  function closeSidebarMenu() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  }

  overlay.addEventListener("click", closeSidebarMenu);
  closeSidebar.addEventListener("click", closeSidebarMenu);
});
document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("promo-banner");
  const closeBtn = document.getElementById("close-banner");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      banner.style.display = "none";
      // نزح الـ body لو محتاج
      document.body.style.paddingTop = "0";
    });
  }
});