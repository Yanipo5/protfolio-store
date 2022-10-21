<script lang="ts" setup>
import { ShoppingCart } from "@element-plus/icons-vue";
import useCartStore from "@/store/cart";

const store = useCartStore();
</script>

<template>
  <el-menu-item index="2" style="padding: 0">
    <el-badge v-if="store.products.length" is-dot class="dot"
      ><el-icon> <ShoppingCart /></el-icon
    ></el-badge>
    <el-icon v-else> <ShoppingCart /></el-icon>
  </el-menu-item>
</template>

<style scoped>
.dot {
  line-height: 18px;
}
.dot:deep .is-dot {
  bottom: 0px;
  left: 4px;
  right: unset;
  top: unset;
}
</style>
<style>
.app-setting-button-popper .el-menu-item.is-disabled {
  opacity: 1;
  border-bottom: 1px solid;
  border-bottom-color: var(--vt-c-white-mut) !important;
}
</style>
