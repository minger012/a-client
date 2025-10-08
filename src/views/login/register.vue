<script lang="ts" setup>
import { getConfigApi, registerApi } from "@/services/api";
import { useUserStore } from "@/stores/stores";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  usernameRules,
  passwordRules,
  mobileRules,
  codeRules,
} from "@/utils/rules";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();
const username = ref("");
const password = ref("");
const repassword = ref("");
const mobile = ref("");
const code = ref("");
const checked = ref(false);
const onSubmit = async () => {
  if (!checked.value) {
    showToast(t("register.agreeTermsHint"));
    return;
  }
  await registerApi({
    username: username.value,
    password: password.value,
    repassword: repassword.value,
    mobile: mobile.value,
    code: code.value,
  }).then((res) => {
    userStore.setUser(res.data);
    router.push("/");
    closeToast();
  });
};

// 服务条款
const showBottom = ref(false);
// 后台配置
const configData = ref<any>([]);
const getConfigData = async () => {
  await getConfigApi("8").then((res) => {
    configData.value = res.data;
  });
};
onMounted(async () => {
  Promise.all([getConfigData()]);
});
</script>
<template>
  <!-- 导航 -->
  <CpNavBar title="" :isBack="false" :isLogin="true"> </CpNavBar>
  <div class="page">
    <div class="flex flex-col justify-center items-center">
      <div class="flex justify-center mt-16">
        <CpImage name="logo-C8lBymrN" width="10rem" height="7.75rem"></CpImage>
      </div>
      <div class="text-[1.75rem] font-bold mt-6">
        {{ t("register.createAccount") }}
      </div>
      <div class="text-base text-gray-500 mt-3">
        {{ t("register.startUsingHint") }}
      </div>
    </div>
    <div class="mt-8">
      <!-- 表单 -->
      <van-form required="auto">
        <van-cell-group inset>
          <van-field
            v-model="username"
            left-icon="user-o"
            :placeholder="t('register.enterUsername')"
            :rules="usernameRules"
          />
          <van-field
            type="password"
            v-model="password"
            left-icon="shield-o"
            :placeholder="t('register.enterPassword')"
            :rules="passwordRules"
          />
          <van-field
            type="password"
            v-model="repassword"
            left-icon="shield-o"
            :placeholder="t('register.confirmPassword')"
            :rules="passwordRules"
          />
          <van-field
            v-model="mobile"
            left-icon="phone-o"
            :placeholder="t('register.enterMobile')"
            :rules="mobileRules"
          />
          <van-field
            v-model="code"
            left-icon="label-o"
            :placeholder="t('register.authCode')"
            :rules="codeRules"
          />
        </van-cell-group>
        <div class="flex items-center px-5 pt-3">
          <van-checkbox v-model="checked" shape="square" icon-size="15px" />
          <div class="ml-2">
            {{ t("register.readAndAgree")
            }}<span class="text-primary" @click="showBottom = true">{{
              t("register.termsOfService")
            }}</span>
          </div>
        </div>
        <div class="pt-6">
          <van-button
            native-type="submit"
            block
            round
            type="primary"
            @click="onSubmit()"
          >
            <span class="font-[600] text-base">{{
              t("register.register")
            }}</span>
          </van-button>
        </div>
      </van-form>
      <div
        class="flex justify-center items-center mt-12 text-primary text-[15px] pb-4"
        @click="$router.push('login')"
      >
        {{ t("register.haveAccount") }} {{ t("register.login") }}
      </div>
    </div>
  </div>
  <van-popup
    v-model:show="showBottom"
    round
    position="bottom"
    :style="{ height: '90%' }"
  >
    <h1 class="flex justify-center my-3 text-2xl font-bold">
      {{ t("register.termsOfService") }}
    </h1>
    <div class="p-3">
      {{ configData[8].length > 0 ? configData[8] : "" }}
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0 20px;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 53.33333vw;
    background: linear-gradient(45deg, #1877f21a, #1877f20d);
    clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
    z-index: 0;
  }
  ::v-deep() {
    .van-field {
      padding: 3.2vw 4.26667vw;
      transition: all 0.3s ease;
      &:hover {
        background-color: #1877f20d;
      }
      &:focus-within .van-field__left-icon {
        transform: scale(1.1);
      }
      .van-field__left-icon {
        color: #1877f2;
        font-size: 5.33333vw;
        margin-right: 3.2vw;
        transition: transform 0.3s ease;
      }
    }
    .van-button--primary {
      height: 3rem;
    }
  }
}
</style>
