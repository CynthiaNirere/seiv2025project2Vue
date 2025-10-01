import { createRouter, createWebHistory } from "vue-router";
import EditCourse from "./views/editCourse.vue";
import AddCourse from "./views/AddCourse.vue";
import ViewCourse from "./views/ViewCourse.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "view",
      component: ViewCourse,
    },
    {
      path: "/courses/edit/:id",
      name: "editCourse",
      component: EditCourse,
      props: true,
    },
    {
      path: "/add",
      name: "add",
      component: AddCourse,
    },
  ],
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