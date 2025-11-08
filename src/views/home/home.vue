<script setup lang="ts">
import { legacyCopyToClipboard } from "@/utils";
import { useNumber } from "@/composables/common";
import {
  getConfigApi,
  getIndexApi,
  signApi,
  uploadImageApi,
} from "@/services/api";
import { onMounted, ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t, locale } = useI18n();
const number = useNumber();
const router = useRouter();

// 添加刷新加载状态
const isRefreshing = ref(false);
// 添加页面加载状态
const isLoading = ref(true);

// 获取当前VIP等级信息
const currentVipLevel = computed(() => {
  // 如果配置数据不存在，返回默认对象
  if (!configData.value[6] || !configData.value[6].length) {
    return null;
  }
  
  // 如果lv为0或不存在，返回第一条配置
  if (!indexData.value?.userData?.lv) {
    return configData.value[6][0];
  }
  
  // 查找匹配的等级，找不到则返回第一条
  const level = configData.value[6].find((item: any) => item.level == indexData.value.userData.lv);
  return level || {
    name: indexData.value.userData.lv,
    level: indexData.value.userData.lv
  };
});

// 签到
const sign = async () => {
  await signApi().then((res) => {
    indexData.value.userData.isSign = 1;
    indexData.value.userData.sign++;
    showToast(res.msg);
  });
};
const copy = (code: any) => {
  legacyCopyToClipboard(code);
  showToast(t("home.copySuccess"));
};

// 首页数据
const tabsActive = ref(0);
const indexData = ref();
const getIndexData = async (id: number) => {
  if (isRefreshing.value) {
    return;
  }
  isRefreshing.value = true; // 开始加载
  await getIndexApi(id)
    .then((res) => {
      indexData.value = res.data;
    })
    .finally(() => {
      isRefreshing.value = false; // 加载完成
      isLoading.value = false; // 页面数据加载完成
    });
};
// 后台配置
const configData = ref<any>([]);
const getConfigData = async () => {
  await getConfigApi("1,7,6,9").then((res) => {
    configData.value = res.data;
  });
};
watch(tabsActive, async (newVal: number) => {
  await getIndexData(newVal);
});
// 上传图片
const customFileList = ref([]);
// 单文件上传处理
const afterRead = (file: any) => {
  // 如果是多文件，file 会是数组
  if (Array.isArray(file)) {
    file.forEach((item) => uploadFile(item));
  } else {
    uploadFile(file);
  }
};
// 上传文件到服务器
const uploadFile = async (file: any) => {
  if (!file.file) return;
  // 显示上传状态
  file.status = "uploading";
  const formData = new FormData();
  formData.append("image", file.file);
  formData.append("type", "image");
  // 调用上传 API
  await uploadImageApi(formData).then((res) => {
    // 更新文件状态
    file.status = "done";
    indexData.value.userData.image = res.data.url;
  });
};

// banner 点击处理
const handleBannerClick = (banner: any) => {
  const { type, data, richContent } = banner;

  switch (type) {
    case "路径":
    case 1:
      // 内部路径跳转
      if (data) {
        router.push(data);
      }
      break;

    case 2:
      // 外部链接
      if (data) {
        window.open(data, "_blank");
      }
      break;

    case 3:
      // 富文本内容
      if (richContent) {
        // 跳转到富文本展示页面
        router.push({
          path: "rich-content",
          query: {
            title: banner.title,
            content: richContent,
          },
        });
      }
      break;

    default:
      console.warn("未知的 banner 类型:", type);
      break;
  }
};
onMounted(async () => {
  await Promise.all([getIndexData(tabsActive.value), getConfigData()]);
});
</script>

