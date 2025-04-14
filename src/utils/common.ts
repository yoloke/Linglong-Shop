export const openUrl = (url: string) => {
  const newWindow = window.open(url, "_blank");
  if (newWindow) {
    newWindow.opener = null; // 防止新打开的标签页访问原始页面
  } else {
    console.error("打开新页面失败"); // 如果打开失败，提示用户允许弹出窗口
  }
};
