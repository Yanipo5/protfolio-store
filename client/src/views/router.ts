import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: App
    },
    {
      path: "/admin-portal",
      name: "admin-portal",
      component: () => import("./AdminPortal/index.vue")
    },
    {
      path: "/user-portal",
      name: "user-portal",
      component: () => import("./UserPortal/index.vue")
    }
  ]
});

export default router;
