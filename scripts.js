document.addEventListener('DOMContentLoaded', async function() {
    const productsContainer = document.getElementById("products-container");
    const defaultImage = "https://i.imgur.com/YOUR_DEFAULT_IMAGE.jpg"; // Mets ici une vraie URL d'image par défaut
    
    async function fetchProducts() {
        try {
            const response = await fetch("./produits.json"); // Assure-toi que ce fichier est bien à la racine du projet
            if (!response.ok) {
                throw new Error('Erreur réseau : ' + response.statusText);
            }
            const products = await response.json();
            console.log("Produits chargés :", products);
            localStorage.setItem("products", JSON.stringify(products));
            return products;
        } catch (error) {
            console.error("Erreur lors du chargement des produits :", error);
            return [];
        }
    }

    function getProducts() {
        return JSON.parse(localStorage.getItem("products")) || [];
    }

    async function displayProducts() {
        let products = getProducts();
        if (products.length === 0) {
            products = await fetchProducts();
        }

        productsContainer.innerHTML = "";

        if (products.length === 0) {
            productsContainer.innerHTML = "<p>Aucun produit disponible.</p>";
            return;
        }

        products.forEach(product => {
            let productElement = document.createElement("div");
            productElement.className = "product";
            const productName = product.name || 'Nom de produit inconnu';
            const productImage = product.image && product.image.startsWith("http") ? product.image : defaultImage;
            const productDescription = product.description || 'Pas de description disponible';
            const productPrice = product.price !== undefined ? product.price + ' $' : 'Prix non disponible';

            productElement.innerHTML = `
                <h3>${productName}</h3>
                <p>${productDescription}</p>
                <p>Prix : ${productPrice}</p>
                <img src="${productImage}" alt="${productName}" onerror="this.src='${defaultImage}'">
                <button onclick="addToCart('${productName}')">Ajouter au panier</button>
            `;
            productsContainer.appendChild(productElement);
        });

        // Ajustement pour les appareils mobiles
        if (window.innerWidth <= 768) {
            document.querySelectorAll('.product').forEach(product => {
                product.style.width = '100%';
                product.style.marginBottom = '20px';
            });
        }
    }

    displayProducts();
});
