<script setup></script>

<template>
  <router-view> </router-view>
  <notifications position="bottom right" />
</template>

<style lang="scss">
@import "@/assets/style/base.scss";

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
