<script setup>
import Nav from "../components/nav/Nav.vue";
import Aside from "../components/aside/Aside.vue";
</script>

<template>
  <Nav />
  <router-view></router-view>
  <Aside />
</template>

<style scoped></style>
