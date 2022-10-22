<script lang="ts" setup>
import AppHeader from "./AppHeaderBar/AppHeader.vue";
import AppLoginDialog from "./AppLoginDialog/index.vue";
import { RouterView } from "vue-router";
import useUserStore from "@/store/user";

const store = useUserStore();
</script>

<template>
  <AppHeader />
  <AppLoginDialog v-if="store.roles.viewer" />
  <RouterView />
</template>

<style scoped></style>