<template>
  <!-- 导航 -->
  <CpNavBar :isBack="false" :isLoginOut="true"> </CpNavBar>

  <!-- 骨架屏 -->
  <div v-if="isLoading" class="skeleton-container">
    <!-- 头部骨架 -->
    <div class="skeleton-head">
      <div class="skeleton-avatar">
        <div class="skeleton-circle"></div>
      </div>
      <div class="skeleton-user-info">
        <div class="skeleton-line skeleton-name"></div>
        <div class="skeleton-tags">
          <div class="skeleton-tag"></div>
          <div class="skeleton-tag"></div>
          <div class="skeleton-tag"></div>
        </div>
      </div>
      <div class="skeleton-buttons">
        <div class="skeleton-button"></div>
        <div class="skeleton-button"></div>
      </div>
    </div>

    <!-- 邀请卡片骨架 -->
    <div class="skeleton-invite-card">
      <div class="skeleton-icon"></div>
      <div class="skeleton-content">
        <div class="skeleton-line skeleton-label"></div>
        <div class="skeleton-line skeleton-code"></div>
      </div>
      <div class="skeleton-copy"></div>
    </div>

    <!-- Banner骨架 -->
    <div class="skeleton-banner-wrap">
      <div class="skeleton-banner"></div>
    </div>

    <!-- 标签页骨架 -->
    <div class="skeleton-tab-wrap">
      <div class="skeleton-tabs">
        <div class="skeleton-tab"></div>
        <div class="skeleton-tab"></div>
        <div class="skeleton-tab"></div>
        <div class="skeleton-tab"></div>
      </div>
    </div>

    <!-- 数据概览骨架 -->
    <div class="skeleton-data-view">
      <div class="skeleton-title-wrap">
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-refresh"></div>
      </div>
      <div class="skeleton-data-list">
        <div class="skeleton-data-item" v-for="n in 8" :key="n">
          <div class="skeleton-line skeleton-number"></div>
          <div class="skeleton-line skeleton-name-row"></div>
        </div>
      </div>
    </div>

    <!-- 底部菜单骨架 -->
    <div class="skeleton-tab-bar">
      <div class="skeleton-tab-item" v-for="n in 2" :key="n">
        <div class="skeleton-icon-small"></div>
        <div class="skeleton-line skeleton-tab-name"></div>
      </div>
    </div>

    <!-- FAQ骨架 -->
    <div class="skeleton-section">
      <div class="skeleton-line skeleton-section-title"></div>
      <div class="skeleton-question-list">
        <div class="skeleton-question-item" v-for="n in 3" :key="n">
          <div class="skeleton-line skeleton-question"></div>
          <div class="skeleton-arrow"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- 实际内容 -->
  <div v-else>
    <div class="head">
      <!-- 自定义上传样式 -->
      <van-uploader
        v-model="customFileList"
        :after-read="afterRead"
        :preview-image="false"
      >
        <div class="relative">
          <van-image
            round
            width="4.3149rem"
            height="4.3149rem"
            :src="indexData?.userData.image"
          />
          <div class="avatar-edit">
            <van-icon name="photograph" size="0.7212rem" color="#fff" />
          </div>
        </div>
      </van-uploader>

      <div class="ml-5 flex-1">
        <div>{{ indexData?.userData.username }}</div>
        <div class="tag">
          {{ t("home.creditScore") }}：{{ indexData?.userData.score }}
        </div>
        <!-- <div class="tag">
          {{ t("home.signInCount") }}：{{ indexData?.userData.sign }}
        </div> -->
        <div 
          class="tag vip-level-tag" 
          @click="$router.push('level')"
          v-if="currentVipLevel"
        >
          <CpImage
              :name="currentVipLevel.icon"
              v-if="currentVipLevel.icon"
              class="level-icon"
              width="0.85rem"
              height="0.85rem"
              fit="cover"
            ></CpImage>
          {{ currentVipLevel.name }}
        </div>
      </div>
      <div class="action-buttons">
        <!-- <van-button
          size="small"
          disabled
          class="sign-in-btn"
          v-if="!indexData || indexData?.userData.isSign == 1"
        >
          {{ t("home.signedIn") }}
        </van-button>
        <van-button
          block
          type="primary"
          size="small"
          class="sign-in-btn"
          @click="sign()"
          v-else
        >
          {{ t("home.signIn") }}
        </van-button> -->
        <van-button
          block
          type="primary"
          size="small"
          @click="$router.push('level')"
          class="sign-in-btn"
        >
          <img src="@/assets/img/ic_vip.png" />
          <span class="h-[0.8125rem] text-[0.8125rem] mr-1 leading-none">{{ t("home.vipPrivileges") }}</span>
          <van-icon name="arrow" v-if="locale !== 'en-us'" />
        </van-button>
      </div>
    </div>
    
    <!-- 账户余额卡片 -->
    <div class="account-card" @click="$router.push('wallet')">
      <div class="account-icon">
        <img src="@/assets/img/ic_wallet.png" />
      </div>
      <div class="account-info">
        <div class="account-label">{{ t("home.account") }}</div>
        <div class="account-amount">
          {{ configData[1] }}{{ number.formatMoney(indexData?.userData.money) }}
        </div>
      </div>
      <van-icon name="arrow" size="20" />
    </div>
    
    <div class="banner-wrap">
      <div
        class="banner"
        v-for="(value, index) in configData[9]"
        :key="index"
        @click="handleBannerClick(value)"
      >
        <img :src="value.image" class="banner-image" v-if="value.image" />
        <div class="title-wrap">
          <div class="title">{{ value.title }}</div>
          <div class="desc">{{ value.desc }}</div>
        </div>
      </div>
    </div>
    <div class="tab-wrap">
      <van-tabs v-model:active="tabsActive" line-width="5.625rem">
        <van-tab :title="t('home.today')"></van-tab>
        <van-tab :title="t('home.thisWeek')"></van-tab>
        <van-tab :title="t('home.thisMonth')"></van-tab>
        <van-tab :title="t('home.all')"></van-tab>
      </van-tabs>
    </div>
    <div class="data-view">
      <div class="title-wrap">
        <div class="title">{{ t("home.dataOverview") }}</div>
        <div class="desc" @click="getIndexData(tabsActive)">
          <span>{{ t("home.dataUpdateHint") }}</span>
          <CpSvg
            name="refresh"
            :class="{ 'refresh-spinning': isRefreshing }"
          ></CpSvg>
        </div>
      </div>
      <div class="data-list">
        <div class="data-item">
          <div class="number-row">
            {{ configData[1] }}
            {{ number.formatMoney(indexData?.planOrderData.money) }}
          </div>
          <div class="name-row">
            <span>{{ t("home.placementAmount") }}</span>
            <CpSvg name="data-1"></CpSvg>
          </div>
        </div>
        <div class="data-item">
          <div class="number-row">
            {{ indexData?.planOrderData.count || 0 }}
          </div>
          <div class="name-row">
            <span>{{ t("home.placementOrders") }}</span>
            <CpSvg name="data-2"></CpSvg>
          </div>
        </div>
        <div class="data-item">
          <div class="number-row">
            {{ configData[1] }}
            {{ number.formatMoney(indexData?.planOrderData.putIn) }}
          </div>
          <div class="name-row">
            <span>{{ t("home.consumed") }}</span>
            <CpSvg name="data-3"></CpSvg>
          </div>
        </div>
        <div class="data-item">
          <div class="number-row">
            {{ configData[1] }}
            {{ number.formatMoney(indexData?.planOrderData.wait_putIn) }}
          </div>
          <div class="name-row">
            <span>{{ t("home.pendingConsumption") }}</span>
            <CpSvg name="data-4"></CpSvg>
          </div>
        </div>
        <div class="data-item">
          <div class="number-row">
            {{ indexData?.planOrderData.show_num || 0 }}
          </div>
          <div class="name-row">
            <span>{{ t("home.impressions") }}</span>
            <CpSvg name="data-5"></CpSvg>
          </div>
        </div>
        <div class="data-item">
          <div class="number-row">
            {{ indexData?.planOrderData.click_num || 0 }}
          </div>
          <div class="name-row">
            <span>{{ t("home.clicks") }}</span>
            <CpSvg name="data-6"></CpSvg>
          </div>
        </div>
        <div class="data-item">
          <div class="number-row">
            {{ configData[1] }}
            {{ number.formatMoney(indexData?.planOrderData.click_money) }}
          </div>
          <div class="name-row">
            <span>{{ t("home.adRevenue") }}</span>
            <CpSvg name="data-7"></CpSvg>
          </div>
        </div>
        <div class="data-item">
          <div class="number-row">
            {{ configData[1] }}
            {{ number.formatMoney(indexData?.planOrderData.profit) }}
          </div>
          <div class="name-row">
            <span>{{ t("home.profit") }}</span>
            <CpSvg name="data-8"></CpSvg>
          </div>
        </div>
      </div>
    </div>
    <div class="tab-bar">
      <div class="tab-bar-item" @click="$router.push('coupons')">
        <CpSvg name="discount-shape" size="1.1719rem"></CpSvg>
        <div class="name">{{ t("home.coupons") }}</div>
      </div>
      <div class="tab-bar-item" @click="$router.push('password')">
        <CpSvg name="edit-password" size="1.1719rem"></CpSvg>
        <div class="name">{{ t("home.changeLoginPassword") }}</div>
      </div>
      <div class="tab-bar-item" @click="$router.push('feedback')">
        <CpSvg name="edit" size="1.1719rem"></CpSvg>
        <div class="name">{{ t('feedback.title') }}</div>
      </div>
      
      <div class="tab-bar-item" @click="$router.push('agentInvite')">
        <CpSvg name="device-message" size="1.1719rem"></CpSvg>
        <div class="name">{{ t('agentInvite.title') }}</div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">{{ t("home.faq") }}</div>
      <div class="question-list">
        <div
          class="question-item"
          @click="$router.push('news?id=' + key)"
          v-for="(value, key) in configData[7]"
        >
          <div class="name">{{ value.question }}</div>
          <van-icon name="arrow" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.head {
  margin-top: var(--van-nav-bar-height);
  padding: 1.0817rem 0.9615rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .avatar-edit {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 1.4423rem;
    height: 1.4423rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #4e7cdc;
    border-radius: 50%;
    border: 0.125rem solid #fff;
  }
  .tag {
    display: flex;
    justify-content: center;
    align-items: center;
    width: max-content;
    font-size: 0.601rem;
    color: #65676a;
    padding: 0.3005rem 0.7212rem;
    background: #f0f2f5;
    border-radius: 0.2404rem;
    line-height: 1;
    margin-top: 0.1875rem;
    
    &.vip-level-tag {
      font-weight: 600;
      padding: 0.35rem 0.7rem;
      border-radius: 0.3rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      
      &:active {
        transform: scale(0.95);
      }
    }
  }
  .button-sign {
    cursor: not-allowed;
    background-color: #f7f8fa;
    color: #cbcccd;
    border-color: rgb(240, 242, 245) !important;
  }
  .action-buttons {
    margin-left: auto;
    display: flex;
    flex-direction: column;
    gap: 0.4808rem;
    .sign-in-btn {
      min-width: 5.2885rem;
      border-radius: 1.1rem;
      height: 2.2rem;
      box-shadow: 0 0.25rem 0.5rem #dee6f8;
      padding:0 0.75rem;
      transition: all 0.3s ease;
      background: linear-gradient(to right,#4f75d1,#3f5eab);
      :deep(.van-button__text){
        display: flex;
        align-items: center;
        white-space: nowrap;
        justify-content: center;
        gap:0.25rem;
        img {
          width: 1rem;
          height: 1rem;
        }
      }
    }
  }
  ::v-deep() {
    .van-button--disabled {
      background-color: #f0f2f5 !important;
      border-color: #f0f2f5 !important;
      color: #65676a !important;
      cursor: not-allowed;
    }
  }
}

.account-card {
  display: flex;
  align-items: center;
  background: #fff;
  margin: 0 0.9615rem 0.9375rem;
  padding: 0.8125rem 1rem;
  border-radius: 0.625rem;
  box-shadow: 0 0 0.5rem rgba(0, 0, 0, 0.12);
  cursor: pointer;
 
  .account-icon {
    flex-shrink: 0;
    margin-right: 0.9615rem;
    img {
      width: 2.875rem;
      height: 2.875rem;
    }
  }
  
  .account-info {
    flex: 1;
    min-width: 0;
    
    .account-label {
      font-size: 0.8125rem;
    }
    
    .account-amount {
      font-size: 1.275rem;
      font-weight: bold;
    }
  }
}

.invite-card {
  display: flex;
  align-items: center;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.125rem 0.5rem;
  cursor: pointer;
  margin: 0px 0.9615rem 0.9375rem;
  background: linear-gradient(
    135deg,
    rgba(78, 124, 220, 0.02),
    rgba(78, 124, 220, 0.008)
  );
  border-width: 1px;
  border-style: solid;
  border-color: rgba(78, 124, 220, 0.082);
  border-image: initial;
  border-radius: 0.4688rem;
  padding: 0.7031rem;
  transition: 0.3s;
  &:active {
    transform: scale(0.98);
  }
  .content {
    min-width: 0px;
    flex: 1 1 0%;
    .label {
      font-size: 0.75rem;
      color: rgb(102, 102, 102);
      margin-bottom: 0.2344rem;
    }
    .code {
      font-size: 1.1719rem;
      font-weight: 700;
      color: rgb(78, 124, 220);
    }
  }
  .copy-hint {
    display: flex;
    align-items: center;
    margin-left: 0.7031rem;
    padding: 0.3516rem 0.7031rem;
    background: rgba(78, 124, 220, 0.1);
    border-radius: 0.2344rem;
    .copy-text {
      margin-left: 4px;
      font-size: 0.7031rem;
      color: rgb(78, 124, 220);
      white-space: nowrap;
    }
  }
  .icon-wrap {
    width: 2.3438rem;
    height: 2.3438rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.7031rem;
    border-radius: 0.4688rem;
    background: linear-gradient(135deg, rgb(78, 124, 220), rgb(60, 90, 166));
  }
}
.banner-wrap {
  padding: 0px 0.9615rem;
  .banner {
    display: flex;
    width: 100%;
    -webkit-box-align: center;
    align-items: center;
    position: relative;
    padding-bottom: 22.5%;
    overflow: hidden;
    background: rgb(78, 124, 220);
    border-radius: 0.9615rem;
    &:not(:last-child) {
      margin-bottom: 0.5rem;
    }
  }
  .banner-image {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    object-fit: fill;
    object-position: center center;
    z-index: 0;
  }
  .title-wrap {
    position: absolute;
    z-index: 1;
    color: var(--van-white);
    line-height: 1;
    left: 24%;
    top: 50%;
    transform: translateY(-50%);
  }
  .title {
    font-size: 1.4423rem;
    font-weight: 900;
  }
  .desc {
    font-size: 0.9615rem;
    margin-top: 0.4868rem;
  }
}
.tab-wrap {
  position: relative;
  margin-top: 0.601rem;
  padding: 0px 0.9615rem;
  &:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 1px;
    background: #e5e5e5;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
.data-view {
  margin-top: 1.3221rem;
  padding: 0 0.9615rem 1.0817rem;
  .title-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.4423rem;
  }
  .title {
    font-size: 1.0817rem;
    font-weight: 500;
    color: var(--van-black);
  }
  .desc {
    display: flex;
    align-items: center;
    font-size: 0.7212rem;
    color: var(--van-gray-7);
    cursor: pointer;
  }
  .data-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.4808rem;
    .data-item {
      padding: 0.9014rem 0.8413rem 0.9014rem 1.0817rem;
      background: var(--van-white);
      border-radius: 0.4808rem;
      border: 1px solid #c9ccd1;
      .number-row {
        font-size: 1.0817rem;
        font-weight: 700;
        color: var(--van-black);
      }
      .name-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.7212rem;
        color: var(--van-black);
      }
    }
  }
}
.tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.9615rem 0;
  background: var(--van-white);
  border-bottom: 1px solid #e5e5e5;
  border-top: 0.4808rem solid #f0f2f5;
  .tab-bar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.7812rem;
    color: var(--van-black);
    padding: 0 0.1172rem;
  }
  .name {
    margin-top: 0.4808rem;
    font-size: 0.7212rem;
    white-space: break-word;
    text-align: center;
  }
}
.section {
  margin-top: 1.3221rem;
  padding: 0 0.9615rem 1.0817rem;
  .section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.4423rem;
    font-size: 1.0817rem;
  }
  .question-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:not(:last-child) {
      margin-bottom: 2.1635rem;
    }
    .name {
      flex: 1;
      font-size: 0.9615rem;
      color: #65676a;
    }
  }
}

