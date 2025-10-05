<script lang="ts" setup>
import { loginApi } from "@/services/api";
import { useUserStore } from "@/stores/stores";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { usernameRules, passwordRules } from "@/utils/rules";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();
const router = useRouter();
const username = ref("155555");
const password = ref("123456");
const onSubmit = async () => {
  await loginApi(username.value, password.value).then((res) => {
    userStore.setUser(res.data);
    closeToast();
    router.push("/");
  });
};
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
        {{ t("login.welcomeBack") }}
      </div>
      <div class="text-base text-gray-500 mt-3">
        {{ t("login.continueHint") }}
      </div>
    </div>
    <div class="mt-16">
      <!-- 表单 -->
      <van-form required="auto">
        <van-cell-group inset>
          <van-field
            v-model="username"
            left-icon="user-o"
            :placeholder="t('login.enterUsername')"
            :rules="usernameRules"
          />
          <van-field
            v-model="password"
            left-icon="shield-o"
            :placeholder="t('login.enterPassword')"
            :rules="passwordRules"
          />
        </van-cell-group>
        <div class="pt-12">
          <van-button
            native-type="submit"
            block
            round
            type="primary"
            @click="onSubmit()"
          >
            <span class="font-[600] text-base">{{ t("login.login") }}</span>
          </van-button>
        </div>
      </van-form>
      <div
        class="flex justify-center items-center mt-12 text-primary text-[15px] pb-4"
        @click="$router.push('register')"
      >
        {{ t("login.noAccount") }} {{ t("login.registerNow") }}
      </div>
    </div>
  </div>
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
      padding: 4.26667vw;
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
