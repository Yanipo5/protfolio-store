<template>
  <PageHeader />
  <!-- Cart -->
  <el-card v-for="p in cartStore.cart" :key="p.id" class="card">
    <div class="image">
      <img v-if="p.image" :src="p.image" />
      <img v-else src="@/assets/no_image.jpg" />
    </div>
    <div class="content">
      <div class="title">{{ p.title }}</div>
      <el-input-number v-model="p.quantity" :min="0" :max="5" @change="(value: number) => cartStore.updateProductQuantity(p.id,value)" />
      <div class="prices">
        <div>each {{ p.price }} $</div>
        <div>total {{ p.totalPrice.toFixed(2) }} $</div>
      </div>
    </div>
  </el-card>

  <!-- Total & Action -->
  <div class="bottom">
    <div class="total-price">Total: {{ cartStore.cartTotal }} $</div>
    <el-button type="primary" size="large" @click="buttonAction">{{ buttonTxt() }}</el-button>
  </div>
</template>

<script lang="ts" setup>
import useCartStore from "@/store/cart";
import useUserStore from "@/store/user";
import PageHeader from "@/views/_components/PageHeader.vue";
import { useRouter } from "vue-router";

const router = useRouter();
const cartStore = useCartStore();
const userStore = useUserStore();
cartStore.getProductsDefinitions();

const buttonTxt = () => (userStore.roles.viewer ? "Login" : "Order Now");
const buttonAction = async () => {
  if (userStore.roles.viewer) userStore.loginDialogFormVisible = true;
  else {
    await cartStore.orderCart();
    router.push("/my-orders");
  }
};
</script>

<style scoped>
.card {
  margin-top: 1vh;
}
.card:deep(.el-card__body) {
  padding: 1vh;
  display: flex;
  flex-direction: row;
}
.image {
  width: 30vw;
}
.content {
  margin-left: 1vh;
  flex-grow: 1;
}
.title {
  font-weight: bold;
}
.prices {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.image:deep(img) {
  width: 100%;
  height: 100%;
}
.bottom {
  display: flex;
  /* justify-content: space-between; */
  margin-top: 1vh;
  flex-direction: column;
  align-items: center;
}
.total-price {
  font-size: 3vh;
  margin-bottom: 1vh;
}
</style>
