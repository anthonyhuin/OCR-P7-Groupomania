import { createRouter, createWebHistory } from "vue-router";
import { useUser } from "./shared/stores/userStore";
import { isAuthenticatedGuard, isNotAuthenticatedGuard } from "./shared/guards";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/views/Home.vue"),
      beforeEnter: [isAuthenticatedGuard],
      children: [
        {
          path: "",
          component: () => import("@/components/timeline/Timeline.vue"),
          beforeEnter: [isAuthenticatedGuard],
        },
        {
          path: "profil/:id?",
          component: () => import("@/components/profil/Profil.vue"),
          beforeEnter: [isAuthenticatedGuard],
        },
        {
          path: "params",
          component: () => import("@/components/params/Params.vue"),
          beforeEnter: [isAuthenticatedGuard],
        },
      ],
    },
    {
      path: "/login",
      component: () => import("@/views/Login.vue"),
      beforeEnter: [isNotAuthenticatedGuard],
    },
    {
      path: "/signin",
      component: () => import("@/views/Signin.vue"),
      beforeEnter: [isNotAuthenticatedGuard],
    },
    {
      path: "/:notfound(.*)*",
      component: () => import("@/views/Notfound.vue"),
    },
  ],
});

router.beforeEach(async () => {
  const userStore = useUser();
  if (!userStore.isLoggedIn) {
    await userStore.CurrentUser();
  }
});
