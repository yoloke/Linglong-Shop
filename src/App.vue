<template>
  <el-config-provider>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { i18n } from "@/utils/i18n";

onMounted(() => {
  // 获取本地存储的语言设置
  let lang = localStorage.getItem("language");

  // 如果没有语言设置,获取浏览器语言
  if (!lang) {
    lang = navigator.language;
    // 只保留主语言代码
    lang = lang.split("-")[0];
    // 如果浏览器语言不是中文或英文，则设置为中文
    if (lang !== "zh" && lang !== "en") {
      lang = "zh";
    }
    // 写入本地存储
    localStorage.setItem("language", lang);
  }
  i18n.global.locale = lang as "zh" | "en";
});
</script>
