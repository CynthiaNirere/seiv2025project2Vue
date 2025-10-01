import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Minimal Vite config with dev proxy to backend to avoid CORS in development.
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (p) => p, // keep path as-is
      },
      '/courses': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});