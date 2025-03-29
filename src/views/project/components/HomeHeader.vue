<template>
  <div class="home-header">
    <div class="header-container">
      <div class="news">
        <div v-for="(item, index) in newsList" :key="item.content" :class="`new ${currentIndex === index ? 'active' : ''}`">
          <div class="news-content">{{ item.content }}</div>
          <div class="news-action" @click="item.action.func()">{{ item.action.text }}</div>
        </div>
      </div>
      <div class="dots">
        <div
          v-for="(_, index) in new Array(newsList.length)"
          :key="index"
          :class="`dot ${currentIndex === index ? 'active' : ''}`"
          @click="changeNews(index)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { ref } from "vue";
import onInstall from "@/utils/downloadClient";
// ########## 通知内容 ########## //
const newsList = [
  {
    content: "加入 Telegram Group: deepin.org/to/tg 了解更多资讯",
    action: {
      text: "点击了解",
      func: () => {
        window.open("https://deepin.org/to/tg", "_blank");
      }
    }
  },
  {
    content: "下载客户端，探索应用新世界",
    action: {
      text: "我要下载",
      func: onInstall
    }
  }
];
const currentIndex = ref(0);
const interval = ref<NodeJS.Timeout | null>(null);
const changeNews = (index: number) => {
  currentIndex.value = index;
  if (interval.value) clearInterval(interval.value); // 清除定时器
  interval.value = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % newsList.length;
  }, 8000); // 每8秒切换一次
};
onMounted(() => {
  interval.value = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % newsList.length;
  }, 8000); // 每8秒切换一次
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
      .new {
        position: absolute;
        display: flex;
        justify-content: center;
        gap: 12px;
        opacity: 0;
        transition: all 1s ease;
        &.active {
          opacity: 1;
        }
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
