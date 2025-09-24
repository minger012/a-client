type User = {
  /** token令牌 */
  token: string;
  /** 用户ID */
  id: string;
  /** 用户名称 */
  username: string;
  /** 语言标识 */
  lang: langType;
  /** 最后登录时间 */
  last_login_time: number;
  /** 最后登录IP */
  last_login_ip: string;
};

// 语言包类型 简体中文 | 英文 | 西班牙
type langType = "zh-cn" | "zh-tw" | "en-us" | "es-es" | "th-th";

type PageParams = {
  /** 一页几条 */
  pageSize: number;
  /** 第几页 */
  page: number;
};
type OrderListType = -1 | 0 | 1 | 2;
type OrderPageParams = PageParams & {
  type: OrderListType;
};
