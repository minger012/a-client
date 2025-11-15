<script setup lang="ts">
import { watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from '@/stores/stores';
import { useSalesmartlyService } from '@/composables/common';

const { locale } = useI18n();
const userStore = useUserStore();
const { setLoginInfo, clearUser } = useSalesmartlyService();

// 监听用户信息变化
watch(
  () => userStore.user,
  (newUser) => {
    if(!(window as any).SALESMARTLY_URL){
      return;
    }
    if (newUser) {
      // 用户登录，更新客服信息
      setLoginInfo({
        user_id: String(newUser.id || ''),
        user_name: newUser.username || '',
        language: locale.value,
      });
    } else {
      // 用户退出登录，清除客服信息
      clearUser();
    }
  },
  { immediate: true, deep: true }
);

// 监听语言变化
watch(
  () => locale.value,
  (newLocale) => {
    if(!(window as any).SALESMARTLY_URL){
      return;
    }
      // 更新语言信息
    setLoginInfo({
      user_id: userStore.user ? String(userStore.user.id || '') : '',
      user_name: userStore.user ? userStore.user.username || '' : '',
      language: newLocale,
    });
  }
);
</script>

<template>
  <router-view></router-view>
  <!-- <CpGlobalFloatBtn /> -->
</template>

<style scoped></style>
