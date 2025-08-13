// Variables globales
let tousLesProduits = [];
let produitActuel = null;
let lastScrollPosition = 0;

// Initialisation EmailJS avec votre User ID
emailjs.init("s34yGCgjKesaY6sk_");

// Au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    chargerProduits();
    setupEventListeners();
    checkSharedProduct();
    initScrollHandler();
    updateCartCounter();
    loadCategories();
    setupContactActions();
});

// Configurer les actions de contact
function setupContactActions() {
    // Téléphone - lance l'appel
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // Action d'appel automatique grâce au href tel:
        });
    });
    
    // WhatsApp - ouvre la conversation
    document.getElementById('whatsapp-contact').addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://wa.me/18093978951', '_blank');
    });
    
    // Adresse - montre la carte
    document.getElementById('show-address').addEventListener('click', (e) => {
        e.preventDefault();
        const mapContainer = document.getElementById('contact-map');
        if (mapContainer.classList.contains('hidden')) {
            const mapFrame = document.getElementById('map-frame');
            mapFrame.src = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3784.435849383152!2d-70.694396!3d19.451775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8eb1c5e5e0b1d7a5%3A0x9a1d3b1c1c1c1c1c!2sSantiago%20de%20los%20caballeros%2C%20gurabo%20calle%2020!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus';
            mapContainer.classList.remove('hidden');
        } else {
            mapContainer.classList.add('hidden');
        }
    });
}

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

    const container = document.getElementById('categories-grid');
    if (!container) return;
    
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
    
    if (!mobileFooter || !header) return;
    
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
        const container = document.querySelector('#nouveautes .produits-grid');
        if (container) {
            container.innerHTML = `
                <div class="error">
                    Impossible de charger les produits. Rechargez la page.
                </div>
            `;
        }
    }
}

// Afficher les produits
function afficherProduits(produitsAAfficher) {
    const container = document.querySelector('#nouveautes .produits-grid');
    if (!container) return;
    
    if (!produitsAAfficher || produitsAAfficher.length === 0) {
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
    if (!tousLesProduits || tousLesProduits.length === 0) return;
    
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
    if (!tousLesProduits || tousLesProduits.length === 0) return;
    
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
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const terme = document.getElementById('search-input').value.toLowerCase();
            const produitsFiltres = tousLesProduits.filter(produit => 
                produit.nom.toLowerCase().includes(terme) || 
                (produit.description && produit.description.toLowerCase().includes(terme))
            );
            afficherProduits(produitsFiltres);
        });
    }

    // Bouton Catégories
    const toggleButton = document.getElementById('toggle-categories');
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            const categoriesGrid = document.getElementById('categories-grid');
            if (categoriesGrid) {
                categoriesGrid.classList.toggle('hidden');
                this.classList.toggle('active');
            }
        });
    }

    // Boutons de la modale
    const addToCartBtn = document.getElementById('modal-add-to-cart');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            if (produitActuel) {
                ajouterAuPanier(produitActuel.id);
                closeModal();
            }
        });
    }

    const shareBtn = document.getElementById('modal-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', partagerProduit);
    }
    
    // Fermeture modale
    const productModal = document.getElementById('product-modal');
    if (productModal) {
        productModal.addEventListener('click', (e) => {
            if (e.target === productModal) {
                closeModal();
            }
        });
    }
    
    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            const templateParams = {
                from_name: name,
                from_email: email,
                subject: subject,
                message: message,
                to_email: "marcshop0705@gmail.com"
            };

            // Envoyer le message via EmailJS
            emailjs.send("service_abc123", "template_xyz456", templateParams)
                .then(() => {
                    showNotification('Message envoyé avec succès !');
                    contactForm.reset();
                })
                .catch((error) => {
                    console.error("Erreur d'envoi:", error);
                    showNotification('Erreur lors de l\'envoi du message');
                });
        });
    }
}

// Ouvrir la modale
function openProductModal(productId, event = null) {
    if (event) event.stopPropagation();
    
    produitActuel = tousLesProduits.find(p => p.id === productId);
    if (!produitActuel) return;

    // Mettre à jour les informations du produit
    document.getElementById('modal-title').textContent = produitActuel.nom;
    document.getElementById('modal-price').innerHTML = `
        <span class="current-price">${escapeHtml(produitActuel.prix)} $</span>
        ${produitActuel.oldPrice ? `<span class="old-price">${escapeHtml(produitActuel.oldPrice)} $</span>` : ''}
    `;
    document.getElementById('modal-description').textContent = produitActuel.description || 'Aucune description disponible';
    document.getElementById('modal-category').textContent = produitActuel.category || 'Non spécifiée';
    document.getElementById('modal-availability').textContent = produitActuel.availability || 'En stock';
    document.getElementById('modal-rating').textContent = produitActuel.rating || 'Non évalué';

    // Lien WhatsApp
    const whatsappLink = document.getElementById('whatsapp-product-link');
    if (whatsappLink) {
        whatsappLink.href = `https://wa.me/18093978951?text=${encodeURIComponent(
            `Bonjour MarcShop! Je suis intéressé par votre produit "${produitActuel.nom}" (${produitActuel.prix}$). Pouvez-vous m'en dire plus ?`
        )}`;
    }

    // Gestion des images
    const thumbnailContainer = document.querySelector('.thumbnail-container');
    const mainImage = document.getElementById('modal-main-image');
    if (thumbnailContainer && mainImage) {
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
    }
    
    // Ouvrir la modale
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Fermer la modale
function closeModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
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
            // Nettoyer l'URL
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
