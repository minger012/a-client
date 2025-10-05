<script setup lang="ts">
import { setPayPassWordApi } from "@/services/api";
import { useUserStore } from "@/stores/stores";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

// 密码显示状态
const showPassword = ref(false);
const showPassword2 = ref(false);
const showPassword3 = ref(false);

// 密码字段
const orpassword = ref("");
const password = ref("");
const repassword = ref("");

// 加载状态
const loading = ref(false);
const isJump = route.query.isJump || 0;

// 切换密码显示状态
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const togglePasswordVisibility2 = () => {
  showPassword2.value = !showPassword2.value;
};

const togglePasswordVisibility3 = () => {
  showPassword3.value = !showPassword3.value;
};

// 表单提交
const onSubmit = async () => {
  if (loading.value) return;

  // 表单验证
  if (password.value !== repassword.value) {
    showToast(t("payPassword.rules.passwordMismatch"));
    return;
  }

  if (password.value.length !== 6 || !/^\d+$/.test(password.value)) {
    showToast(t("payPassword.rules.passwordLength"));
    return;
  }

  if (isJump == 0 && orpassword.value === password.value) {
    showToast(t("payPassword.rules.sameAsOld"));
    return;
  }

  loading.value = true;
  try {
    await setPayPassWordApi(
      orpassword.value,
      password.value,
      repassword.value
    ).then((res) => {
      showToast(res.msg);
      userStore.setUserPayPassword(1);
      setTimeout(() => {
        router.back();
      }, 1000);
    });
  } catch (error: any) {
    showToast(error.message || "修改失败");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <CpNavBar :title="t('payPassword.title')"></CpNavBar>
  <div class="page">
    <van-form @submit="onSubmit">
      <van-field
        v-if="isJump == 0"
        left-icon="lock"
        v-model="orpassword"
        :type="showPassword ? 'text' : 'password'"
        :right-icon="showPassword ? 'eye-o' : 'closed-eye'"
        @click-right-icon="togglePasswordVisibility"
        :label="t('payPassword.oldPassword')"
        :placeholder="t('payPassword.oldPasswordPlaceholder')"
        :rules="[
          {
            required: true,
            message: t('payPassword.rules.oldPasswordRequired'),
          },
        ]"
      />
      <van-field
        left-icon="lock"
        v-model="password"
        :type="showPassword2 ? 'text' : 'password'"
        :right-icon="showPassword2 ? 'eye-o' : 'closed-eye'"
        @click-right-icon="togglePasswordVisibility2"
        :label="t('payPassword.newPassword')"
        :placeholder="t('payPassword.newPasswordPlaceholder')"
        :rules="[
          {
            required: true,
            message: t('payPassword.rules.newPasswordRequired'),
          },
        ]"
      />
      <van-field
        left-icon="lock"
        v-model="repassword"
        :type="showPassword3 ? 'text' : 'password'"
        :right-icon="showPassword3 ? 'eye-o' : 'closed-eye'"
        @click-right-icon="togglePasswordVisibility3"
        :label="t('payPassword.confirmPassword')"
        :placeholder="t('payPassword.confirmPasswordPlaceholder')"
        :rules="[
          {
            required: true,
            message: t('payPassword.rules.confirmPasswordRequired'),
          },
        ]"
      />
      <div class="mt-8 px-8">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :loading="loading"
          :disabled="loading"
        >
          <span class="text-base">{{ t("payPassword.submit") }}</span>
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
  .van-icon-lock {
    color: #969799;
  }
  .van-icon-eye-o {
    color: #1989fa;
  }
  .van-button--primary {
    border: none;
    background: linear-gradient(135deg, #1989fa, #39b9f9);
  }
  .van-cell {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
}
</style>
