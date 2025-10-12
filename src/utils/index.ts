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
