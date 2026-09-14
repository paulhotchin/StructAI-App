// E:\work\TQ\Kepler\StructAI\StructAI.App\wwwroot.deploy\service-worker.js

const CACHE = "structai-cache-v1";

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE).then(cache => {
            return cache.addAll([
                "/",
                "index.html",
                "manifest.webmanifest",
                "css/app.css",
                "icon-192.png",
                "icon-512.png"
            ]);
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE).map(key => caches.delete(key))
            )
        )
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(resp => {
            return resp || fetch(event.request);
        })
    );
});
