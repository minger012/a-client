<script setup lang="ts">
import { updateI18nLanguage } from "@/plugins/i18n";
import { loginOutApi, setLangApi } from "@/services/api";
import { useUserStore } from "@/stores/stores";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

// 接收参数
const props = withDefaults(
  defineProps<{
    title?: string;
    fixed?: boolean;
    isBack?: boolean;
    isLogin?: boolean;
    isLoginOut?: boolean;
    isLang?: boolean;
  }>(),
  {
    fixed: () => true,
    isBack: () => true,
    isLogin: () => false,
    isLoginOut: () => false,
    isLang: () => true,
  }
);

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

const onConfirm = ({ selectedValues }: any) => {
  showPicker.value = false;
  updateI18nLanguage(selectedValues[0]);
  setLangApi(selectedValues[0]);
  location.reload();
};

// 退出登录
const loginOut = () => {
  showConfirmDialog({
    title: t("navbar.logout.title"),
    message: t("navbar.logout.message"),
  })
    .then(async () => {
      try {
        await loginOutApi();
        userStore.delUser();
        router.push("login");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    })
    .catch(() => {
      // 用户取消操作
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
          <CpSvg
            name="language"
            @click="showPicker = true"
            v-if="props.isLang"
          ></CpSvg>
          <van-icon
            name="bell"
            v-if="props.isLogin == false"
            size="1.25rem"
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
