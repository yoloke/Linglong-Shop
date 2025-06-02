import { installdd } from "@/api/modules/project";
import { getArchitecture } from "@/utils/common";

const architecture = getArchitecture();

const onInstall = async () => {
  try {
    console.log("开始下载客户端，当前架构：", architecture);
    // 请求接口，获取后端返回的数据对象（包含下载链接）
    const response = await installdd(architecture);

    // 获取后端返回的文件下载 URL
    const downloadUrl = response.data; // 从 response 中获取 data 字段中的 URL

    // 创建一个隐藏的链接，指向文件下载 URL
    const link = document.createElement("a");
    link.href = downloadUrl as string; // 指向后端返回的文件下载链接

    // 设置 download 属性为空，浏览器会从 URL 中提取文件名
    link.setAttribute("download", "");

    // 将链接追加到 DOM 中并触发点击下载
    document.body.appendChild(link);
    link.click();

    // 下载完成后移除链接
    document.body.removeChild(link);
  } catch (error) {
    console.error("下载失败：", error);
  }
};

export default onInstall;
