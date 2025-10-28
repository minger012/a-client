<script setup lang="ts">
import { useNumber, useTime } from "@/composables/common";
import {
  getConfigApi,
  getCouponListApi,
  getUserInfoApi,
  planOrderAddApi,
  planOrderSendAddApi,
} from "@/services/api";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const number = useNumber();
const time = useTime();
// 下单
const money = ref("");
const cd = ref("");
const plan_id = ref("");
const plan_name = ref("");
const min = ref("");
const max = ref("");
const order_id = ref("");
const pay_password = ref("");
const disabled = ref(true);
// 支付密码
watch(pay_password, (newVal) => {
  // 限制只能输入数字且最多6位
  pay_password.value = newVal.replace(/[^\d]/g, "").slice(0, 6);
  if (pay_password.value.length == 6) {
    disabled.value = false;
  } else {
    disabled.value = true;
  }
});
// 下单
const orderAdd = async () => {
  if (pay_password.value.length != 6) {
    showBottom2.value = true;
    return;
  }
  showBottom2.value = false;
  if (plan_id.value) {
    await planOrderAddApi(
      plan_id.value,
      money.value,
      pay_password.value,
      cd.value,
      checkCouponData.value?.id || ""
    )
      .then((res) => {
        showBottom.value = false;
        money.value = "";
        cd.value = "";
        plan_id.value = "";
        checkCouponData.value = null;
        showSuccessToast(res.msg);
        getUserInfo();
      })
      .finally(() => {
        pay_password.value = "";
      });
  } else {
    await planOrderSendAddApi(
      order_id.value,
      money.value,
      pay_password.value,
      checkCouponData.value?.id || ""
    )
      .then((res) => {
        showBottom3.value = false;
        money.value = "";
        order_id.value = "";
        min.value = "";
        max.value = "";
        checkCouponData.value = null;
        showSuccessToast(res.msg);
        getUserInfo();
      })
      .finally(() => {
        pay_password.value = "";
      });
  }
};
// 玩家信息
const userInfo = ref();
const getUserInfo = async () => {
  await getUserInfoApi().then((res) => {
    userInfo.value = res.data;
  });
};
// 定义传参
const params = ref<PageParams>({
  page: 0,
  pageSize: 10,
});
// 弹出层-下单
const showBottom = ref(false);
const showBottom2 = ref(false);
const showBottom3 = ref(false);
// 弹出层-优惠券
const showCoupon = ref(false);
const tabsActive = ref(0);
// 弹出层-优惠券-分页加载
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
    })
    .finally(() => {
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
    })
    .finally(() => {
      refreshing.value = false;
    });
});
// 选择优惠券
const checkCouponData = ref();
const checkCoupon = (detail: any) => {
  if (detail.state != 1) {
    return;
  }
  showCoupon.value = false;
  checkCouponData.value = detail;
};

