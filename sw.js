const CACHE_NAME = "demap-cache-v2"; // Mude este nome/número a cada nova versão

// Arquivos que queremos salvar no dispositivo do usuário
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./css/output.css",
  "./js/app.js",
  "./js/database.js",
  "./js/firebase.js",
  "./js/ui.js",
  "./assets/favicon.svg",
];

// Evento de Instalação: Salva os arquivos iniciais
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)),
  );
  self.skipWaiting(); // Força a ativação imediata do novo Service Worker
});

// Evento de Ativação: Limpa caches antigos
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("PWA: Limpando cache antigo", cache);
            return caches.delete(cache);
          }
        }),
      );
    }),
  );
  self.clients.claim(); // Garante que o SW controle as abas imediatamente
});

// Evento de Interceptação: Responde com cache se a internet falhar/for lenta
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
