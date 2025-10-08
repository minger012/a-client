<script setup lang="ts">
import { getConfigApi } from "@/services/api";
import { onMounted, ref } from "vue";

// 后台配置
const configData = ref<any>([]);
const getConfigData = async () => {
  await getConfigApi("6").then((res) => {
    configData.value = res.data;
  });
};
onMounted(async () => {
  Promise.all([getConfigData()]);
});
</script>
<template>
  <CpNavBar> </CpNavBar>
  <div class="page">
    <div class="scrollable-container">
      <div class="item-card" v-for="value in configData[6]">
        <div class="content">
          <div class="stars">
            <CpImage
              :name="value.icon"
              width="1.875rem"
              height="1.875rem"
            ></CpImage>
          </div>
          <div class="desc">{{ value.desc }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page {
  margin-top: var(--van-nav-bar-height);
  min-height: calc(100vh - var(--van-nav-bar-height));
  background-color: #f5f7fa;
  overflow: hidden;
  height: 100%;
  .scrollable-container {
    height: 100%;
    overflow-y: auto;
    padding-right: 2.66667vw;
    .item-card {
      width: 90%;
      border-radius: 3.2vw;
      margin: 5vw auto 0;
      display: flex;
      align-items: center;
      padding: 4vw;
      box-shadow: 0 0 0.53333vw #ccc;
      min-height: 28vw;
      &:last-child {
        margin-bottom: 5vw;
      }
      .content {
        flex: 1;
        .stars {
          display: flex;
        }
        .desc {
          color: #65676a;
          max-width: 100%;
          word-break: break-all;
          font-size: 4.26667vw;
          margin-top: 1.06667vw;
        }
      }
    }
  }
}
</style>
