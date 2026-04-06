/*
========================================================================================
📋 auth.js — Xác Thực Người Dùng (Login / Register / Logout)
========================================================================================
File này chịu trách nhiệm toàn bộ chức năng xác thực tài khoản:
  - Quản lý phiên đăng nhập (Session) qua localStorage
  - Validate form Đăng Nhập: kiểm tra ô trống và sai mật khẩu
  - Validate form Đăng Ký: kiểm tra ô trống, mật khẩu quá ngắn, tên đã tồn tại
  - Hiển thị / ẩn khu vực header sau khi đăng nhập
  - Quản lý modal Profile và modal Contact

File này được load TRƯỚC cart.js vì cart.js sử dụng các hàm
getSession(), getCart(), getUsers() được định nghĩa ở đây.
========================================================================================
*/

// ─────────────────────────────────────────────────────────────────────────────
// i18n — Chuỗi dịch cho cả Auth lẫn Cart (dùng chung)
// ─────────────────────────────────────────────────────────────────────────────
const authI18n = {
    emptyCart:    { vi: 'Giỏ hàng trống',                                  en: 'Your cart is empty' },
    emptyCartSub: { vi: 'Hãy thêm sản phẩm yêu thích!',                   en: 'Add your favourite products!' },
    addedToCart:  { vi: 'Đã thêm vào giỏ hàng! 🛒',                       en: 'Added to cart! 🛒' },
    loginRequired:{ vi: 'Vui lòng đăng nhập để thêm vào giỏ hàng.',       en: 'Please log in to add items to your cart.' },
    userExists:   { vi: 'Tên đăng nhập đã tồn tại.',                      en: 'Username already exists.' },
    fillAll:      { vi: 'Vui lòng điền đầy đủ thông tin.',                en: 'Please fill in all fields.' },
    passShort:    { vi: 'Mật khẩu tối thiểu 6 ký tự.',                    en: 'Password must be at least 6 characters.' },
    wrongCred:    { vi: 'Tên đăng nhập hoặc mật khẩu không đúng.',        en: 'Incorrect username or password.' },
    regSuccess:   { vi: 'Đăng ký thành công! Đang đăng nhập...',          en: 'Account created! Signing you in...' },
    checkoutMsg:  { vi: '🎉 Thanh toán thành công!\nShop sẽ liên hệ giao hàng trong 24h.', en: '🎉 Payment successful!\nThe shop will contact you for delivery within 24 hours.' },
    hi:           { vi: 'Xin chào,',                                       en: 'Hello,' },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers dùng chung
// ─────────────────────────────────────────────────────────────────────────────

/** Dịch chuỗi theo ngôn ngữ hiện tại */
function t(key) {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'vi';
    return authI18n[key]?.[lang] || authI18n[key]?.vi || '';
}

/** Định dạng giá tiền VNĐ */
function formatPriceCart(p) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
}

// ─────────────────────────────────────────────────────────────────────────────
// localStorage helpers — Dùng chung bởi auth.js và cart.js
// ─────────────────────────────────────────────────────────────────────────────
function getUsers()        { return JSON.parse(localStorage.getItem('kumpoo_users') || '{}'); }
function saveUsers(u)      { localStorage.setItem('kumpoo_users', JSON.stringify(u)); }
function getSession()      { return localStorage.getItem('kumpoo_session'); }      // trả về username
function saveSession(u)    { localStorage.setItem('kumpoo_session', u); }
function clearSession()    { localStorage.removeItem('kumpoo_session'); }
function getCart(user)     { return JSON.parse(localStorage.getItem(`kumpoo_cart_${user}`) || '[]'); }
function saveCart(user, c) { localStorage.setItem(`kumpoo_cart_${user}`, JSON.stringify(c)); }

// ─────────────────────────────────────────────────────────────────────────────
// Pending product — sản phẩm được thêm trước khi đăng nhập
// ─────────────────────────────────────────────────────────────────────────────
let _pendingProduct = null;

