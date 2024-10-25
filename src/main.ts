import { createApp } from "vue";
//引入模板的全局的样式
import "@/assets/styles/index.scss";
// pinia store
import pinia from "@/stores";
// vue Router
import router from "@/routers/index";
// element css
import "element-plus/dist/index.css";
// element dark css
import "element-plus/theme-chalk/dark/css-vars.css";
// svg icons
import "virtual:svg-icons-register";
// element plus
import ElementPlus from "element-plus";
// element icons
import * as Icons from "@element-plus/icons-vue";
// custom element css
import "@/assets/styles/element.scss";
// font css
import "@/assets/fonts/font.scss";

import "amfe-flexible";
import "@/utils/rem";

import App from "./App.vue";

const app = createApp(App);

// register the element Icons component
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key as keyof typeof Icons]);
});
app.use(ElementPlus).use(router).use(pinia).mount("#app");
