// بيانات المنتجات
const products = [
    {
        id: 1,
        name: "بدلة عمل كلاسيكية",
        category: "business",
        price: 1200,
        originalPrice: 1500,
        image: "images/suit1.jpg",
        badge: "جديد",
        featured: true
    },
    {
        id: 2,
        name: "بدلة سهرة أنيقة",
        category: "wedding",
        price: 1800,
        originalPrice: 2200,
        image: "images/suit2.jpg",
        badge: "عرض",
        featured: true
    },
    {
        id: 3,
        name: "بدلة كاجوال صيفية",
        category: "casual",
        price: 900,
        originalPrice: 1100,
        image: "images/suit3.jpg",
        badge: "الأكثر مبيعاً",
        featured: true
    },
    {
        id: 4,
        name: "بدلة تنفيذية",
        category: "business",
        price: 1500,
        originalPrice: 1800,
        image: "images/suit4.jpg",
        featured: false
    },
    {
        id: 5,
        name: "بدلة زفاف فاخرة",
        category: "wedding",
        price: 2500,
        originalPrice: 3000,
        image: "images/suit5.jpg",
        featured: false
    },
    {
        id: 6,
        name: "بدلة رياضية",
        category: "casual",
        price: 800,
        originalPrice: 1000,
        image: "images/suit6.jpg",
        featured: false
    }
];

// سلة التسوق
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// تهيئة التطبيق
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedProducts();
    updateCartCount();
    setupEventListeners();
});

// تحميل المنتجات المميزة
function loadFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (!featuredContainer) return;

    const featuredProducts = products.filter(product => product.featured);
    
    featuredContainer.innerHTML = featuredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
                <span>${product.name}</span>
            </div>
            <div class="product-card-content">
                <h3>${product.name}</h3>
                <p class="category">${getCategoryName(product.category)}</p>
                <p class="price">
                    ${product.price} ج.م
                    ${product.originalPrice ? `<span class="original-price">${product.originalPrice} ج.م</span>` : ''}
                </p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    أضف إلى السلة
                </button>
            </div>
        </div>
    `).join('');
}

// الحصول على اسم التصنيف
function getCategoryName(category) {
    const categories = {
        'business': 'بدلات عمل',
        'wedding': 'بدلات أفراح',
        'casual': 'بدلات كاجوال'
    };
    return categories[category] || category;
}

// إضافة منتج إلى السلة
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    showNotification(`تم إضافة "${product.name}" إلى السلة`);
}

// تحديث السلة
function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartSidebar();
}

// تحديث عداد السلة
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// تحديث سلة التسوق الجانبية
function updateCartSidebar() {
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; padding: 2rem;">السلة فارغة</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" onerror="this.style.display='none'">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price} ج.م</div>
                    </div>
                    <div class="cart-item-actions">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="remove-item" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (cartTotalPrice) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalPrice.textContent = total;
    }
}

// تحديث الكمية
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCart();
    }
}

// إزالة منتج من السلة
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('تم إزالة المنتج من السلة');
}

// فتح/إغلاق سلة التسوق
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.toggle('active');
        updateCartSidebar();
    }
}

function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('active');
    }
}

// إتمام الشراء
function checkout() {
    if (cart.length === 0) {
        alert('السلة فارغة');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`شكراً لشرائك! المجموع: ${total} ج.م\nسيتم التواصل معك لتأكيد الطلب.`);
    
    cart = [];
    updateCart();
    closeCart();
}

// البحث عن المنتجات
function searchProducts() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm) {
        // في صفحة المتجر، سيتم تطبيق البحث
        if (window.location.pathname.includes('shop.html')) {
            filterProducts(searchTerm);
        } else {
            window.location.href = `shop.html?search=${encodeURIComponent(searchTerm)}`;
        }
    }
}

// إعداد مستمعي الأحداث
function setupEventListeners() {
    // فتح سلة التسوق
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            toggleCart();
        });
    }
    
    // إغلاق السلة عند النقر خارجها
    document.addEventListener('click', function(e) {
        const cartSidebar = document.getElementById('cart-sidebar');
        const cartIcon = document.getElementById('cart-icon');
        
        if (cartSidebar && cartSidebar.classList.contains('active') && 
            !cartSidebar.contains(e.target) && 
            !cartIcon.contains(e.target)) {
            closeCart();
        }
    });
    
    // البحث عند الضغط على Enter
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
}

// عرض الإشعارات
function showNotification(message) {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.style.cssText = `
        position