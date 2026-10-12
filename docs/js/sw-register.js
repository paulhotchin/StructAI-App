// Registers the service worker (offline support) and shows a "new version available" banner
// when a newer version of the app has been downloaded in the background.
(function () {
    if (!('serviceWorker' in navigator)) {
        return;
    }

    let registration = null;
    let banner = null;
    let dismissed = false;
    let applying = false;

    function applyUpdate() {
        applying = true;

        if (registration && registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            // controllerchange reloads the page; this is only a fallback
            setTimeout(function () { location.reload(); }, 3000);
        } else {
            location.reload();
        }
    }

    function button(text, primary) {
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = text;
        b.style.cssText =
            'border:1px solid #fff;border-radius:4px;padding:6px 12px;font:inherit;cursor:pointer;' +
            (primary ? 'background:#fff;color:#03173d;font-weight:600;' : 'background:transparent;color:#fff;');
        return b;
    }

    function showBanner() {
        if (banner || dismissed) {
            return;
        }

        banner = document.createElement('div');
        banner.setAttribute('role', 'status');
        banner.style.cssText =
            'position:fixed;left:50%;transform:translateX(-50%);width:calc(100% - 16px);max-width:480px;' +
            'bottom:calc(var(--bottom-action-bar-height, 90px) + 8px);z-index:4000;box-sizing:border-box;' +
            'display:flex;align-items:center;gap:8px;padding:10px 12px;border-radius:6px;' +
            'background:#03173d;color:#fff;font:14px Helvetica,Arial,sans-serif;' +
            'box-shadow:0 4px 12px rgba(0,0,0,.35);';

        const text = document.createElement('span');
        text.textContent = 'New version available.';
        text.style.cssText = 'flex:1 1 auto;';

        const reload = button('Reload', true);
        reload.addEventListener('click', applyUpdate);

        const later = button('Later', false);
        later.addEventListener('click', function () {
            dismissed = true;
            banner.remove();
            banner = null;
        });

        banner.append(text, reload, later);
        document.body.appendChild(banner);
    }

    // A new service worker was installed: show the banner once it is waiting
    function watch(reg) {
        reg.addEventListener('updatefound', function () {
            const worker = reg.installing;
            if (!worker) {
                return;
            }

            worker.addEventListener('statechange', function () {
                // 'controller' is null on the very first install - nothing to update then
                if (worker.state === 'installed' && navigator.serviceWorker.controller) {
                    showBanner();
                }
            });
        });
    }

    function checkForUpdate() {
        if (registration) {
            registration.update().catch(function () { /* offline: ignore */ });
        }
    }

    // New version has taken over: reload so the page uses its files
    navigator.serviceWorker.addEventListener('controllerchange', function () {
        if (applying) {
            location.reload();
        }
    });

    function register() {
        navigator.serviceWorker.register('service-worker.js').then(function (reg) {
            registration = reg;
            watch(reg);

            if (reg.waiting && navigator.serviceWorker.controller) {
                showBanner();
            }

            // Look for a new version when the app is brought back to the foreground, and hourly
            document.addEventListener('visibilitychange', function () {
                if (document.visibilityState === 'visible') {
                    checkForUpdate();
                }
            });
            setInterval(checkForUpdate, 60 * 60 * 1000);
        });
    }

    if (document.readyState === 'complete') {
        register();
    } else {
        window.addEventListener('load', register);
    }
})();