// 添加旋转动画
.refresh-spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 骨架屏样式
.skeleton-container {
  margin-top: var(--van-nav-bar-height);
  padding: 0 0.9615rem;
}

.skeleton-head {
  display: flex;
  align-items: center;
  padding: 1.0817rem 0;
  .skeleton-avatar {
    margin-right: 1.1719rem;
    .skeleton-circle {
      width: 4.3149rem;
      height: 4.3149rem;
      border-radius: 50%;
      background: #f0f2f5;
    }
  }
  .skeleton-user-info {
    flex: 1;
    .skeleton-name {
      width: 7.0313rem;
      height: 1.1719rem;
      margin-bottom: 0.4688rem;
    }
    .skeleton-tags {
      display: flex;
      flex-direction: column;
      gap: 0.3516rem;
      .skeleton-tag {
        width: 5.8594rem;
        height: 0.9375rem;
        border-radius: 0.2404rem;
        background: #f0f2f5;
      }
    }
  }
  .skeleton-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.4688rem;
    .skeleton-button {
      width: 5.3125rem;
      height: 2rem;
      border-radius: 0.5rem;
      background: #f0f2f5;
    }
  }
}

.skeleton-invite-card {
  display: flex;
  align-items: center;
  margin: 0 0 0.9375rem;
  padding: 0.7031rem;
  background: #f8f9fa;
  border-radius: 0.4688rem;
  .skeleton-icon {
    width: 2.3438rem;
    height: 2.3438rem;
    border-radius: 0.4688rem;
    background: #f0f2f5;
    margin-right: 0.7031rem;
  }
  .skeleton-content {
    flex: 1;
    .skeleton-label {
      width: 5.8594rem;
      height: 0.75rem;
      margin-bottom: 0.2344rem;
    }
    .skeleton-code {
      width: 8.2031rem;
      height: 1.1719rem;
    }
  }
  .skeleton-copy {
    width: 3.5156rem;
    height: 1.875rem;
    border-radius: 0.2344rem;
    background: #f0f2f5;
    margin-left: 0.7031rem;
  }
}

