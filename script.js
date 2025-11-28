// Product Data
const products = [
    {
        id: 1,
        name: "Classic Business Suit",
        category: "business",
        price: 1200,
        originalPrice: 1500,
        image: "images/suit1.jpg",
        badge: "New",
        featured: true,
        description: "Classic business suit suitable for offices and formal meetings. Made of high-quality fabric with precise stitching."
    },
    {
        id: 2,
        name: "Elegant Evening Suit",
        category: "wedding",
        price: 1800,
        originalPrice: 2200,
        image: "images/suit2.jpg",
        badge: "Offer",
        featured: true,
        description: "Luxury evening suit for special occasions and weddings. Elegant design reflecting high taste."
    },
    {
        id: 3,
        name: "Summer Casual Suit",
        category: "casual",
        price: 900,
        originalPrice: 1100,
        image: "images/suit3.jpg",
        badge: "Best Seller",
        featured: true,
        description: "Comfortable casual suit for daily wear. Perfect for outings and holidays."
    },
    {
        id: 4,
        name: "Grey Executive Suit",
        category: "business",
        price: 1500,
        originalPrice: 1800,
        image: "images/suit4.jpg",
        featured: false,
        description: "Executive suit in modern grey color. Suitable for businessmen and managers."
    },
    {
        id: 5,
        name: "Luxury Wedding Suit",
        category: "wedding",
        price: 2500,
        originalPrice: 3000,
        image: "images/suit5.jpg",
        featured: false,
        description: "Luxury wedding suit with a unique design. Perfect for the big day."
    },
    {
        id: 6,
        name: "Comfortable Sport Suit",
        category: "casual",
        price: 800,
        originalPrice: 1000,
        image: "images/suit6.jpg",
        featured: false,
        description: "Comfortable sport suit for daily wear. Features flexibility and comfort."
    },
    {
        id: 7,
        name: "Blue Business Suit",
        category: "business",
        price: 1300,
        originalPrice: 1600,
        image: "images/suit7.jpg",
        badge: "New",
        featured: false,
        description: "Dark blue business suit. Elegant and suitable for important meetings."
    },
    {
        id: 8,
        name: "Black Wedding Suit",
        category: "wedding",
        price: 2200,
        originalPrice: 2800,
        image: "images/suit8.jpg",
        featured: false,
        description: "Black wedding suit with a modern design. Combines elegance and modernity."
    },
    {
        id: 9,
        name: "Brown Casual Suit",
        category: "casual",
        price: 950,
        originalPrice: 1200,
        image: "images/suit9.jpg",
        featured: false,
        description: "Light brown casual suit. Perfect for family gatherings and informal occasions."
    }
];

// Cart Data
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Get Category Name
function getCategoryName(category) {
    const categories = {
        'business': 'Business Suits',
        'wedding': 'Wedding Suits',
        'casual': 'Casual Suits'
    };
    return categories[category] || category;
}

// Load Shop Products
function loadShopProducts() {
    const container = document.getElementById('products-container');
    const resultsInfo = document.getElementById('results-info');
    const noProducts = document.getElementById('no-products');

    if (!container) return;

    // Apply Filters
    applyFilters();

    // Calculate Total Pages
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    // Display Products for Current Page
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    if (currentProducts.length === 0) {
        container.style.display = 'none';
        if (noProducts) noProducts.style.display = 'block';
        if (resultsInfo) resultsInfo.textContent = 'No products found';
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
                        ${product.price} EGP
                        ${product.originalPrice ? `<span class="original-price">${product.originalPrice} EGP</span>` : ''}
                    </p>
                    <div class="product-actions">
                        <button class="add-to-cart" onclick="addToCart(${product.id})">
                            Add to Cart
                        </button>
                        <button class="quick-view-btn" onclick="openQuickView(${product.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}" onclick="toggleWishlist(${product.id}, this)">
                            <i class="${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Update Results Info
        if (resultsInfo) {
            const totalResults = filteredProducts.length;
            const showingStart = startIndex + 1;
            const showingEnd = Math.min(endIndex, totalResults);
            resultsInfo.textContent = `Showing ${showingStart}-${showingEnd} of ${totalResults} products`;
        }
    }

    // Update Pagination
    updatePagination(totalPages);
}

// Apply Filters
function applyFilters() {
    let results = [...products];

    // Filter by Category
    if (currentFilters && currentFilters.category !== 'all') {
        results = results.filter(product => product.category === currentFilters.category);
    }

    // Filter by Price Range
    if (currentFilters && currentFilters.priceRange !== 'all') {
        results = results.filter(product => {
            const price = product.price;
            switch (currentFilters.priceRange) {
                case '0-1000': return price <= 1000;
                case '1000-2000': return price > 1000 && price <= 2000;
                case '2000-3000': return price > 2000 && price <= 3000;
                case '3000+': return price > 3000;
                default: return true;
            }
        });
    }

    // Filter by Search Term
    if (currentFilters && currentFilters.searchTerm) {
        const searchTerm = currentFilters.searchTerm.toLowerCase();
        results = results.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            getCategoryName(product.category).toLowerCase().includes(searchTerm)
        );
    }

    // Sorting
    if (currentFilters) {
        switch (currentFilters.sortBy) {
            case 'price-low':
                results.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                results.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                results.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Default sorting
                break;
        }
    }

    filteredProducts = results;
}

