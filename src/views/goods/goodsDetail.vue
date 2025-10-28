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
      <van-loading size="24">{{ t("goodsDetail.loading") }}</van-loading>
    </div>
  </div>
  <div class="page" v-else>
    <div class="header-wrap">
      <div class="logo">
        <CpImage
          :name="detail.logo"
          width="5.7692rem"
          height="5.7692rem"
        ></CpImage>
      </div>
      <div class="title">{{ detail.name }}</div>
      <div class="btn-wrap">
        <CpImage
          name="google-play-nQbvKhbh"
          width="9.5rem"
          height="2.875rem"
          @click="onLink(detail.google_play)"
        ></CpImage>
        <CpImage
          name="apple-store-Da3dkSd7"
          width="8.5rem"
          height="2.875rem"
          @click="onLink(detail.app_store)"
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
      <div class="section-title">{{ t("goodsDetail.gameIntroduction") }}</div>
      <div class="put-desc">
        {{ detail.intro }}
      </div>
    </div>
    <div class="section">
      <div class="section-title">{{ t("goodsDetail.productDetails") }}</div>
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
    background: url(../../assets/img/goods-detail-header-bg-BbrPUqL6.png)
      no-repeat;
    padding: 1.5625rem 1.5024rem;
    padding-top: calc(constant(safe-area-inset-top) + 4.6875rem);
    padding-top: calc(env(safe-area-inset-top) + 4.6875rem);
    .logo {
      width: 5.7692rem;
      height: 5.7692rem;
    }
    .title {
      font-size: 1.3822rem;
      font-weight: 600;
      margin-top: 1.5625rem;
    }
    .btn-wrap {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0.6611rem;
      margin-top: 1.6827rem;
    }
  }
  .section {
    margin-top: 1.4423rem;
    padding: 0 0.9014rem;
    &:last-child {
      margin-bottom: 0.9014rem;
    }
    .section-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.9615rem;
    }
    .put-desc {
      font-size: 0.7212rem;
      color: var(--color-black);
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
  }
}
</style>
