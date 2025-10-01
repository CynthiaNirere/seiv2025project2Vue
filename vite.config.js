import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify'; // Add this plugin

export default defineConfig({
  plugins: [
    vue(),
    vuetify(), // Enable Vuetify plugin
  ],
  // Optional: Add this to prevent Vite from treating Vuetify components as custom elements
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('v-') || tag.startsWith('V-'),
    },
  },
});