import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/views/Home.vue"),
      children: [
        {
          path: "",
          component: () => import("@/components/timeline/Timeline.vue"),
        },
        {
          path: "profile",
          component: () => import("@/components/profile/Profile.Vue"),
        },
        {
          path: "reply",
          component: () => import("@/components/reply/Reply.vue"),
        },
      ],
    },
    {
      path: "/login",
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/:notfound(.*)*",
      component: () => import("@/views/Notfound.vue"),
    },
  ],
});
