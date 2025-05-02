import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      include: /\.(jsx|js|ts|tsx)$/, // Process all JavaScript/TypeScript files
      babel: {
        plugins: [
          ['@babel/plugin-proposal-decorators', { legacy: true }],
          ['@babel/plugin-proposal-class-properties', { loose: true }]
        ]
      }
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
    loader: 'jsx',
    include: /\.(jsx|js)$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});
