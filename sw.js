/* wod-clock service worker: works offline after the first visit.
   Jede Version hat ihren eigenen, vollständigen Cache (Name = Commit, gesetzt vom Deploy). Ausgeliefert wird nur aus
   diesem Cache, so gibt es nie ein Gemisch aus alten und neuen Dateien. Neue Versionen erkennt js/main.js. */
const CACHE = 'wod-clock-v4';
const ASSETS = [
  './',
  './index.html',
  './css/app.css',
  './js/main.js',
  './js/util.js',
  './js/led.js',
  './js/state.js',
  './js/workout.js',
  './js/sound.js',
  './js/wheel.js',
  './js/setup.js',
  './js/saved.js',
  './js/splits.js',
  './js/progress.js',
  './js/run.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/favicon-32.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', e => {
  // cache: 'reload' umgeht den HTTP-Cache des Browsers (GitHub Pages: 10 min), sonst landen alte Dateien im neuen Cache
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Cache zuerst, sonst Netz (und merken, z. B. die Schriften von Google Fonts); offline fällt eine Navigation auf index.html zurück
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(req, { ignoreSearch: req.mode === 'navigate' });
      if (cached) return cached;
      try {
        const res = await fetch(req);
        if (res.ok || res.type === 'opaque') cache.put(req, res.clone());
        return res;
      }
      catch (err) { return req.mode === 'navigate' ? cache.match('./index.html') : Response.error(); }
    })
  );
});
