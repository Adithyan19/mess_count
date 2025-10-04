import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        VitePWA({
            registerType: "autoUpdate",
            injectRegister: "auto",

            pwaAssets: {
                disabled: false,
                config: false,
            },

            manifest: {
                name: "Mess_Count",
                short_name: "Mess_Count",
                description: "mess_count_web_application",
                start_url: "/",
                display: "standalone",
                background_color: "#ffffff",
                theme_color: "#ffffff",
                lang: "en",
                scope: "/",
                icons: [
                    {
                        src: "/pwa-64x64.png",
                        sizes: "64x64",
                        type: "image/png",
                    },
                    {
                        src: "/pwa-192x192.png",
                        sizes: "192x192",
                        type: "image/png",
                    },
                    {
                        src: "/pwa-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                    },
                    {
                        src: "/maskable-icon-512x512.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable",
                    },
                ],
            },

            workbox: {
                globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
                cleanupOutdatedCaches: true,
                clientsClaim: true,
            },

            devOptions: {
                enabled: true,
                navigateFallback: "index.html",
                suppressWarnings: true,
                type: "module",
            },
        }),
    ],
});
