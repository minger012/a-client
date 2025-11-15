import { useI18n } from "vue-i18n";

export const useNumber = () => {
  /**
   * 补零函数
   */
  const padZero = (num: number): string => {
    return num.toString().padStart(2, "0");
  };
  /**
   * 金额保留两位小数
   * @param amount 金额（数字或字符串）
   * @param options 配置选项
   * @returns 格式化后的金额字符串
   */
  const formatMoney = (
    amount: number | string | null | undefined,
    options: {
      emptyValue?: string; // 空值显示
      autoRound?: boolean; // 是否自动四舍五入
    } = {}
  ): string => {
    const { emptyValue = "0.00", autoRound = true } = options;

    // 处理空值
    if (amount === null || amount === undefined || amount === "") {
      return emptyValue;
    }

    // 转换为数字
    let num: number;
    if (typeof amount === "string") {
      num = parseFloat(amount.replace(/[^\d.-]/g, ""));
    } else {
      num = amount;
    }

    // 检查是否为有效数字
    if (isNaN(num)) {
      return emptyValue;
    }

    // 保留两位小数
    if (autoRound) {
      // 四舍五入到两位小数
      num = Math.round(num * 100) / 100;
    } else {
      // 直接截取两位小数
      num = Math.floor(num * 100) / 100;
    }

    // 格式化为两位小数
    return num.toFixed(2);
  };

  return { padZero, formatMoney };
};

export const useTime = () => {
  const { t } = useI18n();
  /**
   * 将时间戳转换为相对时间描述（如：几分钟前）
   * @param timestamp 时间戳（秒或毫秒）
   * @returns 相对时间描述字符串
   */
  const timeAgo = (timestamp: number): string => {
    // 判断是秒还是毫秒（通常10位是秒，13位是毫秒）
    const ts =
      timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
    const now = Date.now();
    const diff = now - ts;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;

    if (diff < minute) {
      return t("time.justNow");
    } else if (diff < hour) {
      return t("time.minutesAgo", { minutes: Math.floor(diff / minute) });
    } else if (diff < day) {
      return t("time.hoursAgo", { hours: Math.floor(diff / hour) });
    } else if (diff < month) {
      return t("time.daysAgo", { days: Math.floor(diff / day) });
    } else if (diff < year) {
      return t("time.monthsAgo", { months: Math.floor(diff / month) });
    } else {
      return t("time.yearsAgo", { years: Math.floor(diff / year) });
    }
  };
  const formatToMonthDay = (timestamp: number, type = 1): string => {
    if (!timestamp || timestamp <= 0) {
      return "--/-- --:--";
    }
    const msTimestamp = timestamp * 1000;
    const date = new Date(msTimestamp);
    const year = date.getFullYear();
    const number = useNumber();
    const month = number.padZero(date.getMonth() + 1); // 月份从0开始
    const day = number.padZero(date.getDate());
    const hours = number.padZero(date.getHours());
    const minutes = number.padZero(date.getMinutes());
    const seconds = number.padZero(date.getSeconds());
    if (type == 1) {
      return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    } else if (type == 2) {
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    } else {
      return `${month}/${day} ${hours}:${minutes}:${seconds}`;
    }
  };
  return { formatToMonthDay, timeAgo };
};

/**
 * 客服API相关方法
 */
export const useSalesmartlyService = () => {
  /**
   * 设置登录信息
   * @param userInfo 用户信息对象
   */
  let setLoginTimer: any = null;
  const setLoginInfo = (userInfo: {
    user_id: string; // 应用后的用户id，必填
    user_name?: string; // 对应用户名，可在客户资料查看，必填
    language?: string; // 对应用户语言，可在客户资料查看
    phone?: string; // 对应用户手机号，可在客户资料查看
    email?: string; // 对应用户邮箱，可在客户资料查看
    description?: string; // 对应用户的描述信息，例如套餐包，可在客户资料查看
    label_names?: string[]; // 对应用户标签，仅支持传系统已创建的标签值，可在客户资料查看
    custom_fields_ext?: Record<string, any>; // 自定义字段，到现日选聘的自定义字段中搜到
  },tryCount = 0) => {
    if(setLoginTimer && tryCount == 0){
      clearTimeout(setLoginTimer);
    }
    if (typeof window !== 'undefined' && (window as any).ssq) {
      (window as any).ssq.push('setLoginInfo', userInfo);
    }else if(tryCount < 3){
      setLoginTimer = setTimeout(() => {
        setLoginInfo(userInfo,tryCount + 1);
      }, 1000);
    }
  };

  /**
   * 插件语言设置
   * @param language 语言代码，例如：'ru-RU', 'en-US', 'zh-CN' 等
   */
  let setLanguageTimer: any = null;
  const setLanguage = (language: string,tryCount = 0) => {
    if(setLanguageTimer && tryCount == 0){
      clearTimeout(setLanguageTimer);
    }
    if (typeof window !== 'undefined' && (window as any).ssq) {
      (window as any).ssq.push('setLoginInfo', { language });
    }else if(tryCount < 3){
      setLanguageTimer = setTimeout(() => {
        setLanguage(language,tryCount + 1);
      }, 1000);
    }
  };

  /**
   * 清理用户登录信息
   * 在PWA（渐进式 Web 应用）站点中，当用户内退出登录后，尤其是在没有刷新页面的情况下，
   * 可用于手动清理用户的登录信息。通过调用此方法，可以将用户信息清除，切换到访客模式；
   * 确保用户隐私和安全、以及提供无缝的用户体验
   */
  let clearUserTimer: any = null;
  const clearUser = (tryCount = 0) => {
    if(clearUserTimer && tryCount == 0){
      clearTimeout(clearUserTimer);
    }
    if (typeof window !== 'undefined' && (window as any).ssq) {
      (window as any).ssq.push('clearUser');
    }else if(tryCount < 3){
      clearUserTimer = setTimeout(() => {
        clearUser(tryCount + 1);
      }, 1000);
    }
  };

  /**
   * 打开聊天窗口
   * 在某些特殊场景下（如支付失败、账户、操作引导问题等），需要引导访客主动联系客服支持。
   * 您可以通过程序手动打开聊天窗口，确保用户能够快速获得帮助。
   */
  const chatOpen = () => {
    if (typeof window !== 'undefined' && (window as any).ssq) {
      (window as any).ssq.push('chatOpen');
    }
  };

  return {
    setLoginInfo,
    setLanguage,
    clearUser,
    chatOpen,
  };
};
