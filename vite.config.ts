import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
  build: {
    // three.js (hero scene) and the Spline runtime are reached only through
    // dynamic import(), so they split into their own lazy chunks on their own.
    // The Spline chunk is large but is never requested unless a scene is configured.
    chunkSizeWarningLimit: 4200,
  },
});
