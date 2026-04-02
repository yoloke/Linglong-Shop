<template>
  <div class="home-header">
    <div class="header-container">
      <div class="news">
        <div v-if="loading" class="loading-placeholder">
          <div class="news-content">{{ t("common.loading") || "加载中..." }}</div>
        </div>
        <div v-else-if="newsList.length === 0" class="empty-placeholder"></div>
        <div v-else v-for="(item, index) in newsList" :key="index" :class="`new ${currentIndex === index ? 'active' : ''}`">
          <div class="news-content">{{ item.content }}</div>
          <div class="news-action" @click="item.action.func()">{{ item.action.text }}</div>
        </div>
      </div>
      <div class="dots" v-if="!loading && newsList.length > 1">
        <div
          v-for="(_, index) in newsList"
          :key="index"
          :class="`dot ${currentIndex === index ? 'active' : ''}`"
          @click="changeNews(index)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import onInstall from "@/utils/downloadClient";
import { getNewsList } from "@/api/modules/project";
import type { News } from "@/api/interface";

const { t, locale } = useI18n();

// ########## 通知内容 ########## //
interface NewsItem {
  content: string;
  action: {
    text: string;
    func: () => void;
  };
}

const newsList = ref<NewsItem[]>([]);
const loading = ref(true);
const currentIndex = ref(0);
const interval = ref<NodeJS.Timeout | null>(null);

// 根据 actionType 和 actionUrl 生成操作函数
const createActionFunction = (actionType: string, actionUrl?: string) => {
  console.log("actionType", actionType);
  console.log("actionUrl", actionUrl);
  switch (actionType) {
    case "link":
      return () => {
        if (actionUrl) {
          window.open(actionUrl, "_blank");
        }
      };
    case "external":
      if (actionUrl === "onInstall") {
        return onInstall;
      }
      return () => undefined;
    default:
      return () => {
        if (actionUrl) {
          window.open(actionUrl, "_blank");
        }
      };
  }
};

// 获取新闻列表
const fetchNewsList = async () => {
  try {
    loading.value = true;
    // 获取当前语言，如果没有则默认为中文
    const currentLang = locale.value || "zh";
    const response = await getNewsList(currentLang);
    console.log("获取新闻列表 fetchNewsList response", response);
    let data: News[] = response.data as News[];

    if (response && Array.isArray(data)) {
      // 将后端数据转换为组件需要的格式
      newsList.value = data.map((news: News) => ({
        content: news.content,
        action: {
          text: news.actionText,
          func: createActionFunction(news.actionType, news.actionUrl)
        }
      }));
    } else {
      // 如果 API 返回为空或错误，使用默认的硬编码数据作为回退
      newsList.value = [
        {
          content: t("news.first.content"),
          action: {
            text: t("news.first.action"),
            func: () => {
              window.open("https://linyaps.org.cn/guide/lessons/basic-notes.html", "_blank");
            }
          }
        },
        {
          content: t("news.second.content"),
          action: {
            text: t("news.second.action"),
            func: onInstall
          }
        }
      ];
    }
  } catch (error) {
    console.error("获取新闻列表失败:", error);
    // 发生错误时使用默认的硬编码数据
    newsList.value = [
      {
        content: t("news.first.content"),
        action: {
          text: t("news.first.action"),
          func: () => {
            window.open("https://linyaps.org.cn/guide/lessons/basic-notes.html", "_blank");
          }
        }
      },
      {
        content: t("news.second.content"),
        action: {
          text: t("news.second.action"),
          func: onInstall
        }
      }
    ];
  } finally {
    loading.value = false;
  }
};
const changeNews = (index: number) => {
  currentIndex.value = index;
  if (interval.value) clearInterval(interval.value); // 清除定时器
  startNewsRotation(); // 重新开始轮播
};

// 开始新闻轮播
const startNewsRotation = () => {
  if (newsList.value.length > 1) {
    interval.value = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % newsList.value.length;
    }, 8000); // 每8秒切换一次
  }
};

onMounted(async () => {
  await fetchNewsList(); // 获取新闻数据
  startNewsRotation(); // 开始轮播
});

onUnmounted(() => {
  if (interval.value) clearInterval(interval.value); // 清除定时器
});
</script>

<style scoped lang="scss">
.home-header {
  margin-top: 86px;
  height: 65px;
  background-color: #fff;
  font-size: 14px;
  display: flex;
  align-items: center;
  width: 100%;

  .header-container {
    margin: 0 auto;
    min-width: 888px;
    display: flex;

    .news {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;

      .new,
      .loading-placeholder,
      .empty-placeholder {
        position: absolute;
        display: flex;
        justify-content: center;
        gap: 12px;
        opacity: 0;
        transition: all 1s ease;
        z-index: 0;
        width: 100%;

        &.active {
          opacity: 1;
          z-index: 1;
        }
      }

      .loading-placeholder,
      .empty-placeholder {
        opacity: 1;
        z-index: 1;
      }

      .loading-placeholder .news-content {
        color: #999;
      }

      .empty-placeholder .news-content {
        color: #666;
      }

      .news-content {
        color: #000;
      }

      .news-action {
        color: #1890ff;
        cursor: pointer;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .dots {
      flex: 0 0 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;

      .dot {
        cursor: pointer;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #efefef;
        transition: all 1s ease;

        &.active {
          background-color: #1890ff;
        }
      }
    }
  }
}
</style>
