import { http } from "@/http/http";
//注册
export const registerApi = (params: {
  username: string;
  password: string;
  repassword: string;
  code?: string;
}) => {
  return http<any>("/login/register", "POST", params);
};
//登录
export const loginApi = (username: string, password: string) => {
  return http<User>("/login/login", "POST", {
    username,
    password,
  });
};

//退出登录
export const loginOutApi = () => {
  return http<any>("/user/loginOut", "POST", {});
};

//设置语言
export const setLangApi = (lang: langType) => {
  return http<any>("/user/setLang", "POST", { lang });
};

//获取积分
export const getScoreApi = () => {
  return http<any>("/user/getMoney", "POST", {});
};
//添加银行卡
export const bankCardAddApi = (
  name: string,
  bank: string,
  cardno: string,
  password: string
) => {
  return http<any>("/user/bankCardAdd", "POST", {
    name,
    bank,
    cardno,
    password,
  });
};
//银行卡列表
export const bankCardListApi = () => {
  return http<any>("/user/bankCardList", "POST", {});
};
//银行卡删除
export const bankCardDelApi = (id: number) => {
  return http<any>("/user/bankCardDel", "POST", { id });
};
//提现
export const withdrawApi = (
  money: string,
  password: string,
  card_id: string
) => {
  return http<any>("/user/withdraw", "POST", { money, password, card_id });
};
//获取提现列表
export const withdrawListApi = (
  params: PageParams & { sTime?: number; eTime?: number }
) => {
  return http<any>("/user/withdrawList", "POST", params);
};
//获取流水列表
export const flowListApi = (
  params: PageParams & { type?: number; sTime?: number; eTime?: number }
) => {
  return http<any>("/user/flowList", "POST", params);
};
//设置密码
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

//首页
export const getIndexApi = () => {
  return http<any>("/", "POST", {});
};

//获取当前期
export const getLotteryNowApi = (id: number) => {
  return http<any>("/lottery/getLotteryNow", "POST", { id });
};

//下单
export const lotteryOrderAddApi = (
  goods_id: number,
  period_no: number,
  money: number,
  code: string[],
  count: number
) => {
  return http<any>("/order/lotteryOrderAdd", "POST", {
    goods_id,
    period_no,
    money,
    code,
    count,
  });
};

//获取订单列表
export const lotteryOrderListApi = (params: OrderPageParams) => {
  return http<any>("/order/lotteryOrderList", "POST", params);
};
//获取订单详情
export const lotteryOrderDetailApi = (id: number) => {
  return http<any>("/order/lotteryOrderDetail", "POST", { id });
};
//获取商品列表
export const goodsListApi = () => {
  return http<any>("/goods/goodsList", "POST", {});
};

//获取配置
export const getConfigApi = (id: number) => {
  return http<any>("/login/getConfig", "POST", { id });
};
