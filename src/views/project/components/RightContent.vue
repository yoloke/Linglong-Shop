<template>
  <div class="right" v-infinite-scroll="load" :infinite-scroll-disabled="disabled" infinite-scroll-distance="10">
    <div class="header">
      <div class="header-category">
        <span class="category-name">
          {{ categoriesDict.get(selectedCategory?.categoryId || "") || $t("appSearchBar.all") }}
          <span v-show="searchQuery">({{ searchQuery }})</span>
        </span>
        <div class="architecture">
          <div class="architecture-item active">x86</div>
          <div class="architecture-item">ARM</div>
        </div>
        <div class="total-count">
          <span class="text">共</span>
          <span class="number">{{ total }}</span>
          <span class="text">款应用</span>
        </div>
      </div>
      <div class="header-sort">
        <div class="sort">
          <div class="hottest active">
            <span class="dot"></span>
            <span class="text">按下载排序</span>
          </div>
          <div class="newest">
            <span class="dot"></span>
            <span class="text">按最新排序</span>
          </div>
        </div>
        <div class="hide">
          <Checked class="checked" v-if="true" />
          <Unchecked class="checked" v-else />
          <span class="text">过滤低分应用</span>
        </div>
        <!-- <span class="sort-title">{{ $t("appList.header.sortMethod") }}：</span>
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
        </div> -->
      </div>
    </div>
    <div class="app-list">
      <div v-for="app in apps" :key="app.appId" class="app-item">
        <div class="app-item-main">
          <img :src="app.icon || defaultIcon" @error="event => formatSVG(event, app.icon)" alt="App Icon" />
          <div class="app-item-text">
            <div class="app-item-title">
              <el-text class="app-item-name" truncated :title="app.zhName || app.name">{{ app.zhName || app.name }}</el-text>
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
          <el-button class="button" type="primary" plain size="small" @click="onInstall(app)">{{ $t("appList.app.install") }}</el-button>
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

// 图标
import Checked from "@/assets/icons/checked.svg?component";
import Unchecked from "@/assets/icons/unchecked.svg?component";

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
        <a href="https://linyaps.org.cn/guide/start/install.html" target="_blank" style="color: #409EFF; text-decoration: underline;">${t("tips.installLink")}</a>
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
    align-items: flex-end;
    padding: 0 2px;

    .header-category {
      display: flex;
      align-items: flex-end;
      gap: 8px;
      margin-right: auto;
      .category-name {
        font-size: 18px;
        font-weight: 500;
        line-height: 18px;
        height: 18px;
      }

      .architecture {
        height: 18px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        line-height: 12px;
        color: #000;

        .architecture-item {
          padding: 3px 6px;
          border-radius: 4px;
          background-color: #ececec;
          cursor: pointer;
          &.active {
            background-color: #1890ff;
            color: #fff;
          }

          &:hover {
            background-color: #1890ff;
            color: #fff;
          }
        }
      }

      .total-count {
        margin-left: 4px;
        margin-bottom: 1px;
        font-size: 14px;
        color: #383838;
        .number {
          color: #1890ff;
          margin: 0 4px;
        }
      }
    }

    .header-sort {
      position: relative;
      font-size: 12px;
      color: #636363;
      display: flex;
      align-items: center;
      gap: 48px;
      .sort {
        display: flex;
        align-items: center;
        gap: 16px;
        .hottest,
        .newest {
          display: flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          &.active {
            .dot {
              opacity: 1;
            }
            .text {
              color: #383838;
            }
          }
          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            opacity: 0;
            transition: all 1s ease;
            background-color: #1890ff;
          }
          .text {
            font-size: 14px;
            color: #8f9a9d;
            line-height: 18px;
          }
        }
      }
      .hide {
        display: flex;
        align-items: center;
        gap: 2px;
        cursor: pointer;
        .icon {
          width: 18px;
          height: 18px;
        }
        .text {
          font-size: 14px;
          color: #383838;
          line-height: 18px;
        }
      }
    }
  }

  .app-list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 16px;
    margin: 24px 0;

    .app-item {
      border-radius: 8px;
      padding: 16px;
      height: 136px !important;
      font-size: 14px;
      background-color: #fff;
      color: #808080;
      // box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
      border: 1px solid #fff;
      &:hover {
        border: 1px solid #1890ff;
      }

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
              color: #9a9898;
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
          color: #808080;
          line-height: 18px;
        }
        .button {
          border: #1890ff 1px solid;
          border-radius: 4px;
          padding: 4px 16px;
          background-color: transparent;
          &:hover {
            background-color: #1890ff;
            color: #fff;
          }
          span {
            font-size: 12px;
          }
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