.skeleton-banner-wrap {
  margin-bottom: 0.9375rem;
  .skeleton-banner {
    width: 100%;
    padding-bottom: 22.5%;
    border-radius: 0.9615rem;
    background: #f0f2f5;
  }
}

.skeleton-tab-wrap {
  margin-top: 0.601rem;
  padding-bottom: 0.601rem;
  border-bottom: 1px solid #e5e5e5;
  .skeleton-tabs {
    display: flex;
    gap: 1.875rem;
    .skeleton-tab {
      width: 3.5156rem;
      height: 0.9375rem;
      border-radius: 0.4688rem;
      background: #f0f2f5;
    }
  }
}

.skeleton-data-view {
  margin-top: 1.3221rem;
  padding-bottom: 1.0817rem;
  .skeleton-title-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.4423rem;
    .skeleton-title {
      width: 5.8594rem;
      height: 1.0817rem;
    }
    .skeleton-refresh {
      width: 4.6875rem;
      height: 0.7212rem;
      border-radius: 0.3516rem;
      background: #f0f2f5;
    }
  }
  .skeleton-data-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.4808rem;
    .skeleton-data-item {
      padding: 0.9014rem 0.8413rem 0.9014rem 1.0817rem;
      background: var(--van-white);
      border-radius: 0.4808rem;
      border: 1px solid #e5e5e5;
      .skeleton-number {
        width: 60%;
        height: 1.0817rem;
        margin-bottom: 0.5859rem;
      }
      .skeleton-name-row {
        width: 80%;
        height: 0.7212rem;
      }
    }
  }
}

