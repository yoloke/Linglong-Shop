<template>
  <div class="right-sidebar">
    <el-affix :offset="130">
      <div class="recommended">
        <div class="title-area">
          <div class="title">{{ $t("recommend.title") }}</div>
          <div class="action" @click="getApps">{{ $t("recommend.change") }}</div>
        </div>
        <div class="recommended-apps">
          <div class="recommended-app" v-for="(app, index) in recommendApps" :key="index">
            <img
              class="icon"
              v-if="app.icon"
              :src="app.icon"
              @error="event => formatSVG(event, app.icon, index)"
              alt="App Icon"
            />
            <defaultIcon class="icon" v-else />
            <div class="info">
              <div class="name" :title="app.name">{{ app.zhName }}</div>
              <div class="detail" :title="app.description">{{ app.description }}</div>
            </div>
            <div class="install" @click="onInstall(app)">{{ $t("recommend.install") }}</div>
          </div>
        </div>
      </div>
    </el-affix>
  </div>
</template>
<script setup lang="ts">
import { App, Recommend, ResultData } from "@/api/interface";
import { getRecommendApp, installApp, svgUrl2Base64 } from "@/api/modules/project";
import { ElNotification } from "element-plus";
import { ref, onMounted } from "vue";
import { i18n } from "@/utils/i18n";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const recommendApps = ref<Recommend[]>([]);
const getApps = async () => {
  getRecommendApp({ arch: "x86_64", repoName: "stable", lan: i18n.global.locale }).then((res: ResultData) => {
    recommendApps.value = res.data as Recommend[];
  });
};
onMounted(() => {
  getApps();
});

const onInstall = async (app: App) => {
  // 判断系统环境，不支持则返回
  const userAgent = navigator.userAgent || navigator.platform;
  if (!/Linux/i.test(userAgent)) {
    ElNotification({
      title: t("tips.title"),
      dangerouslyUseHTMLString: true,
      message: `
        <span>${t("tips.noSupport")}</span>
      `
    });
    return;
  }
  // 入参加入客户端ip
  let clientIp = sessionStorage.getItem("clientIp");
  app.clientIp = clientIp ? clientIp : "";
  // 温馨提示
  ElNotification({
    title: t("tips.title"),
    dangerouslyUseHTMLString: true,
    message: `
      <span>
        ${t("tips.noPopup")}
        <a href="https://linyaps.org.cn/guide/start/install.html" target="_blank" style="color: #409EFF; text-decoration: underline;">${t("tips.installLink")}</a>
      </span>
    `
  });
  // 调用自定义协议执行安装
  window.location.href = "og://" + app.appId;
  await installApp(app);
};

const formatSVG = async (event: Event, url: string | undefined, index: number) => {
  const target = event.target as HTMLImageElement;
  if (url) {
    try {
      const response = await svgUrl2Base64({ url: url });
      if (response.code == "200" && response.data) {
        // 检查base64图片是否能正常显示
        const img = new Image();
        img.src = response.data as unknown as string;
        img.onerror = () => {
          console.error("SVG转换失败:", response.data);
          recommendApps.value[index].icon = undefined;
        };
        img.onload = () => {
          target.src = response.data as unknown as string;
        };
        return;
      }
    } catch (error) {
      console.error("SVG转换失败:", error);
    }
  }
  recommendApps.value[index].icon = undefined;
};
</script>

<style scoped lang="scss">
.right-sidebar {
  height: 100%;
  width: 336px;
  .recommended {
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.05);
    background-color: #fff;
    border-radius: 8px;
    max-height: calc(100vh - 86px - 80px);
    display: flex;
    flex-direction: column;
    .title-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e5e5e5;
      .title {
        font-size: 16px;
        font-weight: 500;
        color: #000;
      }
      .action {
        font-size: 14px;
        color: #8f9a9d;
        cursor: pointer;
        &:hover {
          color: #1890ff;
        }
      }
    }
    .recommended-apps {
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
      // -ms-overflow-style: none;
      // scrollbar-width: none;
      .recommended-app {
        display: flex;
        padding: 24px;
        align-items: center;
        .icon {
          flex: 0 0 60px;
          width: 60px;
          height: 60px;
          border-radius: 8px;
          margin-right: 10px;
        }
        .info {
          flex-grow: 1;
          max-width: 134px;
          .name {
            font-size: 16px;
            font-weight: 400;
            color: #000;
            height: 24px;
            line-height: 24px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .detail {
            font-size: 12px;
            color: #808080;
            line-height: 18px;
            height: 36px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
        .install {
          flex: 0 0 60px;
          font-size: 14px;
          text-align: center;
          padding: 6px 0;
          color: #1890ff;
          cursor: pointer;
          background-color: #e6edf8;
          border-radius: 4px;
          margin-left: 24px;
          &:hover {
            background-color: #1890ff;
            color: #fff;
          }
        }
      }
    }
  }
  :deep(.el-affix--fixed) {
    top: 106px !important;
  }
}
</style>
