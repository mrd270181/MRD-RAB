/* RAB MRD — service worker
   Strategi: JARINGAN DULU, simpanan sebagai cadangan.
   Dengan cara ini versi baru langsung terpakai begitu online — tidak ada
   batang "versi baru tersedia" yang nyangkut seperti di TITEN. */
const VERSI = '2026-11-05-1';          // <-- NAIKKAN tiap kali index.html diubah
const SIMPANAN = 'rab-mrd-' + VERSI;
const BERKAS = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
                './icon-maskable-512.png', './logo.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(SIMPANAN).then(c => c.addAll(BERKAS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(x => x !== SIMPANAN).map(x => caches.delete(x))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(jawab => {
        const salinan = jawab.clone();
        caches.open(SIMPANAN).then(c => c.put(e.request, salinan)).catch(() => {});
        return jawab;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./index.html')))
  );
});
