<div align="center">

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Badminton.png" width="80" alt="Badminton" />

# Kumpoo Badminton Shop 🏸

### Website Thương Mại Điện Tử Vợt Cầu Lông Kumpoo

<p>
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/LocalStorage-4CAF50?style=for-the-badge&logo=databricks&logoColor=white" />
</p>

<p>
  <img src="https://img.shields.io/badge/Status-Complete-brightgreen?style=flat-square" />
  <img src="https://img.shields.io/badge/Language-Vi%20%7C%20En-blue?style=flat-square" />
  <img src="https://img.shields.io/badge/Dark%20Mode-Supported-9b59b6?style=flat-square" />
  <img src="https://img.shields.io/badge/Responsive-Yes-orange?style=flat-square" />
</p>

> **Dự án môn học** — Website bán hàng trực tuyến cho thương hiệu vợt cầu lông **Kumpoo** (Nhật Bản), được xây dựng thuần bằng HTML, CSS và JavaScript Vanilla, không dùng framework hay thư viện ngoài.

</div>

---

## 📋 Mục Lục

- [Giới Thiệu](#-giới-thiệu)
- [Tính Năng Nổi Bật](#-tính-năng-nổi-bật)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Hướng Dẫn Sử Dụng](#-hướng-dẫn-sử-dụng)
- [Chi Tiết Kỹ Thuật](#-chi-tiết-kỹ-thuật)
- [Tác Giả](#-tác-giả)

---

## 🎯 Giới Thiệu

**Kumpoo Badminton Shop** là website thương mại điện tử mô phỏng hoàn chỉnh cho thương hiệu vợt cầu lông Kumpoo — thương hiệu nổi tiếng đến từ Nhật Bản với khẩu hiệu *"Focus on Quality"*.

Dự án được xây dựng như một **Single-Page Application (SPA)** với đầy đủ các trang và tính năng thông qua hệ thống modal pop-up hiện đại, không cần reload trang. Toàn bộ dữ liệu được lưu trữ client-side thông qua `localStorage`.

---

## ✨ Tính Năng Nổi Bật

### 🛍️ Mua Sắm
| Tính năng | Mô tả |
|-----------|-------|
| **Danh mục sản phẩm** | Lọc theo 7 loại: Vợt, Bộ Sản Phẩm, Giày, Túi/Balo, Vớ, Dây Cước, Quấn Cán |
| **Modal chi tiết sản phẩm** | Xem ảnh, chọn biến thể (Size/Trọng lượng), thêm vào giỏ |
| **Tìm kiếm thời gian thực** | Gõ tên sản phẩm → kết quả hiện ngay, không cần nhấn Enter |
| **Banner slider tự động** | 4 slide quảng cáo với hiệu ứng chuyển cảnh mượt mà |

### 🔐 Xác Thực Người Dùng (`auth.js`)
| Tính năng | Mô tả |
|-----------|-------|
| **Đăng ký** | Validate 3 lớp: kiểm tra trống, mật khẩu ≥ 6 ký tự, tên chưa tồn tại |
| **Đăng nhập** | Validate: kiểm tra trống + so khớp thông tin đăng nhập |
| **Đăng xuất** | Xóa session, reset badge giỏ hàng & wishlist |
| **Phiên đăng nhập** | Lưu bằng `localStorage`, tự phục hồi khi tải lại trang |

### 🛒 Giỏ Hàng (`cart.js`)
| Tính năng | Mô tả |
|-----------|-------|
| **Giỏ hàng theo User** | Key `kumpoo_cart_{username}` — mỗi tài khoản có giỏ riêng |
| **Đổi biến thể trong giỏ** | Chọn Size/Trọng lượng ngay trong sidebar không cần mở lại modal |
| **Thanh toán có Validate** | Bắt buộc nhập Số điện thoại & Địa chỉ trước khi xác nhận |
| **Giả lập cổng ngân hàng** | `setTimeout` 2 giây mô phỏng gọi API thanh toán |

### ❤️ Danh Sách Yêu Thích (`wishlist.js`)
| Tính năng | Mô tả |
|-----------|-------|
| **Wishlist theo User** | Key `kumpooWishlist_{username}` — độc lập theo từng tài khoản |
| **Toggle yêu thích** | Bấm tim 1 lần = thêm, bấm lại = bỏ thích |
| **Thêm nhanh vào giỏ** | Nút "Thêm vào giỏ" ngay trong sidebar Wishlist |

### 🌐 Trải Nghiệm Người Dùng
| Tính năng | Mô tả |
|-----------|-------|
| **Song ngữ** | Chuyển đổi Tiếng Việt ↔ English hoàn toàn, kể cả placeholder |
| **Dark Mode** | Toggle sáng/tối, lưu trạng thái vào `localStorage` |
| **Responsive** | Giao diện thích ứng Desktop, Tablet, Mobile |
| **Chatbot AI** | Trợ lý ảo tư vấn sản phẩm cầu lông tích hợp sẵn |
| **Review slider** | Thanh đánh giá khách hàng với điều hướng dot & mũi tên |

---

## 📂 Cấu Trúc Dự Án

```
ShopVotCauLongKumpoo/
│
├── index.html              # Trang chính — chứa toàn bộ HTML & modal
├── products.json           # Dữ liệu sản phẩm (28 sản phẩm)
├── test_plan.md            # Kế hoạch kiểm thử chức năng
├── README.md               # Tài liệu dự án
│
└── assets/
    ├── css/
    │   └── style.css       # Toàn bộ stylesheet (Dark mode, responsive)
    │
    ├── js/
    │   ├── auth.js         # Đăng nhập / Đăng ký / Đăng xuất + Validate form
    │   ├── cart.js         # Giỏ hàng + Thanh toán
    │   ├── wishlist.js     # Danh sách yêu thích (per-user)
    │   ├── products.js     # Render sản phẩm, lọc danh mục, tìm kiếm
    │   ├── script.js       # UI tổng: slider, dark mode, ngôn ngữ, review
    │   └── chatbot.js      # Logic chatbot tư vấn
    │
    └── img/                # Ảnh sản phẩm & banner
```

### Thứ tự load JavaScript trong `index.html`

```html
<script src="assets/js/products.js"></script>   <!-- 1. Dữ liệu sản phẩm -->
<script src="assets/js/wishlist.js"></script>    <!-- 2. Wishlist -->
<script src="assets/js/script.js"></script>      <!-- 3. UI & ngôn ngữ -->
<script src="assets/js/auth.js"></script>        <!-- 4. Xác thực (PHẢI trước cart) -->
<script src="assets/js/cart.js"></script>        <!-- 5. Giỏ hàng -->
<script src="assets/js/chatbot.js"></script>     <!-- 6. Chatbot -->
```

---

## 🚀 Hướng Dẫn Sử Dụng

### Chạy dự án

```bash
# Clone về máy
git clone https://github.com/MinhNguyen-code/ShopVotCauLongKumpoo.git

# Mở bằng Live Server (VS Code Extension) hoặc
# Mở trực tiếp file index.html trong trình duyệt
```

> ⚠️ **Lưu ý:** Vì dự án tải ảnh sản phẩm từ đường dẫn local, nên nên dùng **Live Server** thay vì mở file trực tiếp để tránh lỗi CORS.

### Luồng sử dụng cơ bản

```
Mở trang → Đăng ký tài khoản → Đăng nhập
    → Duyệt sản phẩm → Thêm vào Giỏ hàng / Yêu thích
    → Mở Giỏ hàng → Đặt hàng → Nhập SĐT & Địa chỉ → Xác nhận
```

---

## 🔧 Chi Tiết Kỹ Thuật

### Validate Form (JavaScript)

**File `auth.js`** — Form Đăng Nhập:
```javascript
if (!user || !pass) {
    errEl.textContent = t('fillAll');
    return; // Dừng — không cho đăng nhập khi thiếu thông tin
}
```

**File `auth.js`** — Form Đăng Ký (3 lớp validate):
```javascript
if (!name || !user || !pass)  { errEl.textContent = t('fillAll');   return; }
if (pass.length < 6)          { errEl.textContent = t('passShort'); return; }
if (users[user])              { errEl.textContent = t('userExists');return; }
```

### Lưu Trữ Dữ Liệu (localStorage)

| Key | Nội dung |
|-----|----------|
| `kumpoo_users` | Object chứa tất cả tài khoản đã đăng ký |
| `kumpoo_session` | Username đang đăng nhập |
| `kumpoo_cart_{username}` | Giỏ hàng riêng của từng user |
| `kumpooWishlist_{username}` | Wishlist riêng của từng user |
| `kumpoo_dark` | Trạng thái Dark/Light mode |
| `kumpoo_lang` | Ngôn ngữ hiện tại (vi/en) |

### Kiến Trúc Song Ngữ

Toàn bộ văn bản trên giao diện được đặt trong `data-vi` và `data-en` attributes:
```html
<span data-vi="Trang Chủ" data-en="Home">Trang Chủ</span>
```
Hàm `applyLanguage()` trong `script.js` quét tất cả các phần tử và cập nhật text đồng loạt.

---

## 👨‍💻 Tác Giả

<div align="center">

**MinhNguyen-code**

[![GitHub](https://img.shields.io/badge/GitHub-MinhNguyen--code-181717?style=for-the-badge&logo=github)](https://github.com/MinhNguyen-code)

*Dự án được xây dựng phục vụ mục đích học tập — Web Development Assignment*

<br/>

<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Badminton.png" width="40" />
<img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Smiling%20Face%20with%20Sunglasses.png" width="40" />

*"Focus on Quality" — Kumpoo*

</div>
