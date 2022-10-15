<script lang="ts" setup>
import AppHeader from "./_components/AppHeader.vue";
import { ref } from "vue";

const activeIndex = ref("1");
const handleSelect = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>

<template>
  <AppHeader />
</template>

<style scoped></style>
