# Tài Liệu Giải Thích Kiến Trúc Và Tính Năng Code
**Dự án:** Shop Vợt Cầu Lông Kumpoo

Tài liệu này giải thích chi tiết toàn bộ các tính năng đã được lập trình trong trang web, cấu trúc file, và luồng hoạt động của mã nguồn (HTML, CSS, JavaScript). Để giúp bạn dễ hình dung, các đoạn code minh họa cho từng tính năng cũng đã được đánh dấu rõ ràng.

---

## 1. Cấu Trúc Thư Mục
Dự án được sắp xếp theo chuẩn một trang web tĩnh cơ bản (HTML/CSS/JS):
- `index.html`: File giao diện chính chứa toàn bộ cấu trúc xương sống của trang web (Header, Banner, Product Grid, Blog, Footer, Modals).
- `assets/css/style.css`: Chứa toàn bộ các đoạn mã định dạng giao diện, hiệu ứng chuyển động, responsive cho thiết bị di động, và các biến CSS (CSS variables) hỗ trợ tính năng Dark Mode.
- `assets/js/`: Chứa các script xử lý logic của trang web, được chia nhỏ thành các module riêng biệt để dễ quản lý:
  - `products.js`: Dữ liệu (Database) tĩnh của sản phẩm.
  - `script.js`: Logic giao diện chính (slider, tìm kiếm, lọc, đa ngôn ngữ, dark mode).
  - `cart-auth.js`: Logic đăng nhập, đăng ký và quản lý giỏ hàng.
  - `wishlist.js`: Logic quản lý danh sách yêu thích.
  - `chatbot.js`: Logic hoạt động của trợ lý ảo.

---

## 2. Chi Tiết Các Tính Năng Code (JavaScript)

### 2.1. Đa Ngôn Ngữ (Multi-language System) - `script.js`
- **Hoạt động:** Trang web hỗ trợ hai ngôn ngữ (Việt / Anh). Trạng thái ngôn ngữ hiện tại được lưu vào `localStorage` với key `kumpooLang`.
- **Logic / Code minh họa:** Hàm `applyLanguage()` quét giao diện, cập nhật các thẻ HTML có thuộc tính `data-vi` và `data-en`.

```javascript
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("kumpooLang", lang); // Lưu thiết lập người dùng

  // Cập nhật thuộc tính ngôn ngữ của trang
  document.documentElement.lang = lang;

  // Quét giao diện, lấy data-[lang] đè lên text hiển thị của thẻ
  document.querySelectorAll("[data-vi][data-en]").forEach((el) => {
    if (el !== titleEl) el.textContent = el.dataset[lang];
  });

  // Re-render lại danh mục sản phẩm để dịch sang ngôn ngữ mới
  if (typeof window.setFilter === "function") window.setFilter();
}
```

### 2.2. Chế Độ Tối (Dark Mode) - `script.js`
- **Hoạt động:** Trạng thái nền tối hay sáng được lưu vào `localStorage` (`kumpooTheme`).
- **Logic / Code minh họa:** Thêm hoặc xóa class `.dark-mode` vào thẻ `<body>`. Màu sắc tự động thay đổi dựa trên biến CSS.

```javascript
window.toggleDarkMode = function () {
  // Bật/tắt class CSS điều khiển giao diện
  const isDark = document.body.classList.toggle("dark-mode");
  
  // Lưu vào trình duyệt để giữ trạng thái
  localStorage.setItem("kumpooTheme", isDark ? "dark" : "light");
  
  // Đổi nút bấm hiển thị icon tương ứng (trăng/sao)
  const btn = document.getElementById("darkModeBtn");
  if (btn) btn.textContent = isDark ? "☀️" : "🌙";
};
```

### 2.3. Quản Lý Sản Phẩm, Tìm Kiếm & Lọc - `script.js` & `products.js`
- **Dữ liệu (`products.js`):** `productsData` là một mảng tĩnh chứa các đối tượng sản phẩm.
- **Tìm kiếm (`handleSearch`):** Gõ chữ vào ô tìm kiếm thì JS sẽ lọc trong tên và danh mục.

```javascript
function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) return window.setFilter(); // Lấy lại mảng gốc nếu rỗng

  const filtered = productsData.filter((product) => {
    // Biến đổi tên và danh mục về chuỗi thường (cả tên gốc và tên dịch)
    const nameVi = product.name.toLowerCase();
    const nameEn = (productTranslations.names[product.id]?.en || "").toLowerCase();
    
    // Trả về true (giữ lại sản phẩm) nếu từ khóa xuất hiện trong chuỗi
    return nameVi.includes(query) || nameEn.includes(query);
  });
  
  renderProducts(filtered); // Vẽ lại lưới sản phẩm lên HTML
}
```

### 2.4. Đăng Nhập & Đăng Ký (Authentication) - `cart-auth.js`
- **Hoạt động:** Mockup database qua Object lưu trữ vào thẻ `localStorage` (key: `kumpoo_users`).
- **Logic / Code minh họa:** Hàm check thông tin để cấp session đăng nhập `kumpoo_session`.

```javascript
window.submitLogin = function () {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    
    // Parse danh sách người dùng đã đăng ký (từ localStorage)
    const users = getUsers(); 
    
    // Bắt lỗi nếu ko có tài khoản này hoặc sai mật khẩu
    if (!users[user] || users[user].password !== pass) {
        document.getElementById('loginError').textContent = 'Mật khẩu sai'; 
        return;
    }

    // Đăng nhập thành công, lưu session lại
    saveSession(user);
    closeAuthModal(); // Đóng pop-up
    refreshAuthUI();  // Cập nhật nút Đăng Xuất/Đăng Nhập trên thanh header
};
```

