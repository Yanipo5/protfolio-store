<script lang="ts" setup>
const props = defineProps({
  title: String
});
</script>

<template>
  <h3 class="header">{{ props.title }}</h3>
</template>
<style scoped>
.header {
  text-align: center;
  padding-bottom: 1vh;
}
</style>
