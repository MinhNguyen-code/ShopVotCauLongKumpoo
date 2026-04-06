/*
========================================================================================
📋 cart.js — Giỏ Hàng & Thanh Toán
========================================================================================
File này chịu trách nhiệm toàn bộ chức năng Giỏ hàng:
  - Hiển thị sidebar giỏ hàng với danh sách sản phẩm
  - Thêm sản phẩm vào giỏ (kèm biến thể Size / Trọng lượng)
  - Thay đổi số lượng (+/-) và xóa sản phẩm
  - Đổi biến thể (Size/Trọng lượng) ngay bên trong giỏ hàng
  - Thanh toán: Validate số điện thoại & địa chỉ, giả lập API ngân hàng

LƯU Ý: File này phụ thuộc vào auth.js.
  → Cần load auth.js TRƯỚC file này trong index.html.
  → Các hàm getSession(), getCart(), saveCart(), t(), formatPriceCart(),
    _pendingProduct, openAuthModal() đều được định nghĩa trong auth.js.
========================================================================================

Q1: Cấu trúc giỏ hàng được tổ chức như thế nào trong bộ nhớ?
→ Giỏ hàng là một Mảng (Array) chứa nhiều Đối tượng (Object). Khi user thêm 1 sản phẩm:
   - Hệ thống dùng Array.find() check xem ID + biến thể đã nằm trong giỏ chưa.
   - Nếu có rồi → Chỉ tăng giá trị qty (số lượng).
   - Nếu chưa → Dùng Array.push() thêm Object mới vào mảng.

Q2: Làm sao để cô lập giỏ hàng của từng User?
→ Giỏ hàng được lưu theo key động: `kumpoo_cart_{username}` trên localStorage.
   getSession() lấy tên user hiện tại để truy xuất đúng giỏ hàng của họ.

Q3: setTimeout trong thanh toán dùng để làm gì?
→ Giả lập bất đồng bộ (Async UI/UX). Web tĩnh không có Backend, việc trả kết quả
   tức thì sẽ trông giả tạo. setTimeout 2 giây mô phỏng việc gọi API cổng ngân hàng.
========================================================================================
*/

// ─────────────────────────────────────────────────────────────────────────────
// CART BADGE — Cập nhật số lượng hiển thị trên nút giỏ hàng ở Header
// ─────────────────────────────────────────────────────────────────────────────
function updateCartBadge() {
    const user  = getSession();
    const count = user ? getCart(user).reduce((s, i) => s + i.qty, 0) : 0;
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = count;
}

// ─────────────────────────────────────────────────────────────────────────────
// THÊM VÀO GIỎ HÀNG — Được gọi từ nút "Thêm vào giỏ" trong modal sản phẩm
// ─────────────────────────────────────────────────────────────────────────────
window.addToCart = function (productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    // Lấy thông số Size/Trọng lượng khi đang ở Product Modal
    const modalEl = document.getElementById('productModal');
    let spec = "";
    if (modalEl && modalEl.style.display === "block" && window.selectedItemSpec) {
        spec = window.selectedItemSpec;
    } else {
        // Fallback mặc định khi add nhanh từ Wishlist
        if (product.category === "Giày Cầu Lông")                                          spec = "40";
        if (product.category === "Vợt Cầu Lông" || product.category === "Bộ Sản Phẩm (Set)") spec = "4U";
    }

    const user = getSession();
    if (!user) {
        // Chưa đăng nhập → lưu sản phẩm vào hàng đợi và hiện modal đăng nhập
        product._tempSpec  = spec;
        _pendingProduct    = product;
        openAuthModal('login');
        return;
    }
    addToCartItem(product, spec);
};

