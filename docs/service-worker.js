// Offline support for published builds (adapted from the Blazor WebAssembly PWA template).
//
// On install, every file listed in service-worker-assets.js (generated at publish time) is cached,
// so new pages / JSON / images added under wwwroot need no changes here.
// After the first successful online visit the app runs with no connection.
//
// Strategy: cache-first. A new deployment is downloaded in the background and takes over the next
// time the app is fully closed and reopened.

self.importScripts('./service-worker-assets.js');

self.addEventListener('install', event => event.waitUntil(onInstall(event)));
self.addEventListener('activate', event => event.waitUntil(onActivate(event)));
self.addEventListener('fetch', event => event.respondWith(onFetch(event)));

// Cache storage is shared by every app on the same origin (e.g. all of github.io),
// so the app's path is part of the name: apps never delete each other's caches.
const cacheNamePrefix = `structai-offline:${new URL(self.registration.scope).pathname}:`;
// Cache used by the old hand-written service worker; no longer needed
const legacyCacheNames = ['structai-cache-v1'];
const cacheName = `${cacheNamePrefix}${self.assetsManifest.version}`;

const offlineAssetsInclude = [
    /\.dll$/, /\.wasm$/, /\.html$/, /\.js$/, /\.json$/, /\.css$/, /\.webmanifest$/,
    /\.woff2?$/, /\.ttf$/, /\.png$/, /\.jpe?g$/, /\.gif$/, /\.ico$/, /\.svg$/,
    /\.blat$/, /\.dat$/
];
const offlineAssetsExclude = [/^service-worker\.js$/];

// Files that must be available offline but may not appear in the assets list
// (e.g. AppSettings.json is linked in by the publish profile). Missing ones are skipped.
const extraAssets = [
    'manifest.webmanifest',
    'AppData/metadata/AppSettings.json'
];

async function onInstall(event) {
    console.info('Service worker: install', cacheName);

    // No integrity check: index.html is rewritten after publish (base href), so its hash would not match.
    const requests = self.assetsManifest.assets
        .filter(asset => offlineAssetsInclude.some(pattern => pattern.test(asset.url)))
        .filter(asset => !offlineAssetsExclude.some(pattern => pattern.test(asset.url)))
        .map(asset => new Request(asset.url, { cache: 'no-cache' }));

    const cache = await caches.open(cacheName);
    await cache.addAll(requests);

    await Promise.allSettled(
        extraAssets.map(url => cache.add(new Request(url, { cache: 'no-cache' }))));
}

async function onActivate(event) {
    console.info('Service worker: activate');

    const keys = await caches.keys();
    await Promise.all(keys
        .filter(key => (key.startsWith(cacheNamePrefix) && key !== cacheName) || legacyCacheNames.includes(key))
        .map(key => caches.delete(key)));
}

async function onFetch(event) {
    const request = event.request;

    // Only same-origin GETs are served from the cache (POSTs / other sites go to the network)
    if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) {
        return fetch(request);
    }

    // Any page navigation (including deep links like /ceo-value-time/results) gets the app shell.
    const key = request.mode === 'navigate' ? 'index.html' : request;

    const cache = await caches.open(cacheName);
    // ignoreSearch: requests like AppSettings.json?cacheBust=... still hit the cached copy offline
    const cached = await cache.match(key, { ignoreSearch: true });
    return cached || fetch(request);
}
