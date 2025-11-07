<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { showToast } from "vant";
import { getUserInfoApi } from "@/services/api";
const { t } = useI18n();

// 当前代理ID
const agentId = ref("");
const activeTab = ref(0);

// 对话框相关
const showDialog = ref(false);
const inputAgentId = ref("");

// 跟随记录假数据
const followRecords = ref([
  {
    id: 1,
    userId: "头666",
    avatar: "https://i.pravatar.cc/150?img=1",
    followTime: "2025-11-04 18:44:06",
    isFollowing: true
  },
  {
    id: 2,
    userId: "头888",
    avatar: "https://i.pravatar.cc/150?img=2",
    followTime: "2025-11-04 15:20:33",
    isFollowing: true
  },
  {
    id: 3,
    userId: "头999",
    avatar: "https://i.pravatar.cc/150?img=3",
    followTime: "2025-11-03 22:15:48",
    isFollowing: false
  },
  {
    id: 4,
    userId: "头555",
    avatar: "https://i.pravatar.cc/150?img=4",
    followTime: "2025-11-03 14:30:22",
    isFollowing: true
  },
  {
    id: 5,
    userId: "头777",
    avatar: "https://i.pravatar.cc/150?img=5",
    followTime: "2025-11-02 09:45:11",
    isFollowing: true
  }
]);

// 关注计划（这里可以根据实际需求调用API）
const followPlan = () => {
  showDialog.value = true;
  inputAgentId.value = "";
};

// 确认关注
const confirmFollow = () => {
  if (!inputAgentId.value.trim()) {
    showToast(t("agentInvite.dialogPlaceholder"));
    return;
  }
  // 这里可以调用API提交代运营ID
  showDialog.value = false;
  showToast(t("agentInvite.followSuccess"));
  inputAgentId.value = "";
};

// 切换跟随状态
const toggleFollow = (record: any) => {
  record.isFollowing = !record.isFollowing;
  if (record.isFollowing) {
    showToast(t("agentInvite.followSuccess"));
  } else {
    showToast(t("agentInvite.unfollowSuccess"));
  }
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
              <div v-if="followRecords.length > 0" class="records-list">
                <div 
                  v-for="record in followRecords" 
                  :key="record.id" 
                  class="record-item"
                >
                  <div class="record-left">
                    <img :src="record.avatar" class="record-avatar" />
                    <div class="record-info">
                      <div class="record-user-id">{{ record.userId }}</div>
                      <div class="record-time">{{ record.followTime }}</div>
                    </div>
                  </div>
                  <div class="follow-btn">
                    {{ t('agentInvite.following') }}
                  </div>
                </div>
              </div>
              <van-empty v-else :description="t('agentInvite.noRecords')" />
            </div>
          </van-tab>
        </van-tabs>
      </div>
    </div>
  </div>

  <!-- 关注计划对话框 -->
  <van-popup 
    v-model:show="showDialog" 
    round 
    position="bottom"
    :style="{ width: '100%', padding: '2rem 1.5rem' }"
  >
    <div class="dialog-container">
      <div class="dialog-title">{{ t('agentInvite.dialogTitle') }}</div>
      <div class="dialog-content">
        <van-field
          v-model="inputAgentId"
          :placeholder="t('agentInvite.dialogPlaceholder')"
          clearable
          class="dialog-input"
        />
      </div>
      <div class="dialog-buttons">
        <van-button 
          type="primary" 
          block 
          size="large"
          @click="confirmFollow"
        >
          {{ t('agentInvite.confirmButton') }}
        </van-button>
      </div>
    </div>
  </van-popup>
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
  padding: 1rem;
  
  .records-list {
    .record-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 0;
      background: #fff;
      border-bottom: 1px solid #eee;
      &:last-child {
        border-bottom: none;
      }
      
      .record-left {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex: 1;
        
        .record-avatar {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .record-info {
          flex: 1;
          
          .record-user-id {
            font-size: 1rem;
            font-weight: 500;
            color: #333;
            margin-bottom: 0.25rem;
          }
          
          .record-time {
            font-size: 0.75rem;
            color: #999;
          }
        }
      }
      
      .follow-btn {
        flex-shrink: 0;
        color:var(--cp-primary);
      }
    }
  }
}

// 对话框样式
.dialog-container {
  text-align: center;
  
  .dialog-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 2rem;
  }
  
  .dialog-content {
    margin-bottom: 2rem;
    
    .dialog-input {
      :deep(.van-field__control) {
        text-align: center;
        font-size: 1rem;
      }
    }
  }
  
  .dialog-buttons {
    :deep(.van-button) {
      border-radius: 1.5rem;
      font-size: 1rem;
      height: 3rem;
    }
  }
}
</style>
