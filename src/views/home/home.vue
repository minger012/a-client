<script setup lang="ts">
import { useNumber } from "@/composables/common";
import { getIndexApi, signApi } from "@/services/api";
import { onMounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const number = useNumber();

// 签到
const sign = async () => {
  await signApi().then((res) => {
    indexData.value.userData.isSign = 1;
    indexData.value.userData.sign++;
    showToast(res.msg);
  });
};
const copy = () => {
  showToast(t("home.copySuccess"));
};

// 首页数据
const tabsActive = ref(0);
const indexData = ref();
const getIndexData = async (id: number) => {
  await getIndexApi(id).then((res) => {
    indexData.value = res.data;
  });
};
watch(tabsActive, async (newVal: number) => {
  await getIndexData(newVal);
});
onMounted(async () => {
  await getIndexData(tabsActive.value);
});
</script>

<template>
  <!-- 导航 -->
  <CpNavBar :isBack="false" :isLoginOut="true"> </CpNavBar>
  <div class="head">
    <div class="relative">
      <van-image
        round
        width="18.4103vw"
        height="18.4103vw"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      />
      <div class="avatar-edit">
        <van-icon name="photograph" size="11" color="#fff" />
      </div>
    </div>
    <div class="ml-5 flex-1">
      <div>{{ indexData?.userData.username }}</div>
      <div class="tag">
        {{ t("home.creditScore") }}：{{ indexData?.userData.score }}
      </div>
      <div class="tag">
        {{ t("home.signInCount") }}：{{ indexData?.userData.sign }}
      </div>
      <div class="tag">
        {{ t("home.storeRating") }}：
        <CpImage
          name="star"
          width="12px"
          height="12px"
          :round="true"
          v-for="value in indexData?.userData.lv"
        ></CpImage>
      </div>
    </div>
    <div class="flex flex-col space-y-2">
      <van-button
        type="primary"
        size="small"
        class="button-sign"
        v-if="!indexData || indexData?.userData.isSign == 1"
      >
        <span class="text-[12px] text-gray-400">{{ t("home.signedIn") }}</span>
      </van-button>
      <van-button type="primary" size="small" @click="sign()" v-else>
        <span class="text-[12px]">{{ t("home.signIn") }}</span>
      </van-button>
      <van-button type="primary" size="small" @click="$router.push('wallet')">
        <span class="text-[12px]">{{ t("home.wallet") }}</span>
      </van-button>
    </div>
  </div>
  <div class="invite-card">
    <div class="icon-wrap">
      <van-icon name="friends" size="22.5" color="#fff" />
    </div>
    <div class="content">
      <div class="label">{{ t("home.invitationCode") }}</div>
      <div class="code">DZHY9SMYX</div>
    </div>
    <div class="copy-hint">
      <van-icon name="description" size="14" color="#4e7cdc" />
      <span class="copy-text" @click="copy()">{{ t("home.copy") }}</span>
    </div>
  </div>
  <div class="banner-wrap">
    <div class="banner" @click="$router.push('market')">
      <img
        src="@/assets/img/banner1-D_iNypES.png"
        alt="Plan To Launch In Plaza"
        class="banner-image"
      />
      <div class="title-wrap">
        <div class="title">{{ t("home.planLaunchPlaza") }}</div>
        <div class="desc">{{ t("home.getRichProfits") }}</div>
      </div>
    </div>
    <div class="banner" @click="$router.push('order')">
      <img
        src="@/assets/img/banner2-FQGNIWdl.png"
        alt="Plan Management"
        class="banner-image"
      />
      <div class="title-wrap">
        <div class="title">{{ t("home.planManagement") }}</div>
      </div>
    </div>
  </div>
  <div class="tab-wrap">
    <van-tabs v-model:active="tabsActive" line-width="5.625rem">
      <van-tab :title="t('home.today')"></van-tab>
      <van-tab :title="t('home.thisWeek')"></van-tab>
      <van-tab :title="t('home.thisMonth')"></van-tab>
      <van-tab :title="t('home.all')"></van-tab>
    </van-tabs>
  </div>
  <div class="data-view">
    <div class="title-wrap">
      <div class="title">{{ t("home.dataOverview") }}</div>
      <div class="desc" @click="getIndexData(tabsActive)">
        <span>{{ t("home.dataUpdateHint") }}</span>
        <CpSvg name="refresh"></CpSvg>
      </div>
    </div>
    <div class="data-list">
      <div class="data-item">
        <div class="number-row">
          $ {{ number.formatMoney(indexData?.planOrderData.money) }}
        </div>
        <div class="name-row">
          <span>{{ t("home.placementAmount") }}</span>
          <CpSvg name="data-1"></CpSvg>
        </div>
      </div>
      <div class="data-item">
        <div class="number-row">{{ indexData?.planOrderData.count || 0 }}</div>
        <div class="name-row">
          <span>{{ t("home.placementOrders") }}</span>
          <CpSvg name="data-2"></CpSvg>
        </div>
      </div>
      <div class="data-item">
        <div class="number-row">
          $ {{ number.formatMoney(indexData?.planOrderData.putIn) }}
        </div>
        <div class="name-row">
          <span>{{ t("home.consumed") }}</span>
          <CpSvg name="data-3"></CpSvg>
        </div>
      </div>
      <div class="data-item">
        <div class="number-row">
          $ {{ number.formatMoney(indexData?.planOrderData.wait_putIn) }}
        </div>
        <div class="name-row">
          <span>{{ t("home.pendingConsumption") }}</span>
          <CpSvg name="data-4"></CpSvg>
        </div>
      </div>
      <div class="data-item">
        <div class="number-row">
          {{ indexData?.planOrderData.show_num || 0 }}
        </div>
        <div class="name-row">
          <span>{{ t("home.impressions") }}</span>
          <CpSvg name="data-5"></CpSvg>
        </div>
      </div>
      <div class="data-item">
        <div class="number-row">
          {{ indexData?.planOrderData.click_num || 0 }}
        </div>
        <div class="name-row">
          <span>{{ t("home.clicks") }}</span>
          <CpSvg name="data-6"></CpSvg>
        </div>
      </div>
      <div class="data-item">
        <div class="number-row">
          $ {{ number.formatMoney(indexData?.planOrderData.click_money) }}
        </div>
        <div class="name-row">
          <span>{{ t("home.adRevenue") }}</span>
          <CpSvg name="data-7"></CpSvg>
        </div>
      </div>
      <div class="data-item">
        <div class="number-row">
          $ {{ number.formatMoney(indexData?.planOrderData.profit) }}
        </div>
        <div class="name-row">
          <span>{{ t("home.profit") }}</span>
          <CpSvg name="data-8"></CpSvg>
        </div>
      </div>
    </div>
  </div>
  <div class="tab-bar">
    <div class="tab-bar-item" @click="$router.push('coupons')">
      <CpSvg name="discount-shape" size="5vw"></CpSvg>
      <div class="name">{{ t("home.coupons") }}</div>
    </div>
    <!-- <div class="tab-bar-item">
      <svg aria-hidden="true" class="svg-icon" style="width: 5vw; height: 5vw">
        <use href="#icon-device-message" fill="#333"></use>
      </svg>
      <div class="name">{{ t('home.feedback') }}</div>
    </div> -->
    <div class="tab-bar-item" @click="$router.push('password')">
      <CpSvg name="edit-password" size="5vw"></CpSvg>
      <div class="name">{{ t("home.changeLoginPassword") }}</div>
    </div>
  </div>
  <div class="section">
    <div class="section-title">{{ t("home.faq") }}</div>
    <div class="question-list">
      <!---->
      <div class="question-item" @click="$router.push('news?id=1')">
        <div class="name">What is The 7 Star's Advertising Solution?</div>
        <van-icon name="arrow" />
      </div>
      <div class="question-item" @click="$router.push('news?id=2')">
        <div class="name">
          Why can't we cancel the Audience Network program?
        </div>
        <van-icon name="arrow" />
      </div>
      <div class="question-item" @click="$router.push('news?id=3')">
        <div class="name">Online Deposit Issues?</div>
        <van-icon name="arrow" />
      </div>
      <div class="question-item" @click="$router.push('news?id=4')">
        <div class="name">How long does it take to complete a plan?</div>
        <van-icon name="arrow" />
      </div>
      <div class="question-item" @click="$router.push('news?id=5')">
        <div class="name">Can I become a program partner?</div>
        <van-icon name="arrow" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.head {
  margin-top: var(--van-nav-bar-height);
  padding: 4.61538vw 4.10256vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .avatar-edit {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 6.15385vw;
    height: 6.15385vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #4e7cdc;
    border-radius: 50%;
    border: 0.53333vw solid #fff;
  }
  .tag {
    display: flex;
    justify-content: center;
    align-items: center;
    width: max-content;
    font-size: 2.5641vw;
    color: #65676a;
    padding: 1.28205vw 3.07692vw;
    background: #f0f2f5;
    border-radius: 1.02564vw;
    line-height: 1;
    margin-top: 0.8vw;
  }
  .button-sign {
    cursor: not-allowed;
    background-color: #f7f8fa;
    color: #cbcccd;
    border-color: rgb(240, 242, 245) !important;
  }
}
.invite-card {
  display: flex;
  align-items: center;
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.53333vw 2.13333vw;
  cursor: pointer;
  margin: 0px 4.10256vw 4vw;
  background: linear-gradient(
    135deg,
    rgba(78, 124, 220, 0.02),
    rgba(78, 124, 220, 0.008)
  );
  border-width: 1px;
  border-style: solid;
  border-color: rgba(78, 124, 220, 0.082);
  border-image: initial;
  border-radius: 2vw;
  padding: 3vw;
  transition: 0.3s;
  &:active {
    transform: scale(0.98);
  }
  .content {
    min-width: 0px;
    flex: 1 1 0%;
    .label {
      font-size: 3.2vw;
      color: rgb(102, 102, 102);
      margin-bottom: 1vw;
    }
    .code {
      font-size: 5vw;
      font-weight: 700;
      color: rgb(78, 124, 220);
    }
  }
  .copy-hint {
    display: flex;
    align-items: center;
    margin-left: 3vw;
    padding: 1.5vw 3vw;
    background: rgba(78, 124, 220, 0.1);
    border-radius: 1vw;
    .copy-text {
      margin-left: 4px;
      font-size: 3vw;
      color: rgb(78, 124, 220);
      white-space: nowrap;
    }
  }
  .icon-wrap {
    width: 10vw;
    height: 10vw;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 3vw;
    border-radius: 2vw;
    background: linear-gradient(135deg, rgb(78, 124, 220), rgb(60, 90, 166));
  }
}
.banner-wrap {
  padding: 0px 4.10256vw;
  .banner {
    display: flex;
    width: 100%;
    -webkit-box-align: center;
    align-items: center;
    position: relative;
    padding-bottom: 22.5%;
    overflow: hidden;
    background: rgb(78, 124, 220);
    border-radius: 4.10256vw;
    &:not(:last-child) {
      margin-bottom: 2.13333vw;
    }
  }
  .banner-image {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    object-fit: fill;
    object-position: center center;
    z-index: 0;
  }
  .title-wrap {
    position: absolute;
    z-index: 1;
    color: var(--van-white);
    line-height: 1;
    left: 24%;
    top: 50%;
    transform: translateY(-50%);
  }
  .title {
    font-size: 6.15385vw;
    font-weight: 900;
  }
  .desc {
    font-size: 4.10256vw;
    margin-top: 2.07692vw;
  }
}
.tab-wrap {
  position: relative;
  margin-top: 2.5641vw;
  padding: 0px 4.10256vw;
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
.data-view {
  margin-top: 5.64103vw;
  padding: 0 4.10256vw 4.61538vw;
  .title-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6.15385vw;
  }
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
  }
  .data-list {
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
      }
      .name-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 3.07692vw;
        color: var(--van-black);
      }
    }
  }
}
.tab-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 4.10256vw 0;
  background: var(--van-white);
  border-bottom: 1px solid #e5e5e5;
  border-top: 2.05128vw solid #f0f2f5;
  .tab-bar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 3.33333vw;
    color: var(--van-black);
    padding: 0 0.5vw;
  }
  .name {
    margin-top: 2.05128vw;
    font-size: 3.07692vw;
    white-space: break-word;
    text-align: center;
  }
}
.section {
  margin-top: 5.64103vw;
  padding: 0 4.10256vw 4.61538vw;
  .section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6.15385vw;
    font-size: 4.61538vw;
  }
  .question-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:not(:last-child) {
      margin-bottom: 9.23077vw;
    }
    .name {
      flex: 1;
      font-size: 4.10256vw;
      color: #65676a;
    }
  }
}
::v-deep() {
  .van-button--small {
    width: 5.3125rem;
  }
}
</style>
