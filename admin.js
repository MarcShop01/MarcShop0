
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("add-product-form");
    const productList = document.getElementById("product-list");

    let produits = JSON.parse(localStorage.getItem("produits")) || [];
    let produitEnCours = null;

    function afficherProduits() {
        productList.innerHTML = "";
        produits.forEach((produit, index) => {
            productList.innerHTML += `
                <div>
                    <img src="${produit.image}" width="100">
                    <h3>${produit.nom}</h3>
                    <p>${produit.description}</p>
                    <p><strong>${produit.prix}€</strong></p>
                    <button onclick="modifierProduit(${index})">Modifier</button>
                    <button onclick="supprimerProduit(${index})">Supprimer</button>
                </div>
            `;
        });
    }
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let produit = {
            nom: document.getElementById("product-name").value,
            description: document.getElementById("product-description").value,
            prix: document.getElementById("product-price").value,
            image: document.getElementById("product-image").value
        };

        if (produitEnCours === null) {
            produits.push(produit);
        } else {
            produits[produitEnCours] = produit;
            produitEnCours = null;
        }

        localStorage.setItem("produits", JSON.stringify(produits));
        form.reset();
        afficherProduits();
    });

    window.supprimerProduit = (index) => {
        produits.splice(index, 1);
        localStorage.setItem("produits", JSON.stringify(produits));
        afficherProduits();
    };

    window.modifierProduit = (index) => {
        let produit = produits[index];
        document.getElementById("product-name").value = produit.nom;
        document.getElementById("product-description").value = produit.description;
        document.getElementById("product-price").value = produit.prix;
        document.getElementById("product-image").value = produit.image;

        produitEnCours = index;
    };

    afficherProduits();
});
