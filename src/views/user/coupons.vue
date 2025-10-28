<script setup lang="ts">
import { useNumber, useTime } from "@/composables/common";
import { getCouponListApi } from "@/services/api";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const number = useNumber();
const time = useTime();
// 定义传参
const params = ref<PageParams>({
  page: 0,
  pageSize: 10,
});

const tabsActive = ref(0);
// 分页加载
const loading = ref(false);
const finished = ref(false);
const CouponList = ref<any>([]);
const onLoad = async () => {
  if (finished.value) {
    return;
  }
  loading.value = true;
  params.value.page++;
  await getCouponListApi(params.value, tabsActive.value)
    .then((res) => {
      CouponList.value.push(...res.data.list);
      if (params.value.page >= res.data.total_page) {
        finished.value = true;
      }
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
};
// 下拉刷新
const refreshing = ref(false);
const onRefresh = async () => {
  params.value.page = 1;
  await getCouponListApi(params.value, tabsActive.value)
    .then((res) => {
      CouponList.value = res.data.list;
      refreshing.value = false;
    })
    .catch(() => {
      refreshing.value = false;
    });
};
watch(tabsActive, async (newVal) => {
  params.value.page = 1;
  CouponList.value = [];
  refreshing.value = true;
  await getCouponListApi(params.value, newVal)
    .then((res) => {
      CouponList.value = res.data.list;
      refreshing.value = false;
    })
    .catch(() => {
      refreshing.value = false;
    });
});
let couponTypeName = {
  1: t("coupons.valueAdded"),
  2: t("coupons.deduction"),
  3: t("coupons.team"),
  4: t("coupons.custom"),
  5: t("coupons.fixedAmount"),
};
let stateName = {
  1: t("coupons.unused"),
  2: t("coupons.used"),
  3: t("coupons.isExpired"),
};
</script>
<template>
  <CpNavBar> </CpNavBar>
  <div class="tab-wrap">
    <van-tabs v-model:active="tabsActive" line-width="5.625rem">
      <van-tab :title="t('coupons.all')"></van-tab>
      <van-tab :title="t('coupons.unused')"></van-tab>
      <van-tab :title="t('coupons.used')"></van-tab>
    </van-tabs>
  </div>
  <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      @load="onLoad"
      :finished-text="t('common.noMore')"
    >
      <div class="coupon-list">
        <div role="feed" class="van-list" aria-busy="false">
          <div
            class="coupon-item"
            :class="value.state == 1 ? '' : 'used'"
            v-for="value in CouponList"
          >
            <div class="item-left">
              <div class="coupon-type">
                {{ (couponTypeName as any)[value.type] }}
              </div>
              <div class="tag"></div>
            </div>
            <div class="item-content">
              <div class="title-line">
                <div class="title">{{ value.name }}</div>
                <span class="text">{{ (stateName as any)[value.state] }}</span>
              </div>
              <div class="name">{{ value.intro }}</div>
              <div class="time">
                {{
                  t("coupons.validUntil", {
                    date: time.formatToMonthDay(value.create_time, 1),
                  })
                }}
              </div>
            </div>
          </div>
          <div class="van-list__placeholder"></div>
        </div>
      </div>
    </van-list>
  </van-pull-refresh>
</template>
<style lang="scss" scoped>
.tab-wrap {
  margin-top: var(--van-nav-bar-height);
}
.coupon-list {
  padding: 1.3822rem 1.8990rem;
  .coupon-item {
    position: relative;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: stretch;
    min-height: 6.7067rem;
    padding-left: 7.2115rem;
    &:not(:last-child) {
      margin-bottom: 0.9014rem;
    }
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
      width: 7.2115rem;
      height: 100%;
      border-radius: 0.9615rem 0 0 0.9615rem;
      background: var(--van-primary-color);
      position: absolute;
      left: 0;
      bottom: 0;
      &::before {
        content: "";
        position: absolute;
        width: 1.5625rem;
        height: 1.5625rem;
        border-radius: 50%;
        left: -0.7812rem;
        top: 2.1034rem;
        z-index: 1;
        background: var(--van-white);
      }
      .coupon-type {
        color: var(--van-white);
        font-size: 1.1785rem;
        font-weight: 600;
        line-height: 1;
        margin-bottom: 0.4808rem;
        word-break: break-word;
        text-align: center;
        padding-left: 0.7091rem;
      }
      .tag {
        color: #adadad;
        padding: 0.2404rem 0.7212rem;
        border-radius: 1.8029rem;
        background: var(--van-white);
        color: var(--van-primary-color);
        font-size: 0.6010rem;
        line-height: 1;
        position: absolute;
        bottom: -1px;
      }
    }
    .item-content {
      background: #edf5fe;
      min-height: 6.7067rem;
      position: relative;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      justify-content: space-between;
      -webkit-box-orient: vertical;
      -webkit-box-direction: normal;
      -webkit-flex-direction: column;
      flex-direction: column;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      background: #edf5fe;
      border-radius: 0 0.9615rem 0.9615rem 0;
      padding: 0.9615rem 1.4423rem 0.9615rem 1.2019rem;
      height: 100%;
      line-height: 1;
      &::after {
        content: "";
        position: absolute;
        width: 1.5625rem;
        height: 1.5625rem;
        border-radius: 50%;
        right: -0.7812rem;
        top: 2.1034rem;
        z-index: 1;
        background: var(--van-white);
      }
      .title-line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.3606rem;
        .title {
          font-size: 1.1316rem;
          font-weight: 600;
          color: var(--van-black);
          word-break: break-all;
        }
        .text {
          color: var(--van-primary-color);
          font-size: 0.6010rem;
          white-space: nowrap;
        }
      }
      .name {
        color: #8e8e8e;
      }
      .time {
        font-size: 0.6010rem;
        color: var(--van-black);
        opacity: 0.3;
        margin-top: 0.3227rem;
      }
    }
  }
}
</style>
