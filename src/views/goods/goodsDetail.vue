<script setup lang="ts">
import { ref } from "vue";
import { onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";
import { useTime } from "@/composables/common";
import { goodsDetailApi } from "@/services/api";
const time = useTime();
const { t } = useI18n();
const route = useRoute();
const detail = ref<any>();
const getDetail = async () => {
  const res = await goodsDetailApi(route.query.id as unknown as number);
  detail.value = res.data;
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
    <div class="header-wrap">
      <div class="logo">
        <CpImage
          :name="detail.logo"
          width="24.61538vw"
          height="24.61538vw"
        ></CpImage>
      </div>
      <div class="title">Fate/Grand Order</div>
      <div class="btn-wrap">
        <CpImage
          name="google-play-nQbvKhbh"
          width="9.5rem"
          height="2.875rem"
        ></CpImage>
        <CpImage
          name="apple-store-Da3dkSd7"
          width="8.5rem"
          height="2.875rem"
        ></CpImage>
      </div>
    </div>
    <div class="section">
      <van-swipe indicator-color="#fff">
        <van-swipe-item v-for="item in detail.image">
          <CpImage :name="item" width="100%" height="9.375rem"></CpImage>
        </van-swipe-item>
      </van-swipe>
    </div>
    <div class="section">
      <div class="section-title">游戏简介</div>
      <div class="put-desc">
        {{ detail.intro }}
      </div>
    </div>
    <div class="section">
      <div class="section-title">产品详情</div>
      <div class="form-cell-wrap">
        <div class="cell-item" v-for="value in detail.app_info">
          <div class="label">{{ value.title }}</div>
          <div class="content">{{ value.content }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.page {
  margin-top: var(--van-nav-bar-height);
  .header-wrap {
    display: flex;
    align-items: center;
    flex-direction: column;
    background: url(/src/assets/img/goods-detail-header-bg-BbrPUqL6.png)
      no-repeat;
    padding: 6.66667vw 6.41026vw;
    padding-top: calc(constant(safe-area-inset-top) + 20vw);
    padding-top: calc(env(safe-area-inset-top) + 20vw);
    .logo {
      width: 24.61538vw;
      height: 24.61538vw;
    }
    .title {
      font-size: 5.89744vw;
      font-weight: 600;
      margin-top: 6.66667vw;
    }
    .btn-wrap {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2.82051vw;
      margin-top: 7.17949vw;
    }
  }
  .section {
    margin-top: 6.15385vw;
    padding: 0 3.84615vw;
    &:last-child {
      margin-bottom: 3.84615vw;
    }
    .section-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 4.10256vw;
    }
    .put-desc {
      font-size: 3.07692vw;
      color: var(--color-black);
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
