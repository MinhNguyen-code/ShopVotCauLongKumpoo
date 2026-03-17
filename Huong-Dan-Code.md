# 📚 Hướng Dẫn Giải Thích Code — Kumpoo Badminton Shop

> Tài liệu này giải thích toàn bộ code của website **Kumpoo Badminton Shop**, bao gồm 4 file chính:
> `index.html` · `style.css` · `script.js` · `cart-auth.js` · `products.js`

---

## 📁 Cấu Trúc Thư Mục

```
Shop Vot Cau Long Kumpoo/
│
├── index.html        ← Giao diện chính của website (cấu trúc HTML)
├── style.css         ← Toàn bộ thiết kế giao diện (màu sắc, layout, animation)
├── script.js         ← Logic hiển thị sản phẩm, modal, ngôn ngữ, dark mode
├── cart-auth.js      ← Giỏ hàng, đăng nhập, đăng ký
├── products.js       ← Dữ liệu tất cả sản phẩm
└── img/              ← Thư mục chứa ảnh sản phẩm
```

---

---

# 📄 1. FILE: `index.html`

## Tổng quan
File HTML định nghĩa toàn bộ **cấu trúc hiển thị** của trang web. Không chứa logic — chỉ là khung xương.

---

## 1.1 Phần `<head>`

```html
<title data-vi="..." data-en="...">...</title>
```
- **`data-vi` / `data-en`**: Thuộc tính tuỳ chỉnh để hệ thống ngôn ngữ tự động đổi nội dung khi chuyển Việt ↔ Anh.
- Tiêu đề trang sẽ được cập nhật bởi `applyLanguage()` trong `script.js`.

```html
<link href="https://fonts.googleapis.com/.../Outfit..." rel="stylesheet">
```
- Tải font **Outfit** từ Google Fonts — font chính của toàn website.

---

## 1.2 `<style>` nội tuyến trong `<head>`

Phần CSS này chỉ áp dụng cho các phần tử **trong header**, được viết riêng để tránh ảnh hưởng toàn trang:

| Class | Mục đích |
|---|---|
| `.header-right` | Nhóm các nút bên phải header (ngôn ngữ, dark mode, giỏ hàng) |
| `.header-divider` | Đường kẻ dọc ngăn cách các phần tử |
| `.lang-flag-btn` | Nút chuyển đổi ngôn ngữ (icon cờ quốc kỳ) |
| `.dark-mode-btn` | Nút bật/tắt Dark Mode (🌙 / ☀️) |
| `.hamburger-btn` | Nút ☰ trên mobile để mở menu |
| `.mobile-nav` | Menu navigation dành cho mobile |
| `.header-user-chip` | Hiển thị tên người dùng sau khi đăng nhập |
| `.header-logout-btn` | Nút "Thoát" (đăng xuất) |

---

## 1.3 Phần `<body>`

### 🔷 `<header>` — Thanh điều hướng cố định

```html
<header>
    <a href="#" class="logo-container">...</a>  <!-- Logo + tên shop -->
    <nav>...</nav>                               <!-- Menu desktop -->
    <div class="header-right">                  <!-- Nút điều khiển bên phải -->
        <div id="authZone">...</div>            <!-- Hiện sau khi đăng nhập -->
        <button class="dark-mode-btn">🌙</button>  <!-- Dark mode -->
        <button class="lang-flag-btn">🇻🇳</button>  <!-- Ngôn ngữ -->
        <button class="cart-header-btn">🛒</button> <!-- Giỏ hàng -->
        <button class="hamburger-btn">☰</button>    <!-- Menu mobile -->
    </div>
</header>
```

- Header dùng `position: fixed` → luôn hiển thị dù cuộn trang.
- `data-vi` / `data-en` trên các thẻ `<a>` trong nav → tự động dịch khi đổi ngôn ngữ.

---

### 🔷 `<nav class="mobile-nav">` — Menu Mobile

```html
<nav class="mobile-nav" id="mobileNav">
    <ul>
        <li><a href="#home" onclick="closeMobileNav()">Trang Chủ</a></li>
        ...
    </ul>
</nav>
```
- Mặc định ẩn (`display: none`).
- Hiện ra khi bấm nút Hamburger ☰ → hàm `toggleMobileNav()` trong `script.js`.
- Mỗi link gọi `closeMobileNav()` để tự đóng khi người dùng chọn mục.

