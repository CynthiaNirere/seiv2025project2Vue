// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';

const BaseURL= process.env.APP_ENV="developmnet" ? "/" : "/seiv/p2/t1/";


export default defineConfig({
  plugins: [
    vue(),
    vuetify(),
  ],
  server: {
    port: 5173,        // Vite dev server
    strictPort: true,  // fail if 5173 is taken
  },
  base: BaseURL,
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => tag.startsWith('v-') || tag.startsWith('V-'),
    },
  },
  
})