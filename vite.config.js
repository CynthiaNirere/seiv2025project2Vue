// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
  plugins: [
    vue(),
    vuetify(),
  ],
  server: {
    port: 5173,        // Vite dev server
    strictPort: true,  // fail if 5173 is taken
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // backend server
        changeOrigin: true,
        secure: false,
      },
    },
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('v-') || tag.startsWith('V-'),
    },
  },
});