---

### 🔷 Promo Banner Slider

```html
<section class="promo-banner-section" id="promoBannerSection">
    <div class="promo-slider-track" id="promoTrack">
        <div class="promo-slide">...</div>  <!-- Slide 1: Vợt -->
        <div class="promo-slide">...</div>  <!-- Slide 2: Giày -->
        <div class="promo-slide">...</div>  <!-- Slide 3: Túi -->
        <div class="promo-slide">...</div>  <!-- Slide 4: Vớ -->
    </div>
    <button id="promoArrowLeft">&#10094;</button>   <!-- Mũi tên trái -->
    <button id="promoArrowRight">&#10095;</button>  <!-- Mũi tên phải -->
    <div id="promoDots">...</div>                    <!-- Chấm tròn điều hướng -->
    <div id="promoSlideNum">01 / 04</div>            <!-- Số thứ tự slide -->
    <div id="promoProgress">...</div>                <!-- Thanh tiến trình -->
</section>
```

- **Cơ chế slide**: Dùng CSS `transform: translateX(-N * 100%)` để dịch chuyển track.
- **Auto-play**: Tự chuyển slide mỗi 5 giây.
- **Drag/Swipe**: Hỗ trợ vuốt cảm ứng trên mobile.
- Mỗi slide có ảnh nền, overlay tối gradient, và text + nút CTA.

---

### 🔷 Section "Về Kumpoo"

```html
<section class="container" id="about">
    <div class="section-title"><h2 data-vi="Về Kumpoo" data-en="About Kumpoo">...</h2></div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; ...">
        <div><img src="img/01-2.jpg"></div>   <!-- Ảnh thương hiệu -->
        <div>                                  <!-- Nội dung mô tả -->
            <h3 data-vi="..." data-en="...">...</h3>
            <p data-vi="..." data-en="...">...</p>
        </div>
    </div>
</section>
```
- Layout 2 cột dùng CSS Grid.
- Tất cả text có `data-vi`/`data-en` → tự dịch.
- Trên mobile, grid tự chuyển sang 1 cột qua CSS responsive.

---

### 🔷 Section Sản Phẩm

```html
<section class="container" id="products">
    <!-- Thanh lọc danh mục -->
    <div class="filter-bar" id="filterBar">
        <button class="filter-btn active" data-category="all">Tất Cả</button>
        <button class="filter-btn" data-category="Vợt Cầu Lông">🏸 Vợt</button>
        <button class="filter-btn" data-category="Dây Cước Cầu Lông">🧵 Dây Cước</button>
        <!-- ... -->
    </div>

    <!-- Lưới sản phẩm (render bằng JS) -->
    <div class="product-grid" id="productGrid"></div>
</section>
```
- `filterBar`: Bấm vào nút nào → lọc chỉ sản phẩm thuộc danh mục đó.
- `productGrid`: Trống trong HTML — **sản phẩm được đổ vào bằng JavaScript** (`renderProducts()`).

---

### 🔷 Modal Chi Tiết Sản Phẩm

```html
<div id="productModal" class="modal">
    <div class="modal-content">
        <span class="close-modal" id="closeModal">&times;</span>
        <div class="modal-body" id="modalBody">
            <!-- Nội dung được inject bởi JS -->
        </div>
    </div>
</div>
```
- Mặc định `display: none`, hiện khi bấm vào sản phẩm.
- Nội dung bên trong (`modalBody`) được tạo hoàn toàn bởi `displayProductDetails()` trong `script.js`.

---

### 🔷 Auth Modal (Đăng nhập / Đăng ký)

```html
<div id="authModal" class="auth-overlay" onclick="closeAuthModal(event)">
    <div class="auth-box">
        <!-- Tabs: Đăng Nhập | Đăng Ký -->
        <div class="auth-tabs">...</div>

        <!-- Form đăng nhập -->
        <div id="formLogin" class="auth-form">...</div>

        <!-- Form đăng ký -->
        <div id="formRegister" class="auth-form" style="display:none;">...</div>
    </div>
</div>
```
- Bấm ra ngoài vùng `.auth-box` → gọi `closeAuthModal(event)` để đóng.
- `input` có `data-vi-placeholder` / `data-en-placeholder` → placeholder tự đổi theo ngôn ngữ.

