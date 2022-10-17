<script lang="ts" setup>
import PageSubHeader from "@/views/_components/PageSubHeader.vue";
import type { Product } from ".prisma/client";
import { Edit, Delete } from "@element-plus/icons-vue";
import useProductsStore from "@/store/products";

const store = useProductsStore();
store.getProducts();

function getValue(key: string, value: any) {
  switch (key) {
    case "updatedAt":
    case "createdAt":
      return new Date(value).toLocaleString();
    default:
      return value;
  }
}
</script>

<template>
  <PageSubHeader title="Products" />
  <!-- Products Table -->
  <el-table :data="store.orderedProducts" :border="true" style="width: 100%" table-layout="auto" class="admin-products-table">
    <el-table-column type="expand">
      <template #default="props">
        <div v-for="(value, key) in ((props.row) as Product)" :key="key" class="expeneded-row-content">
          <span class="expeneded-row-content-key">{{ key }}: </span>
          <span>{{ getValue(key, value) }}</span>
        </div>
        <div class="action-buttons">
          <el-button type="primary" :icon="Edit" circle @click="() => store.openProductDialogEdit(props.row)" />
          <el-button type="danger" :icon="Delete" circle @click="() => store.deleteProduct(props.row.id)" :loading="store.deleteProductIsLoading" />
        </div>
      </template>
    </el-table-column>
    <el-table-column label="Title" prop="title" />
    <el-table-column label="Inventory" prop="inventory" />
    <el-table-column label="Price" prop="price" />
  </el-table>
</template>

<style scoped>
.expeneded-row-content {
  padding: 0vh 2vh;
}
.expeneded-row-content-key {
  text-transform: capitalize;
  font-weight: bold;
}
</style>

<style>
.admin-products-table .action-buttons {
  margin-right: 2vh;
  display: flex;
  justify-content: end;
}
</style>
