<script lang="ts" setup>
import { ref } from "vue";
import { Setting } from "@element-plus/icons-vue";
import api from "@/utils/api";
import useUserStore from "@/store/user";

const store = useUserStore();
const logoutDialogFormVisible = ref(false);

async function handleLogout() {
  logoutDialogFormVisible.value = false;
  await api.query("user.logout");
  store.deleteToken();
}
</script>

<template>
  <!-- Setting Side Button -->
  <el-sub-menu index="2" popper-class="app-setting-button-popper">
    <template #title>
      <el-icon> <Setting /></el-icon
    ></template>
    <el-menu-item index="2-1" disabled
      ><span class="greeting2">Hi {{ store.user }}</span></el-menu-item
    >
    <el-menu-item index="2-2" @click="logoutDialogFormVisible = true">Logout</el-menu-item>
  </el-sub-menu>

  <!-- Logout Dialog -->
  <el-dialog v-model="logoutDialogFormVisible" title="Are You Sure you want to logout?" class="app-header-logout-dialog">
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="logoutDialogFormVisible = false">Cancel</el-button>
        <el-button type="danger" @click="handleLogout">Logout</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
<style>
.app-setting-button-popper .el-menu-item.is-disabled {
  opacity: 1;
  border-bottom: 1px solid;
  border-bottom-color: var(--vt-c-white-mut) !important;
}
</style>
