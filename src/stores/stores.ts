import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore(
  "user",
  () => {
    // 用户信息状态
    const user = ref<User>();
    // 设置用户信息的函数
    const setUser = (u: User) => {
      user.value = u;
    };
    // 设置是否有设置收款
    const setUserCard = (state: 0 | 1) => {
      user.value!.set_card = state;
    };
    // 设置是否有设置支付密码
    const setUserPayPassword = (state: 0 | 1) => {
      user.value!.set_pay_password = state;
    };
    // 删除用户信息的函数
    const delUser = () => {
      user.value = undefined;
    };

    const siteTitle = ref("");
    const setSiteTitle = (val: string) => {
      siteTitle.value = val;
    };

    const returnUrl = ref("");
    const setReturnUrl = (url: string) => (returnUrl.value = url);

    return {
      user,
      setUser,
      setUserCard,
      setUserPayPassword,
      delUser,
      returnUrl,
      setReturnUrl,
      siteTitle,
      setSiteTitle,
    };
  },
  {
    persist: true,
  }
);
