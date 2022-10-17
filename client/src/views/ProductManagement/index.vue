<script lang="ts" setup>
import { reactive, ref } from "vue";
import api, { sanitazeInputPayload } from "@/utils/api";

const dialogFormVisible = ref(false);
const formLabelWidth = "100px";

const getDefualtState = () => ({
  title: "My New Product",
  inventory: 100,
  price: 9.99,
  comment: "Comment or description",
  image: ""
});

const form = reactive(getDefualtState());

async function handleConfirm() {
  await api.mutation("product.add", sanitazeInputPayload(form) as ReturnType<typeof getDefualtState>);
  dialogFormVisible.value = false;
}
</script>
<template>
  <!-- Form -->
  <span class="success-button">
    <el-button type="primary" @click="dialogFormVisible = true" size="large">Add Product </el-button>
  </span>

  <el-dialog v-model="dialogFormVisible" title="Add Product" class="add-product-dialog">
    <el-form :model="form">
      <el-form-item v-for="(k, name) in getDefualtState()" :key="name" :label="`${name}:`" :label-width="formLabelWidth" class="form-label">
        <el-input v-if="typeof form[name] === 'string'" v-model="form[name]" autocomplete="off" />
        <el-input-number v-else v-model="form[name]" :min="0" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button type="success" @click="handleConfirm()">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.success-button {
  margin-top: 2vh;
  margin-bottom: 2vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-label {
  text-transform: capitalize;
}
</style>

<style>
.add-product-dialog {
  width: 100%;
}
</style>

<style>
.add-product-dialog .el-dialog__body {
  padding-top: 20px;
  padding-bottom: 20px;
}
.add-product-dialog .el-dialog__footer {
  padding-top: 0;
}
</style>
