<script setup lang="ts">
import { bankCardAddApi, bankCardListApi } from "@/services/api";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
// 提现方式
const methods = ref("");
const methodsShowPicker = ref(false);
const methodsColumns = [{ text: "Crypto", value: "Crypto" }];
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
    message: "loading...",
    forbidClick: true,
    duration: -1,
  });
  await bankCardAddApi(
    methods.value,
    currency.value,
    address.value,
    network.value
  ).then((res) => {
    showToast(res.msg);
    router.back();
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
        label="提现方式"
        placeholder="请选择"
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
        label="货币类型"
        placeholder="请选择"
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
        label="钱包地址"
        placeholder="请输入"
      />
      <van-field
        v-model="network"
        is-link
        readonly
        name="picker"
        label="网络"
        placeholder="请选择"
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
          <span class="text-base">提交</span>
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