.skeleton-tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 0.9615rem 0;
  background: var(--van-white);
  border-bottom: 1px solid #e5e5e5;
  border-top: 0.4808rem solid #f0f2f5;
  .skeleton-tab-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .skeleton-icon-small {
      width: 1.1719rem;
      height: 1.1719rem;
      border-radius: 0.2344rem;
      background: #f0f2f5;
    }
    .skeleton-tab-name {
      width: 4.6875rem;
      height: 0.7212rem;
      margin-top: 0.4808rem;
    }
  }
}

.skeleton-section {
  margin-top: 1.3221rem;
  padding-bottom: 1.0817rem;
  .skeleton-section-title {
    width: 3.5156rem;
    height: 1.0817rem;
    margin-bottom: 1.4423rem;
  }
  .skeleton-question-list {
    .skeleton-question-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 2.1635rem;
      .skeleton-question {
        flex: 1;
        height: 0.9615rem;
      }
      .skeleton-arrow {
        width: 0.9375rem;
        height: 0.9375rem;
        border-radius: 50%;
        background: #f0f2f5;
        margin-left: 0.9375rem;
      }
    }
  }
}

// 骨架屏动画
.skeleton-line,
.skeleton-circle,
.skeleton-icon,
.skeleton-button,
.skeleton-tag,
.skeleton-banner,
.skeleton-tab,
.skeleton-refresh,
.skeleton-data-item,
.skeleton-icon-small,
.skeleton-arrow {
  background: linear-gradient(90deg, #f0f2f5 25%, #e6e8eb 50%, #f0f2f5 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.gunping-container {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.gunping {
  animation: scrollHorizontal 60s linear infinite;
  white-space: nowrap;
  width: max-content;

  &:hover {
    animation-play-state: paused;
  }
}

@keyframes scrollHorizontal {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
