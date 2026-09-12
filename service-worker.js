/* 세명장교 비즈니스센터 — Service Worker */
const CACHE = 'sj-cache-v6';
const ASSETS = [
  './', './index.html', './about.html', './virtual.html', './consulting.html',
  './ai-edu.html', './insurance.html', './contact.html', './blog.html',
  './css/style.css', './js/layout.js', './js/main.js',
  './404.html',
  './manifest.json', './favicon.ico', './images/hero-euljiro.jpg',
  './images/semyung-logo.png',
  './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/')) return;      // API는 캐시 안 함
  if (url.origin !== self.location.origin) return;   // 외부(지도/폰트) 제외

  const isDoc = request.mode === 'navigate';
  const isCode = /\.(?:css|js|webmanifest|json)$/.test(url.pathname);

  // 문서·CSS·JS: network-first (항상 최신, 오프라인 시 캐시) → 배포 후 즉시 반영
  if (isDoc || isCode) {
    e.respondWith(
      fetch(request).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(request, copy)); }
        return res;
      }).catch(() => caches.match(request).then((c) => c || (isDoc ? caches.match('./index.html') : undefined)))
    );
    return;
  }

  // 이미지·아이콘·폰트: cache-first (성능)
  e.respondWith(
    caches.match(request).then((cached) => cached ||
      fetch(request).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(request, copy)); }
        return res;
      }).catch(() => cached))
  );
});
