<template>
  <div class="right" v-infinite-scroll="load" :infinite-scroll-disabled="disabled" infinite-scroll-distance="10">
    <div class="header">
      <div class="header-category">
        <span class="category-name">
          {{ categoriesDict.get(selectedCategory?.categoryId || "") || $t("appSearchBar.all") }}
          <span v-show="searchQuery">({{ searchQuery }})</span>
        </span>
        <div class="architecture">
          <div
            :class="`architecture-item ${currentArch === 'x86_64' ? 'active' : ''}`"
            @click="() => emit('arch-change', 'x86_64')"
          >
            x86
          </div>
          <div
            :class="`architecture-item ${currentArch === 'arm64' ? 'active' : ''}`"
            @click="() => emit('arch-change', 'arm64')"
          >
            ARM
          </div>
          <div
            :class="`architecture-item ${currentArch === 'loong64' ? 'active' : ''}`"
            @click="() => emit('arch-change', 'loong64')"
          >
            Loong
          </div>
          <!-- <div
            :class="`architecture-item ${currentArch === 'loongarch64' ? 'active' : ''}`"
            @click="() => emit('arch-change', 'loongarch64')"
          >
            Loongarch
          </div> -->
        </div>
        <div class="total-count">
          <span class="text">{{ $t("appList.header.totalPre") }}</span>
          <span class="number">{{ total }}</span>
          <span class="text">{{ $t("appList.header.totalAft") }}</span>
        </div>
      </div>
      <div class="header-sort">
        <div class="sort">
          <div
            :class="`hottest ${currentSort === 'installCount' ? 'active' : ''}`"
            @click="() => emit('sort-change', 'installCount')"
          >
            <span class="dot"></span>
            <span class="text">{{ $t("appList.header.sort.hot") }}</span>
          </div>
          <div :class="`newest ${currentSort === 'createTime' ? 'active' : ''}`" @click="() => emit('sort-change', 'createTime')">
            <span class="dot"></span>
            <span class="text">{{ $t("appList.header.sort.new") }}</span>
          </div>
        </div>
        <div class="hide" v-if="currentFilter === '1'" @click="() => emit('filter-change', '0')">
          <Checked class="checked" />
          <span class="text">{{ $t("appList.header.filter") }}</span>
        </div>
        <div class="hide" v-else @click="() => emit('filter-change', '1')">
          <Unchecked class="checked" />
          <span class="text">{{ $t("appList.header.filter") }}</span>
        </div>
      </div>
    </div>
    <div class="app-list">
      <div
        v-for="(app, index) in appList"
        :key="app.appId"
        class="app-item"
        role="link"
        tabindex="0"
        @click="handleOpenDetail(app)"
        @keydown.enter="handleOpenDetail(app)"
        @keydown.space.prevent="handleOpenDetail(app)"
      >
        <div class="app-item-main">
          <img v-if="app.icon" :src="app.icon" @error="() => handleIconError(app.icon, index)" alt="App Icon" />
          <DefaultIcon class="defaultIcon" v-else />
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
          <el-button class="button" type="primary" plain size="small" @click.stop="onInstall(app)">{{
            $t("appList.app.install")
          }}</el-button>
        </div>
      </div>
    </div>
    <p v-loading="loading" element-loading-text></p>
    <p v-if="noMore">{{ $t("appList.noMore") }}</p>
  </div>
</template>
<script setup lang="ts">
import { App, Category } from "@/api/interface/index";
import DefaultIcon from "@/assets/images/default.svg?component";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { buildAppDetailLocation, installLinglongApp, resolveSvgIconDataUrl } from "@/utils/app";
const { t } = useI18n();
const router = useRouter();
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
  currentSort: string | undefined;
  currentArch: string;
  currentFilter: string;
}>();
const emit = defineEmits<{
  (event: "sort-change", value: string): void;
  (event: "filter-change", value: string): void;
  (event: "arch-change", value: string): void;
}>();

const appList = ref<App[]>([]);
watch(
  () => props.apps,
  newApps => {
    appList.value = newApps;
  },
  { immediate: true, deep: true }
);

// 图标
import Checked from "@/assets/icons/checked.svg?component";
import Unchecked from "@/assets/icons/unchecked.svg?component";

const onInstall = async (app: App) => {
  await installLinglongApp(app, t);
};

const handleOpenDetail = (app: App) => {
  router.push(buildAppDetailLocation(app.appId, props.currentArch));
};

const updateIconByIndex = (index: number, icon?: string) => {
  appList.value = appList.value.map((item, itemIndex) => {
    if (itemIndex !== index) {
      return item;
    }

    return {
      ...item,
      icon
    };
  });
};

const handleIconError = async (url: string | undefined, index: number) => {
  const fallbackIcon = await resolveSvgIconDataUrl(url);
  updateIconByIndex(index, fallbackIcon);
};
</script>
<style scoped lang="scss">
.right {
  flex: 1;
  margin-bottom: 60px;

  .header {
    position: sticky;
    top: 86px;
    background-color: #fafafa;
    z-index: 10;
    margin-bottom: 12px;
    display: flex;
    align-items: flex-end;
    padding: 24px 2px 12px 2px;

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
            transition: all 0.3s ease;
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
      cursor: pointer;
      // box-shadow: 0 2px 4px rgb(0 0 0 / 5%);
      border: 1px solid #fff;
      transition:
        transform 0.2s ease,
        border-color 0.2s ease,
        box-shadow 0.2s ease;

      &:focus-visible {
        outline: 2px solid #1890ff;
        outline-offset: 2px;
      }

      &:hover {
        border: 1px solid #1890ff;
        transform: translateY(-2px);
        box-shadow: 0 12px 24px rgb(24 144 255 / 10%);
      }

      .app-item-main {
        display: flex;
        height: 70px;
        align-items: start;

        img,
        .defaultIcon {
          margin-right: 12px;
          width: 60px;
          height: 60px;
          flex: 0 0 60px;
          border-radius: 8px;
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
