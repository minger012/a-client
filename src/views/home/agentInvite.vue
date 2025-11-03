<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
import { getUserInfoApi } from "@/services/api";
const { t } = useI18n();

// 当前代理ID
const agentId = ref("");
const activeTab = ref(0);

// 关注计划（这里可以根据实际需求调用API）
const followPlan = () => {
  showToast(t("agentInvite.followSuccess"));
};

onMounted(() => {
  getUserInfoApi().then((res) => {
    agentId.value = res.data.code;
  });
});
</script>

<template>
  <CpNavBar :title="t('agentInvite.title')"></CpNavBar>
  <div class="page">
    <!-- 插图 -->
    <div class="illustration">
      <img src="@/assets/img/invite_banner.png" />
    </div>
    <div class="agent-container">
      
      <!-- 当前代理ID标题 -->
      <div class="current-id-title">{{ t("agentInvite.currentAgentId") }}</div>

      <!-- 代理ID显示 -->
      <div class="agent-id-display">
        <div class="id-digit" v-for="(digit, index) in agentId.split('')" :key="index">
          {{ digit }}
        </div>
      </div>

      <!-- 关注按钮 -->
      <div class="follow-button-section">
        <van-button 
          type="primary" 
          block 
          @click="followPlan"
          size="large"
          >
          {{ t("agentInvite.followPlan") }}
        </van-button>
      </div>

      <!-- 标签页 -->
      <div class="tabs-section">
        <van-tabs v-model:active="activeTab" class="custom-tabs">
          <van-tab :title="t('agentInvite.operatingRules')">
            <div class="rules-content">
              <div class="rule-item">
                <span class="rule-number">1、</span>
                <span class="rule-text">{{ t('agentInvite.rules.rule1') }}</span>
              </div>
              <div class="rule-item">
                <span class="rule-number">2、</span>
                <span class="rule-text">{{ t('agentInvite.rules.rule2') }}</span>
              </div>
              <div class="rule-item">
                <span class="rule-number">3、</span>
                <span class="rule-text">{{ t('agentInvite.rules.rule3') }}</span>
              </div>
              <div class="rule-item">
                <span class="rule-number">4、</span>
                <span class="rule-text">{{ t('agentInvite.rules.rule4') }}</span>
              </div>
              <div class="rule-item">
                <span class="rule-number">5、</span>
                <span class="rule-text">{{ t('agentInvite.rules.rule5') }}</span>
              </div>
            </div>
          </van-tab>
          <van-tab :title="t('agentInvite.followRecord')">
            <div class="records-content">
              <van-empty :description="t('agentInvite.noRecords')" />
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  padding-top: var(--van-nav-bar-height);
}


.illustration {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
    display: block;
  }
}

.current-id-title {
  text-align: center;
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
  font-weight: 500;
}

.agent-id-display {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 2rem;
  padding: 0 1rem;
  
  .id-digit {
    width: 2.75rem;
    height: 2.75rem;
    background: #f5f5f5;
    border-radius: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    font-weight: bold;
    color: #333;
  }
}

.follow-button-section {
  margin-bottom: 2rem;
  padding: 0 1rem;
  :deep(.van-button) {
    border-radius: 1rem;
  }
}

.tabs-section {
  background: #fff;
  overflow: hidden;
  border-top: 0.5rem solid #f5f5f5;
  
  :deep(.van-tabs) {
    
    .van-tabs__line {
      height: 3px;
      border-radius: 2px;
    }
    
    .van-tab {
      font-size: 0.9375rem;
      
      &--active {
        font-weight: 500;
      }
    }
  }
}

.rules-content {
  padding: 1.5rem;
  
  .rule-item {
    display: flex;
    margin-bottom: 1.25rem;
    line-height: 1.6;
    color: #666;
    font-size: 0.875rem;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .rule-number {
      flex-shrink: 0;
      color: #333;
      font-weight: 500;
    }
    
    .rule-text {
      flex: 1;
    }
  }
}

.records-content {
  padding: 2rem 1.5rem;
}
</style>
