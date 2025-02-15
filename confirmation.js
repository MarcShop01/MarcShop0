document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let loginAttempts = JSON.parse(localStorage.getItem("loginAttempts")) || {}; 

    let user = users.find(user => user.email === email);

    let currentTime = Date.now();
    if (loginAttempts[email] && loginAttempts[email].blockedUntil > currentTime) {
        let remainingTime = Math.ceil((loginAttempts[email].blockedUntil - currentTime) / 1000);
        alert(Trop de tentatives ! Réessayez dans ${remainingTime} secondes.);
        return;
    }

    if (!user) {
        alert("Email incorrect !");
        return;
    }

    if (user.password !== password) {
        if (!loginAttempts[email]) {
            loginAttempts[email] = { count: 1, blockedUntil: 0 };
        } else {
            loginAttempts[email].count += 1;
        }

        if (loginAttempts[email].count >= 3) {
            loginAttempts[email].blockedUntil = currentTime + (5 * 60 * 1000);
            alert("Trop de tentatives ! Vous êtes bloqué pendant 5 minutes.");

            // Envoi d'un email d'alerte
            sendSecurityEmail(email);
        } else {
            alert(Mot de passe incorrect ! Tentative ${loginAttempts[email].count}/3);
        }

        localStorage.setItem("loginAttempts", JSON.stringify(loginAttempts));
        return;
    }

    delete loginAttempts[email];
    localStorage.setItem("loginAttempts", JSON.stringify(loginAttempts));
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    alert("Connexion réussie !");
    window.location.href = user.role === "admin" ? "admin.html" : "index.html";
});

// Fonction pour envoyer un email d'alerte via EmailJS
function sendSecurityEmail(email) {
    emailjs.send("service_xxxxx", "template_xxxxx", {
        user_email: email,
        message: "Nous avons détecté plusieurs tentatives de connexion échouées à votre compte. Si ce n'est pas vous, changez votre mot de passe immédiatement."
    }).then(function(response) {
        console.log("Email envoyé avec succès", response.status, response.text);
    }, function(error) {
        console.log("Erreur lors de l'envoi de l'email", error);
    });
}