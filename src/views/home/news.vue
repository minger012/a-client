<script setup lang="ts">
import { getConfigApi } from "@/services/api";
import { onMounted } from "vue";
import { ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const id = route.query.id as unknown as number;
// 后台配置
const configData = ref<any>([]);
const getConfigData = async () => {
  await getConfigApi("7").then((res) => {
    configData.value = res.data[7].find((item: any, key: any) => {
      if (key == id) {
        return item;
      }
    });
  });
};
onMounted(() => {
  getConfigData();
});
</script>
<template>
  <CpNavBar :isLogin="true" :is-lang="false"> </CpNavBar>
  <div class="page">
    <div class="content">{{ configData.answer }}</div>
  </div>
</template>
<style lang="scss" scoped>
.page {
  margin-top: var(--van-nav-bar-height);
  padding: 5.12821vw 4.10256vw;
  .content {
    font-size: 3.58974vw;
    line-height: 8.20513vw;
    word-break: break-all;
    color: #000000e0;
  }
}
</style>
