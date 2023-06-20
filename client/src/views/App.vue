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
  <div class="route-content">
    <RouterView />
  </div>
</template>

<style scoped>
.route-content {
  height: calc(100vh - 60px);
}
</style>
