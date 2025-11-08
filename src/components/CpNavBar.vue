<script setup lang="ts">
import { updateI18nLanguage } from "@/plugins/i18n";
import { loginOutApi, setLangApi, mailNoReadApi } from "@/services/api"; // 导入 API
import { useUserStore } from "@/stores/stores";
import { ref, onMounted, onUnmounted, watch } from "vue"; // 添加生命周期函数和watch
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

// 未读消息数量
const unreadCount = ref(0);
const prevUnreadCount = ref(0); // 记录上一次的未读数量
let refreshInterval: number | null = null;

// 创建音频实例
const notificationAudio = new Audio(new URL('@/assets/audio/dingdong.mp3', import.meta.url).href);

// 获取未读消息数量
const fetchUnreadCount = async () => {
  try {
    // 调用你的 API 接口
    const response = await mailNoReadApi();
    unreadCount.value = response.data;
  } catch (error) {
    console.error("获取未读消息数量失败:", error);
    unreadCount.value = 0; // 出错时设为0
  }
};

// 播放通知音效
const playNotificationSound = () => {
  try {
    notificationAudio.currentTime = 0; // 重置到开始位置
    notificationAudio.play().catch(err => {
      console.warn("音频播放失败:", err);
    });
  } catch (error) {
    console.error("播放音频错误:", error);
  }
};

// 监听未读消息数量变化
watch(unreadCount, (newValue, oldValue) => {
  // 只有当新值大于旧值时才播放声音（表示有新消息）
  // 并且旧值不为0（避免初始加载时播放）
  if (newValue > oldValue && oldValue !== 0) {
    playNotificationSound();
  }
});

// 初始化加载未读数量
onMounted(() => {
  if (props.isLogin == true) {
    return;
  }
  fetchUnreadCount();
  // 记录初始值
  prevUnreadCount.value = unreadCount.value;

  // 设置定时刷新（每10秒刷新一次）
  refreshInterval = window.setInterval(() => {
    fetchUnreadCount();
  }, 10000);
});

// 清理定时器
onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});

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

// 点击通知图标
const goToNotification = () => {
  router.push("notification");
  // 可选：跳转后重置未读数量
  // unreadCount.value = 0;
};

// 暴露变量和方法给父组件
defineExpose({
  fetchUnreadCount,
});
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
          class="nav-icon"
          @click="back()"
          v-if="isBack == true"
        >
        </CpSvg>
      </slot>
    </template>
    <template #right>
      <slot name="right">
        <div class="header-right">
          <CpSvg
            name="language"
            class="nav-icon nav-icon2"
            @click="showPicker = true"
            v-if="props.isLang"
          ></CpSvg>

          <!-- 通知图标带未读数量 -->
          <div
            class="notification-wrapper"
            v-if="props.isLogin == false"
            @click="goToNotification()"
          >
            <van-icon
              name="bell"
              class="nav-icon bell-icon"
              @click="goToNotification()"
            />
            <!-- 未读数量徽章 -->
            <div
              v-if="unreadCount > 0"
              class="badge"
              :class="{ 'badge-large': unreadCount > 99 }"
            >
              {{ unreadCount > 99 ? "99+" : unreadCount }}
            </div>
          </div>
          <CpSvg
            name="logout"
            class="nav-icon nav-icon2"
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
  ::v-deep() {
    .van-nav-bar__title {
      display: flex;
      align-items: center;
      height: 100%;
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

// 导航图标基础样式
.nav-icon {
  width: 1.125rem;
  height: 1.125rem;

  // 特殊处理 bell 图标
  &.bell-icon {
    font-size: 1.35rem;
    position: relative;
    top:-0.2rem;
  }

  // 确保 SVG 图标居中显示
  :deep(svg) {
    width: 100%;
    height: 100%;
  }
}

// 通知图标容器
.notification-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
}

// 未读数量徽章
.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: #ff4444;
  color: white;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  // 数字较多时的样式
  &.badge-large {
    font-size: 9px;
    padding: 0 3px;
    min-width: 22px;
  }
}

</style>
