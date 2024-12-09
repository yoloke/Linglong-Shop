import { createI18n } from "vue-i18n";

// 导入语言资源
import zh from "@/locales/zh.json";
import en from "@/locales/en.json";

// 创建 i18n 实例
export const i18n = createI18n({
  locale: "zh",
  fallbackLocale: "zh",
  messages: {
    zh: zh,
    en: en
  }
});
