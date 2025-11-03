<script setup lang="ts">
import { useNumber } from "@/composables/common";
import { getwalletApi, withdrawApi } from "@/services/api";
import { useUserStore } from "@/stores/stores";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { showToast, showSuccessToast } from "vant";

const { t } = useI18n();
const number = useNumber();
const router = useRouter();
const userStore = useUserStore();

// 钱包数据
const walletData = ref<any>(null);
// 后台配置
const configData = ref<any>({});

// 提现金额
const withdrawal = ref();
const withdrawalDisabled = ref(true);

// 支付密码
const password = ref("");
const disabled = ref(true);
const showPasswordPopup = ref(false);

// 监听提现金额变化
watch(withdrawal, (newVal) => {
  if (newVal > 0 && newVal <= walletData.value?.money) {
    withdrawalDisabled.value = false;
  } else {
    withdrawalDisabled.value = true;
  }
});

// 监听密码输入
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

// 全部提现
const withdrawAll = () => {
  withdrawal.value = number.formatMoney(walletData.value?.money);
};

// 提交提现
const onSubmitWithdrawal = () => {
  if (!password.value) {
    showPasswordPopup.value = true;
    return;
  }
  showPasswordPopup.value = false;
  handleWithdrawal();
};

// 执行提现
const handleWithdrawal = async () => {
  await withdrawApi(withdrawal.value, password.value)
    .then((res) => {
      withdrawal.value = "";
      showSuccessToast(res.msg);
      // 提现成功后返回钱包页面
      setTimeout(() => {
        router.back();
      }, 1500);
    })
    .finally(() => {
      password.value = "";
    });
};

// 获取钱包数据
const getWalletData = async () => {
  await getwalletApi().then((res) => {
    walletData.value = res.data;
  });
};

// 检查是否可以提现
const checkWithdrawalPermission = () => {
  if (!walletData?.value) {
    return false;
  }
  if (userStore.user?.set_card != 1) {
    showToast(t("wallet.withdrawal.rules.bindCardFirst"));
    router.push("/bindCard");
    return false;
  }
  if (userStore.user?.set_pay_password != 1) {
    showToast(t("wallet.withdrawal.rules.setPasswordFirst"));
    router.push("/paypassword?isJump=1");
    return false;
  }
  return true;
};

onMounted(async () => {
  await getWalletData();
  // 如果不满足提现条件，自动跳转
  if (!checkWithdrawalPermission()) {
    return;
  }
  // 从路由参数获取配置数据（如果有）
  if (router.currentRoute.value.query.config) {
    configData.value = JSON.parse(router.currentRoute.value.query.config as string);
  }
});
</script>

<template>
  <CpNavBar :title="t('wallet.withdrawal.title')"></CpNavBar>
  <div class="page">
    <div class="withdrawal-container">
      
      <!-- 提现表单 -->
      <div class="form-wrap">
        <div class="label">{{ t("wallet.withdrawal.enterAmount") }}</div>
        <div class="input-wrap">
          <span class="currency-label">{{ configData[1] || "" }}</span>
          <van-field
            v-model="withdrawal"
            type="number"
            placeholder="0.00"
            :border="false"
          />
        </div>
        <div class="form-tips">
          <span class="count-money">
            {{ t("wallet.withdrawal.available") }}
            {{ configData[1] || "" }}
            {{ number.formatMoney(walletData?.money) }}
          </span>
          <span class="all-text" @click="withdrawAll">
            {{ t("wallet.withdrawal.withdrawAll") }}
          </span>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="button-wrap">
        <van-button
          type="primary"
          round
          size="large"
          block
          :disabled="withdrawalDisabled"
          @click="onSubmitWithdrawal()"
        >
          {{ t("wallet.withdraw") }}
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
      </div>
      
    </div>
    
  </div>

  <!-- 密码输入弹窗 -->
  <van-popup
    v-model:show="showPasswordPopup"
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
        @click="handleWithdrawal()"
      >
        <span class="text-sm">{{ t("wallet.paymentPassword.confirm") }}</span>
      </van-button>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.page {
  margin-top: var(--van-nav-bar-height);
  min-height: calc(100vh - var(--van-nav-bar-height));
  padding:1rem;
  background-color: #f5f5f5;
}

.withdrawal-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-wrap {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;

  .label {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 1rem;
  }

  .input-wrap {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;

    .currency-label {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin-right: 0.5rem;
    }

    :deep(.van-field) {
      flex: 1;
      padding: 0;
      font-size: 1.5rem;
      font-weight: 600;
    }

    :deep(.van-field__control) {
      color: #333;
    }
  }

  .form-tips {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;

    .count-money {
      color: #999;
    }

    .all-text {
      color: #667eea;
      cursor: pointer;
      font-weight: 500;
    }
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

.button-wrap {
  padding: 1rem 0;

}

.dialog-wrap {
  padding: 1.5rem;

  .dialog-title {
    font-size: 1.25rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 1rem;
  }

  .desc {
    font-size: 0.875rem;
    color: #666;
    text-align: center;
    margin-bottom: 2rem;
  }
}
</style>
