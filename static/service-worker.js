// The previous version of this site (Create React App) registered a service worker.
// This replacement unregisters itself so returning visitors stop seeing the cached old site.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", () => {
  self.registration
    .unregister()
    .then(() => self.clients.matchAll())
    .then((clients) => clients.forEach((c) => c.navigate(c.url)));
});
