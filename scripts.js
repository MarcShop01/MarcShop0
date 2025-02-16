document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.getElementById("products-container");

    function getProducts() {
        return JSON.parse(localStorage.getItem("products")) || [];
    }

    function displayProducts() {
        let products = getProducts();
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

    displayProducts();
});

function addToCart(productName) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let products = JSON.parse(localStorage.getItem("products")) || [];

    let product = products.find(p => p.name === productName);
    let cartItem = cart.find(p => p.name === productName);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Produit ajouté au panier !");
}
