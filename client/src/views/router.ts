import type { Role } from "portfolio-store-server/src/utils/authorization";
import type { RouteRecordRaw } from "vue-router";
import { allRoles } from "portfolio-store-server/src/utils/authorization";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: App,
      meta: { roles: allRoles }
    },
    {
      path: "/admin-portal",
      name: "Product Management",
      component: () => import("./AdminPortal/index.vue"),
      meta: { roles: ["admin"] }
    },
    {
      path: "/admin-portal",
      name: "Order Management",
      component: () => import("./AdminPortal/index.vue"),
      meta: { roles: ["admin"] }
    },
    {
      path: "/user-portal",
      name: "Ny Cart",
      component: () => import("./UserPortal/index.vue"),
      meta: { roles: ["user"] }
    },
    {
      path: "/user-portal",
      name: "Ny Orders",
      component: () => import("./UserPortal/index.vue"),
      meta: { roles: ["user"] }
    }
  ] as (RouteRecordRaw & { meta: { roles: Role[] } })[]
});

export default router;
