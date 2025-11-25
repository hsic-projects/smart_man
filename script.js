// بيانات المنتجات (مشتركة بين جميع الصفحات)
const products = [
    {
        id: 1,
        name: "بدلة عمل كلاسيكية",
        category: "business",
        price: 1200,
        originalPrice: 1500,
        image: "images/suit1.jpg",
        badge: "جديد",
        featured: true,
        description: "بدلة عمل كلاسيكية مناسبة للمكاتب والاجتماعات الرسمية. مصنوعة من قماش عالي الجودة مع خياطة دقيقة."
    },
    {
        id: 2,
        name: "بدلة سهرة أنيقة",
        category: "wedding",
        price: 1800,
        originalPrice: 2200,
        image: "images/suit2.jpg",
        badge: "عرض",
        featured: true,
        description: "بدلة سهرة فاخرة للمناسبات الخاصة والأفراح. تصميم أنيق يعكس الذوق الرفيع."
    },
    {
        id: 3,
        name: "بدلة كاجوال صيفية",
        category: "casual",
        price: 900,
        originalPrice: 1100,
        image: "images/suit3.jpg",
        badge: "الأكثر مبيعاً",
        featured: true,
        description: "بدلة كاجوال مريحة للارتداء اليومي. مثالية للخروجات والعطلات."
    },
    {
        id: 4,
        name: "بدلة تنفيذية رمادية",
        category: "business",
        price: 1500,
        originalPrice: 1800,
        image: "images/suit4.jpg",
        featured: false,
        description: "بدلة تنفيذية باللون الرمادي العصري. تناسب رجال الأعمال والمديرين."
    },
    {
        id: 5,
        name: "بدلة زفاف فاخرة",
        category: "wedding",
        price: 2500,
        originalPrice: 3000,
        image: "images/suit5.jpg",
        featured: false,
        description: "بدلة زفاف فاخرة بتصميم مميز. مثالية لليلة العمر."
    },
    {
        id: 6,
        name: "بدلة رياضية مريحة",
        category: "casual",
        price: 800,
        originalPrice: 1000,
        image: "images/suit6.jpg",
        featured: false,
        description: "بدلة رياضية مريحة للارتداء اليومي. تتميز بالمرونة والراحة."
    },
    {
        id: 7,
        name: "بدلة عمل زرقاء",
        category: "business",
        price: 1300,
        originalPrice: 1600,
        image: "images/suit7.jpg",
        badge: "جديد",
        featured: false,
        description: "بدلة عمل باللون الأزرق الداكن. أنيقة ومناسبة للاجتماعات المهمة."
    },
    {
        id: 8,
        name: "بدلة أفراح سوداء",
        category: "wedding",
        price: 2200,
        originalPrice: 2800,
        image: "images/suit8.jpg",
        featured: false,
        description: "بدلة أفراح سوداء بتصميم عصري. تجمع بين الأناقة والحداثة."
    },
    {
        id: 9,
        name: "بدلة كاجوال بنية",
        category: "casual",
        price: 950,
        originalPrice: 1200,
        image: "images/suit9.jpg",
        featured: false,
        description: "بدلة كاجوال باللون البني الفاتح. مثالية للقاءات العائلية والمناسبات غير الرسمية."
    }
];

// الحصول على اسم التصنيف
function getCategoryName(category) {
    const categories = {
        'business': 'بدلات عمل',
        'wedding': 'بدلات أفراح',
        'casual': 'بدلات كاجوال'
    };
    return categories[category] || category;
}

// تحميل المنتجات في صفحة المتجر
function loadShopProducts() {
    const container = document.getElementById('products-container');
    const resultsInfo = document.getElementById('results-info');
    const noProducts = document.getElementById('no-products');
    
    if (!container) return;
    
    // تطبيق الفلاتر
    applyFilters();
    
    // حساب عدد الصفحات
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    // عرض المنتجات للصفحة الحالية
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);
    
    if (currentProducts.length === 0) {
        container.style.display = 'none';
        if (noProducts) noProducts.style.display = 'block';
        if (resultsInfo) resultsInfo.textContent = 'لم نعثر على منتجات';
    } else {
        container.style.display = currentView === 'grid' ? 'grid' : 'block';
        if (noProducts) noProducts.style.display = 'none';
        container.className = `products-${currentView} ${currentView}-view`;
        
        container.innerHTML = currentProducts.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
                    <span style="display: none;">${product.name}</span>
                </div>
                <div class="product-card-content">
                    <h3>${product.name}</h3>
                    <p class="category">${getCategoryName(product.category)}</p>
                    <p class="price">
                        ${product.price} ج.م
                        ${product.originalPrice ? `<span class="original-price">${product.originalPrice} ج.م</span>` : ''}
                    </p>
                    <div class="product-actions">
                        <button class="add-to-cart" onclick="addToCart(${product.id})">
                            أضف إلى السلة
                        </button>
                        <button class="quick-view-btn" onclick="openQuickView(${product.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // تحديث معلومات النتائج
        if (resultsInfo) {
            const totalResults = filteredProducts.length;
            const showingStart = startIndex + 1;
            const showingEnd = Math.min(endIndex, totalResults);
            resultsInfo.textContent = `عرض ${showingStart}-${showingEnd} من ${totalResults} منتج`;
        }
    }
    
    // تحديث الترقيم
    updatePagination(totalPages);
}

