<script setup></script>

<template>
  <Suspense><router-view> </router-view></Suspense>
  <notifications position="bottom right" />
</template>

<style lang="scss">
@import "@/assets/style/base.scss";

.profil_pic {
  height: 40px;
  width: 40px;
  overflow: hidden;
  border-radius: 50%;
  flex-shrink: 0;
  margin: 0;
  object-fit: cover;
}
.vue-notification {
  // styling
  margin: 0 5px 5px;
  padding: 10px;
  font-size: 1rem !important;
  color: #ffffff;

  // default (blue)
  background: var(primary-1) !important;
  border-left: 5px solid var(primary-2) !important;
}
.notification-title {
  font-size: 1.3rem;
}
</style>
