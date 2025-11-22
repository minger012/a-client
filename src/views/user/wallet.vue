<script setup lang="ts">
import { useNumber, useTime } from "@/composables/common";
import {
  flowListApi,
  getConfigApi,
  getwalletApi,
} from "@/services/api";
import { useUserStore } from "@/stores/stores";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { useSalesmartlyService } from "@/composables/common";
const { chatOpen } = useSalesmartlyService();

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
const showBottom4 = ref(false);

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
  // 跳转到提现
  router.push({
    path: "/withdrawal",
    query: {
      config: JSON.stringify(configData.value),
    },
  });
};

// 打开客服
const openSupport = (link: string) => {
  if((window as any).SALESMARTLY_URL){
    chatOpen()
    return;
  }
  if (!link) {
    return;
  }
  
  window.open(link);
};

// 钱包
const walletData = ref();
// 流水详情
const flowDetail = ref();
// 后台配置
const configData = ref<any>([]);
const getConfigData = async () => {
  await getConfigApi("1,2,4").then((res) => {
    configData.value = res.data;
  });
};
onMounted(async () => {
  refreshing.value = true;

  Promise.all([
    getConfigData(),
    await getwalletApi()
      .then((res) => {
        walletData.value = res.data;
        refreshing.value = false;
      })
      .catch(() => (refreshing.value = false)),
  ]);
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
          <div class="tag">{{ configData[2] }}</div>
        </div>
        <div class="money">
          <span class="currency">{{ configData[1] }}</span>
          <span class="amount">
            {{ number.formatMoney(walletData?.money) }}
          </span>
        </div>
        <div class="money-content">
          <div class="money-item">
            <span class="label">{{ t("wallet.availableBalance") }}</span>
            <span class="text">
              {{ configData[1] }} {{ number.formatMoney(walletData?.money) }}
            </span>
          </div>
          <div class="money-item">
            <span class="label">{{ t("wallet.pendingConsumption") }}</span>
            <span class="text">
              {{ configData[1] }}
              {{ number.formatMoney(walletData?.wait_putIn) }}
            </span>
          </div>
          <div class="money-item">
            <span class="label">{{ t("wallet.pendingSettlement") }}</span>
            <span class="text">
              {{ configData[1] }}
              {{ number.formatMoney(walletData?.wait_money) }}
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
              <CpSvg name="card-pos-2" size="1.1719rem"></CpSvg>
              <span class="label">{{ t("wallet.bindBankCard") }}</span>
            </div>
            <van-icon name="arrow" />
          </div>
          <div class="link-item" @click="$router.push('paypassword')">
            <div class="link-title">
              <CpSvg name="edit-password" size="1.1719rem"></CpSvg>
              <span class="label">{{ t("wallet.changePaymentPassword") }}</span>
            </div>
            <van-icon name="arrow" />
          </div>
          <div class="link-item" @click="$router.push('realname')">
            <div class="link-title">
              <CpSvg name="card-pos" size="1.1719rem"></CpSvg>
              <span class="label">{{ t("wallet.realNameVerification") }}</span>
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
          <div class="text">
            {{ configData[1] }} {{ number.formatMoney(flowDetail?.cha) }}
          </div>
        </div>
        <div class="content-item">
          <div class="label">{{ t("wallet.flowDetail.remarks") }}</div>
          <div class="text">{{ flowDetail?.remarks }}</div>
        </div>
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
          @click="
            openSupport(
              walletData.service_address ||
                configData[4][Math.floor(Math.random() * configData[4].length)]
                  .link
            )
          "
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
    padding: 1.2019rem 0.9615rem 0;
    .title-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        flex: 1;
        display: flex;
        align-items: center;
        font-size: 1.2019rem;
        color: var(--van-black);
        span {
          margin-right: 0.2344rem;
        }
      }
      .tag {
        font-size: 0.7212rem;
      }
    }
    .money {
      font-size: 2.1034rem;
      color: var(--van-black);
      font-weight: 700;
      margin-top: 0.9615rem;
      line-height: 2.1034rem;
      .currency {
        margin-right: 0.1172rem;
      }
    }
    .money-content {
      margin-top: 1.8029rem;
      padding: 1.0817rem 1.4423rem 1.0817rem 0.7212rem;
      border-radius: 0.7212rem;
      background: #f0f2f5;
      .money-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.7212rem;
        color: var(--van-black);
        &:not(:last-child) {
          margin-bottom: 0.9615rem;
        }
      }
    }
    .btn-wrap {
      margin-top: 1.2019rem;
      display: -webkit-box;
      display: -webkit-flex;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 1.2019rem;
    }
    
  }
  .record-wrap {
    border-top: 0.4808rem solid #f0f2f5;
    padding: 1.4423rem 0.9615rem;
    min-height: 250px;
    .record-wrap {
      border-top: 0.4808rem solid #f0f2f5;
      padding: 1.4423rem 0.9615rem;
    }
    .record-title {
      line-height: 1;
      font-size: 1.0817rem;
      color: var(--van-black);
      font-weight: 500;
      padding-bottom: 1.2019rem;
      border-bottom: 1px solid #e5e5e5;
    }
    .record-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.2019rem 0;
      border-bottom: 1px solid #e5e5e5;
      .record-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        line-height: 1;
        .time {
          margin-top: 0.7212rem;
          font-size: 0.7812rem;
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
}

.link-list {
  .link-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #65676a;
    padding:0.75rem 0.25rem;
    .link-title {
      display: flex;
      align-items: center;
      font-size: 0.9615rem;
      color: var(--van-black);
      flex: 1;
      margin-right: 0.6010rem;
      .label {
        margin-left: 0.3516rem;
      }
    }
  }
}

</style>
