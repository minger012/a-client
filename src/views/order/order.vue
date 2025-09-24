<script setup lang="ts">
import { ref } from "vue";
// 定义传参
const params = ref<{}>({
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
  if (params.value.page >= 11) {
    finished.value = true;
  }
  loading.value = false;
};
const tabsActive = ref(0);
</script>
<template>
  <CpNavBar :isLoginOut="true"> </CpNavBar>
  <div class="page">
    <div class="tab-wrap">
      <van-tabs v-model:active="tabsActive">
        <van-tab title="全部"></van-tab>
        <van-tab title="待投放"></van-tab>
        <van-tab title="匹配中"></van-tab>
        <van-tab title="投放中"></van-tab>
        <van-tab title="投放失败"></van-tab>
        <van-tab title="投放完成"></van-tab>
      </van-tabs>
    </div>
    <div class="p-4">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="no more"
        loading-text="loading..."
        error-text="fail"
        @load="onLoad"
      >
        <div
          class="plan-item"
          v-for="value in 4"
          @click="$router.push('orderDetail')"
        >
          <div class="push-tag">非官方推送</div>
          <div class="title-line">
            <span class="title">計劃編號: P_1960114030689390592</span
            ><span class="status">結算成功</span>
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
                      name="https://facebooks.s3.ap-east-1.amazonaws.com/3534bb6bcf0f406a9fc760780e5c4d72.jpeg"
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
                    name="https://facebooks.s3.ap-east-1.amazonaws.com/e850726155a5434ca1d077a4e899290b.jpg"
                    width="1.875rem"
                    height="1.875rem"
                    radius="10%"
                  ></CpImage>
                </div>
                <div class="app-title-wrap">
                  <div class="app-name">MONOPOLY GO!</div>
                  <div class="app-desc">Games</div>
                </div>
              </div>
              <div class="app-tag">
                <div class="tag">視頻</div>
                <div class="tag">落地頁</div>
              </div>
            </div>
          </div>
          <div class="plan-text">
            Roll the dice and get rich in MONOPOLY GO! Own it all by exploring
            boards and building cities. Play with friends and family to enjoy
            this new twist on a classic game! Hit GO! Roll the dice! Earn
            MONOPOLY money, interact with your friends, family members and
            fellow Tycoons from around the world as you explore the expanding
            universe of MONOPOLY GO! It’s the new way to play - board flipping
            cleanup not required! Take a Break! Escape, enjoy, dream, scheme and
            stay in touch with this newly reimagined twist on MONOPOLY! Let
            everyone’s favorite zillionaire, Mr. MONOPOLY, be your guide as you
            explore new boards themed after world-famous cities, fantastical
            lands and imaginative locales. So MONOPOLY GO! Experience classic
            fun and visuals with gameplay fit for your phone! Collect
            Properties, build Houses and Hotels, pull Chance Cards, and of
            course, earn that MONOPOLY Money! Play with your favorite game
            Tokens such as the Racecar, Top Hat, Battleship, and more. Earn more
            tokens as you go! See MONOPOLY icons like Mr. M, Scottie and Ms.
            MONOPOLY come to life, and brand new characters too! Your Family
            Table! Help or hinder! - You and friends can earn easy money with
            Community Chest and co-op events! Or heist their banks to help
            yourself get to the top. Don’t feel bad! Collect and trade
            story-filled Stickers with friends and family and in our MONOPOLY
            GO! Facebook Trading Groups! Complete gorgeous, clever albums for
            huge rewards!
          </div>
          <div class="put-wrap">
            <div class="put-item">
              <span class="label">投放金額</span
              ><span class="value">$ 235.83</span>
            </div>
            <div class="put-item">
              <span class="label">投放進度</span>
              <div class="progress">
                <van-progress :percentage="100" style="height: 5px" />

                <span class="progress-text">100%</span>
              </div>
            </div>
          </div>
          <div class="title-line mt-2">
            <span class="title">創建時間: 26/08/2025 06:56:17</span>
          </div>
          <div class="btn-wrap"></div>
        </div>
      </van-list>
    </div>
  </div>
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
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
