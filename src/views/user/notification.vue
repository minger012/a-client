<script setup lang="ts">
import { ref } from "vue";
// 定义传参
const params = ref<{}>({
  page: 0,
  pageSize: 10,
});
// 分页加载
const loading = ref(false);
const finished = ref(false);
const goodList = ref<any>([]);
const onLoad = async () => {
  if (finished.value) {
    return;
  }
  loading.value = true;
  params.value.page++;
  if (params.value.page >= 11) {
    finished.value = true;
  }
  loading.value = false;
};
// 下拉刷新
const refreshing = ref(false);
const onRefresh = async () => {
  refreshing.value = false;
};
const value1 = ref(0);
const value2 = ref(0);
const option1 = [
  { text: "全部消息", value: 0 },
  { text: "系统公告", value: 1 },
  { text: "系统维护", value: 2 },
  { text: "活动通知", value: 3 },
];
const option2 = [
  { text: "全部状态", value: 0 },
  { text: "未读消息", value: 1 },
  { text: "已读消息", value: 2 },
];
</script>
<template>
  <CpNavBar> </CpNavBar>
  <div class="page">
    <div class="filter-section">
      <van-dropdown-menu swipe-threshold="2">
        <van-dropdown-item v-model="value1" :options="option1" />
        <van-dropdown-item v-model="value2" :options="option2" />
      </van-dropdown-menu>
    </div>
    <div class="message-list">
      <van-pull-refresh
        v-model="refreshing"
        @refresh="onRefresh"
        pulling-text="Pull down to refresh..."
        loosing-text="Release to refresh..."
        loading-text="loading..."
      >
        <van-empty description="暂无消息" v-if="true" />
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="no more"
          loading-text="loading..."
          error-text="fail"
          @load="onLoad"
          v-else
        >
          11
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page {
  margin-top: var(--van-nav-bar-height);
  background-color: #f7f8fa;
  min-height: calc(100vh - var(--van-nav-bar-height));
  display: flex;
  flex-direction: column;
}
::v-deep() {
  .van-dropdown-menu__bar--opened {
    z-index: 0;
  }
  .van-dropdown-item__option--active {
    background-color: #f0f9ff;
  }
}
</style>
