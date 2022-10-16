import type { Role } from "portfolio-store-server/src/utils/authorization";
import type { RouteRecordNormalized } from "vue-router";

export type RouteWithMeta = RouteRecordNormalized & { meta: { order: number; roles: Role[] } };
