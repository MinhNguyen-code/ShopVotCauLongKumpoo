/*
========================================================================================
📋 CÂU HỎI TƯ DUY & BẢO VỆ ĐỒ ÁN (DÀNH CHO cart-auth.js)
========================================================================================
Q1: Cấu trúc giỏ hàng được tổ chức như thế nào trong bộ nhớ? Xử lý việc cộng dồn số lượng ra sao?
-> Đáp án: Giỏ hàng là một cấu trúc Mảng (Array) chứa nhiều Đối tượng (Object). Khi user thêm 1 sản phẩm:
   - Hệ thống dùng hàm `Array.find()` check xem ID này kèm biến thể (Size/ Trọng lượng) đã nằm trong giỏ chưa.
   - Nếu có rồi (`existing` != null) -> Chỉ tăng giá trị `qty` (số lượng).
   - Nếu chưa có -> Dùng `Array.push()` nhồi toàn bộ thẻ Object đó làm một dòng hàng hóa mới vào giỏ.

Q2: Làm sao để cô lập giỏ hàng của từng User độc lập thay vì nằm chung một cục trên Website?
-> Đáp án: Giỏ hàng được lưu động (dynamic) theo key có định dạng: `kumpoo_cart_{username}` trên `localStorage`. Hàm `getSession()` sẽ lấy ra ID (tên) của User hiện tại để móc đúng với chìa khóa giỏ hàng thuộc về tài khoản đó. Nhờ vậy, tài khoản A không bao giờ thấy hàng hóa của tài khoản B.

Q3: Tính năng thanh toán và nút Xác nhận chuyển khoản sử dụng `setTimeout` với mục đích gì?
-> Đáp án: Đây là kỹ thuật "Mô phỏng bất đồng bộ" (Async UI/UX). Do web tĩnh không có Backend thực, thao tác trả kết quả quá nhanh sẽ tạo cảm giác 'Fake/Mã nguồn ảo'. Lệnh `setTimeout` bắt giao diện chờ 2 giây mô phỏng thao tác gọi API Sang Cổng Ngân hàng VNPay/Momo đang diễn ra, sau đó Giỏ hàng mới bị làm sạch (Clear array) và báo chuông hoàn thành. Trải nghiệm người dùng được gia tăng 100%.
========================================================================================
*/
const authI18n = {
    emptyCart: { vi: 'Giỏ hàng trống', en: 'Your cart is empty' },
    emptyCartSub: { vi: 'Hãy thêm sản phẩm yêu thích!', en: 'Add your favourite products!' },
    addedToCart: { vi: 'Đã thêm vào giỏ hàng! 🛒', en: 'Added to cart! 🛒' },
    loginRequired: { vi: 'Vui lòng đăng nhập để thêm vào giỏ hàng.', en: 'Please log in to add items to your cart.' },
    userExists: { vi: 'Tên đăng nhập đã tồn tại.', en: 'Username already exists.' },
    fillAll: { vi: 'Vui lòng điền đầy đủ thông tin.', en: 'Please fill in all fields.' },
    passShort: { vi: 'Mật khẩu tối thiểu 6 ký tự.', en: 'Password must be at least 6 characters.' },
    wrongCred: { vi: 'Tên đăng nhập hoặc mật khẩu không đúng.', en: 'Incorrect username or password.' },
    regSuccess: { vi: 'Đăng ký thành công! Đang đăng nhập...', en: 'Account created! Signing you in...' },
    checkoutMsg: { vi: '🎉 Thanh toán thành công!\nShop sẽ liên hệ giao hàng trong 24h.', en: '🎉 Payment successful!\nThe shop will contact you for delivery within 24 hours.' },
    hi: { vi: 'Xin chào,', en: 'Hello,' },
};

// ── Helpers ──────────────────────────────────────────
function t(key) {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'vi';
    return authI18n[key]?.[lang] || authI18n[key]?.vi || '';
}
function formatPriceCart(p) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
}

// ── Storage helpers ───────────────────────────────────
function getUsers() { return JSON.parse(localStorage.getItem('kumpoo_users') || '{}'); }
function saveUsers(u) { localStorage.setItem('kumpoo_users', JSON.stringify(u)); }
function getSession() { return localStorage.getItem('kumpoo_session'); }         // username
function saveSession(u) { localStorage.setItem('kumpoo_session', u); }
function clearSession() { localStorage.removeItem('kumpoo_session'); }
function getCart(user) { return JSON.parse(localStorage.getItem(`kumpoo_cart_${user}`) || '[]'); }
function saveCart(user, c) { localStorage.setItem(`kumpoo_cart_${user}`, JSON.stringify(c)); }