function addToCartItem(product, spec) {
    const user = getSession();
    if (!user || !product) return;

    if (spec === undefined && product._tempSpec) spec = product._tempSpec;

    const cart       = getCart(user);
    const cartItemId = spec ? `${product.id}-${spec}` : product.id;
    const existing   = cart.find(i => i.id === cartItemId);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            id:         cartItemId,
            originalId: product.id,
            name:       product.name,
            price:      product.price,
            image:      product.images[0],
            qty:        1,
            spec:       spec
        });
    }
    saveCart(user, cart);
    updateCartBadge();
    renderCartSidebar();
    showToast(t('addedToCart'));
}

// ─────────────────────────────────────────────────────────────────────────────
// TOAST NOTIFICATION
// ─────────────────────────────────────────────────────────────────────────────
function showToast(msg) {
    let toast = document.getElementById('kumpooToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'kumpooToast';
        toast.style.cssText = `
            position:fixed; bottom:30px; left:50%; transform:translateX(-50%) translateY(20px);
            background:#222; color:#fff; padding:12px 24px; border-radius:50px;
            font-size:0.9rem; font-weight:600; z-index:9999; opacity:0;
            transition:all 0.3s ease; white-space:nowrap; pointer-events:none;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity   = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.style.opacity   = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2200);
}

// ─────────────────────────────────────────────────────────────────────────────
// THAY ĐỔI SỐ LƯỢNG (+/-)
// ─────────────────────────────────────────────────────────────────────────────
window.changeQty = function (productId, delta) {
    const user = getSession();
    if (!user) return;
    const cart = getCart(user);
    const item = cart.find(i => i.id === productId);
    if (!item) return;
    item.qty = Math.max(0, item.qty + delta);
    if (item.qty === 0) cart.splice(cart.indexOf(item), 1);
    saveCart(user, cart);
    updateCartBadge();
    renderCartSidebar();
};

// ─────────────────────────────────────────────────────────────────────────────
// ĐỔI BIẾN THỂ (Size / Trọng lượng) NGAY TRONG GIỎ HÀNG
// ─────────────────────────────────────────────────────────────────────────────
window.updateCartItemSpec = function (cartItemId, newSpec) {
    const user = getSession();
    if (!user) return;
    const cart      = getCart(user);
    const itemIndex = cart.findIndex(i => i.id === cartItemId);
    if (itemIndex === -1) return;

    const item = cart[itemIndex];
    if (item.spec === newSpec) return;   // Không thay đổi gì

    // Kiểm tra xem biến thể mới đã có trong giỏ chưa
    const originalId   = item.originalId || item.id.split('-')[0];
    const newCartItemId = `${originalId}-${newSpec}`;
    const existingIndex = cart.findIndex(i => i.id === newCartItemId && i !== item);

    if (existingIndex !== -1) {
        // Cộng dồn vào item đã có, xóa item cũ
        cart[existingIndex].qty += item.qty;
        cart.splice(itemIndex, 1);
    } else {
        // Đổi thẳng biến thể của item này
        item.spec = newSpec;
        item.id   = newCartItemId;
    }

    saveCart(user, cart);
    updateCartBadge();
    renderCartSidebar();
};

// ─────────────────────────────────────────────────────────────────────────────
// XÓA SẢN PHẨM KHỎI GIỎ
// ─────────────────────────────────────────────────────────────────────────────
window.removeCartItem = function (productId) {
    const user = getSession();
    if (!user) return;
    const cart = getCart(user).filter(i => i.id !== productId);
    saveCart(user, cart);
    updateCartBadge();
    renderCartSidebar();
};

// ─────────────────────────────────────────────────────────────────────────────
// CART SIDEBAR — Mở / đóng
// ─────────────────────────────────────────────────────────────────────────────
window.openCart = function () {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCartSidebar();
};

window.closeCart = function () {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
    document.body.style.overflow = '';
};

// ─────────────────────────────────────────────────────────────────────────────
// RENDER GIỎ HÀNG — Hiển thị danh sách sản phẩm trong Sidebar
// ─────────────────────────────────────────────────────────────────────────────
function renderCartSidebar() {
    const user    = getSession();
    const itemsEl = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    const lang    = (typeof currentLang !== 'undefined') ? currentLang : 'vi';
    if (!itemsEl) return;

    // Chưa đăng nhập
    if (!user) {
        itemsEl.innerHTML = `<div class="cart-empty">
            <span>🛒</span>
            <p>${lang === 'en' ? 'Please log in to view your cart.' : 'Vui lòng đăng nhập để xem giỏ hàng.'}</p>
            <button onclick="openAuthModal('login')" style="margin-top:14px; padding:10px 24px; background:var(--primary-color); color:#fff; border:none; border-radius:10px; cursor:pointer; font-weight:700; font-size:0.9rem;">${lang === 'en' ? 'Login' : 'Đăng Nhập'}</button>
        </div>`;
        if (totalEl) totalEl.textContent = '0₫';
        return;
    }

    const cart = getCart(user);
    if (cart.length === 0) {
        itemsEl.innerHTML = `<div class="cart-empty">
            <span>🛒</span>
            <p>${t('emptyCart')}</p>
            <small>${t('emptyCartSub')}</small>
        </div>`;
        if (totalEl) totalEl.textContent = '0₫';
        return;
    }

    let total = 0;
    itemsEl.innerHTML = cart.map(item => {
        total += item.price * item.qty;

        // Dịch tên sản phẩm sang tiếng Anh nếu cần
        const originalId = item.originalId || item.id;
        const baseName   = lang === 'en'
            ? (productTranslations.names[originalId]?.en || item.name)
            : item.name;

        // Render <select> để đổi Size/Trọng lượng ngay trong giỏ hàng
        const p = productsData.find(prod => prod.id === originalId);
        let selectHtml = "";
        if (p) {
            if (p.category === "Giày Cầu Lông") {
                const sizes = ["37", "38", "39", "40", "41", "42", "43", "44"];
                selectHtml = `<select class="cart-spec-select" onchange="updateCartItemSpec('${item.id}', this.value)" style="margin-top: 4px; padding: 2px 4px; border-radius: 4px; border: 1px solid #ccc; font-size: 0.8rem; outline: none; background: transparent; cursor: pointer;">
                    ${sizes.map(s => `<option value="${s}" ${item.spec === s ? 'selected' : ''}>Size ${s}</option>`).join('')}
                </select>`;
            } else if (p.category === "Vợt Cầu Lông" || p.category === "Bộ Sản Phẩm (Set)") {
                const weights = ["3U", "4U", "5U"];
                selectHtml = `<select class="cart-spec-select" onchange="updateCartItemSpec('${item.id}', this.value)" style="margin-top: 4px; padding: 2px 4px; border-radius: 4px; border: 1px solid #ccc; font-size: 0.8rem; outline: none; background: transparent; cursor: pointer;">
                    ${weights.map(w => `<option value="${w}" ${item.spec === w ? 'selected' : ''}>${w}</option>`).join('')}
                </select>`;
            }
        }

        return `
        <div class="cart-item">
            <img src="${item.image}" alt="${baseName}">
            <div class="cart-item-info">
                <div class="cart-item-name" title="${baseName}">${baseName}</div>
                ${selectHtml}
                <div class="cart-item-price" style="margin-top: 5px;">${formatPriceCart(item.price)}</div>
                <div class="cart-item-qty">
                    <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
                    <span class="qty-num">${item.qty}</span>
                    <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeCartItem('${item.id}')" title="${lang === 'en' ? 'Remove' : 'Xóa'}">🗑</button>
        </div>`;
    }).join('');

    if (totalEl) totalEl.textContent = formatPriceCart(total);
}

// ─────────────────────────────────────────────────────────────────────────────
// CHECKOUT — Mở modal & xác nhận thanh toán
// ─────────────────────────────────────────────────────────────────────────────
window.checkoutAlert = function () {
    const user = getSession();
    if (!user) { openAuthModal('login'); return; }
    const cart = getCart(user);
    if (cart.length === 0) return;

    let total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalEl = document.getElementById('checkoutTotalDisplay');
    if (totalEl) totalEl.textContent = formatPriceCart(total);

    const statusEl = document.getElementById('checkoutStatus');
    if (statusEl) statusEl.textContent = '';

    const modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.add('open');

    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'vi';
    document.querySelectorAll('#checkoutModal [data-vi][data-en]').forEach(el => {
        el.textContent = el.dataset[lang];
    });
};

window.closeCheckoutModal = function (e) {
    if (e && e.target !== document.getElementById('checkoutModal')) return;
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.remove('open');
};

/**
 * checkPaymentStatus()
 *
 * Validate trước khi xác nhận thanh toán:
 *   1. Kiểm tra ô Số điện thoại không được để trống.
 *   2. Kiểm tra ô Địa chỉ nhận hàng không được để trống.
 *   → Nếu có ô trống: hiển thị thông báo lỗi màu đỏ và dừng (return).
 *   → Nếu hợp lệ: mô phỏng gọi API ngân hàng (setTimeout 2 giây), sau đó xóa giỏ hàng.
 */
window.checkPaymentStatus = function () {
    const statusEl     = document.getElementById('checkoutStatus');
    const btn          = document.getElementById('confirmPaymentBtn');
    const phoneInput   = document.getElementById('checkoutPhone').value.trim();
    const addressInput = document.getElementById('checkoutAddress').value.trim();
    const lang         = (typeof currentLang !== 'undefined') ? currentLang : 'vi';

    // --- Validate: Kiểm tra số điện thoại và địa chỉ không được để trống ---
    if (!phoneInput || !addressInput) {
        if (statusEl) {
            statusEl.style.color = '#ff6b6b';
            statusEl.textContent = lang === 'en'
                ? 'Please enter your phone number and delivery address.'
                : 'Vui lòng nhập số điện thoại và địa chỉ nhận hàng.';
        }
        return;   // Dừng — không cho thanh toán khi thiếu thông tin
    }

    // --- Bắt đầu xử lý thanh toán ---
    if (statusEl) {
        statusEl.style.color = '#fff';
        statusEl.textContent = lang === 'en'
            ? 'Checking payment transaction, please wait...'
            : 'Đang kiểm tra giao dịch, vui lòng đợi...';
    }
    if (btn) {
        btn.disabled      = true;
        btn.style.opacity = '0.5';
    }

    // Giả lập độ trễ kiểm tra hệ thống ngân hàng (2 giây)
    setTimeout(() => {
        if (statusEl) {
            statusEl.style.color = '#00ff88';
            statusEl.textContent = lang === 'en'
                ? 'Payment successful! Processing...'
                : 'Thanh toán thành công! Đang xử lý...';
        }

        setTimeout(() => {
            // Xóa toàn bộ sản phẩm khỏi giỏ hàng
            const user = getSession();
            if (user) {
                saveCart(user, []);
                updateCartBadge();
                renderCartSidebar();
            }

            // Đóng các modal
            closeCheckoutModal(null);
            closeCart();

            // Thông báo thành công
            alert(t('checkoutMsg'));

            if (btn) {
                btn.disabled      = false;
                btn.style.opacity = '1';
            }
        }, 1500);
    }, 2000);
};

// ─────────────────────────────────────────────────────────────────────────────
// KHỞI TẠO — Chạy sau khi DOM sẵn sàng
// ─────────────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Patch toggleLanguage để cập nhật cả giỏ hàng & auth UI khi đổi ngôn ngữ
    const _origToggle = window.toggleLanguage;
    window.toggleLanguage = function () {
        _origToggle && _origToggle();
        refreshAuthUI();
        applyAuthLang();
        renderCartSidebar();
        // Cập nhật nhãn tĩnh trong cart sidebar
        document.querySelectorAll('#cartSidebar [data-vi][data-en]').forEach(el => {
            const lang = (typeof currentLang !== 'undefined') ? currentLang : 'vi';
            el.textContent = el.dataset[lang];
        });
    };

    // Khởi tạo lần đầu
    refreshAuthUI();
    renderCartSidebar();
});
