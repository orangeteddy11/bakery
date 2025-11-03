// --- SHOPPING CART FUNCTIONALITY ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to cart function
function addToCart(productName, productPrice, productImage) {
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    // Update localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart badge
    updateCartBadge();
    
    // Show confirmation
    showCartNotification(`${productName} added to cart!`);
}

// Update cart badge count
function updateCartBadge() {
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartBadge.textContent = totalItems;
    }
}

// Show cart notification
function showCartNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #5c4185;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// View cart function
function viewCart() {
    // Create cart modal
    const cartModal = document.createElement('div');
    cartModal.className = 'cart-modal';
    cartModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 10000;
        display: flex;
        justify-content: center;
        align-items: center;
    `;
    
    // Cart content
    const cartContent = document.createElement('div');
    cartContent.className = 'cart-content';
    cartContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
    `;
    
    // Close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.cssText = `
        position: absolute;
        top: 15px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
    `;
    closeButton.onclick = () => document.body.removeChild(cartModal);
    
    // Cart title
    const cartTitle = document.createElement('h2');
    cartTitle.textContent = 'Your Shopping Cart';
    cartTitle.style.cssText = 'color: #5c4185; margin-bottom: 20px;';
    
    // Cart items
    const cartItems = document.createElement('div');
    cartItems.className = 'cart-items';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Your cart is empty</p>';
    } else {
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.style.cssText = `
                display: flex;
                align-items: center;
                padding: 15px 0;
                border-bottom: 1px solid #eee;
            `;
            
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px; margin-right: 15px;">
                <div style="flex-grow: 1;">
                    <h4 style="margin: 0 0 5px 0; color: #5c4185;">${item.name}</h4>
                    <p style="margin: 0; color: #666;">$${item.price.toFixed(2)} × ${item.quantity}</p>
                </div>
                <div style="text-align: right;">
                    <p style="margin: 0 0 10px 0; font-weight: bold;">$${itemTotal.toFixed(2)}</p>
                    <div>
                        <button onclick="updateQuantity(${index}, ${item.quantity - 1})" style="background: #f0f0f0; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">-</button>
                        <span style="margin: 0 10px;">${item.quantity}</span>
                        <button onclick="updateQuantity(${index}, ${item.quantity + 1})" style="background: #f0f0f0; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">+</button>
                    </div>
                </div>
            `;
            
            cartItems.appendChild(itemElement);
        });
        
        // Total and checkout
        const totalElement = document.createElement('div');
        totalElement.style.cssText = 'margin-top: 20px; padding-top: 20px; border-top: 2px solid #eee;';
        totalElement.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-size: 1.2em; font-weight: bold;">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <button onclick="checkout()" style="background: #c7a884; color: white; border: none; padding: 12px 30px; border-radius: 5px; font-size: 1.1em; cursor: pointer; width: 100%; margin-top: 20px;">
                Proceed to Checkout
            </button>
        `;
        
        cartItems.appendChild(totalElement);
    }
    
    cartContent.appendChild(closeButton);
    cartContent.appendChild(cartTitle);
    cartContent.appendChild(cartItems);
    cartModal.appendChild(cartContent);
    
    document.body.appendChild(cartModal);
    
    // Close modal when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            document.body.removeChild(cartModal);
        }
    });
}

// Update item quantity
function updateQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        cart.splice(index, 1);
    } else {
        cart[index].quantity = newQuantity;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    
    // Refresh cart view
    const existingModal = document.querySelector('.cart-modal');
    if (existingModal) {
        document.body.removeChild(existingModal);
        viewCart();
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    alert('Thank you for your order!');
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    
    const existingModal = document.querySelector('.cart-modal');
    if (existingModal) {
        document.body.removeChild(existingModal);
    }
}

// Initialize cart badge on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    
    // Make cart count clickable
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.style.cursor = 'pointer';
        cartCount.onclick = viewCart;
    }
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .cart-count {
        cursor: pointer;
        transition: transform 0.2s;
    }
    
    .cart-count:hover {
        transform: scale(1.1);
    }
`;
document.head.appendChild(style);

// --- REST OF YOUR EXISTING CODE BELOW ---