// ── Pending product (added before login) ─────────────
let _pendingProduct = null;

// ── AUTH STATE ────────────────────────────────────────
function refreshAuthUI() {
    const user = getSession();
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
    updateCartBadge();
}

// ── AUTH MODAL ────────────────────────────────────────
function openAuthModal(tab = 'login') {
    const el = document.getElementById('authModal');
    el.classList.add('open');
    document.body.style.overflow = 'hidden';
    switchAuthTab(tab);
    // Apply language to modal inputs
    applyAuthLang();
}

function closeAuthModal(e) {
    if (e && e.target !== document.getElementById('authModal')) return;
    document.getElementById('authModal').classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('loginError').textContent = '';
    document.getElementById('regError').textContent = '';
}

window.closeAuthModal = closeAuthModal;

window.switchAuthTab = function (tab) {
    const isLogin = tab === 'login';
    document.getElementById('formLogin').style.display = isLogin ? 'block' : 'none';
    document.getElementById('formRegister').style.display = isLogin ? 'none' : 'block';
    document.getElementById('tabLogin').classList.toggle('active', isLogin);
    document.getElementById('tabRegister').classList.toggle('active', !isLogin);
};

function applyAuthLang() {
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'vi';
    // Update placeholder for inputs and textareas in all modals
    document.querySelectorAll('#authModal input, #checkoutModal input, #profileModal input, #contactModal input, #contactModal textarea').forEach(inp => {
        const ph = inp.dataset[lang + 'Placeholder'];
        if (ph) inp.placeholder = ph;
    });
    // Update data-vi/en text nodes
    document.querySelectorAll('#authModal [data-vi][data-en], #checkoutModal [data-vi][data-en], #profileModal [data-vi][data-en], #contactModal [data-vi][data-en]').forEach(el => {
        el.textContent = el.dataset[lang];
    });
}

// ── LOGIN ─────────────────────────────────────────────
window.submitLogin = function () {
    const user = document.getElementById('loginUser').value.trim();
    const pass = document.getElementById('loginPass').value;
    const errEl = document.getElementById('loginError');

    if (!user || !pass) { errEl.textContent = t('fillAll'); return; }

    const users = getUsers();
    if (!users[user] || users[user].password !== pass) {
        errEl.textContent = t('wrongCred'); return;
    }

    saveSession(user);
    document.getElementById('authModal').classList.remove('open');
    document.body.style.overflow = '';
    refreshAuthUI();
    renderCartSidebar();

    // Add pending product if any
    if (_pendingProduct) {
        addToCartItem(_pendingProduct);
        _pendingProduct = null;
    }
};

// ── REGISTER ──────────────────────────────────────────
window.submitRegister = function () {
    const name = document.getElementById('regName').value.trim();
    const user = document.getElementById('regUser').value.trim();
    const pass = document.getElementById('regPass').value;
    const errEl = document.getElementById('regError');

    if (!name || !user || !pass) { errEl.textContent = t('fillAll'); return; }
    if (pass.length < 6) { errEl.textContent = t('passShort'); return; }

    const users = getUsers();
    if (users[user]) { errEl.textContent = t('userExists'); return; }

    users[user] = { name, password: pass };
    saveUsers(users);
    errEl.style.color = '#090';
    errEl.textContent = t('regSuccess');

    setTimeout(() => {
        saveSession(user);
        document.getElementById('authModal').classList.remove('open');
        document.body.style.overflow = '';
        errEl.style.color = '#e00';
        errEl.textContent = '';
        refreshAuthUI();
        renderCartSidebar();
        if (_pendingProduct) {
            addToCartItem(_pendingProduct);
            _pendingProduct = null;
        }
    }, 900);
};

// ── LOGOUT ────────────────────────────────────────────
window.logoutUser = function () {
    clearSession();
    refreshAuthUI();
    renderCartSidebar();
};

// ── CART FUNCTIONS ────────────────────────────────────
function updateCartBadge() {
    const user = getSession();
    const count = user ? getCart(user).reduce((s, i) => s + i.qty, 0) : 0;
    const badge = document.getElementById('cartBadge');
    if (badge) badge.textContent = count;
}

