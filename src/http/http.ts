import router from "@/router";
import { useUserStore } from "@/stores/stores";
import { getLang } from "@/utils";
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 20000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const UserStore = useUserStore();
    if (UserStore.user?.token) {
      config.headers["Authorization"] = `${UserStore.user.token}`;
      config.headers["think-lang"] = getLang();
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    switch (response.data.code) {
      case -1:
        showToast(response.data.msg);
        // 清除本地的用户信息
        const store = useUserStore();
        store.delUser();
        router.push("/login");
        return Promise.reject(response.data);
      case 0:
        showToast(response.data.msg);
        return Promise.reject(response.data);
      case 1:
        return response.data;
      default:
        showToast(`code error ` + response.data.code);
        return Promise.reject(response.data);
    }
  },
  (error) => {
    showToast("fail to respond");
    return Promise.reject(error);
  }
);

type Data<T> = {
  /**-1登录失效 0错误 1正常 */
  code: number;
  msg: string;
  data: T;
};

export const http = <T>(url: string, method: "GET" | "POST", data: any) => {
  //response 第一个参数没用, 所以在第二个参数传参
  return instance<any, Data<T>>({
    url,
    method,
    [method == "GET" ? "params" : "data"]: data,
  });
};

export const httpLoading = <T>(
  url: string,
  method: "GET" | "POST",
  data: any
) => {
  showLoadingToast({
    message: "loading...",
    forbidClick: true,
    duration: -1,
  });
  //response 第一个参数没用, 所以在第二个参数传参
  return instance<any, Data<T>>({
    url,
    method,
    [method == "GET" ? "params" : "data"]: data,
  });
};
