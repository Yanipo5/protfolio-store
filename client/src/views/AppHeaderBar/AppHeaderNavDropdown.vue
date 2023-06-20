<template>
  <el-sub-menu index="Navigation-DropDown" class="app-navigation-dropDown">
    <template #title
      ><el-icon><Menu /></el-icon
    ></template>
    <el-menu-item v-for="r in getMyRoutes()" :index="r.name" :key="r.path" @click="() => router.push(r.path)">{{ r.name }}</el-menu-item>
  </el-sub-menu>
</template>

<script lang="ts" setup>
import type { RouteWithMeta } from "@/utils/types";
import { useRouter } from "vue-router";
import { Menu } from "@element-plus/icons-vue";
import useUserStore from "@/store/user";
import { authorizeRole } from "portfolio-store-server/src/utils/authorization";
const router = useRouter();
const store = useUserStore();

const getMyRoutes = () => {
  const routes = router.getRoutes() as RouteWithMeta[];
  return routes.filter((r) => authorizeRole(r.meta.roles, store.roles)).sort((a, b) => a.meta.order - b.meta.order);
};

</script>

<style>
.app-navigation-dropDown .el-sub-menu__title {
  border-bottom: unset !important;
}
</style>
