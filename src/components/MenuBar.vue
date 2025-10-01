<script setup>
import ocLogo from '/oc-logo-white.png'
import { ref } from 'vue'
const title = ref('Justice League')
</script>

<template>
  <header class="menu-bar">
    <div class="left">
      <router-link to="/" class="brand">
        <img :src="ocLogo" alt="Logo" class="logo" />
        <span class="title">{{ title }}</span>
      </router-link>
    </div>
    <nav class="links">
      <router-link to="/" class="link">Home</router-link>
      <router-link to="/add" class="link">Add Course</router-link>
    </nav>
  </header>
</template>

<style scoped>
.menu-bar { display:flex; align-items:center; padding:8px 16px; background:#111; color:#fff; gap:2rem; }
.brand { display:flex; align-items:center; gap:.6rem; color:#fff; text-decoration:none; font-weight:600; }
.logo { width:42px; height:42px; object-fit:contain; }
.links { display:flex; gap:1rem; }
.link { color:#fff; text-decoration:none; font-size:.9rem; padding:6px 10px; border-radius:4px; }
.link.router-link-active { background:#222; }
.link:hover { background:#222; }
@media (max-width:640px){ .menu-bar{flex-wrap:wrap; gap:1rem;} .links{width:100%;} }
</style>