<script lang="ts" setup>
import type { Role } from "portfolio-store-server/src/utils/authorization";
import { useRouter } from "vue-router";
import useUserStore from "@/store/user";
import { authorizeRole } from "portfolio-store-server/src/utils/authorization";
const router = useRouter();
const store = useUserStore();

function handleClick(path: string) {
  console.log(path);
}

const getMyRoutes = () => {
  return router.getRoutes().filter((r) => authorizeRole(r.meta.roles as Role[], store.roles));
};
</script>

<template>
  <el-sub-menu v-if="!store.roles.viewer" index="1" popper-class="app-navigation-button-popper">
    <template #title>{{ $route.name }}</template>
    <el-menu-item v-for="(r, i) in getMyRoutes()" :key="i" index="{{`1-${i+1}`}}" @click="() => handleClick(r.path)">{{ r.name }}</el-menu-item>
  </el-sub-menu>
</template>

<style scoped></style>
<style></style>
