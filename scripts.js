document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("add-product-form").addEventListener("submit", function (e) {
        e.preventDefault();

        let name = document.getElementById("product-name").value.trim();
        let description = document.getElementById("product-description").value.trim();
        let price = parseFloat(document.getElementById("product-price").value.trim());
        let image = document.getElementById("product-image").value.trim();

        if (!name || !description || isNaN(price)) {
            alert("Tous les champs sont requis !");
            return;
        }

        if (!image) {
            image = 'default.jpg';
        }

        let products = JSON.parse(localStorage.getItem("products")) || [];

        let newProduct = {
            name: name,
            description: description,
            price: price,
            image: image
        };

        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));

        alert("Produit ajouté avec succès !");
        displayProducts();
    });

    function displayProducts() {
        let products = JSON.parse(localStorage.getItem("products")) || [];
        let productList = document.getElementById("product-list");
        productList.innerHTML = "";

        if (products.length === 0) {
            productList.innerHTML = "<p>Aucun produit disponible.</p>";
            return;
        }

        products.forEach(product => {
            let productElement = document.createElement("div");
            productElement.className = "product";
            const productImage = product.image || 'default.jpg';
            productElement.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Prix : ${product.price} $</p>
                <img src="${productImage}" alt="${product.name}">
            `;
            productList.appendChild(productElement);
        });
    }

    displayProducts();
});
