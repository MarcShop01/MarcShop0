document.addEventListener('DOMContentLoaded', async function() {
    const productsContainer = document.getElementById("products-container");
    const productsJsonContainer = document.getElementById("products-json");
    const addProductForm = document.getElementById("add-product-form");

    async function fetchProducts() {
        try {
            const response = await fetch("produits.json");
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
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Prix : ${product.price} $</p>
                <img src="${product.image}" alt="${product.name}">
                <button onclick="addToCart('${product.name}')">Ajouter au panier</button>
            `;
            productsContainer.appendChild(productElement);
        });
    }

    function updateJsonDisplay(products) {
        productsJsonContainer.textContent = JSON.stringify(products, null, 4);
    }

    addProductForm.addEventListener("submit", function(event) {
        event.preventDefault();
        let products = getProducts();

        const newProduct = {
            id: products.length + 1,
            name: document.getElementById("product-name").value,
            price: document.getElementById("product-price").value,
            image: document.getElementById("product-image").value,
            description: document.getElementById("product-description").value
        };

        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();
        updateJsonDisplay(products);
    });

    displayProducts();
});