---

### 🔷 Cart Sidebar (Giỏ Hàng)

```html
<div id="cartOverlay" class="cart-overlay" onclick="closeCart()"></div>
<div id="cartSidebar" class="cart-sidebar">
    <div class="cart-header">...</div>
    <div class="cart-items" id="cartItems">...</div>
    <div class="cart-footer">
        <div class="cart-total-row">...</div>
        <button class="cart-checkout-btn">Đặt hàng ngay ✓</button>
    </div>
</div>
```
- Sidebar trượt từ phải vào (`transform: translateX(110%)` → `translateX(0)`).
- `cartOverlay`: Lớp phủ tối phía sau, bấm vào sẽ đóng sidebar.

---

### 🔷 `<footer>`
- Chứa logo, thông tin liên hệ (Zalo, Messenger), và copyright.
- Links liên hệ có hiệu ứng hover đổi màu.

---

### 🔷 Thứ tự load Scripts

```html
<script src="products.js"></script>   <!-- 1. Load dữ liệu sản phẩm trước -->
<script src="script.js"></script>     <!-- 2. Logic hiển thị + ngôn ngữ -->
<script src="cart-auth.js"></script>  <!-- 3. Giỏ hàng + auth -->
```
> ⚠️ **Thứ tự quan trọng!** `products.js` phải load trước vì `script.js` dùng biến `productsData`.

---

---

# 🎨 2. FILE: `style.css`

## Tổng quan
File CSS chứa **toàn bộ thiết kế** của website. Được tổ chức thành khu vực rõ ràng bằng comment.

---

## 2.1 CSS Variables (`:root`)

```css
:root {
    --primary-color: #d10000;          /* Màu đỏ Kumpoo chủ đạo */
    --primary-gradient: linear-gradient(135deg, #d10000, #ff4d4d);
    --secondary-color: #1a1a1a;        /* Màu tối dùng cho text tiêu đề */
    --text-color: #333;                /* Màu text thông thường */
    --bg-color: #ffffff;               /* Màu nền */
    --card-bg: rgba(255,255,255,0.9);  /* Nền card sản phẩm */
    --shadow: 0 10px 30px rgba(0,0,0,0.1);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --border-radius: 16px;
}
```
- **CSS Variables** cho phép thay đổi màu sắc chỉ ở một chỗ → áp dụng toàn trang.
- Dark Mode override các biến này bằng class `.dark-mode` trên `<body>`.

---

## 2.2 Header

```css
header {
    position: fixed;         /* Cố định trên cùng */
    backdrop-filter: blur(14px);  /* Hiệu ứng kính mờ (Glassmorphism) */
    background: rgba(5,10,20,0.55); /* Nền trong suốt có màu */
}
```
- **Glassmorphism**: Kết hợp nền trong suốt + `backdrop-filter: blur()` → tạo hiệu ứng kính mờ cao cấp.

---

## 2.3 Filter Bar (Thanh lọc)

```css
.filter-btn { ... }         /* Nút thường */
.filter-btn:hover { ... }   /* Khi rê chuột */
.filter-btn.active { ... }  /* Nút đang được chọn (màu đỏ) */
```

---

## 2.4 Product Grid & Card

```css
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
```
- **`auto-fill` + `minmax`**: Tự động tính số cột phù hợp theo độ rộng màn hình — không cần media query riêng.

```css
.product-card:hover {
    transform: translateY(-10px);  /* Nổi lên khi hover */
    box-shadow: ...;
}
@keyframes cardFadeIn { ... }      /* Hiệu ứng fade-in khi lọc sản phẩm */
```

---

## 2.5 Promo Banner Slider

```css
.promo-slider-track {
    display: flex;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}
.promo-slide { min-width: 100%; }  /* Mỗi slide chiếm đúng 100% chiều rộng */
```
- **Cơ chế**: Các slide xếp ngang. Dịch cả track sang trái/phải bằng `transform: translateX`.

```css
.slide-bg {
    background-size: contain;
    background-position: right center;  /* Ảnh sản phẩm căn phải */
}
```

