import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

const router = createRouter({
  history: createWebHistory(), //可传参数，配置base路径，例如'/app'
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 如果有保存的位置（浏览器前进/后退），使用保存的位置
    if (savedPosition) {
      return savedPosition;
    }
    // 否则滚动到顶部
    return { top: 0 };
  }
});

export default router;
