import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'Home', redirect: { name: 'CourseList' } },

    
    // ADD
    { path: '/courses/add', name: 'AddCourse', component: () => import('./views/addCourse.vue') },
// LIST PAGE
    { path: '/courses', name: 'CourseList', component: () => import('./views/courseList.vue') },

    // DETAIL (optional if you need it)
    { path: '/courses/:courseNumber', name: 'ViewCourse', component: () => import('./views/viewCourse.vue'), props: true },

    // EDIT
    { path: '/courses/:courseNumber/edit', name: 'EditCourse', component: () => import('./views/editCourse.vue'), props: true },

    // 404 fallback (optional)
    { path: '/:pathMatch(.*)*', redirect: { name: 'CourseList' } },
  ],
});

export default router;