// Called from modal "Add to cart" button
window.addToCart = function (productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    // Lấy thông số Size/Trọng lượng nếu đang ở trên Modal
    const modalEl = document.getElementById('productModal');
    let spec = "";
    if (modalEl && modalEl.style.display === "block" && window.selectedItemSpec) {
        spec = window.selectedItemSpec; 
    } else {
        // Fallback măc định khi add nhanh từ Wishlist
        if (product.category === "Giày Cầu Lông") spec = "40";
        if (product.category === "Vợt Cầu Lông" || product.category === "Bộ Sản Phẩm (Set)") spec = "4U";
    }

    const user = getSession();
    if (!user) {
        product._tempSpec = spec;
        _pendingProduct = product;
        openAuthModal('login');
        return;
    }
    addToCartItem(product, spec);
};

function addToCartItem(product, spec) {
    const user = getSession();
    if (!user || !product) return;

    if (spec === undefined && product._tempSpec) spec = product._tempSpec;

    const cart = getCart(user);
    const cartItemId = spec ? `${product.id}-${spec}` : product.id;
    const existing = cart.find(i => i.id === cartItemId);
    
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id: cartItemId, originalId: product.id, name: product.name, price: product.price, image: product.images[0], qty: 1, spec: spec });
    }
    saveCart(user, cart);
    updateCartBadge();
    renderCartSidebar();

    // Brief toast feedback
    showToast(t('addedToCart'));
}

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
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(-50%) translateY(20px)';
    }, 2200);
}

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

window.updateCartItemSpec = function (cartItemId, newSpec) {
    const user = getSession();
    if (!user) return;
    const cart = getCart(user);
    const itemIndex = cart.findIndex(i => i.id === cartItemId);
    if (itemIndex === -1) return;
    
    const item = cart[itemIndex];
    if (item.spec === newSpec) return; // Không thay đổi
    
    // Check xem giỏ hàng đã có cái spec mới này chưa
    const originalId = item.originalId || item.id.split('-')[0];
    const newCartItemId = `${originalId}-${newSpec}`;
    const existingIndex = cart.findIndex(i => i.id === newCartItemId && i !== item);
    
    if (existingIndex !== -1) {
        // Cộng dồn vào thằng đã có, xóa item cũ đi
        cart[existingIndex].qty += item.qty;
        cart.splice(itemIndex, 1);
    } else {
        // Đổi thẳng thuộc tính của item này
        item.spec = newSpec;
        item.id = newCartItemId;
    }
    
    saveCart(user, cart);
    updateCartBadge();
    renderCartSidebar();
};

window.removeCartItem = function (productId) {
    const user = getSession();
    if (!user) return;
    const cart = getCart(user).filter(i => i.id !== productId);
    saveCart(user, cart);
    updateCartBadge();
    renderCartSidebar();
};

// ── CART SIDEBAR ──────────────────────────────────────
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

