<script lang="ts" setup>
import PageHeader from "@/views/_components/PageHeader.vue";
import ProductsTable from "./ProductsTable.vue";
import useProductsStore from "@/store/products";

const store = useProductsStore();

const getPlaceholder = (key: string) => (key === "image" ? "Image url" : "");
const getShow = (key: string) => key !== "id";
</script>

<template>
  <div class="wrapper">
    <!-- Header -->
    <PageHeader />

    <!-- Add Product -->
    <span class="success-button">
      <el-button type="primary" @click="store.openProductDialogCreate" size="large">Add Product</el-button>
    </span>
    <!-- Products Table -->
    <ProductsTable />
  </div>

  <!-- Add Product Dialog -->
  <el-dialog v-model="store.dialogFormVisible" title="Add Product" class="add-product-dialog">
    <el-form :model="store.productDialog">
      <el-form-item v-for="(k, name) in store.productDialog" :key="name" v-show="getShow(name)" :label="`${name}:`" label-width="100px" class="form-label">
        <el-input-number v-if="typeof store.productDialog[name] === 'number'" v-model="store.productDialog[name]" :min="0" />
        <el-input v-else v-model="store.productDialog[name]" autocomplete="off" :placeholder="getPlaceholder(name)" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="store.dialogFormVisible = false">Cancel</el-button>
        <el-button type="success" @click="store.handleConfirm()" :loading="store.isProductDialogLoading">Confirm</el-button>
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

.wrapper {
  display: flex;
  height: 100%;
  flex-direction: column;
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
