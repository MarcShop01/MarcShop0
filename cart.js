// Données des produits (chargées depuis products.json)
let produits = [];
let cart = [];

// Chargement initial
document.addEventListener('DOMContentLoaded', async () => {
    // Charger les produits depuis le fichier JSON
    try {
        const response = await fetch('products.json');
        produits = await response.json();
        
        // Charger le panier depuis localStorage
        cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Afficher le panier
        renderCartItems();
        
        // Afficher les produits recommandés
        displayRecommendedProducts();
        
        // Mettre à jour le compteur de panier
        updateCartCount();
    } catch (error) {
        console.error('Erreur de chargement des données:', error);
    }
});

// Afficher les articles du panier
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <h3>Votre panier est vide</h3>
                <p>Découvrez nos produits et remplissez votre panier !</p>
                <a href="index.html" class="continue-shopping">Continuer vos achats</a>
            </div>
        `;
        updateSummary();
        return;
    }
    
    let cartItemsHTML = `
        <div class="cart-items-header">
            <div>Produit</div>
            <div>Prix</div>
            <div>Quantité</div>
            <div>Total</div>
        </div>
    `;
    
    cart.forEach(item => {
        cartItemsHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>${item.description || ''}</p>
                    </div>
                </div>
                <div class="cart-item-price">${item.price.toFixed(2)} €</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                    <button class="quantity-btn increase">+</button>
                </div>
                <div class="cart-item-total">${(item.price * item.quantity).toFixed(2)} €</div>
                <button class="cart-item-remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    });
    
    cartItemsHTML += `
        <div class="cart-actions">
            <a href="index.html" class="continue-shopping">
                <i class="fas fa-arrow-left"></i> Continuer mes achats
            </a>
            <button class="update-cart">Mettre à jour le panier</button>
        </div>
    `;
    
    cartItemsContainer.innerHTML = cartItemsHTML;
    
    // Ajouter les écouteurs d'événements
    setupCartEventListeners();
    updateSummary();
}

// Configuration des écouteurs d'événements pour le panier
function setupCart极Listeners() {
    // Boutons de quantité
    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
    });
    
    // Modification manuelle de la quantité
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', manualQuantityChange);
    });
    
    // Suppression d'article
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', removeItem);
    });
    
    // Mise à jour du panier
    const updateCartBtn = document.querySelector('.update-cart');
    if (updateCartBtn) {
        updateCartBtn.addEventListener('click', updateCart);
    }
    
    // Application du coupon
    const applyCouponBtn = document.getElementById('applyCoupon');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', applyCoupon);
    }
    
    // Paiement
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
}

// Diminuer la quantité
function decreaseQuantity(e) {
    const cartItem = e.target.closest('.cart-item');
    const input = cartItem.querySelector('.quantity-input');
    let quantity = parseInt(input.value);
    
    if (quantity > 1) {
        quantity--;
        input.value = quantity;
        updateItemTotal(cartItem);
    }
}

// Augmenter la quantité
function increaseQuantity(e) {
    const cartItem = e.target.closest('.cart-item');
    const input = cartItem.querySelector('.quantity-input');
    let quantity = parseInt(input.value);
    quantity++;
    input.value = quantity;
    updateItemTotal(cartItem);
}

// Modification manuelle de la quantité
function manualQuantityChange(e) {
    const input = e.target;
    if (input.value < 1) input.value = 1;
    
    const cartItem = input.closest('.cart-item');
    updateItemTotal(cartItem);
}

// Mettre à jour le total d'un article
function updateItemTotal(cartItem) {
    const price = parseFloat(cartItem.querySelector('.cart-item-price').textContent.replace('€', ''));
    const quantity = parseInt(cartItem.querySelector('.quantity-input').value);
    const total = (price * quantity).toFixed(2);
    
    cartItem.querySelector('.cart-item-total').textContent = total + ' €';
}

// Supprimer un article
function removeItem(e) {
    const cartItem = e.target.closest('.cart-item');
    const productId = parseInt(cartItem.dataset.id);
    
    // Supprimer l'article du panier
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    
    // Animation de suppression
    cartItem.style.animation = 'fadeOut 0.3s forwards';
    setTimeout(() => {
        cartItem.remove();
        if (cart.length === 0) {
            renderCartItems();
        } else {
            updateSummary();
        }
        updateCartCount();
    }, 300);
}

// Mettre à jour le panier (sauvegarder les modifications)
function updateCart() {
    cart.forEach(item => {
        const cartItem = document.querySelector(`.cart-item[data-id="${item.id}"]`);
        if (cartItem) {
            const quantity = parseInt(cartItem.querySelector('.quantity-input').value);
            item.quantity = quantity;
        }
    });
    
    saveCart();
    alert('Panier mis à jour avec succès!');
    updateSummary();
}

// Appliquer un coupon
function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value;
    if (couponCode.toUpperCase() === 'MARC20') {
        alert('Coupon appliqué: 20% de réduction sur votre commande!');
        // Ici vous pourriez ajouter une logique pour appliquer la réduction
    } else {
        alert('Code coupon invalide');
    }
}

// Paiement
function checkout() {
    if (cart.length === 0) {
        alert('Votre panier est vide!');
        return;
    }
    
    // Redirection vers la page de paiement
    alert('Redirection vers la page de paiement...');
    // window.location.href = 'checkout.html';
}

// Mettre à jour le récapitulatif
function updateSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const taxes = subtotal * 0.2; // 20% de TVA
    const total = subtotal + taxes;
    
    document.getElementById('subtotal').textContent = subtotal.toFixed(2) + ' €';
    document.getElementById('taxes').textContent = taxes.toFixed(2) + ' €';
    document.getElementById('total').textContent = total.toFixed(2) + ' €';
}

// Afficher les produits recommandés
function displayRecommendedProducts() {
    const recommendedContainer = document.getElementById('recommendedProducts');
    if (!recommendedContainer) return;
    
    recommendedContainer.innerHTML = '';
    
    // Sélectionner 4 produits au hasard
    const shuffled = [...produits].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4);
    
    selected.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.images[0]}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">${product.price.toFixed(2)} €</span>
                </div>
                <p class="description">${product.description}</p>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> Ajouter
                </button>
            </div>
        `;
        recommendedContainer.appendChild(productCard);
    });
    
    // Ajouter les écouteurs pour le bouton "Ajouter"
    document.querySelectorAll('#recommendedProducts .add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Ajouter au panier (depuis la page panier)
function addToCart(productId) {
    const product = produits.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0],
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    renderCartItems();
    
    // Feedback visuel
    const button = document.querySelector(`.add-to-cart[data-id="${productId}"]`);
    if (button) {
        button.innerHTML = '<i class="fas fa-check"></i> Ajouté';
        button.style.background = '#2ed573';
        button.style.color = '#000';
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-shopping-cart"></i> Ajouter';
            button.style.background = '';
            button.style.color = '';
        }, 2000);
    }
}

// Enregistrer le panier dans localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Mise à jour du compteur de panier
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}
