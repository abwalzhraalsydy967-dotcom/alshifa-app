const CACHE_NAME = 'alshifa-v2';

// Install - only cache true static assets (icons, manifest)
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate - clear ALL old caches on every deploy
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(cacheNames.map((name) => caches.delete(name)));
    }).then(() => self.clients.claim())
  );
});

// Fetch - network only for everything, no caching of dynamic content
self.addEventListener('fetch', (event) => {
  // Don't interfere with API calls
  if (event.request.url.includes('/api/')) return;
  
  // For navigation requests, always go to network
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response('Offline', { status: 503 });
      })
    );
    return;
  }

  // For static assets, network first (no caching)
  event.respondWith(
    fetch(event.request).catch(() => new Response('Offline', { status: 503 }))
  );
});
