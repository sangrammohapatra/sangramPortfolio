import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: { outDir: "build" },
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        // Use 127.0.0.1 (not localhost) — avoids Windows ENOBUFS bug
        // where localhost resolves to both IPv4+IPv6 simultaneously
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
    },
  },
  // Suppress MD editor CSS warnings
  css: { devSourcemap: false },
});
