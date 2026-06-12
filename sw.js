const CACHE_NAME = "demap-cache-v1";

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
});

// Evento de Interceptação: Responde com cache se a internet falhar/for lenta
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request)),
  );
});
