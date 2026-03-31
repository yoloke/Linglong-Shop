const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("@/views/project/index.vue")
  },
  {
    path: "/apps/:appId",
    name: "app-detail",
    component: () => import("@/views/appDetail/index.vue")
  },
  {
    path: "/:pathMatch(.*)*", // 自定义正则表达式以匹配所有路径
    redirect: "/" // 或者重定向到其他页面，例如首页 "/"
  }
];

export default routes;
