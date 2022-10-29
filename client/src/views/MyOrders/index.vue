<template>
  <PageHeader />
  <div v-for="os in OrderStatus" :key="os">
    <div class="subtitle">{{ os.toLowerCase() }}</div>
    <div class="no-orders" v-if="!store.getOrdersByStatus(os).length">There are no {{ os.toLowerCase() }} orders.</div>
    <el-collapse v-else v-model="activeName[os]" accordion>
      <el-collapse-item v-for="(o, i) in store.getOrdersByStatus(os)" :title="`Order: ${o.id}`" :name="i" :key="o.id">
        <!-- Products in collapse area -->
        <div v-for="product in o.products" :key="product.productId" class="product">
          <img v-if="product.description?.image" :src="product.description.image" alt="" class="product-image" />
          <div class="product-details">
            <div>Quantity: {{ product.quantity }}</div>
            <div v-if="product.description?.price">Item Price: {{ product.description.price }} $</div>
            <div v-if="product?.itemTotalPrice">Total Item Price: {{ product.itemTotalPrice.toFixed(2) }} $</div>
          </div>
        </div>
        <div class="order-totals">Total Order Price: {{ o.totalPrice.toFixed(2) }} $</div>

        <!-- User Cancel Order -->
        <el-button type="primary" v-if="userStore.roles.user && o.status !== OrderStatus.CANCELED" @click="() => store.cancelOrder(o.id)">Cancel</el-button>

        <!-- Admin dropdown -->
        <div v-if="userStore.roles.admin && o.status !== OrderStatus.CANCELED" class="admin-dropdown">
          <span class="status-text">Status: </span>
          <el-dropdown>
            <el-button type="primary">
              <span>{{ o.status }}</span>
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="status in getDropDownListValues(o)" :key="status" @click="() => store.updateOrderStatus({ id: o.id, status })">{{ status }} </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import type { Order, OrderStatus as OrderStatusType } from "@prisma/client";
import { OrderStatus } from "@prisma/client";
import { ArrowDown } from "@element-plus/icons-vue";
import useOrdersStore from "@/store/orders";
import useuserStore from "@/store/user";
import PageHeader from "@/views/_components/PageHeader.vue";

const store = useOrdersStore();
const userStore = useuserStore();
store.getOrders();

type OrdersCollapseState = { [key in OrderStatusType]: number };
const activeName = ref<OrdersCollapseState>(Object.entries(OrderStatus).reduce((o, [key, value]) => ({ ...o, [key]: null }), {} as OrdersCollapseState));

const getDropDownListValues = (o: Order): OrderStatusType[] => Object.values(OrderStatus).filter((v) => v !== o.status && v !== "CREATED" && v !== "CANCELED");
</script>

<style scoped>
.subtitle {
  padding: 2vh;
  text-transform: capitalize;
}

.el-collapse-item:deep(.el-collapse-item__header),
.el-collapse-item:deep(.el-collapse-item__content) {
  padding-left: 2vh;
}
.no-orders {
  padding-left: 4vh;
}

.el-collapse-item:deep(.el-collapse-item__content) {
  padding-bottom: 2vh;
}
.admin-dropdown {
  display: flex;
  align-items: center;
  justify-content: end;
  padding-right: 2vh;
}
.status-text {
  padding-right: 2vh;
}
.product {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  margin-bottom: 2vh;
}
.product-image {
  flex: 50vw 0 0;
  width: 50vw;
  max-height: 15vh;
  object-fit: contain;
}
.product-details {
  margin-left: 2vh;
}

.order-totals {
  text-align: end;
  margin-right: 2vh;
}
</style>
