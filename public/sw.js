// Service worker for the Learning Experience Hub: lets it open offline and from the home
// screen like an app, without ever holding back an update.
//
// - Pages: network first, so anyone online always gets the latest release; the
//   last copy of each page is kept for offline use.
// - Build files under _next/static have content hashes in their names and never
//   change, so they are served from the cache first.
// - Everything else goes straight to the network.
//
// Bump VERSION only to force every installed copy to drop its caches.
const VERSION = "v1";
const PAGES = `hub-pages-${VERSION}`;
const STATIC = `hub-static-${VERSION}`;
const MAX_STATIC = 200;

const scope = new URL(self.registration.scope).pathname; // "/" or "/DigiBlu-LXP-Hub/"
const CORE_PAGES = ["", "courses/", "areas/", "my-list/"].map((path) => scope + path);

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const pages = await caches.open(PAGES);
      const assets = new Set();
      for (const url of CORE_PAGES) {
        const response = await fetch(url, { cache: "no-cache" });
        if (!response.ok) continue;
        await pages.put(url, response.clone());
        // Keep the build files those pages need, so they also render offline.
        const html = await response.text();
        for (const match of html.matchAll(/["'(]([^"'()\s]*\/_next\/static\/[^"'()\s]+)["')]/g)) {
          assets.add(new URL(match[1], self.location.origin + url).href);
        }
      }
      const statics = await caches.open(STATIC);
      await Promise.allSettled([...assets].map((url) => statics.add(url)));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keep = new Set([PAGES, STATIC]);
      for (const key of await caches.keys()) if (!keep.has(key)) await caches.delete(key);
      await self.clients.claim();
    })(),
  );
});

async function trim(cache, max) {
  const keys = await cache.keys();
  for (const key of keys.slice(0, Math.max(0, keys.length - max))) await cache.delete(key);
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(scope)) return;

  if (url.pathname.startsWith(`${scope}_next/static/`)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(STATIC);
          await cache.put(request, response.clone());
          trim(cache, MAX_STATIC);
        }
        return response;
      })(),
    );
    return;
  }

  if (request.mode === "navigate") {
    // Pages are stored without their query string: filters live in the URL but
    // the page itself is the same file.
    const key = url.origin + url.pathname;
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);
          if (response.ok) (await caches.open(PAGES)).put(key, response.clone());
          return response;
        } catch {
          return (await caches.match(key)) || (await caches.match(scope)) || Response.error();
        }
      })(),
    );
  }
});
