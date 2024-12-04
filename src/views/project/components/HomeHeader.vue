<template>
  <div class="home-header flx-column">
    <span class="title">
      <span class="app">{{ $t("title.app") }}</span>
      <span class="store">{{ $t("title.store") }}</span>
      <span class="download" @click="onInstall()">
        {{ $t("title.client") }} <el-icon class="icon"><Download /></el-icon>
      </span>
    </span>
    <span class="content">{{ $t("title.subtitle") }}</span>
  </div>
</template>

<script setup lang="ts">
import { Download } from "@element-plus/icons-vue";
import { installdd } from "@/api/modules/project";
const getArchitecture = () => {
  const userAgent = navigator.userAgent || navigator.platform;

  if (/x86_64|x64|amd64/i.test(userAgent)) {
    return "x86_64";
  } else if (/arm64|aarch64/i.test(userAgent)) {
    return "arm64";
  } else if (/loongarch64/i.test(userAgent)) {
    return "loongarch64";
  } else {
    return "unknown";
  }
};
const architecture = getArchitecture();
console.log(`System architecture: ${architecture}`);
const onInstall = async () => {
  try {
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
</script>

<style scoped lang="scss">
.home-header {
  padding-left: var(--container-margin);
  height: 201px;
  background-image: url("@/assets/images/header_bg.svg");
  background-size: cover;
  background-position: right center;
  background-repeat: no-repeat;

  .title {
    margin-top: 100px;
    margin-bottom: 10px;
    font-size: 38px;
    font-weight: 700;

    .app {
      color: #1890ff;
    }

    .store {
      margin-right: 8px;
    }

    .download {
      font-size: 12px;
      font-weight: 600;
      color: #1890ff;
      cursor: pointer;
    }
  }

  .content {
    font-size: 12px;
    font-weight: 400;
    color: #7a7a7a;
  }
}
</style>
