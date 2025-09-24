<script setup lang="ts">
import { ref } from "vue";
// 定义传参
const params = ref<{}>({
  page: 0,
  pageSize: 10,
});
// 弹出层-下单
const showBottom = ref(false);
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
  if (params.value.page >= 11) {
    finished.value = true;
  }
  loading.value = false;
};
// 暴露变量和方法给父组件
defineExpose({
  showBottom,
});
</script>
<template>
  <van-popup
    v-model:show="showBottom"
    round
    closeable
    position="bottom"
    :style="{ height: '70%' }"
  >
    <div class="placement-modal">
      <div class="modal-header">
        <h3>投放设置</h3>
      </div>
      <div class="modal-content">
        <div class="plan-summary">
          <h4>Shadowverse</h4>
          <div class="summary-info">
            <div class="summary-item">
              <span class="label compact">可用余额: </span
              ><span class="value">$139</span>
            </div>
          </div>
        </div>
        <div class="placement-form">
          <form class="van-form">
            <div class="form-field-group">
              <div class="field-wrapper">
                <label class="field-label">投放金额</label>
                <div class="field-input-wrapper">
                  <span class="currency-symbol">$</span
                  ><input class="field-input" placeholder="请输入投放金额" />
                </div>
              </div>
              <div class="field-wrapper">
                <label class="field-label">投放时长</label>
                <div class="field-input-wrapper">
                  <input
                    type="number"
                    class="field-input"
                    placeholder="请输入投放秒数"
                  /><span class="duration-unit">秒</span>
                </div>
              </div>
            </div>
            <div class="coupon-item" @click="showCoupon = true">
              <span class="title">优惠卷 </span>
              <div class="status">
                <span class="status-text">未使用</span>
                <van-icon name="arrow" />
              </div>
            </div>
            <div class="form-tips">
              <div class="tip-item">
                <van-icon name="info" color="#4e7cdc" />
                <span>投放金额将从您的可用余额中扣除</span>
              </div>
              <div class="tip-item">
                <van-icon name="info" color="#4e7cdc" />
                <span>投放期间系统将自动优化广告效果</span>
              </div>
            </div>
            <div class="form-actions">
              <van-button native-type="submit" block round type="primary">
                <span class="font-[600] text-base">确认投放</span>
              </van-button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </van-popup>
  <van-popup v-model:show="showCoupon" position="bottom" style="height: 100%">
    <CpNavBar title="优惠券">
      <template #left>
        <CpSvg name="back" size="5.12821vw" @click="showCoupon = false"></CpSvg>
      </template>
    </CpNavBar>
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
