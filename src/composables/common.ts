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
