<script setup lang="ts">
import { useNumber, useTime } from "@/composables/common";
import { flowListApi, getwalletApi, withdrawApi } from "@/services/api";
import { useUserStore } from "@/stores/stores";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const time = useTime();
const number = useNumber();
const router = useRouter();
const userStore = useUserStore();

// 定义传参
const params = ref<PageParams>({
  page: 0,
  pageSize: 10,
});

// 分页加载
const loading = ref(false);
const finished = ref(false);
const flowList = ref<any>([]);

const onLoad = async () => {
  if (finished.value) {
    return;
  }
  loading.value = true;
  params.value.page++;
  await flowListApi(params.value)
    .then((res) => {
      flowList.value.push(...res.data.list);
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
const onRefresh = () => {
  getwalletApi()
    .then((res) => {
      walletData.value = res.data;
      refreshing.value = false;
    })
    .catch(() => (refreshing.value = false));
  params.value.page = 0;
  finished.value = false;
  flowList.value = [];
  onLoad();
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
const withdrawal = ref();
const withdrawalDisabled = ref(true);

watch(withdrawal, (newVal) => {
  if (newVal > 0 && newVal <= walletData.value.money) {
    withdrawalDisabled.value = false;
  } else {
    withdrawalDisabled.value = true;
  }
});

// 打开提现页面
const openWithdrawal = () => {
  if (!walletData?.value) {
    return;
  }
  if (userStore.user?.set_card != 1) {
    showToast(t("wallet.withdrawal.rules.bindCardFirst"));
    router.push("bindCard");
    return;
  }
  if (userStore.user?.set_pay_password != 1) {
    showToast(t("wallet.withdrawal.rules.setPasswordFirst"));
    router.push("paypassword?isJump=1");
    return;
  }
  showBottom3.value = true;
};

// 提现
const onWithdrawal = async () => {
  if (!password.value) {
    showBottom2.value = true;
    return;
  }
  showBottom2.value = false;
  await withdrawApi(withdrawal.value, password.value).then((res) => {
    showBottom3.value = false;
    withdrawal.value = "";
    password.value = "";
    location.reload();
    showSuccessToast(res.msg);
  });
};

const onLink = (link: string) => {
  if (!link) {
    return;
  }
  window.open(link);
};

// 钱包
const walletData = ref();
// 流水详情
const flowDetail = ref();

onMounted(async () => {
  refreshing.value = true;
  await getwalletApi()
    .then((res) => {
      walletData.value = res.data;
      refreshing.value = false;
    })
    .catch(() => (refreshing.value = false));
});
</script>

<template>
  <CpNavBar :title="t('wallet.title')"></CpNavBar>
  <div class="page">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <div class="section">
        <div class="title-line">
          <div class="title">
            <span>{{ t("wallet.totalAssets") }}</span>
            <CpSvg name="eye"></CpSvg>
          </div>
          <div class="tag">USD</div>
        </div>
        <div class="money">
          <span class="currency">$</span>
          <span class="amount">
            {{ number.formatMoney(walletData?.money) }}
          </span>
        </div>
        <div class="money-content">
          <div class="money-item">
            <span class="label">{{ t("wallet.availableBalance") }}</span>
            <span class="text">
              $ {{ number.formatMoney(walletData?.money) }}
            </span>
          </div>
          <div class="money-item">
            <span class="label">{{ t("wallet.pendingConsumption") }}</span>
            <span class="text">
              $ {{ number.formatMoney(walletData?.wait_putIn) }}
            </span>
          </div>
          <div class="money-item">
            <span class="label">{{ t("wallet.pendingSettlement") }}</span>
            <span class="text">
              $ {{ number.formatMoney(walletData?.wait_money) }}
            </span>
          </div>
        </div>
        <div class="btn-wrap space-x-3">
          <van-button
            type="primary"
            block
            plain
            round
            @click="openWithdrawal()"
          >
            <span class="text-sm">{{ t("wallet.withdraw") }}</span>
          </van-button>
          <van-button type="primary" round @click="showBottom4 = true" block>
            <span class="text-sm">{{ t("wallet.deposit") }}</span>
          </van-button>
        </div>
        <div class="link-list">
          <div class="link-item" @click="$router.push('bindCard')">
            <div class="link-title">
              <CpSvg name="card-pos-2" size="5vw"></CpSvg>
              <span class="label">{{ t("wallet.bindBankCard") }}</span>
            </div>
            <van-icon name="arrow" />
          </div>
          <div class="link-item" @click="$router.push('paypassword')">
            <div class="link-title">
              <CpSvg name="edit-password" size="5vw"></CpSvg>
              <span class="label">{{ t("wallet.changePaymentPassword") }}</span>
            </div>
            <van-icon name="arrow" />
          </div>
        </div>
      </div>

      <div class="record-wrap">
        <div class="record-title">{{ t("wallet.fundDetails") }}</div>
        <div class="record-list">
          <van-empty :description="t('wallet.noDetails')" v-if="false" />
          <van-list
            v-model:loading="loading"
            :finished="finished"
            @load="onLoad"
            :finished-text="t('common.noMore')"
            v-else
          >
            <div
              class="record-item"
              v-for="value in flowList"
              @click="
                showBottom = true;
                flowDetail = value;
              "
            >
              <div class="record-content">
                <div class="label"></div>
                <div class="time">
                  {{ time.formatToMonthDay(value.create_time, 1) }}
                </div>
              </div>
              <van-icon name="arrow" />
            </div>
          </van-list>
        </div>
      </div>
    </van-pull-refresh>
  </div>

  <!-- 流水详情弹窗 -->
  <van-popup
    v-model:show="showBottom"
    position="bottom"
    round
    :style="{ height: '55%' }"
  >
    <div class="dialog-wrap">
      <div class="dialog-title" style="margin: 0px">
        {{ t("wallet.flowDetail.title") }}
      </div>
      <div class="content-wrap">
        <div class="content-item">
          <div class="label">{{ t("wallet.flowDetail.id") }}</div>
          <div class="text">{{ flowDetail?.id }}</div>
        </div>
        <div class="content-item">
          <div class="label">{{ t("wallet.flowDetail.time") }}</div>
          <div class="text">
            {{ time.formatToMonthDay(flowDetail?.create_time, 1) }}
          </div>
        </div>
        <div class="content-item">
          <div class="label">{{ t("wallet.flowDetail.amount") }}</div>
          <div class="text">$ {{ number.formatMoney(flowDetail?.cha) }}</div>
        </div>
        <div class="content-item">
          <div class="label">{{ t("wallet.flowDetail.remarks") }}</div>
          <div class="text">{{ flowDetail?.remarks }}</div>
        </div>
      </div>
    </div>
  </van-popup>

  <!-- 密码输入弹窗 -->
  <van-popup
    v-model:show="showBottom2"
    position="bottom"
    round
    :style="{ height: '95%' }"
  >
    <div class="dialog-wrap">
      <div class="dialog-title">{{ t("wallet.paymentPassword.title") }}</div>
      <div class="desc">{{ t("wallet.paymentPassword.desc") }}</div>
      <!-- 密码输入框 -->
      <van-password-input :value="password" :length="6" />
      <van-number-keyboard v-model="password" :show="true" />
      <van-button
        type="primary"
        round
        block
        style="margin-top: 2rem"
        :disabled="disabled"
        @click="onWithdrawal()"
      >
        <span class="text-sm">{{ t("wallet.paymentPassword.confirm") }}</span>
      </van-button>
    </div>
  </van-popup>

  <!-- 提现弹窗 -->
  <van-popup
    v-model:show="showBottom3"
    position="bottom"
    round
    :style="{ height: '50%' }"
  >
    <div class="dialog-wrap">
      <div class="dialog-title">{{ t("wallet.withdrawal.title") }}</div>
      <div class="form-wrap">
        <div class="label">{{ t("wallet.withdrawal.enterAmount") }}</div>
        <div class="input-wrap">
          <span class="label">$</span>
          <van-field v-model="withdrawal" />
        </div>
        <div class="form-tips">
          <span class="count-money">
            {{ t("wallet.withdrawal.available") }} ${{
              number.formatMoney(walletData?.money)
            }}
          </span>
          <span
            class="all-text"
            @click="withdrawal = number.formatMoney(walletData?.money)"
          >
            {{ t("wallet.withdrawal.withdrawAll") }}
          </span>
        </div>
      </div>
      <div class="flex justify-center">
        <van-button
          type="primary"
          round
          block
          style="margin-top: 2rem"
          :disabled="withdrawalDisabled"
          @click="onWithdrawal()"
        >
          <span class="text-sm">{{ t("wallet.withdraw") }}</span>
        </van-button>
      </div>
    </div>
  </van-popup>

  <!-- 存款提示弹窗 -->
  <van-popup
    v-model:show="showBottom4"
    position="bottom"
    round
    :style="{ height: '60%' }"
  >
    <div class="dialog-wrap">
      <div class="dialog-title" style="margin: 0px">
        {{ t("wallet.depositTips.title") }}
      </div>
      <img
        class="banner"
        width="343"
        src="@/assets/img/recharge-banner-Bkr9lTMK.png"
        alt=""
      />
      <p class="text">{{ t("wallet.depositTips.text1") }}</p>
      <p class="text">{{ t("wallet.depositTips.text2") }}</p>
      <p class="text">{{ t("wallet.depositTips.text3") }}</p>
      <div class="flex justify-center">
        <van-button
          type="primary"
          round
          block
          style="margin-top: 2rem"
          @click="onLink(walletData.re_service_address)"
        >
          <span class="text-sm">{{
            t("wallet.depositTips.contactService")
          }}</span>
        </van-button>
      </div>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
/* 样式保持不变 */
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
