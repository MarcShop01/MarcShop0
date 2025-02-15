document.addEventListener("DOMContentLoaded", function () {
    console.log("Chargement des scripts...");

    const signupForm = document.getElementById("signup-form");

    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirm-password").value;

            if (!validateEmail(email)) {
                alert("Veuillez entrer une adresse e-mail valide.");
                return;
            }

            if (!validatePassword(password)) {
                alert("Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.");
                return;
            }

            if (password !== confirmPassword) {
                alert("Les mots de passe ne correspondent pas !");
                return;
            }

            let users = JSON.parse(localStorage.getItem("users")) || [];

            if (users.some(user => user.email === email)) {
                alert("Cet e-mail est déjà utilisé !");
                return;
            }

            const newUser = {
                email: email,
                password: hashPassword(password) 
            };

            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));

            alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
            window.location.href = "connexion.html"; 
        });
    }
});

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password);
}

function hashPassword(password) {
    return btoa(password); // Base64 (non sécurisé mais illustratif)
}