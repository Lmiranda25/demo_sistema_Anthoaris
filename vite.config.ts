import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// El valor de `base` debe coincidir EXACTAMENTE con el nombre del repositorio,
// incluyendo mayúsculas, porque GitHub Pages distingue mayúsculas en la URL.
// Repo: https://github.com/Lmiranda25/demo_sistema_Anthoaris
export default defineConfig({
  base: "/demo_sistema_Anthoaris/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    rollupOptions: {
      output: {
        // Separa librerías pesadas para mejorar la caché en GitHub Pages.
        manualChunks: {
          react: ["react", "react-dom", "react-router-dom"],
          charts: ["recharts"],
          db: ["dexie", "dexie-react-hooks"],
          forms: ["react-hook-form", "zod", "@hookform/resolvers"],
        },
      },
    },
  },
});
