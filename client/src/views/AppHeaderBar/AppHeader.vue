<script lang="ts" setup>
import AppHeaderLogin from "./AppHeaderLogin.vue";
import AppHeaderSetting from "./AppHeaderSettings.vue";
import AppHeaderNavDropdown from "./AppHeaderNavDropdown.vue";
import AppHeaderCart from "./AppHeaderCart.vue";
import useUserStore from "@/store/user";
import { useRouter } from "vue-router";

const router = useRouter();
const store = useUserStore();
</script>

<template>
  <el-menu class="app-header" mode="horizontal" :ellipsis="false" :unique-opened="true" menu-trigger="click">
    <el-menu-item index="LOGO" @click="() => router.push('/')">Yaniv's Store</el-menu-item>
    <AppHeaderNavDropdown />
    <div class="flex-grow" />
    <AppHeaderCart />
    <AppHeaderLogin v-if="store.roles.viewer" />
    <AppHeaderSetting v-else />
  </el-menu>
</template>

<style>
.flex-grow {
  flex-grow: 100;
}
.app-header {
  align-items: center;
  padding: 0px;
}
</style>
