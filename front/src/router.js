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
          path: "profil",
          component: () => import("@/components/profil/Profil.vue"),
        },
        {
          path: "reply",
          component: () => import("@/components/reply/Reply.vue"),
        },
        {
          path: "params",
          component: () => import("@/components/params/Params.vue"),
        },
      ],
    },
    {
      path: "/login",
      component: () => import("@/views/Login.vue"),
    },
    {
      path: "/signup",
      component: () => import("@/views/SignUp.vue"),
    },
    {
      path: "/:notfound(.*)*",
      component: () => import("@/views/Notfound.vue"),
    },
  ],
});
