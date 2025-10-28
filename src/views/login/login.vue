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
const username = ref("");
const password = ref("");
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
        <CpImage name="5D8s-GsHJlJ" width="3.75rem" height="3.75rem"></CpImage>
      </div>
      <!-- <div class="text-[1.75rem] font-bold mt-6">
        {{ t("login.welcomeBack") }}
      </div>
      <div class="text-base text-gray-500 mt-3">
        {{ t("login.continueHint") }}
      </div> -->
    </div>
    <div class="mt-16">
      <!-- 表单 -->
      <van-form required="auto">
        <van-field
          v-model="username"
          :placeholder="t('login.enterUsername')"
          :rules="usernameRules"
        />
        <van-field
          v-model="password"
          type="password"
          class="mt-4"
          :placeholder="t('login.enterPassword')"
          :rules="passwordRules"
        />
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
  padding: 0 1.25rem;
  background: white;
  position: relative;
  
  ::v-deep() {
    .van-field {
      padding: 1rem; 
      transition: all 0.3s ease;
      border:1px solid rgb(221, 226, 232);
      border-radius: 1rem;
      &:hover {
        border-color: #1877f2;
      }
      &:focus-within .van-field__left-icon {
        transform: scale(1.1);
      }
      .van-field__control {
        font-size: 1rem;
        &::placeholder {
          color:#5d6c7b;
        }
      }
      .van-field__left-icon {
        color: #1877f2;
        font-size: 1.25rem; // 5.33333vw = 20px = 1.25rem
        margin-right: 0.75rem; // 3.2vw = 12px = 0.75rem
        transition: transform 0.3s ease;
      }
    }
    .van-button--primary {
      height: 3rem;
    }
  }
}
</style>
