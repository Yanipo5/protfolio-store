<script lang="ts" setup>
import { ShoppingCart } from "@element-plus/icons-vue";
import useCartStore from "@/store/cart";
import useUserStore from "@/store/user";

const store = useCartStore();
const userStore = useUserStore();
const cartNotEmpty = () => Object.values(store.products).some((v) => v);
</script>

<template>
  <el-menu-item v-if="!userStore.roles.admin" index="2" style="padding: 0" class="app-shopping-cart">
    <el-badge :is-dot="cartNotEmpty()" :class="cartNotEmpty() && 'dot'"
      ><el-icon> <ShoppingCart @click="() => $router.push('/my-cart')" /></el-icon
    ></el-badge>
  </el-menu-item>
</template>

<style scoped>
.dot {
  line-height: 18px;
}
.dot:deep(.is-dot) {
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
.app-shopping-cart {
  border-bottom: unset !important;
}
</style>
