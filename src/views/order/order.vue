<script setup lang="ts">
import { useTime } from "@/composables/common";
import CpPutin from "../goods/components/CpPutin.vue";
import { getConfigApi, planOrderListApi } from "@/services/api";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
const time = useTime();
const { t } = useI18n();
// 定义传参
const tabsActive = ref<OrderListType>(0);
const params = ref<OrderPageParams>({
  page: 0,
  pageSize: 10,
  type: tabsActive.value,
});
// 分页加载
const loading = ref(false);
const finished = ref(false);
const planOrderList = ref<any>([]);
const onLoad = async () => {
  if (finished.value) {
    return;
  }
  loading.value = true;
  params.value.page++;
  await planOrderListApi(params.value)
    .then((res) => {
      planOrderList.value.push(...res.data.list);
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
  await planOrderListApi(params.value)
    .then((res) => {
      planOrderList.value = res.data.list;
      refreshing.value = false;
    })
    .catch(() => {
      refreshing.value = false;
    });
};
watch(tabsActive, async (newVal: OrderListType) => {
  params.value.page = 0;
  params.value.type = newVal;
  planOrderList.value = [];
  finished.value = false;
  onLoad();
});
// 弹出层-下单
const childRef = ref(null);
const updateChildData = (plan_id: number, plan_name: string) => {
  if (childRef.value) {
    // 直接修改子组件的变量
    childRef.value.showBottom3 = true;
    childRef.value.plan_id = plan_id;
    childRef.value.plan_name = plan_id;
  }
};
// 后台配置
const configData = ref<any>([]);
const getConfigData = async () => {
  await getConfigApi("1").then((res) => {
    configData.value = res.data;
  });
};
let formName = {
  1: t("order.officialPush"),
  2: t("order.unofficialPush"),
};
let stateName = {
  0: t("order.pendingPlacement"),
  1: t("order.matching"),
  2: t("order.placing"),
  3: t("order.placementFailed"),
  4: t("order.waitingSettlement"),
  5: t("order.settlementSuccess"),
};
onMounted(() => {
  Promise.all([getConfigData()]);
});
</script>
<template>
  <CpNavBar :isLoginOut="true"> </CpNavBar>
  <div class="page">
    <div class="tab-wrap">
      <van-tabs v-model:active="tabsActive">
        <van-tab :title="t('order.all')"></van-tab>
        <van-tab :title="t('order.pendingPlacement')"></van-tab>
        <van-tab :title="t('order.matching')"></van-tab>
        <van-tab :title="t('order.placing')"></van-tab>
        <van-tab :title="t('order.placementFailed')"></van-tab>
        <van-tab :title="t('order.placementCompleted')"></van-tab>
      </van-tabs>
    </div>
    <div class="p-4">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          @load="onLoad"
          :finished-text="t('common.noMore')"
        >
          <div
            class="plan-item"
            v-for="value in planOrderList"
            @click="$router.push('orderDetail?id=' + value.id)"
          >
            <div class="push-tag">{{ (formName as any)[value.form] }}</div>
            <div class="title-line">
              <span class="title"
                >{{ t("order.planNumber") }}: {{ value.order_no }}</span
              ><span class="status">{{ (stateName as any)[value.state] }}</span>
            </div>
            <div class="plan-content">
              <div class="banner">
                <div class="van-swipe my-swipe">
                  <div
                    class="van-swipe__track"
                    style="
                      transition-duration: 0ms;
                      transform: translateX(0px);
                      width: 165px;
                    "
                  >
                    <div class="van-swipe-item" style="width: 165px">
                      <CpImage
                        :name="value.image"
                        width="10.3rem"
                        height="5.75rem"
                        radius="10%"
                      ></CpImage>
                    </div>
                  </div>
                  <!---->
                </div>
              </div>
              <div class="app-content">
                <div class="app-title">
                  <div class="logo">
                    <CpImage
                      :name="value.goods_logo"
                      width="1.875rem"
                      height="1.875rem"
                      radius="10%"
                    ></CpImage>
                  </div>
                  <div class="app-title-wrap">
                    <div class="app-name">{{ value.goods_name }}</div>
                    <div class="app-desc">{{ value.type_name }}</div>
                  </div>
                </div>
                <div class="app-tag">
                  <div class="tag">{{ t("order.video") }}</div>
                  <div class="tag">{{ t("order.landingPage") }}</div>
                </div>
              </div>
            </div>
            <div class="plan-text">
              {{ value.goods_intro }}
            </div>
            <div class="put-wrap">
              <div class="put-item">
                <span class="label">{{ t("order.placementAmount") }}</span
                ><span class="value"
                  >{{ configData[1] }} {{ value.money }}</span
                >
              </div>
              <div class="put-item">
                <span class="label">{{ t("order.placementProgress") }}</span>
                <div class="progress">
                  <van-progress
                    :percentage="value.schedule"
                    pivot-text=""
                    style="height: 5px; width: 100%"
                  />
                  <span class="progress-text">{{ value.schedule }}%</span>
                </div>
              </div>
            </div>
            <div class="title-line mt-2">
              <span class="title">
                {{ t("order.createTime") }}:
                {{ time.formatToMonthDay(value.create_time, 2) }}</span
              >
            </div>
            <div class="btn-wrap" v-if="value.state == 0">
              <van-button
                type="primary"
                size="small"
                round
                class="button"
                @click="updateChildData(value.plan_id, value.name)"
                style="width: 6.5rem; height: 2.125rem; z-index: 999"
              >
                <span class="text-[3.2vw]">{{ t("order.placement") }}</span>
              </van-button>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
  <CpPutin ref="childRef"></CpPutin>
</template>
<style lang="scss" scoped>
.page {
  margin-top: var(--van-nav-bar-height);
  .tab-wrap {
    position: relative;
    margin-top: 2.5641vw;
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
  .plan-item {
    border: 1px solid #e4e6eb;
    border-radius: 2.05128vw;
    padding: 3.58974vw 4.10256vw;
    margin-bottom: 3.84615vw;
    .push-tag {
      display: inline-block;
      font-size: 3.07692vw;
      color: #fff;
      background: var(--van-primary-color);
      padding: 1.02564vw 3.07692vw;
      border-radius: 1.53846vw;
      margin-bottom: 1.53846vw;
    }
    .title-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-weight: 500;
        color: var(--van-black);
        line-height: 5.64103vw;
      }
      .status {
        font-size: 2.5641vw;
        color: #0265d1;
        background: #ebf5ff;
        padding: 0 3.07692vw;
        line-height: 5.12821vw;
        height: 5.12821vw;
        border-radius: 5.12821vw;
        white-space: nowrap;
      }
    }
    .plan-content {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-top: 5.12821vw;
      .banner {
        width: 44.10256vw;
        height: 24.61538vw;
        flex-shrink: 0;
      }
      .app-content {
        flex: 1;
        margin-left: 3.84615vw;
        .app-title {
          display: flex;
          align-items: center;
          height: 2.75rem;
          .logo {
            width: 8.20513vw;
            height: 8.20513vw;
            flex-shrink: 0;
            margin-right: 3.07692vw;
          }
          .app-title-wrap {
            color: var(--van-black);
            .app-name {
              font-size: 3.33333vw;
              font-weight: 500;
            }
            .app-desc {
              font-size: 2.30769vw;
            }
          }
        }
        .app-tag {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          .tag {
            min-width: 14.35897vw;
            height: 5.12821vw;
            text-align: center;
            line-height: 5.12821vw;
            background: #f0f2f5;
            font-size: 2.5641vw;
            color: var(--van-black);
            margin-right: 2.05128vw;
            margin-top: 2.05128vw;
          }
        }
      }
    }
    .plan-text {
      font-size: 3.07692vw;
      line-height: 4.61538vw;
      color: var(--van-black);
      margin-top: 3.84615vw;
    }
    .put-wrap {
      background: #f0f2f5;
      border-radius: 3.07692vw;
      padding: 3.84615vw 4.61538vw;
      margin-top: 3.33333vw;
      .put-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 3.07692vw;
        color: var(--van-black);
        &:not(:last-child) {
          margin-bottom: 3.58974vw;
        }
        .label {
          flex-shrink: 0;
        }
        .value {
          font-weight: 500;
          text-align: right;
          flex: 1;
          margin-left: 3.84615vw;
        }
        .progress {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 33.33333vw;
          .progress-text {
            font-size: 3.07692vw;
            color: var(--van-black);
            font-weight: 500;
            margin-left: 1.02564vw;
          }
        }
      }
    }
    .title-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title {
        font-weight: 500;
        color: var(--van-black);
        line-height: 5.64103vw;
      }
    }
    .btn-wrap {
      margin-top: 3.33333vw;
      display: flex;
      align-items: center;
      justify-content: end;
    }
  }
}
</style>
