<template>
  <div :class="['header-container', 'flx-justify-between flx-align-center', { scrolled: isScrolled }]">
    <img src="@/assets/images/logo.svg" alt="logo" />
    <span class="menu-list">
      <a @click="openUrl('https://www.linglong.space/')">{{ $t("header.website") }}</a>
      <a @click="openUrl('https://github.com/OpenAtom-Linyaps/sig-linyaps-packing-sig')">{{ $t("header.delivery") }}</a>
      <el-dropdown>
        <span class="el-dropdown-link">
          <img class="language-icon" :src="languageIcon" alt="language" />
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="changeLanguage('zh')">中文</el-dropdown-item>
            <el-dropdown-item @click="changeLanguage('en')">English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </span>
  </div>
</template>
<script setup lang="ts">
import languageIcon from "@/assets/icons/language.svg";
import { i18n } from "@/utils/i18n";
import { ref, onMounted, onUnmounted } from "vue";

const isScrolled = ref(false);

// 处理滚动事件
const handleScroll = () => {
  isScrolled.value = window.scrollY > 66; // 设置滚动阈值
};

// 组件挂载时添加事件监听器
onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

// 组件卸载时移除事件监听器
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});

// 使用新标签页打开链接
const openUrl = (url: string) => {
  window.open(url, "_blank");
};

const changeLanguage = (lang: "zh" | "en") => {
  if (i18n.global.locale === lang) return;
  i18n.global.locale = lang;
  localStorage.setItem("language", lang);
  // location.reload();
};
</script>
<style scoped lang="scss">
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  padding: 0 var(--container-margin);
  width: 100%;
  height: 66px;
  opacity: 1;
  box-sizing: border-box;
  background: rgb(255 255 255 / 43%);
  z-index: 100;
  .menu-list {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    a {
      cursor: pointer;
      transition: color 0.2s;
      &:hover {
        color: #409eff;
      }
    }
    .language-icon {
      width: 16px;
      height: 16px;
    }
  }

  &.scrolled {
    background-color: #fff; /* 滚动后背景色变为白色 */
    box-shadow: 0 2.33px 4.67px rgb(0 0 0 / 5%);
  }

  img {
    width: 120px;
  }
}
</style>
