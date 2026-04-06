/*
========================================================================================
📋 wishlist.js — Danh Sách Yêu Thích (Wishlist)
========================================================================================
Q1: Wishlist có bị trùng lặp sản phẩm nếu bấm tim 2 lần không?
→ Không. toggleWishlist() dùng logic "Toggle":
   - array.indexOf(productId) > -1  → đã có → splice() xóa bỏ (Bỏ thích)
   - array.indexOf(productId) = -1  → chưa có → push() thêm vào (Thích)

Q2: Wishlist có bị chia sẻ giữa các tài khoản không?
→ Không. Wishlist lưu theo key động `kumpooWishlist_{username}`, giống cách
   Giỏ hàng dùng `kumpoo_cart_{username}`. Mỗi tài khoản có danh sách riêng.
   Khi chưa đăng nhập, wishlist luôn rỗng và ẩn badge.
========================================================================================
*/

// ─────────────────────────────────────────────────────────────────────────────
// Storage helpers — Lưu/đọc wishlist theo từng user
// ─────────────────────────────────────────────────────────────────────────────
function getWishlist() {
    const user = (typeof getSession === 'function') ? getSession() : null;
    if (!user) return [];
    return JSON.parse(localStorage.getItem(`kumpooWishlist_${user}`) || '[]');
}

function saveWishlist(items) {
    const user = (typeof getSession === 'function') ? getSession() : null;
    if (!user) return;
    localStorage.setItem(`kumpooWishlist_${user}`, JSON.stringify(items));
}

// ─────────────────────────────────────────────────────────────────────────────
// Badge — Cập nhật số lượng hiển thị trên nút ❤️
// ─────────────────────────────────────────────────────────────────────────────
function updateWishlistBadge() {
    const badge = document.getElementById('wishlistBadge');
    if (!badge) return;
    const items = getWishlist();
    badge.textContent  = items.length;
    badge.style.display = items.length > 0 ? 'flex' : 'none';
}

// ─────────────────────────────────────────────────────────────────────────────
// Toggle Yêu Thích — Thêm / Xóa sản phẩm khỏi wishlist
// ─────────────────────────────────────────────────────────────────────────────
function toggleWishlist(e, productId) {
    if (e) e.stopPropagation();

    // Nếu chưa đăng nhập → mở modal đăng nhập
    const user = (typeof getSession === 'function') ? getSession() : null;
    if (!user) {
        if (typeof openAuthModal === 'function') openAuthModal('login');
        return;
    }

    const items = getWishlist();
    const index = items.indexOf(productId);

    if (index > -1) {
        items.splice(index, 1);   // Đã thích → Bỏ thích
    } else {
        items.push(productId);    // Chưa thích → Thêm vào
    }

    saveWishlist(items);
    updateWishlistBadge();

    // Cập nhật icon tim trên lưới sản phẩm và modal
    document.querySelectorAll(`.wishlist-icon-${productId}`).forEach(icon => {
        if (index > -1) {
            icon.classList.remove('active');
        } else {
            icon.classList.add('active');
        }
    });

    // Re-render sidebar nếu đang mở
    const sidebar = document.getElementById('wishlistSidebar');
    if (sidebar && sidebar.classList.contains('open')) {
        renderWishlistSidebar();
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Mở / Đóng Wishlist Sidebar
// ─────────────────────────────────────────────────────────────────────────────
function openWishlist() {
    renderWishlistSidebar();
    document.getElementById('wishlistOverlay').classList.add('open');
    document.getElementById('wishlistSidebar').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeWishlist() {
    document.getElementById('wishlistOverlay').classList.remove('open');
    document.getElementById('wishlistSidebar').classList.remove('open');
    document.body.style.overflow = 'auto';
}

// ─────────────────────────────────────────────────────────────────────────────
// Định dạng giá tiền
// ─────────────────────────────────────────────────────────────────────────────
function formatPriceGlobal(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

// ─────────────────────────────────────────────────────────────────────────────
// Render Wishlist Sidebar
// ─────────────────────────────────────────────────────────────────────────────
function renderWishlistSidebar() {
    const container = document.getElementById('wishlistItemsContainer');
    if (!container) return;

    const user  = (typeof getSession === 'function') ? getSession() : null;
    const lang  = (typeof currentLang !== 'undefined') ? currentLang : 'vi';

    // Chưa đăng nhập
    if (!user) {
        container.innerHTML = `
            <div class="cart-empty">
                <span>🤍</span>
                <p>${lang === 'en' ? 'Please log in to use your wishlist.' : 'Vui lòng đăng nhập để dùng danh sách yêu thích.'}</p>
                <button onclick="openAuthModal('login'); closeWishlist();"
                    style="margin-top:14px; padding:10px 24px; background:var(--primary-color); color:#fff; border:none; border-radius:10px; cursor:pointer; font-weight:700; font-size:0.9rem;">
                    ${lang === 'en' ? 'Login' : 'Đăng Nhập'}
                </button>
            </div>`;
        return;
    }

    const items = getWishlist();

    // Wishlist trống
    if (items.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <span>🤍</span>
                <p>${lang === 'en' ? 'Your wishlist is empty.' : 'Danh sách yêu thích trống.'}</p>
            </div>`;
        return;
    }

    let html = '';
    items.forEach(id => {
        const p = productsData.find(prod => prod.id === id);
        if (!p) return;

        const isEn = (lang === 'en');
        const name = isEn ? (productTranslations.names[id]?.en || p.name) : p.name;

        html += `
            <div class="cart-item">
                <img src="${p.images[0]}" alt="${name}" onclick="openProductModal('${id}'); closeWishlist();" style="cursor:pointer;">
                <div class="cart-item-info">
                    <div class="cart-item-name" style="cursor:pointer;" onclick="openProductModal('${id}'); closeWishlist();">${name}</div>
                    <div class="cart-item-price">${formatPriceGlobal(p.price)}</div>
                    <button class="btn-primary" style="padding: 6px 14px; font-size: 0.8rem; border-radius: 6px; margin-top: 8px;"
                            onclick="addToCart('${id}'); closeWishlist();"
                            data-vi="Thêm giỏ hàng" data-en="Add to Cart">
                        ${isEn ? 'Add to Cart' : 'Thêm giỏ hàng'}
                    </button>
                </div>
                <button class="cart-item-remove" onclick="toggleWishlist(null, '${id}')">🗑</button>
            </div>`;
    });

    container.innerHTML = html;
}

// ─────────────────────────────────────────────────────────────────────────────
// Khởi tạo khi DOM sẵn sàng
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    updateWishlistBadge();
});