// --- GOOGLE TRANSLATE INITIALIZATION ---
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,es,fr,de,it,pt,zh-CN,zh-TW,ja,ko,ar,hi,ru,nl,sv,no,da,fi,pl,tr,th,vi,id',
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
}

// --- MOBILE NAVIGATION (Hamburger Menu Toggle) ---
function openNav() {
    const navMenu = document.querySelector('.nav-menu-desktop');
    const mobileIcon = document.querySelector('.mobile-menu-icon');
    const body = document.body;

    navMenu.classList.toggle('show-mobile');
    
    // Change icon
    if (navMenu.classList.contains('show-mobile')) {
        mobileIcon.classList.remove('fa-bars');
        mobileIcon.classList.add('fa-times');
        body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    } else {
        mobileIcon.classList.remove('fa-times');
        mobileIcon.classList.add('fa-bars');
        body.style.overflow = ''; // Restore scrolling
    }
}

// Close mobile menu when clicking a link
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-menu-desktop a');
    const mobileIcon = document.querySelector('.mobile-menu-icon');
    const navMenu = document.querySelector('.nav-menu-desktop');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('show-mobile');
                mobileIcon.classList.remove('fa-times');
                mobileIcon.classList.add('fa-bars');
                document.body.style.overflow = '';
            }
        });
    });
});

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.querySelector('.nav-menu-desktop');
    const mobileIcon = document.querySelector('.mobile-menu-icon');
    const header = document.querySelector('.header');
    
    if (navMenu && navMenu.classList.contains('show-mobile')) {
        if (!header.contains(event.target)) {
            navMenu.classList.remove('show-mobile');
            mobileIcon.classList.remove('fa-times');
            mobileIcon.classList.add('fa-bars');
            document.body.style.overflow = '';
        }
    }
});

// --- SEARCH TOGGLE FUNCTION ---
function toggleSearch() {
    const searchContainer = document.querySelector('.search-bar-desktop');
    const input = document.getElementById('search-input-desktop');
    
    searchContainer.classList.toggle('active');
    
    if (searchContainer.classList.contains('active')) {
        input.focus();
    }
}

// --- JAVASCRIPT HOVER EFFECTS (Nav Links & Product Images) ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Nav Link Hover Effect (Highlight Box)
    const navLinks = document.querySelectorAll('.nav-menu-desktop a');

    navLinks.forEach(link => {
        link.addEventListener('mouseover', () => {
            link.classList.add('highlight-box');
            link.style.fontSize = '1.15em'; 
        });

        link.addEventListener('mouseout', () => {
            link.classList.remove('highlight-box');
            link.style.fontSize = ''; 
        });
    });

   // 2. Product Image Hover Effect (Grow Image on hover)
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    card.addEventListener('mouseover', () => {
        const img = card.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1.05)';
            img.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
        }
    });

    card.addEventListener('mouseout', () => {
        const img = card.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1.0)';
            img.style.boxShadow = 'none';
        }
    });
    
    // Add click event to add to cart
    card.addEventListener('click', (e) => {
        e.preventDefault();
        
        const productName = card.getAttribute('data-name');
        const productPrice = parseFloat(card.getAttribute('data-price'));
        const productImage = card.getAttribute('data-image');
        
        addToCart(productName, productPrice, productImage);
    });
});

    // 3. Image Quality Enhancement (Add lazy loading and optimization)
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        // Add lazy loading
        img.loading = 'lazy';
        
        // Add smooth fade-in effect when image loads
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease-in';
        
        img.addEventListener('load', () => {
            img.style.opacity = '1';
        });

        // Error handling for broken images
        img.addEventListener('error', () => {
            img.alt = 'Image not available';
            img.style.backgroundColor = '#f0f0f0';
        });
    });
});

// --- ACCESSIBILITY FUNCTIONS ---

// Text-to-Speech (TTS) Function
window.speakContent = function() {
    const mainContent = document.querySelector('main');
    if (!mainContent) return;
    
    const readableText = mainContent.innerText.split('\n').filter(line => line.trim().length > 0).join('. ');

    if ('speechSynthesis' in window) {
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel();
        }
        
        const utterance = new SpeechSynthesisUtterance(readableText);
        utterance.rate = 1; 
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    } else {
        alert('Text-to-Speech is not supported by your browser.');
    }
};