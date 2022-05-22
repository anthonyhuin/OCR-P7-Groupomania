<script setup></script>

<template>
  <Suspense><router-view></router-view></Suspense>
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
}
</style>
