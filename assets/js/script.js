// ====================================================
//  DARK MODE
// ====================================================
(function initDarkMode() {
  const saved = localStorage.getItem("kumpooTheme");
  // Default = light; dark only if explicitly saved
  if (saved === "dark") {
    document.body.classList.add("dark-mode");
    const btn = document.getElementById("darkModeBtn");
    if (btn) btn.textContent = "☀️";
  }
})();

window.toggleDarkMode = function () {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("kumpooTheme", isDark ? "dark" : "light");
  const btn = document.getElementById("darkModeBtn");
  if (btn) btn.textContent = isDark ? "☀️" : "🌙";
};

// ====================================================
//  MOBILE NAV
// ====================================================
window.toggleMobileNav = function () {
  const nav = document.getElementById("mobileNav");
  const btn = document.getElementById("hamburgerBtn");
  nav.classList.toggle("open");
  btn.classList.toggle("open");
};
window.closeMobileNav = function () {
  document.getElementById("mobileNav")?.classList.remove("open");
  document.getElementById("hamburgerBtn")?.classList.remove("open");
};

// ====================================================
//  LANGUAGE SYSTEM
// ====================================================
let currentLang = localStorage.getItem("kumpooLang") || "vi";

function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("kumpooLang", lang);

  // Update <html lang>
  document.documentElement.lang = lang;

  // Update title tag
  const titleEl = document.querySelector("title");
  if (titleEl && titleEl.dataset[lang]) {
    titleEl.textContent = titleEl.dataset[lang];
  }

  // Update all static elements with data-vi / data-en
  document.querySelectorAll("[data-vi][data-en]").forEach((el) => {
    if (el !== titleEl) {
      el.textContent = el.dataset[lang];
    }
  });

  // Update placeholders and titles
  document.querySelectorAll(`[data-${lang}-placeholder]`).forEach((el) => {
    el.placeholder = el.dataset[lang + "Placeholder"];
  });
  document.querySelectorAll(`[data-${lang}-title]`).forEach((el) => {
    el.title = el.dataset[lang + "Title"];
  });

  // Update flag icon (using high-quality SVGs)
  const flagEl = document.getElementById("langFlag");
  if (flagEl) {
    // lang is the current language, we show the flag of the language we are in
    const flagUrl =
      lang === "vi"
        ? "https://flagcdn.com/vn.svg"
        : "https://flagcdn.com/gb.svg";
    flagEl.innerHTML = `<img src="${flagUrl}" alt="${lang}">`;
  }

  // Re-render products — keep active filter if available, otherwise show all
  if (typeof window.setFilter === "function") {
    window.setFilter();
  } else if (typeof renderProducts === "function") {
    renderProducts(productsData);
  }
  // Refresh open modal if any
  if (typeof window._refreshModal === "function") {
    window._refreshModal();
  }
}

window.toggleLanguage = function () {
  applyLanguage(currentLang === "vi" ? "en" : "vi");
};

