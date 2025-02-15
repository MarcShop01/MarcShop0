document.addEventListener("DOMContentLoaded", function () {
    // Récupérer les produits depuis le LocalStorage
    const products = JSON.parse(localStorage.getItem("products")) || [];

    // Sélectionner l'élément où les produits vont être affichés
    const productList = document.getElementById("product-list");

    // Vérifier si des produits existent
    if (products.length === 0) {
        productList.innerHTML = "<p>Aucun produit disponible pour le moment.</p>";
    } else {
        // Créer les éléments pour chaque produit et les ajouter à la page
        products.forEach(product => {
            const productDiv = document.createElement("div");
            productDiv.classList.add("product-item");

            productDiv.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <span>${product.price} €</span>
                <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
            `;

            // Ajouter le produit à la liste
            productList.appendChild(productDiv);
        });
    }

    // Ajouter une fonctionnalité pour ajouter les produits au panier
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const productId = this.getAttribute("data-id");
            addToCart(productId);
        });
    });

    // Fonction pour ajouter un produit au panier avec gestion de la quantité
    function addToCart(productId) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let product = products.find(p => p.id === productId);

        if (product) {
            let existingProduct = cart.find(p => p.id === productId);
            
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                product.quantity = 1;
                cart.push(product);
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            alert(${product.name} ajouté au panier !);
        }
    }
});