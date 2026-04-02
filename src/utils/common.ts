export const openUrl = (url: string) => {
  const newWindow = window.open(url, "_blank");
  if (newWindow) {
    newWindow.opener = null; // 防止新打开的标签页访问原始页面
  } else {
    console.error("打开新页面失败"); // 如果打开失败，提示用户允许弹出窗口
  }
};

const fallbackCopyText = (text: string) => {
  const textarea = document.createElement("textarea");

  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";

  document.body.appendChild(textarea);
  textarea.select();

  const isCopied = document.execCommand("copy");

  document.body.removeChild(textarea);

  return isCopied;
};

export const copyText = async (text: string) => {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // 忽略并回退到兼容方案
  }

  return fallbackCopyText(text);
};

export const getArchitecture = () => {
  const userAgent = navigator.userAgent || navigator.platform;
  if (/x86_64|x64|amd64/i.test(userAgent)) {
    return "x86_64";
  } else if (/arm64|aarch64/i.test(userAgent)) {
    return "arm64";
  } else if (/loongarch64/i.test(userAgent)) {
    return "loongarch64";
  } else if (/loong64/i.test(userAgent)) {
    return "loong64";
  } else {
    return "unknown";
  }
};
