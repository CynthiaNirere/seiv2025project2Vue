import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Project does not use Vuetify in the current branch; keep a minimal Vite config.
export default defineConfig({
  plugins: [vue()],
});