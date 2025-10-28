<script setup lang="ts">
import { ref } from "vue";
import CpPutin from "./components/CpPutin.vue";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { planDetailApi } from "@/services/api";
import { useTime } from "@/composables/common";
const time = useTime();
const { t } = useI18n();
const route = useRoute();
const detail = ref<any>();
const getDetail = async () => {
  const res = await planDetailApi(route.query.id as unknown as number);
  detail.value = res.data;
};
const childRef = ref<any>(null);
const updateChildData = () => {
  if (childRef.value) {
    // 直接修改子组件的变量
    childRef.value.showBottom = true;
    childRef.value.plan_id = route.query.id as unknown as number;
    childRef.value.plan_name = detail.value.name;
  }
};
const onLink = (link: string) => {
  if (!link) {
    return;
  }
  window.open(link);
};
onMounted(() => {
  getDetail();
});
</script>
<template>
  <CpNavBar> </CpNavBar>
  <div class="page" v-if="!detail">
    <div class="flex justify-center mt-20">
      <van-loading size="24">{{ t("planDetail.loading") }}</van-loading>
    </div>
  </div>
  <div class="page" v-else>
    <div class="px-3">
      <div class="plan-header">
        <div class="plan-logo">
          <CpImage
            :name="detail.goods_logo"
            width="3.625rem"
            height="3.625rem"
            radius="30%"
          ></CpImage>
        </div>
        <div class="plan-main-info">
          <div class="plan-name">{{ detail.name }}</div>
          <div class="plan-company">{{ detail.company }}</div>
          <div class="plan-company" style="color: #166fe5">
            {{ detail.type_name }}
          </div>
          <div class="plan-time">
            {{ time.formatToMonthDay(detail.create_time) }}
          </div>
        </div>
      </div>
      <div class="text-base font-bold my-2">
        {{ t("planDetail.gameIntroduction") }}
      </div>
      <div class="plan-desc">
        {{ detail.intro }}
      </div>
    </div>
    <div class="w-full bg-slate-100 h-2 mb-4"></div>
    <div class="px-3 mb-4">
      <div class="text-base font-bold my-2">
        {{ t("planDetail.productScreenshots") }}
      </div>
      <!-- <div class="grid grid-cols-3 gap-2"> -->
      <CpImage
        :name="detail.image"
        width="7rem"
        height="7rem"
        radius="10%"
      ></CpImage>
      <!-- </div> -->
    </div>
    <div class="w-full bg-slate-100 h-2 mb-4"></div>
    <div class="px-3 mb-4">
      <div class="text-base font-bold my-4">
        {{ t("planDetail.downloadLinks") }}
      </div>
      <div class="flex space-x-3">
        <div
          class="flex items-center p-2 bg-gray-100 rounded-lg w-[50%]"
          @click="onLink(detail.google_play)"
        >
          <van-icon name="play-circle" color="#4e7cdc" size="20" />
          <span class="text-[12px] ml-2">Google Play</span>
        </div>
        <div
          class="flex items-center p-2 bg-gray-100 rounded-lg w-[50%]"
          @click="onLink(detail.app_store)"
        >
          <van-icon name="shop" color="#4e7cdc" size="20" />
          <span class="text-[12px] ml-2">App Store</span>
        </div>
      </div>
    </div>
    <div class="w-full bg-slate-100 h-2 mb-4"></div>
    <div class="px-3 mb-4">
      <div class="text-base font-bold my-4">{{ t("planDetail.appInfo") }}</div>
      <div class="form-cell-wrap">
        <div class="cell-item" v-for="value in detail.app_info">
          <div class="label">{{ value.title }}</div>
          <div class="content">{{ value.content }}</div>
        </div>
      </div>
    </div>
    <div class="w-full bg-slate-100 h-3 mb-4"></div>
    <div class="px-3 mb-4">
      <van-button
        native-type="submit"
        block
        round
        type="primary"
        @click="updateChildData()"
      >
        <span class="text-base">{{ t("planDetail.startLaunch") }}</span>
      </van-button>
    </div>
  </div>
  <CpPutin ref="childRef"></CpPutin>
</template>
<style lang="scss" scoped>
.page {
  margin-top: var(--van-nav-bar-height);
  .plan-header {
    display: flex;
    align-items: flex-start;
    margin: 0.4688rem 0;
    .plan-logo {
      width: 3.6058rem;
      height: 3.6058rem;
      margin-right: 0.7212rem;
      flex-shrink: 0;
    }
    .plan-main-info {
      flex: 1;
      margin-right: 0.4808rem;
      .plan-name {
        font-size: 0.9615rem;
        font-weight: 600;
        color: #333;
        margin-bottom: 0.2404rem;
        line-height: 1.2;
      }
      .plan-company {
        font-size: 0.7212rem;
        color: #666;
        margin-bottom: 0.2404rem;
      }
      .plan-time {
        font-size: 0.6010rem;
        color: #999;
      }
    }
  }
  .plan-desc {
    font-size: 0.7212rem;
    color: #666;
    line-height: 1.6;
    margin-bottom: 0.7212rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
  }
}
.form-cell-wrap {
  padding: 0.8413rem 1.0817rem;
  border-radius: 0.7212rem;
  background: #f0f2f5;
  .cell-item {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    color: var(--van-black);
    &:not(:last-child) {
      margin-bottom: 1.2019rem;
    }
    .label {
      flex-shrink: 0;
      font-size: 0.7212rem;
      width: 4.8077rem;
    }
    .content {
      font-size: 0.7212rem;
      flex: 1;
      margin-left: 2.4038rem;
      text-align: right;
      word-break: break-all;
    }
  }
}
</style>