// Update Pagination
function updatePagination(totalPages) {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // Previous Button
    if (currentPage > 1) {
        paginationHTML += `<button class="page-btn" onclick="goToPage(${currentPage - 1})">Previous</button>`;
    }

    // Page Numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            paginationHTML += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += `<span class="page-btn">...</span>`;
        }
    }

    // Next Button
    if (currentPage < totalPages) {
        paginationHTML += `<button class="page-btn" onclick="goToPage(${currentPage + 1})">Next</button>`;
    }

    pagination.innerHTML = paginationHTML;
}

// Go to Page
function goToPage(page) {
    currentPage = page;
    loadShopProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Open Quick View
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('quick-view-modal');
    const content = document.getElementById('quick-view-content');

    if (!modal || !content) return;

    content.innerHTML = `
        <div style="display: flex; gap: 2rem; padding: 2rem; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 300px;">
                <div style="width: 100%; height: 400px; background: #f5f5f5; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <img src="${product.image}" alt="${product.name}" style="max-width: 100%; max-height: 100%; border-radius: 10px;" onerror="this.style.display='none'">
                    <span style="color: #999;">${product.name}</span>
                </div>
            </div>
            <div style="flex: 1; min-width: 300px; padding: 1rem;">
                <h2 style="margin-bottom: 1rem; color: var(--primary-color);">${product.name}</h2>
                <p class="category" style="color: #666; margin-bottom: 1rem;">${getCategoryName(product.category)}</p>
                <p class="price" style="font-size: 1.5rem; font-weight: bold; color: var(--secondary-color); margin-bottom: 1.5rem;">
                    ${product.price} EGP
                    ${product.originalPrice ? `<span class="original-price" style="font-size: 1.2rem;">${product.originalPrice} EGP</span>` : ''}
                </p>
                <p style="line-height: 1.6; margin-bottom: 2rem; color: #555;">
                    ${product.description}
                </p>
                <div style="margin-bottom: 2rem;">
                    <h4 style="margin-bottom: 1rem;">Available Sizes:</h4>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="size-btn" style="padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 5px; background: white; cursor: pointer;">S</button>
                        <button class="size-btn" style="padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 5px; background: white; cursor: pointer;">M</button>
                        <button class="size-btn active" style="padding: 0.5rem 1rem; border: 1px solid var(--secondary-color); border-radius: 5px; background: var(--secondary-color); color: white; cursor: pointer;">L</button>
                        <button class="size-btn" style="padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 5px; background: white; cursor: pointer;">XL</button>
                        <button class="size-btn" style="padding: 0.5rem 1rem; border: 1px solid #ddd; border-radius: 5px; background: white; cursor: pointer;">XXL</button>
                    </div>
                </div>
                <button class="add-to-cart" onclick="addToCart(${product.id}); closeQuickView();" style="width: 100%; padding: 15px; font-size: 1.1rem;">
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
}

// Close Quick View
function closeQuickView() {
    const modal = document.getElementById('quick-view-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Check if product is in wishlist
function isInWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    return wishlist.includes(productId);
}

// Toggle Wishlist
function toggleWishlist(productId, btnElement) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const index = wishlist.indexOf(productId);

    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Product removed from wishlist');
        if (btnElement) {
            btnElement.classList.remove('active');
            const icon = btnElement.querySelector('i');
            if (icon) {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        }
    } else {
        wishlist.push(productId);
        showNotification('Product added to wishlist');
        if (btnElement) {
            btnElement.classList.add('active');
            const icon = btnElement.querySelector('i');
            if (icon) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            }
        }
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    openCart();
    showNotification('Product added to cart');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update Cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');

    // Update Count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;

    // Update Items List
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Your cart is empty</p>';
        } else {
            cartItems.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.style.display='none'">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">${item.price} EGP</div>
                        <div class="cart-item-actions">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            <button class="remove-item" onclick="removeFromCart(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Update Total Price
    if (cartTotalPrice) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotalPrice.textContent = total;
    }
}

// Open Cart
function openCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.add('active');
    }
}

// Close Cart
function closeCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('active');
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    alert('Proceeding to checkout with total: ' + document.getElementById('cart-total-price').textContent + ' EGP');
    // Implement checkout logic here
}

// Show Notification
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification-toast');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification-toast';
        document.body.appendChild(notification);

        // Add styles dynamically
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = '#333';
        notification.style.color = 'white';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '3000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease';
        notification.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    }

    notification.textContent = message;
    notification.style.opacity = '1';

    setTimeout(() => {
        notification.style.opacity = '0';
    }, 3000);
}

// Init Shop
function initShop() {
    // Define variables if not exist
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
    updateCartUI(); // Initialize cart UI
}

// Setup Shop Event Listeners
function setupShopEventListeners() {
    // Close Quick View when clicking outside
    const quickViewModal = document.getElementById('quick-view-modal');
    if (quickViewModal) {
        quickViewModal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeQuickView();
            }
        });
    }

    // Search on Enter
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }

    // Cart Icon Click
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function (e) {
            e.preventDefault();
            openCart();
        });
    }
}

// Load Featured Products
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const featured = products.filter(p => p.featured).slice(0, 4);

    container.innerHTML = featured.map(product => `
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
                    ${product.price} EGP
                    ${product.originalPrice ? `<span class="original-price">${product.originalPrice} EGP</span>` : ''}
                </p>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                    <button class="quick-view-btn" onclick="openQuickView(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}" onclick="toggleWishlist(${product.id}, this)">
                        <i class="${isInWishlist(product.id) ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Initialize on page load if needed (for non-shop pages)
document.addEventListener('DOMContentLoaded', function () {
    updateCartUI();
    loadFeaturedProducts();

    // Cart Icon Click (Global)
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function (e) {
            e.preventDefault();
            openCart();
        });
    }
});