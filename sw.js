const cacheName = 'Veronika_Syncakova_C00288340-UI-Programming-Module-Project';
const filesToCache = [
  '.',
  'main.js',
  'index.html',
  'assets/css/style.css',
  './sample-pwa/',
  './Veronika_Syncakova_C00288340-UI-Programming-Module-Project/form.js',
  './Veronika_Syncakova_C00288340-UI-Programming-Module-Project/script.js',
  './Veronika_Syncakova_C00288340-UI-Programming-Module-Project/player.js',
  './Veronika_Syncakova_C00288340-UI-Programming-Module-Project/intro.js',
  './Veronika_Syncakova_C00288340-UI-Programming-Module-Project/globals.js',
  './Veronika_Syncakova_C00288340-UI-Programming-Module-Project/game.js',
  './Veronika_Syncakova_C00288340-UI-Programming-Module-Project/enemy.js',
  './Veronika_Syncakova_C00288340-UI-Programming-Module-Project/endScreen.js',
  './Veronika_Syncakova_C00288340-UI-Programming-Module-Project/index.html',
  './Veronika_Syncakova_C00288340-UI-Programming-Module-Project/assets/css/style.css',

];

self.addEventListener('install', async e => {
  const cache = await caches.open(cacheName);
  await cache.addAll(filesToCache);
  return self.skipWaiting();
});

self.addEventListener('activate', e => {
  self.clients.claim();
});

self.addEventListener('fetch', async e => {
  const req = e.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    e.respondWith(cacheFirst(req));
  } else {
    e.respondWith(networkAndCache(req));
  }
});

async function cacheFirst(req) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req.url);
  return cached || fetch(req);
}

async function networkAndCache(req) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(req);
    await cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await cache.match(req);
    return cached;
  }
}