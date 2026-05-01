import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import ServiceWorker from "@/components/ServiceWorker";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "Shekinah School Portal",
  description: "CBC-first school management platform for Shekinah School, Kimilili.",
  manifest: "/manifest.json"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var host = window.location.hostname;
                var isLocal = host === "localhost" || host === "127.0.0.1";
                if (!isLocal) return;

                if ("serviceWorker" in navigator) {
                  navigator.serviceWorker.getRegistrations().then(function (registrations) {
                    registrations.forEach(function (registration) {
                      registration.unregister().catch(function () {});
                    });
                  });
                }

                if ("caches" in window) {
                  caches.keys().then(function (keys) {
                    keys.forEach(function (key) {
                      caches.delete(key).catch(function () {});
                    });
                  });
                }
              })();
            `
          }}
        />
      </head>
      <body>
        <ToastProvider>
          {children}
          <ServiceWorker />
        </ToastProvider>
      </body>
    </html>
  );
}