// ====================================================
//  PRODUCT TRANSLATIONS
// ====================================================
const productTranslations = {
  // ---- Names ----
  names: {
    "kumpoo-power-balanced-11": {
      en: "Kumpoo Power Balanced 11 Badminton Racket",
    },
    "kumpoo-yangzhou": { en: "Kumpoo YangZhou Badminton Racket (Official)" },
    "kumpoo-jingzhou": { en: "Kumpoo JingZhou Badminton Racket (Official)" },
    "kumpoo-nine-tailed-fox": { en: "Kumpoo Nine Tailed Fox Badminton Racket" },
    "kumpoo-k520-pro": { en: "Kumpoo K520 Pro Badminton Racket" },
    "kumpoo-power-control-r89": {
      en: "Kumpoo Power Control R89 Badminton Racket",
    },
    "kumpoo-power-control-e58ls": {
      en: "Kumpoo Power Control E58LS Badminton Racket",
    },
    "kumpoo-b-duck-cool-set": { en: "SET Kumpoo B.Duck Cool Badminton Racket" },
    "kumpoo-mountains-and-rivers-set": {
      en: "SET Kumpoo Mountains And Rivers Badminton Racket",
    },
    "kumpoo-shanhai-set": { en: "SET Kumpoo Shanhai Badminton Racket" },
    "kumpoo-k520-pro-plus": {
      en: "Kumpoo Power Control K520 Pro Plus Badminton Racket",
    },
    // Shoes
    "kumpoo-giay-kh-e55-trang": { en: "Kumpoo KH-E55 Badminton Shoes (White)" },
    "kumpoo-giay-kh-e55-den": { en: "Kumpoo KH-E55 Badminton Shoes (Black)" },
    "kumpoo-giay-kh-g825": { en: "Kumpoo KH-G825 Badminton Shoes (Official)" },
    "kumpoo-giay-kh-g826s": {
      en: "Kumpoo KH-G826S Badminton Shoes (Official)",
    },
    // Bags
    "kumpoo-tui-k432": { en: "Kumpoo K432 Badminton Bag (Official)" },
    "kumpoo-tui-kb-163": {
      en: "Kumpoo KB-163 Badminton Bag White-Brown (Official)",
    },
    "kumpoo-tui-kb-268": { en: "Kumpoo KB-268 Badminton Bag White (Official)" },
    "kumpoo-balo-kb369": {
      en: "Kumpoo KB369 Badminton Backpack Black (Official)",
    },
    // Socks
    "kumpoo-vo-kso-07-do": {
      en: "Kumpoo KSO 07 Badminton Socks Red (Official)",
    },
    "kumpoo-vo-kso-408-trang": {
      en: "Kumpoo KSO 408 Badminton Socks White (Official)",
    },
    // Strings
    "kumpoo-day-cuoc-js65": { en: "Kumpoo JS65 Badminton String" },
    "kumpoo-day-cuoc-js67": { en: "Kumpoo JS67 Badminton String" },
    // Grips
    "kumpoo-quan-can-k003": { en: "Kumpoo K003 Badminton Grip" },
  },
  // ---- Categories ----
  categories: {
    "Vợt Cầu Lông": { en: "Badminton Racket" },
    "Bộ Sản Phẩm (Set)": { en: "Product Set" },
    "Giày Cầu Lông": { en: "Badminton Shoes" },
    "Túi Cầu Lông": { en: "Badminton Bag" },
    "Vớ Cầu Lông": { en: "Badminton Socks" },
    "Dây Cước Cầu Lông": { en: "Badminton String" },
    "Quấn Cán Cầu Lông": { en: "Badminton Grip" },
  },
  // ---- Descriptions ----
  descriptions: {
    "kumpoo-power-balanced-11": {
      en: "Ideal for beginners and players with weak wrist strength, especially women.",
    },
    "kumpoo-yangzhou": {
      en: "A blend of elegant design and superior performance with a fresh, dynamic color scheme.",
    },
    "kumpoo-jingzhou": {
      en: "Bold design, suitable for all-around play style for new players.",
    },
    "kumpoo-nine-tailed-fox": {
      en: "Inspired by the Nine-Tailed Fox legend — strikingly beautiful and mysterious, with great power assist.",
    },
    "kumpoo-k520-pro": {
      en: "Balanced sweet spot for a perfect balance between attack and defense, suits versatile play styles.",
    },
    "kumpoo-power-control-r89": {
      en: "An easy-to-play, balanced racket suitable for all-around offensive and defensive play.",
    },
    "kumpoo-power-control-e58ls": {
      en: "Designed for all-around play, slightly leaning toward powerful attacking smashes.",
    },
    "kumpoo-b-duck-cool-set": {
      en: "Limited B.Duck edition with an ultra-cool design, stable frame for powerful smashing.",
    },
    "kumpoo-mountains-and-rivers-set": {
      en: "Special Mountains And Rivers edition using 3000-thread Carbon material for extreme durability.",
    },
    "kumpoo-shanhai-set": {
      en: "Inspired by Shan Hai Jing, Thermal foaming technology enhances frame stability.",
    },
    "kumpoo-k520-pro-plus": {
      en: "Upgraded version of K520 Pro with a fresh new color and improved frame durability.",
    },
    // Shoes
    "kumpoo-giay-kh-e55-trang": {
      en: "Kumpoo KH-E55 White — sporty design with anti-slip rubber sole, suitable for all levels.",
    },
    "kumpoo-giay-kh-e55-den": {
      en: "Kumpoo KH-E55 Black — sleek and durable, anti-slip sole for quick footwork in matches.",
    },
    "kumpoo-giay-kh-g825": {
      en: "Kumpoo KH-G825 — premium G-Cushion technology for optimal knee protection during intensive play.",
    },
    "kumpoo-giay-kh-g826s": {
      en: "Kumpoo KH-G826S — upgraded with carbon fiber plate for superior court grip and high-intensity play.",
    },
    // Bags
    "kumpoo-tui-k432": {
      en: "Kumpoo K432 — compact and lightweight bag, fits 2-3 rackets, water-resistant polyester.",
    },
    "kumpoo-tui-kb-163": {
      en: "Kumpoo KB-163 White-Brown — stylish PU leather + polyester combo bag, elegant look.",
    },
    "kumpoo-tui-kb-268": {
      en: "Kumpoo KB-268 — large capacity for 3-4 rackets, multiple compartments, water-resistant material.",
    },
    "kumpoo-balo-kb369": {
      en: "Kumpoo KB369 Backpack Black — holds up to 6 rackets, padded shoulder straps, great for travel.",
    },
    // Socks
    "kumpoo-vo-kso-07-do": {
      en: "Kumpoo KSO 07 Red — moisture-wicking cotton, reinforced heel & toe cushioning for match protection.",
    },
    "kumpoo-vo-kso-408-trang": {
      en: "Kumpoo KSO 408 White — ankle-cut design, premium breathable cotton, snug fit for agile movement.",
    },
    // Strings
    "kumpoo-day-cuoc-js65": {
      en: "Kumpoo JS65 Badminton String — 0.65mm thickness, premium multifilament nylon material for great feel, high durability, and stable tension, suitable for all levels.",
    },
    "kumpoo-day-cuoc-js67": {
      en: "Kumpoo JS67 Badminton String — 0.67mm thickness, thicker than JS65, enhancing durability and maximum tension up to 30 lbs, ideal for aggressive play and professional competition.",
    },
    // Grips
    "kumpoo-quan-can-k003": {
      en: "Kumpoo K003 Badminton Grip made of premium PU material — anti-slip surface, good moisture absorption, helping you hold the racket firmly during matches. Easy to replace at home.",
    },
  },
  // ---- Spec label keys ----
  specLabels: {
    "Trọng lượng": "Weight",
    "Độ cứng": "Stiffness",
    "Điểm cân bằng": "Balance Point",
    "Sức căng dây": "String Tension",
    "Chất liệu": "Material",
    "Chiều dài": "Length",
    Color: "Color",
    "Màu sắc": "Color",
    "Chất liệu đế": "Outsole Material",
    "Đế giữa": "Midsole",
    "Công nghệ": "Technology",
    "Phù hợp": "Suitable For",
    "Sức chứa": "Capacity",
    "Ngăn chứa": "Compartments",
    "Kiểu dáng": "Style",
    "Độ dày": "Thickness",
    "Độ bền": "Durability",
    "Lực căng tối đa": "Max Tension",
    "Chiều rộng": "Width",
    "Tính năng": "Features",
  },
  // ---- Spec value fragments ----
  specValues: {
    "Trung bình": "Medium",
    Cứng: "Stiff",
    "Cân bằng": "Balance",
    "Hơi nặng đầu": "Slightly Head-Heavy",
    "Nặng đầu": "Head-Heavy",
    "Tối đa": "Max",
    "Trung bình - Cứng": "Medium - Stiff",
    "Trắng phối Xanh Dương": "White / Blue",
    "Cotton + Polyester + Spandex": "Cotton + Polyester + Spandex",
    "Đệm lót tăng cường gót và mũi": "Reinforced Heel & Toe Cushioning",
    "Cổ ngắn (Ankle)": "Ankle Cut",
    "Nam & Nữ": "Men & Women",
    Nam: "Men",
    Nữ: "Women",
    "Cao su chống trượt": "Anti-slip Rubber",
    "Cao su non-marking": "Non-marking Rubber",
    "EVA đàn hồi cao": "High-resilience EVA",
    "PU + EVA kép": "Dual PU + EVA",
    "Carbon Fiber plate + EVA": "Carbon Fiber Plate + EVA",
    "Polyester cao cấp": "Premium Polyester",
    "Polyester + da PU": "Polyester + PU Leather",
    "Polyester cao cấp chống thấm": "Premium Water-resistant Polyester",
    "Polyester 600D cao cấp": "Premium 600D Polyester",
    "Ngăn chính + ngăn phụ": "1 Main + 1 Side Pocket",
    "2 ngăn chính + 1 ngăn phụ": "2 Main + 1 Side Pocket",
    "2 ngăn chính + 2 ngăn phụ": "2 Main + 2 Side Pockets",
    "Ngăn vợt riêng + 3 ngăn phụ": "Dedicated Racket Compartment + 3 Pockets",
    "Túi đeo vai": "Shoulder Bag",
    "Túi đeo vai cỡ lớn": "Large Shoulder Bag",
    "Balo đeo lưng": "Backpack",
    "10 m / cuộn": "10 m / roll",
    "Multifilament Nylon cao cấp": "Premium Multifilament Nylon",
    Cao: "High",
    "Rất cao": "Very High",
    "Tất cả trình độ": "All levels",
    "Chơi mạnh & thi đấu chuyên nghiệp":
      "Aggressive play & professional competition",
    "PU cao cấp": "Premium PU",
    "Chống trơn, hút ẩm": "Anti-slip, moisture-wicking",
    "Tất cả loại vợt": "All racket types",
  },
  // ---- Variant colors ----
  colors: {
    Đen: "Black",
    "Xanh Dương": "Blue",
    Hồng: "Pink",
    Trắng: "White",
    Đỏ: "Red",
    Vàng: "Yellow",
    "Trắng - Nâu": "White - Brown",
  },
  // ---- UI strings ----
  ui: {
    "Chọn màu sắc:": { en: "Choose color:" },
    "Mô tả:": { en: "Description:" },
    "Thêm vào giỏ hàng": { en: "Add to Cart" },
  },
};

