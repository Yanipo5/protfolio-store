<template>
  <div>{{ store.products }}</div>
</template>
<script lang="ts" setup>
import useCartStore from "@/store/cart";

const store = useCartStore();
</script>

<style scoped>
.card {
  margin: 1vh 0 0 0;
}
.card:deep() .el-card__body {
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