---

## 2.6 Modal

```css
.modal {
    position: fixed;
    background: rgba(0,0,0,0.9);  /* Overlay tối toàn màn hình */
    backdrop-filter: blur(8px);
}
.modal-content { animation: zoomIn 0.3s ease; } /* Popup "zoom vào" khi mở */
.modal-body {
    display: grid;
    grid-template-columns: 1fr 1fr;  /* Ảnh bên trái, thông tin bên phải */
}
```

---

## 2.7 Cart Sidebar

```css
.cart-sidebar {
    transform: translateX(110%);  /* Ẩn bên phải màn hình */
    transition: transform 0.4s ...;
}
.cart-sidebar.open {
    transform: translateX(0);     /* Trượt vào khi class "open" được thêm */
}
```

---

## 2.8 Auth Modal

```css
.auth-overlay { display: none; }         /* Mặc định ẩn */
.auth-overlay.open { display: flex; }    /* Hiện khi có class "open" */
.auth-box { animation: authSlideIn ...; } /* Animation zoom + slide lên */
```

---

## 2.9 Dark Mode

```css
body.dark-mode {
    background-color: #121212;
    color: #e0e0e0;
}
body.dark-mode .product-card { background: #1e1e1e; }
body.dark-mode .modal-content { background: #1c1c1c; }
/* ... và nhiều element khác */
```
- Khi JavaScript thêm class `dark-mode` vào `<body>` → tất cả các rule này được kích hoạt.
- Ghi đè màu sắc toàn bộ website sang màu tối.

---

## 2.10 Responsive (Media Queries)

```css
/* Tablet */
@media (max-width: 992px) {
    nav { display: none; }           /* Ẩn menu desktop */
    .hamburger-btn { display: flex; } /* Hiện hamburger */
}

/* Mobile */
@media (max-width: 768px) {
    .product-grid { grid-template-columns: repeat(2, 1fr); } /* 2 cột */
    .cart-sidebar { width: 100vw; }  /* Giỏ hàng toàn màn hình */
    .slide-desc { display: none; }   /* Ẩn mô tả slide */
}

/* Small Mobile */
@media (max-width: 480px) {
    .product-image { height: 150px; }
    .header-user-chip { display: none; }
}
```

---

---

# ⚙️ 3. FILE: `script.js`

## Tổng quan
File logic chính của website. Xử lý tất cả tương tác người dùng: **hiển thị sản phẩm, lọc, modal, ngôn ngữ, dark mode, slider**.

---

## 3.1 Dark Mode

```javascript
// Chạy ngay khi script load (IIFE - Immediately Invoked Function Expression)
(function initDarkMode() {
    const saved = localStorage.getItem('kumpooTheme');
    if (saved === 'dark') {
        document.body.classList.add('dark-mode');
    }
})();
```
- **IIFE**: Hàm tự gọi ngay lập tức → khởi tạo dark mode **trước khi trang render** (tránh nháy sáng).
- **`localStorage`**: Lưu trạng thái vào trình duyệt → reload lại vẫn giữ nguyên.

```javascript
window.toggleDarkMode = function () {
    const isDark = document.body.classList.toggle('dark-mode'); // Thêm/xóa class
    localStorage.setItem('kumpooTheme', isDark ? 'dark' : 'light'); // Lưu lại
    const btn = document.getElementById('darkModeBtn');
    if (btn) btn.textContent = isDark ? '☀️' : '🌙'; // Đổi icon
};
```

---

## 3.2 Mobile Navigation

```javascript
window.toggleMobileNav = function () {
    document.getElementById('mobileNav').classList.toggle('open');  // Mở/đóng menu
    document.getElementById('hamburgerBtn').classList.toggle('open'); // Đổi icon ☰ → ✕
};
window.closeMobileNav = function () { /* Đóng menu khi click link */ };
```

---

## 3.3 Hệ Thống Ngôn Ngữ

```javascript
let currentLang = localStorage.getItem('kumpooLang') || 'vi'; // Mặc định tiếng Việt
```

