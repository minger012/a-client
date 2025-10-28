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
    padding-right: 0.6250rem;
    .item-card {
      width: 90%;
      border-radius: 0.7500rem;
      margin: 1.1719rem auto 0;
      display: flex;
      align-items: center;
      padding: 0.9375rem;
      box-shadow: 0 0 0.1250rem #ccc;
      min-height: 6.5625rem;
      &:last-child {
        margin-bottom: 1.1719rem;
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
          font-size: 1.0000rem;
          margin-top: 0.2500rem;
        }
      }
    }
  }
}
</style>
