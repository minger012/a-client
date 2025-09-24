<script setup lang="ts">
import { ref } from "vue";
// 定义传参
const params = ref<{}>({
  page: 0,
  pageSize: 10,
});
</script>
<template>
  <CpNavBar> </CpNavBar>
  <div class="page">
    <div data-v-cfc93573="" class="container plan">
      <div class="plan-status-wrap">
        <div class="status-content">
          <div class="title">结算成功</div>
        </div>
        <CpSvg name="status-6" size="10vw" color="#fff"></CpSvg>
      </div>
      <div class="section">
        <div class="section-title">投放产品</div>
        <div class="put-goods">
          <div class="goods-content">
            <CpImage
              radius="25%"
              name="https://facebooks.s3.ap-east-1.amazonaws.com/e850726155a5434ca1d077a4e899290b.jpg"
              width="4.375rem"
              height="4.375rem"
            ></CpImage>
            <div class="goods-info">
              <div class="goods-name">MONOPOLY GO!</div>
              <div class="goods-desc">Games</div>
              <div class="goods-sub">Scopely</div>
            </div>
          </div>
          <div class="link" @click="$router.push('goodsDetail')">查看详情</div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">
          <div class="title">数据概览</div>
          <div class="desc space-x-1">
            <span>数据每30s更新一次</span>
            <CpSvg name="refresh" size="1rem"></CpSvg>
          </div>
        </div>
        <div class="data-section">
          <div class="data-item">
            <div class="number-row">$ 235.83</div>
            <div class="name-row">
              投放金额
              <CpSvg name="data-1"></CpSvg>
            </div>
          </div>
          <div class="data-item progress-item">
            <div class="number-row">
              <div class="progress-wrap">
                <div class="number">100</div>
                <div class="van-progress" style="height: 5px">
                  <span
                    class="van-progress__portion"
                    style="width: 100%"
                  ></span>
                </div>
              </div>
            </div>
            <div class="name-row">
              投放进度
              <CpSvg name="data-2"></CpSvg>
            </div>
          </div>
          <div class="data-item">
            <div class="number-row">$ 235.83</div>
            <div class="name-row">
              已消耗
              <CpSvg name="data-3"></CpSvg>
            </div>
          </div>
          <div class="data-item">
            <div class="number-row">$ 0.00</div>
            <div class="name-row">
              待消耗
              <CpSvg name="data-4"></CpSvg>
            </div>
          </div>
          <div class="data-item">
            <div class="number-row">247</div>
            <div class="name-row">
              展示数
              <CpSvg name="data-5"></CpSvg>
            </div>
          </div>
          <div class="data-item">
            <div class="number-row">193</div>
            <div class="name-row">
              点击数
              <CpSvg name="data-6"></CpSvg>
            </div>
          </div>
          <div class="data-item">
            <div class="number-row">$ 264.84</div>
            <div class="name-row">
              广告收入
              <CpSvg name="data-7"></CpSvg>
            </div>
          </div>
          <div class="data-item">
            <div class="number-row">$ +29.01</div>
            <div class="name-row">
              利润
              <CpSvg name="data-8"></CpSvg>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">投放内容</div>
        <div class="banner-wrap">
          <CpImage
            name="https://facebooks.s3.ap-east-1.amazonaws.com/8710f1e50fb14ca3a3dfc8269ec917df.jpeg"
          ></CpImage>
        </div>
        <div class="put-desc">
          Roll the dice and get rich in MONOPOLY GO! Own it all by exploring
          boards and building cities. Play with friends and family to enjoy this
          new twist on a classic game! Hit GO! Roll the dice! Earn MONOPOLY
          money, interact with your friends, family members and fellow Tycoons
          from around the world as you explore the expanding universe of
          MONOPOLY GO! It’s the new way to play - board flipping cleanup not
          required! Take a Break! Escape, enjoy, dream, scheme and stay in touch
          with this newly reimagined twist on MONOPOLY! Let everyone’s favorite
          zillionaire, Mr. MONOPOLY, be your guide as you explore new boards
          themed after world-famous cities, fantastical lands and imaginative
          locales. So MONOPOLY GO! Experience classic fun and visuals with
          gameplay fit for your phone! Collect Properties, build Houses and
          Hotels, pull Chance Cards, and of course, earn that MONOPOLY Money!
          Play with your favorite game Tokens such as the Racecar, Top Hat,
          Battleship, and more. Earn more tokens as you go! See MONOPOLY icons
          like Mr. M, Scottie and Ms. MONOPOLY come to life, and brand new
          characters too! Your Family Table! Help or hinder! - You and friends
          can earn easy money with Community Chest and co-op events! Or heist
          their banks to help yourself get to the top. Don’t feel bad! Collect
          and trade story-filled Stickers with friends and family and in our
          MONOPOLY GO! Facebook Trading Groups! Complete gorgeous, clever albums
          for huge rewards!
        </div>
        <div class="form-cell-wrap">
          <div class="cell-item">
            <div class="label">Promotional Link</div>
            <div class="content">https://www.monopolygo.com/</div>
          </div>
          <div class="cell-item">
            <div class="label">Ad Display Format</div>
            <div class="content">Image</div>
          </div>
          <div class="cell-item">
            <div class="label">Conversion Method</div>
            <div class="content">Landing Page</div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">投放规则</div>
        <div class="form-cell-wrap">
          <div class="cell-item">
            <div class="label">Ad Placement Strategy</div>
            <div class="content">CPM</div>
          </div>
          <div class="cell-item">
            <div class="label">Ad Placement Cost</div>
            <div class="content">Smart Optimization</div>
          </div>
          <div class="cell-item">
            <div class="label">Payment Method</div>
            <div class="content">CPC</div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">用户定向</div>
        <div class="form-cell-wrap">
          <div class="cell-item">
            <div class="label">Location</div>
            <div class="content">Global</div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="section-title">
          <div class="title">创建时间</div>
          <div class="desc"><span>26/08/2025 06:56:17</span></div>
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
        font-size: 3.07692vw;
        color: var(--van-gray-7);
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
