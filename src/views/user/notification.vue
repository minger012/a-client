<script setup lang="ts">
import { useTime } from "@/composables/common";
import { getMailListApi, mailReadApi } from "@/services/api";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const time = useTime();
// 定义传参
const params = ref<PageParams>({
  page: 0,
  pageSize: 10,
});
// 分页加载
const loading = ref(false);
const finished = ref(false);
const mailList = ref<any>([]);
const onLoad = async () => {
  if (finished.value) {
    return;
  }
  loading.value = true;
  params.value.page++;
  await getMailListApi(params.value, value1.value, value2.value)
    .then((res) => {
      mailList.value.push(...res.data.list);
      if (params.value.page >= res.data.total_page) {
        finished.value = true;
      }
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
};
// 下拉刷新
const refreshing = ref(false);
const onRefresh = async () => {
  params.value.page = 1;
  await getMailListApi(params.value, value1.value, value2.value)
    .then((res) => {
      mailList.value = res.data.list;
      refreshing.value = false;
    })
    .catch(() => {
      refreshing.value = false;
    });
};
// 查看消息
const childRef = ref<any>(null);

// 格式化计划订单消息
const formatPlanOrderMessage = (content: string) => {
  try {
    const contentObj = JSON.parse(content);
    if (contentObj.type === "plan_order_dispatch") {
      const { count, plans } = contentObj.data;
      const planList = plans.map((p: any) => `${p.plan_name} - ${p.goods_name}`).join(", ");
      return t("notification.planOrderDispatchContent", { count, plans: planList });
    }
    return content;
  } catch (e) {
    return content;
  }
};

const readMail = (detail: any) => {
  if (detail.read_time == 0) {
    mailReadApi(detail.id);
    mailList.value = mailList.value.map((item: any) => {
      if (item.id == detail.id) {
        item.read_time = 1;
        childRef.value.fetchUnreadCount();
      }
      return item;
    });
  }
  
  // 格式化消息内容
  const displayContent = detail.type === 4 ? formatPlanOrderMessage(detail.content) : detail.content;
  
  showDialog({
    title: detail.type == 4 ? t("notification.taskOrderDispatch") : detail.title,
    message: displayContent,
  }).then(() => {});
};
const value1 = ref(0);
const value2 = ref(0);
// 监听多个响应式引用
watch([value1, value2], async ([newValue1, newValue2]) => {
  params.value.page = 1;
  mailList.value = [];
  refreshing.value = true;
  await getMailListApi(params.value, newValue1, newValue2)
    .then((res) => {
      mailList.value = res.data.list;
      refreshing.value = false;
    })
    .catch(() => {
      refreshing.value = false;
    });
});

const option1 = [
  { text: t("notification.allMessages"), value: 0 },
  { text: t("notification.systemAnnouncement"), value: 1 },
  { text: t("notification.systemMaintenance"), value: 2 },
  { text: t("notification.activityNotification"), value: 3 },
  { text: t("notification.taskOrderDispatch"), value: 4 },
];
const option2 = [
  { text: t("notification.allStatus"), value: 0 },
  { text: t("notification.unreadMessages"), value: 1 },
  { text: t("notification.readMessages"), value: 2 },
];
const typeName = {
  1: t("notification.systemAnnouncement"),
  2: t("notification.systemMaintenance"),
  3: t("notification.activityNotification"),
  4: t("notification.taskOrderDispatch"),
};
const class1 = {
  1: "icon-blue",
  2: "icon-orange",
  3: "icon-red",
  4: "icon-green",
};
const class2 = {
  1: "primary",
  2: "warning",
  3: "danger",
  4: "success",
};
const class3 = {
  1: "volume-o",
  2: "setting-o",
  3: "gift-o",
  4: "orders-o",
};
</script>
<template>
  <CpNavBar ref="childRef"> </CpNavBar>
  <div class="page">
    <div class="filter-section">
      <van-dropdown-menu swipe-threshold="2">
        <van-dropdown-item v-model="value1" :options="option1" />
        <van-dropdown-item v-model="value2" :options="option2" />
      </van-dropdown-menu>
    </div>
    <div class="message-list">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-empty
          :description="t('notification.noMessages')"
          v-if="!mailList"
        />
        <van-list
          v-model:loading="loading"
          :finished="finished"
          @load="onLoad"
          :finished-text="t('common.noMore')"
          v-else
        >
          <div class="p-3 h-full">
            <div
              class="message-item type-system_announcement"
              v-for="value in mailList"
              @click="readMail(value)"
            >
              <div
                class="message-item-header"
                :class="value.read_time == 0 ? 'unread' : ''"
              >
                <div
                  class="message-type-indicator"
                  :class="(class1 as any)[value.type]"
                ></div>
                <van-tag :type="(class2 as any)[value.type]">
                  <span class="text-10">
                    {{ (typeName as any)[value.type] }}
                  </span>
                </van-tag>
                <span class="message-time">
                  {{ time.timeAgo(value.create_time) }}
                </span>
                <div class="unread-dot" v-if="value.read_time == 0"></div>
              </div>
              <div class="message-item-content">
                <div class="message-icon-wrapper">
                  <div
                    class="message-icon"
                    :class="(class1 as any)[value.type]"
                  >
                    <van-icon
                      :name="(class3 as any)[value.type]"
                      size="1.125rem"
                    />
                  </div>
                </div>
                <div class="message-body">
                  <h3 class="message-title">{{ value.type == 4 ? t("notification.taskOrderDispatch") : value.title }}</h3>
                  <p class="message-text">
                    {{ value.type === 4 ? formatPlanOrderMessage(value.content) : value.content }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page {
  margin-top: var(--van-nav-bar-height);
  background-color: #f7f8fa;
  min-height: calc(100vh - var(--van-nav-bar-height));
  display: flex;
  flex-direction: column;
  .message-item {
    margin-bottom: 0.7500rem;
    border-radius: 0.5000rem;
    background-color: #fff;
    box-shadow: 0 1px 0.2500rem #0000000d;
    overflow: hidden;
    position: relative;
    transition: all 0.2s ease;
    &:last-child {
      margin-bottom: 0;
    }
    .message-item-header {
      display: flex;
      align-items: center;
      padding: 0.5000rem 0.7500rem;
      background-color: #fff;
      border-bottom: 1px solid #dce0e7;
      position: relative;
      .message-type-indicator {
        width: 0.2500rem;
        height: 1.0000rem;
        border-radius: 0.1250rem;
        margin-right: 0.5000rem;
        flex-shrink: 0;
      }
      .icon-blue {
        color: #1989fa;
        background-color: #1989fa1a;
      }
      .message-time {
        margin-left: auto;
        font-size: 0.7500rem;
        color: #606a78;
      }
    }
    .message-item-content {
      display: flex;
      padding: 0.7500rem;
      .message-icon-wrapper {
        margin-right: 0.7500rem;
        flex-shrink: 0;
        .message-icon {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 2.2500rem;
          height: 2.2500rem;
          border-radius: 0.5000rem;
        }
      }
      .message-body {
        flex: 1;
        min-width: 0;
        .message-title {
          font-size: 0.9375rem;
          font-weight: 500;
          color: #303133;
          margin: 0 0 0.3750rem;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .message-text {
          font-size: 0.8750rem;
          color: #606266;
          line-height: 1.5;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
    }
  }
  .icon-blue {
    color: #1989fa;
    background-color: #1989fa1a;
  }
  .icon-red {
    color: #ee0a24;
    background-color: #ee0a241a;
  }
  .icon-orange {
    color: #ff976a;
    background-color: #ff976a1a;
  }
  .icon-green {
    color: #07c160;
    background-color: #07c1601a;
  }
  .unread-dot {
    width: 0.5000rem;
    height: 0.5000rem;
    border-radius: 50%;
    background-color: #ff4d4f;
    margin-left: 0.5000rem;
  }
  .unread {
    background-color: #ecf5ff !important;
    border-bottom-color: #d4e6fd !important;
  }
}
::v-deep() {
  .van-dropdown-menu__bar--opened {
    z-index: 0;
  }
  .van-dropdown-item__option--active {
    background-color: #f0f9ff;
  }
}
</style>