// Helper: translate a spec value string
function translateSpecValue(val) {
  if (currentLang === "vi") return val;
  let result = val;
  for (const [vi, en] of Object.entries(productTranslations.specValues)) {
    result = result.replace(vi, en);
  }
  return result;
}

// ====================================================
//  MAIN SCRIPT
// ====================================================
document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("productGrid");
  const modal = document.getElementById("productModal");
  const closeModalBtn = document.getElementById("closeModal");
  const modalBody = document.getElementById("modalBody");

  // ── Active filter state ──
  let activeCategory = "all";

  // ── Filter bar click handler ──
  const filterBar = document.getElementById("filterBar");
  if (filterBar) {
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-btn");
      if (!btn) return;
      // Update active button
      filterBar
        .querySelectorAll(".filter-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      // Filter and render
      activeCategory = btn.dataset.category;
      const filtered =
        activeCategory === "all"
          ? productsData
          : productsData.filter((p) => p.category === activeCategory);
      renderProducts(filtered);
    });
  }

  // ── Search implementation ──
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();
    if (!query) {
      window.setFilter(); // Restore current category filter
      return;
    }

    const isEn = currentLang === "en";
    const filtered = productsData.filter((product) => {
      const nameVi = product.name.toLowerCase();
      const nameEn = (productTranslations.names[product.id]?.en || "").toLowerCase();
      const catVi = product.category.toLowerCase();
      const catEn = (productTranslations.categories[product.category]?.en || "").toLowerCase();
      
      return nameVi.includes(query) || nameEn.includes(query) || 
             catVi.includes(query) || catEn.includes(query);
    });

    renderProducts(filtered);
    
    // UI feedback if empty
    if (filtered.length === 0) {
      const msg = isEn ? "No products found matching your search." : "Không tìm thấy sản phẩm nào khớp với tìm kiếm của bạn.";
      productGrid.innerHTML = `<div class="cart-empty" style="grid-column: 1/-1; padding: 100px 0;">
        <span style="font-size: 3rem;">🔍</span>
        <p style="font-size: 1.2rem; margin-top: 15px;">${msg}</p>
      </div>`;
    }
  }

  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  }
  if (searchBtn) {
      searchBtn.addEventListener("click", handleSearch);
  }

  // Expose filter re-render for language switcher
  window.setFilter = () => {
    const filtered =
      activeCategory === "all"
        ? productsData
        : productsData.filter((p) => p.category === activeCategory);
    renderProducts(filtered);
  };

  let products = productsData;
  window.renderProducts = renderProducts; // expose for language switcher
  renderProducts(products);

  // Apply saved language on load
  applyLanguage(currentLang);

  // ---- Render product grid ----
  function renderProducts(items) {
    productGrid.innerHTML = items
      .map((product) => {
        const isEn = currentLang === "en";
        const name = isEn
          ? productTranslations.names[product.id]?.en || product.name
          : product.name;
        const category = isEn
          ? productTranslations.categories[product.category]?.en ||
            product.category
          : product.category;
        return `
            <div class="product-card" id="product-${product.id}">
                <button class="product-wishlist-icon wishlist-icon-${product.id} ${wishlistItems.includes(product.id) ? 'active' : ''}" 
                        onclick="toggleWishlist(event, '${product.id}')" title="Yêu thích">❤</button>
                <img src="${product.images[0]}" alt="${name}" class="product-image" onclick="openProductModal('${product.id}')">
                <div class="product-category">${category}</div>
                <a class="product-name" href="javascript:void(0)" onclick="openProductModal('${product.id}')">${name}</a>
                <div class="product-price-row">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <span class="original-price">${formatPrice(product.original_price)}</span>
                </div>
            </div>
        `;
      })
      .join("");
  }

  // ---- Currency formatter ----
  function formatPrice(price) {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }

  // ---- Open modal ----
  window.openProductModal = (id) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    displayProductDetails(product);
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
  };

  function displayProductDetails(product, selectedVariantIndex = null) {
    const isEn = currentLang === "en";
    let currentImages = product.images;
    let colorOptions = "";

    // Variants
    if (product.variants && product.variants.length > 0) {
      const colorLabel = isEn ? "Choose color:" : "Chọn màu sắc:";
      colorOptions = `
                <div class="variant-selector">
                    <span class="variant-title">${colorLabel}</span>
                    <div class="color-chips">
                        ${product.variants
                          .map((v, index) => {
                            const colorName = isEn
                              ? productTranslations.colors[v.color] || v.color
                              : v.color;
                            return `
                            <div class="color-chip ${selectedVariantIndex === index ? "active" : ""}" 
                                 onclick="event.stopPropagation(); changeVariant('${product.id}', ${index})">
                                ${colorName}
                            </div>`;
                          })
                          .join("")}
                    </div>
                </div>
            `;
      if (selectedVariantIndex !== null) {
        currentImages = product.variants[selectedVariantIndex].images;
      }
    }

    // Specs
    const specsHtml = Object.entries(product.specs)
      .map(([label, value]) => {
        const displayLabel = isEn
          ? productTranslations.specLabels[label] || label
          : label;
        const displayValue = translateSpecValue(value);
        return `
            <div class="spec-item">
                <span class="spec-label">${displayLabel}</span>
                <span class="spec-value">${displayValue}</span>
            </div>`;
      })
      .join("");

    // Text
    const name = isEn
      ? productTranslations.names[product.id]?.en || product.name
      : product.name;
    const category = isEn
      ? productTranslations.categories[product.category]?.en || product.category
      : product.category;
    const description = isEn
      ? productTranslations.descriptions[product.id]?.en || product.description
      : product.description;
    const descLabel = isEn ? "Description:" : "Mô tả:";
    const btnLabel = isEn ? "Add to Cart" : "Thêm vào giỏ hàng";

    modalBody.innerHTML = `
            <div class="modal-gallery">
                <img src="${currentImages[0]}" class="main-modal-img" id="mainModalImg">
                <div class="thumbnail-row">
                    ${currentImages
                      .map(
                        (img, i) => `
                        <img src="${img}" class="thumb-img ${i === 0 ? "active" : ""}" 
                             onclick="updateMainImage('${img}', this)">
                    `,
                      )
                      .join("")}
                </div>
            </div>
            <div class="modal-info">
                <div class="product-category">${category}</div>
                <h2>${name}</h2>
                <div class="product-price-row">
                    <span class="product-price" style="font-size: 2rem;">${formatPrice(product.price)}</span>
                    <span class="original-price" style="font-size: 1.2rem;">${formatPrice(product.original_price)}</span>
                </div>
                
                ${colorOptions}

                <div class="spec-list">
                    ${specsHtml}
                </div>
                
                <div style="margin-top: 20px;">
                    <p><strong>${descLabel}</strong> ${description}</p>
                </div>
                
                <button class="btn-primary" style="width: 100%; margin-top: 30px;"
                    onclick="addToCart('${product.id}')">${btnLabel}</button>
            </div>
        `;

    // Store current product for re-render on language change
    modal._currentProduct = product;
    modal._currentVariantIndex = selectedVariantIndex;
  }

  // Expose displayProductDetails so language toggle can refresh open modal
  window._refreshModal = () => {
    if (modal.style.display === "block" && modal._currentProduct) {
      displayProductDetails(modal._currentProduct, modal._currentVariantIndex);
    }
  };

  // ---- Change variant ----
  window.changeVariant = (id, index) => {
    const product = products.find((p) => p.id === id);
    modal._currentVariantIndex = index;
    displayProductDetails(product, index);
  };

  // ---- Update main image ----
  window.updateMainImage = (src, thumb) => {
    document.getElementById("mainModalImg").src = src;
    document
      .querySelectorAll(".thumb-img")
      .forEach((t) => t.classList.remove("active"));
    thumb.classList.add("active");
  };

  // ---- Close modal ----
  closeModalBtn.onclick = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  };

  window.onclick = (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  };
});

