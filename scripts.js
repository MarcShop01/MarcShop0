document.addEventListener('DOMContentLoaded', async function() {
    const productsContainer = document.getElementById("products-container");

    async function fetchProducts() {
        try {
            const response = await fetch("produits.json"); // Assure-toi que le chemin est correct
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const products = await response.json();
            console.log("Produits chargés : ", products);
            localStorage.setItem("products", JSON.stringify(products));
            return products;
        } catch (error) {
            console.error("Erreur lors du chargement des produits : ", error);
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
            const productImage = product.image || 'path/to/your/default.jpg'; // Modifie cette ligne avec le chemin correct
            const productDescription = product.description || 'Pas de description disponible';
            const productPrice = product.price || 'Prix non disponible';

            productElement.innerHTML = `
                <h3>${productName}</h3>
                <p>${productDescription}</p>
                <p>Prix : ${productPrice} $</p>
                <img src="${productImage}" alt="${productName}">
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
