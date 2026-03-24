// wishlist.js

// Initialize wishlist from Local Storage
let wishlistItems = JSON.parse(localStorage.getItem('kumpooWishlist') || '[]');

function updateWishlistBadge() {
    const badge = document.getElementById('wishlistBadge');
    if (badge) {
        badge.textContent = wishlistItems.length;
        badge.style.display = wishlistItems.length > 0 ? 'flex' : 'none';
    }
}

function toggleWishlist(e, productId) {
    if (e) e.stopPropagation();
    
    const index = wishlistItems.indexOf(productId);
    if (index > -1) {
        wishlistItems.splice(index, 1);
    } else {
        wishlistItems.push(productId);
    }
    
    // Save state
    localStorage.setItem('kumpooWishlist', JSON.stringify(wishlistItems));
    updateWishlistBadge();
    
    // Visually toggle heart icons on product grid and modals
    document.querySelectorAll(`.wishlist-icon-${productId}`).forEach(icon => {
        if (index > -1) {
            icon.classList.remove('active'); // It was in list, now removed
        } else {
            icon.classList.add('active'); // It wasn't in list, now added
        }
    });
    
    // Rerender sidebar if open to reflect immediate changes
    if (document.getElementById('wishlistSidebar') && document.getElementById('wishlistSidebar').classList.contains('open')) {
        renderWishlistSidebar();
    }
}

function openWishlist() {
    renderWishlistSidebar();
    document.getElementById('wishlistOverlay').classList.add('open');
    document.getElementById('wishlistSidebar').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeWishlist() {
    document.getElementById('wishlistOverlay').classList.remove('open');
    document.getElementById('wishlistSidebar').classList.remove('open');
    document.body.style.overflow = 'auto'; // Will not conflict with Cart overlay behavior assuming only one is open
}

function formatPriceGlobal(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

function renderWishlistSidebar() {
    const container = document.getElementById('wishlistItemsContainer');
    if (!container) return;

    if (wishlistItems.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <span>🤍</span>
                <p data-vi="Danh sách yêu thích trống." data-en="Your wishlist is empty.">Danh sách yêu thích trống.</p>
            </div>
        `;
        if (typeof applyLanguage === 'function' && typeof currentLang !== 'undefined') {
            applyLanguage(currentLang);
        }
        return;
    }
    
    let html = '';
    // Assuming productsData is a global array defined in products.js
    wishlistItems.forEach(id => {
        const p = productsData.find(prod => prod.id === id); 
        if (!p) return;
        
        const isEn = (typeof currentLang !== 'undefined' && currentLang === 'en');
        const name = isEn ? (productTranslations.names[id]?.en || p.name) : p.name;

        html += `
            <div class="cart-item">
                <img src="${p.images[0]}" alt="${name}" onclick="openProductModal('${id}'); closeWishlist();" style="cursor:pointer;">
                <div class="cart-item-info">
                    <div class="cart-item-name" style="cursor:pointer;" onclick="openProductModal('${id}'); closeWishlist();">${name}</div>
                    <div class="cart-item-price">${formatPriceGlobal(p.price)}</div>
                    <button class="btn-primary" style="padding: 6px 14px; font-size: 0.8rem; border-radius: 6px; margin-top: 8px;" 
                            onclick="addToCart('${id}'); closeWishlist();" 
                            data-vi="Thêm giỏ hàng" data-en="Add to Cart">Thêm giỏ hàng</button>
                </div>
                <button class="cart-item-remove" onclick="toggleWishlist(null, '${id}')">🗑</button>
            </div>
        `;
    });
    
    container.innerHTML = html;
    
    // Trigger translation reload for the DOM changes
    if (typeof applyLanguage === 'function' && typeof currentLang !== 'undefined') {
        applyLanguage(currentLang);
    }
}

// Attach event listeners when document is parsed
document.addEventListener('DOMContentLoaded', () => {
    updateWishlistBadge();
});
