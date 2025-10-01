<template>
  <nav class="app-nav" v-if="route.name !== 'login'">
    <div class="app-container">
      <div class="left">
        <router-link to="/" class="brand">
          <img class="logo-img" :src="logoURL || '/oc-logo-white.png'" alt="OC" />
          <span class="title">Courses</span>
        </router-link>
      </div>

      <div class="nav-right">
        <template v-if="!user">
          <router-link :to="{ name: 'login' }" class="login-btn">Login</router-link>
        </template>

        <template v-else>
          <span class="user-email">{{ user.email }}</span>
          <button class="link-btn" @click="logout">Logout</button>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import ocLogo from '/oc-logo-white.png'
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import authService from '../services/authService.js'

const title = ref('Tutorials')
const name = ref('')
const logoURL = ref('')
const router = useRouter()
const route = useRoute()
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
  justify-content:center;
  align-items:center;
  padding:0;
  height:64px; /* taller app bar */
  background:#fff;
  border-bottom:1px solid #e6e6e6; /* full-width line */
}
.brand { display:flex; align-items:center; gap:0.6rem; text-decoration:none; color:inherit }
.left { display:flex; align-items:center }
.logo-img { width:48px; height:48px; display:inline-block; object-fit:contain }
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

.app-container {
  width: 100%;
  max-width: 1280px;
  padding: 0 1.2rem;
  display:flex;
  align-items:center;
  justify-content:space-between;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .app-nav { height:56px; padding: 0 0.8rem }
  .logo-img { width:34px; height:34px }
  .title { font-size:0.98rem }
  .nav-right { gap:0.5rem }
  .login-btn { padding:6px 9px }
}

@media (min-width: 900px) {
  .app-nav { height:72px }
  .logo-img { width:64px; height:64px }
  .title { font-size:1.25rem }
  .nav-right { gap:1rem }
  .login-btn { padding:10px 14px }
}
</style>
