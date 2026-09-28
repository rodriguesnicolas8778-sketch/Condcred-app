// Guarda a tela do app no aparelho para abrir rápido e funcionar sem internet.
// Os dados NÃO passam por aqui: vão direto para a sua planilha.
const V = "condcred-app-v2";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== self.location.origin) return; // servidor e fontes: direto pela rede
  // sempre tenta a versão mais nova; sem internet, usa a guardada
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(V).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});
