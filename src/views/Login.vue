<template>
  <div class="login-page">
    <form class="login-card" @submit.prevent="submit" novalidate>
      <h2>Login</h2>

      <label class="field">
        <span>Email</span>
        <input
          type="email"
          v-model.trim="email"
          :class="{ invalid: emailTouched && !emailValid }"
          @blur="emailTouched = true"
          required
        />
        <small v-if="emailTouched && !emailValid" class="error">
          Email must end with @gmail.com or @eagles.oc.edu
        </small>
      </label>

      <label class="field">
        <span>Password</span>
        <input
          type="password"
          v-model="password"
          :class="{ invalid: passwordTouched && !passwordValid }"
          @blur="passwordTouched = true"
          required
        />
        <small v-if="passwordTouched && !passwordValid" class="error">
          Password must be at least 8 characters
        </small>
      </label>

      <p v-if="error" class="server-error">{{ error }}</p>

      <div class="actions">
        <button type="submit" :disabled="!formValid || loading">
          <span v-if="!loading">Login</span>
          <span v-else>Logging in…</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import authService from '../services/authService.js'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const emailTouched = ref(false)
const passwordTouched = ref(false)

const emailValid = computed(() => {
  const v = (email.value || '').toLowerCase()
  return v.endsWith('@gmail.com') || v.endsWith('@eagles.oc.edu')
})

const passwordValid = computed(() => (password.value || '').length >= 8)

const formValid = computed(() => emailValid.value && passwordValid.value)

async function submit() {
  error.value = ''
  emailTouched.value = true
  passwordTouched.value = true

  if (!formValid.value) {
    error.value = 'Please fix validation errors before submitting.'
    return
  }

  loading.value = true
  try {
    await authService.login({ email: email.value, password: password.value })

  const redirectTo = route.query.redirect || '/home'
    router.replace(redirectTo)
  } catch (e) {
    error.value = e?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.login-card {
  width: 100%;
  max-width: 420px;
  padding: 1.6rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  box-shadow: 0 6px 18px rgba(0,0,0,0.05);
}
.login-card h2 { margin: 0 0 1rem 0; font-size: 1.25rem; text-align: center; }
.field { display: block; margin-bottom: 0.9rem; }
.field span { display:block; font-size:0.9rem; color:#333; margin-bottom:0.3rem; }
.field input { width: 100%; padding: 0.55rem 0.6rem; border: 1px solid #cfcfcf; border-radius: 4px; outline: none; box-sizing: border-box; }
.field input.invalid { border-color: #e53935; }
.error { color: #e53935; font-size: 0.85rem; margin-top: 0.25rem; display:block; }
.server-error { color: #b00020; margin: 0.5rem 0; text-align:center; }
.actions { display:flex; justify-content:flex-end; margin-top: 0.8rem; }
button[disabled] { opacity: 0.6; cursor: not-allowed; }
button { background: #1976d2; color: white; border: none; padding: 0.55rem 0.9rem; border-radius: 4px; cursor: pointer; }
</style>
