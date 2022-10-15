<script lang="ts" setup>
import { ref } from "vue";
import AppHeaderLogin from "./AppHeaderLogin.vue";

const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<template>
  <el-menu :default-active="activeIndex" class="header" mode="horizontal" :ellipsis="false" @select="handleSelect">
    <el-menu-item index="0">LOGO</el-menu-item>
    <div class="flex-grow" />
    <AppHeaderLogin />
  </el-menu>
</template>

<style>
.flex-grow {
  flex-grow: 1;
}
.header {
  padding: 0px;
}
</style>
