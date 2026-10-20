"use client";

import { useEffect } from "react";

// Registers public/sw.js in production builds only, so local development never
// serves cached files.
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    navigator.serviceWorker.register(`${base}/sw.js`, { scope: `${base}/` }).catch(() => {
      // Without a service worker the hub still works; it just is not available offline.
    });
  }, []);
  return null;
}