// ====================================================
//  PROMO BANNER SLIDER
// ====================================================
(function initPromoSlider() {
  const TOTAL = 4;
  const AUTO_DELAY = 5000; // ms between slides
  let current = 0;
  let autoTimer = null;
  let progTimer = null;

  const track = document.getElementById("promoTrack");
  const dots = document.querySelectorAll("#promoDots .promo-dot");
  const btnL = document.getElementById("promoArrowLeft");
  const btnR = document.getElementById("promoArrowRight");
  const section = document.getElementById("promoBannerSection");
  const numEl = document.getElementById("promoSlideNum");
  const fillEl = document.getElementById("promoProgressFill");

  if (!track || !btnL || !btnR) return;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function goTo(index) {
    current = (index + TOTAL) % TOTAL;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === current));
    if (numEl) numEl.textContent = `${pad(current + 1)} / ${pad(TOTAL)}`;
    resetProgress();
  }

  function next() {
    goTo(current + 1);
  }
  function prev() {
    goTo(current - 1);
  }

  /* ── Progress bar ── */
  function resetProgress() {
    if (!fillEl) return;
    clearInterval(progTimer);
    fillEl.style.transition = "none";
    fillEl.style.width = "0%";
    // Allow reflow before re-animating
    void fillEl.offsetWidth;
    fillEl.style.transition = `width ${AUTO_DELAY}ms linear`;
    fillEl.style.width = "100%";
  }

  function stopProgress() {
    if (!fillEl) return;
    clearInterval(progTimer);
    const computed = getComputedStyle(fillEl).width;
    fillEl.style.transition = "none";
    fillEl.style.width = computed;
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(next, AUTO_DELAY);
    resetProgress();
  }
  function stopAuto() {
    clearInterval(autoTimer);
    stopProgress();
  }

  // Arrow clicks
  btnR.addEventListener("click", (e) => {
    e.stopPropagation();
    next();
    startAuto();
  });
  btnL.addEventListener("click", (e) => {
    e.stopPropagation();
    prev();
    startAuto();
  });

  // Dot clicks
  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      goTo(parseInt(dot.dataset.index));
      startAuto();
    });
  });

  // Pause on hover
  section.addEventListener("mouseenter", stopAuto);
  section.addEventListener("mouseleave", startAuto);

  // Touch / swipe support
  let touchStartX = 0;
  section.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );
  section.addEventListener(
    "touchend",
    (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? next() : prev();
        startAuto();
      }
    },
    { passive: true },
  );

  // Kick off
  goTo(0);
  startAuto();
})();

