import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore(
  "user",
  () => {
    // 1. 用户信息状态
    const user = ref<User>();
    // 2. 设置用户信息的函数
    const setUser = (u: User) => {
      user.value = u;
    };
    // 3. 删除用户信息的函数
    const delUser = () => {
      user.value = undefined;
    };
    
    const siteTitle = ref('')
    const setSiteTitle = (val:string)=>{
      siteTitle.value = val
    }

    const returnUrl = ref("");
    const setReturnUrl = (url: string) => (returnUrl.value = url);
    
    return { user, setUser, delUser, returnUrl, setReturnUrl,siteTitle,setSiteTitle };
  },
  {
    persist: true,
  }
);
