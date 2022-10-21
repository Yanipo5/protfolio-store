<template>
  <el-row>
    <el-col v-for="(o, i) in 3" :key="o">
      <el-card class="card">
        <div class="product-wrapper">
          <img src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" class="image" />
          <div class="content">
            <div class="title">Yummy hamburger</div>
            <div class="description">Yummy hamburger is good for you</div>
            <div class="price">{{ o }}</div>
            <div style="flex-grow: 1" />
            <el-button type="primary" size="large" class="button">Add To Cart</el-button>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { ref } from "vue";

const currentDate = ref(new Date());
</script>

<style scoped>
.card {
  margin: 1vh 0 0 0;
}
.card >>> .el-card__body {
  padding: 1vh;
}
.product-wrapper {
  display: flex;
  /* height: calc(33vh - 58px); */
  height: calc((100vh - 6vh - 58px) / 3);
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
