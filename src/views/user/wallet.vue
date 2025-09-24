<script setup lang="ts">
import { computed, ref, watch } from "vue";
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
// 弹出层
const showBottom = ref(false);
const showBottom2 = ref(false);
const showBottom3 = ref(false);
const showBottom4 = ref(false);
const password = ref("");
const disabled = ref(true);
watch(password, (newVal) => {
  // 限制只能输入数字且最多6位
  const filtered = newVal.replace(/[^\d]/g, "").slice(0, 6);
  if (filtered !== newVal) {
    password.value = filtered;
  }
  if (password.value.length == 6) {
    disabled.value = false;
  } else {
    disabled.value = true;
  }
});
// 余额提现
const balance = ref(11111);
const withdrawal = ref();
const withdrawalDisabled = ref(true);
watch(withdrawal, (newVal) => {
  if (newVal > 0 && newVal <= balance.value) {
    withdrawalDisabled.value = false;
  } else {
    withdrawalDisabled.value = true;
  }
});
</script>
<template>
  <CpNavBar> </CpNavBar>
  <div class="page">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      pulling-text="Pull down to refresh..."
      loosing-text="Release to refresh..."
      loading-text="loading..."
    >
      <div class="section">
        <div class="title-line">
          <div class="title">
            <span>总资产</span>
            <CpSvg name="eye"></CpSvg>
          </div>
          <div class="tag">USD</div>
        </div>
        <div class="money">
          <span class="currency">$</span><span class="amount">0</span>
        </div>
        <div class="money-content">
          <div class="money-item">
            <span class="label">可用余额</span><span class="text">$ 0</span>
          </div>
          <div class="money-item">
            <span class="label">待消耗</span><span class="text">$ 0</span>
          </div>
          <div class="money-item">
            <span class="label">待结算</span><span class="text">$ 0</span>
          </div>
        </div>
        <div class="btn-wrap space-x-3">
          <van-button
            type="primary"
            block
            plain
            round
            @click="showBottom3 = true"
          >
            <span class="text-sm">提现</span>
          </van-button>
          <van-button type="primary" round @click="showBottom4 = true" block>
            <span class="text-sm">存款</span>
          </van-button>
        </div>
        <div class="link-list">
          <div class="link-item" @click="$router.push('bindCard')">
            <div class="link-title">
              <CpSvg name="card-pos-2" size="5vw"></CpSvg>
              <span class="label">绑定银行卡</span>
            </div>
            <van-icon name="arrow" />
          </div>
          <div class="link-item" @click="$router.push('paypassword')">
            <div class="link-title">
              <CpSvg name="edit-password" size="5vw"></CpSvg>
              <span class="label">修改交易密码</span>
            </div>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>

      <div class="record-wrap">
        <div class="record-title">资金明细</div>
        <div class="record-list">
          <van-empty description="暂无明细" v-if="false" />
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="no more"
            loading-text="loading..."
            error-text="fail"
            @load="onLoad"
            v-else
          >
            <div
              class="record-item"
              v-for="value in 1"
              @click="showBottom = true"
            >
              <div class="record-content">
                <div class="label"></div>
                <div class="time">2025/08/31 09:04:09</div>
              </div>
              <van-icon name="arrow" />
            </div>
          </van-list>
        </div>
      </div>
    </van-pull-refresh>
  </div>
  <van-popup
    v-model:show="showBottom"
    position="bottom"
    round
    :style="{ height: '55%' }"
  >
    <div class="dialog-wrap">
      <div class="dialog-title" style="margin: 0px">明细详情</div>
      <div class="content-wrap">
        <div class="content-item">
          <div class="label">编号</div>
          <div class="text">4114</div>
        </div>
        <div class="content-item">
          <div class="label">时间</div>
          <div class="text">2025/08/31 09:04:09</div>
        </div>
        <div class="content-item">
          <div class="label">金额</div>
          <div class="text">+ $ 264.84</div>
        </div>
        <div class="content-item">
          <div class="label">备注</div>
          <div class="text">无备注</div>
        </div>
      </div>
    </div>
  </van-popup>
  <van-popup
    v-model:show="showBottom2"
    position="bottom"
    round
    :style="{ height: '95%' }"
  >
    <div class="dialog-wrap">
      <div class="dialog-title">交易密码</div>
      <div class="desc">请输入您的交易密码</div>
      <!-- 密码输入框 -->
      <van-password-input :value="password" :length="6" />
      <van-number-keyboard v-model="password" :show="true" />
      <van-button
        type="primary"
        round
        block
        style="margin-top: 2rem"
        :disabled="disabled"
      >
        <span class="text-sm">确认</span>
      </van-button>
    </div>
  </van-popup>
  <van-popup
    v-model:show="showBottom3"
    position="bottom"
    round
    :style="{ height: '50%' }"
  >
    <div class="dialog-wrap">
      <div class="dialog-title">提现</div>
      <div class="form-wrap">
        <div class="label">请输入您的提现金额</div>
        <div class="input-wrap">
          <span class="label">$</span>
          <van-field v-model="withdrawal" />
        </div>
        <div class="form-tips">
          <span class="count-money">可用余额 ${{ balance }}</span
          ><span class="all-text" @click="withdrawal = balance">全部提现</span>
        </div>
      </div>
      <div class="flex justify-center">
        <van-button
          type="primary"
          round
          block
          style="margin-top: 2rem"
          :disabled="withdrawalDisabled"
        >
          <span class="text-sm">提现</span>
        </van-button>
      </div>
    </div>
  </van-popup>
  <van-popup
    v-model:show="showBottom4"
    position="bottom"
    round
    :style="{ height: '60%' }"
  >
    <div class="dialog-wrap">
      <div class="dialog-title" style="margin: 0px">存款提示</div>
      <img
        class="banner"
        width="343"
        src="/src/assets/img/recharge-banner-Bkr9lTMK.png"
        alt=""
      />
      <p class="text">由于不同国家货币承兑问题</p>
      <p class="text">当前只支持人工存款渠道</p>
      <p class="text">请联系在线客服存款</p>
      <div class="flex justify-center">
        <van-button type="primary" round block style="margin-top: 2rem">
          <span class="text-sm">联系客服</span>
        </van-button>
      </div>
    </div>
  </van-popup>
