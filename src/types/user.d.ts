type User = {
  /** token令牌 */
  token: string;
  /** 用户ID */
  id: string;
  /** 用户名称 */
  username: string;
  /** 是否有设置收款 */
  set_card: number;
  /** 是否有设置支付密码 */
  set_pay_password: number;
  /** 语言标识 */
  lang: string;
  /** 最后登录时间 */
  last_login_time: number;
  /** 最后登录IP */
  last_login_ip: string;
};

type PageParams = {
  /** 一页几条 */
  pageSize: number;
  /** 第几页 */
  page: number;
};
type OrderListType = -1 | 0 | 1 | 2 | 3 | 4;
type OrderPageParams = PageParams & {
  type: OrderListType;
};
