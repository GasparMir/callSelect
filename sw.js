const CACHE_NAME = 'pwa-app-v1';
const CACHE_DYNAMIC = 'pwa-dynamic-v1';

// AppShell - Cache Only Strategy
const APP_SHELL = [
  '/',
  '/index.html',
  '/calendar.html',
  '/form.html',
  '/main.js',
  '/styles.css',
  '/manifest.json'
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

// Activate Event - Clean old caches
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

// Fetch Event - Caching Strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip chrome-extension and non-http(s) requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // AppShell Resources - Cache Only
  if (isAppShell(url.pathname)) {
    event.respondWith(cacheOnly(request));
    return;
  }

  // Dynamic Resources (CDN) - Cache First, Network Fallback
  if (isDynamicResource(url.href)) {
    event.respondWith(cacheFirstNetworkFallback(request));
    return;
  }

  // Default - Network First
  event.respondWith(fetch(request));
});

// Check if resource is part of AppShell
function isAppShell(pathname) {
  return APP_SHELL.some(path => {
    if (path === '/') return pathname === '/' || pathname === '/index.html';
    return pathname.endsWith(path);
  });
}

// Check if resource is dynamic (CDN resources)
function isDynamicResource(href) {
  return (
    href.includes('cdnjs.cloudflare.com') ||
    href.includes('cdn.jsdelivr.net') ||
    href.includes('unpkg.com')
  );
}

// Cache Only Strategy
async function cacheOnly(request) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    
    if (cached) {
      console.log('[SW] Cache Only - Serving:', request.url);
      return cached;
    }
    
    return new Response('Not found in cache', { status: 404 });
  } catch (error) {
    console.error('[SW] Cache Only error:', error);
    return new Response('Cache error', { status: 500 });
  }
}

// Cache First, Network Fallback Strategy
async function cacheFirstNetworkFallback(request) {
  try {
    const cache = await caches.open(CACHE_DYNAMIC);
    const cached = await cache.match(request);

    if (cached) {
      console.log('[SW] Cache First - Serving from cache:', request.url);
      return cached;
    }

    // Not in cache, fetch from network
    console.log('[SW] Cache First - Fetching from network:', request.url);
    const response = await fetch(request);
    
    // Only cache successful responses
    if (response && response.status === 200 && response.type !== 'error') {
      const responseToCache = response.clone();
      cache.put(request, responseToCache);
      console.log('[SW] Cached new resource:', request.url);
    }
    
    return response;
  } catch (error) {
    console.error('[SW] Network Fallback failed for:', request.url, error);
    
    // Try one more time from cache in case of race condition
    const cache = await caches.open(CACHE_DYNAMIC);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    return new Response('Network error and not in cache', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}