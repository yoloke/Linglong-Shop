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
        <div class="flx-align-center">
          <img :src="app.icon || defaultIcon" alt="App Icon" />

          <div class="flx-column">
            <span class="app-item-name">{{ app.zhName || app.name }}</span>
            <el-tooltip effect="light" placement="top">
              <template #content>
                <div style="max-width: 200px">{{ app.description }}</div>
              </template>
              <span class="app-item-description">
                {{ app.description }}
              </span>
            </el-tooltip>
          </div>
        </div>
        <div class="app-item-footer">
          <span>{{ app.categoryName }}</span>
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
import { installApp } from "@/api/modules/project";
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
      height: 140px !important;
      font-size: 14px;
      background-color: #fff;
      color: #808080;
      box-shadow: 0 2px 4px rgb(0 0 0 / 5%);

      img {
        margin-right: 12px;
        width: 60px;
      }

      .app-item-name {
        margin-bottom: 8px;
        max-width: 150px;
        font-size: 18px;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #383838;
        overflow: hidden;
      }

      .app-item-description {
        max-width: 150px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

      .app-item-footer {
        display: flex;
        margin-top: 10px;
        justify-content: space-between;
        align-items: end;
      }
    }
  }
}
</style>
