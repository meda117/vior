// ============================
// SIDEBAR TOGGLE
// ============================
const hamburger = document.getElementById("hamburger");
const sidebar = document.getElementById("sidebar");
const closeSidebar = document.getElementById("closeSidebar");
const overlay = document.getElementById("overlay");

if(hamburger && sidebar && closeSidebar && overlay){
  hamburger.addEventListener("click", () => {
    sidebar.classList.add("open");
    overlay.classList.add("show");
  });

  closeSidebar.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
  });
}

// ============================
// SIMULATION MENU TOGGLE
// ============================
const simulationToggle = document.getElementById("simulationToggle");
const simulationSubmenu = document.querySelector(".simulation-submenu");

if(simulationToggle && simulationSubmenu){
  simulationToggle.addEventListener("click", (e) => {
    e.preventDefault();
    simulationSubmenu.classList.toggle("hidden");
    simulationToggle.querySelector("ion-icon").classList.toggle("rotate");
  });
}

// ============================
// حفظ القسم عند الضغط على أي رابط قسم
// ============================
document.querySelectorAll('#sectionsList a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    // تحقق إذا الرابط يودي لأي صفحة منتجات
    if (href && (href.includes('men.html') || href.includes('women.html') || href.includes('Unisex.html'))) {
      const sectionName = href.split('.html')[0]; // men, women, Unisex
      localStorage.setItem('scrollToSection', sectionName);
    }
  });
});

// ============================
// تنفيذ Scroll عند تحميل الصفحة
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const productsSection = document.getElementById("products");
  const sectionToScroll = localStorage.getItem('scrollToSection');

  if (productsSection && sectionToScroll) {
    productsSection.scrollIntoView({ behavior: "smooth" });
    localStorage.removeItem('scrollToSection'); // إعادة تعيين
  }
});

// ============================
// PRODUCT SIZE SELECTION AND PRICE UPDATE (for product listing pages)
// ============================

// لكل صفحة تحتوي على بطاقة منتج
const productCards = document.querySelectorAll(".product-card");
productCards.forEach(card => {
  const sizeButtons = card.querySelectorAll(".size-option");
  const priceEl = card.querySelector(".price");

  sizeButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      sizeButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      priceEl.textContent = btn.dataset.price + " ج.م";
    });
  });
});

// PRODUCT SIZE SELECTION AND PRICE UPDATE (for single product page)
const productSizes = document.querySelectorAll("#product-sizes .size-option");
const productPrice = document.getElementById("product-price");
let productCartCountEl = document.getElementById("cart-count");

if(productSizes && productPrice){
  productSizes.forEach(btn => {
    btn.addEventListener("click", () => {
      productSizes.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      productPrice.textContent = btn.dataset.price + " ج.م";
    });
  });
}


// ================= Hero Slider =================
const slides = document.querySelectorAll('.slide');

if (slides.length > 0) {
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
  }

  showSlide(currentSlide);

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 3000);
}

const filterBtns = document.querySelectorAll(".filter-btn");
const products = document.querySelectorAll(".product-card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    products.forEach(product => {
      if (filter === "all") {
        product.style.display = "block";
      } else {
        product.style.display = product.classList.contains(filter)
          ? "block"
          : "none";
      }
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {

  /* ================= Hero / Banner Slider ================= */

  const slides2 = document.querySelectorAll('.banner-slide2');
  const dots2   = document.querySelectorAll('.dot2');

  // لو مفيش بانر في الصفحة → نخرج بدون Errors
  if (!slides2.length || !dots2.length) return;

  let bannerIndex2 = 0;

  function showBanner2(index) {
    slides2.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      dots2[i].classList.toggle('active', i === index);
    });
  }

  // تشغيل أول بانر
  showBanner2(bannerIndex2);

  // تشغيل تلقائي
  setInterval(() => {
    bannerIndex2 = (bannerIndex2 + 1) % slides2.length;
    showBanner2(bannerIndex2);
  }, 3000);

  // 🔥 ربط النقط بالضغط
  dots2.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      bannerIndex2 = index;
      showBanner2(bannerIndex2);
    });
  });

});

