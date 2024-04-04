const CACHE_NAME = 'ecommerce-pwa-cache-v1';
const urlsToCache = [
    '/',
    './index.html',
    './images/vege.png',
];
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
});
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.filter((name) => {
                        return name !== CACHE_NAME;
                    }).map((name) => {
                        return caches.delete(name);
                    })
                );
            })
    );
});
self.addEventListener('fetch', function (event) {
    console.log('fetch event triggered');
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});
self.addEventListener('sync', function (event) {

    if (event.tag === 'syncData') {
        console.log('Sync successful');
    }
});
self.addEventListener('push', function (event) {
    console.log("push message clicked");
    if (event.data) {
        var data = event.data.json();
        if (data.method == "pushMessage") {
            console.log("Push notification sent");
            event.waitUntil(
                self.registration.showNotification("new notification", {
                    body: data.message,
                    icon: 'images/vege.png'
                })
            );
        }
    }
});