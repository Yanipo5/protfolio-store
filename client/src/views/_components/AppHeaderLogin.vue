<script lang="ts" setup>
import { reactive, ref } from "vue";

const dialogFormVisible = ref(false);
const formLabelWidth = "80px";

const form = reactive({
  name: "",
  password: ""
});
</script>

<template>
  <el-menu-item index="3" @click="dialogFormVisible = true">login</el-menu-item>
  <el-dialog v-model="dialogFormVisible" title="Login" class="app-header-login-dialog">
    <el-form :model="form">
      <el-form-item label="User" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" placeholder="Username | Email" />
      </el-form-item>
      <el-form-item label="Password" :label-width="formLabelWidth">
        <el-input v-model="form.password" autocomplete="off" type="password" placeholder="Password" show-password />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped></style>
<style>
.app-header-login-dialog {
  width: 100%;
}
.app-header-login-dialog .el-dialog__header {
  padding-bottom: 0;
}
.app-header-login-dialog .el-dialog__body {
  padding: 20px;
}
.app-header-login-dialog .el-dialog__footer {
  padding-top: 0;
}
</style>
