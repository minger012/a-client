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
        <CpSvg name="back" size="5.12821vw" @click="showCoupon = false"></CpSvg>
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
    padding: 4.10256vw;
    border-bottom: 1px solid #eee;
    h3 {
      font-weight: 600;
    }
  }
  .modal-content {
    flex: 1;
    padding: 4.10256vw;
    overflow-y: auto;
    .plan-summary {
      margin-bottom: 4.10256vw;
      h4 {
        font-weight: 600;
        margin-bottom: 1vw;
      }
    }
    .summary-item {
      display: flex;
      margin-bottom: 1.53846vw;
      .label {
        font-size: 3.33333vw;
        color: #666;
        min-width: 25.64103vw;
      }
      .compact {
        min-width: 18.46154vw;
      }
      .value {
        font-size: 3.33333vw;
        color: #333;
        flex: 1;
      }
    }
    .form-field-group {
      margin-bottom: 4.61538vw;
      .field-wrapper {
        margin-bottom: 4.10256vw;
        .field-label {
          color: #333;
          font-size: 3.33333vw;
        }
        .field-input-wrapper {
          margin-top: 1vw;
          display: flex;
          align-items: center;
          background: #f7f8fa;
          border-radius: 1.53846vw;
          padding: 0 3.07692vw;
          height: 11.28205vw;
          border: 1px solid #ebedf0;
          .currency-symbol {
            margin-right: 2.05128vw;
            font-size: 3.33333vw;
            color: #969799;
            flex-shrink: 0;
          }
          .field-input {
            flex: 1;
            border: none;
            outline: none;
            background: transparent;
            font-size: 3.33333vw;
            color: #323233;
          }
          .duration-unit {
            font-size: 3.33333vw;
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
      border-radius: 1.53846vw;
      padding: 0 3.07692vw;
      height: 11.28205vw;
      border: 1px solid #ebedf0;
      .title {
        font-size: 3.33333vw;
      }
      .status {
        display: flex;
        align-items: center;
        .status-text {
          font-size: 3.33333vw;
          color: #9ca3af;
          margin-right: 1vw;
        }
      }
    }
    .form-tips {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-top: 4vw;
      background: #f7f8fa;
      border-radius: 1.53846vw;
      padding: 2vw 3.07692vw;
      border: 1px solid #ebedf0;
      .tip-item {
        display: flex;
        align-items: center;
        &:first-child {
          margin-bottom: 2w;
        }
      }
      span {
        margin-left: 1vw;
        font-size: 10px;
        color: #666666;
      }
    }
    .form-actions {
      margin-top: 3vw;
    }
  }
}
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
    padding-left: 30.76923vw;
    &:not(:last-child) {
      margin-bottom: 3.84615vw;
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
        word-break: break-word;
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
      justify-content: space-between;
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
