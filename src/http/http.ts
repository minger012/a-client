import router from "@/router";
import { useUserStore } from "@/stores/stores";
import { getLang } from "@/utils";
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 20000,
});

// 从 URL 中获取 token（支持 hash 路由）
const getTokenFromURL = (): string | null => {
  // 方法1：使用 URLSearchParams（推荐）
  const url = window.location.href;

  // 处理 hash 路由中的查询参数
  const hashIndex = url.indexOf("#");
  if (hashIndex !== -1) {
    const hashPart = url.substring(hashIndex + 1);
    const queryIndex = hashPart.indexOf("?");

    if (queryIndex !== -1) {
      const queryString = hashPart.substring(queryIndex + 1);
      const urlParams = new URLSearchParams(queryString);
      return urlParams.get("token");
    }
  }

  // 如果没有在 hash 中找到，尝试普通查询参数
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("token");
};

// 保存 URL token 到本地存储
const saveUrlTokenToLocal = (token: string): void => {
  localStorage.setItem("gm_token", token);
};

// 从本地存储获取 URL token
const getUrlTokenFromLocal = (): string | null => {
  return localStorage.getItem("gm_token");
};

// 清除本地存储的 URL token
const clearUrlTokenFromLocal = (): void => {
  localStorage.removeItem("gm_token");
};

// 获取最终使用的 token
const getFinalToken = (): string | null => {
  // 优先使用 URL 中的 token
  const urlToken = getTokenFromURL();

  if (urlToken) {
    saveUrlTokenToLocal(urlToken);
    return urlToken;
  }

  // 其次使用本地存储的 URL token
  const localUrlToken = getUrlTokenFromLocal();
  if (localUrlToken) {
    return localUrlToken;
  }

  // 最后使用 UserStore 中的 token
  const UserStore = useUserStore();
  return UserStore.user?.token || null;
};

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    config.headers["think-lang"] = getLang();

    // 获取最终使用的 token
    const finalToken = getFinalToken();
    if (finalToken) {
      config.headers["Authorization"] = `${finalToken}`;
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
        // 清除本地的用户信息和 URL token
        const store = useUserStore();
        store.delUser();
        clearUrlTokenFromLocal(); // 清除 URL token
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
    // 如果是认证错误，清除 URL token
    if (error.response?.status === 401) {
      clearUrlTokenFromLocal();
    }
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
  return instance<any, Data<T>>({
    url,
    method,
    [method == "GET" ? "params" : "data"]: data,
  });
};

// 导出 token 管理函数
export const tokenManager = {
  getTokenFromURL,
  getUrlTokenFromLocal,
  clearUrlTokenFromLocal,
  hasUrlToken: (): boolean => {
    return !!(getTokenFromURL() || getUrlTokenFromLocal());
  },
  // 强制使用 URL token（用于特定场景）
  forceUrlToken: (token: string): void => {
    saveUrlTokenToLocal(token);
  },
};
