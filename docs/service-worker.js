// E:\work\TQ\Kepler\StructAI\StructAI.App\wwwroot.deploy\service-worker.js

// GitHub Pages–safe service worker for StructAI-App

const BASE = "/StructAI-App/";
const CACHE = "structai-cache-v1";

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE).then(cache => {
            return cache.addAll([
                BASE,                          // root of the app
                BASE + "index.html",
                BASE + "manifest.webmanifest",
                BASE + "css/app.css",
                BASE + "favicon.png",
                BASE + "icon-192.png",
                BASE + "icon-512.png"
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
