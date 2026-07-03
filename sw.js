// שלוה — Service Worker (עבודה גם ללא אינטרנט)
// build: 2026-07-03b
const CACHE = 'shalva-v7';
const ASSETS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(c => c || fetch(e.request).then(r => {
      if (r.ok && e.request.url.startsWith(self.location.origin)) {
        const clone = r.clone();
        caches.open(CACHE).then(cc => cc.put(e.request, clone));
      }
      return r;
    }).catch(() => caches.match('./index.html')))
  );
});
