<script lang="ts" setup>
import AppHeaderLogin from "./AppHeaderLogin.vue";
import AppHeaderSetting from "./AppHeaderSettings.vue";
import AppHeaderNavDropdown from "./AppHeaderNavDropdown.vue";
import useUserStore from "@/store/user";

const store = useUserStore();
</script>

<template>
  <el-menu class="app-header" mode="horizontal" :ellipsis="false" :unique-opened="true" menu-trigger="click">
    <el-menu-item index="LOGO" @click="() => $router.push('/')">Yaniv's Store</el-menu-item>
    <AppHeaderNavDropdown />
    <div class="flex-grow" />
    <AppHeaderLogin v-if="store.roles.viewer" />
    <AppHeaderSetting v-else />
  </el-menu>
</template>

<style>
.flex-grow {
  flex-grow: 1;
}
.app-header {
  padding: 0px;
}
</style>
