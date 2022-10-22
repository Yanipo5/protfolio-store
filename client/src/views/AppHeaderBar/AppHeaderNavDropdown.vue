<script lang="ts" setup>
import type { RouteWithMeta } from "@/utils/types";
import { useRouter } from "vue-router";
import useUserStore from "@/store/user";
import { authorizeRole } from "portfolio-store-server/src/utils/authorization";
const router = useRouter();
const store = useUserStore();

const getMyRoutes = () => {
  const routes = router.getRoutes() as RouteWithMeta[];
  return routes.filter((r) => authorizeRole(r.meta.roles, store.roles)).sort((a, b) => a.meta.order - b.meta.order);
};

const handleClick = (r: { path: string }) => {
  router.push(r.path);
};
</script>

<template>
  <el-sub-menu index="Navigation-DropDown">
    <template #title>{{ $route.name }}</template>
    <el-menu-item v-for="r in getMyRoutes()" :index="r.name" :key="r.path" @click="() => handleClick(r)">{{ r.name }}</el-menu-item>
  </el-sub-menu>
</template>

<style scoped></style>
<style></style>
