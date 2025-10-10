import { clientsClaim } from "workbox-core";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
    ({ url }) =>
        url.origin === self.location.origin && url.pathname.startsWith("/api/"),
    new StaleWhileRevalidate({
        cacheName: "api-cache",
    }),
);

self.addEventListener("push", (event) => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: "/pwa-192x192.png",
        badge: "/pwa-64x64.png",
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow("/"));
});
