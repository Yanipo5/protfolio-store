import type { Role } from "portfolio-store-server/src/utils/authorization";
import type { RouteRecordRaw } from "vue-router";
import { allRoles } from "portfolio-store-server/src/utils/authorization";
import { createRouter, createWebHistory } from "vue-router";
import AppHome from "./AppHome/index.vue";
import useUserStore from "@/store/user";
import { authorizeRole } from "portfolio-store-server/src/utils/authorization";

type RouteMeta = { meta: { roles: Role[] } };

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Home",
      component: AppHome,
      meta: { roles: allRoles }
    },
    // Applying autho only for non Home routes
    ...[
      {
        path: "/admin-portal",
        name: "Product Management",
        component: () => import("./AdminPortal/index.vue"),
        meta: { roles: ["admin"] }
      },
      {
        path: "/admin-portal/1",
        name: "Order Management",
        component: () => import("./AdminPortal/index.vue"),
        meta: { roles: ["admin"] }
      },
      {
        path: "/user-portal",
        name: "My Cart",
        component: () => import("./UserPortal/index.vue"),
        meta: { roles: ["user"] }
      },
      {
        path: "/user-portal/1",
        name: "My Orders",
        component: () => import("./UserPortal/index.vue"),
        meta: { roles: ["user"] }
      }
    ].map((r) => ({ ...r, beforeEnter: [(to: { path: string } & RouteMeta) => authorizeRole(to.meta.roles, useUserStore().roles) /* Authorize Navigation*/] }))
  ] as (RouteRecordRaw & RouteMeta)[]
});
