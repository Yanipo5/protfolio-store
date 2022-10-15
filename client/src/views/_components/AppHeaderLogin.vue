<script lang="ts" setup>
import { reactive, ref } from "vue";
import api, { basicAuthClient } from "@/utils/api";
import useUserStore from "@/store/user";

const store = useUserStore();
const dialogFormVisible = ref(false);
const formMode = ref<"LOGIN" | "SIGN_UP">("LOGIN");
const formLabelWidth = "80px";

const form = reactive({
  email: "",
  password: ""
});

async function handleSignUp() {
  const res = await api.mutation("user.signUp", form);
  store.saveRoles(res.roles);
  dialogFormVisible.value = false;
}
async function handleLogin() {
  const client = basicAuthClient(form);
  const res = await client.query("user.login");
  store.saveRoles(res.roles);
  dialogFormVisible.value = false;
}
const getTitle = () => {
  return formMode.value === "LOGIN" ? "Login" : "Sign Up";
};
</script>

<template>
  <el-menu-item index="3" @click="dialogFormVisible = true">Login</el-menu-item>
  <el-dialog v-model="dialogFormVisible" :title="getTitle()" class="app-header-login-dialog">
    <el-form :model="form">
      <el-form-item label="User" :label-width="formLabelWidth">
        <el-input v-model="form.email" autocomplete="off" placeholder="Username | Email" />
      </el-form-item>
      <el-form-item label="Password" :label-width="formLabelWidth">
        <el-input v-model="form.password" autocomplete="off" type="password" placeholder="Password" show-password />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <span>
          <el-button @click="dialogFormVisible = false">Cancel</el-button>
          <el-button v-if="formMode === 'LOGIN'" type="primary" @click="handleLogin">Login</el-button>
          <el-button v-else type="primary" @click="handleSignUp">SignUp</el-button>
        </span>
      </span>
      <div class="login-mode-switch">
        <span v-if="formMode === 'LOGIN'" @click="formMode = 'SIGN_UP'">or sign up instead</span>
        <span v-else @click="formMode = 'LOGIN'">or login instead</span>
      </div>
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
.app-header-login-dialog .login-mode-switch {
  color: var(--el-color-primary);
  text-decoration: underline;
}
</style>