### 2.5. Quản Lý Giỏ Hàng (Cart) - `cart-auth.js`
- **Hoạt động:** Mỗi user sẽ có một giỏ hàng riêng tư (`kumpoo_cart_{username}`).
- **Logic / Code minh họa:** Hàm `.find()` giúp kiểm tra xem món đồ bấm nút "Thêm" đã có trong giỏ chưa.

```javascript
function addToCartItem(product) {
    const user = getSession(); 
    if (!user || !product) return; // Nếu khách chưa đăng nhập -> bỏ chặn không cho mua

    const cart = getCart(user); // Lấy Array chứa giỏ hàng hiện tại
    const existing = cart.find(i => i.id === product.id);
    
    if (existing) {
        existing.qty++; // Sản phẩm đã bị trùng, chỉ tăng con số lượng
    } else {
        // Chưa có thì dồn toàn bộ Object hàng mới vào Array giỏ hàng
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.images[0], qty: 1 });
    }
    
    saveCart(user, cart); // Encode chuỗi JSON lưu đè vào Local Storage
    updateCartBadge();   // Cộng số phía trên hình giỏ hàng
}
```

### 2.6. Danh Sách Yêu Thích (Wishlist) - `wishlist.js`
- **Hoạt động:** Nơi lưu ID sản phẩm yêu thích (Tym đỏ), lưu trữ bằng mảng vào `kumpooWishlist`.
- **Logic / Code minh họa:** Kiểm tra trùng để thêm hoặc xóa khỏi mảng.

```javascript
function toggleWishlist(e, productId) {
    if (e) e.stopPropagation(); // Ngăn sự click trố nổi lên
    
    const index = wishlistItems.indexOf(productId);
    if (index > -1) {
        wishlistItems.splice(index, 1); // Đã tym rồi -> Bấm lại sẽ xóa tym (xóa khỏi mảng)
    } else {
        wishlistItems.push(productId);  // Chưa tym -> Thêm vào List
    }
    
    // Đồng bộ vào localStorage
    localStorage.setItem('kumpooWishlist', JSON.stringify(wishlistItems));
    
    // Đồng bộ màu tim Đỏ/Trắng chớp nhoáng trên CSS
    document.querySelectorAll(`.wishlist-icon-${productId}`).forEach(icon => {
        if (index > -1) icon.classList.remove('active');
        else icon.classList.add('active');
    });
}
```

### 2.7. Slider Chuyển Động (Promo Banner & Reviews) - `script.js`
- **Hoạt động:** Dùng `transform: translateX` để dịch chuyển khối frame lớn theo % thay cho việc tải lại.
- **Logic / Code minh họa:** Cơ chế Auto Play sử dụng `setInterval`.

```javascript
function goTo(index) {
  // % tổng số Slide. Ví dụ Current bằng 1 thì dịch chuyển sang mốc -100%
  current = (index + TOTAL) % TOTAL; 
  track.style.transform = `translateX(-${current * 100}%)`;
  resetProgress(); // Chạy lại animation thanh bar
}

function startAuto() {
  stopAuto();
  // Treo Interval tự kéo hàm next() sau mỗi độ trễ 5000ms (5s)
  autoTimer = setInterval(next, 5000); 
}
```

### 2.8. Trợ Lý Ảo Chatbot - `chatbot.js`
- **Hoạt động:** Chatbot quét chuỗi người gõ, khớp từ khóa (keyword) với mảng tĩnh `botResponses` rồi phun ra kết quả (có độ trễ giả mạo người đang gõ).
- **Logic / Code minh họa:**

```javascript
function getBotResponse(text) {
    const currentLang = localStorage.getItem('kumpooLang') || 'vi';
    const lowerText = text.toLowerCase(); // In thường hóa tất cả text
    const kpData = botResponses[currentLang]; // Trích đúng ngôn ngữ hệ thống
    
    // Quét vòng lặp toàn bộ kho knowledge của Kumpoo Bot
    for (let item of kpData.keywords) {
        for (let key of item.keys) {
            // Nếu phát hiện keyword như "giày", "vợt", "k520" nằm trong văn bản trò chuyện
            if (lowerText.includes(key)) {
                return item.response; // Bot sẽ phản hồi câu tư vấn cụ thể
            }
        }
    }
    
    // Trả lời mặc định nếu không hiểu người dùng nói gì
    return kpData.default; 
}
```

---

## 3. Tổng Kết Kiến Trúc CSS & HTML
- Giao diện được xây dựng sử dụng các **thẻ Semantic HTML5** kết hợp với **CSS Flexbox và Grid** để dàn trang.
- Bố cục responsive đảm bảo trang hiển thị đẹp mắt trên các thiết bị từ điện thoại đến Desktop. Thanh Navigation bar thu gọn lại thành Hamburger menu dành cho mobile.
- Các modal (cửa sổ pop-up kiểu Giỏ hàng, Wishlist, Đăng nhập, Xem ảnh) dùng hiệu ứng **Overlay (màn hình tối màu)** cùng thuộc tính `z-index` lớn để hiển thị đè lên nội dung website mà không cần tải qua trang mới (Single Page Interface look). Dùng JS điều chỉnh CSS `style.display` hoặc gỡ bỏ các sub-class (ví dụ: `.open`) để ẩn hiện nhịp nhàng.
