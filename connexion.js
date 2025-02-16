document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("login-form").addEventListener("submit", function (e) {
        e.preventDefault();

        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value.trim();
        
        let users = JSON.parse(localStorage.getItem("users")) || [];
        let user = users.find(user => user.email === email && user.password === password);

        if (user) {
            sessionStorage.setItem("admin", "true"); // Stockage de l'état de connexion
            alert("Connexion réussie ! Redirection vers la page d'administration...");
            window.location.href = "admin.html"; // Redirection vers la page d'administration
        } else {
            alert("Email ou mot de passe incorrect !");
        }
    });
});
