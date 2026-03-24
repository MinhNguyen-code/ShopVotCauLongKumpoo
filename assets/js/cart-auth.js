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
    checkoutMsg: { vi: '🎉 Cảm ơn bạn đã đặt hàng!\nChúng tôi sẽ liên hệ xác nhận sớm nhất.', en: '🎉 Thank you for your order!\nWe will contact you to confirm shortly.' },
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
    // Update placeholder for inputs in auth modal
    document.querySelectorAll('#authModal input').forEach(inp => {
        const ph = inp.dataset[lang + 'Placeholder'];
        if (ph) inp.placeholder = ph;
    });
    // Update data-vi/en text nodes
    document.querySelectorAll('#authModal [data-vi][data-en]').forEach(el => {
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

    const user = getSession();
    if (!user) {
        _pendingProduct = product;
        openAuthModal('login');
        return;
    }
    addToCartItem(product);
};

function addToCartItem(product) {
    const user = getSession();
    if (!user || !product) return;

    const cart = getCart(user);
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, image: product.images[0], qty: 1 });
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
        return `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-name" title="${item.name}">${item.name}</div>
                <div class="cart-item-price">${formatPriceCart(item.price)}</div>
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
    alert(t('checkoutMsg'));
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
