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
        name: "Restaurant POS & CRM — Customer Display",
        short_name: "Customer Display",
        start_url: "/",
        display: "standalone",
        theme_color: "#0f172a",
        background_color: "#0f172a",
      },
    }),
  ],
  server: {
    port: 5175,
  },
});
