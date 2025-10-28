<script setup lang="ts">
import { getConfigApi, getUserInfoApi } from "@/services/api";
import { useUserStore } from "@/stores/stores";
import { onMounted, ref, watch } from "vue";

const userStore = useUserStore();
// 动态计算初始位置，使其固定在右边，距离右边缘50px，垂直位置在屏幕中部偏下
const offset = ref({ 
  x: window.innerWidth - 60, // 距离右边缘约50-100px
  y: window.innerHeight * 0.8 // 垂直位置在屏幕60%处
});
const iconName = ref("service");
const serviceAddress = ref("");

// 后台配置
const configData = ref<any>([]);
const getConfigData = async () => {
  await getConfigApi("3").then((res) => {
    configData.value = res.data;
  });
};

// 获取用户服务地址
const fetchUserServiceAddress = async () => {
  if (!userStore.user?.token) {
    serviceAddress.value = "";
    return;
  }
  await getUserInfoApi().then((res) => {
    serviceAddress.value = res.data?.service_address || "";
  });
};

const onLink = () => {
  const link =
    serviceAddress.value ||
    configData.value[3][Math.floor(Math.random() * configData.value[3].length)]
      .link;
  if (link) {
    window.open(link);
  }
};

// 监听 token 变化
watch(
  () => userStore.user?.token,
  (token) => {
    if (token) {
      fetchUserServiceAddress();
    } else {
      serviceAddress.value = "";
    }
  },
  { immediate: true }
);

onMounted(() => {
  getConfigData();
});
</script>

<template>
  <van-floating-bubble
    v-model:offset="offset"
    axis="xy"
    magnetic="x"
    @click="onLink()"
    v-if="configData[3] || serviceAddress"
  >
    <van-icon :name="iconName" size="1.5rem" />
  </van-floating-bubble>
</template>

<style scoped></style>
