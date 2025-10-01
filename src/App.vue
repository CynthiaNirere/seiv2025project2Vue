<script setup>
import MenuBar from './components/MenuBar.vue'
</script>

<template>
  <div>
  <MenuBar />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
main { padding: 1rem }
</style>
