import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: App
    },
    {
      path: "/admin-portal",
      name: "Admin Portal",
      component: () => import("./AdminPortal/index.vue")
    },
    {
      path: "/user-portal",
      name: "User Portal",
      component: () => import("./UserPortal/index.vue")
    }
  ]
});

export default router;
