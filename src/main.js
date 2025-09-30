import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import WebFont from 'webfontloader'; // Import as a module for configuration

// Configure WebFontLoader to load Roboto (Vuetify's default font)
WebFont.load({
  google: {
    families: ['Roboto:100,300,400,500,700,900&display=swap'],
  },
  // Optional: Add a callback for debugging
  active: () => console.log('WebFont loaded successfully'),
  inactive: () => console.warn('WebFont failed to load'),
});

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});

const app = createApp(App);

try {
  app.use(router);
  app.use(vuetify);
  app.mount('#app');
} catch (error) {
  console.error('Error mounting Vue app:', error);
}