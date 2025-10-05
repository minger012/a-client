<script setup lang="ts">
import { ref } from "vue";
import CpPutin from "./components/CpPutin.vue";
import { planListApi } from "@/services/api";
import { useTime } from "@/composables/common";
import { useUserStore } from "@/stores/stores";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const time = useTime();
const userStore = useUserStore();
const router = useRouter();
// 定义传参
const params = ref<PageParams>({
  page: 0,
  pageSize: 10,
});
// 分页加载
const loading = ref(false);
const finished = ref(false);
const goodList = ref<any>([]);
const onLoad = async () => {
  if (finished.value) {
    return;
  }
  loading.value = true;
  params.value.page++;
  await planListApi(params.value)
    .then((res) => {
      goodList.value.push(...res.data.list);
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
  await planListApi(params.value)
    .then((res) => {
      goodList.value = res.data.list;
      refreshing.value = false;
    })
    .catch(() => {
      refreshing.value = false;
    });
};

// 弹出层-下单
const childRef = ref(null);
const updateChildData = (plan_id: number) => {
  // 未设置支付密码
  if (userStore.user?.set_pay_password != 1) {
    showToast(t("market.setPayPasswordHint"));
    router.push("paypassword?isJump=1");
    return;
  }
  if (childRef.value) {
    // 直接修改子组件的变量
    childRef.value.showBottom = true;
    childRef.value.plan_id = plan_id;
  }
};
</script>
<template>
  <CpNavBar> </CpNavBar>
  <div class="page">
    <div class="header-info">
      <div class="title">{{ t("market.planLaunchPlaza") }}</div>
      <div class="description">{{ t("market.choosePlanHint") }}</div>
    </div>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      :pulling-text="t('market.pullDownRefresh')"
      :loosing-text="t('market.releaseRefresh')"
      :loading-text="t('market.loading')"
    >
      <van-list
        v-model:loading="loading"
        :finished="finished"
        :finished-text="t('market.noMore')"
        :loading-text="t('market.loading')"
        :error-text="t('market.fail')"
        @load="onLoad"
      >
        <div class="plan-items">
          <div class="plan-card" v-for="item in goodList">
            <div class="plan-header">
              <div class="plan-logo">
                <CpImage
                  :name="item.image"
                  width="3.625rem"
                  height="3.625rem"
                  radius="15%"
                ></CpImage>
              </div>
              <div class="plan-main-info">
                <div class="plan-name">{{ item.name }}</div>
                <div class="plan-company">{{ item.company }}</div>
                <div class="plan-time">
                  {{ time.formatToMonthDay(item.create_time) }}
                </div>
              </div>
            </div>
            <div class="plan-desc">
              {{ item.intro }}
            </div>
            <div class="plan-footer">
              <van-button
                type="primary"
                size="small"
                round
                class="button button-detail"
                @click="$router.push('planDetail?id=' + item.id)"
              >
                <span class="text-[12px] text-gray-500">
                  {{ t("market.viewDetails") }}
                </span>
              </van-button>
              <van-button
                type="primary"
                size="small"
                round
                class="button"
                @click="updateChildData(item.id)"
              >
                <span class="text-[12px]">{{ t("market.startLaunch") }}</span>
              </van-button>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
  <CpPutin ref="childRef"></CpPutin>
</template>
<style lang="scss" scoped>
.page {
  margin-top: var(--van-nav-bar-height);
  min-height: 100vh;
  background: #f5f5f5;
  .header-info {
    background: #fff;
    padding: 4.10256vw;
    margin-bottom: 2.5641vw;
    .title {
      font-size: 4.61538vw;
      font-weight: 600;
      color: #333;
      margin-bottom: 2.05128vw;
    }
    .description {
      font-size: 3.33333vw;
      color: #666;
      line-height: 1.5;
    }
  }
  .plan-items {
    padding: 0 4.10256vw;
    .plan-card {
      background: #fff;
      border-radius: 2.5641vw;
      padding: 4.10256vw;
      margin-bottom: 3.07692vw;
      box-shadow: 0 0.51282vw 2.05128vw #0000000d;
      transition: all 0.3s ease;
      &:active {
        transform: scale(0.98);
      }
      cursor: pointer;
      .plan-header {
        display: flex;
        align-items: flex-start;
        margin-bottom: 3.07692vw;
        .plan-logo {
          width: 15.38462vw;
          height: 15.38462vw;
          margin-right: 3.07692vw;
          flex-shrink: 0;
        }
        .plan-main-info {
          flex: 1;
          margin-right: 2.05128vw;
          .plan-name {
            font-size: 4.10256vw;
            font-weight: 600;
            color: #333;
            margin-bottom: 1.02564vw;
            line-height: 1.2;
          }
          .plan-company {
            font-size: 3.07692vw;
            color: #666;
            margin-bottom: 1.02564vw;
          }
          .plan-time {
            font-size: 2.5641vw;
            color: #999;
          }
        }
      }
      .plan-desc {
        font-size: 3.07692vw;
        color: #666;
        line-height: 1.4;
        margin-bottom: 3.07692vw;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .plan-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 2.5641vw;
        .button {
          width: 9.375rem;
          &.button-detail {
            background-color: #fff;
            border: solid 1px #ccc;
          }
        }
      }
    }
  }
}
</style>
