/* Service worker de Côté Terrain (version web).
   Il garde une copie de l'appli dans l'appareil pour qu'elle s'ouvre même sans réseau au gymnase.
   Stratégie « réseau d'abord » : avec du réseau, on prend la dernière version (et on la recopie) ;
   sans réseau, on sert la copie. Changer le numéro de CACHE à chaque mise à jour fait le ménage. */
const CACHE = "cote-terrain-web-1.10.14";
const SHELL = ["./", "index.html", "manifest.webmanifest", "seed/seed.json",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png",
  "vendor/jspdf.umd.min.js", "vendor/three.min.js", "vendor/jsQR.min.js", "vendor/qrcode.min.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;   // on ne touche qu'à nos propres fichiers
  e.respondWith(fetch(e.request).then(r => { if (r.ok){ const c = r.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); } return r; })
    .catch(() => caches.match(e.request, {ignoreSearch:true}).then(r => r || caches.match("index.html"))));
});
