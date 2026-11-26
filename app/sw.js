/* Service worker de Côté Terrain (version web).
   Il garde une copie de l'appli dans l'appareil pour qu'elle s'ouvre même sans réseau au gymnase.
   Stratégie « réseau d'abord » : avec du réseau, on prend la dernière version (et on la recopie) ;
   sans réseau, on sert la copie. Si l'adresse renvoie ailleurs (déménagement vers coteterrain.fr), on sert aussi
   la copie : les fiches rangées avec cette adresse restent accessibles. Changer le numéro de CACHE à chaque mise à jour fait le ménage. */
const CACHE = "cote-terrain-web-1.10.16";
const SHELL = ["./", "index.html", "manifest.webmanifest", "seed/seed.json",
  "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png",
  "vendor/jspdf.umd.min.js", "vendor/three.min.js", "vendor/jsQR.min.js", "vendor/qrcode.min.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return;   // on ne touche qu'à nos propres fichiers
  if (u.searchParams.has("ct-move")) return;                                   // l'appli vérifie si le site a déménagé : on laisse passer
  const copie = () => caches.match(e.request, {ignoreSearch:true}).then(r => r || caches.match("index.html"));
  e.respondWith(fetch(e.request).then(r => {
    // Le site a déménagé (renvoi vers une autre adresse) : on garde la copie de l'appli, pour que les fiches rangées ici restent accessibles.
    if (r.type === "opaqueredirect" || (r.redirected && new URL(r.url).origin !== location.origin)) return copie().then(c => c || r);
    if (r.ok){ const c = r.clone(); caches.open(CACHE).then(ca => ca.put(e.request, c)); }
    return r; }).catch(copie));
});
