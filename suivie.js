document.getElementById("order-tracking-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Récupérer le numéro de commande saisi par l'utilisateur
    let orderId = parseInt(document.getElementById("order-id").value, 10); // Convertir en nombre

    // Récupérer les commandes depuis LocalStorage
    let orders = JSON.parse(localStorage.getItem("orders")) || [];

    // Chercher la commande par son ID
    let order = orders.find(order => order.id === orderId);

    if (order) {
        // Afficher le statut de la commande
        document.getElementById("order-status").style.display = "block";
        document.getElementById("order-message").innerHTML = <strong>Commande #${order.id} :</strong> ${order.status};

        // Générer la liste des produits
        let productList = <h3>Produits commandés :</h3><ul>;
        order.products.forEach(product => {
            productList += <li>${product.name} - ${product.price} $ x ${product.quantity}</li>;
        });
        productList += </ul><p><strong>Total :</strong> ${order.total} $</p>;

        // Ajouter les détails sous le statut
        document.getElementById("order-message").innerHTML += productList;
    } else {
        alert("Commande introuvable !");
    }
});