// ====================================================
//  REVIEW SLIDER (JS)
// ====================================================
(function initReviewSlider() {
    const slider = document.getElementById("reviewSlider");
    const container = document.getElementById("reviewSliderContainer");
    const prevBtn = document.getElementById("reviewPrev");
    const nextBtn = document.getElementById("reviewNext");
    const dotsContainer = document.getElementById("reviewDots");
    
    if (!slider || !container) return;

    const cards = Array.from(slider.children);
    let currentIndex = 0;
    let autoTimer = null;
    const AUTO_DELAY = 6000;

    // Generate dots
    dotsContainer.innerHTML = cards.map((_, i) => `<div class="review-dot" data-index="${i}"></div>`).join("");
    const dots = Array.from(dotsContainer.children);

    function getVisibleCards() {
        if (window.innerWidth <= 600) return 1;
        if (window.innerWidth <= 992) return 2;
        return 3;
    }

    function updateSlider() {
        const visible = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visible);
        
        if (currentIndex > maxIndex) currentIndex = maxIndex;
        
        const cardWidth = cards[0].offsetWidth + 30; // factor in gap
        slider.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
            // Hide dots that would result in empty space at end
            dot.style.display = i <= maxIndex ? "block" : "none";
        });
    }

    function move(dir) {
        const visible = getVisibleCards();
        const maxIndex = Math.max(0, cards.length - visible);
        
        currentIndex += dir;
        if (currentIndex < 0) currentIndex = maxIndex;
        if (currentIndex > maxIndex) currentIndex = 0;
        
        updateSlider();
        startAuto();
    }

    // Controls
    nextBtn?.addEventListener("click", () => move(1));
    prevBtn?.addEventListener("click", () => move(-1));
    
    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            currentIndex = parseInt(dot.dataset.index);
            updateSlider();
            startAuto();
        });
    });

    function startAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(() => move(1), AUTO_DELAY);
    }

    window.addEventListener("resize", updateSlider);
    
    // Init
    updateSlider();
    startAuto();
})();
