<template>
  <PageHeader />
  <div v-for="os in OrderStatus" :key="os" v-show="store.getOrdersByStatus(os).length">
    <div class="subtitle">{{ os }}</div>
    <el-collapse v-model="activeName[os]" accordion>
      <el-collapse-item v-for="(o, i) in store.getOrdersByStatus(os)" title="Order" :name="i" :key="o.id">
        <div v-for="product in o.products" :key="product.productId">
          <span>{{ product }}</span>
        </div>
        <el-button v-if="userStore.roles.user" @click="() => store.updateOrderStatus({ id: o.id, status: OrderStatus.CANCELED })">Cancel</el-button>
        <!-- Admin dropdown -->
        <el-dropdown v-if="userStore.roles.admin">
          <el-button type="primary">
            {{ o.status }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>

          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="status in getDropDownListValues(o)" :key="status" @click="() => store.updateOrderStatus({ id: o.id, status })">{{ status }} </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { Order, OrderStatus as OrderStatusType } from "@prisma/client";
import { OrderStatus } from "@prisma/client";
import useOrdersStore from "@/store/orders";
import useuserStore from "@/store/user";
import PageHeader from "@/views/_components/PageHeader.vue";

const store = useOrdersStore();
const userStore = useuserStore();
store.getOrders();

type OrdersCollapseState = { [key in OrderStatusType]: number };
const activeName = ref<OrdersCollapseState>(Object.entries(OrderStatus).reduce((o, [key, value]) => ({ ...o, [key]: null }), {} as OrdersCollapseState));

const getDropDownListValues = (o: Order): OrderStatusType[] => Object.values(OrderStatus).filter((v) => v !== o.status && v !== "CREATED");
</script>

<style scoped>
.subtitle {
  padding: 2vh;
}

.el-collapse-item:deep(.el-collapse-item__header),
.el-collapse-item:deep(.el-collapse-item__content) {
  padding-left: 2vh;
}

.el-collapse-item:deep(.el-collapse-item__content) {
  padding-bottom: 2vh;
}
</style>