function renderCartSidebar() {
    const user = getSession();
    const itemsEl = document.getElementById('cartItems');
    const totalEl = document.getElementById('cartTotal');
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'vi';
    if (!itemsEl) return;

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
        
        // Lookup dịch tên sản phẩm với id nguyên bản
        const originalId = item.originalId || item.id;
        const baseName = lang === 'en' ? (productTranslations.names[originalId]?.en || item.name) : item.name;
        
        // Render thẻ <select> cho người dùng đổi size/trọng lượng ngay trong giỏ hàng
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

// ── CHECKOUT ──────────────────────────────────────────
window.checkoutAlert = function () {
    const user = getSession();
    if (!user) { openAuthModal('login'); return; }
    const cart = getCart(user);
    if (cart.length === 0) return;
    
    // Lấy tổng tiền
    let total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalEl = document.getElementById('checkoutTotalDisplay');
    if(totalEl) totalEl.textContent = formatPriceCart(total);
    
    const statusEl = document.getElementById('checkoutStatus');
    if(statusEl) statusEl.textContent = '';
    
    // Mở Modal Checkout
    const modal = document.getElementById('checkoutModal');
    if(modal) {
        modal.classList.add('open');
        // Vẫn giữ hidden nếu đang bật cart sidebar
    }
    
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'vi';
    document.querySelectorAll('#checkoutModal [data-vi][data-en]').forEach(el => {
        el.textContent = el.dataset[lang];
    });
};

window.closeCheckoutModal = function (e) {
    if (e && e.target !== document.getElementById('checkoutModal')) return;
    const modal = document.getElementById('checkoutModal');
    if(modal) modal.classList.remove('open');
};

window.checkPaymentStatus = function () {
    const statusEl = document.getElementById('checkoutStatus');
    const btn = document.getElementById('confirmPaymentBtn');
    const phoneInput = document.getElementById('checkoutPhone').value.trim();
    const addressInput = document.getElementById('checkoutAddress').value.trim();
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'vi';
    
    // Validate inputs
    if (!phoneInput || !addressInput) {
        if(statusEl) {
            statusEl.style.color = '#ff6b6b';
            statusEl.textContent = lang === 'en' ? 'Please enter your phone number and delivery address.' : 'Vui lòng nhập số điện thoại và địa chỉ nhận hàng.';
        }
        return;
    }
    
    if(statusEl) {
        statusEl.style.color = '#fff';
        statusEl.textContent = lang === 'en' ? 'Checking payment transaction, please wait...' : 'Đang kiểm tra giao dịch, vui lòng đợi...';
    }
    
    if(btn) {
        btn.disabled = true;
        btn.style.opacity = '0.5';
    }

    // Giả lập độ trễ kiểm tra hệ thống ngân hàng (2 giây)
    setTimeout(() => {
        if(statusEl) {
            statusEl.style.color = '#00ff88';
            statusEl.textContent = lang === 'en' ? 'Payment successful! Processing...' : 'Thanh toán thành công! Đang xử lý...';
        }
        
        setTimeout(() => {
            // Xóa sản phẩm khỏi giỏ hàng
            const user = getSession();
            if (user) {
                saveCart(user, []);
                updateCartBadge();
                renderCartSidebar();
            }
            
            // Tắt các modal
            closeCheckoutModal(null);
            closeCart();
            
            // Thông báo hiển thị "Shop sẽ liên hệ trong 24h"
            alert(t('checkoutMsg'));
            
            // Chờ người dùng bấm OK thì mới tiếp tục
            if(btn) {
                btn.disabled = false;
                btn.style.opacity = '1';
            }
        }, 1500);
    }, 2000);
};

// ── Hook into language switcher ───────────────────────
// Patch applyLanguage to refresh auth/cart UI on lang change
const _origApplyLang = typeof applyLanguage === 'function' ? applyLanguage : null;
// We hook at DOMContentLoaded since applyLanguage is defined in script.js
document.addEventListener('DOMContentLoaded', () => {
    // Patch toggleLanguage to also refresh auth UI
    const _origToggle = window.toggleLanguage;
    window.toggleLanguage = function () {
        _origToggle && _origToggle();
        refreshAuthUI();
        applyAuthLang();
        renderCartSidebar();
        // Update cart sidebar static labels
        document.querySelectorAll('#cartSidebar [data-vi][data-en]').forEach(el => {
            const lang = (typeof currentLang !== 'undefined') ? currentLang : 'vi';
            el.textContent = el.dataset[lang];
        });
    };

    // Init
    refreshAuthUI();
    renderCartSidebar();
});

// ── PROFILE MODAL ──────────────────────────────────────
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

// ── CONTACT MODAL ──────────────────────────────────────
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
    const fName = document.getElementById('contactModalFName').value.trim();
    const lName = document.getElementById('contactModalLName').value.trim();
    const contact = document.getElementById('contactModalContact').value.trim();
    const msg = document.getElementById('contactModalMsg').value.trim();
    const lang = (typeof currentLang !== 'undefined') ? currentLang : 'vi';
    
    if (!fName || !lName || !contact || !msg) {
        showToast(lang === 'en' ? 'Please fill in all contact fields.' : 'Vui lòng điền đủ thông tin liên hệ.');
        return;
    }
    showToast(lang === 'en' ? 'Your message has been sent successfully!' : 'Lời nhắn đã được gửi thành công!');
    closeContactModal(null);
    document.getElementById('contactModalFName').value = '';
    document.getElementById('contactModalLName').value = '';
    document.getElementById('contactModalContact').value = '';
    document.getElementById('contactModalMsg').value = '';
};
