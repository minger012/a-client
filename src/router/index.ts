import { useUserStore } from "@/stores/stores";
import { createRouter, createWebHashHistory } from "vue-router";
import i18n from "../plugins/i18n";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
const { t } = i18n.global;
nProgress.configure({
  easing: "ease", // 动画方式
  showSpinner: false,
});
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/", // 首页
      component: () => import("@/views/home/home.vue"),
      meta: { title: t("routes.home") },
    },
    {
      path: "/news", // 文章
      component: () => import("@/views/home/news.vue"),
      meta: { title: t("routes.news") },
    },
    {
      path: "/login", // 登录
      component: () => import("@/views/login/login.vue"),
      meta: { title: t("routes.login") },
    },
    {
      path: "/register", // 注册
      component: () => import("@/views/login/register.vue"),
      meta: { title: t("routes.register") },
    },
    {
      path: "/market", // 市场
      component: () => import("@/views/goods/market.vue"),
      meta: { title: t("routes.market") },
    },
    {
      path: "/planDetail", // 计划详情
      component: () => import("@/views/goods/detail.vue"),
      meta: { title: t("routes.planDetail") },
    },
    {
      path: "/goodsDetail", // 商品详情
      component: () => import("@/views/goods/goodsDetail.vue"),
      meta: { title: t("routes.goodsDetail") },
    },
    {
      path: "/order", // 订单
      component: () => import("@/views/order/order.vue"),
      meta: { title: t("routes.order") },
    },
    {
      path: "/orderDetail", // 订单详情
      component: () => import("@/views/order/detail.vue"),
      meta: { title: t("routes.orderDetail") },
    },
    {
      path: "/wallet", // 我的钱包
      component: () => import("@/views/user/wallet.vue"),
      meta: { title: t("routes.wallet") },
    },
    {
      path: "/notification", // 消息通知
      component: () => import("@/views/user/notification.vue"),
      meta: { title: t("routes.notification") },
    },
    {
      path: "/password", // 修改密码
      component: () => import("@/views/user/password.vue"),
      meta: { title: t("routes.password") },
    },
    {
      path: "/paypassword", // 修改交易密码
      component: () => import("@/views/user/paypassword.vue"),
      meta: { title: t("routes.paypassword") },
    },
    {
      path: "/bindCard", // 绑卡
      component: () => import("@/views/user/bindCard.vue"),
      meta: { title: t("routes.bindCard") },
    },
    {
      path: "/coupons", // 优惠券
      component: () => import("@/views/user/coupons.vue"),
      meta: { title: t("routes.coupons") },
    },
    {
      path: "/level", // 店铺星级
      component: () => import("@/views/user/level.vue"),
      meta: { title: t("routes.level") },
    },
  ],
});

//跳转前的验证
router.beforeEach((to) => {
  nProgress.start();
  const notLogin = ["/login", "/register"];
  const userStore = useUserStore();
  if (!notLogin.includes(to.path) && !userStore.user?.token) {
    return "/login";
  }
});

//跳转后的验证
router.afterEach((to) => {
  document.title = to.meta.title ? (to.meta.title as string) : "shop";
  nProgress.done();
});

export default router;
