import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AddCourse from '../views/addCourse.vue'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/add', name: 'add', component: AddCourse },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


export default router