</template>
<style lang="scss" scoped>
.page {
  margin-top: var(--van-nav-bar-height);
  min-height: calc(100vh - var(--van-nav-bar-height));
  .section {
    padding: 5.12821vw 4.10256vw 0;
    .title-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        flex: 1;
        display: flex;
        align-items: center;
        font-size: 5.12821vw;
        color: var(--van-black);
        span {
          margin-right: 1vw;
        }
      }
      .tag {
        font-size: 3.07692vw;
      }
    }
    .money {
      font-size: 8.97436vw;
      color: var(--van-black);
      font-weight: 700;
      margin-top: 4.10256vw;
      line-height: 8.97436vw;
      .currency {
        margin-right: 0.5vw;
      }
    }
    .money-content {
      margin-top: 7.69231vw;
      padding: 4.61538vw 6.15385vw 4.61538vw 3.07692vw;
      border-radius: 3.07692vw;
      background: #f0f2f5;
      .money-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 3.07692vw;
        color: var(--van-black);
        &:not(:last-child) {
          margin-bottom: 4.10256vw;
        }
      }
    }
    .btn-wrap {
      margin-top: 5.12821vw;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 5.12821vw;
      border-bottom: 1px solid #e5e5e5;
    }
    .link-list {
      padding: 7.17949vw 0 6.15385vw;
      .link-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #65676a;
        &:not(:last-child) {
          margin-bottom: 5.64103vw;
        }
        .link-title {
          display: flex;
          align-items: center;
          font-size: 4.10256vw;
          color: var(--van-black);
          flex: 1;
          margin-right: 2.5641vw;
          .label {
            margin-left: 1.5vw;
          }
        }
      }
    }
  }
  .record-wrap {
    border-top: 2.05128vw solid #f0f2f5;
    padding: 6.15385vw 4.10256vw;
    min-height: 250px;
    .record-wrap {
      border-top: 2.05128vw solid #f0f2f5;
      padding: 6.15385vw 4.10256vw;
    }
    .record-title {
      line-height: 1;
      font-size: 4.61538vw;
      color: var(--van-black);
      font-weight: 500;
      padding-bottom: 5.12821vw;
      border-bottom: 1px solid #e5e5e5;
    }
    .record-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5.12821vw 0;
      border-bottom: 1px solid #e5e5e5;
      .record-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        line-height: 1;
        .time {
          margin-top: 3.07692vw;
          font-size: 3.33333vw;
          color: var(--van-black);
        }
      }
    }
  }
}
.dialog-wrap {
  display: flex;
  flex-direction: column;
  padding: 10.25641vw 8.10256vw 4.10256vw;
  background: var(--van-white);
  .dialog-title {
    text-align: center;
    font-weight: 700;
    font-size: 6.41026vw;
    margin-bottom: 12.82051vw;
  }
  .content-wrap {
    margin-top: 12.82051vw;
    .content-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 4.35897vw;
      margin-bottom: 8.71795vw;
      .label {
        color: var(--van-gray-7);
        min-width: 20.51282vw;
      }
      .input-wrap {
        display: flex;
        align-items: center;
        height: 16.9231vw;
        border-bottom: 1px solid rgb(229, 229, 229);
      }
      .text {
        flex: 1;
        flex-shrink: 0;
        margin-left: 2.5641vw;
        text-align: right;
        color: var(--van-black);
        font-weight: 500;
        word-break: break-all;
      }
    }
  }
  .desc {
    text-align: center;
    font-size: 3.84615vw;
    color: var(--van-gray-7);
    margin-bottom: 7.69231vw;
  }
  .form-wrap {
    .label {
      font-size: 3.84615vw;
      color: var(--van-gray-7);
    }
    .input-wrap {
      display: flex;
      align-items: center;
      height: 16.9231vw;
      border-bottom: 1px solid rgb(229, 229, 229);
      .label {
        margin-right: 2.5641vw;
        font-size: 5.64103vw;
        color: var(--van-black);
        font-weight: 700;
      }
      .van-cell {
        font-size: 5.64103vw;
        font-weight: 700;
        padding-left: 0;
      }
    }
    .form-tips {
      display: flex;
      align-items: center;
      margin-top: 3.84615vw;
      font-size: 3.07692vw;
      color: var(--van-primary-color);
      .count-money {
        margin-right: 2.5641vw;
        color: var(--van-black);
      }
      .all-text {
        color: var(--van-primary-color);
        cursor: pointer;
      }
    }
  }
  .banner {
    display: block;
    margin: 5.12821vw auto;
  }
  .text {
    font-size: 4.61538vw;
    font-weight: 500;
    color: var(--van-black);
    text-align: center;
    padding: 0 4.10256vw;
  }
}
::v-deep() {
  .van-password-input {
    width: 90%;
  }
  .van-button--disabled {
    background-color: #e4e6eb;
    border-color: #e4e6eb;
    color: #bcc0c4;
    opacity: 1;
  }
  .van-cell__value {
  }
}
</style>
