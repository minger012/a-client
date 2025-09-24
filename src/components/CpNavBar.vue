<script setup lang="ts">
import { updateI18nLanguage } from "@/plugins/i18n";
import { loginOutApi } from "@/services/api";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
//接收参数
const props = withDefaults(
  defineProps<{
    title?: string;
    fixed?: boolean;
    isBack?: boolean;
    isLogin?: boolean;
    isLoginOut?: boolean;
  }>(),
  {
    fixed: () => true,
    isBack: () => true,
    isLogin: () => false,
    isLoginOut: () => false,
  }
);
const router = useRouter();
const route = useRoute();
const routeTitle = route.meta.title as string;
// 返回键
const back = () => {
  if (history.state?.back) {
    router.back();
  } else {
    router.push("/");
  }
};
// 语言选择
const columns = (window as any).LANG_COLUMNS;
const showPicker = ref(false);
const onConfirm = ({ selectedValues }) => {
  showPicker.value = false;
  updateI18nLanguage(selectedValues[0]);
  location.reload();
};
// 退出登录
const loginOut = () => {
  showConfirmDialog({
    title: "退出登录",
    message: "确定要退出登录吗？",
  }).then(async () => {
    // on confirm
    // await loginOutApi();
    router.push("login");
  });
};
</script>

<template>
  <van-nav-bar
    :title="props.title ?? routeTitle"
    :fixed="fixed"
    z-index="2"
    :style="{ backgroundColor: props.isLogin ? 'transparent' : '#fff' }"
    class="transparent-navbar"
  >
    <template #left>
      <slot name="left">
        <CpSvg
          name="back"
          size="5.12821vw"
          @click="back()"
          v-if="isBack == true"
        >
        </CpSvg>
      </slot>
    </template>
    <template #right>
      <slot name="right">
        <div class="flex items-center space-x-2">
          <CpSvg name="language" @click="showPicker = true"></CpSvg>
          <van-icon
            name="bell"
            v-if="props.isLogin == false"
            size="20"
            @click="$router.push('notification')"
          />
          <CpSvg
            name="logout"
            @click="loginOut()"
            v-if="props.isLoginOut == true"
          ></CpSvg>
        </div>
        <van-popup
          v-model:show="showPicker"
          destroy-on-close
          round
          position="bottom"
        >
          <van-picker
            :columns="columns"
            @cancel="showPicker = false"
            @confirm="onConfirm"
          />
        </van-popup>
      </slot>
    </template>
  </van-nav-bar>
</template>

<style lang="scss" scoped>
.transparent-navbar {
  border: none !important;
  box-shadow: none !important;
  &::after {
    display: none !important;
  }
}
</style>
