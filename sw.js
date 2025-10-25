// Nombre de cachés
const CACHE_NAME = 'callselect-app-v1';
const CACHE_DYNAMIC = 'callselect-dynamic-v1';

// AppShell - Cache Only
const APP_SHELL = [
  '/callSelect/',
  '/callSelect/index.html',
  '/callSelect/calendar.html',
  '/callSelect/form.html',
  '/callSelect/main.js',
  '/callSelect/styles.css',
  '/callSelect/manifest.json'
];

// Archivos dinámicos
const DYNAMIC_FILES = [
  '/callSelect/calendar.js',
  '/callSelect/form.js'
];

// Install Event - Pre-cache AppShell
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching App Shell');
        return cache.addAll(APP_SHELL);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Limpiar cachés viejos
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== CACHE_DYNAMIC) {
            console.log('[SW] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (!request.url.startsWith('http')) return;

  // AppShell - Cache Only
  if (isAppShell(url.pathname)) {
    event.respondWith(cacheOnly(request));
    return;
  }

  // Archivos dinámicos - Cache First, Network Fallback
  if (isDynamicFile(url.pathname)) {
    event.respondWith(cacheFirstNetworkFallback(request));
    return;
  }

  // Resto - Network First
  event.respondWith(fetch(request));
});

// Helpers
function isAppShell(pathname) {
  return APP_SHELL.includes(pathname);
}

function isDynamicFile(pathname) {
  return DYNAMIC_FILES.includes(pathname);
}

// Estrategias de caché
async function cacheOnly(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  return fetch(request);
}

async function cacheFirstNetworkFallback(request) {
  const cache = await caches.open(CACHE_DYNAMIC);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error('[SW] Network Fallback failed for:', request.url, error);
    const fallback = await cache.match(request);
    return fallback || new Response('Offline', { status: 503 });
  }
}
