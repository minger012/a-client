export const getLang = () => {
  return localStorage.getItem("lang") || (window as any).DEFAULT_LANG;
};

/**
 * 传统复制方法（兼容旧浏览器）
 */
export const legacyCopyToClipboard = (text: string): boolean => {
  try {
    // 创建临时 textarea 元素
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // 隐藏元素但保持在 DOM 中
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);

    // 选择和复制
    textArea.select();
    textArea.setSelectionRange(0, 99999); // 移动端支持

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    return successful;
  } catch (error) {
    console.error("Legacy copy failed:", error);
    return false;
  }
};

/**
 * 金额格式化 - 保留2位小数并添加千位分隔符
 * @param num 要格式化的数字
 * @param decimals 小数位数，默认2位
 * @returns 格式化后的金额字符串
 */
export const formatCurrency = (
  num: number | string,
  decimals: number = 2
): string => {
  if (num === null || num === undefined || num === "") return "0.00";

  const numberValue = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(numberValue)) return "0.00";

  // 四舍五入到指定小数位
  const fixedValue = numberValue.toFixed(decimals);

  // 分割整数和小数部分
  const parts = fixedValue.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1] || "";

  // 为整数部分添加千位分隔符
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // 如果有小数部分，拼接回去
  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
};
/**
 * 生成指定范围内的随机整数
 * @param min 最小值（包含）
 * @param max 最大值（包含）
 * @returns 范围内的随机整数
 */
export const randomInt = (min: number, max: number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
