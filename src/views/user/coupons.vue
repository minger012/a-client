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
const tabsActive = ref(0);
</script>
<template>
  <CpNavBar title="优惠券"> </CpNavBar>
  <div class="tab-wrap">
    <van-tabs v-model:active="tabsActive" line-width="5.625rem">
      <van-tab title="全部"></van-tab>
      <van-tab title="未使用"></van-tab>
      <van-tab title="已使用"></van-tab>
    </van-tabs>
  </div>
  <van-list
    v-model:loading="loading"
    :finished="finished"
    finished-text="no more"
    loading-text="loading..."
    error-text="fail"
    @load="onLoad"
  >
    <div class="coupon-list">
      <div role="feed" class="van-list" aria-busy="false">
        <div class="coupon-item used">
          <div class="item-left">
            <div class="coupon-type">增值劵</div>
            <div class="tag"></div>
          </div>
          <div class="item-content">
            <div class="title-line">
              <div class="title">New user value added 30% coupon</div>
              <span class="text">已過期</span>
            </div>
            <div class="name">Minimum threshold of $5000</div>
            <div class="time">2025/08/31 09:53:53過期</div>
          </div>
        </div>
        <div class="van-list__placeholder"></div>
      </div>
    </div>
  </van-list>
</template>
<style lang="scss" scoped>
.tab-wrap {
  margin-top: var(--van-nav-bar-height);
}
.coupon-list {
  padding: 5.89744vw 8.10256vw;
  .coupon-item {
    position: relative;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: stretch;
    min-height: 28.61538vw;
    margin-bottom: 3.84615vw;
    padding-left: 30.76923vw;
    &.used .item-left,
    &.used .item-left .tab {
      background: #adadad;
    }
    &.used .item-content .title-line .title {
      color: #8e8e8e;
    }
    &.used .item-content .title-line .title,
    &.used .item-content .title-line .text {
      color: #8e8e8e;
    }
    .item-left {
      background: #adadad;
      position: relative;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-align: center;
      -webkit-align-items: center;
      align-items: center;
      -webkit-box-pack: center;
      -webkit-justify-content: center;
      justify-content: center;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -webkit-flex-direction: column;
      flex-direction: column;
      -webkit-flex-shrink: 0;
      flex-shrink: 0;
      width: 30.76923vw;
      height: 100%;
      border-radius: 4.10256vw 0 0 4.10256vw;
      background: var(--van-primary-color);
      position: absolute;
      left: 0;
      bottom: 0;
      &::before {
        content: "";
        position: absolute;
        width: 6.66667vw;
        height: 6.66667vw;
        border-radius: 50%;
        left: -3.33333vw;
        top: 8.97436vw;
        z-index: 1;
        background: var(--van-white);
      }
      .coupon-type {
        color: var(--van-white);
        font-size: 5.02821vw;
        font-weight: 600;
        line-height: 1;
        margin-bottom: 2.05128vw;
        word-break: break-all;
        text-align: center;
        padding-left: 3.02564vw;
      }
      .tag {
        color: #adadad;
        padding: 1.02564vw 3.07692vw;
        border-radius: 7.69231vw;
        background: var(--van-white);
        color: var(--van-primary-color);
        font-size: 2.5641vw;
        line-height: 1;
        position: absolute;
        bottom: -1px;
      }
    }
    .item-content {
      background: #edf5fe;
      min-height: 28.61538vw;
      position: relative;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -webkit-flex-direction: column;
      flex-direction: column;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      background: #edf5fe;
      border-radius: 0 4.10256vw 4.10256vw 0;
      padding: 4.10256vw 6.15385vw 4.10256vw 5.12821vw;
      height: 100%;
      line-height: 1;
      &::after {
        content: "";
        position: absolute;
        width: 6.66667vw;
        height: 6.66667vw;
        border-radius: 50%;
        right: -3.33333vw;
        top: 8.97436vw;
        z-index: 1;
        background: var(--van-white);
      }
      .title-line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1.53846vw;
        .title {
          font-size: 4.82821vw;
          font-weight: 600;
          color: var(--van-black);
          word-break: break-all;
        }
        .text {
          color: var(--van-primary-color);
          font-size: 2.5641vw;
          white-space: nowrap;
        }
      }
      .name {
        color: #8e8e8e;
      }
      .time {
        font-size: 2.5641vw;
        color: var(--van-black);
        opacity: 0.3;
        margin-top: 1.37692vw;
      }
    }
  }
}
</style>