document.addEventListener("DOMContentLoaded", () => {

  document.querySelectorAll(".products-page").forEach(section => {

    const searchInput = section.querySelector(".global-search-input");
    const searchBtn   = section.querySelector(".global-search-btn");
    const products    = section.querySelectorAll(".product-card");

    if (!searchInput || !products.length) return;

    function doSearch() {
      const value = searchInput.value.toLowerCase().trim();

      products.forEach(product => {
        const name = product.querySelector("h3")?.textContent.toLowerCase() || "";

        product.style.display = name.includes(value) ? "block" : "none";
      });
    }

    // البحث أثناء الكتابة
    searchInput.addEventListener("input", doSearch);

    // البحث عند الضغط على العدسة
    if (searchBtn) {
      searchBtn.addEventListener("click", doSearch);
    }

  });

});

// ----------------------------
// فلترة قسم المحاكاة (شرقي / غربي / الكل)
// ----------------------------
const simButtons = document.querySelectorAll('.simulation-section .filter-btn');
const simProducts = document.querySelectorAll('.simulation-section .product-card');

simButtons.forEach(button => {
  button.addEventListener('click', () => {
    simButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');

    simProducts.forEach(product => {
      const type = product.getAttribute('data-type'); // شرقي أو غربي
      if (filter === 'all' || filter === type) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });
  });
});

// ----------------------------
// فلترة قسم Semi Original (رجالي / حريمي / للجنسين / الكل)
// ----------------------------
const semiButtons = document.querySelectorAll('.semi-section .filter-btn');
const semiProducts = document.querySelectorAll('.semi-section .product-card');

semiButtons.forEach(button => {
  button.addEventListener('click', () => {
    semiButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    const filter = button.getAttribute('data-filter');

    semiProducts.forEach(product => {
      const gender = product.getAttribute('data-gender'); // male, female, unisex
      if (filter === 'all' || filter === gender) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });
  });
});

// التعامل مع المنتجات التي تحتوي على أحجام فقط
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    if(!card) return;

    const productName = card.querySelector("h3").textContent;
    const img = card.querySelector("img").src;

    const sizeOptions = card.querySelectorAll(".size-option");
    
    // نتعامل فقط مع المنتجات اللي فيها أحجام
    if(sizeOptions.length > 0){
      const selectedSize = card.querySelector(".size-option.active");
      if(!selectedSize){
        alert("من فضلك اختر الحجم أولاً!");
        return; // يمنع الإضافة للسلة لو ما اختارش حجم
      }

      const size = selectedSize.textContent;
      const price = parseFloat(selectedSize.dataset.price);

      // إضافة المنتج للسلة بالحجم المختار
      addToCart({name: productName, price: price, img: img, size: size});
    }
  });
});
document.addEventListener("DOMContentLoaded", () => {

  function loadHomeProducts(page, selector, targetId, limit = 10) {
    fetch(page)
      .then(res => res.text())
      .then(html => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const products = doc.querySelectorAll(selector);
        const container = document.getElementById(targetId);

        if (!container) return;

        [...products].slice(0, limit).forEach(product => {
          container.appendChild(product.cloneNode(true));
        });
      });
  }

  // ماستر بوكس
  loadHomeProducts(
    "semioriginal.html",
    ".product-card",
    "home-semi"
  );

  // رجالي
  loadHomeProducts(
    "men.html",
    ".product-card",
    "home-men"
  );

  // حريمي
  loadHomeProducts(
    "women.html",
    ".product-card",
    "home-women"
  );

  // يونيسكس
  loadHomeProducts(
    "Unisex.html",
    ".product-card",
    "home-unisex"
  );

});

document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("promo-banner");
  const closeBtn = document.getElementById("close-banner");

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      banner.style.display = "none";
      document.body.style.paddingTop = "0"; // يعيد الصفحة للوراء
    });
  }
});