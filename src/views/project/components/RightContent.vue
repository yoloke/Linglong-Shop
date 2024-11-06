<template>
  <div class="right" v-infinite-scroll="load" :infinite-scroll-disabled="disabled" infinite-scroll-distance="10">
    <div class="header">
      <span class="category-name">
        {{ selectedCategory?.categoryName || "全部分类" }}
        <span v-show="searchQuery">({{ searchQuery }})</span>
      </span>
      <span class="total-count"> 共 {{ total }} 款应用</span>
    </div>
    <div class="app-list">
      <div v-for="app in apps" :key="app.appId" class="app-item">
        <div class="app-item-main">
          <img :src="app.icon || defaultIcon" @error="(event) => formatSVG(event, app.icon)" alt="App Icon" />
          <div class="app-item-text">
            <div class="app-item-title">
              <el-text class="app-item-name" truncated>{{ app.zhName || app.name }}</el-text>
              <div class="app-item-category">{{ app.categoryName }}</div>
            </div>
            <el-tooltip effect="light" placement="top">
              <template #content>
                <div style="max-width: 200px">{{ app.description }}</div>
              </template>
              <el-text class="app-item-description" line-clamp="2">
                {{ app.description }}
              </el-text>
            </el-tooltip>
          </div>
        </div>
        <div class="app-item-footer">
          <span class="app-item-version">v{{ app.version }}</span>
          <el-button type="primary" plain size="mini" @click="onInstall(app)">安装</el-button>
        </div>
      </div>
    </div>
    <p v-loading="loading" element-loading-text></p>
    <p v-if="noMore">暂无更多数据</p>
  </div>
</template>
<script setup lang="ts">
import { App, Category } from "@/api/interface/index";
import defaultIcon from "@/assets/images/default.svg";
import { installApp, svgUrl2Base64 } from "@/api/modules/project";
import { ElNotification } from "element-plus";
defineProps<{
  apps: App[];
  selectedCategory: Category;
  total: number;
  load: () => void;
  disabled: boolean;
  noMore: boolean;
  loading: boolean;
  searchQuery: string;
}>();
const onInstall = async (app: App) => {
  window.location.href = "og://" + app.appId;
  // 显示通知
  ElNotification({
    title: "温馨提示",
    dangerouslyUseHTMLString: true,
    message: `
    <span>
      如果无弹出“玲珑安装程序”对话框，您必须先安装玲珑:
      <a href="https://linglong.dev/guide/start/install.html" target="_blank" style="color: #409EFF; text-decoration: underline;">点击此处安装玲珑环境</a>
    </span>
  `
  });
  const { code } = await installApp(app);
  console.log(code);
};

const formatSVG = async (event: Event, url: string | undefined) => {
  if (url) {
    const response = await svgUrl2Base64({url: url});
    if (response.code == "200" && response.data) {
      // 设置 src 为 Base64 数据图片
      const target = event.target as HTMLImageElement; // 强制类型转换为 HTMLImageElement
      if (target) {
        target.src = response.data as unknown as string; // 设置为 Base64 数据
        return;
      }
    }
  }
  const target = event.target as HTMLImageElement; // 强制类型转换为 HTMLImageElement
  if (target) {
    target.src = defaultIcon;
  }
}
</script>
<style scoped lang="scss">
.right {
  flex: 1;
  margin-bottom: 60px;
  .header {
    margin-bottom: 12px;

    .category-name {
      font-size: 18px;
    }

    .total-count {
      font-size: 14px;
      color: #7a7a7a;
    }
  }

  .app-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
    margin-bottom: 20px;

    .app-item {
      border-radius: 8px;
      padding: 16px;
      height: 150px !important;
      font-size: 14px;
      background-color: #fff;
      color: #808080;
      box-shadow: 0 2px 4px rgb(0 0 0 / 5%);

      .app-item-main {
        display: flex;
        height: 70px;
        align-items: start;

        img {
          margin-right: 12px;
          width: 60px;
          height: 60px;
          flex: 0 0 60px;
        }

        .app-item-text {
          flex: 1;
          max-width: calc(100% - 72px);

          .app-item-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;

            .app-item-name {
              flex: 1;
              font-size: 18px;
              line-height: 24px;
              color: #383838;
            }

            .app-item-category {
              text-align: right;
              flex: 0 0 80px;
              font-size: 12px;
              color: #575757;
            }
          }

          .app-item-description {
            line-height: 18px;
            font-size: 12px;
            color: #808080;
          }
        }
      }

      .app-item-footer {
        display: flex;
        margin-top: 10px;
        justify-content: space-between;
        align-items: end;
        .app-item-version {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
