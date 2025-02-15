document.getElementById("signup-form").addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confirmPassword = document.getElementById("confirm-password").value.trim();

    if (!name) {
        alert("Veuillez entrer votre nom !");
        return;
    }

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

    let token = generateToken();
    let newUser = {
        name: name,
        email: email,
        password: password,
        role: "user",
        confirmed: false,
        confirmationToken: token
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    sendConfirmationEmail(email, token);

    alert("Inscription réussie ! Veuillez vérifier votre e-mail pour activer votre compte.");
    window.location.href = "connexion.html";
});

// Fonction pour générer un token unique
function generateToken() {
    return Math.random().toString(36).substr(2) + Date.now().toString(36);
}

// Simule l'envoi d'un e-mail avec un lien de confirmation
function sendConfirmationEmail(email, token) {
    let confirmationLink = http://localhost/confirmation.html?token=${token};
    
    console.log(🔗 Lien de confirmation : ${confirmationLink});
    
    alert(Un email a été envoyé à ${email} avec un lien de confirmation.);
}