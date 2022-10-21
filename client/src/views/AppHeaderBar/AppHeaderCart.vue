<script lang="ts" setup>
import { ref } from "vue";
import { ShoppingCart } from "@element-plus/icons-vue";
import api from "@/utils/api";
import useUserStore from "@/store/user";
import { useRouter } from "vue-router";

const router = useRouter();

const store = useUserStore();
const cart: any[] = [];
</script>

<template>
  <el-menu-item index="2" style="padding: 0">
    <el-badge v-if="cart.length" is-dot class="dot"
      ><el-icon> <ShoppingCart /></el-icon
    ></el-badge>
    <el-icon> <ShoppingCart /></el-icon>
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
