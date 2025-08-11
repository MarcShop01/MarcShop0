// Variables globales
let tousLesProduits = [];
let produitActuel = null;
let lastScrollPosition = 0;

// Initialisation EmailJS
emailjs.init("s34yGCgjKesaY6sk_");

// Au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    chargerProduits();
    setupEventListeners();
    checkSharedProduct();
    initScrollHandler();
    updateCartCounter();
    loadCategories();
});

// Charger les catégories
function loadCategories() {
    const categories = [
        { name: "Vêtements", icon: "fas fa-tshirt" },
        { name: "Électronique", icon: "fas fa-mobile-alt" },
        { name: "Maison", icon: "fas fa-home" },
        { name: "Livres", icon: "fas fa-book" },
        { name: "Santé", icon: "fas fa-heartbeat" },
        { name: "Sport", icon: "fas fa-futbol" }
    ];

    const container = document.querySelector('.categories-grid');
    container.innerHTML = categories.map(cat => `
        <div class="category-card">
            <div class="category-icon">
                <i class="${cat.icon}"></i>
            </div>
            <div class="category-name">${cat.name}</div>
        </div>
    `).join('');
}

// Gestion du scroll pour le menu mobile
function initScrollHandler() {
    const mobileFooter = document.getElementById('mobile-footer');
    const header = document.getElementById('main-header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 100 && currentScroll > lastScrollPosition) {
            mobileFooter.classList.add('show');
            header.style.transform = 'translateY(-100%)';
        } else {
            mobileFooter.classList.remove('show');
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollPosition = currentScroll;
    });
}

// Mettre à jour le compteur de panier
function updateCartCounter() {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    const totalItems = panier.reduce((total, item) => total + (item.quantity || 1), 0);
    document.querySelectorAll('.cart-counter').forEach(counter => {
        counter.textContent = totalItems;
    });
}

// Charger les produits
async function chargerProduits() {
    try {
        const response = await fetch('produits.json');
        tousLesProduits = await response.json();
        
        // Ajouter un ID si manquant
        tousLesProduits.forEach((prod, index) => {
            if (!prod.id) prod.id = `prod_${index}`;
            if (!prod.images) prod.images = [prod.image];
        });
        
        afficherProduits(tousLesProduits);
        afficherNouveautes();
        afficherPromotions();
    } catch (error) {
        console.error("Erreur de chargement:", error);
        document.getElementById('nouveautes').querySelector('.produits-grid').innerHTML = `
            <div class="error">
                Impossible de charger les produits. Rechargez la page.
            </div>
        `;
    }
}