// تطبيق الفلاتر
function applyFilters() {
    let results = [...products];
    
    // تصفية حسب التصنيف
    if (currentFilters && currentFilters.category !== 'all') {
        results = results.filter(product => product.category === currentFilters.category);
    }
    
    // تصفية حسب نطاق السعر
    if (currentFilters && currentFilters.priceRange !== 'all') {
        results = results.filter(product => {
            const price = product.price;
            switch(currentFilters.priceRange) {
                case '0-1000': return price <= 1000;
                case '1000-2000': return price > 1000 && price <= 2000;
                case '2000-3000': return price > 2000 && price <= 3000;
                case '3000+': return price > 3000;
                default: return true;
            }
        });
    }
    
    // تصفية حسب البحث
    if (currentFilters && currentFilters.searchTerm) {
        const searchTerm = currentFilters.searchTerm.toLowerCase();
        results = results.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            getCategoryName(product.category).toLowerCase().includes(searchTerm)
        );
    }
    
    // الترتيب
    if (currentFilters) {
        switch(currentFilters.sortBy) {
            case 'price-low':
                results.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                results.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                results.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
                break;
            default:
                // الترتيب الافتراضي
                break;
        }
    }
    
    filteredProducts = results;
}

// تحديث الترقيم
function updatePagination(totalPages) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // زر السابق
    if (currentPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="goToPage(${currentPage - 1})">السابق</button>`;
    }
    
    // أرقام الصفحات
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span class="page-btn">...</span>`;
        }
    }
    
    // زر التالي
    if (currentPage < totalPages) {
        paginationHTML += `<button class="page-btn" onclick="goToPage(${currentPage + 1})">التالي</button>`;
    }
    
    pagination.innerHTML = paginationHTML;
}

// الانتقال إلى صفحة
function goToPage(page) {
    currentPage = page;
    loadShopProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// فتح العرض السريع
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('quick-view-modal');
    const content = document.getElementById('quick-view-content');
    
    if (!modal || !content) return;
    
    content.innerHTML = `
        <div style="display: flex; gap: 2rem; padding: 2rem;">
            <div style="flex: 1;">
                <div style="width: 100%; height: 400px; background: #f5f5f5; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <img src="${product.image}" alt="${product.name}" style="max-width: 100%; max-height: 100%; border-radius: 10px;" onerror="this.style.display='none'">
                    <span style="color: #999;">${product.name}</span>
                </div>
            </div>
            <div style="flex: 1; padding: 1rem;">
                <h2 style="margin-bottom: 1rem; color: var(--primary-color);">${product.name}</h2>
                <p class="category" style="color: #666; margin-bottom: 1rem;">${getCategoryName(product.category)}</p>
                <p class="price" style="font-size: 1.5rem; font-weight: bold; color: var(--secondary-color); margin-bottom: 1.5rem;">
                    ${product.price} ج.م
                    ${product.originalPrice ? `<span class="original-price" style="font-size: 1.2rem;">${product.originalPrice} ج.م</span>` : ''}
                </p>
                <p style="line-height: 1.6; margin-bottom: 2rem; color: #555;">
                    ${product.description}
                </p>
                <div style="margin-bottom: 2rem;">
                    <h4 style="margin-bottom: 1rem;">المقاسات المتاحة:</h4>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="size-btn" style="padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 5px; background: white; cursor: pointer;">S</button>
                        <button class="size-btn" style="padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 5px; background: white; cursor: pointer;">M</button>
                        <button class="size-btn active" style="padding: 0.5rem 1rem; border: 1px solid var(--secondary-color); border-radius: 5px; background: var(--secondary-color); color: white; cursor: pointer;">L</button>
                        <button class="size-btn" style="padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 5px; background: white; cursor: pointer;">XL</button>
                        <button class="size-btn" style="padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 5px; background: white; cursor: pointer;">XXL</button>
                    </div>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id}); closeQuickView();" style="width: 100%; padding: 15px; font-size: 1.1rem;">
                    أضف إلى السلة
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// إغلاق العرض السريع
function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// إضافة إلى المفضلة
function toggleWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('تم إزالة المنتج من المفضلة');
    } else {
        wishlist.push(productId);
        showNotification('تم إضافة المنتج إلى المفضلة');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// تهيئة المتجر
function initShop() {
    // تعريف المتغيرات إذا لم تكن موجودة
    if (typeof currentView === 'undefined') {
        window.currentView = 'grid';
    }
    if (typeof currentPage === 'undefined') {
        window.currentPage = 1;
    }
    if (typeof productsPerPage === 'undefined') {
        window.productsPerPage = 9;
    }
    if (typeof filteredProducts === 'undefined') {
        window.filteredProducts = [];
    }
    if (typeof currentFilters === 'undefined') {
        window.currentFilters = {
            category: 'all',
            priceRange: 'all',
            sortBy: 'default',
            searchTerm: ''
        };
    }
    
    loadShopProducts();
    setupShopEventListeners();
    applyURLFilters();
}

// إعداد مستمعي الأحداث للمتجر
function setupShopEventListeners() {
    // إغلاق العرض السريع عند النقر خارج المحتوى
    const quickViewModal = document.getElementById('quick-view-modal');
    if (quickViewModal) {
        quickViewModal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeQuickView();
            }
        });
    }
    
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