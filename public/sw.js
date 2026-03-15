// public/sw.js
// GAMITSVALE.GE Service Worker

const CACHE_NAME = 'gamitsvale-v1';

// ეს ფაილები ყოველთვის cache-ში ინახება — offline-შიც მუშაობს
const STATIC_ASSETS = [
  '/',
  '/rules',
  '/offline',
];

// Install — cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — ძველი cache-ის გასუფთავება
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch — Network First სტრატეგია
// ჯერ ქსელიდან, ვერ მოიტანა? cache-იდან
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests — ყოველთვის network (cache არა)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // სურათები — Cache First (სწრაფი)
  if (
    request.destination === 'image' ||
    url.hostname === 'res.cloudinary.com'
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request).catch(() => null);
        if (response) cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  // გვერდები — Network First
  event.respondWith(
    fetch(request)
      .then((response) => {
        // წარმატებული response cache-ში შეინახე
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(async () => {
        // ქსელი არ არის — cache-იდან
        const cached = await caches.match(request);
        if (cached) return cached;
        // offline გვერდი
        return caches.match('/offline') || new Response('Offline', { status: 503 });
      })
  );
});

// Push Notifications (მომავლისთვის)
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'GAMITSVALE.GE', {
      body: data.body || 'ახალი შეთავაზება!',
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      data: { url: data.url || '/' },
    })
  );
});

// Notification click — გვერდზე გადასვლა
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});
