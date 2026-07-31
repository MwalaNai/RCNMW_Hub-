const CACHE_NAME = 'rcnmw-register-v4'; // bump this any time index.html changes
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Requests for the HTML shell (the page itself, or any navigation) use
// network-first: always try to get the latest version first, and only
// fall back to the cached copy if the network is unavailable (offline).
// This is what actually matters here — it's what index.html falls under,
// so config/PIN/code changes show up on next load instead of being stuck
// behind a stale cache indefinitely.
function isHtmlRequest(event) {
  return event.request.mode === 'navigate' ||
    (event.request.method === 'GET' && event.request.headers.get('accept')?.includes('text/html'));
}

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (isHtmlRequest(event)) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  // Everything else (icons, manifest, etc.) stays cache-first — those
  // rarely change and don't hold anything time-sensitive like config.
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (event.request.method === 'GET' && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
