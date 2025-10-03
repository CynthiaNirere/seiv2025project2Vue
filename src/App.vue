<template>
  <v-app>
    <!-- Global header -->
    <MenuBar />

    <!-- Main content area -->
    <v-main class="bg-grey-lighten-4 py-6">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import MenuBar from './components/MenuBar.vue';
</script>