// Afficher les produits
function afficherProduits(produitsAAfficher) {
    const container = document.querySelector('#nouveautes .produits-grid');
    if (!container) return;
    
    if (produitsAAfficher.length === 0) {
        container.innerHTML = '<div class="no-results">Aucun produit trouvé</div>';
        return;
    }

    container.innerHTML = produitsAAfficher.map(produit => `
        <div class="product-card" data-id="${produit.id}">
            ${produit.isNew ? '<span class="badge badge-new">Nouveau</span>' : ''}
            ${produit.onSale ? '<span class="badge badge-sale">Promo</span>' : ''}
            <div class="product-image-container" onclick="openProductModal('${produit.id}')">
                <img src="${escapeHtml(produit.images[0])}" 
                     alt="${escapeHtml(produit.nom)}"
                     class="product-image">
            </div>
            <div class="product-info">
                <h3 class="product-title">${escapeHtml(produit.nom)}</h3>
                <div class="product-price">
                    <span class="current-price">${escapeHtml(produit.prix)} $</span>
                    ${produit.oldPrice ? `<span class="old-price">${escapeHtml(produit.oldPrice)} $</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="ajouterAuPanier('${produit.id}', event)">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="action-btn">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn" onclick="openProductModal('${produit.id}', event)">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Afficher les nouveautés
function afficherNouveautes() {
    const nouveautes = tousLesProduits.filter(prod => prod.isNew);
    const container = document.querySelector('#nouveautes .produits-grid');
    if (!container) return;
    
    if (nouveautes.length === 0) {
        container.innerHTML = '<div class="no-results">Aucune nouveauté</div>';
        return;
    }

    container.innerHTML = nouveautes.map(produit => `
        <div class="product-card" data-id="${produit.id}">
            <span class="badge badge-new">Nouveau</span>
            <div class="product-image-container" onclick="openProductModal('${produit.id}')">
                <img src="${escapeHtml(produit.images[0])}" 
                     alt="${escapeHtml(produit.nom)}"
                     class="product-image">
            </div>
            <div class="product-info">
                <h3 class="product-title">${escapeHtml(produit.nom)}</h3>
                <div class="product-price">
                    <span class="current-price">${escapeHtml(produit.prix)} $</span>
                    ${produit.oldPrice ? `<span class="old-price">${escapeHtml(produit.oldPrice)} $</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="ajouterAuPanier('${produit.id}', event)">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="action-btn">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn" onclick="openProductModal('${produit.id}', event)">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Afficher les promotions
function afficherPromotions() {
    const promotions = tousLesProduits.filter(prod => prod.onSale);
    const container = document.querySelector('#promotions .produits-grid');
    if (!container) return;
    
    if (promotions.length === 0) {
        container.innerHTML = '<div class="no-results">Aucune promotion</div>';
        return;
    }

    container.innerHTML = promotions.map(produit => `
        <div class="product-card" data-id="${produit.id}">
            <span class="badge badge-sale">Promo</span>
            <div class="product-image-container" onclick="openProductModal('${produit.id}')">
                <img src="${escapeHtml(produit.images[0])}" 
                     alt="${escapeHtml(produit.nom)}"
                     class="product-image">
            </div>
            <div class="product-info">
                <h3 class="product-title">${escapeHtml(produit.nom)}</h3>
                <div class="product-price">
                    <span class="current-price">${escapeHtml(produit.prix)} $</span>
                    ${produit.oldPrice ? `<span class="old-price">${escapeHtml(produit.oldPrice)} $</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="ajouterAuPanier('${produit.id}', event)">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="action-btn">
                        <i class="fas fa-heart"></i>
                    </button>
                    <button class="action-btn" onclick="openProductModal('${produit.id}', event)">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Configurer les événements
function setupEventListeners() {
    // Barre de recherche
    document.getElementById('search-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const terme = document.getElementById('search-input').value.toLowerCase();
        const produitsFiltres = tousLesProduits.filter(produit => 
            produit.nom.toLowerCase().includes(terme) || 
            (produit.description && produit.description.toLowerCase().includes(terme))
        );
        afficherProduits(produitsFiltres);
    });

    // Boutons de la modale
    document.getElementById('modal-add-to-cart')?.addEventListener('click', () => {
        if (produitActuel) {
            ajouterAuPanier(produitActuel.id);
            closeModal();
        }
    });

    document.getElementById('modal-share')?.addEventListener('click', partagerProduit);
    
    // Fermeture modale
    document.getElementById('product-modal')?.addEventListener('click', (e) => {
        if (e.target === document.getElementById('product-modal')) {
            closeModal();
        }
    });
    
    // Gestion du formulaire de contact
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        const templateParams = {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message
        };

        emailjs.send("service_id", "template_id", templateParams)
            .then(() => {
                showNotification('Message envoyé avec succès !');
                document.getElementById('contact-form').reset();
            })
            .catch(() => {
                showNotification('Erreur lors de l\'envoi du message');
            });
    });
}

// Ouvrir la modale
function openProductModal(productId, event = null) {
    if (event) event.stopPropagation();
    
    produitActuel = tousLesProduits.find(p => p.id === productId);
    if (!produitActuel) return;

    document.getElementById('modal-title').textContent = produitActuel.nom;
    document.getElementById('modal-price').innerHTML = `
        <span class="current-price">${escapeHtml(produitActuel.prix)} $</span>
        ${produitActuel.oldPrice ? `<span class="old-price">${escapeHtml(produitActuel.oldPrice)} $</span>` : ''}
    `;
    document.getElementById('modal-description').textContent = produitActuel.description || 'Aucune description disponible';
    document.getElementById('modal-category').textContent = produitActuel.category || 'Non spécifiée';
    document.getElementById('modal-availability').textContent = produitActuel.availability || 'En stock';
    document.getElementById('modal-rating').textContent = produitActuel.rating || 'Non évalué';

    const whatsappLink = document.getElementById('whatsapp-product-link');
    whatsappLink.href = `https://wa.me/18093978951?text=${encodeURIComponent(
        `Bonjour MarcShop! Je suis intéressé par votre produit "${produitActuel.nom}" (${produitActuel.prix}$). Pouvez-vous m'en dire plus ?`
    )}`;

    // Gestion des images
    const thumbnailContainer = document.querySelector('.thumbnail-container');
    const mainImage = document.getElementById('modal-main-image');
    thumbnailContainer.innerHTML = '';
    
    produitActuel.images.forEach((img, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'thumbnail';
        if (index === 0) thumbnail.classList.add('active');
        
        thumbnail.innerHTML = `<img src="${img}" alt="Miniature ${index + 1}">`;
        
        thumbnail.addEventListener('click', () => {
            // Mettre à jour l'image principale
            mainImage.src = img;
            
            // Mettre à jour les miniatures actives
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumbnail.classList.add('active');
        });
        
        thumbnailContainer.appendChild(thumbnail);
    });
    
    // Afficher la première image
    if (produitActuel.images.length > 0) {
        mainImage.src = produitActuel.images[0];
    }
    
    // Ouvrir la modale
    document.getElementById('product-modal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Fermer la modale
function closeModal() {
    document.getElementById('product-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Ajouter au panier
function ajouterAuPanier(productId, event = null) {
    if (event) event.stopPropagation();
    
    const produit = tousLesProduits.find(p => p.id === productId);
    if (!produit) return;

    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    
    // Vérifier si le produit existe déjà
    const produitExistant = panier.find(p => p.id === productId);
    
    if (produitExistant) {
        // Si oui, augmenter la quantité
        produitExistant.quantity = (produitExistant.quantity || 1) + 1;
    } else {
        // Sinon, ajouter le produit avec quantité 1
        const produitACopier = { ...produit };
        produitACopier.quantity = 1;
        panier.push(produitACopier);
    }
    
    localStorage.setItem('panier', JSON.stringify(panier));
    updateCartCounter();
    showNotification(`${produit.nom} ajouté au panier !`);
}

// Partager produit
async function partagerProduit() {
    if (!produitActuel) return;

    const urlPartage = `${window.location.origin}${window.location.pathname}?produit=${produitActuel.id}`;
    const textePartage = `Découvrez "${produitActuel.nom}" à ${produitActuel.prix}$ sur MarcShop: ${urlPartage}`;

    try {
        if (navigator.share) {
            await navigator.share({
                title: produitActuel.nom,
                text: `Seulement ${produitActuel.prix}$ !`,
                url: urlPartage
            });
        } else {
            await navigator.clipboard.writeText(textePartage);
            showNotification('Lien copié dans le presse-papiers !');
        }
    } catch (err) {
        prompt('Copiez ce lien:', urlPartage);
    }
}

// Vérifier le produit partagé
function checkSharedProduct() {
    const urlParams = new URLSearchParams(window.location.search);
    const produitId = urlParams.get('produit');
    
    if (produitId) {
        const produit = tousLesProduits.find(p => p.id === produitId);
        if (produit) {
            openProductModal(produitId);
            history.replaceState(null, '', window.location.pathname);
        }
    }
}

// Afficher notification
function showNotification(message) {
    const notif = document.getElementById('notification');
    if (notif) {
        notif.textContent = message;
        notif.classList.add('show');
        setTimeout(() => notif.classList.remove('show'), 3000);
    }
}

// Sécurité HTML
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') return unsafe;
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Fonctions globales
window.openProductModal = openProductModal;
window.closeModal = closeModal;
window.ajouterAuPanier = ajouterAuPanier;
