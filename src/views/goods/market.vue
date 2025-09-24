<script setup lang="ts">
import { ref } from "vue";
import CpPutin from "./components/CpPutin.vue";

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
// 下拉刷新
const refreshing = ref(false);
const onRefresh = async () => {
  refreshing.value = false;
};
// 弹出层-下单
const childRef = ref(null);
const updateChildData = () => {
  if (childRef.value) {
    // 直接修改子组件的变量
    childRef.value.showBottom = true;
  }
};
</script>
<template>
  <CpNavBar> </CpNavBar>
  <div class="page">
    <div class="header-info">
      <div class="title">计划投放广场</div>
      <div class="description">选择合适的投放计划，获取丰厚投放利润</div>
    </div>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      pulling-text="Pull down to refresh..."
      loosing-text="Release to refresh..."
      loading-text="loading..."
    >
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="no more"
        loading-text="loading..."
        error-text="fail"
        @load="onLoad"
      >
        <div class="plan-items">
          <div class="plan-card" v-for="item in 3">
            <div class="plan-header">
              <div class="plan-logo">
                <CpImage
                  name="https://facebooks.s3.ap-east-1.amazonaws.com/b3776533beff47a78fb6fdc44d952149.jpg"
                  width="3.625rem"
                  height="3.625rem"
                  radius="15%"
                ></CpImage>
              </div>
              <div class="plan-main-info">
                <div class="plan-name">Shadowverse</div>
                <div class="plan-company">Cygames</div>
                <div class="plan-time">09/13 22:55</div>
              </div>
            </div>
            <div class="plan-desc">
              Shadowverse employs an anime art style with some illustrations
              reused from the developer's previous title, Rage of Bahamut, an
              earlier digital collectible card game released in 2012. The game
              has been compared favorably with Hearthstone (2014), a difference
              being that Cygames sought to minimize the impact of randomness on
              match outcomes. Another difference is Shadowverse's "Evolve" game
              mechanic which allows players to grant played cards bonus stats
              and effects at the cost of an evolution point.
            </div>
            <div class="plan-footer">
              <van-button
                type="primary"
                size="small"
                round
                class="button button-detail"
                @click="$router.push('goodsDetail')"
              >
                <span class="text-[12px] text-gray-500">查看详情</span>
              </van-button>
              <van-button
                type="primary"
                size="small"
                round
                class="button"
                @click="updateChildData()"
              >
                <span class="text-[12px]">开始投放</span>
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
