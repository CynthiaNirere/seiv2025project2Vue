<script setup>
import ocLogo from "/oc-logo-white.png";
import { ref } from "vue";

const title = ref("Justice League");
const logoURL = ref(ocLogo);
</script>

<template>
  <v-app-bar
    color="primary"
    elevation="1"
    density="comfortable"
    flat
  >
    <!-- Left: logo + title -->
    <router-link :to="{ name: 'Home' }" class="d-flex align-center text-white">
      <v-img
        class="mr-2"
        :src="logoURL"
        height="36"
        width="36"
        contain
      />
      <span class="text-h6 font-weight-medium">{{ title }}</span>
    </router-link>

    <v-spacer />

    <!-- Right: actions -->
    <div class="d-flex ga-2">
      <v-btn color="white" class="text-primary" :to="{ name: 'AddCourse' }">
        Add Course
      </v-btn>
    </div>
  </v-app-bar>
</template>

<style scoped>
a {
  text-decoration: none;
}
</style>