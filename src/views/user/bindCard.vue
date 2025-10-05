<script setup lang="ts">
import { bankCardAddApi, bankCardListApi } from "@/services/api";
import { useUserStore } from "@/stores/stores";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
// 提现方式
const methods = ref("");
const methodsShowPicker = ref(false);
const methodsColumns = [{ text: t("bindCard.crypto"), value: "Crypto" }];
const methodsOnConfirm = ({ selectedOptions }: any) => {
  methods.value = selectedOptions[0]?.text;
  methodsShowPicker.value = false;
};
// 货币类型
const currency = ref("");
const currencyShowPicker = ref(false);
const currencyColumns = [
  { text: "USDC", value: "USDC" },
  { text: "USDT", value: "USDT" },
  { text: "PYUSD", value: "PYUSD" },
  { text: "ETH", value: "ETH" },
  { text: "BTC", value: "BTC" },
];
const currencyOnConfirm = ({ selectedOptions }: any) => {
  currency.value = selectedOptions[0]?.text;
  currencyShowPicker.value = false;
};
// 钱包地址
const address = ref();
// 网络
const network = ref("");
const networkShowPicker = ref(false);
const networkColumns = [
  { text: "Ethereum", value: "Ethereum" },
  { text: "TRON", value: "TRON" },
  { text: "Bitcoin", value: "Bitcoin" },
];
const networkOnConfirm = ({ selectedOptions }: any) => {
  network.value = selectedOptions[0]?.text;
  networkShowPicker.value = false;
};
// 提交
const onSubmit = async () => {
  showLoadingToast({
    message: t("common.loading"),
    forbidClick: true,
    duration: -1,
  });
  await bankCardAddApi(
    methods.value,
    currency.value,
    address.value,
    network.value
  ).then((res) => {
    userStore.setUserCard(1);
    showToast(res.msg);
    setTimeout(() => {
      router.back();
    }, 1000);
  });
};
onMounted(async () => {
  await bankCardListApi().then((res) => {
    methods.value = res.data.methods;
    address.value = res.data.address;
    currency.value = res.data.currency;
    network.value = res.data.network;
  });
});
</script>
<template>
  <CpNavBar> </CpNavBar>
  <div class="page">
    <van-form @submit="onSubmit">
      <van-field
        v-model="methods"
        is-link
        readonly
        name="picker"
        :label="t('bindCard.withdrawalMethod')"
        :placeholder="t('bindCard.pleaseSelect')"
        @click="methodsShowPicker = true"
      />
      <van-popup
        v-model:show="methodsShowPicker"
        destroy-on-close
        position="bottom"
      >
        <van-picker
          :columns="methodsColumns"
          @confirm="methodsOnConfirm"
          @cancel="methodsShowPicker = false"
        />
      </van-popup>
      <van-field
        v-model="currency"
        is-link
        readonly
        name="picker"
        :label="t('bindCard.currencyType')"
        :placeholder="t('bindCard.pleaseSelect')"
        @click="currencyShowPicker = true"
      />
      <van-popup
        v-model:show="currencyShowPicker"
        destroy-on-close
        position="bottom"
      >
        <van-picker
          :columns="currencyColumns"
          @confirm="currencyOnConfirm"
          @cancel="currencyShowPicker = false"
        />
      </van-popup>
      <van-field
        v-model="address"
        type="text"
        :label="t('bindCard.walletAddress')"
        :placeholder="t('bindCard.pleaseEnter')"
      />
      <van-field
        v-model="network"
        is-link
        readonly
        name="picker"
        :label="t('bindCard.network')"
        :placeholder="t('bindCard.pleaseSelect')"
        @click="networkShowPicker = true"
      />
      <van-popup
        v-model:show="networkShowPicker"
        destroy-on-close
        position="bottom"
      >
        <van-picker
          :columns="networkColumns"
          @confirm="networkOnConfirm"
          @cancel="networkShowPicker = false"
        />
      </van-popup>
      <div class="mt-8 px-4">
        <van-button round block type="primary" native-type="submit">
          <span class="text-base">{{ t("bindCard.submit") }}</span>
        </van-button>
      </div>
    </van-form>
  </div>
</template>
<style lang="scss" scoped>
.page {
  margin-top: var(--van-nav-bar-height);
  min-height: calc(100vh - var(--van-nav-bar-height));
}
::v-deep() {
  .van-cell {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}
</style>
