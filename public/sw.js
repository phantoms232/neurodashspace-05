const CACHE_NAME = 'neurodash-v1.0.0';
const OLD_CACHE_PREFIX = 'neurodash-v';

// Assets to cache immediately - core app files
const CORE_ASSETS = [
  '/',
  '/manifest.json',
  '/lovable-uploads/92547e9c-22c3-4aab-ae1f-46223bd5de1b.png', // App icon
];

// Assets to cache on first request - dynamic content
const RUNTIME_CACHE = [
  '/src/',
  '/static/',
  '/assets/'
];

// Cache strategies for different types of requests
const CACHE_STRATEGIES = {
  // Cache first for static assets (images, fonts, etc.)
  CACHE_FIRST: ['image/', 'font/', 'audio/'],
  // Network first for HTML pages
  NETWORK_FIRST: ['text/html', 'application/json'],
  // Stale while revalidate for CSS/JS
  STALE_WHILE_REVALIDATE: ['text/css', 'application/javascript']
};

self.addEventListener('install', (event) => {
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  event.waitUntil(
    Promise.all([
      // Cache core assets
      caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(CORE_ASSETS).catch(err => {
          console.log('Cache add failed for some assets:', err);
        });
      }),
      // Clear old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith(OLD_CACHE_PREFIX) && cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener('activate', (event) => {
  // Take control of all pages immediately
  event.waitUntil(
    clients.claim().then(() => {
      // Clear all old caches again to be sure
      return caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName.startsWith(OLD_CACHE_PREFIX) && cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip external requests (ads, analytics, etc.)
  if (!url.origin.includes('lovable') && !url.pathname.startsWith('/')) {
    return;
  }

  // Determine cache strategy based on content type
  const contentType = request.headers.get('accept') || '';
  const isImage = contentType.includes('image/') || request.url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/i);
  const isFont = contentType.includes('font/') || request.url.match(/\.(woff|woff2|ttf|eot)$/i);
  const isAudio = contentType.includes('audio/') || request.url.match(/\.(mp3|wav|ogg)$/i);
  const isStyle = contentType.includes('text/css') || request.url.match(/\.css$/i);
  const isScript = contentType.includes('javascript') || request.url.match(/\.js$/i);
  const isHTML = contentType.includes('text/html') || url.pathname === '/' || !url.pathname.includes('.');

  event.respondWith(
    (async () => {
      // Cache first strategy for static assets
      if (isImage || isFont || isAudio) {
        const cached = await caches.match(request);
        if (cached) {
          return cached;
        }
        
        try {
          const response = await fetch(request);
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
          }
          return response;
        } catch (error) {
          return new Response('Asset not available offline', { status: 503 });
        }
      }

      // Stale while revalidate for CSS/JS
      if (isStyle || isScript) {
        const cached = await caches.match(request);
        const fetchPromise = fetch(request).then(response => {
          if (response.ok) {
            const cache = caches.open(CACHE_NAME);
            cache.then(c => c.put(request, response.clone()));
          }
          return response;
        }).catch(() => cached);

        return cached || fetchPromise;
      }

      // Network first for HTML and API calls
      if (isHTML || contentType.includes('application/json')) {
        try {
          const response = await fetch(request);
          if (response.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
          }
          return response;
        } catch (error) {
          const cached = await caches.match(request);
          return cached || new Response('Page not available offline', { 
            status: 503,
            headers: { 'Content-Type': 'text/html' }
          });
        }
      }

      // Default: try network first, fallback to cache
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, response.clone());
        }
        return response;
      } catch (error) {
        return caches.match(request) || new Response('Resource not available', { status: 503 });
      }
    })()
  );
});