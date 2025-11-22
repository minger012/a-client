import { http, httpLoading } from "@/http/http";
//注册
export const registerApi = (params: {
  username: string;
  password: string;
  repassword: string;
  mobile: string;
  code?: string;
}) => {
  return httpLoading<any>("/login/register", "POST", params);
};
//登录
export const loginApi = (username: string, password: string) => {
  return httpLoading<User>("/login/login", "POST", {
    username,
    password,
  });
};

//退出登录
export const loginOutApi = () => {
  return http<any>("/user/loginOut", "POST", {});
};

//设置语言
export const setLangApi = (lang: string) => {
  return http<any>("/user/setLang", "POST", { lang });
};

// 获取玩家信息
export const getUserInfoApi = () => {
  return http<any>("/user/info", "POST", {});
};

// 上传头像
export const uploadImageApi = (formData: FormData) => {
  return http<any>("/user/uploadImage", "POST", formData);
};

// 获取银行卡
export const bankCardListApi = () => {
  return http<any>("/user/bankCardList", "POST", {});
};

// 修改银行
export const bankCardAddApi = (
  methods: string,
  currency: string,
  address: string,
  network: string
) => {
  return http<any>("/user/bankCardAdd", "POST", {
    methods,
    currency,
    address,
    network,
  });
};

// 提现
export const withdrawApi = (money: string, password: string) => {
  return httpLoading<any>("/user/withdraw", "POST", { money, password });
};

// 获取流水列表
export const flowListApi = (
  params: PageParams & { type?: number; sTime?: number; eTime?: number }
) => {
  return http<any>("/user/flowList", "POST", params);
};

// 设置密码
export const setPassWordApi = (
  orpassword: string,
  password: string,
  repassword: string
) => {
  return http<any>("/user/setPassWord", "POST", {
    orpassword,
    password,
    repassword,
  });
};

// 设置交易密码
export const setPayPassWordApi = (
  orpassword: string,
  password: string,
  repassword: string
) => {
  return http<any>("/user/setPayPassWord", "POST", {
    orpassword,
    password,
    repassword,
  });
};

// 首页
export const getIndexApi = (id: number) => {
  return http<any>("", "POST", { id });
};

// 下单
export const planOrderAddApi = (
  plan_id: string,
  money: string,
  pay_password: string,
  cd: string,
  cid: string
) => {
  return httpLoading<any>("/planOrder/add", "POST", {
    plan_id,
    money,
    pay_password,
    cd,
    cid,
  });
};

// 下单(后台派单的)
export const planOrderSendAddApi = (
  id: string,
  money: string,
  pay_password: string,
  cid: string
) => {
  return httpLoading<any>("/planOrder/sendAdd", "POST", {
    id,
    money,
    pay_password,
    cid,
  });
};

// 获取订单列表
export const planOrderListApi = (params: OrderPageParams) => {
  return http<any>("/planOrder/list", "POST", params);
};

// 获取订单详情
export const planOrderDetailApi = (id: number) => {
  return http<any>("/planOrder/detail", "POST", { id });
};

// 获取计划列表
export const planListApi = (params: PageParams) => {
  return http<any>("/plan/list", "POST", params);
};

// 获取计划详情
export const planDetailApi = (id: number) => {
  return http<any>("/plan/detail", "POST", { id });
};

// 获取计划详情
export const goodsDetailApi = (id: number) => {
  return http<any>("/goods/detail", "POST", { id });
};

// 获取配置
export const getConfigApi = (ids: string) => {
  return http<any>("/login/getConfig", "POST", { ids });
};

// 签到
export const signApi = () => {
  return httpLoading<any>("/user/sign", "POST", {});
};

// 优惠券列表
export const getCouponListApi = (params: PageParams, state: number) => {
  return http<any>("/user/couponList", "POST", { ...params, state });
};

// 钱包
export const getwalletApi = () => {
  return http<any>("/user/wallet", "POST", {});
};

// 邮件列表
export const getMailListApi = (
  params: PageParams,
  type: number,
  state: number
) => {
  return http<any>("/user/mailList", "POST", { ...params, type, state });
};

// 设置邮件已读
export const mailReadApi = (id: number) => {
  return http<any>("/user/mailRead", "POST", { id });
};

// 邮件未读数
export const mailNoReadApi = () => {
  return http<any>("/user/mailNoRead", "POST", {});
};

// 提交意见反馈
export const feedbackSubmitApi = (subject: string, content: string) => {
  return httpLoading<any>("/feedback/submit", "POST", {
    subject,
    content,
  });
};

// 获取实名认证信息
export const realnameInfoApi = () => {
  return http<any>("/user/realnameInfo", "POST", {});
};

// 提交/更新实名认证
export const realnameSubmitApi = (params: {
  real_name: string;
  verify_type: number;
  front_image: string;
  back_image: string;
}) => {
  return httpLoading<any>("/user/realnameSubmit", "POST", params);
};

// 上传实名认证证件图片
export const uploadRealnameImageApi = (formData: FormData) => {
  return httpLoading<any>("/user/uploadRealnameImage", "POST", formData);
};