// 后台配置
const configData = ref<any>([]);
const getConfigData = async () => {
  await getConfigApi("1").then((res) => {
    configData.value = res.data;
  });
};
let couponTypeName = {
  1: t("putin.valueAdded"),
  2: t("putin.deduction"),
  3: t("putin.team"),
  4: t("putin.custom"),
  5: t("putin.fixedAmount"),
};
let stateName = {
  1: t("putin.unused"),
  2: t("putin.used"),
  3: t("putin.expired"),
};
// 暴露变量和方法给父组件
defineExpose({
  showBottom,
  showBottom3,
  plan_id,
  plan_name,
  min,
  max,
  order_id,
});
onMounted(async () => {
  Promise.all([getConfigData(), getUserInfo()]);
});
</script>
<template>
  <van-popup
    v-model:show="showBottom3"
    round
    closeable
    position="bottom"
    :style="{ height: '55%' }"
  >
    <div class="dialog-wrap">
      <div class="dialog-title">{{ t("putin.placementAmount") }}</div>
      <div class="form-wrap">
        <div class="input-wrap">
          <span class="label">{{ configData[1] }}</span>
          <div class="van-cell van-field">
            <div class="van-cell__value van-field__value">
              <div class="van-field__body">
                <input
                  type="text"
                  id="van-field-8-input"
                  class="van-field__control"
                  :placeholder="min + '~' + max"
                  data-allow-mismatch="attribute"
                  v-model="money"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="form-tips">
          <span class="count-money">
            {{ t("putin.availableBalance") }}
            {{ configData[1] }}
            {{ number.formatMoney(userInfo.money) }}
          </span>
          <span class="all-text" @click="money = userInfo.money">
            {{ t("putin.all") }}
          </span>
        </div>
        <div class="coupon-item" @click="showCoupon = true">
          <span class="title">{{ t("putin.coupon") }} </span>
          <div class="status">
            <span class="status-text">
              {{ checkCouponData?.name || t("putin.unused") }}
            </span>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>
      <div class="mt-6">
        <van-button block round type="primary" @click="orderAdd()">
          <span class="font-[600] text-base">
            {{ t("putin.realTimePlacement") }}
          </span>
        </van-button>
      </div>
    </div>
  </van-popup>
  <van-popup
    v-model:show="showBottom"
    round
    closeable
    position="bottom"
    :style="{ height: '70%' }"
  >
    <div class="placement-modal">
      <div class="modal-header">
        <h3>{{ t("putin.placementSettings") }}</h3>
      </div>
      <div class="modal-content">
        <div class="plan-summary">
          <h4>{{ plan_name }}</h4>
          <div class="summary-info">
            <div class="summary-item">
              <span class="label compact"
                >{{ t("putin.availableBalance") }}: </span
              ><span class="value"
                >{{ configData[1]
                }}{{ number.formatMoney(userInfo.money) }}</span
              >
            </div>
          </div>
        </div>
        <div class="placement-form">
          <form class="van-form">
            <div class="form-field-group">
              <div class="field-wrapper">
                <label class="field-label">{{
                  t("putin.placementAmount")
                }}</label>
                <div class="field-input-wrapper">
                  <span class="currency-symbol">{{ configData[1] }}</span
                  ><input
                    class="field-input"
                    :placeholder="t('putin.enterAmount')"
                    v-model="money"
                  />
                </div>
              </div>
              <div class="field-wrapper">
                <label class="field-label">{{
                  t("putin.placementDuration")
                }}</label>
                <div class="field-input-wrapper">
                  <input
                    type="number"
                    class="field-input"
                    :placeholder="t('putin.enterSeconds')"
                    v-model="cd"
                  /><span class="duration-unit">{{ t("putin.seconds") }}</span>
                </div>
              </div>
            </div>
            <div class="coupon-item" @click="showCoupon = true">
              <span class="title">{{ t("putin.coupon") }} </span>
              <div class="status">
                <span class="status-text">
                  {{ checkCouponData?.name || t("putin.unused") }}
                </span>
                <van-icon name="arrow" />
              </div>
            </div>
            <div class="form-tips">
              <div class="tip-item">
                <van-icon name="info" color="#4e7cdc" />
                <span>{{ t("putin.tip1") }}</span>
              </div>
              <div class="tip-item">
                <van-icon name="info" color="#4e7cdc" />
                <span>{{ t("putin.tip2") }}</span>
              </div>
            </div>
            <div class="form-actions">
              <van-button
                block
                round
                type="primary"
                @click="showBottom2 = true"
              >
                <span class="font-[600] text-base">{{
                  t("putin.confirmPlacement")
                }}</span>
              </van-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </van-popup>
  <van-popup v-model:show="showCoupon" position="bottom" style="height: 100%">
    <CpNavBar :title="t('putin.coupon')">
      <template #left>
        <CpSvg name="back" size="1.2019rem" @click="showCoupon = false"></CpSvg>
      </template>
    </CpNavBar>
    <div class="tab-wrap">
      <van-tabs v-model:active="tabsActive" line-width="5.625rem">
        <van-tab :title="t('putin.all')"></van-tab>
        <van-tab :title="t('putin.unused')"></van-tab>
        <van-tab :title="t('putin.used')"></van-tab>
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
              @click="checkCoupon(value)"
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
                  <span class="text">{{
                    (stateName as any)[value.state]
                  }}</span>
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
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </van-popup>
  <van-popup
    v-model:show="showBottom2"
    position="bottom"
    round
    :style="{ height: '95%' }"
  >
    <div class="dialog-wrap">
      <div class="dialog-title">{{ t("putin.transactionPassword") }}</div>
      <div class="desc">{{ t("putin.enterTransactionPassword") }}</div>
      <!-- 密码输入框 -->
      <van-password-input :value="pay_password" :length="6" />
      <van-number-keyboard v-model="pay_password" :show="true" />
      <van-button
        type="primary"
        round
        block
        style="margin-top: 2rem"
        :disabled="disabled"
        @click="orderAdd()"
      >
        <span class="text-sm">{{ t("putin.confirm") }}</span>
      </van-button>
    </div>
  </van-popup>
