<script lang="ts" setup>
import type { Role } from "portfolio-store-server/src/utils/authorization";
import { useRouter } from "vue-router";
import useUserStore from "@/store/user";
import { authorizeRole } from "portfolio-store-server/src/utils/authorization";
const router = useRouter();
const store = useUserStore();

const getMyRoutes = () => {
  return router.getRoutes().filter((r) => authorizeRole(r.meta.roles as Role[], store.roles));
};

const handleClick = (r: { path: string }) => {
  router.push(r.path);
};
</script>

<template>
  <el-sub-menu v-if="!store.roles.viewer" index="Navigation-DropDown">
    <template #title>{{ $route.name }}</template>
    <el-menu-item v-for="r in getMyRoutes()" :index="r.name" :key="r.path" @click="() => handleClick(r)">{{ r.name }}</el-menu-item>
  </el-sub-menu>
</template>

<style scoped></style>
<style></style>