```javascript
function applyLanguage(lang) {
    // 1. Cập nhật biến + lưu vào localStorage
    currentLang = lang;
    localStorage.setItem('kumpooLang', lang);

    // 2. Đổi thuộc tính lang của <html>
    document.documentElement.lang = lang;

    // 3. Đổi nội dung tất cả element có data-vi / data-en
    document.querySelectorAll('[data-vi][data-en]').forEach(el => {
        el.textContent = el.dataset[lang]; // dataset['vi'] hoặc dataset['en']
    });

    // 4. Đổi placeholder của ô nhập liệu
    document.querySelectorAll(`[data-${lang}-placeholder]`).forEach(el => {
        el.placeholder = el.dataset[lang + 'Placeholder'];
    });

    // 5. Đổi icon cờ quốc kỳ
    const flagUrl = lang === 'vi' ? 'https://flagcdn.com/vn.svg' : 'https://flagcdn.com/gb.svg';
    document.getElementById('langFlag').innerHTML = `<img src="${flagUrl}">`;

    // 6. Re-render lại lưới sản phẩm theo ngôn ngữ mới
    window.setFilter?.();
    window._refreshModal?.(); // Cập nhật modal nếu đang mở
}
```

---

## 3.4 Object Dịch Thuật `productTranslations`

Đây là **kho dịch thuật tập trung** — thay vì viết tiếng Anh vào từng sản phẩm trong `products.js`.

```javascript
const productTranslations = {
    names: {
        'kumpoo-power-balanced-11': { en: 'Kumpoo Power Balanced 11 Badminton Racket' },
        // ... tất cả sản phẩm
    },
    categories: {
        'Vợt Cầu Lông': { en: 'Badminton Racket' },
        'Dây Cước Cầu Lông': { en: 'Badminton String' },
        // ...
    },
    descriptions: {
        'kumpoo-power-balanced-11': { en: 'Ideal for beginners...' },
        // ...
    },
    specLabels: {
        'Trọng lượng': 'Weight',
        'Độ cứng': 'Stiffness',
        'Lực căng tối đa': 'Max Tension',
        // ...
    },
    specValues: {
        'Trung bình': 'Medium',
        'Hơi nặng đầu': 'Slightly Head-Heavy',
        // ...
    },
    colors: {
        'Đen': 'Black', 'Trắng': 'White',
        // ...
    }
};
```

- **Khoá (key)** = Tiếng Việt gốc trong `products.js`
- **Giá trị** = Bản dịch tiếng Anh tương ứng

### Hàm dịch giá trị spec:
```javascript
function translateSpecValue(val) {
    if (currentLang === 'vi') return val; // Không dịch nếu đang là tiếng Việt
    let result = val;
    for (const [vi, en] of Object.entries(productTranslations.specValues)) {
        result = result.replace(vi, en); // Thay thế từng từ khoá
    }
    return result;
}
```

---

## 3.5 DOMContentLoaded — Khối code chính

Toàn bộ logic phụ thuộc vào DOM được bọc trong:
```javascript
document.addEventListener('DOMContentLoaded', () => { ... });
```
→ Đảm bảo HTML đã load xong trước khi JavaScript chạy.

---

### Lọc sản phẩm (Filter Bar)

```javascript
filterBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn'); // Tìm nút được bấm
    if (!btn) return;

    // Cập nhật nút active
    filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Lọc và render
    activeCategory = btn.dataset.category;
    const filtered = activeCategory === 'all'
        ? productsData
        : productsData.filter(p => p.category === activeCategory);
    renderProducts(filtered);
});
```
- **Event Delegation**: Một listener dùng cho tất cả nút lọc → hiệu quả hơn gắn listener riêng từng nút.

---

### Hàm `renderProducts(items)`

```javascript
function renderProducts(items) {
    productGrid.innerHTML = items.map(product => {
        const isEn = currentLang === 'en';
        const name = isEn ? (productTranslations.names[product.id]?.en || product.name) : product.name;
        const category = isEn ? (productTranslations.categories[product.category]?.en || product.category) : product.category;
        return `
            <div class="product-card" id="product-${product.id}">
                <img src="${product.images[0]}" onclick="openProductModal('${product.id}')">
                <div class="product-category">${category}</div>
                <a class="product-name" onclick="openProductModal('${product.id}')">${name}</a>
                <div class="product-price-row">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <span class="original-price">${formatPrice(product.original_price)}</span>
                </div>
            </div>
        `;
    }).join('');
}
```
- Dùng `Array.map()` → tạo HTML string cho từng sản phẩm.
- `.join('')` → nối lại thành một chuỗi HTML duy nhất.
- `?.` (Optional Chaining): Tránh lỗi nếu bản dịch chưa có.

