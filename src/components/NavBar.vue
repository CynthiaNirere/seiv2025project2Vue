<template>
  <nav class="app-nav">
    <router-link to="/" class="brand">MyApp</router-link>

    <div class="nav-right">
      <router-link v-if="user" :to="{ name: 'home' }">Home</router-link>

      <template v-if="!user">
        <router-link :to="{ name: 'login' }">Login</router-link>
      </template>

      <template v-else>
        <span class="user-email">{{ user.email }}</span>
        <button class="link-btn" @click="logout">Logout</button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService.js'

const router = useRouter()
const user = ref(null)

onMounted(() => {
  user.value = authService.getUser()
  window.addEventListener('auth-changed', () => { user.value = authService.getUser() })
})

function logout() {
  authService.logout()
  user.value = null
  router.push({ name: 'login' })
}
</script>

<style scoped>
.app-nav { display:flex; justify-content:space-between; align-items:center; padding:0.6rem 1rem; background:#f5f5f5; border-bottom:1px solid #eaeaea; }
.brand { font-weight:600; }
.nav-right { display:flex; gap:0.6rem; align-items:center; }
.user-email { margin-right:0.4rem; font-size:0.95rem; color:#333; }
.link-btn { background:none; border:none; color:#1976d2; cursor:pointer; padding:0; }
</style>
