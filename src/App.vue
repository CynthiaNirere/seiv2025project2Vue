<template>
  <v-app>
    <MenuBar />
    <router-view />
  </v-app>
</template>

<script setup>
import MenuBar from './components/MenuBar.vue'; // Adjust path if necessary
</script>