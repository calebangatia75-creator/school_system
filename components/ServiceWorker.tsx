"use client";

import { useEffect } from "react";

export default function ServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    // In local/dev we want zero stale UI. Clear existing service workers and caches.
    if (process.env.NODE_ENV !== "production" || isLocalhost) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          registration.unregister().catch(() => {
            // Ignore cleanup failures in dev.
          });
        });
      });

      if ("caches" in window) {
        caches.keys().then((keys) => {
          keys.forEach((key) => {
            caches.delete(key).catch(() => {
              // Ignore cache cleanup failures in dev.
            });
          });
        });
      }

      return;
    }

    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Fail silently for browsers without SW support.
    });
  }, []);

  return null;
}