---

### Hàm `formatPrice(price)`

```javascript
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}
```
- `Intl.NumberFormat`: API chuẩn của trình duyệt để định dạng tiền tệ (599000 → 599.000₫).

---

### Hàm `displayProductDetails(product, selectedVariantIndex)`

Hàm phức tạp nhất — tạo toàn bộ HTML cho modal chi tiết sản phẩm:

1. **Xây dựng phần chọn màu** (nếu sản phẩm có `variants`):
   ```javascript
   product.variants.map((v, index) => `<div class="color-chip" onclick="changeVariant('${product.id}', ${index})">${colorName}</div>`)
   ```

2. **Xây dựng bảng thông số** (Specs):
   ```javascript
   Object.entries(product.specs).map(([label, value]) => {
       const displayLabel = isEn ? (productTranslations.specLabels[label] || label) : label;
       const displayValue = translateSpecValue(value);
       return `<div class="spec-item">...</div>`;
   })
   ```

3. **Inject vào modal**:
   ```javascript
   modalBody.innerHTML = `[toàn bộ HTML]`;
   ```

4. **Lưu trạng thái** để refresh khi đổi ngôn ngữ:
   ```javascript
   modal._currentProduct = product;
   modal._currentVariantIndex = selectedVariantIndex;
   ```

---

## 3.6 Promo Banner Slider (IIFE)

```javascript
(function initPromoSlider() {
    const TOTAL = 4;
    const AUTO_DELAY = 5000; // 5 giây / slide

    function goTo(index) {
        current = (index + TOTAL) % TOTAL; // Vòng lặp tròn (0→1→2→3→0→...)
        track.style.transform = `translateX(-${current * 100}%)`;
        // Cập nhật dots, progress bar, slide number...
    }

    // Tự động chạy
    function startAuto() { autoTimer = setInterval(next, AUTO_DELAY); }

    // Dừng khi hover, tiếp tục khi rời chuột
    section.addEventListener('mouseenter', stopAuto);
    section.addEventListener('mouseleave', startAuto);

    // Hỗ trợ vuốt (swipe) trên mobile
    section.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
    section.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); }
    });
})();
```

---

---

# 🛒 4. FILE: `cart-auth.js`

## Tổng quan
Xử lý toàn bộ **giỏ hàng** và **hệ thống tài khoản** (đăng nhập, đăng ký, đăng xuất). Lưu trữ bằng `localStorage`.

---

## 4.1 Đa Ngôn Ngữ (i18n)

```javascript
const authI18n = {
    emptyCart: { vi: 'Giỏ hàng trống', en: 'Your cart is empty' },
    loginRequired: { vi: 'Vui lòng đăng nhập...', en: 'Please log in...' },
    // ...
};

function t(key) {
    const lang = currentLang || 'vi';
    return authI18n[key]?.[lang] || authI18n[key]?.vi || '';
}
```
- `t('emptyCart')` → trả về chuỗi đúng ngôn ngữ hiện tại.

---

## 4.2 Storage Helpers (Tiện ích lưu trữ)

```javascript
// Người dùng
function getUsers()  { return JSON.parse(localStorage.getItem('kumpoo_users') || '{}'); }
function saveUsers(u){ localStorage.setItem('kumpoo_users', JSON.stringify(u)); }

// Phiên đăng nhập (lưu username)
function getSession() { return localStorage.getItem('kumpoo_session'); }
function saveSession(u){ localStorage.setItem('kumpoo_session', u); }
function clearSession() { localStorage.removeItem('kumpoo_session'); }

// Giỏ hàng (mỗi user có giỏ riêng)
function getCart(user)    { return JSON.parse(localStorage.getItem(`kumpoo_cart_${user}`) || '[]'); }
function saveCart(user, c){ localStorage.setItem(`kumpoo_cart_${user}`, JSON.stringify(c)); }
```

