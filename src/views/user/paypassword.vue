<script setup lang="ts">
import { setPayPassWordApi } from "@/services/api";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
const showPassword = ref(false);
const showPassword2 = ref(false);
const showPassword3 = ref(false);
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
const { t } = useI18n();
const orpassword = ref("");
const password = ref("");
const repassword = ref("");
const route = useRoute();
const router = useRouter();
const isJump = route.query.isJump || 0;
const onSubmit = async () => {
  await setPayPassWordApi(
    orpassword.value,
    password.value,
    repassword.value
  ).then((res) => {
    showToast(res.msg);
    setTimeout(() => {
      router.back();
    }, 1000);
  });
};
</script>
<template>
  <CpNavBar> </CpNavBar>
  <div class="page">
    <van-form @submit="onSubmit">
      <van-field
        v-if="isJump == 0"
        left-icon="lock"
        v-model="orpassword"
        :type="showPassword ? 'text' : 'password'"
        :right-icon="showPassword ? 'eye-o' : 'closed-eye'"
        @click-right-icon="togglePasswordVisibility"
        name="username"
        label="旧密码"
        placeholder="请输入6位数字密码"
        :rules="[{ required: true, message: '请输入6位数字密码' }]"
      />
      <van-field
        left-icon="lock"
        v-model="password"
        :type="showPassword2 ? 'text' : 'password'"
        :right-icon="showPassword2 ? 'eye-o' : 'closed-eye'"
        @click-right-icon="togglePasswordVisibility2"
        name="password"
        label="新密码"
        placeholder="请输入6位数字密码"
        :rules="[{ required: true, message: '请输入6位数字密码' }]"
      />
      <van-field
        left-icon="lock"
        v-model="repassword"
        :type="showPassword3 ? 'text' : 'password'"
        :right-icon="showPassword3 ? 'eye-o' : 'closed-eye'"
        @click-right-icon="togglePasswordVisibility3"
        name="password"
        label="确认新密码"
        placeholder="请输入6位数字密码"
        :rules="[{ required: true, message: '请输入6位数字密码' }]"
      />
      <div class="mt-8 px-8">
        <van-button round block type="primary" native-type="submit">
          <span class="text-base">确认修改</span>
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
