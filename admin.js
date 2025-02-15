document.addEventListener("DOMContentLoaded", function () {
    let productList = document.getElementById("product-list");
    let addProductForm = document.getElementById("add-product-form");
    let products = [];

    // Charger les produits depuis produits.json (ne fonctionne pas sur GitHub Pages)
    fetch("produits.json")
        .then(response => response.json())
        .then(data => {
            products = data;
            localStorage.setItem("products", JSON.stringify(products));
            afficherProduits();
        })
        .catch(error => console.error("Erreur lors du chargement des produits:", error));

    function afficherProduits() {
        productList.innerHTML = "";
        products.forEach((product, index) => {
            let productDiv = document.createElement("div");
            productDiv.className = "product-item";
            productDiv.innerHTML = `
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <p><strong>Prix :</strong> ${product.price} $</p>
                <img src="${product.image}" alt="${product.name}" width="100">
                <button onclick="deleteProduct(${index})">Supprimer</button>
                <button onclick="editProduct(${index})">Modifier</button>
            `;
            productList.appendChild(productDiv);
        });
    }

    addProductForm.addEventListener("submit", function (e) {
        e.preventDefault();
        let name = document.getElementById("product-name").value;
        let description = document.getElementById("product-description").value;
        let price = document.getElementById("product-price").value;
        let image = document.getElementById("product-image").value;
        
        if (!name || !description || !price || !image) {
            alert("Veuillez remplir tous les champs !");
            return;
        }

        let newProduct = { name, description, price, image };
        products.push(newProduct);
        localStorage.setItem("products", JSON.stringify(products));

        addProductForm.reset();
        afficherProduits();
    });
});

function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    location.reload();
}

function editProduct(index) {
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let product = products[index];
    
    document.getElementById("product-name").value = product.name;
    document.getElementById("product-description").value = product.description;
    document.getElementById("product-price").value = product.price;
    document.getElementById("product-image").value = product.image;

    document.getElementById("add-product-form").onsubmit = function (e) {
        e.preventDefault();
        product.name = document.getElementById("product-name").value;
        product.description = document.getElementById("product-description").value;
        product.price = document.getElementById("product-price").value;
        product.image = document.getElementById("product-image").value;

        products[index] = product;
        localStorage.setItem("products", JSON.stringify(products));
        location.reload();
    };
}