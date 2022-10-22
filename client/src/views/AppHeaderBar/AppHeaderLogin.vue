<template>
  <el-menu-item index="2" @click="store.loginDialogFormVisible = true">Login</el-menu-item>
</template>

<script lang="ts" setup>
import useUserStore from "@/store/user";

const store = useUserStore();
</script>

<style scoped></style>
