<template>
  <div class="right" v-infinite-scroll="load" :infinite-scroll-disabled="disabled" infinite-scroll-distance="10">
    <div class="header">
      <div class="header-category">
        <span class="category-name">
          {{ categoriesDict.get(selectedCategory?.categoryId || "") || $t("appSearchBar.all") }}
          <span v-show="searchQuery">({{ searchQuery }})</span>
        </span>
        <span class="total-count">{{ $t("appList.header.total", { total: total }) }}</span>
      </div>
      <div class="header-sort">
        <span class="sort-title">{{ $t("appList.header.sortMethod") }}：</span>
        <el-select
          :model-value="currentSort"
          size="small"
          popper-class="sort-select-options"
          class="sort-select-hidden"
          placement="bottom-end"
          @change="
            (value: string) => {
              emit('sort-change', value);
            }
          "
          @visible-change="
            (value: boolean) => {
              sortOptionsShow = value;
            }
          "
        >
          <el-option v-for="item in sortOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <div class="sort-select">
          <div class="sort-select-input">{{ sortLabel }}</div>
          <div :class="`sort-select-arrow arrow-down ${sortOptionsShow ? '' : 'arrow-show'}`"></div>
        </div>
      </div>
    </div>
    <div class="app-list">
      <div v-for="app in apps" :key="app.appId" class="app-item">
        <div class="app-item-main">
          <img :src="app.icon || defaultIcon" @error="event => formatSVG(event, app.icon)" alt="App Icon" />
          <div class="app-item-text">
            <div class="app-item-title">
              <el-text class="app-item-name" truncated>{{ app.zhName || app.name }}</el-text>
              <div class="app-item-category">
                {{ categoriesDict.get(app.categoryId || "") }}
              </div>
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
          <el-button type="primary" plain size="small" @click="onInstall(app)">{{ $t("appList.app.install") }}</el-button>
        </div>
      </div>
    </div>
    <p v-loading="loading" element-loading-text></p>
    <p v-if="noMore">{{ $t("appList.noMore") }}</p>
  </div>
</template>
<script setup lang="ts">
import { App, Category } from "@/api/interface/index";
import defaultIcon from "@/assets/images/default.svg";
import { installApp, svgUrl2Base64 } from "@/api/modules/project";
import { ElNotification } from "element-plus";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
const props = defineProps<{
  apps: App[];
  categoriesDict: Map<string, string>;
  selectedCategory: Category;
  total: number;
  load: () => void;
  disabled: boolean;
  noMore: boolean;
  loading: boolean;
  searchQuery: string;
  currentSort: string;
}>();
const emit = defineEmits<{
  (event: "sort-change", value: string): void;
}>();

const onInstall = async (app: App) => {
  // 判断系统环境，不支持则返回
  const userAgent = navigator.userAgent || navigator.platform;
  if (!/Linux/i.test(userAgent)) {
    ElNotification({
      title: "温馨提示",
      dangerouslyUseHTMLString: true,
      message: `
        <span>当前系统环境不支持玲珑安装</span>
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
        <a href="https://linglong.dev/guide/start/install.html" target="_blank" style="color: #409EFF; text-decoration: underline;">${t("tips.installLink")}</a>
      </span>
    `
  });
  // 调用自定义协议执行安装
  window.location.href = "og://" + app.appId;
  await installApp(app);
  // const { code } = await installApp(app);
  // console.log(code);
};

const formatSVG = async (event: Event, url: string | undefined) => {
  const target = event.target as HTMLImageElement;
  if (target.src === defaultIcon) return;
  if (url) {
    try {
      const response = await svgUrl2Base64({ url: url });
      if (response.code == "200" && response.data) {
        // 检查base64图片是否能正常显示
        const img = new Image();
        img.src = response.data as unknown as string;
        img.onerror = () => {
          target.src = defaultIcon;
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
  // 所有情况失败时使用默认图标
  target.src = defaultIcon;
};

const sortOptionsShow = ref(false);
const sortOptions = computed(() => [
  { label: t("appList.header.sort.new"), value: "createTime" },
  { label: t("appList.header.sort.hot"), value: "installCount" }
]);
const sortLabel = computed(() => sortOptions.value.find(item => item.value === props.currentSort)?.label);
</script>
<style scoped lang="scss">
.right {
  flex: 1;
  margin-bottom: 60px;

  .header {
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding: 0 2px;

    .header-category {
      .category-name {
        font-size: 18px;
      }

      .total-count {
        font-size: 14px;
        color: #7a7a7a;
        margin-left: 4px;
      }
    }

    .header-sort {
      position: relative;
      font-size: 12px;
      color: #636363;
      display: flex;
      align-items: center;

      .sort-select-hidden {
        z-index: 999;
        position: absolute;
        right: 0;
        width: 64px;
        opacity: 0;
      }

      .sort-select {
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;

        .sort-select-input {
          text-align: right;
          width: 50px;
          margin-right: 12px;
        }

        .sort-select-arrow {
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 6px solid #a6a6a6;
          position: absolute;
          right: 0;
          transition: transform 0.3s;
          transform: rotate(0deg);

          &.arrow-show {
            transform: rotate(180deg);
          }
        }
      }
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
      height: 136px !important;
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
.sort-select-options {
  .el-select-dropdown__item {
    font-size: 12px;
    line-height: 28px;
    height: 28px;
  }
}
</style>
