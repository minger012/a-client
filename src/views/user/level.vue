<script setup lang="ts">
import { getConfigApi, getUserInfoApi } from "@/services/api";
import { useUserStore } from "@/stores/stores";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const userStore = useUserStore();

// 后台配置
const configData = ref<any>({});
const serviceAddress = ref("");
const levelList = ref<any>([]);

const getConfigData = async () => {
  await getConfigApi("3,5,6").then((res) => {
    configData.value = res.data;
    // 合并两个配置数据
    if (res.data[5] && res.data[6]) {
      levelList.value = res.data[5].map((item: any, index: number) => {
        const displayData = res.data[6][index] || {};
        return {
          ...item,
          name: displayData.name,
          desc: displayData.desc,
          icon: displayData.icon
        };
      });
    }
  });
};

// 获取用户服务地址
const getUserServiceAddress = async () => {
  if (!userStore.user?.token) {
    serviceAddress.value = "";
    return;
  }
  await getUserInfoApi().then((res) => {
    serviceAddress.value = res.data?.service_address || "";
  });
};

// 打开链接
const onLink = (link: string) => {
  if (!link) {
    return;
  }
  window.open(link);
};

const activateVip = (level: any) => {
  // 跳转到客服页面
  const link =
    serviceAddress.value ||
    (configData.value[3] && configData.value[3].length > 0
      ? configData.value[3][Math.floor(Math.random() * configData.value[3].length)].link
      : "");
  onLink(link);
};

onMounted(async () => {
  Promise.all([getConfigData(), getUserServiceAddress()]);
});
</script>
<template>
  <CpNavBar> </CpNavBar>
  <div class="page">
    <!-- VIP横幅 -->
    <div class="vip-banner">
      <img src="@/assets/img/ic_vip.png" />
      <span>{{ t("level.vipBanner") }}</span>
    </div>

    <div class="scrollable-container">
      <div class="level-card" v-for="(level, index) in levelList" :key="index">
        <!-- 顶部信息 -->
        <div class="level-header">
          <div class="level-left">
            <CpImage
              :name="level.icon"
              class="level-icon"
              width="3rem"
              height="3rem"
              fit="cover"
            ></CpImage>
            <div class="level-badge">{{ level.name || level.level }}</div>
          </div>
          <div class="level-price">
            <span class="text-sm">$</span>{{ level.recharge_amount?.toLocaleString() }}
          </div>
        </div>

        <!-- 特权信息 -->
        <div class="level-features">
          <div class="feature-row">
            <div class="feature-item">
              <van-icon name="balance-o" color="#5B9FF5" size="1.25rem" />
              <div class="feature-content">
                <div class="feature-label">{{ t("level.feeRate") }}</div>
                <div class="feature-value">{{ level.fee_rate_min }}-{{ level.fee_rate_max }}%</div>
              </div>
            </div>
            <div class="feature-item">
              <van-icon name="friends-o" color="#5B9FF5" size="1.25rem" />
              <div class="feature-content">
                <div class="feature-label">{{ t("level.subordinateLimit") }}</div>
                <div class="feature-value" :class="level.subordinate_limit == 0 ? 'limit-none' : ''">{{ level.subordinate_limit == 0 ? t("level.noLimit") : level.subordinate_limit.toLocaleString() }}</div>
              </div>
            </div>
          </div>
          
          <div class="feature-extra">
            <van-icon name="success" color="#5B9FF5" size="0.875rem" />
            <span>{{ t("level.dailyAdCount") }} {{ level.daily_ad_count_min }}-{{ level.daily_ad_count_max }}</span>
          </div>
        </div>

        <!-- 激活按钮 -->
        <van-button 
          type="primary" 
          block 
          round
          class="activate-btn"
          @click="activateVip(level)"
        >
          {{ t("level.activateNow") }}
        </van-button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page {
  margin-top: var(--van-nav-bar-height);
  min-height: calc(100vh - var(--van-nav-bar-height));
  background-color: #f5f7fa;
  overflow: hidden;
  height: 100%;

  .vip-banner {
    background: linear-gradient(to right,#4f75d1,#3f5eab);
    margin: 1rem 0.9375rem;
    padding: 0.9375rem 1.25rem;
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.625rem;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    img {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  .scrollable-container {
    height: 100%;
    overflow-y: auto;
    padding: 0 0.9375rem 1.25rem;

    .level-card {
      background: white;
      border-radius: 0.5rem;
      padding: 0.75rem;
      margin-bottom: 1rem;

      .level-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid #eee;
        .level-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;

          .level-icon {
            flex-shrink: 0;
          }

          .level-badge {
            background: linear-gradient(135deg, #FFB84D 0%, #FF9A1F 100%);
            color: white;
            padding: 0.25rem 0.875rem;
            border-radius: 0.375rem;
            font-size: 0.75rem;
            font-weight: 500;
          }
        }

        .level-price {
          font-size: 1.25rem;
          font-weight: bold;
          color: #FF6B6B;
        }
      }

      .level-features {
        margin-bottom: 1.25rem;

        .feature-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
          background-color: #f5f7fa;
          padding: 0.5rem;
          border-radius: 0.25rem;
          .feature-item {
            flex: 1;
            display: flex;
            gap: 0.625rem;
            align-items: flex-start;
            padding:0.25rem;

            .feature-content {
              flex: 1;

              .feature-label {
                font-size: 0.75rem;
                margin-bottom: 0.25rem;
                color:#666;
              }

              .feature-value {
                font-size: 0.75rem;
                color: var(--cp-primary);
                font-weight:500;
              }
              .limit-none {
                color: #222;
              }
            }
          }
        }

        .feature-extra {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          font-size: 0.8125rem;
          padding: 0.5rem;
          border-radius: 0.25rem;
          background-color: #f5f7fa;
        }
      }

      .activate-btn {
        border-radius: 0.5rem;
      }
    }
  }
}
</style>
