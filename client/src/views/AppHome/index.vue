<template>
  <el-row>
    <el-col v-for="(p, i) in productsStore.products" :key="p.id">
      <el-card class="card">
        <div class="product-wrapper">
          <img v-if="p.image" :src="p.image" class="image" />
          <img v-else src="@/assets/no_image.jpg" class="image" />
          <div class="content">
            <div class="title">{{ p.title }}</div>
            <div class="description">{{ p.description }}</div>
            <div class="price">{{ p.price }} $</div>
            <div style="flex-grow: 1" />
            <el-button type="primary" size="large" class="button" @click="() => cartStore.addToCart(p)">Add To Cart</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import useProductsStore from "@/store/products";
import useCartStore from "@/store/cart";

const cartStore = useCartStore();
const productsStore = useProductsStore();
productsStore.getProducts();
const producs = productsStore.products;
</script>

<style scoped>
.card {
  margin: 1vh 0 0 0;
}
.card:deep(.el-card__body) {
  padding: 1vh;
}
.product-wrapper {
  display: flex;
  /* height: calc(33vh - 58px); */
  height: calc((100vh - 10vh - 58px) / 3);
}

.title {
  font-size: 3vh;
  font-weight: bold;
  line-height: 3vh;
  border-bottom: 1px darkgray solid;
  padding-bottom: 1vh;
}

.description {
  padding-top: 1vh;
  font-size: 2vh;
  line-height: 2vh;
}

.price {
  padding-top: 5vh;
  font-size: 3vh;
  font-weight: bold;
  line-height: 2vh;
  color: darkgreen;
}

.image {
  width: 50vw;
  display: block;
  min-width: 50vw;
  object-fit: contain;
}

.content {
  padding: 0vh 1vh 0vh 1vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-family: "Brush Script MT, Brush Script Std, cursive	";
}
</style>
