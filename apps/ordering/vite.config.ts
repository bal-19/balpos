import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Restaurant POS & CRM — QR Table Ordering",
        short_name: "Ordering",
        start_url: "/",
        display: "standalone",
        theme_color: "#1A3A32",
        background_color: "#FAF9F5",
      },
    }),
  ],
  server: {
    port: 5176,
  },
});