</template>
<style lang="scss" scoped>
.placement-modal {
  height: 100%;
  display: flex;
  flex-direction: column;
  .modal-header {
    padding: 0.9615rem /* 4.10256vw = 15.38px */;
    border-bottom: 1px solid #eee;
    h3 {
      font-weight: 600;
    }
  }
  .modal-content {
    flex: 1;
    padding: 0.9615rem /* 4.10256vw = 15.38px */;
    overflow-y: auto;
    .plan-summary {
      margin-bottom: 0.9615rem /* 4.10256vw = 15.38px */;
      h4 {
        font-weight: 600;
        margin-bottom: 0.2344rem /* 1vw = 3.75px */;
      }
    }
    .summary-item {
      display: flex;
      margin-bottom: 0.3606rem /* 1.53846vw = 5.77px */;
      .label {
        font-size: 0.7812rem /* 3.33333vw = 12.50px */;
        color: #666;
        min-width: 6.0096rem /* 25.64103vw = 96.15px */;
      }
      .compact {
        min-width: 4.3269rem /* 18.46154vw = 69.23px */;
      }
      .value {
        font-size: 0.7812rem /* 3.33333vw = 12.50px */;
        color: #333;
        flex: 1;
      }
    }
    .form-field-group {
      margin-bottom: 1.0817rem /* 4.61538vw = 17.31px */;
      .field-wrapper {
        margin-bottom: 0.9615rem /* 4.10256vw = 15.38px */;
        .field-label {
          color: #333;
          font-size: 0.7812rem /* 3.33333vw = 12.50px */;
        }
        .field-input-wrapper {
          margin-top: 0.2344rem /* 1vw = 3.75px */;
          display: flex;
          align-items: center;
          background: #f7f8fa;
          border-radius: 0.3606rem /* 1.53846vw = 5.77px */;
          padding: 0 0.7212rem /* 3.07692vw = 11.54px */;
          height: 2.6442rem /* 11.28205vw = 42.31px */;
          border: 1px solid #ebedf0;
          .currency-symbol {
            margin-right: 0.4808rem /* 2.05128vw = 7.69px */;
            font-size: 0.7812rem /* 3.33333vw = 12.50px */;
            color: #969799;
            flex-shrink: 0;
          }
          .field-input {
            flex: 1;
            border: none;
            outline: none;
            background: transparent;
            font-size: 0.7812rem /* 3.33333vw = 12.50px */;
            color: #323233;
          }
          .duration-unit {
            font-size: 0.7812rem /* 3.33333vw = 12.50px */;
            color: #9ca3af;
          }
        }
      }
    }
    .coupon-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f7f8fa;
      border-radius: 0.3606rem /* 1.53846vw = 5.77px */;
      padding: 0 0.7212rem /* 3.07692vw = 11.54px */;
      height: 2.6442rem /* 11.28205vw = 42.31px */;
      border: 1px solid #ebedf0;
      .title {
        font-size: 0.7812rem /* 3.33333vw = 12.50px */;
      }
      .status {
        display: flex;
        align-items: center;
        .status-text {
          font-size: 0.7812rem /* 3.33333vw = 12.50px */;
          color: #9ca3af;
          margin-right: 0.2344rem /* 1vw = 3.75px */;
        }
      }
    }
    .form-tips {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 0.9375rem /* 4vw = 15.00px */;
      background: #f7f8fa;
      border-radius: 0.3606rem /* 1.53846vw = 5.77px */;
      padding: 0.4688rem /* 2vw = 7.50px */ 0.7212rem /* 3.07692vw = 11.54px */;
      border: 1px solid #ebedf0;
      .tip-item {
        display: flex;
        align-items: center;
        &:first-child {
          margin-bottom: 2w;
        }
      }
      span {
        margin-left: 0.2344rem /* 1vw = 3.75px */;
        font-size: 10px;
        color: #666666;
      }
    }
    .form-actions {
      margin-top: 0.7031rem /* 3vw = 11.25px */;
    }
  }
}
.tab-wrap {
  margin-top: var(--van-nav-bar-height);
}
.coupon-list {
  padding: 1.3822rem /* 5.89744vw = 22.12px */ 1.8990rem /* 8.10256vw = 30.38px */;
  .coupon-item {
    position: relative;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: stretch;
    min-height: 6.7067rem /* 28.61538vw = 107.31px */;
    padding-left: 7.2115rem /* 30.76923vw = 115.38px */;
    &:not(:last-child) {
      margin-bottom: 0.9014rem /* 3.84615vw = 14.42px */;
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
      width: 7.2115rem /* 30.76923vw = 115.38px */;
      height: 100%;
      border-radius: 0.9615rem /* 4.10256vw = 15.38px */ 0 0 0.9615rem /* 4.10256vw = 15.38px */;
      background: var(--van-primary-color);
      position: absolute;
      left: 0;
      bottom: 0;
      &::before {
        content: "";
        position: absolute;
        width: 1.5625rem /* 6.66667vw = 25.00px */;
        height: 1.5625rem /* 6.66667vw = 25.00px */;
        border-radius: 50%;
        left: -0.7812rem /* 3.33333vw = 12.50px */;
        top: 2.1034rem /* 8.97436vw = 33.65px */;
        z-index: 1;
        background: var(--van-white);
      }
      .coupon-type {
        color: var(--van-white);
        font-size: 1.1785rem /* 5.02821vw = 18.86px */;
        font-weight: 600;
        line-height: 1;
        margin-bottom: 0.4808rem /* 2.05128vw = 7.69px */;
        word-break: break-word;
        text-align: center;
        padding-left: 0.7091rem /* 3.02564vw = 11.35px */;
      }
      .tag {
        color: #adadad;
        padding: 0.2404rem /* 1.02564vw = 3.85px */ 0.7212rem /* 3.07692vw = 11.54px */;
        border-radius: 1.8029rem /* 7.69231vw = 28.85px */;
        background: var(--van-white);
        color: var(--van-primary-color);
        font-size: 0.6010rem /* 2.5641vw = 9.62px */;
        line-height: 1;
        position: absolute;
        bottom: -1px;
      }
    }
    .item-content {
      background: #edf5fe;
      min-height: 6.7067rem /* 28.61538vw = 107.31px */;
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
      border-radius: 0 0.9615rem /* 4.10256vw = 15.38px */ 0.9615rem /* 4.10256vw = 15.38px */ 0;
      padding: 0.9615rem /* 4.10256vw = 15.38px */ 1.4423rem /* 6.15385vw = 23.08px */ 0.9615rem /* 4.10256vw = 15.38px */ 1.2019rem /* 5.12821vw = 19.23px */;
      height: 100%;
      line-height: 1;
      &::after {
        content: "";
        position: absolute;
        width: 1.5625rem /* 6.66667vw = 25.00px */;
        height: 1.5625rem /* 6.66667vw = 25.00px */;
        border-radius: 50%;
        right: -0.7812rem /* 3.33333vw = 12.50px */;
        top: 2.1034rem /* 8.97436vw = 33.65px */;
        z-index: 1;
        background: var(--van-white);
      }
      .title-line {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.3606rem /* 1.53846vw = 5.77px */;
        .title {
          font-size: 1.1316rem /* 4.82821vw = 18.11px */;
          font-weight: 600;
          color: var(--van-black);
          word-break: break-all;
        }
        .text {
          color: var(--van-primary-color);
          font-size: 0.6010rem /* 2.5641vw = 9.62px */;
          white-space: nowrap;
        }
      }
      .name {
        color: #8e8e8e;
      }
      .time {
        font-size: 0.6010rem /* 2.5641vw = 9.62px */;
        color: var(--van-black);
        opacity: 0.3;
        margin-top: 0.3227rem /* 1.37692vw = 5.16px */;
      }
    }
  }
}
</style>
