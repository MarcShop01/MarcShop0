document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("signup-form").addEventListener("submit", function (e) {
        e.preventDefault();

        let email = document.getElementById("email").value.trim();
        let password = document.getElementById("password").value.trim();
        let confirmPassword = document.getElementById("confirm-password").value.trim();

        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas !");
            return;
        }

        if (password.length < 6) {
            alert("Le mot de passe doit contenir au moins 6 caractères !");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];

        if (users.some(user => user.email === email)) {
            alert("Cet email est déjà utilisé !");
            return;
        }

        let newUser = {
            email: email,
            password: password, // ⚠️ Stocker en clair n'est pas sécurisé, mieux vaut hacher
            role: "admin" // On met "admin" pour donner accès à admin.html
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
        window.location.href = "connexion.html";
    });
});
