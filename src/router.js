import { createRouter, createWebHistory } from "vue-router";
import AddCourse from "./views/AddCourse.vue";

const routes = [
  {
    path: "/add",
    name: "add",
    component: AddCourse,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

try {
  router.beforeEach((to, from, next) => {
    console.log(`Navigating from ${from.name || 'null'} to ${to.name}`);
    next();
  });
} catch (error) {
  console.error("Error configuring router:", error);
}

export default router;