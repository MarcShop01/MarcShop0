const CACHE_NAME = 'marcshop-cache-v2'; // Incrémente la version pour forcer la mise à jour
const urlsToCache = [
    '/',
    '/index.html',
    '/panier.html',
    '/produits.html',
    '/styles.css',
    '/scripts.js',
    '/images/icon-192x192.png',
    '/images/icon-512x512.png'
];

// 📌 Installation du service worker et mise en cache des fichiers
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Mise en cache des fichiers...');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting()) // Activation immédiate
    );
});

// 📌 Activation : Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log([Service Worker] Suppression de l'ancien cache: ${cache});
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Prend le contrôle immédiatement
});

// 📌 Interception des requêtes et gestion du cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    // Retourne la réponse du cache et met à jour en arrière-plan
                    fetch(event.request).then((response) => {
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, response.clone());
                        });