// ─────────────────────────────────────────────────────────────────────────────
// AUTH STATE — Cập nhật giao diện Header sau đăng nhập / đăng xuất
// ─────────────────────────────────────────────────────────────────────────────
function refreshAuthUI() {
    const user     = getSession();
    const authZone = document.getElementById('authZone');
    const headerUser = document.getElementById('headerUsername');
    if (user) {
        authZone.style.display = 'flex';
        const users = getUsers();
        const displayName = users[user]?.name || user;
        headerUser.textContent = displayName;
    } else {
        authZone.style.display = 'none';
    }
    updateCartBadge();   // được định nghĩa trong cart.js
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH MODAL — Mở / đóng / chuyển tab
// ─────────────────────────────────────────────────────────────────────────────
function openAuthModal(tab = 'login') {
    const el = document.getElementById('authModal');
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
    switchAuthTab(tab);
    applyAuthLang();
}

function closeAuthModal(e) {
    if (e && e.target !== document.getElementById('authModal')) return;
    document.getElementById('authModal').classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('loginError').textContent = '';
    document.getElementById('regError').textContent   = '';
}

window.closeAuthModal = closeAuthModal;

window.switchAuthTab = function (tab) {
    const isLogin = tab === 'login';
    document.getElementById('formLogin').style.display    = isLogin ? 'block' : 'none';
    document.getElementById('formRegister').style.display = isLogin ? 'none'  : 'block';
    document.getElementById('tabLogin').classList.toggle('active',  isLogin);
    document.getElementById('tabRegister').classList.toggle('active', !isLogin);
};

function applyAuthLang() {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'vi';
    // Cập nhật placeholder cho tất cả input bên trong các modal
    document.querySelectorAll('#authModal input, #checkoutModal input, #profileModal input, #contactModal input, #contactModal textarea').forEach(inp => {
        const ph = inp.dataset[lang + 'Placeholder'];
        if (ph) inp.placeholder = ph;
    });
    // Cập nhật text theo ngôn ngữ
    document.querySelectorAll('#authModal [data-vi][data-en], #checkoutModal [data-vi][data-en], #profileModal [data-vi][data-en], #contactModal [data-vi][data-en]').forEach(el => {
        el.textContent = el.dataset[lang];
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// ĐĂNG NHẬP — Validate + xử lý đăng nhập
// ─────────────────────────────────────────────────────────────────────────────
/**
 * submitLogin()
 *
 * Validate form đăng nhập:
 *   1. Kiểm tra ô Tên đăng nhập và Mật khẩu không được để trống.
 *      → Nếu trống: hiển thị thông báo lỗi và dừng lại (return).
 *   2. So sánh thông tin với dữ liệu đã lưu trong localStorage.
 *      → Nếu sai: hiển thị "Tên đăng nhập hoặc mật khẩu không đúng" và dừng.
 *   3. Nếu hợp lệ: lưu phiên đăng nhập, đóng modal, làm mới giao diện.
 */
window.submitLogin = function () {
    const user  = document.getElementById('loginUser').value.trim();
    const pass  = document.getElementById('loginPass').value;
    const errEl = document.getElementById('loginError');

    // --- Validate: Kiểm tra trường bỏ trống ---
    if (!user || !pass) {
        errEl.textContent = t('fillAll');
        return;   // Dừng — không cho đăng nhập khi thiếu thông tin
    }

    // --- Validate: Kiểm tra thông tin đăng nhập có đúng không ---
    const users = getUsers();
    if (!users[user] || users[user].password !== pass) {
        errEl.textContent = t('wrongCred');
        return;   // Dừng — sai tên hoặc mật khẩu
    }

    // --- Đăng nhập thành công ---
    saveSession(user);
    document.getElementById('authModal').classList.remove('open');
    document.body.style.overflow = '';
    refreshAuthUI();
    renderCartSidebar();
    // Tải wishlist của user này
    if (typeof updateWishlistBadge === 'function') updateWishlistBadge();

    // Thêm sản phẩm đang chờ (nếu có)
    if (_pendingProduct) {
        addToCartItem(_pendingProduct);
        _pendingProduct = null;
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// ĐĂNG KÝ — Validate + xử lý tạo tài khoản
// ─────────────────────────────────────────────────────────────────────────────
/**
 * submitRegister()
 *
 * Validate form đăng ký (3 lớp kiểm tra):
 *   1. Kiểm tra các ô Họ tên, Tên đăng nhập, Mật khẩu không được để trống.
 *      → Nếu có ô trống: hiển thị lỗi và dừng (return).
 *   2. Kiểm tra mật khẩu phải có ít nhất 6 ký tự.
 *      → Nếu quá ngắn: hiển thị lỗi và dừng (return).
 *   3. Kiểm tra tên đăng nhập chưa được dùng.
 *      → Nếu đã tồn tại: hiển thị lỗi và dừng (return).
 *   4. Nếu hợp lệ: lưu tài khoản, tự động đăng nhập sau 900ms.
 */
window.submitRegister = function () {
    const name  = document.getElementById('regName').value.trim();
    const user  = document.getElementById('regUser').value.trim();
    const pass  = document.getElementById('regPass').value;
    const errEl = document.getElementById('regError');

    // --- Validate 1: Kiểm tra trường bỏ trống ---
    if (!name || !user || !pass) {
        errEl.textContent = t('fillAll');
        return;   // Dừng — không cho đăng ký khi thiếu thông tin
    }

    // --- Validate 2: Kiểm tra độ dài mật khẩu ---
    if (pass.length < 6) {
        errEl.textContent = t('passShort');
        return;   // Dừng — mật khẩu quá ngắn
    }

    // --- Validate 3: Kiểm tra tên đăng nhập đã tồn tại chưa ---
    const users = getUsers();
    if (users[user]) {
        errEl.textContent = t('userExists');
        return;   // Dừng — tên đăng nhập đã có người dùng
    }

    // --- Đăng ký thành công — lưu user vào localStorage ---
    users[user] = { name, password: pass };
    saveUsers(users);
    errEl.style.color   = '#090';
    errEl.textContent   = t('regSuccess');

    // Tự động đăng nhập sau 900ms (mô phỏng UX mượt mà)
    setTimeout(() => {
        saveSession(user);
        document.getElementById('authModal').classList.remove('open');
        document.body.style.overflow = '';
        errEl.style.color   = '#e00';
        errEl.textContent   = '';
        refreshAuthUI();
        renderCartSidebar();
        // Tải wishlist của user mới đăng ký
        if (typeof updateWishlistBadge === 'function') updateWishlistBadge();
        if (_pendingProduct) {
            addToCartItem(_pendingProduct);
            _pendingProduct = null;
        }
    }, 900);
};

// ─────────────────────────────────────────────────────────────────────────────
// ĐĂNG XUẤT
// ─────────────────────────────────────────────────────────────────────────────
window.logoutUser = function () {
    clearSession();
    refreshAuthUI();
    renderCartSidebar();
    // Reset wishlist badge về 0 vì wishlist thuộc về từng user
    if (typeof updateWishlistBadge === 'function') updateWishlistBadge();
};

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE MODAL
// ─────────────────────────────────────────────────────────────────────────────
window.openProfileModal = function () {
    const user = getSession();
    if (!user) {
        openAuthModal('login');
        return;
    }
    const profileModal = document.getElementById('profileModal');
    if (profileModal) {
        document.getElementById('profileUsername').textContent = user;
        profileModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
};

window.closeProfileModal = function (e) {
    if (e && e.target !== document.getElementById('profileModal')) return;
    const profileModal = document.getElementById('profileModal');
    if (profileModal) {
        profileModal.classList.remove('open');
        document.body.style.overflow = '';
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT MODAL
// ─────────────────────────────────────────────────────────────────────────────
window.openContactModal = function () {
    const contactModal = document.getElementById('contactModal');
    if (contactModal) {
        contactModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
};

window.closeContactModal = function (e) {
    if (e && e.target !== document.getElementById('contactModal')) return;
    const contactModal = document.getElementById('contactModal');
    if (contactModal) {
        contactModal.classList.remove('open');
        document.body.style.overflow = '';
    }
};

window.submitContactModalForm = function () {
    const fName   = document.getElementById('contactModalFName').value.trim();
    const lName   = document.getElementById('contactModalLName').value.trim();
    const contact = document.getElementById('contactModalContact').value.trim();
    const msg     = document.getElementById('contactModalMsg').value.trim();
    const lang    = (typeof currentLang !== 'undefined') ? currentLang : 'vi';

    // --- Validate: Kiểm tra tất cả ô liên hệ không được để trống ---
    if (!fName || !lName || !contact || !msg) {
        showToast(lang === 'en' ? 'Please fill in all contact fields.' : 'Vui lòng điền đủ thông tin liên hệ.');
        return;
    }
    showToast(lang === 'en' ? 'Your message has been sent successfully!' : 'Lời nhắn đã được gửi thành công!');
    closeContactModal(null);
    document.getElementById('contactModalFName').value    = '';
    document.getElementById('contactModalLName').value    = '';
    document.getElementById('contactModalContact').value  = '';
    document.getElementById('contactModalMsg').value      = '';
};
