import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      jsxRuntime: 'automatic'
    })
  ],
  server: {
    proxy: {
      "/api": {
        target: "https://mern12-y4o1.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  esbuild: {
    jsx: 'transform', // This handles JSX transformation
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx', // Treat .js files as JSX
      },
    },
  },
});
