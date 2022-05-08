<script setup>
import Nav from "../components/nav/Nav.vue";
import Aside from "../components/aside/Aside.vue";
</script>

<template>
  <div class="appcontainer">
    <Nav class="nav" />
    <router-view class="content"></router-view>
    <Aside class="aside" />
  </div>
</template>

<style scoped lang="scss">
.appcontainer {
  position: relative;
  padding: 0 20px 0 20px;
  min-height: 100vh;
  max-width: 1040px;
  margin: 20px auto;
  display: grid;
  grid-template-columns: 0.4fr 1fr 0.4fr;
  grid-gap: 16px;
}

.nav {
  position: sticky;
  top: 0;
  padding: 10px;
  height: 70vh;
  align-self: start;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: var(--background-card);
  box-shadow: var(--box-shadow);
  border-radius: var(--border-radius);
  border: var(--border);
  min-height: 500px;
}
.content {
  border-radius: var(--border-radius);
  border-top: 5px solid var(--color-primary);
}
.aside {
  position: sticky;
  top: 0;
  align-self: start;
  height: 70vh;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
