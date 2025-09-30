<template>
  <nav class="app-nav">
    <div class="left">
      <router-link to="/" class="brand">
  <img class="logo-img" :src="logoURL || '/oc-logo-white.png'" alt="OC" />
        <span class="title">Tutorials</span>
      </router-link>
    </div>

    <div class="nav-right">
      <router-link v-if="user" :to="{ name: 'home' }" class="nav-link">Home</router-link>

      <template v-if="!user">
        <router-link :to="{ name: 'login' }" class="login-btn">Login</router-link>
      </template>

      <template v-else>
        <span class="user-email">{{ user.email }}</span>
        <button class="link-btn" @click="logout">Logout</button>
      </template>
    </div>
  </nav>
</template>

<script setup>
import ocLogo from '/oc-logo-white.png'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService.js'

const title = ref('Tutorials')
const name = ref('')
const logoURL = ref('')
const router = useRouter()
const user = ref(null)

onMounted(() => {
  logoURL.value = ocLogo
  user.value = authService.getUser()

  // react to auth changes
  window.addEventListener('auth-changed', () => {
    user.value = authService.getUser()
  })

})

function logout() {
  authService.logout()
  user.value = null
  router.push({ name: 'login' })
}
</script>

<style scoped>
.app-nav {
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding:0 1.2rem;
  height:64px; /* taller app bar */
  background:#fff;
  border-bottom:1px solid #e6e6e6;
}
.brand { display:flex; align-items:center; gap:0.6rem; text-decoration:none; color:inherit }
.left { display:flex; align-items:center }
.logo-img { width:38px; height:38px; display:inline-block }
.title { font-size:1.05rem; margin-left:0.6rem; font-weight:600; color:#333 }
.nav-right { display:flex; gap:0.75rem; align-items:center; }
.nav-right > * { margin-left: 6px }
.user-email { margin-right:0.4rem; font-size:0.95rem; color:#333; }
.link-btn { background:none; border:none; color:#1976d2; cursor:pointer; padding:0; }
.login-btn {
  padding:8px 12px;
  border-radius:6px;
  border:1px solid #e3e3e3;
  background:#f7f7f7;
  color:#333;
  text-decoration:none;
  font-weight:600;
  box-shadow: 0 1px 0 rgba(0,0,0,0.02);
}
.login-btn:hover { background:#f0f0f0 }
</style>