### Cấu trúc dữ liệu trong localStorage:
| Key | Giá trị | Mô tả |
|---|---|---|
| `kumpoo_users` | `{ "alice": { name: "Alice", password: "123456" } }` | Danh sách tài khoản |
| `kumpoo_session` | `"alice"` | Username đang đăng nhập |
| `kumpoo_cart_alice` | `[{ id, name, price, image, qty }]` | Giỏ hàng của alice |
| `kumpooLang` | `"vi"` hoặc `"en"` | Ngôn ngữ hiện tại |
| `kumpooTheme` | `"dark"` hoặc `"light"` | Chế độ giao diện |

---

## 4.3 Đăng Ký

```javascript
window.submitRegister = function () {
    // 1. Lấy giá trị từ form
    const name = document.getElementById('regName').value.trim();
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value;

    // 2. Kiểm tra hợp lệ
    if (!name || !user || !pass) { errEl.textContent = t('fillAll'); return; }
    if (pass.length < 6) { errEl.textContent = t('passShort'); return; }

    const users = getUsers();
    if (users[user]) { errEl.textContent = t('userExists'); return; } // Username đã tồn tại

    // 3. Lưu tài khoản mới
    users[user] = { name, password: pass };
    saveUsers(users);

    // 4. Tự động đăng nhập sau 0.9 giây
    setTimeout(() => { saveSession(user); refreshAuthUI(); }, 900);
};
```

> ⚠️ **Lưu ý:** Mật khẩu được lưu dưới dạng **plain text** trong localStorage. Đây chỉ phù hợp cho demo/học tập — **không dùng trong thực tế** vì không an toàn.

---

## 4.4 Đăng Nhập

```javascript
window.submitLogin = function () {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const users = getUsers();

    // Kiểm tra username + password
    if (!users[user] || users[user].password !== pass) {
        errEl.textContent = t('wrongCred'); return;
    }

    saveSession(user);    // Lưu phiên đăng nhập
    refreshAuthUI();      // Cập nhật giao diện header
    renderCartSidebar();  // Hiển thị giỏ hàng

    // Thêm sản phẩm pending (nếu người dùng bấm "Thêm vào giỏ" trước khi đăng nhập)
    if (_pendingProduct) { addToCartItem(_pendingProduct); _pendingProduct = null; }
};
```

---

## 4.5 Thêm Vào Giỏ Hàng

```javascript
window.addToCart = function (productId) {
    const product = productsData.find(p => p.id === productId);
    const user = getSession();

    if (!user) {
        _pendingProduct = product;  // Lưu tạm sản phẩm
        openAuthModal('login');     // Yêu cầu đăng nhập
        return;
    }
    addToCartItem(product);
};

function addToCartItem(product) {
    const cart = getCart(user);
    const existing = cart.find(i => i.id === product.id);

    if (existing) {
        existing.qty++;              // Tăng số lượng nếu đã có
    } else {
        cart.push({ id, name, price, image, qty: 1 }); // Thêm mới
    }
    saveCart(user, cart);
    updateCartBadge();    // Cập nhật số đỏ trên icon giỏ hàng
    renderCartSidebar();  // Vẽ lại giỏ hàng
    showToast(t('addedToCart')); // Thông báo nhỏ
}
```

---

## 4.6 Render Giỏ Hàng

```javascript
function renderCartSidebar() {
    const cart = getCart(user);
    let total = 0;

    // Tạo HTML cho từng sản phẩm trong giỏ
    itemsEl.innerHTML = cart.map(item => {
        total += item.price * item.qty;
        return `
            <div class="cart-item">
                <img src="${item.image}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${formatPriceCart(item.price)}</div>
                    <div class="cart-item-qty">
                        <button onclick="changeQty('${item.id}', -1)">−</button>
                        <span>${item.qty}</span>
                        <button onclick="changeQty('${item.id}', 1)">+</button>
                    </div>
                </div>
                <button onclick="removeCartItem('${item.id}')">🗑</button>
            </div>
        `;
    }).join('');

    totalEl.textContent = formatPriceCart(total);
}
```

---

## 4.7 Toast Notification

