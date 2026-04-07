<template>
  <div class="right-sidebar">
    <div class="recommended">
      <div class="title-area">
        <div class="title">{{ $t("recommend.title") }}</div>
        <div class="action" @click="getApps">{{ $t("recommend.change") }}</div>
      </div>
      <div class="recommended-apps">
        <div
          class="recommended-app"
          v-for="(app, index) in recommendApps"
          :key="index"
          role="link"
          tabindex="0"
          @click="handleOpenDetail(app)"
          @keydown.enter="handleOpenDetail(app)"
          @keydown.space.prevent="handleOpenDetail(app)"
        >
          <img class="icon" v-if="app.icon" :src="app.icon" @error="() => handleIconError(app.icon, index)" alt="App Icon" />
          <DefaultIcon class="icon" v-else />
          <div class="info">
            <div class="name" :title="app.name">{{ app.zhName }}</div>
            <div class="detail" :title="app.description">{{ app.description }}</div>
          </div>
          <div class="install" @click.stop="onInstall(app)">{{ $t("recommend.install") }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { App, Recommend, ResultData } from "@/api/interface";
import { getRecommendApp } from "@/api/modules/project";
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { buildAppDetailLocation, getPreferredAppArch, installLinglongApp, resolveSvgIconDataUrl } from "@/utils/app";
import DefaultIcon from "@/assets/images/default.svg?component";
const props = defineProps<{
  currentArch?: string;
}>();

const { t, locale } = useI18n();
const router = useRouter();

const recommendApps = ref<Recommend[]>([]);
const resolvedCurrentArch = computed(() => getPreferredAppArch(props.currentArch || localStorage.getItem("currentArch") || undefined));

const getApps = async () => {
  getRecommendApp({ arch: resolvedCurrentArch.value, repoName: "stable", lan: locale.value }).then((res: ResultData) => {
    recommendApps.value = res.data as Recommend[];
  });
};

watch([resolvedCurrentArch, locale], () => {
  getApps();
}, { immediate: true });

const onInstall = async (app: App) => {
  await installLinglongApp(app, t);
};

const handleOpenDetail = (app: App) => {
  router.push(buildAppDetailLocation(app.appId, app.arch || resolvedCurrentArch.value));
};

const updateRecommendIcon = (index: number, icon?: string) => {
  recommendApps.value = recommendApps.value.map((item, itemIndex) => {
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
  updateRecommendIcon(index, fallbackIcon);
};
</script>

<style scoped lang="scss">
.right-sidebar {
  position: sticky;
  top: 106px;
  align-self: flex-start;
  flex: 0 0 336px;
  width: 336px;

  .recommended {
    display: flex;
    flex-direction: column;
    border-radius: 8px;
    max-height: calc(100vh - 86px - 80px);
    background-color: #fff;
    box-shadow: 0 2px 4px rgb(0 0 0 / 5%);

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
        align-items: center;
        padding: 24px;
        cursor: pointer;
        transition:
          background-color 0.2s ease,
          transform 0.2s ease;

        &:focus-visible {
          outline: 2px solid #1890ff;
          outline-offset: -2px;
        }

        &:hover {
          transform: translateY(-1px);
          background-color: #f7fbff;
        }

        .icon {
          flex: 0 0 60px;
          margin-right: 10px;
          border-radius: 8px;
          width: 60px;
          height: 60px;
        }

        .info {
          flex-grow: 1;
          max-width: 134px;

          .name {
            height: 24px;
            font-size: 16px;
            font-weight: 400;
            line-height: 24px;
            text-overflow: ellipsis;
            white-space: nowrap;
            color: #000;
            overflow: hidden;
          }

          .detail {
            display: -webkit-box;
            height: 36px;
            font-size: 12px;
            line-height: 18px;
            text-overflow: ellipsis;
            color: #808080;
            overflow: hidden;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }

        .install {
          flex: 0 0 60px;
          margin-left: 24px;
          border-radius: 4px;
          padding: 6px 0;
          font-size: 14px;
          text-align: center;
          background-color: #e6edf8;
          color: #1890ff;
          cursor: pointer;

          &:hover {
            background-color: #1890ff;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
