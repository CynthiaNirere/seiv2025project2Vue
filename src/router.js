import { createRouter, createWebHistory } from "vue-router";
<<<<<<< HEAD
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

=======
//import CoursesList from "./views/CoursesList.vue";
import EditCourse from "./views/editCourse.vue";
//import AddCourse from "./views/AddCourse.vue";
//import ViewCourse from "./views/ViewCourse.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
   // {
     // path: "/",
      //name: "courses",
      //component: CoursesList,
    //},
     {
      path: "/",
      redirect: "/courses/edit/1", // Temporarily redirect root to edit page
    },
    {
      path: "/courses/edit/:id",
      name: "editCourse",
      component: EditCourse,
      props: true,
    },
   // {
   //   path: "/courses/add",
   //   name: "addCourse",
   //   component: AddCourse,
   // },
   // {
   //   path: "/courses/view/:id",
   //   name: "viewCourse",
   //   component: ViewCourse,
   //   props: true,
   // },
  ],
});

>>>>>>> 569c5b8 (added edit page)
export default router;