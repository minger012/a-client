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
const childRef = ref(null);
const updateChildData = () => {
  if (childRef.value) {
    // 直接修改子组件的变量
    childRef.value.showBottom = true;
    childRef.value.plan_id = route.query.id as unknown as number;
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
      <van-loading size="24">loading...</van-loading>
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
      <div class="text-base font-bold my-2">游戏简介</div>
      <div class="plan-desc">
        {{ detail.intro }}
      </div>
    </div>
    <div class="w-full bg-slate-100 h-2 mb-4"></div>
    <div class="px-3 mb-4">
      <div class="text-base font-bold my-2">产品截图</div>
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
      <div class="text-base font-bold my-4">下载链接</div>
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
      <div class="text-base font-bold my-4">应用信息</div>
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
        <span class="text-base">开始投放</span>
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
    margin: 2vw 0;
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
    line-height: 1.6;
    margin-bottom: 3.07692vw;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
  }
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
</style>
