<script setup lang="ts">
import { useNumber, useTime } from "@/composables/common";
import { getConfigApi, planOrderDetailApi } from "@/services/api";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
const time = useTime();
const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const number = useNumber();
const detail = ref<any>();

// 添加刷新状态
const isRefreshing = ref(false);

const getDetail = async () => {
  isRefreshing.value = true; // 开始加载
  await planOrderDetailApi(route.query.id as unknown as number)
    .then((res) => {
      detail.value = res.data;
    })
    .catch(() => {
      router.back();
    })
    .finally(() => {
      isRefreshing.value = false; // 加载完成
    });
};

// 刷新数据函数
const refreshData = () => {
  if (!isRefreshing.value) {
    getDetail();
  }
};

let stateName = {
  0: t("orderDetail.pendingPlacement"),
  1: t("orderDetail.matching"),
  2: t("orderDetail.placing"),
  3: t("orderDetail.placementFailed"),
  4: t("orderDetail.waitingSettlement"),
  5: t("orderDetail.settlementSuccess"),
};
// 后台配置
const configData = ref<any>([]);
const getConfigData = async () => {
  await getConfigApi("1").then((res) => {
    configData.value = res.data;
  });
};
onMounted(() => {
  Promise.all([getConfigData(), getDetail()]);
});
</script>
<template>
  <CpNavBar> </CpNavBar>
  <div class="page" v-if="!detail">
    <div class="flex justify-center mt-20">
      <van-loading size="24">{{ t("common.loading") }}</van-loading>
    </div>
  </div>
  <div class="page" v-else>
    <div class="container plan">
      <div class="plan-status-wrap">
        <div class="status-content">
          <div class="title">{{ (stateName as any)[detail.state] }}</div>
        </div>
        <CpSvg
          :name="`status-` + detail.state"
          size="10vw"
          color="#fff"
        ></CpSvg>
      </div>
      <div class="section">
        <div class="section-title">{{ t("orderDetail.placementProduct") }}</div>
        <div class="put-goods">
          <div class="goods-content">
            <CpImage
              radius="25%"
              :name="detail.goods_logo"
              width="4.375rem"
              height="4.375rem"
            ></CpImage>
            <div class="goods-info">
              <div class="goods-name">{{ detail.goods_name }}</div>
              <div class="goods-desc">{{ detail.type_name }}</div>
              <div class="goods-sub">{{ detail.goods_company }}</div>
            </div>
          </div>
          <div
            class="link"
            @click="$router.push('goodsDetail?id=' + detail.goods_id)"
          >
            {{ t("orderDetail.viewDetails") }}
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">
          <div class="title">{{ t("orderDetail.dataOverview") }}</div>
          <div class="desc space-x-1" @click="refreshData">
            <span>{{ t("orderDetail.dataUpdateHint") }}</span>
            <CpSvg
              name="refresh"
              size="1rem"
              :class="{ 'refresh-spinning': isRefreshing }"
            ></CpSvg>
          </div>
        </div>
        <div class="data-section">
          <div class="data-item">
            <div class="number-row">
              {{ configData[1] }} {{ number.formatMoney(detail.money) }}
            </div>
            <div class="name-row">
              {{ t("orderDetail.placementAmount") }}
              <CpSvg name="data-1"></CpSvg>
            </div>
          </div>
          <div class="data-item progress-item">
            <div class="number-row">
              <div class="progress-wrap">
                <div class="number">{{ detail.schedule }} %</div>
                <van-progress
                  :percentage="detail.schedule"
                  pivot-text=""
                  style="height: 5px; width: 100%"
                />
              </div>
            </div>
            <div class="name-row">
              {{ t("orderDetail.placementProgress") }}
              <CpSvg name="data-2"></CpSvg>
            </div>
          </div>
          <div class="data-item">
            <div class="number-row">
              {{ configData[1] }} {{ number.formatMoney(detail.putIn) }}
            </div>
            <div class="name-row">
              {{ t("orderDetail.consumed") }}
              <CpSvg name="data-3"></CpSvg>
            </div>
          </div>
          <div class="data-item">
            <div class="number-row">
              {{ configData[1] }} {{ number.formatMoney(detail.wait_putIn) }}
            </div>
            <div class="name-row">
              {{ t("orderDetail.pendingConsumption") }}
              <CpSvg name="data-4"></CpSvg>
            </div>
          </div>
          <div class="data-item">
            <div class="number-row">{{ detail.show_num }}</div>
            <div class="name-row">
              {{ t("orderDetail.impressions") }}
              <CpSvg name="data-5"></CpSvg>
            </div>
          </div>
          <div class="data-item">
            <div class="number-row">{{ detail.click_num }}</div>
            <div class="name-row">
              {{ t("orderDetail.clicks") }}
              <CpSvg name="data-6"></CpSvg>
            </div>
          </div>
          <div class="data-item">
            <div class="number-row">
              {{ configData[1] }} {{ number.formatMoney(detail.click_money) }}
            </div>
            <div class="name-row">
              {{ t("orderDetail.adRevenue") }}
              <CpSvg name="data-7"></CpSvg>
            </div>
          </div>
          <div class="data-item">
            <div class="number-row">
              {{ configData[1] }} +{{ number.formatMoney(detail.profit) }}
            </div>
            <div class="name-row">
              {{ t("orderDetail.profit") }}
              <CpSvg name="data-8"></CpSvg>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">{{ t("orderDetail.placementContent") }}</div>
        <div class="banner-wrap">
          <CpImage :name="detail.image"></CpImage>
        </div>
        <div class="put-desc">
          {{ detail.goods_intro }}
        </div>
        <div class="form-cell-wrap">
          <div class="cell-item" v-for="value in detail.content">
            <div class="label">{{ value.title }}</div>
            <div class="content">{{ value.content }}</div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">{{ t("orderDetail.placementRules") }}</div>
        <div class="form-cell-wrap">
          <div class="cell-item" v-for="value in detail.rule">
            <div class="label">{{ value.title }}</div>
            <div class="content">{{ value.content }}</div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">{{ t("orderDetail.userTargeting") }}</div>
        <div class="form-cell-wrap">
          <div class="cell-item" v-for="value in detail.orienteering">
            <div class="label">{{ value.title }}</div>
            <div class="content">{{ value.content }}</div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">
          <div class="title">{{ t("orderDetail.createTime") }}</div>
          <div class="desc">
            <span>{{ time.formatToMonthDay(detail.create_time, 2) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page {
  margin-top: var(--van-nav-bar-height);
  padding: 0 4.10256vw 5.12821vw;
  .plan-status-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--van-primary-color);
    border-radius: 3.07692vw;
    padding: 6.15385vw 7.69231vw;
    line-height: 1;
    .status-content {
      flex: 1;
      color: var(--van-white);
      margin-right: 3.84615vw;
      .title {
        font-size: 6.15385vw;
        font-weight: 500;
        margin-bottom: 5.12821vw;
      }
    }
  }
  .section {
    margin-top: 6.15385vw;
    .section-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4.10256vw;
      font-size: 4.61538vw;
      .title {
        font-size: 4.61538vw;
        font-weight: 500;
        color: var(--van-black);
      }
      .desc {
        display: flex;
        align-items: center;
        font-size: 3.07692vw;
        color: var(--van-gray-7);
        cursor: pointer;

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
      }
    }
    .put-goods {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-radius: 2.05128vw;
      background: #f0f2f5;
      padding: 3.07692vw;
      .goods-content {
        display: flex;
        align-items: center;
        flex: 1;
        margin-right: 2.5641vw;
        .goods-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 4.61538vw;
          .goods-name {
            font-size: 3.84615vw;
            font-weight: 500;
            color: var(--van-black);
            margin-bottom: 2.05128vw;
          }
          .goods-desc {
            font-size: 2.5641vw;
            color: var(--van-black);
            margin-bottom: 2.82051vw;
          }
          .goods-sub {
            font-size: 2.5641vw;
            color: var(--van-gray-6);
          }
        }
      }
      .link {
        font-size: 2.82051vw;
        color: var(--van-primary-color);
        cursor: pointer;
      }
    }
    .data-section {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2.05128vw;
      .data-item {
        padding: 3.84615vw 3.58974vw 3.84615vw 4.61538vw;
        background: var(--van-white);
        border-radius: 2.05128vw;
        border: 1px solid #c9ccd1;
        .number-row {
          font-size: 4.61538vw;
          font-weight: 700;
          color: var(--van-black);
          display: flex;
          align-items: center;
          justify-content: space-between;
          .progress-wrap {
            flex: 1;
            margin-right: 7.69231vw;
            margin-bottom: 1.28205vw;
          }
        }
        .name-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 3.07692vw;
          color: var(--van-black);
        }
      }
    }
    .put-desc {
      font-size: 3.07692vw;
      color: var(--color-black);
      margin: 5.89744vw 0 5.12821vw;
    }
    .form-cell-wrap {
      padding: 3.58974vw 4.61538vw;
      border-radius: 3.07692vw;
      background: #f0f2f5;
      .cell-item {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        color: var(--van-black);
        &:not(:last-child) {
          margin-bottom: 5.12821vw;
        }
        .label {
          flex-shrink: 0;
          font-size: 3.07692vw;
          width: 20.51282vw;
        }
        .content {
          font-size: 3.07692vw;
          flex: 1;
          margin-left: 10.25641vw;
          text-align: right;
          word-break: break-all;
        }
      }
    }
  }
}
</style>