```javascript
function showToast(msg) {
    // Tạo element toast nếu chưa có
    let toast = document.getElementById('kumpooToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'kumpooToast';
        // CSS inline: cố định ở bottom-center, fade in/out
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = '1';     // Hiện ra
    // Tự ẩn sau 2.2 giây
    toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 2200);
}
```

---

---

# 📦 5. FILE: `products.js`

## Tổng quan
Chứa một mảng JavaScript duy nhất: `productsData` — **kho dữ liệu tất cả sản phẩm**.

---

## 5.1 Cấu Trúc Một Sản Phẩm

```javascript
const productsData = [
    {
        "id": "kumpoo-power-balanced-11",      // ID duy nhất, dùng làm key tìm kiếm
        "name": "Vợt Cầu Lông Kumpoo...",      // Tên tiếng Việt (hiển thị mặc định)
        "slug": "kumpoo-power-balanced-11",    // Giống id (dùng cho URL nếu cần)
        "price": 599000,                        // Giá bán (VND)
        "original_price": 950000,               // Giá gốc (để gạch ngang)
        "category": "Vợt Cầu Lông",            // Danh mục (dùng cho bộ lọc)

        // Danh sách biến thể màu sắc (tuỳ chọn)
        "variants": [
            {
                "color": "Đen",                 // Tên màu tiếng Việt
                "images": ["img/.../.webp"]      // Ảnh của màu này
            },
            { "color": "Trắng", "images": [...] }
        ],

        // Ảnh đại diện (1 ảnh mỗi màu, dùng cho card ngoài trang chủ)
        "images": ["img/.../den.webp", "img/.../trang.webp", ...],

        // Thông số kỹ thuật (key-value, key là tiếng Việt)
        "specs": {
            "Trọng lượng": "82 ± 2g (4U)",
            "Độ cứng": "Trung bình",
            "Điểm cân bằng": "290 ± 5mm",
            "Sức căng dây": "24–28 lbs",
            "Chất liệu": "Carbon Graphite",
            "Chiều dài": "675 mm"
        },

        // Mô tả ngắn tiếng Việt
        "description": "Vợt phù hợp cho người mới..."
    },
    // ... thêm sản phẩm
];
```

---

## 5.2 Các Danh Mục Hiện Có

| Danh Mục (Tiếng Việt) | Tiếng Anh |
|---|---|
| `Vợt Cầu Lông` | Badminton Racket |
| `Bộ Sản Phẩm (Set)` | Product Set |
| `Giày Cầu Lông` | Badminton Shoes |
| `Túi Cầu Lông` | Badminton Bag |
| `Vớ Cầu Lông` | Badminton Socks |
| `Dây Cước Cầu Lông` | Badminton String |
| `Quấn Cán Cầu Lông` | Badminton Grip |

---

---

# 🔄 Luồng Hoạt Động Tổng Thể

```
Người dùng mở index.html
│
├─ products.js load → tạo mảng productsData
├─ script.js load:
│   ├─ Khởi tạo Dark Mode (đọc localStorage)
│   ├─ DOMContentLoaded:
│   │   ├─ renderProducts(productsData) → đổ sản phẩm vào lưới
│   │   └─ applyLanguage(savedLang)    → áp dụng ngôn ngữ đã lưu
│
├─ cart-auth.js load:
│   └─ DOMContentLoaded:
│       ├─ refreshAuthUI()   → kiểm tra session, hiện tên user
│       └─ renderCartSidebar() → hiện giỏ hàng (nếu đã đăng nhập)
│
Người dùng tương tác:
│
├─ Bấm filter → filterProducts() → renderProducts(filtered)
├─ Bấm sản phẩm → openProductModal() → displayProductDetails()
├─ Bấm "Thêm vào giỏ":
│   ├─ Chưa đăng nhập → mở authModal → đăng nhập → addToCartItem()
│   └─ Đã đăng nhập → addToCartItem() → saveCart() → renderCartSidebar()
├─ Bấm 🌙 → toggleDarkMode() → thêm/xóa class dark-mode trên body
├─ Bấm 🇻🇳 → toggleLanguage() → applyLanguage() → rerender sản phẩm
└─ Bấm ☰ → toggleMobileNav() → mở menu mobile
```

---

*Tài liệu được tạo tự động — cập nhật lần cuối: 24/02/2026*
