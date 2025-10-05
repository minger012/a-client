<script setup lang="ts">
import { setPassWordApi } from "@/services/api";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

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
    showToast(t("password.rules.passwordMismatch"));
    return;
  }

  if (password.value.length < 6) {
    showToast(t("password.rules.passwordTooShort"));
    return;
  }

  if (orpassword.value === password.value) {
    showToast(t("password.rules.sameAsOld"));
    return;
  }

  loading.value = true;
  try {
    await setPassWordApi(
      orpassword.value,
      password.value,
      repassword.value
    ).then((res) => {
      showToast(res.msg || t("password.messages.success"));
      setTimeout(() => {
        router.back();
      }, 1000);
    });
  } catch (error: any) {
    showToast(error.message || t("password.messages.error"));
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <CpNavBar :title="t('password.title')"></CpNavBar>
  <div class="page">
    <van-form @submit="onSubmit">
      <van-field
        left-icon="lock"
        v-model="orpassword"
        :type="showPassword ? 'text' : 'password'"
        :right-icon="showPassword ? 'eye-o' : 'closed-eye'"
        @click-right-icon="togglePasswordVisibility"
        :label="t('password.oldPassword')"
        :placeholder="t('password.oldPasswordPlaceholder')"
        :rules="[
          { required: true, message: t('password.rules.oldPasswordRequired') },
        ]"
      />
      <van-field
        left-icon="lock"
        v-model="password"
        :type="showPassword2 ? 'text' : 'password'"
        :right-icon="showPassword2 ? 'eye-o' : 'closed-eye'"
        @click-right-icon="togglePasswordVisibility2"
        :label="t('password.newPassword')"
        :placeholder="t('password.newPasswordPlaceholder')"
        :rules="[
          { required: true, message: t('password.rules.newPasswordRequired') },
        ]"
      />
      <van-field
        left-icon="lock"
        v-model="repassword"
        :type="showPassword3 ? 'text' : 'password'"
        :right-icon="showPassword3 ? 'eye-o' : 'closed-eye'"
        @click-right-icon="togglePasswordVisibility3"
        :label="t('password.confirmPassword')"
        :placeholder="t('password.confirmPasswordPlaceholder')"
        :rules="[
          {
            required: true,
            message: t('password.rules.confirmPasswordRequired'),
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
          <span class="text-base">
            {{ loading ? t("password.changing") : t("password.submit") }}
          </span>
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
