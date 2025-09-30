import { createRouter, createWebHistory } from 'vue-router'
import authService from '../services/authService.js'

const routes = [
  { path: '/login', name: 'login', component: () => import('../views/Login.vue'), meta: { public: true } },
  { path: '/', redirect: '/home' },
  { path: '/home', name: 'home', component: () => import('../views/Home.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  // allow public routes
  if (to.meta && to.meta.public) return next()
  if (to.name === 'login') return next()

  if (!authService.isAuthenticated()) {
    return next({ name: 'login', query: { redirect: to.fullPath } })
  }
  next()
})

export default router
