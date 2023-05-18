import { createRouter, createWebHistory } from "vue-router";

// 路由对应的视图文件动态加载，单独分离
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("@/page/HomeView.vue"),
    },
    {
      path: "/list",
      name: "list-page",
      component: () => import("@/page/ListView.vue"),
    },
  ],
});

export default router;
